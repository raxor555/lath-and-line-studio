"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ArrowUpRight, Banknote, Check, Minus, Plus, Ruler, Truck } from "lucide-react";
import { ADDONS, needsAddons, pkr, productBySlug, siblings, unitsFor, type Product } from "@/lib/catalog";
import { useCart, useRecent } from "@/lib/cart";
import { reduced, useTweened } from "@/lib/motion";

/* Set to a full international number (e.g. 92XXXXXXXXXX) to turn the WhatsApp buttons into wa.me links. */
export const WHATSAPP_NUMBER = "";
export const whatsapp = (text: string) => (WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}` : "/#visit");

const num = (s: string) => s.replace(/[^0-9.]/g, "");
const noop = () => () => {};

export default function ProductBuy({ p }: { p: Product }) {
  const [qty, setQty] = useState(1);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("2.7");
  const [extras, setExtras] = useState<string[]>([]);
  const [added, setAdded] = useState(false);
  const [stuck, setStuck] = useState(false);
  const buy = useRef<HTMLButtonElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  // the sticky bar lives on document.body (the buy column is sticky, which would trap it under later sections)
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const colours = siblings(p);
  const need = unitsFor(p, parseFloat(width), parseFloat(height));
  const addons = needsAddons(p) ? ADDONS.map(productBySlug).filter((x): x is Product => !!x) : [];
  const extrasTotal = addons.filter((a) => extras.includes(a.slug)).reduce((s, a) => s + a.price, 0);
  const total = p.price * qty + extrasTotal;
  const shown = useTweened(total, 0.6);

  useEffect(() => { useRecent.persist.rehydrate(); useRecent.getState().see(p.slug); }, [p.slug]);

  // the sticky bar comes up once the main button has scrolled away above the screen
  useEffect(() => {
    const el = buy.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!bar.current) return;
    gsap.to(bar.current, { yPercent: stuck ? 0 : 110, y: 0, duration: reduced() ? 0 : 0.7, ease: "expo.out" });
  }, [stuck]);

  const add = () => {
    useCart.getState().addMany([{ slug: p.slug, qty }, ...extras.map((slug) => ({ slug, qty: 1 }))]);
    setAdded(true);
    setExtras([]);
    setTimeout(() => setAdded(false), 1800);
  };
  // the calculated count goes straight into the quantity, so the page shows one price
  const setDims = (nw: string, nh: string) => {
    setWidth(nw); setHeight(nh);
    const n = unitsFor(p, parseFloat(nw), parseFloat(nh));
    if (n) setQty(n.units);
  };
  const toggle = (slug: string) => setExtras((e) => (e.includes(slug) ? e.filter((x) => x !== slug) : [...e, slug]));
  const perMetre = p.cover && p.unit !== "roll" ? p.price / p.cover : null;

  return (
    <div>
      <p className="text-[34px] font-light tabular-nums tracking-[-0.03em]">{pkr(p.price)} <span className="text-[15px] text-muted">/ {p.unit}</span></p>
      {perMetre && <p className="mt-1 text-[13px] text-muted">About {pkr(perMetre)} per metre of wall width, full height.</p>}

      {colours.length > 1 && (
        <div className="mt-8">
          <p className="label text-muted">Colour <span className="ml-2 text-ink">{p.name.split(", ").pop()}</span></p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {colours.map((c) => (
              <Link key={c.slug} href={`/product/${c.slug}`} scroll={false} aria-label={c.name} aria-current={c.slug === p.slug ? "true" : undefined} title={c.name}
                className={`size-12 ring-offset-[3px] ring-offset-bone transition-shadow duration-300 ${c.slug === p.slug ? "ring-1 ring-ink" : "hover:ring-1 hover:ring-ink/35"}`}
                style={{ background: c.swatch, backgroundSize: "cover" }} />
            ))}
          </div>
        </div>
      )}

      {p.cover && (
        <div className="mt-8 border-y border-ink/15 py-5">
          <p className="label text-ink">How many do I need?</p>
          <div className="mt-4 grid grid-cols-2 items-end gap-5">
            {([["Wall width", width, (v: string) => setDims(v, height), "wall-w"], ["Height", height, (v: string) => setDims(width, v), "wall-h"]] as const).map(([label, v, set, id]) => (
              <div key={id} className="relative">
                <label htmlFor={id} className="sr-only">{label} in metres</label>
                <input id={id} inputMode="decimal" value={v} onChange={(e) => set(num(e.target.value))} placeholder={label}
                  className="h-11 w-full border-b border-ink/30 bg-transparent pr-7 text-[17px] tabular-nums outline-none placeholder:text-muted focus:border-ink" />
                <span className="pointer-events-none absolute bottom-3 right-0 text-[13px] text-muted">m</span>
              </div>
            ))}
          </div>
          <p className="mt-3 min-h-[20px] text-[13px] text-muted" aria-live="polite">
            {need ? `${need.units} ${p.unit}s for a ${width} × ${height} m wall, set as your quantity below. We confirm the exact count at the measure.` : "Enter the wall width in metres; the quantity updates to match."}
          </p>
        </div>
      )}

      {addons.length > 0 && (
        <fieldset className="mt-8">
          <legend className="label text-ink">Finish the edges</legend>
          <ul className="mt-3 border-t border-ink/15">
            {addons.map((a) => (
              <li key={a.slug} className="border-b border-ink/15">
                <label className="flex cursor-pointer items-center gap-4 py-3 text-[14px]">
                  <input type="checkbox" checked={extras.includes(a.slug)} onChange={() => toggle(a.slug)} className="size-4 accent-[#1b1612]" />
                  <span className="size-9 shrink-0" style={{ background: a.swatch, backgroundSize: "cover" }} />
                  <span className="flex-1 leading-snug">{a.name}</span>
                  <span className="tabular-nums text-ink-2">+ {pkr(a.price)}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}

      <div className="mt-8 flex gap-3">
        <Stepper qty={qty} setQty={setQty} />
        <button ref={buy} onClick={add} data-magnetic className="label inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-ink text-paper transition-colors duration-300 hover:bg-clay">
          {added ? <><Check className="size-4" /> Added to cart</> : <>Add to cart · <span className="tabular-nums">{pkr(shown)}</span></>}
        </button>
      </div>

      <ul className="mt-6 grid gap-2.5 text-[13px] text-ink-2">
        <li className="flex items-center gap-3"><Banknote className="size-4 shrink-0 text-muted" strokeWidth={1.5} />Cash on delivery, or pay by bank transfer, JazzCash or Easypaisa</li>
        <li className="flex items-center gap-3"><Truck className="size-4 shrink-0 text-muted" strokeWidth={1.5} />Delivered all over Pakistan; the charge shows at checkout</li>
        <li className="flex items-center gap-3"><Ruler className="size-4 shrink-0 text-muted" strokeWidth={1.5} />Free measure and fitting in Karachi</li>
      </ul>

      {WHATSAPP_NUMBER ? (
        <a href={whatsapp(`Assalam o Alaikum, I'd like to order ${qty} × ${p.name}.`)} target="_blank" rel="noreferrer" className="label draw-on mt-7 inline-flex items-center gap-2 py-1 text-ink-2">
          Or order on WhatsApp <ArrowUpRight className="size-3.5" />
        </a>
      ) : (
        <Link href="/#visit" className="label draw-on mt-7 inline-flex items-center gap-2 py-1 text-ink-2">Not sure? Book a free measure <ArrowUpRight className="size-3.5" /></Link>
      )}

      {/* sticky buy bar */}
      {mounted && createPortal(<div ref={bar} aria-hidden={!stuck} inert={!stuck} style={{ transform: "translateY(110%)" }} className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-bone pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center gap-4 px-5 sm:px-10">
          <span className="hidden size-12 shrink-0 sm:block" style={{ background: p.swatch, backgroundSize: "cover" }} />
          <div className="hidden min-w-0 flex-1 sm:block">
            <p className="truncate text-[14px]">{p.name}</p>
            <p className="text-[13px] tabular-nums text-muted">{pkr(p.price)} / {p.unit}</p>
          </div>
          <Stepper qty={qty} setQty={setQty} small />
          <button onClick={add} className="label inline-flex h-12 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-ink px-5 text-paper transition duration-300 hover:bg-clay sm:flex-none sm:px-6">
            {added ? <><Check className="size-4" /> Added</> : <>Add<span className="hidden sm:inline"> to cart</span> · <span className="tabular-nums">{pkr(shown)}</span></>}
          </button>
        </div>
      </div>, document.body)}
    </div>
  );
}

function Stepper({ qty, setQty, small = false }: { qty: number; setQty: (n: number) => void; small?: boolean }) {
  const s = small ? "size-12" : "size-14";
  return (
    <div className={`inline-flex shrink-0 items-center rounded-full border border-ink/25 ${small ? "h-12" : "h-14"}`}>
      <button aria-label="One less" onClick={() => setQty(Math.max(1, qty - 1))} className={`grid ${s} place-items-center`}><Minus className="size-4" strokeWidth={1.5} /></button>
      <span className="w-8 text-center tabular-nums" aria-live="polite">{qty}</span>
      <button aria-label="One more" onClick={() => setQty(qty + 1)} className={`grid ${s} place-items-center`}><Plus className="size-4" strokeWidth={1.5} /></button>
    </div>
  );
}

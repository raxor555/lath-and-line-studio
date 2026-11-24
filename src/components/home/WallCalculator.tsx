"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight, Check, Minus, Plus } from "lucide-react";
import { pkr, productBySlug, unitHeight, unitsFor, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { flyToCart, reduced, useTweened } from "@/lib/motion";

/* the finishes people price a whole wall in */
const FINISHES = [
  "fluted-chalk-white", "fluted-charcoal", "fluted-teak", "louver-walnut", "louver-oak",
  "wpc-slat-natural-oak", "wpc-slat-black", "acoustic-walnut-felt", "uv-marble-statuario", "uv-marble-nero", "wallpaper-linen-stone",
].map(productBySlug).filter((x): x is Product => !!x);

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const round1 = (v: number) => Math.round(v * 10) / 10;
const tile = (p: Product) => p.swatch.match(/url\(([^)]+)\)/)?.[1];

/**
 * Price your wall: width, height and a finish give the count and the price, live, on a drawing of the wall
 * with every panel joint in place. One tap puts that count in the cart.
 */
export default function WallCalculator() {
  const [w, setW] = useState(4.2);
  const [h, setH] = useState(2.7);
  const [pick, setPick] = useState(FINISHES[0].slug);
  const [added, setAdded] = useState(false);
  const p = FINISHES.find((f) => f.slug === pick)!;
  const need = unitsFor(p, w, h);
  const units = need?.units ?? 0;
  const price = useTweened(units * p.price);
  const count = useTweened(units, 0.5);

  const stage = useRef<HTMLDivElement>(null);
  const wall = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const joints = useRef<HTMLDivElement>(null);

  // the drawing keeps the wall's real proportions and resizes smoothly as the numbers change
  useEffect(() => {
    const fit = () => {
      const box = stage.current, el = wall.current;
      if (!box || !el) return;
      const s = Math.min((box.clientWidth - 56) / w, (box.clientHeight - 56) / h);
      gsap.to(el, { width: w * s, height: h * s, duration: first.current || reduced() ? 0 : 0.9, ease: "expo.out" });
      // joints only where a panel is wide enough on screen to read as a panel
      if (joints.current) joints.current.style.opacity = (p.cover ?? 0) * s >= 6 ? "1" : "0";
      first.current = false;
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (stage.current) ro.observe(stage.current);
    return () => ro.disconnect();
  }, [w, h, p.cover]);

  // a new finish wipes across the wall
  useEffect(() => {
    if (!wall.current || reduced()) return;
    gsap.fromTo(wall.current.querySelector(".wall-face"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.inOut" });
  }, [pick]);

  const colPct = p.cover ? (p.cover / w) * 100 : 100;
  const uh = unitHeight(p) ?? h;
  const rowPct = p.unit === "roll" ? 100 : (uh / h) * 100;
  const url = tile(p);
  // rendered swatches show 360 mm of wall; cropped photo swatches (marble, terrazzo) show one sheet
  const rendered = url?.startsWith("/swatches/p/");
  const faceSize = rendered ? `${(0.36 / w) * 100}% 100%` : `${colPct}% ${Math.min(100, rowPct)}%`;

  const add = () => {
    if (!units) return;
    flyToCart(wall.current, p.swatch);
    useCart.getState().add(p.slug, units, false);
    setAdded(true);
    setTimeout(() => { setAdded(false); useCart.getState().setOpen(true); }, 900);
  };

  const field = (label: string, v: number, set: (n: number) => void, min: number, max: number) => (
    <div className="min-w-0 border-b border-white/20 pb-3">
      <p className="label text-white/55">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <button aria-label={`Less ${label.toLowerCase()}`} onClick={() => set(clamp(round1(v - 0.1), min, max))} className="grid size-11 shrink-0 place-items-center rounded-full border border-white/25 transition-colors hover:bg-white hover:text-night"><Minus className="size-4" strokeWidth={1.5} /></button>
        <label className="flex items-baseline gap-1.5">
          <span className="sr-only">{label} in metres</span>
          <input inputMode="decimal" value={v} onChange={(e) => { const n = parseFloat(e.target.value); if (!Number.isNaN(n)) set(clamp(n, min, max)); }}
            className="w-[3.2ch] bg-transparent text-right text-[clamp(2.4rem,4vw,3.4rem)] font-extralight tabular-nums tracking-[-0.04em] outline-none" />
          <span className="text-[15px] text-white/55">m</span>
        </label>
        <button aria-label={`More ${label.toLowerCase()}`} onClick={() => set(clamp(round1(v + 0.1), min, max))} className="grid size-11 shrink-0 place-items-center rounded-full border border-white/25 transition-colors hover:bg-white hover:text-night"><Plus className="size-4" strokeWidth={1.5} /></button>
      </div>
    </div>
  );

  return (
    <section id="price" className="scroll-mt-24 bg-night text-white">
      <div className="mx-auto max-w-[1600px] px-5 py-32 sm:px-10 sm:py-44">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 data-lines className="display max-w-[10ch] text-[clamp(3rem,7.4vw,7.4rem)]">Price your wall</h2>
          <p data-rise className="max-w-[24rem] text-[15px] leading-relaxed text-white/70 lg:pb-3">Put in the size of the wall and pick a finish. You get the count and the price for the panels now; in Karachi the measure and fitting are free.</p>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-20">
          <div data-rise className="grid content-start gap-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {field("Width", w, setW, 0.5, 12)}
              {field("Height", h, setH, 2, 4.5)}
            </div>
            <div>
              <p className="label text-white/55">Finish <span className="ml-2 text-white">{p.name}</span></p>
              <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-11 lg:grid-cols-6">
                {FINISHES.map((f) => (
                  <button key={f.slug} onClick={() => setPick(f.slug)} aria-label={f.name} aria-pressed={f.slug === pick} title={f.name}
                    className={`aspect-square ring-offset-[3px] ring-offset-night transition-[box-shadow,transform] duration-300 ${f.slug === pick ? "ring-1 ring-white" : "hover:scale-[0.94]"}`}
                    style={{ background: f.swatch, backgroundSize: "cover" }} />
                ))}
              </div>
            </div>

            <div className="border-t border-white/15 pt-8">
              <p className="label text-white/55" aria-live="polite">{Math.round(count)} {p.unit}s · {pkr(p.price)} each</p>
              <p className="mt-2 text-[clamp(3rem,5.6vw,5rem)] font-extralight leading-none tabular-nums tracking-[-0.045em]">{pkr(price)}</p>
              <p className="mt-3 text-[13px] text-white/55">Panels only. Trims and adhesive are added in the cart; the measure confirms the exact count.</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-5">
                <button onClick={add} disabled={!units} className="label inline-flex h-[54px] items-center gap-2.5 rounded-full bg-white pl-7 pr-6 text-ink transition duration-300 hover:bg-clay hover:text-white disabled:opacity-40">
                  {added ? <><Check className="size-4" /> Added {units} {p.unit}s</> : <>Add {units} {p.unit}s to cart <ArrowUpRight className="size-4" /></>}
                </button>
                <Link href={`/product/${p.slug}`} className="label draw-on inline-flex items-center gap-2 py-1 text-white/85">See this finish <ArrowUpRight className="size-3.5" /></Link>
              </div>
            </div>
          </div>

          {/* the wall, drawn to scale with its joints and dimension lines */}
          <div ref={stage} data-rise className="relative order-first grid h-[min(46vh,360px)] place-items-center border border-white/12 lg:order-none lg:h-[min(64vh,560px)] lg:min-h-[340px]">
            <div ref={wall} className="relative" style={{ width: 300, height: 200 }}>
              <div className="wall-face absolute inset-0" style={url
                ? { backgroundImage: `url(${url})`, backgroundSize: faceSize, backgroundRepeat: "repeat", backgroundPosition: "0 100%" }
                : { background: p.swatch, backgroundSize: "cover" }} />
              {/* joints */}
              <div ref={joints} aria-hidden className="absolute inset-0 transition-opacity duration-500" style={{
                backgroundImage: `linear-gradient(90deg, var(--joint) 1px, transparent 1px)${rowPct < 100 ? ", linear-gradient(180deg, var(--joint) 1px, transparent 1px)" : ""}`,
                backgroundSize: `${colPct}% 100%${rowPct < 100 ? `, 100% ${rowPct}%` : ""}`, backgroundPosition: "0 0, 0 100%",
              }} />
              {/* soft light from the ceiling, so the drawing reads as a wall */}
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.12),transparent_35%,rgb(0_0_0/0.25))]" />
              <span className="label absolute -top-7 left-0 right-0 flex items-center gap-2 text-white/60">
                <span className="h-px flex-1 bg-white/30" />{w.toFixed(1)} m<span className="h-px flex-1 bg-white/30" />
              </span>
              <span className="label absolute -right-7 bottom-0 top-0 flex flex-col items-center justify-center gap-2 text-white/60 [writing-mode:vertical-rl]">
                <span className="w-px flex-1 bg-white/30" />{h.toFixed(1)} m<span className="w-px flex-1 bg-white/30" />
              </span>
            </div>
            <p className="label absolute bottom-4 left-5 text-white/45">{need ? `${need.cols} across${need.rows > 1 ? ` × ${need.rows} high` : ""}` : ""}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

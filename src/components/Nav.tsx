"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ArrowUpRight, Banknote, Minus, Plus, Ruler, Search, Truck, X } from "lucide-react";
import { ADDONS, CATEGORIES, FEATURED, fromPrice, pkr, productBySlug, type Product } from "@/lib/catalog";
import { cartTotals, useCart } from "@/lib/cart";
import { reduced, useTweened } from "@/lib/motion";
import SearchPanel from "./Search";

const SERVICE = ["Delivery all over Pakistan", "Cash on delivery", "Free measure & fitting in Karachi"];

/* on phones the service line shows one message at a time and rolls to the next */
function ServiceLine({ dark }: { dark: boolean }) {
  const roll = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = roll.current;
    if (!el || reduced()) return;
    const mm = gsap.matchMedia();
    mm.add("(max-width: 639px)", () => {
      const tl = gsap.timeline({ repeat: -1 });
      SERVICE.forEach((_, i) => { if (i) tl.to(el, { yPercent: -100 * i / (SERVICE.length + 1), duration: 0.8, ease: "expo.inOut" }, "+=3"); });
      tl.to(el, { yPercent: -100 * SERVICE.length / (SERVICE.length + 1), duration: 0.8, ease: "expo.inOut" }, "+=3").set(el, { yPercent: 0 });
    });
    return () => mm.revert();
  }, []);
  return (
    <div className={`border-b transition-colors ${dark ? "border-white/12" : "border-ink/10"}`}>
      <div className={`mx-auto flex h-8 max-w-[1600px] items-center justify-center px-5 text-[10.5px] uppercase tracking-[0.2em] sm:px-10 ${dark ? "text-white/70" : "text-ink/60"}`}>
        <span className="h-[14px] overflow-hidden sm:hidden" aria-label={SERVICE.join(". ")}>
          <span ref={roll} aria-hidden className="block">
            {[...SERVICE, SERVICE[0]].map((m, i) => <span key={i} className="block h-[14px] leading-[14px]">{m}</span>)}
          </span>
        </span>
        <p className="hidden items-center gap-5 sm:flex">
          {SERVICE.map((m, i) => <span key={m} className={`items-center gap-5 ${i === 2 ? "hidden md:inline-flex" : "inline-flex"}`}>{i > 0 && <span aria-hidden>·</span>}{m}</span>)}
        </p>
      </div>
    </div>
  );
}

export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 24 24" className="size-[20px]" aria-hidden>
        <rect x="3" y="3" width="3" height="18" rx="1.2" fill={light ? "#F1EFEB" : "#1B1612"} />
        <rect x="10.5" y="3" width="3" height="18" rx="1.2" fill={light ? "#F1EFEB" : "#1B1612"} />
        <rect x="18" y="3" width="3" height="18" rx="1.2" fill="#B25934" />
      </svg>
      <span className="whitespace-nowrap text-[13px] font-normal uppercase tracking-[0.3em]">Lath &amp; Line</span>
    </span>
  );
}

const LINKS: [string, string][] = [["Collections", "/shop"], ["Room ideas", "/#rooms"], ["Fitting", "/#process"]];

export default function Nav() {
  const lenis = useLenis();
  const pathname = usePathname();
  const home = pathname === "/";
  const [hidden, setHidden] = useState(false);
  // on the home page the bar floats, transparent, over the film until the page scrolls past it
  const [overHero, setOverHero] = useState(home);
  const [mega, setMega] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [hover, setHover] = useState(CATEGORIES[0].slug);
  const [search, setSearch] = useState(false);
  const pulse = useCart((s) => s.pulse);
  const countEl = useRef<HTMLSpanElement>(null);
  const cartOpen = useCart((s) => s.open);
  const lines = useCart((s) => s.lines);
  const { count } = cartTotals(lines);
  const last = useRef(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => { useCart.persist.rehydrate(); }, []);

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      setOverHero(home && y < window.innerHeight - 120);
      if (y > 160 && y > last.current + 4) setHidden(true);
      else if (y < last.current - 4 || y < 160) setHidden(false);
      last.current = y;
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [home]);

  useEffect(() => {
    const lock = sheet || cartOpen || search;
    if (lock) lenis?.stop(); else lenis?.start();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSheet(false); useCart.getState().setOpen(false); setMega(false); setSearch(false); }
      // "/" opens search from anywhere except a text field
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) && !t.isContentEditable) { e.preventDefault(); setSearch(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet, cartOpen, search, lenis]);

  // the cart count jumps when something lands in it
  useEffect(() => {
    if (!pulse || !countEl.current || reduced()) return;
    gsap.fromTo(countEl.current, { yPercent: -60, scale: 1.5 }, { yPercent: 0, scale: 1, duration: 0.9, ease: "elastic.out(1,0.45)", delay: 0.75 });
  }, [pulse]);

  const openMega = () => { clearTimeout(closeTimer.current); setMega(true); };
  const closeMega = () => { closeTimer.current = setTimeout(() => setMega(false), 160); };
  const cat = CATEGORIES.find((c) => c.slug === hover)!;
  // three looks: floating over the film, night while the mega menu is open, stone once scrolled
  const dark = mega || overHero;
  const item = `label draw py-1 transition-opacity hover:opacity-100 ${dark ? "opacity-80" : "opacity-75"}`;

  return (
    <>
      <header
        onMouseLeave={closeMega}
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color] duration-500 ease-[var(--ease-out-expo)] ${dark ? "text-white" : "text-ink"} ${hidden && !mega ? "-translate-y-full" : "translate-y-0"} ${
          mega ? "bg-night" : overHero ? "bg-transparent" : "bg-bone/90 backdrop-blur-xl"
        }`}
      >
        <ServiceLine dark={dark} />

        <nav aria-label="Main" className={`border-b transition-colors ${dark ? "border-white/12" : "border-ink/10"}`}>
          <div className="mx-auto grid h-[68px] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-10">
            {/* left: menu on phones, shop links on desktop */}
            <div className="flex items-center gap-8">
              <button aria-label="Open menu" aria-expanded={sheet} onClick={() => setSheet(true)} className="-ml-2 grid size-11 place-items-center lg:hidden">
                <span aria-hidden className="grid w-[22px] gap-[6px]"><span className="h-px bg-current" /><span className="h-px w-3/5 bg-current" /></span>
              </button>
              <button
                className={`${item} hidden items-center gap-2 lg:inline-flex ${mega ? "!opacity-100" : ""}`}
                aria-expanded={mega} aria-haspopup="true" onMouseEnter={openMega} onFocus={openMega} onClick={() => setMega((m) => !m)}
              >
                Shop <span aria-hidden className={`inline-block h-px w-3 bg-current transition-transform duration-500 ${mega ? "scale-x-100" : "scale-x-50"}`} />
              </button>
              {LINKS.map(([l, h]) => <Link key={l} href={h} onMouseEnter={closeMega} className={`${item} hidden lg:inline`}>{l}</Link>)}
            </div>

            <Link href="/" aria-label="Lath and Line home" onMouseEnter={closeMega}><Logo light={dark} /></Link>

            <div className="flex items-center justify-end gap-1 sm:gap-6">
              <button aria-label="Search products" aria-keyshortcuts="/" onClick={() => setSearch(true)} onMouseEnter={closeMega} className="grid size-11 place-items-center opacity-80 transition hover:opacity-100 sm:size-auto"><Search className="size-[17px]" strokeWidth={1.5} /></button>
              <button data-cart-target aria-label={`Open cart, ${count} items`} onClick={() => useCart.getState().setOpen(true)} className={`${item} py-3`}>
                Cart <span ref={countEl} className="inline-block tabular-nums">({count})</span>
              </button>
              <Link href="/#visit" className={`label hidden h-10 items-center gap-2 rounded-full pl-5 pr-4 transition duration-300 md:inline-flex ${dark ? "bg-clay text-white hover:bg-white hover:text-ink" : "bg-ink text-paper hover:bg-clay"}`}>
                Book a measure <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </nav>

        {/* mega menu: big type on the left, the hovered collection's ranges, and its room */}
        <div onMouseEnter={openMega} className={`absolute inset-x-0 top-full hidden overflow-hidden bg-night text-white transition-[clip-path,visibility] duration-700 ease-[var(--ease-out-expo)] lg:block ${mega ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]"}`}>
          <div className="mx-auto grid max-w-[1600px] grid-cols-[1.1fr_1fr_0.8fr] gap-12 px-10 pb-12 pt-10">
            <ul className="border-t border-white/12">
              {CATEGORIES.map((c) => (
                <li key={c.slug} className="border-b border-white/12">
                  <Link href={`/shop/${c.slug}`} onMouseEnter={() => setHover(c.slug)} onFocus={() => setHover(c.slug)} onClick={() => setMega(false)}
                    className={`flex items-baseline justify-between py-3.5 text-[28px] font-extralight uppercase leading-none tracking-[-0.03em] transition-[color,padding] duration-500 ease-[var(--ease-out-expo)] ${hover === c.slug ? "pl-3 text-white" : "text-white/45 hover:text-white/80"}`}>
                    {c.name}<span className="label text-white/40">{c.subs.length}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-1">
              <p className="label text-white/50">{cat.name}</p>
              <ul className="mt-5 grid grid-cols-2 gap-x-8 gap-y-6">
                {cat.subs.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/shop/${cat.slug}/${s.slug}`} onClick={() => setMega(false)} className="block">
                      <span className="draw text-[15px]">{s.name}</span>
                      <span className="mt-1 block text-[13px] leading-snug text-white/55">{s.blurb}</span>
                      <span className="label mt-2 block text-white/75">from {pkr(fromPrice(cat.slug, s.slug))}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/shop/${cat.slug}`} onClick={() => setMega(false)} className="label draw-on mt-9 inline-flex items-center gap-2">All {cat.name} <ArrowUpRight className="size-3.5" /></Link>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              {CATEGORIES.map((c) => (
                <Image key={c.slug} src={c.img} alt="" fill sizes="28vw" className={`object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] ${hover === c.slug ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"}`} />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* mobile menu: full screen, night */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${sheet ? "" : "pointer-events-none"}`} aria-hidden={!sheet}>
        <div data-lenis-prevent className={`absolute inset-0 flex flex-col overflow-y-auto bg-night px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] text-white transition-[clip-path] duration-700 ease-[var(--ease-out-expo)] ${sheet ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"}`}>
          <div className="flex h-[100px] shrink-0 items-end justify-between pb-4">
            <Logo light />
            <button aria-label="Close menu" onClick={() => setSheet(false)} className="-mr-2 grid size-11 place-items-center"><X className="size-5" strokeWidth={1.5} /></button>
          </div>
          <div className="mt-4 border-t border-white/12">
            {CATEGORIES.map((c) => (
              <details key={c.slug} className="group border-b border-white/12">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[24px] font-extralight uppercase tracking-[-0.03em]">
                  {c.name}<Plus className="size-4 shrink-0 transition-transform duration-300 group-open:rotate-45" strokeWidth={1.5} />
                </summary>
                <div className="grid gap-1 pb-5">
                  <Link href={`/shop/${c.slug}`} onClick={() => setSheet(false)} className="label py-2 text-white">All {c.name}</Link>
                  {c.subs.map((s) => (
                    <Link key={s.slug} href={`/shop/${c.slug}/${s.slug}`} onClick={() => setSheet(false)} className="flex justify-between gap-4 py-2 text-[15px] text-white/75">
                      {s.name}<span className="shrink-0 text-white/45">from {pkr(fromPrice(c.slug, s.slug))}</span>
                    </Link>
                  ))}
                </div>
              </details>
            ))}
          </div>
          <div className="mt-8 grid gap-5">
            {LINKS.map(([l, h]) => <Link key={l} href={h} onClick={() => setSheet(false)} className="label text-white/75">{l}</Link>)}
          </div>
          <Link href="/#visit" onClick={() => setSheet(false)} className="label mt-10 inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-clay text-white">Book a free measure <ArrowUpRight className="size-4" /></Link>
        </div>
      </div>

      <CartDrawer />
      <SearchPanel open={search} onClose={() => setSearch(false)} />
      <MobileCartBar show={hidden && count > 0 && !sheet && pathname !== "/checkout" && !pathname.startsWith("/product/")} />
    </>
  );
}

function CartDrawer() {
  const open = useCart((s) => s.open);
  const lines = useCart((s) => s.lines);
  const { setOpen, setQty, remove, add } = useCart.getState();
  const { count, total } = cartTotals(lines);
  const shown = useTweened(total);
  const list = useRef<HTMLUListElement>(null);
  const seen = useRef(0);

  // a newly added line slides in from the right
  useEffect(() => {
    const ul = list.current;
    if (ul?.lastElementChild && lines.length > seen.current && open && !reduced()) gsap.from(ul.lastElementChild, { x: 60, opacity: 0, duration: 0.8, ease: "expo.out", delay: 0.2 });
    seen.current = lines.length;
  }, [lines.length, open]);

  const inCart = new Set(lines.map((l) => l.slug));
  const extras = ADDONS.filter((s) => !inCart.has(s)).map(productBySlug).filter((x): x is Product => !!x).slice(0, 3);
  const close = () => setOpen(false);

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
      <div onClick={close} className={`absolute inset-0 bg-night/50 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside role="dialog" aria-label="Cart" className={`absolute inset-y-0 right-0 flex w-[min(480px,100%)] flex-col bg-bone transition-transform duration-700 ease-[var(--ease-out-expo)] ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex h-[88px] shrink-0 items-end justify-between border-b border-line px-6 pb-5">
          <h2 className="text-[26px] font-extralight uppercase tracking-[-0.03em]">Cart <span className="text-muted tabular-nums">({count})</span></h2>
          <button aria-label="Close cart" onClick={close} className="-mr-2 grid size-11 place-items-center"><X className="size-5" strokeWidth={1.5} /></button>
        </div>
        <div data-lenis-prevent className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <div className="py-10">
              <p className="text-[clamp(1.6rem,4vw,2rem)] font-extralight uppercase leading-tight tracking-[-0.03em]">Your cart is empty.</p>
              <p className="mt-3 text-[14px] text-ink-2">Start with a collection, or one of these finishes.</p>
              <ul className="mt-8 border-t border-line">
                {CATEGORIES.slice(0, 4).map((c) => (
                  <li key={c.slug} className="border-b border-line">
                    <Link href={`/shop/${c.slug}`} onClick={close} className="flex items-center justify-between py-4 text-[15px]">
                      {c.name}<span className="label text-muted">from {pkr(fromPrice(c.slug))}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-10 grid grid-cols-3 gap-3">
                {FEATURED.slice(0, 3).map((p) => (
                  <Link key={p.slug} href={`/product/${p.slug}`} onClick={close} className="group">
                    <span className="block aspect-[4/5] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[0.97]" style={{ background: p.swatch, backgroundSize: "cover" }} />
                    <span className="mt-2 block text-[12px] leading-snug">{p.name}</span>
                    <span className="block text-[12px] tabular-nums text-muted">{pkr(p.price)}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <>
              <ul ref={list}>
                {lines.map((l) => {
                  const p = productBySlug(l.slug); if (!p) return null;
                  return (
                    <li key={l.slug} className="grid grid-cols-[76px_1fr_auto] gap-4 border-b border-line py-5">
                      <span className="size-[76px]" style={{ background: p.swatch, backgroundSize: "cover" }} />
                      <div>
                        <Link href={`/product/${p.slug}`} onClick={close} className="text-[14px] leading-snug">{p.name}</Link>
                        <p className="mt-1 text-[12px] text-muted">{pkr(p.price)} / {p.unit}</p>
                        <div className="mt-3 inline-flex items-center rounded-full border border-line">
                          <button aria-label={`One less ${p.name}`} onClick={() => setQty(l.slug, l.qty - 1)} className="grid size-8 place-items-center"><Minus className="size-3.5" /></button>
                          <span className="w-7 text-center text-[13px] tabular-nums">{l.qty}</span>
                          <button aria-label={`One more ${p.name}`} onClick={() => setQty(l.slug, l.qty + 1)} className="grid size-8 place-items-center"><Plus className="size-3.5" /></button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] tabular-nums">{pkr(p.price * l.qty)}</p>
                        <button onClick={() => remove(l.slug)} className="label mt-2 text-muted hover:text-ink">Remove</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {extras.length > 0 && (
                <div className="py-8">
                  <p className="label text-ink">Finish the job</p>
                  <p className="mt-1.5 text-[13px] text-muted">Trims, adhesive and light for a clean edge.</p>
                  <ul className="mt-4 grid gap-3">
                    {extras.map((x) => (
                      <li key={x.slug} className="flex items-center gap-4">
                        <span className="size-12 shrink-0" style={{ background: x.swatch, backgroundSize: "cover" }} />
                        <span className="min-w-0 flex-1 text-[13px] leading-snug">{x.name}<span className="block tabular-nums text-muted">{pkr(x.price)}</span></span>
                        <button onClick={() => add(x.slug, 1, true)} className="label draw-on shrink-0 py-1">Add +</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
        {lines.length > 0 && (
          <div className="border-t border-line px-6 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-5">
            <div className="flex items-baseline justify-between"><span className="label text-ink-2">Subtotal</span><strong className="text-[26px] font-light tabular-nums tracking-[-0.03em]">{pkr(shown)}</strong></div>
            <ul className="mt-3 grid gap-1.5 text-[12px] text-muted">
              <li className="flex items-center gap-2.5"><Banknote className="size-3.5 shrink-0" strokeWidth={1.5} />Pay cash on delivery, or by transfer, JazzCash or Easypaisa</li>
              <li className="flex items-center gap-2.5"><Truck className="size-3.5 shrink-0" strokeWidth={1.5} />Delivery all over Pakistan, charge shown at checkout</li>
              <li className="flex items-center gap-2.5"><Ruler className="size-3.5 shrink-0" strokeWidth={1.5} />Free measure and fitting in Karachi</li>
            </ul>
            <Link href="/checkout" onClick={close} className="label mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink text-paper transition hover:bg-clay">Checkout · <span className="tabular-nums">{pkr(shown)}</span> <ArrowUpRight className="size-4" /></Link>
            <button onClick={close} className="label draw mx-auto mt-4 block py-1 text-ink-2">Continue shopping</button>
          </div>
        )}
      </aside>
    </div>
  );
}

/* phones: once the nav has slid away, the cart rides along the bottom of the screen */
function MobileCartBar({ show }: { show: boolean }) {
  const lines = useCart((s) => s.lines);
  const { count, total } = cartTotals(lines);
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bar.current) gsap.to(bar.current, { yPercent: show ? 0 : 130, y: 0, duration: reduced() ? 0 : 0.7, ease: "expo.out" });
  }, [show]);
  return (
    <div ref={bar} inert={!show} style={{ transform: "translateY(130%)" }} className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-40 lg:hidden">
      <button data-cart-target onClick={() => useCart.getState().setOpen(true)}
        className="label flex h-14 w-full items-center justify-between rounded-full bg-ink pl-6 pr-2 text-paper">
        <span>Cart <span className="tabular-nums">({count})</span></span>
        <span className="inline-flex h-10 items-center gap-2 rounded-full bg-paper px-5 text-ink"><span className="tabular-nums">{pkr(total)}</span> · Checkout</span>
      </button>
    </div>
  );
}

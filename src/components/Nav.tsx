"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { ArrowUpRight, ChevronDown, Menu, Minus, Plus, Search, ShoppingBag, Truck, X } from "lucide-react";
import { CATEGORIES, fromPrice, pkr, productBySlug } from "@/lib/catalog";
import { cartTotals, useCart } from "@/lib/cart";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-[17px] font-medium tracking-[-0.02em]">
      <svg viewBox="0 0 24 24" className="size-[22px]" aria-hidden>
        <rect x="3" y="3" width="3" height="18" rx="1.2" fill={light ? "#F7F4EF" : "#211813"} />
        <rect x="10.5" y="3" width="3" height="18" rx="1.2" fill={light ? "#F7F4EF" : "#211813"} />
        <rect x="18" y="3" width="3" height="18" rx="1.2" fill="#B95E37" />
      </svg>
      Lath &amp; Line
    </span>
  );
}

export default function Nav() {
  const lenis = useLenis();
  const home = usePathname() === "/";
  const [hidden, setHidden] = useState(false);
  // on the home page the bar floats, transparent, over the film hero until the page scrolls past it
  const [overHero, setOverHero] = useState(home);
  const [mega, setMega] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [hover, setHover] = useState(CATEGORIES[0].slug);
  const cartOpen = useCart((s) => s.open);
  const lines = useCart((s) => s.lines);
  const { count } = cartTotals(lines);
  const last = useRef(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => { useCart.persist.rehydrate(); }, []);

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      setOverHero(home && y < window.innerHeight - 140);
      if (y > 140 && y > last.current + 4) setHidden(true);
      else if (y < last.current - 4 || y < 140) setHidden(false);
      last.current = y;
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [home]);

  useEffect(() => {
    const lock = sheet || cartOpen;
    if (lock) lenis?.stop(); else lenis?.start();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setSheet(false); useCart.getState().setOpen(false); setMega(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet, cartOpen, lenis]);

  const openMega = () => { clearTimeout(closeTimer.current); setMega(true); };
  const closeMega = () => { closeTimer.current = setTimeout(() => setMega(false), 140); };
  const cat = CATEGORIES.find((c) => c.slug === hover)!;
  const clear = overHero && !mega && !sheet;
  const link = `rounded-full px-3.5 py-2 text-[12.5px] uppercase tracking-[0.14em] transition-colors ${clear ? "text-white/85 hover:bg-white/10 hover:text-white" : "text-ink-2 hover:bg-sand/70 hover:text-ink"}`;
  const icon = `grid size-11 place-items-center rounded-full transition ${clear ? "text-white/90 hover:bg-white/10 hover:text-white" : "text-ink-2 hover:bg-sand/70 hover:text-ink"}`;

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-out-soft)] ${hidden && !mega ? "-translate-y-full" : "translate-y-0"}`}>
        {/* announcement bar */}
        <div className={`transition-colors duration-300 ${clear ? "border-b border-white/10 bg-transparent text-white/80" : "bg-ink text-paper"}`}>
          <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-center gap-6 px-4 text-[12.5px] sm:justify-between sm:px-10">
            <p className="inline-flex items-center gap-2"><Truck className="size-3.5 text-clay" /> Delivery all over Pakistan</p>
            <p className={`hidden sm:block ${clear ? "text-white/60" : "text-paper/70"}`}>Cash on delivery · Free measuring &amp; fitting in Karachi</p>
          </div>
        </div>

        <nav aria-label="Main" onMouseLeave={closeMega} className={`relative border-b transition-colors duration-300 ${clear ? "border-white/10 bg-transparent" : "border-line bg-paper/95 backdrop-blur-md"}`}>
          <div className="mx-auto flex h-[64px] max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-10">
            <Link href="/" aria-label="Lath and Line home" className={`shrink-0 transition-colors ${clear ? "text-white" : ""}`}><Logo light={clear} /></Link>

            <div className="hidden items-center gap-0.5 lg:flex">
              <button className={`${link} inline-flex items-center gap-1 ${mega ? "bg-sand/70 text-ink" : ""}`}
                aria-expanded={mega} aria-haspopup="true" onMouseEnter={openMega} onFocus={openMega} onClick={() => setMega((m) => !m)}>
                Shop <ChevronDown className={`size-3.5 transition-transform ${mega ? "rotate-180" : ""}`} />
              </button>
              {CATEGORIES.slice(0, 4).map((c) => <Link key={c.slug} href={`/shop/${c.slug}`} className={link}>{c.short}</Link>)}
            </div>

            <div className="flex items-center gap-1">
              <Link href="/shop" aria-label="Search products" className={icon}><Search className="size-[18px]" /></Link>
              <button aria-label={`Open cart, ${count} items`} onClick={() => useCart.getState().setOpen(true)} className={`relative ${icon}`}>
                <ShoppingBag className="size-[18px]" />
                {count > 0 && <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-clay px-1 text-[10px] font-medium leading-4 text-white">{count}</span>}
              </button>
              <Link href="/#visit" className={`ml-1 hidden h-11 items-center gap-2 rounded-full pl-5 pr-4 text-[12.5px] font-medium uppercase tracking-[0.12em] transition md:inline-flex ${clear ? "bg-white text-ink hover:bg-paper" : "bg-ink text-paper hover:bg-black"}`}>
                Book a measure <ArrowUpRight className="size-4" />
              </Link>
              <button aria-label="Open menu" aria-expanded={sheet} onClick={() => setSheet(true)} className={`grid size-11 place-items-center rounded-[14px] transition lg:hidden ${clear ? "bg-white/15 text-white backdrop-blur-md" : "bg-ink text-paper"}`}><Menu className="size-[18px]" /></button>
            </div>
          </div>

          {/* mega menu: categories on the left, the hovered category's sub-categories on the right */}
          <div onMouseEnter={openMega}
            className={`absolute inset-x-0 top-full border-b border-line bg-paper shadow-[0_30px_60px_-30px_rgb(33_24_19/0.3)] transition-all duration-300 ${mega ? "visible opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
            <div className="mx-auto grid max-w-[1400px] grid-cols-[240px_1fr_300px] gap-8 px-10 py-8">
              <ul className="grid content-start gap-1">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/shop/${c.slug}`} onMouseEnter={() => setHover(c.slug)} onFocus={() => setHover(c.slug)} onClick={() => setMega(false)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-[15px] transition ${hover === c.slug ? "bg-sand/70 text-ink" : "text-ink-2"}`}>
                      {c.name} <span className="font-mono text-[11px] text-muted">{c.subs.length}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div>
                <p className="mb-3 font-mono text-[12px] text-clay">{cat.name}</p>
                <div className="grid grid-cols-3 gap-2">
                  {cat.subs.map((s) => (
                    <Link key={s.slug} href={`/shop/${cat.slug}/${s.slug}`} onClick={() => setMega(false)} className="group rounded-2xl p-3 transition hover:bg-sand/60">
                      <p className="text-[15px] font-medium">{s.name}</p>
                      <p className="mt-1 line-clamp-2 text-[13px] text-muted">{s.blurb}</p>
                      <p className="mt-2 font-mono text-[11px] text-ink-2">from {pkr(fromPrice(cat.slug, s.slug))}</p>
                    </Link>
                  ))}
                </div>
                <Link href={`/shop/${cat.slug}`} onClick={() => setMega(false)} className="mt-4 inline-flex items-center gap-1.5 px-3 text-[14px] font-medium">All {cat.name} <ArrowUpRight className="size-4" /></Link>
              </div>
              <Link href={`/shop/${cat.slug}`} onClick={() => setMega(false)} className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
                <Image src={cat.img} alt="" fill sizes="300px" className="object-cover" />
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* mobile menu */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${sheet ? "" : "pointer-events-none"}`} aria-hidden={!sheet}>
        <div onClick={() => setSheet(false)} className={`absolute inset-0 bg-ink/30 transition-opacity ${sheet ? "opacity-100" : "opacity-0"}`} />
        <div data-lenis-prevent className={`absolute inset-y-0 left-0 flex w-[min(400px,88vw)] flex-col overflow-y-auto bg-paper p-6 transition-transform duration-500 ease-[var(--ease-out-soft)] ${sheet ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between"><Logo /><button aria-label="Close menu" onClick={() => setSheet(false)} className="grid size-11 place-items-center rounded-[14px] bg-ink text-paper"><X className="size-[18px]" /></button></div>
          <div className="mt-6 grid">
            {CATEGORIES.map((c) => (
              <details key={c.slug} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[20px] font-light">{c.name}<ChevronDown className="size-4 transition-transform group-open:rotate-180" /></summary>
                <div className="grid gap-1 pb-4">
                  <Link href={`/shop/${c.slug}`} onClick={() => setSheet(false)} className="py-1.5 text-[15px] font-medium">All {c.name}</Link>
                  {c.subs.map((s) => <Link key={s.slug} href={`/shop/${c.slug}/${s.slug}`} onClick={() => setSheet(false)} className="py-1.5 text-[15px] text-ink-2">{s.name}</Link>)}
                </div>
              </details>
            ))}
          </div>
          <Link href="/#visit" onClick={() => setSheet(false)} className="mt-auto inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-ink text-paper">Book a measure <ArrowUpRight className="size-4" /></Link>
        </div>
      </div>

      <CartDrawer />
    </>
  );
}

function CartDrawer() {
  const open = useCart((s) => s.open);
  const lines = useCart((s) => s.lines);
  const { setOpen, setQty, remove } = useCart.getState();
  const { count, total } = cartTotals(lines);
  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-ink/30 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside role="dialog" aria-label="Cart" className={`absolute bottom-3 right-3 top-3 flex w-[min(440px,calc(100%-24px))] flex-col rounded-[24px] bg-paper shadow-2xl transition-transform duration-500 ease-[var(--ease-out-soft)] ${open ? "translate-x-0" : "translate-x-[110%]"}`}>
        <div className="flex items-center justify-between border-b border-line p-6">
          <h2 className="text-[24px] font-light tracking-[-0.03em]">Your cart <span className="text-muted">({count})</span></h2>
          <button aria-label="Close cart" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full hover:bg-sand"><X className="size-[18px]" /></button>
        </div>
        <div data-lenis-prevent className="flex-1 overflow-y-auto p-6">
          {lines.length === 0 ? (
            <div className="grid h-full place-content-center gap-4 text-center">
              <p className="text-ink-2">Your cart is empty.</p>
              <Link href="/shop" onClick={() => setOpen(false)} className="inline-flex h-12 items-center justify-center rounded-2xl bg-ink px-6 text-paper">Browse the shop</Link>
            </div>
          ) : (
            <ul className="grid gap-5">
              {lines.map((l) => {
                const p = productBySlug(l.slug); if (!p) return null;
                return (
                  <li key={l.slug} className="grid grid-cols-[72px_1fr_auto] gap-4">
                    <span className="size-[72px] rounded-xl border border-line" style={{ background: p.swatch, backgroundSize: "cover" }} />
                    <div>
                      <Link href={`/product/${p.slug}`} onClick={() => setOpen(false)} className="text-[14px] font-medium leading-snug">{p.name}</Link>
                      <p className="font-mono text-[11px] text-muted">{pkr(p.price)} / {p.unit}</p>
                      <div className="mt-2 inline-flex items-center rounded-full border border-line">
                        <button aria-label="One less" onClick={() => setQty(l.slug, l.qty - 1)} className="grid size-8 place-items-center"><Minus className="size-3.5" /></button>
                        <span className="w-7 text-center font-mono text-[13px]">{l.qty}</span>
                        <button aria-label="One more" onClick={() => setQty(l.slug, l.qty + 1)} className="grid size-8 place-items-center"><Plus className="size-3.5" /></button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[13px]">{pkr(p.price * l.qty)}</p>
                      <button onClick={() => remove(l.slug)} className="mt-1 text-[12px] text-muted underline">Remove</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {lines.length > 0 && (
          <div className="border-t border-line p-6">
            <div className="flex items-baseline justify-between"><span className="text-ink-2">Subtotal</span><strong className="text-[26px] font-light tracking-[-0.03em]">{pkr(total)}</strong></div>
            <p className="mt-1 text-[12px] text-muted">Delivery all over Pakistan, calculated at checkout. Fitting in Karachi is free.</p>
            <Link href="/checkout" onClick={() => setOpen(false)} className="mt-4 inline-flex h-13 w-full items-center justify-center rounded-2xl bg-ink py-4 text-paper">Checkout</Link>
          </div>
        )}
      </aside>
    </div>
  );
}

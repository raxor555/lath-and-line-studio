"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, ArrowUpRight, Banknote, Hammer, Ruler, Truck } from "lucide-react";
import { CATEGORIES, FEATURED, fromPrice, pkr, productsIn } from "@/lib/catalog";
import { reduced } from "@/lib/motion";
import ProductCard from "@/components/shop/ProductCard";

/** The collections as an index of huge type. On desktop the hovered collection's room follows the cursor. */
export function CollectionIndex() {
  const root = useRef<HTMLElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);

  const move = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = float.current, box = root.current;
    if (!el || !box || e.pointerType !== "mouse") return;
    move.current ??= { x: gsap.quickTo(el, "x", { duration: 0.6, ease: "expo.out" }), y: gsap.quickTo(el, "y", { duration: 0.6, ease: "expo.out" }) };
    const r = box.getBoundingClientRect();
    move.current.x(e.clientX - r.left);
    move.current.y(e.clientY - r.top);
  };
  const show = (slug: string | null) => {
    setActive(slug);
    if (float.current) gsap.to(float.current, { scale: slug ? 1 : 0.6, opacity: slug ? 1 : 0, duration: 0.6, ease: "expo.out", overwrite: "auto" });
  };

  return (
    <section ref={root} id="collections" onPointerMove={onMove} className="relative mx-auto max-w-[1600px] px-5 pb-32 pt-28 sm:px-10 sm:pt-36">
      <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 data-lines className="display text-[clamp(3.2rem,9vw,8.5rem)]">Collections</h2>
        <div data-rise className="max-w-[24rem] lg:pb-3">
          <p className="text-[16px] leading-relaxed text-ink-2">Six families of wall finish, every one cut, delivered and fitted by the same team.</p>
          <Link href="/shop" className="label draw-on mt-5 inline-flex items-center gap-2">Shop everything <ArrowUpRight className="size-3.5" /></Link>
        </div>
      </div>

      <ul onPointerLeave={() => show(null)} className="group/list border-t border-ink/15">
        {CATEGORIES.map((c) => (
          <li key={c.slug} data-rise className="border-b border-ink/15">
            <Link
              href={`/shop/${c.slug}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && show(c.slug)}
              onFocus={() => setActive(c.slug)}
              className="flex items-center gap-5 py-5 transition-[opacity,padding] duration-500 ease-[var(--ease-out-expo)] sm:py-6 lg:group-hover/list:opacity-35 lg:hover:!opacity-100 lg:hover:pl-6"
            >
              <span className="relative size-16 shrink-0 overflow-hidden sm:hidden"><Image src={c.img} alt="" fill sizes="64px" className="object-cover" /></span>
              <span className="min-w-0 flex-1 text-[clamp(1.6rem,5.2vw,5.4rem)] font-extralight uppercase leading-[0.95] tracking-[-0.04em]">{c.name}</span>
              <span className="hidden shrink-0 text-right sm:block">
                <span className="label block text-muted">{c.subs.length} ranges</span>
                <span className="label mt-1.5 block">from {pkr(fromPrice(c.slug))}</span>
              </span>
              <ArrowUpRight className="hidden size-6 shrink-0 sm:block" strokeWidth={1.25} />
            </Link>
          </li>
        ))}
      </ul>

      {/* the room that follows the cursor */}
      <div ref={float} aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 hidden h-[400px] w-[320px] -translate-x-1/2 -translate-y-1/2 scale-[0.6] overflow-hidden opacity-0 lg:block">
        {CATEGORIES.map((c) => (
          <Image key={c.slug} src={c.img} alt="" fill sizes="320px" className={`object-cover transition-opacity duration-500 ${active === c.slug ? "opacity-100" : "opacity-0"}`} />
        ))}
      </div>
    </section>
  );
}


/** What every order comes with, straight under the film. Only things the store actually offers. */
export function Promises() {
  const items: [typeof Truck, string][] = [
    [Truck, "Delivered all over Pakistan"],
    [Banknote, "Cash on delivery"],
    [Ruler, "Free measure in Karachi"],
    [Hammer, "Most walls fitted in a day"],
  ];
  return (
    <div className="border-b border-ink/10">
      <ul className="no-scrollbar mx-auto flex max-w-[1600px] gap-10 overflow-x-auto px-5 py-5 sm:px-10 lg:justify-between">
        {items.map(([Icon, t]) => (
          <li key={t} className="label inline-flex shrink-0 items-center gap-3 text-ink-2"><Icon className="size-4 text-muted" strokeWidth={1.5} />{t}</li>
        ))}
      </ul>
    </div>
  );
}

const SHELVES = [{ key: "featured", label: "Featured" }, ...CATEGORIES.map((c) => ({ key: c.slug, label: c.short }))];

/** A shelf of finishes, one tab per collection, that scrolls sideways. Every card has quick add. */
export function Shelf() {
  const [tab, setTab] = useState("featured");
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const items = tab === "featured" ? FEATURED : productsIn(tab);
  const cat = CATEGORIES.find((c) => c.slug === tab);

  // a new tab's cards arrive from the right as a wave
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    if (bar.current) gsap.set(bar.current, { scaleX: Math.min(1, el.clientWidth / el.scrollWidth) });
    if (!reduced()) gsap.fromTo(el.children, { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.05, overwrite: true });
  }, [tab]);

  const onScroll = () => {
    const el = track.current;
    if (!el || !bar.current) return;
    const seen = (el.scrollLeft + el.clientWidth) / el.scrollWidth;
    gsap.to(bar.current, { scaleX: Math.min(1, seen), duration: 0.4, ease: "expo.out", overwrite: true });
  };
  const step = (dir: number) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: reduced() ? "auto" : "smooth" });
  };

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 data-lines className="display text-[clamp(2.8rem,6.4vw,6rem)]">Shop the range</h2>
          <div className="hidden items-center gap-3 sm:flex">
            <button aria-label="Scroll back" onClick={() => step(-1)} className="grid size-12 place-items-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-paper"><ArrowLeft className="size-4" strokeWidth={1.5} /></button>
            <button aria-label="Scroll on" onClick={() => step(1)} className="grid size-12 place-items-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-paper"><ArrowRight className="size-4" strokeWidth={1.5} /></button>
          </div>
        </div>
        <div role="tablist" aria-label="Collections" className="no-scrollbar -mx-5 mt-10 flex gap-8 overflow-x-auto border-b border-ink/15 px-5 sm:mx-0 sm:px-0">
          {SHELVES.map((t) => (
            <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}
              className={`group relative shrink-0 py-5 transition-colors ${tab === t.key ? "text-ink" : "text-muted hover:text-ink"}`}>
              <span className="label">{t.label}</span>
              <span aria-hidden className={`absolute inset-x-0 -bottom-px h-px origin-left bg-ink transition-transform duration-500 ease-[var(--ease-out-expo)] ${tab === t.key ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
            </button>
          ))}
        </div>
      </div>

      {/* the track runs edge to edge but its first card lines up with the 1600px container */}
      <div ref={track} onScroll={onScroll} data-lenis-prevent-touch
        style={{ paddingInline: "max(var(--g), calc((100% - 1600px) / 2 + var(--g)))", scrollPaddingInline: "max(var(--g), calc((100% - 1600px) / 2 + var(--g)))" }}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto [--g:20px] sm:[--g:40px]">
        {items.map((p) => (
          <div key={p.slug} className="w-[62vw] shrink-0 snap-start sm:w-[38vw] md:w-[29vw] lg:w-[min(22vw,340px)]"><ProductCard p={p} rise={false} /></div>
        ))}
        <Link href={cat ? `/shop/${cat.slug}` : "/shop"} className="group flex w-[62vw] shrink-0 snap-start flex-col justify-between border-l border-ink/15 pl-6 sm:w-[38vw] md:w-[29vw] lg:w-[min(22vw,340px)]">
          <span className="text-[clamp(1.6rem,2.6vw,2.4rem)] font-extralight uppercase leading-[0.95] tracking-[-0.03em]">{cat ? `All ${cat.name}` : "Every product"}</span>
          <span className="label draw-on inline-flex w-max items-center gap-2">{cat ? `from ${pkr(fromPrice(cat.slug))}` : "Shop all"} <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
        </Link>
      </div>
      <div className="mx-auto mt-8 max-w-[1600px] px-5 sm:px-10">
        <div className="h-px bg-ink/15"><div ref={bar} className="h-px origin-left bg-ink" /></div>
      </div>
    </section>
  );
}

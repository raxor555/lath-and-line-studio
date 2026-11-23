"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import { BESTSELLERS, CATEGORIES, fromPrice, pkr } from "@/lib/catalog";
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

export function Bestsellers() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-32 sm:px-10">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <h2 data-lines className="display text-[clamp(2.8rem,6.4vw,6rem)]">Featured finishes</h2>
        <Link href="/shop" className="label draw-on inline-flex items-center gap-2">Shop all products <ArrowUpRight className="size-3.5" /></Link>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-4">
        {BESTSELLERS.slice(0, 4).map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
    </section>
  );
}

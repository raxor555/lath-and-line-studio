"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight, Search as SearchIcon, X } from "lucide-react";
import { CATEGORIES, PRODUCTS, categoryBySlug, pkr } from "@/lib/catalog";
import { reduced } from "@/lib/motion";

const SUGGEST = ["Fluted", "Walnut", "Marble", "Acoustic", "Jaali", "Black", "Outdoor"];

/* every word typed must appear somewhere in the product's name, range, material or colour */
const haystack = PRODUCTS.map((p) => {
  const c = categoryBySlug(p.category)!, s = c.subs.find((x) => x.slug === p.sub)!;
  return { p, sub: s.name, text: `${p.name} ${c.name} ${c.short} ${s.name} ${p.material} ${p.colour}`.toLowerCase() };
});

export default function Search({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return haystack.filter((h) => words.every((w) => h.text.includes(w))).slice(0, 8);
  }, [q]);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    gsap.to(el, { clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)", duration: reduced() ? 0 : 0.8, ease: "expo.inOut" });
    if (open) setTimeout(() => input.current?.focus(), 80);
  }, [open]);

  // results arrive as a short wave
  useEffect(() => {
    if (!list.current || reduced()) return;
    gsap.fromTo(list.current.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.035, overwrite: true });
  }, [results]);

  const close = () => { onClose(); setQ(""); setActive(0); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    if (!results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % results.length); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + results.length) % results.length); }
    if (e.key === "Enter") { e.preventDefault(); router.push(`/product/${results[active].p.slug}`); close(); }
  };

  return (
    <div ref={panel} role="dialog" aria-modal="true" aria-label="Search products" inert={!open} data-lenis-prevent
      className="fixed inset-0 z-[80] overflow-y-auto bg-night text-white [clip-path:inset(0%_0%_100%_0%)]">
      <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-6 sm:px-10 sm:pt-10">
        <div className="flex justify-end">
          <button aria-label="Close search" onClick={close} className="-mr-2 grid size-11 place-items-center"><X className="size-5" strokeWidth={1.5} /></button>
        </div>
        <label className="mt-6 flex items-center gap-4 border-b border-white/25 pb-4 focus-within:border-white sm:mt-10">
          <SearchIcon className="size-6 shrink-0 text-white/60 sm:size-8" strokeWidth={1.25} />
          <span className="sr-only">Search the store</span>
          <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKey}
            placeholder="Search panels, colours, materials"
            role="combobox" aria-expanded={results.length > 0} aria-controls="search-results" aria-activedescendant={results.length ? `sr-${active}` : undefined}
            className="w-full bg-transparent text-[clamp(1.6rem,4.4vw,4rem)] font-extralight uppercase tracking-[-0.03em] outline-none placeholder:text-white/30 focus-visible:outline-none" />
        </label>

        {q.trim() === "" ? (
          <div className="mt-12 grid gap-14 md:grid-cols-2">
            <div>
              <p className="label text-white/50">Popular searches</p>
              <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-4">
                {SUGGEST.map((s) => <li key={s}><button onClick={() => { setQ(s); input.current?.focus(); }} className="label draw text-white/85 hover:text-white">{s}</button></li>)}
              </ul>
            </div>
            <div>
              <p className="label text-white/50">Collections</p>
              <ul className="mt-5 grid gap-3">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}><Link href={`/shop/${c.slug}`} onClick={close} className="text-[22px] font-extralight uppercase tracking-[-0.02em] text-white/75 transition-colors hover:text-white">{c.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        ) : results.length ? (
          <>
            <p className="label mt-10 text-white/50" aria-live="polite">{results.length} result{results.length === 1 ? "" : "s"}</p>
            <ul ref={list} id="search-results" role="listbox" className="mt-5 grid border-t border-white/12 md:grid-cols-2 md:gap-x-10">
              {results.map(({ p, sub }, i) => (
                <li key={p.slug} id={`sr-${i}`} role="option" aria-selected={i === active} className="border-b border-white/12">
                  <Link href={`/product/${p.slug}`} onClick={close} onMouseEnter={() => setActive(i)}
                    className={`flex items-center gap-5 py-4 transition-[padding,color] duration-500 ease-[var(--ease-out-expo)] ${i === active ? "pl-3 text-white" : "text-white/75"}`}>
                    <span className="size-16 shrink-0" style={{ background: p.swatch, backgroundSize: "cover" }} />
                    <span className="min-w-0 flex-1">
                      <span className="label block text-[10.5px] text-white/50">{sub}</span>
                      <span className="mt-1 block text-[16px] leading-snug">{p.name}</span>
                    </span>
                    <span className="shrink-0 text-[14px] tabular-nums">{pkr(p.price)}<span className="text-white/50"> / {p.unit}</span></span>
                    <ArrowUpRight className="hidden size-4 shrink-0 sm:block" strokeWidth={1.5} />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-12 max-w-[34rem] text-[16px] leading-relaxed text-white/70">
            Nothing matches &ldquo;{q}&rdquo;. Try a material (PVC, WPC, marble), a colour, or <Link href="/shop" onClick={close} className="draw-on text-white">browse every product</Link>.
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import type { Product } from "@/lib/catalog";
import { reduced } from "@/lib/motion";
import ProductCard from "./ProductCard";

gsap.registerPlugin(Flip);

const SORTS = { featured: "Featured", low: "Price, low to high", high: "Price, high to low" } as const;

export default function ProductGrid({ products }: { products: Product[] }) {
  const colours = useMemo(() => [...new Set(products.map((p) => p.colour))].sort(), [products]);
  const [colour, setColour] = useState<string | null>(null);
  const [sort, setSort] = useState<keyof typeof SORTS>("featured");
  const grid = useRef<HTMLDivElement>(null);
  const flip = useRef<Flip.FlipState | null>(null);

  const list = useMemo(() => {
    const l = products.filter((p) => !colour || p.colour === colour);
    if (sort === "low") l.sort((a, b) => a.price - b.price);
    if (sort === "high") l.sort((a, b) => b.price - a.price);
    return l;
  }, [products, colour, sort]);

  // remember where every card was, change the list, then glide the cards to their new places
  const capture = () => { if (grid.current && !reduced()) flip.current = Flip.getState(grid.current.querySelectorAll("[data-flip-id]")); };
  const pick = (c: string | null) => { capture(); setColour(c); };

  useLayoutEffect(() => {
    const state = flip.current;
    if (!state || !grid.current) return;
    flip.current = null;
    const cards = grid.current.querySelectorAll<HTMLElement>("[data-flip-id]");
    gsap.set(cards, { opacity: 1, y: 0 });
    Flip.from(state, {
      targets: cards, duration: 0.8, ease: "expo.out", stagger: 0.03, absolute: false,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.05 }),
    });
  }, [list]);

  const opt = (on: boolean) => `label shrink-0 py-1 transition-colors ${on ? "text-ink draw-on" : "text-muted hover:text-ink"}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-ink/10 py-5">
        <div className="no-scrollbar -mx-5 flex items-center gap-6 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <span className="label shrink-0 text-muted">Colour</span>
          <button className={opt(!colour)} aria-pressed={!colour} onClick={() => pick(null)}>All</button>
          {colours.map((c) => <button key={c} className={opt(colour === c)} aria-pressed={colour === c} onClick={() => pick(colour === c ? null : c)}>{c}</button>)}
        </div>
        <div className="flex items-center gap-6">
          <p className="label tabular-nums text-muted" aria-live="polite">{list.length} of {products.length}</p>
          <label className="label flex items-center gap-3 text-muted">
            Sort
            <select value={sort} onChange={(e) => { capture(); setSort(e.target.value as keyof typeof SORTS); }}
              className="label cursor-pointer appearance-none border-b border-ink/30 bg-transparent py-1 pr-1 text-ink outline-none focus:border-ink">
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        </div>
      </div>
      {list.length ? (
        <div ref={grid} className="mt-10 grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      ) : (
        <p className="py-24 text-center text-ink-2">Nothing matches that colour. <button className="draw-on" onClick={() => pick(null)}>Show all colours</button></p>
      )}
    </div>
  );
}

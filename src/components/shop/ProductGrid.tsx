"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/catalog";
import ProductCard from "./ProductCard";

const SORTS = { featured: "Featured", low: "Price, low to high", high: "Price, high to low" } as const;

export default function ProductGrid({ products }: { products: Product[] }) {
  const colours = useMemo(() => [...new Set(products.map((p) => p.colour))].sort(), [products]);
  const [colour, setColour] = useState<string | null>(null);
  const [sort, setSort] = useState<keyof typeof SORTS>("featured");

  const list = useMemo(() => {
    const l = products.filter((p) => !colour || p.colour === colour);
    if (sort === "low") l.sort((a, b) => a.price - b.price);
    if (sort === "high") l.sort((a, b) => b.price - a.price);
    return l;
  }, [products, colour, sort]);

  const opt = (on: boolean) => `label shrink-0 py-1 transition-colors ${on ? "text-ink draw-on" : "text-muted hover:text-ink"}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-ink/10 py-5">
        <div className="no-scrollbar -mx-5 flex items-center gap-6 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <span className="label shrink-0 text-muted">Colour</span>
          <button className={opt(!colour)} aria-pressed={!colour} onClick={() => setColour(null)}>All</button>
          {colours.map((c) => <button key={c} className={opt(colour === c)} aria-pressed={colour === c} onClick={() => setColour(colour === c ? null : c)}>{c}</button>)}
        </div>
        <label className="label flex items-center gap-3 text-muted">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)}
            className="label cursor-pointer appearance-none border-b border-ink/30 bg-transparent py-1 pr-1 text-ink outline-none focus:border-ink">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </div>
      {list.length ? (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      ) : (
        <p className="py-24 text-center text-ink-2">Nothing matches that colour. <button className="draw-on" onClick={() => setColour(null)}>Show all colours</button></p>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/lib/catalog";
import ProductCard from "./ProductCard";

const SORTS = { featured: "Featured", low: "Price: low to high", high: "Price: high to low" } as const;

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

  const chip = (on: boolean) => `h-9 shrink-0 rounded-full border px-3.5 text-[13px] transition ${on ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-2 hover:border-ink-2"}`;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
          <SlidersHorizontal className="mr-1 size-4 shrink-0 text-muted" />
          <button className={chip(!colour)} onClick={() => setColour(null)}>All colours</button>
          {colours.map((c) => <button key={c} className={chip(colour === c)} onClick={() => setColour(colour === c ? null : c)}>{c}</button>)}
        </div>
        <label className="flex items-center gap-2 text-[13px] text-muted">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} className="h-9 rounded-full border border-line bg-paper px-3 text-ink">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </div>
      <p className="mb-5 text-[13px] text-muted">{list.length} product{list.length === 1 ? "" : "s"}</p>
      {list.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      ) : (
        <p className="py-20 text-center text-ink-2">Nothing matches those filters. <button className="underline" onClick={() => { setColour(null); }}>Clear filters</button></p>
      )}
    </div>
  );
}

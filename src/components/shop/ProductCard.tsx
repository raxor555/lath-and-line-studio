"use client";

import Image from "next/image";
import Link from "next/link";
import { categoryBySlug, pkr, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

/** The product's own finish fills the frame; on hover it shows the room the finish is used in. */
export default function ProductCard({ p }: { p: Product }) {
  const sub = categoryBySlug(p.category)?.subs.find((s) => s.slug === p.sub);
  return (
    <article data-rise className="group">
      <Link href={`/product/${p.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-sand">
          {/* the finish itself, rendered from real texture photography */}
          <span aria-hidden className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]" style={{ background: p.swatch, backgroundSize: "cover" }} />
          {/* the room it goes in, on hover */}
          {sub && <Image src={sub.img} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover opacity-0 transition-opacity duration-700 ease-[var(--ease-out-expo)] group-hover:opacity-100" />}
        </div>
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <Link href={`/product/${p.slug}`} className="min-w-0">
          <p className="label text-[10.5px] text-muted">{sub?.name}</p>
          <h3 className="mt-1.5 text-[15px] leading-snug">{p.name}</h3>
          <p className="mt-1 text-[14px] tabular-nums">{pkr(p.price)} <span className="text-muted">/ {p.unit}</span></p>
        </Link>
        <button onClick={() => useCart.getState().add(p.slug)} aria-label={`Add ${p.name} to cart`} className="label draw mt-0.5 shrink-0 py-1 text-ink-2 hover:text-ink">
          Add +
        </button>
      </div>
    </article>
  );
}

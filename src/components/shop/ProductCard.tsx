"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { categoryBySlug, pkr, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

/** Room photo for the sub-category, with the product's own colour as a swatch that takes over on hover. */
export default function ProductCard({ p }: { p: Product }) {
  const sub = categoryBySlug(p.category)?.subs.find((s) => s.slug === p.sub);
  return (
    <article className="group relative">
      <Link href={`/product/${p.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-sand">
          {sub && <Image src={sub.img} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]" />}
          {/* the product's own finish, shown as a large chip that grows on hover */}
          <span className="absolute bottom-3 left-3 size-14 rounded-xl border-2 border-white shadow-lg transition-all duration-500 ease-[var(--ease-out-soft)] group-hover:size-24"
            style={{ background: p.swatch, backgroundSize: "cover" }} />
          {p.badge && <span className="absolute left-3 top-3 rounded-full bg-paper px-2.5 py-1 text-[11px] font-medium">{p.badge}</span>}
        </div>
        <div className="mt-3 px-1">
          <p className="font-mono text-[11px] text-muted">{sub?.name}</p>
          <h3 className="mt-0.5 text-[15px] font-medium leading-snug">{p.name}</h3>
          <p className="mt-1 text-[14px]"><span className="font-medium">{pkr(p.price)}</span> <span className="text-muted">/ {p.unit}</span></p>
        </div>
      </Link>
      <button onClick={() => useCart.getState().add(p.slug)} aria-label={`Add ${p.name} to cart`}
        className="absolute bottom-[86px] right-3 grid size-10 place-items-center rounded-full bg-paper text-ink opacity-100 shadow-md transition hover:bg-ink hover:text-paper lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
        <Plus className="size-4" />
      </button>
    </article>
  );
}

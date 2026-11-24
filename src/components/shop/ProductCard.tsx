"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import { categoryBySlug, pkr, siblings, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { flyToCart } from "@/lib/motion";

/** The product's own finish fills the frame; on hover the room it goes in fades in and quick add slides up. */
export default function ProductCard({ p, rise = true }: { p: Product; rise?: boolean }) {
  const sub = categoryBySlug(p.category)?.subs.find((s) => s.slug === p.sub);
  const others = siblings(p);
  const frame = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);

  const quickAdd = () => {
    flyToCart(frame.current, p.swatch);
    useCart.getState().add(p.slug, 1, false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article data-rise={rise ? "" : undefined} data-flip-id={p.slug} className="group">
      <div ref={frame} className="relative aspect-[4/5] overflow-hidden bg-sand">
        <Link href={`/product/${p.slug}`} aria-label={p.name} className="absolute inset-0">
          {/* the finish itself, rendered from real texture photography */}
          <span aria-hidden className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]" style={{ background: p.swatch, backgroundSize: "cover" }} />
          {/* the room it goes in, on hover */}
          {sub && <Image src={sub.img} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover opacity-0 transition-opacity duration-700 ease-[var(--ease-out-expo)] group-hover:opacity-100" />}
        </Link>

        {/* quick add: a bar that slides up on hover; a round button that is always there on touch screens */}
        <button
          onClick={quickAdd}
          aria-label={`Add ${p.name} to cart`}
          className={`label absolute inset-x-3 bottom-3 hidden h-12 items-center justify-center gap-2 rounded-full bg-paper text-ink transition-[transform,opacity,background-color,color] duration-500 ease-[var(--ease-out-expo)] hover:bg-ink hover:text-paper [@media(hover:hover)]:flex ${added ? "translate-y-0 opacity-100" : "translate-y-[calc(100%+12px)] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"}`}
        >
          {added ? <><Check className="size-4" strokeWidth={1.5} /> Added</> : <>Quick add <span className="tabular-nums">· {pkr(p.price)}</span></>}
        </button>
        <button
          onClick={quickAdd}
          aria-label={`Add ${p.name} to cart`}
          className="absolute bottom-2.5 right-2.5 grid size-10 place-items-center rounded-full bg-paper text-ink transition-colors active:bg-ink active:text-paper [@media(hover:hover)]:hidden"
        >
          {added ? <Check className="size-4" strokeWidth={1.5} /> : <Plus className="size-4" strokeWidth={1.5} />}
        </button>
      </div>

      <Link href={`/product/${p.slug}`} className="mt-4 block">
        <p className="label text-[10.5px] text-muted">{sub?.name}</p>
        <h3 className="mt-1.5 text-[15px] leading-snug">{p.name}</h3>
        <p className="mt-1 text-[15px] tabular-nums">{pkr(p.price)} <span className="text-[13px] text-muted">/ {p.unit}</span></p>
      </Link>
      {others.length > 1 && (
        <div className="mt-3 flex items-center gap-1.5">
          {others.slice(0, 5).map((o) => (
            <Link key={o.slug} href={`/product/${o.slug}`} aria-label={o.name} title={o.name}
              className={`size-[18px] ring-offset-2 ring-offset-bone transition-shadow ${o.slug === p.slug ? "ring-1 ring-ink" : "hover:ring-1 hover:ring-ink/40"}`}
              style={{ background: o.swatch, backgroundSize: "cover" }} />
          ))}
          <span className="label ml-1.5 text-[10.5px] text-muted">{others.length} colours</span>
        </div>
      )}
    </article>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BESTSELLERS, CATEGORIES, fromPrice, pkr } from "@/lib/catalog";
import ProductCard from "@/components/shop/ProductCard";

export function CategoryTiles() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-10">
      <div className="mb-8 flex items-end justify-between gap-6">
        <h2 className="text-[clamp(2rem,3.6vw,3.4rem)] font-light leading-none tracking-[-0.04em]">Shop by category</h2>
        <Link href="/shop" className="hidden items-center gap-1.5 text-[14px] font-medium sm:inline-flex">View all <ArrowRight className="size-4" /></Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/shop/${c.slug}`} className="group">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-sand">
              <Image src={c.img} alt="" fill sizes="(min-width:1024px) 16vw, 50vw" className="object-cover transition duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.05]" />
            </div>
            <p className="mt-3 text-[15px] font-medium">{c.name}</p>
            <p className="font-mono text-[11px] text-muted">{c.subs.length} types · from {pkr(fromPrice(c.slug))}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** The six PVC profiles, since PVC is the biggest category. */
export function PvcRange() {
  const pvc = CATEGORIES[0];
  return (
    <section className="bg-paper py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
        <div className="mb-10 grid gap-4 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="font-mono text-[12px] text-clay">Inside PVC Panels</p>
            <h2 className="mt-3 text-[clamp(2rem,3.6vw,3.4rem)] font-light leading-[1] tracking-[-0.04em]">Six profiles, one fitting system.</h2>
          </div>
          <p className="max-w-[30rem] text-ink-2 lg:justify-self-end">{pvc.blurb}</p>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
          {pvc.subs.map((s) => (
            <Link key={s.slug} href={`/shop/${pvc.slug}/${s.slug}`} className="group w-[62vw] shrink-0 sm:w-auto">
              <div className="relative aspect-square overflow-hidden rounded-[20px] bg-sand">
                <Image src={s.img} alt="" fill sizes="(min-width:1024px) 16vw, 62vw" className="object-cover transition duration-700 group-hover:scale-[1.05]" />
              </div>
              <p className="mt-3 text-[15px] font-medium">{s.name}</p>
              <p className="font-mono text-[11px] text-muted">from {pkr(fromPrice(pvc.slug, s.slug))}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Bestsellers() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-24 sm:px-10">
      <div className="mb-8 flex items-end justify-between gap-6">
        <h2 className="text-[clamp(2rem,3.6vw,3.4rem)] font-light leading-none tracking-[-0.04em]">Bestsellers</h2>
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-[14px] font-medium">Shop all <ArrowRight className="size-4" /></Link>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4">{BESTSELLERS.slice(0, 4).map((p) => <ProductCard key={p.slug} p={p} />)}</div>
    </section>
  );
}

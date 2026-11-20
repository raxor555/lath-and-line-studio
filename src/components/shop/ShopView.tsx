import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORIES, fromPrice, pkr, productsIn, type Category, type Sub } from "@/lib/catalog";
import ProductGrid from "./ProductGrid";

export function Crumbs({ items }: { items: [string, string?][] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
      {items.map(([label, href], i) => (
        <span key={label} className="inline-flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="size-3.5" />}
          {href ? <Link href={href} className="hover:text-ink">{label}</Link> : <span className="text-ink">{label}</span>}
        </span>
      ))}
    </nav>
  );
}

/** Listing page for the whole shop, one category, or one sub-category. */
export default function ShopView({ cat, sub }: { cat?: Category; sub?: Sub }) {
  const title = sub?.name ?? cat?.name ?? "Shop all";
  const blurb = sub?.blurb ?? cat?.blurb ?? "Wall panels, slats, marble sheets, jaali and everything to fit them. Delivered all over Pakistan.";
  const img = sub?.img ?? cat?.img;
  const crumbs: [string, string?][] = [["Home", "/"], ["Shop", cat ? "/shop" : undefined]];
  if (cat) crumbs.push([cat.name, sub ? `/shop/${cat.slug}` : undefined]);
  if (sub) crumbs.push([sub.name]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-32 pt-[132px] sm:px-10">
      <Crumbs items={crumbs} />
      <header className="mt-6 grid items-end gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h1 className="text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-[0.98] tracking-[-0.045em]">{title}</h1>
          <p className="mt-4 max-w-[34rem] text-[17px] text-ink-2">{blurb}</p>
        </div>
        {img && (
          <div className="relative hidden aspect-[16/7] overflow-hidden rounded-[24px] bg-sand lg:block">
            <Image src={img} alt="" fill priority sizes="45vw" className="object-cover" />
          </div>
        )}
      </header>

      {/* sub-category chips (or category tiles on the shop-all page) */}
      <div className="no-scrollbar -mx-4 mt-10 flex gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {cat ? (
          <>
            <Link href={`/shop/${cat.slug}`} className={`shrink-0 rounded-2xl border px-4 py-3 ${!sub ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink-2"}`}>
              <span className="block text-[14px] font-medium">All {cat.short}</span>
              <span className="block font-mono text-[11px] opacity-70">{productsIn(cat.slug).length} products</span>
            </Link>
            {cat.subs.map((s) => (
              <Link key={s.slug} href={`/shop/${cat.slug}/${s.slug}`} className={`shrink-0 rounded-2xl border px-4 py-3 ${sub?.slug === s.slug ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink-2"}`}>
                <span className="block text-[14px] font-medium">{s.name}</span>
                <span className="block font-mono text-[11px] opacity-70">from {pkr(fromPrice(cat.slug, s.slug))}</span>
              </Link>
            ))}
          </>
        ) : (
          CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/shop/${c.slug}`} className="flex shrink-0 items-center gap-3 rounded-2xl border border-line bg-paper py-2 pl-2 pr-4 hover:border-ink-2">
              <span className="relative size-11 overflow-hidden rounded-xl bg-sand"><Image src={c.img} alt="" fill sizes="44px" className="object-cover" /></span>
              <span><span className="block text-[14px] font-medium">{c.name}</span><span className="block font-mono text-[11px] text-muted">{c.subs.length} types</span></span>
            </Link>
          ))
        )}
      </div>

      <div className="mt-10"><ProductGrid products={productsIn(cat?.slug, sub?.slug)} /></div>
    </div>
  );
}

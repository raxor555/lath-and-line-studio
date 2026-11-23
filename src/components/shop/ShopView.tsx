import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, fromPrice, pkr, productsIn, type Category, type Sub } from "@/lib/catalog";
import ProductGrid from "./ProductGrid";
import Motion from "@/components/Motion";

export function Crumbs({ items }: { items: [string, string?][] }) {
  return (
    <nav aria-label="Breadcrumb" className="label flex flex-wrap items-center gap-2 text-muted">
      {items.map(([label, href], i) => (
        <span key={label} className="inline-flex items-center gap-2">
          {i > 0 && <span aria-hidden className="text-ink/30">/</span>}
          {href ? <Link href={href} className="draw hover:text-ink">{label}</Link> : <span className="text-ink">{label}</span>}
        </span>
      ))}
    </nav>
  );
}

/** Listing page for the whole shop, one category, or one sub-category. */
export default function ShopView({ cat, sub }: { cat?: Category; sub?: Sub }) {
  const title = sub?.name ?? cat?.name ?? "All collections";
  const blurb = sub?.blurb ?? cat?.blurb ?? "Wall panels, slats, marble sheets, jaali and everything to fit them. Delivered all over Pakistan.";
  const img = sub?.img ?? cat?.img ?? "/photos/room-marble-slat.jpg";
  const crumbs: [string, string?][] = [["Home", "/"], ["Shop", cat ? "/shop" : undefined]];
  if (cat) crumbs.push([cat.name, sub ? `/shop/${cat.slug}` : undefined]);
  if (sub) crumbs.push([sub.name]);
  const products = productsIn(cat?.slug, sub?.slug);

  // the tabs: sub-categories inside a category, categories on the shop-all page
  const tabs: { label: string; href: string; on: boolean; note: string }[] = cat
    ? [{ label: `All ${cat.short}`, href: `/shop/${cat.slug}`, on: !sub, note: `${productsIn(cat.slug).length}` },
       ...cat.subs.map((s) => ({ label: s.name, href: `/shop/${cat.slug}/${s.slug}`, on: sub?.slug === s.slug, note: `from ${pkr(fromPrice(cat.slug, s.slug))}` }))]
    : CATEGORIES.map((c) => ({ label: c.name, href: `/shop/${c.slug}`, on: false, note: `${productsIn(c.slug).length}` }));

  return (
    <div className="pb-32">
      <header className="mx-auto max-w-[1600px] px-5 pt-[150px] sm:px-10 sm:pt-[170px]">
        <Crumbs items={crumbs} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <h1 data-lines className="display text-[clamp(3rem,8.4vw,8rem)]">{title}</h1>
          <div className="max-w-[26rem] lg:pb-3">
            <p className="text-[16px] leading-relaxed text-ink-2">{blurb}</p>
            <p className="label mt-4 text-muted">{products.length} product{products.length === 1 ? "" : "s"} · delivered all over Pakistan</p>
          </div>
        </div>
      </header>

      <div data-wipe className="relative mt-14 h-[38vh] min-h-[260px] overflow-hidden sm:h-[46vh]">
        <Image src={img} alt="" fill priority sizes="100vw" data-drift className="scale-[1.18] object-cover" />
      </div>

      <div className="mx-auto max-w-[1600px] px-5 sm:px-10">
        <nav aria-label={cat ? `${cat.name} ranges` : "Collections"} className="no-scrollbar -mx-5 flex gap-8 overflow-x-auto border-b border-ink/15 px-5 sm:mx-0 sm:px-0">
          {tabs.map((t) => (
            <Link key={t.href} href={t.href} aria-current={t.on ? "page" : undefined}
              className={`group relative shrink-0 py-6 transition-colors ${t.on ? "text-ink" : "text-muted hover:text-ink"}`}>
              <span className="label">{t.label}</span>
              <span className="ml-2 text-[11px] tabular-nums text-muted">{t.note}</span>
              <span aria-hidden className={`absolute inset-x-0 -bottom-px h-px origin-left bg-ink transition-transform duration-500 ease-[var(--ease-out-expo)] ${t.on ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
            </Link>
          ))}
        </nav>
        <div className="mt-2"><ProductGrid products={products} /></div>
      </div>
      <Motion />
    </div>
  );
}

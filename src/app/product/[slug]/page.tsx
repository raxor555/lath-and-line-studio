import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, categoryBySlug, productBySlug, productsIn } from "@/lib/catalog";
import { Crumbs } from "@/components/shop/ShopView";
import ProductBuy from "@/components/shop/ProductBuy";
import ProductCard from "@/components/shop/ProductCard";
import Motion from "@/components/Motion";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const p = productBySlug((await params).slug);
  return { title: p ? `${p.name} · Lath & Line` : "Product", description: p?.desc };
}

export default async function Page({ params }: PageProps<"/product/[slug]">) {
  const p = productBySlug((await params).slug);
  if (!p) notFound();
  const cat = categoryBySlug(p.category)!;
  const sub = cat.subs.find((s) => s.slug === p.sub)!;
  const related = productsIn(p.category, p.sub).filter((x) => x.slug !== p.slug).concat(productsIn(p.category).filter((x) => x.sub !== p.sub)).slice(0, 4);
  const specs: [string, string][] = [["Size", p.size], ["Material", p.material], ["Colour", p.colour], ["Sold per", p.unit], ["Category", `${cat.name} · ${sub.name}`]];
  if (p.cover) specs.splice(1, 0, ["Covers", `${p.cover} m of wall width per ${p.unit}`]);

  const perks: [string, string][] = [
    ["Delivery", "All over Pakistan, calculated at checkout."],
    ["Fitting", "Free measuring and fitting in Karachi, most walls done in one day."],
    ["Payment", "Cash on delivery, bank transfer, JazzCash or Easypaisa."],
  ];

  return (
    <div className="pb-32">
      <div className="mx-auto max-w-[1600px] px-5 pt-[132px] sm:px-10 sm:pt-[150px]">
        <Crumbs items={[["Shop", "/shop"], [cat.name, `/shop/${cat.slug}`], [sub.name, `/shop/${cat.slug}/${sub.slug}`], [p.name]]} />
      </div>

      <div className="mx-auto mt-8 grid max-w-[1600px] gap-12 sm:px-10 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        {/* gallery: the room, the finish itself, the collection */}
        <div className="grid gap-2 sm:gap-5">
          <div data-wipe className="relative aspect-[4/5] overflow-hidden bg-sand sm:aspect-[5/4]">
            <Image src={sub.img} alt={`${sub.name} installed in a room`} fill priority sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-5">
            <div data-rise className="aspect-square" style={{ background: p.swatch, backgroundSize: "cover" }} role="img" aria-label={`${p.name} finish close-up`} />
            <div data-rise className="relative aspect-square overflow-hidden bg-sand">
              <Image src={cat.img} alt="" fill sizes="(min-width:1024px) 29vw, 50vw" className="object-cover" />
            </div>
          </div>
        </div>

        {/* buy column */}
        <div className="px-5 sm:px-0 lg:sticky lg:top-[124px] lg:self-start">
          <h1 data-lines className="text-[clamp(2.2rem,3.6vw,3.6rem)] font-extralight uppercase leading-[0.95] tracking-[-0.04em]">{p.name}</h1>
          <p className="label mt-4 text-muted">{p.size}</p>
          <p className="mt-6 max-w-[34rem] text-[16px] leading-relaxed text-ink-2">{p.desc}</p>
          <div className="mt-8"><ProductBuy p={p} /></div>

          <dl className="mt-12 border-t border-ink/15">
            {perks.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] gap-4 border-b border-ink/15 py-4 text-[14px]">
                <dt className="label pt-0.5 text-muted">{k}</dt><dd className="leading-relaxed text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>

          <h2 className="label mt-12 text-ink">Specification</h2>
          <dl className="mt-4 border-t border-ink/15">
            {specs.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] gap-4 border-b border-ink/15 py-3.5 text-[14px]">
                <dt className="label pt-0.5 text-muted">{k}</dt><dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-36 max-w-[1600px] px-5 sm:px-10">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2 data-lines className="display text-[clamp(2.4rem,5vw,4.6rem)]">You may also like</h2>
            <Link href={`/shop/${cat.slug}`} className="label draw-on">All {cat.name}</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
        </section>
      )}
      <Motion />
    </div>
  );
}

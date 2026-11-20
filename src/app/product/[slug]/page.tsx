import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, Hammer, ShieldCheck, Truck } from "lucide-react";
import { PRODUCTS, categoryBySlug, productBySlug, productsIn } from "@/lib/catalog";
import { Crumbs } from "@/components/shop/ShopView";
import ProductBuy from "@/components/shop/ProductBuy";
import ProductCard from "@/components/shop/ProductCard";

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

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-32 pt-[132px] sm:px-10">
      <Crumbs items={[["Home", "/"], ["Shop", "/shop"], [cat.name, `/shop/${cat.slug}`], [sub.name, `/shop/${cat.slug}/${sub.slug}`], [p.name]]} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* gallery */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative col-span-2 aspect-[4/3] overflow-hidden rounded-[24px] bg-sand">
            <Image src={sub.img} alt={`${sub.name} installed in a room`} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
          </div>
          <div className="aspect-square rounded-[24px] border border-line" style={{ background: p.swatch, backgroundSize: "cover" }} role="img" aria-label={`${p.name} finish close-up`} />
          <div className="relative aspect-square overflow-hidden rounded-[24px] bg-sand">
            <Image src={cat.img} alt="" fill sizes="(min-width:1024px) 27vw, 50vw" className="object-cover" />
          </div>
        </div>

        {/* buy box */}
        <div className="lg:sticky lg:top-[124px] lg:self-start">
          {p.badge && <span className="inline-block rounded-full bg-sand px-3 py-1 text-[12px] font-medium">{p.badge}</span>}
          <h1 className="mt-3 text-[clamp(2rem,3.4vw,3.2rem)] font-light leading-[1.02] tracking-[-0.04em]">{p.name}</h1>
          <p className="mt-2 font-mono text-[12px] text-muted">{p.size}</p>
          <p className="mt-5 text-[16px] leading-relaxed text-ink-2">{p.desc}</p>
          <div className="mt-6"><ProductBuy p={p} /></div>

          <ul className="mt-8 grid gap-3 border-t border-line pt-6 text-[14px] text-ink-2">
            <li className="flex gap-3"><Truck className="size-5 shrink-0 text-clay" /> Delivery all over Pakistan in 3–6 working days. Karachi next day.</li>
            <li className="flex gap-3"><Hammer className="size-5 shrink-0 text-clay" /> Free measuring and fitting in Karachi, most walls done in one day.</li>
            <li className="flex gap-3"><ShieldCheck className="size-5 shrink-0 text-clay" /> 10-year warranty against swelling, rot and termites.</li>
            <li className="flex gap-3"><BadgeCheck className="size-5 shrink-0 text-clay" /> Cash on delivery, bank transfer, JazzCash and Easypaisa.</li>
          </ul>

          <dl className="mt-8 grid grid-cols-[140px_1fr] gap-y-3 border-t border-line pt-6 text-[14px]">
            {specs.map(([k, v]) => <div key={k} className="contents"><dt className="text-muted">{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <h2 className="mb-8 text-[clamp(1.8rem,3vw,2.6rem)] font-light tracking-[-0.035em]">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
        </section>
      )}
    </div>
  );
}

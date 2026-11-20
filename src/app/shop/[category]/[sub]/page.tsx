import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShopView from "@/components/shop/ShopView";
import { CATEGORIES, categoryBySlug } from "@/lib/catalog";

export function generateStaticParams() {
  return CATEGORIES.flatMap((c) => c.subs.map((s) => ({ category: c.slug, sub: s.slug })));
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]/[sub]">): Promise<Metadata> {
  const { category, sub } = await params;
  const s = categoryBySlug(category)?.subs.find((x) => x.slug === sub);
  return { title: s ? `${s.name} · Lath & Line` : "Shop", description: s?.blurb };
}

export default async function Page({ params }: PageProps<"/shop/[category]/[sub]">) {
  const { category, sub } = await params;
  const cat = categoryBySlug(category);
  const s = cat?.subs.find((x) => x.slug === sub);
  if (!cat || !s) notFound();
  return <ShopView cat={cat} sub={s} />;
}

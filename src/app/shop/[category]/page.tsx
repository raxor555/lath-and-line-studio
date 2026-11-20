import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShopView from "@/components/shop/ShopView";
import { CATEGORIES, categoryBySlug } from "@/lib/catalog";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const cat = categoryBySlug((await params).category);
  return { title: cat ? `${cat.name} · Lath & Line` : "Shop", description: cat?.blurb };
}

export default async function Page({ params }: PageProps<"/shop/[category]">) {
  const cat = categoryBySlug((await params).category);
  if (!cat) notFound();
  return <ShopView cat={cat} />;
}

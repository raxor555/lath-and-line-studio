import type { Metadata } from "next";
import ShopView from "@/components/shop/ShopView";

export const metadata: Metadata = { title: "Shop all · Lath & Line", description: "Wall panels, slats, marble sheets, jaali and accessories, delivered all over Pakistan." };

export default function Page() {
  return <ShopView />;
}

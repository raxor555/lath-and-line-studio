import Hero from "@/components/home/Hero";
import Sections from "@/components/Sections";
import { Bestsellers, CategoryTiles, PvcRange } from "@/components/home/HomeShop";

export default function Home() {
  return (
    <>
      {/* full-bleed film hero; the nav floats over it */}
      <Hero />
      <div id="shop-start" className="scroll-mt-24 pt-24"><CategoryTiles /></div>
      <PvcRange />
      <Bestsellers />
      <Sections />
    </>
  );
}

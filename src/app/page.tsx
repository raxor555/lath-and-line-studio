import Hero from "@/components/home/Hero";
import Sections from "@/components/Sections";
import { Bestsellers, CategoryTiles, PvcRange } from "@/components/home/HomeShop";

export default function Home() {
  return (
    <>
      {/* a photo hero so the shop opens instantly; the 3D house has its own page, /visualizer */}
      <Hero />
      <div className="pt-20"><CategoryTiles /></div>
      <PvcRange />
      <Bestsellers />
      <Sections />
    </>
  );
}

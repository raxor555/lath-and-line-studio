import Tour from "@/components/tour/Tour";
import Sections from "@/components/Sections";
import { Bestsellers, CategoryTiles, PvcRange } from "@/components/home/HomeShop";

export default function Home() {
  return (
    <>
      {/* the 3D house is the hero; scrolling walks into it, then the shop follows */}
      <Tour />
      <div className="pt-24"><CategoryTiles /></div>
      <PvcRange />
      <Bestsellers />
      <Sections />
    </>
  );
}

import Hero from "@/components/home/Hero";
import Motion from "@/components/Motion";
import Story, { Process, Visit } from "@/components/Sections";
import { Bestsellers, CollectionIndex } from "@/components/home/HomeShop";

export default function Home() {
  return (
    <>
      {/* full-bleed film hero; the nav floats over it */}
      <Hero />
      <div id="shop-start" className="scroll-mt-24"><CollectionIndex /></div>
      <Story />
      <Bestsellers />
      <Process />
      <Visit />
      <Motion />
    </>
  );
}

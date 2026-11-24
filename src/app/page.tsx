import Hero from "@/components/home/Hero";
import Motion from "@/components/Motion";
import Story, { Process, Visit } from "@/components/Sections";
import { CollectionIndex, Promises, Shelf } from "@/components/home/HomeShop";
import WallCalculator from "@/components/home/WallCalculator";

export default function Home() {
  return (
    <>
      {/* full-bleed film hero; the nav floats over it */}
      <Hero />
      <div id="shop-start" className="scroll-mt-24">
        <Promises />
        <Shelf />
      </div>
      <CollectionIndex />
      <Story />
      <WallCalculator />
      <Process />
      <Visit />
      <Motion />
    </>
  );
}

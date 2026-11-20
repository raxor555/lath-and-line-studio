import type { Metadata } from "next";
import Tour from "@/components/tour/Tour";

export const metadata: Metadata = {
  title: "3D Visualizer · Lath & Line",
  description: "Walk into the house and try any panel, slat, marble sheet or jaali on a real wall.",
};

export default function Page() {
  return <Tour startInDesign={true} />;
}

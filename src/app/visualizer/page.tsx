import type { Metadata } from "next";
import Tour from "@/components/tour/Tour";
import VisualizerGate from "@/components/tour/VisualizerGate";

export const metadata: Metadata = {
  title: "3D Visualizer · Lath & Line",
  description: "Walk into a photoreal room and try any panel, slat, marble sheet or jaali on its walls.",
};

export default function Page() {
  // the 3D files download once and stay on the device; later visits open straight into the room
  return <VisualizerGate><Tour startInDesign={true} /></VisualizerGate>;
}

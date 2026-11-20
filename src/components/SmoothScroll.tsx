"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SyncScrollTrigger() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<LenisRef>(null);
  useEffect(() => {
    const update = (t: number) => ref.current?.lenis?.raf(t * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <ReactLenis root ref={ref} options={{ autoRaf: false, lerp: reduce ? 1 : 0.1, smoothWheel: !reduce }}>
      <SyncScrollTrigger />
      {children}
    </ReactLenis>
  );
}

/** Scroll position where the 3D tour lands on the design stage. */
export const designScrollY = () => {
  const el = document.getElementById("tour");
  return el ? el.offsetTop + window.innerHeight * 5 + 4 : 0;
};

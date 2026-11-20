"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useTour } from "@/lib/tour-store";

/* Skeleton for the 3D hero, themed on the product: a wall being fitted with slat panels. Oak, walnut and charcoal
   WPC slats rise into place one after another, then a band of late-sun light sweeps across them. Every animation
   is transform/opacity only, so it runs on the compositor and stays smooth while the main thread builds the 3D. */

const WOODS = [
  "linear-gradient(90deg,#8a5a37,#b07a4e 45%,#7a4c2d)", // walnut
  "linear-gradient(90deg,#b88a5c,#d6aa77 45%,#a87a4d)", // oak
  "linear-gradient(90deg,#2b2724,#3d3733 45%,#24201d)", // charcoal
];
const PATTERN = [0, 1, 0, 1, 1, 0, 2, 0, 1, 0, 0, 1, 2, 1, 0, 1, 0, 0, 1, 2, 0, 1, 1, 0, 1, 0, 2, 0, 1, 0];
const PRODUCTS = ["WPC Acoustic Slats", "Fluted PVC Panels", "UV Marble Sheets", "CNC Jaali Panels"];

export default function HouseLoader() {
  // ?loader holds the skeleton on screen (for reviewing the design)
  const ready = useTour((s) => s.ready) && !(typeof window !== "undefined" && window.location.search.includes("loader"));
  // once faded out, leave the page entirely: an invisible full-screen layer with running animations and a blur
  // still makes the browser recomposite the 3D canvas every frame
  const [gone, setGone] = useState(false);
  useEffect(() => { if (!ready) return; const t = setTimeout(() => setGone(true), 800); return () => clearTimeout(t); }, [ready]);
  const bar = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  // progress goes straight to the DOM: no React re-render per loaded file
  useEffect(() => {
    const show = (progress: number) => {
      const p = Math.min(99, Math.round(progress));
      if (bar.current) bar.current.style.transform = `scaleX(${Math.max(0.04, p / 100)})`;
      if (label.current) label.current.textContent = `${p}%`;
    };
    show(useProgress.getState().progress); // files may have finished before this mounted
    return useProgress.subscribe((s) => show(s.progress));
  }, []);

  if (gone) return null;
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden bg-[#efe7dc] transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}>
      {/* the wall: slats on black acoustic felt, rising into place */}
      <div className="absolute inset-y-0 left-1/2 flex w-[min(1500px,140vw)] -translate-x-1/2 gap-[0.6%] bg-[#1c1916] px-[0.6%]">
        {PATTERN.map((w, i) => (
          <span key={i} className="ll-slat relative h-full flex-1 rounded-[1px]" style={{ background: WOODS[w], animationDelay: `${(i % 15) * 45 + (i >= 15 ? 90 : 0)}ms` }}>
            {/* grain on each slat */}
            <span className="absolute inset-0 bg-[repeating-linear-gradient(180deg,rgb(0_0_0/0.05)_0_2px,transparent_2px_9px)] opacity-70" />
          </span>
        ))}
        {/* late-sun sheen sweeping across the slats */}
        <span className="ll-sheen absolute inset-y-0 -left-1/3 w-1/3 bg-[linear-gradient(100deg,transparent,rgb(255_220_175/0.28),transparent)]" />
      </div>
      {/* darker edges so the card and the headline stay readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_0%,rgb(26_20_16/0.45)_100%)]" />

      {/* centre card */}
      <div className="absolute left-1/2 top-[38%] w-[min(360px,82vw)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-[rgb(247_244_239/0.92)] px-6 py-5 text-center shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)] backdrop-blur-md">
        <p className="font-mono text-[11px] tracking-wide text-clay">Lath &amp; Line · 3D showroom</p>
        <p className="mt-1.5 text-[22px] font-light tracking-[-0.02em] text-ink">Fitting your walls</p>
        <div className="relative mt-2 h-[22px] overflow-hidden text-[13px] text-ink-2">
          {PRODUCTS.map((p, i) => (
            <span key={p} className="ll-cycle absolute inset-x-0" style={{ animationDelay: `${i * 1.6}s` }}>{p}</span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink/10">
            <span ref={bar} className="block h-full origin-left rounded-full bg-clay transition-transform duration-500 ease-out" style={{ transform: "scaleX(0.04)" }} />
          </span>
          <span ref={label} className="w-9 text-right font-mono text-[11px] text-muted">0%</span>
        </div>
      </div>
    </div>
  );
}

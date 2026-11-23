"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";

/* Full-bleed film hero: a panelled living room whose wall lights come up once (15 s, ~2 MB, 575 KB on phones),
   then holds on the lit room. The nav sits over it, transparent, until the page scrolls past. */
export default function Hero() {
  const video = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"playing" | "paused" | "ended">("playing");

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    // reduced motion: no film, just the lit room
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      const toEnd = () => { v.currentTime = Math.max(0, v.duration - 0.05); setState("ended"); };
      if (v.readyState >= 1) toEnd(); else v.addEventListener("loadedmetadata", toEnd, { once: true });
      return;
    }
    v.play().catch(() => setState("paused"));
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (state === "ended") { v.currentTime = 0; v.play(); setState("playing"); }
    else if (v.paused) { v.play(); setState("playing"); }
    else { v.pause(); setState("paused"); }
  };

  return (
    <section className="relative h-[100svh] min-h-[620px] overflow-hidden bg-[#141110] text-white">
      <video
        ref={video}
        className="absolute inset-0 size-full object-cover"
        poster="/video/hero-first.jpg"
        muted
        playsInline
        preload="auto"
        aria-hidden
        onEnded={() => setState("ended")}
      >
        <source src="/video/hero-m.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* shade for the type: strongest top-left and along the bottom, the room stays visible on the right */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(100deg,rgb(14_11_9/0.72)_0%,rgb(14_11_9/0.38)_45%,rgb(14_11_9/0.08)_75%)]" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#0e0b09]/60 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#0e0b09]/80 to-transparent" />
      {/* keeps the category index legible where it crosses the lit seams */}
      <div aria-hidden className="absolute right-0 top-0 hidden h-[62%] w-[42%] bg-[radial-gradient(ellipse_at_85%_30%,rgb(14_11_9/0.72)_0%,rgb(14_11_9/0.4)_40%,transparent_72%)] lg:block" />

      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-[clamp(128px,17vh,176px)] sm:px-10">
        <div className="flex items-start justify-between gap-10">
          <div className="min-w-0">
            <h1 aria-label="Lath and Line" className="hero-rise text-[clamp(5.6rem,13.2vw,13.5rem)] font-extralight uppercase leading-[0.82] tracking-[-0.07em]">
              <span className="block sm:inline">Lath&nbsp;&amp;</span> <span className="block sm:inline">Line</span>
            </h1>
            <p className="hero-rise mt-6 max-w-[34rem] text-[clamp(1.15rem,2vw,1.75rem)] font-light uppercase leading-[1.15] tracking-[-0.01em] text-white/90 [text-wrap:balance] [animation-delay:120ms] sm:mt-8">
              Wall panels that finish<br className="hidden sm:block" /> a room in a day
            </p>
          </div>

          {/* the range, like a contents list */}
          <nav aria-label="Categories" className="hero-rise hidden shrink-0 pt-4 text-right [animation-delay:240ms] lg:block">
            <ul className="grid gap-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/shop/${c.slug}`} className="label draw text-white/75 transition hover:text-white">{c.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="hero-rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 [animation-delay:360ms]">
          <Link href="/#visit" className="label inline-flex h-[54px] items-center gap-2.5 rounded-full bg-clay pl-7 pr-6 text-white shadow-[0_14px_34px_-14px_rgb(178_89_52/0.9)] transition duration-300 hover:bg-[#a5512e]">
            Book a free measure <ArrowUpRight className="size-4" />
          </Link>
          <Link href="/shop" className="label draw-on inline-flex items-center gap-2 py-1 text-white/90 transition hover:text-white">
            Shop all products <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="mt-auto flex items-end justify-between gap-6 border-t border-white/15 pt-5 text-[11.5px] uppercase tracking-[0.16em] text-white/70">
          <p className="hidden sm:block">Delivery all over Pakistan<span className="mx-3 text-white/30">/</span>Cash on delivery</p>
          <p className="sm:hidden">Delivered all over Pakistan</p>
          <a href="#shop-start" className="hidden items-center gap-2 transition hover:text-white md:inline-flex">
            Scroll <ArrowDown className="hero-nudge size-3.5" />
          </a>
          <button
            onClick={toggle}
            aria-label={state === "playing" ? "Pause the film" : state === "ended" ? "Replay the film" : "Play the film"}
            className="inline-flex items-center gap-2 uppercase tracking-[0.16em] transition hover:text-white"
          >
            {state === "playing" ? <Pause className="size-3.5" /> : state === "ended" ? <RotateCcw className="size-3.5" /> : <Play className="size-3.5" />}
            <span className="hidden sm:inline">{state === "playing" ? "Pause" : state === "ended" ? "Lights again" : "Play"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

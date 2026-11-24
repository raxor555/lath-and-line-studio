"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* One motion grammar for the whole store, opted into with data attributes:
   data-lines    heading lines rise out of a mask
   data-wipe     a photo frame opens from the bottom while the photo settles from 1.15× scale
   data-rise     a block lifts 32px into place (batched, so a row of products arrives as a wave)
   data-drift    a photo drifts against the scroll (parallax)
   data-magnetic a main button leans toward the pointer (mouse only)
   Content is visible without JavaScript; the from-states are applied only when this runs.
   Mounted at the end of each page (not the layout), so it runs after that page has hydrated and again on every route. */
export default function Motion() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((el) => {
        const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
        splits.push(split);
        gsap.from(split.lines, {
          yPercent: 105, duration: 1.2, ease: "expo.out", stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-wipe]").forEach((el) => {
        const img = el.querySelector("img");
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" });
        if (img) tl.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.1);
      });

      gsap.set("[data-rise]", { opacity: 0, y: 32 });
      ScrollTrigger.batch("[data-rise]", {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, overwrite: true }),
      });

      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
        gsap.fromTo(el, { yPercent: -8 }, {
          yPercent: 8, ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });

    // main buttons lean toward the pointer and spring back
    const off: (() => void)[] = [];
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "expo.out" }), y = gsap.quickTo(el, "y", { duration: 0.5, ease: "expo.out" });
        const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.22); y((e.clientY - r.top - r.height / 2) * 0.3); };
        const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.4)", overwrite: true });
        el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
        off.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); gsap.set(el, { x: 0, y: 0 }); });
      });
    }

    // images and fonts change the layout after first paint
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 600);
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", refresh);
      off.forEach((f) => f());
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return null;
}

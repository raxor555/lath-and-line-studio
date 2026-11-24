"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Quick add: a copy of the finish flies from the product frame into the cart count in the nav,
 * on a short arc, then the count pulses. Without a visible cart target (or with reduced motion) it does nothing.
 */
export function flyToCart(from: Element | null, swatch: string) {
  if (!from || reduced()) return;
  const target = [...document.querySelectorAll<HTMLElement>("[data-cart-target]")].find((el) => el.offsetParent !== null && el.getBoundingClientRect().bottom > 0);
  if (!target) return;
  const a = from.getBoundingClientRect(), b = target.getBoundingClientRect();
  const size = Math.min(a.width, a.height, 160);
  const ghost = document.createElement("div");
  Object.assign(ghost.style, {
    position: "fixed", left: `${a.left + a.width / 2 - size / 2}px`, top: `${a.top + a.height / 2 - size / 2}px`,
    width: `${size}px`, height: `${size}px`, background: swatch, backgroundSize: "cover", zIndex: "90", pointerEvents: "none",
  });
  document.body.appendChild(ghost);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const tl = gsap.timeline({ onComplete: () => ghost.remove() });
  tl.to(ghost, { x: dx, duration: 0.85, ease: "power2.inOut" }, 0)
    .to(ghost, { y: dy, duration: 0.85, ease: "back.in(1.4)" }, 0)
    .to(ghost, { scale: 0.08, borderRadius: "50%", duration: 0.85, ease: "power3.in" }, 0)
    .to(ghost, { opacity: 0, duration: 0.15 }, 0.75);
}

/** A number that counts to its new value (prices, totals). */
export function useTweened(value: number, duration = 0.8) {
  const [shown, setShown] = useState(value);
  const obj = useRef({ v: value });
  useEffect(() => {
    const t = gsap.to(obj.current, { v: value, duration: reduced() ? 0 : duration, ease: "expo.out", onUpdate: () => setShown(obj.current.v) });
    return () => { t.kill(); };
  }, [value, duration]);
  return shown;
}

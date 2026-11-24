"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Plus } from "lucide-react";
import { productBySlug, type Product } from "@/lib/catalog";
import { useRecent } from "@/lib/cart";
import { reduced } from "@/lib/motion";
import ProductCard from "./ProductCard";

/** Questions a buyer asks before ordering, answered from what the store actually offers. */
export function Faq({ p }: { p: Product }) {
  const items: [string, string][] = [
    ["Can it go over my existing wall?", "Yes. Panels and sheets fit straight over a sound, dry wall, with no plastering or demolition. A damp or crumbling wall needs fixing first; in Karachi the free measure checks this before you order."],
    ["How many will I need?", p.cover
      ? `Each ${p.unit} covers ${p.cover} m of wall width. Use the calculator above for a first count; in Karachi we measure for free and confirm the exact number.`
      : `This is sold per ${p.unit}. If you're unsure how many you need, book the free measure in Karachi or ask us when you order.`],
    ["Do you deliver to my city?", "We deliver all over Pakistan. The delivery charge for your city shows at checkout before you place the order."],
    ["How do I pay?", "Cash on delivery, bank transfer, JazzCash or Easypaisa. You choose at checkout."],
    ["Who fits it?", "In Karachi our own team measures and fits, and most walls are done in a single day. Elsewhere we deliver the panels with the trims and adhesive you order."],
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-12">
      <h2 className="label text-ink">Before you order</h2>
      <ul className="mt-4 border-t border-ink/15">
        {items.map(([q, a], i) => <FaqRow key={q} q={q} a={a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />)}
      </ul>
    </div>
  );
}

function FaqRow({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const body = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    if (first.current) { first.current = false; gsap.set(el, { height: open ? "auto" : 0 }); return; }
    gsap.to(el, { height: open ? "auto" : 0, duration: reduced() ? 0 : 0.6, ease: "expo.out" });
  }, [open]);
  const id = q.replace(/\W+/g, "-").toLowerCase();
  return (
    <li className="border-b border-ink/15">
      <button onClick={onToggle} aria-expanded={open} aria-controls={id} className="flex w-full items-center justify-between gap-6 py-4 text-left text-[15px]">
        {q}<Plus className={`size-4 shrink-0 transition-transform duration-500 ease-[var(--ease-out-expo)] ${open ? "rotate-45" : ""}`} strokeWidth={1.5} />
      </button>
      <div ref={body} id={id} className="h-0 overflow-hidden" inert={!open}>
        <p className="max-w-[34rem] pb-5 text-[14px] leading-relaxed text-ink-2">{a}</p>
      </div>
    </li>
  );
}

/** Finishes this visitor has looked at, kept on their device. */
export function RecentlyViewed({ current }: { current: string }) {
  const slugs = useRecent((s) => s.slugs);
  const [ready, setReady] = useState(false);
  useEffect(() => { Promise.resolve(useRecent.persist.rehydrate()).then(() => setReady(true)); }, []);
  const list = slugs.filter((s) => s !== current).map(productBySlug).filter((x): x is Product => !!x).slice(0, 4);
  if (!ready || list.length === 0) return null;
  return (
    <section className="mx-auto mt-32 max-w-[1600px] px-5 sm:px-10">
      <h2 className="display mb-12 text-[clamp(2rem,3.6vw,3.4rem)]">Recently viewed</h2>
      <div className="grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-4">{list.map((r) => <ProductCard key={r.slug} p={r} rise={false} />)}</div>
    </section>
  );
}

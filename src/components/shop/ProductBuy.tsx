"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Minus, Plus, Ruler } from "lucide-react";
import { pkr, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

/* Set to a full international number (e.g. 92XXXXXXXXXX) to turn the WhatsApp buttons into wa.me links. */
export const WHATSAPP_NUMBER = "";
export const whatsapp = (text: string) => (WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}` : "/#visit");

export default function ProductBuy({ p }: { p: Product }) {
  const [qty, setQty] = useState(1);
  const [wall, setWall] = useState("");
  const [added, setAdded] = useState(false);
  const w = parseFloat(wall);
  const need = p.cover && w > 0 ? Math.ceil(w / p.cover) : null;

  const add = () => { useCart.getState().add(p.slug, qty); setAdded(true); setTimeout(() => setAdded(false), 1800); };

  return (
    <div className="grid gap-5">
      <p className="text-[32px] font-light tracking-[-0.03em]">{pkr(p.price)} <span className="text-[16px] text-muted">/ {p.unit}</span></p>

      {p.cover && (
        <div className="rounded-2xl border border-line bg-paper p-4">
          <label className="flex items-center gap-2 text-[14px] font-medium"><Ruler className="size-4 text-clay" /> How many do I need?</label>
          <div className="mt-3 flex items-center gap-3">
            <div className="relative flex-1">
              <input inputMode="decimal" value={wall} onChange={(e) => setWall(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="Wall width"
                className="h-11 w-full rounded-xl border border-line bg-bone px-3 pr-10 text-[15px] outline-none focus:border-ink" aria-label="Wall width in metres" />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-muted">m</span>
            </div>
            <button disabled={!need} onClick={() => need && setQty(need)} className="h-11 rounded-xl bg-sand px-4 text-[14px] font-medium disabled:opacity-40">
              {need ? `Use ${need}` : "Calculate"}
            </button>
          </div>
          {need && <p className="mt-2 text-[13px] text-muted">{need} {p.unit}s cover {(need * p.cover).toFixed(2)} m of wall · {pkr(need * p.price)}</p>}
        </div>
      )}

      <div className="flex gap-3">
        <div className="inline-flex h-13 items-center rounded-2xl border border-line">
          <button aria-label="One less" onClick={() => setQty(Math.max(1, qty - 1))} className="grid size-12 place-items-center"><Minus className="size-4" /></button>
          <span className="w-10 text-center font-mono">{qty}</span>
          <button aria-label="One more" onClick={() => setQty(qty + 1)} className="grid size-12 place-items-center"><Plus className="size-4" /></button>
        </div>
        <button onClick={add} className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-ink text-[15px] font-medium text-paper transition hover:bg-black">
          {added ? <><Check className="size-4" /> Added</> : <>Add to cart · {pkr(p.price * qty)}</>}
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <a href={whatsapp(`Assalam o Alaikum, I'd like to order ${qty} × ${p.name}.`)} target={WHATSAPP_NUMBER ? "_blank" : undefined} rel="noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-[14px] font-medium text-[#0b2b17] sm:col-span-2">
          Order on WhatsApp
        </a>
      </div>
    </div>
  );
}

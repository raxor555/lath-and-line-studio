"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Minus, Plus } from "lucide-react";
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
    <div>
      <p className="text-[34px] font-light tabular-nums tracking-[-0.03em]">{pkr(p.price)} <span className="text-[15px] text-muted">/ {p.unit}</span></p>

      {p.cover && (
        <div className="mt-8 border-y border-ink/15 py-5">
          <label htmlFor="wall-width" className="label text-ink">How many do I need?</label>
          <div className="mt-4 flex items-end gap-5">
            <div className="relative flex-1">
              <input id="wall-width" inputMode="decimal" value={wall} onChange={(e) => setWall(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="Wall width"
                className="h-11 w-full border-b border-ink/30 bg-transparent pr-8 text-[17px] outline-none placeholder:text-muted focus:border-ink" />
              <span className="pointer-events-none absolute bottom-3 right-0 text-[13px] text-muted">m</span>
            </div>
            <button disabled={!need} onClick={() => need && setQty(need)} className="label draw-on h-11 shrink-0 disabled:opacity-35">
              {need ? `Use ${need}` : "Calculate"}
            </button>
          </div>
          <p className="mt-3 min-h-[20px] text-[13px] text-muted">{need ? `${need} ${p.unit}s cover ${(need * p.cover).toFixed(2)} m of wall · ${pkr(need * p.price)}` : "Enter the width of the wall in metres."}</p>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <div className="inline-flex h-14 items-center rounded-full border border-ink/25">
          <button aria-label="One less" onClick={() => setQty(Math.max(1, qty - 1))} className="grid size-14 place-items-center"><Minus className="size-4" strokeWidth={1.5} /></button>
          <span className="w-8 text-center tabular-nums">{qty}</span>
          <button aria-label="One more" onClick={() => setQty(qty + 1)} className="grid size-14 place-items-center"><Plus className="size-4" strokeWidth={1.5} /></button>
        </div>
        <button onClick={add} className="label inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-ink text-paper transition duration-300 hover:bg-clay">
          {added ? <><Check className="size-4" /> Added to cart</> : <>Add to cart · <span className="tabular-nums">{pkr(p.price * qty)}</span></>}
        </button>
      </div>

      <a href={whatsapp(`Assalam o Alaikum, I'd like to order ${qty} × ${p.name}.`)} target={WHATSAPP_NUMBER ? "_blank" : undefined} rel="noreferrer"
        className="label draw-on mt-6 inline-flex items-center gap-2 py-1 text-ink-2">
        Or order on WhatsApp <ArrowUpRight className="size-3.5" />
      </a>
    </div>
  );
}

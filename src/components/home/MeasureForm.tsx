"use client";

import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { whatsapp, WHATSAPP_NUMBER } from "@/components/shop/ProductBuy";

/** The free-measure request. Not wired to a booking system yet, so it says so after sending. */
export default function MeasureForm() {
  const [sent, setSent] = useState<string | null>(null);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const width = f.get("width") ? `, wall about ${f.get("width")} m wide` : "";
    setSent(`Free measure for ${f.get("name")} (${f.get("phone")}), ${f.get("area")}, Karachi${width}.`);
  };

  const field = "h-14 w-full border-b border-white/25 bg-transparent text-[16px] text-white outline-none transition-colors placeholder:text-white/45 focus:border-white";

  if (sent) return (
    <div className="border-t border-white/20 pt-8" role="status">
      <span className="grid size-12 place-items-center rounded-full bg-white text-night"><Check className="size-5" strokeWidth={1.5} /></span>
      <p className="mt-6 text-[clamp(1.4rem,2.2vw,2rem)] font-extralight uppercase leading-tight tracking-[-0.02em]">Your request is ready.</p>
      <p className="mt-4 text-[15px] leading-relaxed text-white/70">{sent}</p>
      <p className="mt-6 border-t border-white/15 pt-4 text-[13px] text-white/55">Demo form: this store isn&apos;t connected to a booking system yet, so nothing has been sent.</p>
      {WHATSAPP_NUMBER && <a href={whatsapp(sent)} target="_blank" rel="noreferrer" className="label draw-on mt-6 inline-flex items-center gap-2">Send it on WhatsApp <ArrowUpRight className="size-3.5" /></a>}
    </div>
  );

  return (
    <form onSubmit={submit} className="grid gap-2" aria-label="Book a free measure">
      <input required name="name" autoComplete="name" placeholder="Your name" className={field} />
      <input required name="phone" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+\s-]{10,15}" placeholder="Mobile number (03XX XXXXXXX)" className={field} />
      <div className="grid gap-2 sm:grid-cols-[1.4fr_1fr] sm:gap-8">
        <input required name="area" autoComplete="address-level3" placeholder="Area, e.g. Gulshan-e-Iqbal" className={field} />
        <input name="width" inputMode="decimal" placeholder="Wall width (m), optional" className={field} />
      </div>
      <button className="label mt-8 inline-flex h-[54px] w-max items-center gap-2.5 rounded-full bg-clay pl-7 pr-6 text-white transition duration-300 hover:bg-[#a5512e]">
        Request the visit <ArrowUpRight className="size-4" />
      </button>
    </form>
  );
}

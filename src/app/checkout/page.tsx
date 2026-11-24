"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Banknote, Check, Ruler } from "lucide-react";
import { pkr, productBySlug } from "@/lib/catalog";
import { cartTotals, useCart } from "@/lib/cart";
import { whatsapp, WHATSAPP_NUMBER } from "@/components/shop/ProductBuy";
import Motion from "@/components/Motion";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Hyderabad", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Other"];
const PAY = ["Cash on delivery", "Bank transfer", "JazzCash", "Easypaisa"];
const delivery = (city: string, total: number) => (city === "Karachi" ? (total >= 25000 ? 0 : 500) : 1500);

export default function Checkout() {
  const lines = useCart((s) => s.lines);
  const [ready, setReady] = useState(false);
  const [city, setCity] = useState("Karachi");
  const [pay, setPay] = useState(PAY[0]);
  const [done, setDone] = useState<string | null>(null);
  useEffect(() => { Promise.resolve(useCart.persist.rehydrate()).then(() => setReady(true)); }, []);
  const { total } = cartTotals(lines);
  const ship = delivery(city, total);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const items = lines.map((l) => `${l.qty} × ${productBySlug(l.slug)?.name}`).join(", ");
    setDone(`Order for ${f.get("name")} (${f.get("phone")}), ${f.get("address")}, ${city}. ${items}. Total ${pkr(total + ship)}, ${pay}.`);
    useCart.getState().clear();
  };

  const field = "h-14 w-full border-b border-ink/25 bg-transparent text-[16px] outline-none transition-colors placeholder:text-muted focus:border-ink";

  if (done) return (
    <div className="mx-auto grid min-h-svh max-w-[640px] content-center gap-6 px-6 pt-[120px] text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-ink text-paper"><Check strokeWidth={1.5} /></span>
      <h1 className="text-[clamp(2.2rem,4vw,3.4rem)] font-extralight uppercase leading-[0.95] tracking-[-0.04em]">Your order is ready.</h1>
      <p className="text-ink-2">{done}</p>
      <p className="border-y border-ink/15 py-4 text-[13px] text-ink-2">Demo checkout: this store isn&apos;t connected to an order system yet, so nothing has been sent. {WHATSAPP_NUMBER ? "Send the order on WhatsApp to place it now." : ""}</p>
      {WHATSAPP_NUMBER && <a href={whatsapp(done)} target="_blank" rel="noreferrer" className="label mx-auto inline-flex h-14 items-center rounded-full bg-clay px-8 text-white">Send on WhatsApp</a>}
      <Link href="/shop" className="label draw-on mx-auto">Continue shopping</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-32 pt-[150px] sm:px-10 sm:pt-[170px]">
      <h1 data-lines className="display text-[clamp(3rem,8vw,7.4rem)]">Checkout</h1>
      {ready && lines.length === 0 ? (
        <p className="mt-10 text-ink-2">Your cart is empty. <Link href="/shop" className="draw-on">Browse the collections</Link></p>
      ) : (
        <div className="mt-16 grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
          <form onSubmit={submit} className="grid content-start gap-4">
            <h2 className="label text-ink">Delivery details</h2>
            <input required name="name" autoComplete="name" placeholder="Full name" className={field} />
            <input required name="phone" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+\s-]{10,15}" placeholder="Mobile number (03XX XXXXXXX)" className={field} />
            <select value={city} onChange={(e) => setCity(e.target.value)} className={field} aria-label="City">{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
            <textarea required name="address" autoComplete="street-address" placeholder="House / flat, street, area" rows={3} className={`${field} h-auto resize-none py-4`} />
            <h2 className="label mt-10 text-ink">Payment</h2>
            <div className="grid border-t border-ink/15 sm:grid-cols-2 sm:gap-x-8">
              {PAY.map((m) => (
                <label key={m} className={`flex h-14 cursor-pointer items-center gap-3 border-b border-ink/15 text-[15px] transition-colors ${pay === m ? "text-ink" : "text-muted hover:text-ink"}`}>
                  <input type="radio" name="pay" checked={pay === m} onChange={() => setPay(m)} className="accent-[#b25934]" /> {m}
                </label>
              ))}
            </div>
            <button data-magnetic className="label mt-10 h-14 rounded-full bg-ink text-paper transition-colors duration-300 hover:bg-clay">Place order · <span className="tabular-nums">{pkr(total + ship)}</span></button>
            <ul className="mt-2 grid gap-2 text-[13px] text-ink-2">
              <li className="flex items-center gap-3"><Banknote className="size-4 shrink-0 text-muted" strokeWidth={1.5} />With cash on delivery you pay when the order arrives.</li>
              <li className="flex items-center gap-3"><Ruler className="size-4 shrink-0 text-muted" strokeWidth={1.5} />In Karachi, measuring and fitting are free.</li>
            </ul>
          </form>

          <aside className="h-max lg:sticky lg:top-[124px]">
            <h2 className="label text-ink">Order summary</h2>
            <ul className="mt-5 border-t border-ink/15">
              {lines.map((l) => { const p = productBySlug(l.slug); if (!p) return null; return (
                <li key={l.slug} className="flex items-center gap-4 border-b border-ink/15 py-4">
                  <span className="size-14 shrink-0" style={{ background: p.swatch, backgroundSize: "cover" }} />
                  <span className="flex-1 text-[14px] leading-snug">{p.name}<span className="label mt-1 block text-muted">× {l.qty}</span></span>
                  <span className="text-[14px] tabular-nums">{pkr(p.price * l.qty)}</span>
                </li>
              ); })}
            </ul>
            <dl className="mt-6 grid grid-cols-[1fr_auto] gap-y-3 text-[14px] tabular-nums">
              <dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{pkr(total)}</dd>
              <dt className="text-muted">Delivery to {city}</dt><dd className="tabular-nums">{ship ? pkr(ship) : "Free"}</dd>
              <dt className="mt-3 border-t border-ink/15 pt-4 text-[16px]">Total</dt><dd className="mt-3 border-t border-ink/15 pt-4 text-[22px] font-light tabular-nums">{pkr(total + ship)}</dd>
            </dl>
            {city === "Karachi" && total < 25000 && <p className="mt-3 text-[12px] text-muted">Free delivery in Karachi on orders over Rs 25,000.</p>}
          </aside>
        </div>
      )}
      <Motion />
    </div>
  );
}

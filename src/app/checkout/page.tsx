"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { pkr, productBySlug } from "@/lib/catalog";
import { cartTotals, useCart } from "@/lib/cart";
import { whatsapp, WHATSAPP_NUMBER } from "@/components/shop/ProductBuy";

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

  const field = "h-12 w-full rounded-xl border border-line bg-paper px-4 text-[15px] outline-none focus:border-ink";

  if (done) return (
    <div className="mx-auto grid min-h-svh max-w-[640px] content-center gap-6 px-6 pt-[120px] text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-ink text-paper"><Check /></span>
      <h1 className="text-[40px] font-light tracking-[-0.04em]">Thank you. We&apos;ll call to confirm.</h1>
      <p className="text-ink-2">{done}</p>
      <p className="rounded-2xl bg-sand p-4 text-[13px] text-ink-2">Demo checkout: this store isn&apos;t connected to an order system yet, so nothing has been sent. {WHATSAPP_NUMBER ? "Send the order on WhatsApp to place it now." : ""}</p>
      {WHATSAPP_NUMBER && <a href={whatsapp(done)} target="_blank" rel="noreferrer" className="mx-auto inline-flex h-12 items-center rounded-2xl bg-[#25D366] px-6 font-medium text-[#0b2b17]">Send on WhatsApp</a>}
      <Link href="/shop" className="underline">Continue shopping</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-32 pt-[132px] sm:px-10">
      <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-light tracking-[-0.045em]">Checkout</h1>
      {ready && lines.length === 0 ? (
        <p className="mt-8 text-ink-2">Your cart is empty. <Link href="/shop" className="underline">Browse the shop</Link></p>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <form onSubmit={submit} className="grid content-start gap-4">
            <h2 className="text-[20px] font-medium">Delivery details</h2>
            <input required name="name" autoComplete="name" placeholder="Full name" className={field} />
            <input required name="phone" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+\s-]{10,15}" placeholder="Mobile number (03XX XXXXXXX)" className={field} />
            <select value={city} onChange={(e) => setCity(e.target.value)} className={field} aria-label="City">{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
            <textarea required name="address" autoComplete="street-address" placeholder="House / flat, street, area" rows={3} className={`${field} h-auto py-3`} />
            <h2 className="mt-4 text-[20px] font-medium">Payment</h2>
            <div className="grid grid-cols-2 gap-2">
              {PAY.map((m) => (
                <label key={m} className={`flex h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 text-[14px] ${pay === m ? "border-ink bg-paper" : "border-line"}`}>
                  <input type="radio" name="pay" checked={pay === m} onChange={() => setPay(m)} className="accent-[#211813]" /> {m}
                </label>
              ))}
            </div>
            <button className="mt-4 h-14 rounded-2xl bg-ink text-[16px] font-medium text-paper hover:bg-black">Place order · {pkr(total + ship)}</button>
          </form>

          <aside className="h-max rounded-[24px] bg-paper p-6">
            <h2 className="text-[20px] font-medium">Order summary</h2>
            <ul className="mt-5 grid gap-4">
              {lines.map((l) => { const p = productBySlug(l.slug); if (!p) return null; return (
                <li key={l.slug} className="flex items-center gap-3">
                  <span className="size-12 shrink-0 rounded-lg border border-line" style={{ background: p.swatch, backgroundSize: "cover" }} />
                  <span className="flex-1 text-[14px] leading-snug">{p.name}<span className="block font-mono text-[11px] text-muted">× {l.qty}</span></span>
                  <span className="font-mono text-[13px]">{pkr(p.price * l.qty)}</span>
                </li>
              ); })}
            </ul>
            <dl className="mt-6 grid grid-cols-[1fr_auto] gap-y-2 border-t border-line pt-4 text-[14px]">
              <dt className="text-muted">Subtotal</dt><dd className="font-mono">{pkr(total)}</dd>
              <dt className="text-muted">Delivery to {city}</dt><dd className="font-mono">{ship ? pkr(ship) : "Free"}</dd>
              <dt className="mt-2 text-[16px]">Total</dt><dd className="mt-2 font-mono text-[16px]">{pkr(total + ship)}</dd>
            </dl>
            {city === "Karachi" && total < 25000 && <p className="mt-3 text-[12px] text-muted">Free delivery in Karachi on orders over Rs 25,000.</p>}
          </aside>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { Logo } from "./Nav";

export default function Footer() {
  return (
    <footer id="trade" className="mx-3 mb-3 rounded-[28px] bg-ink px-6 py-14 text-paper sm:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-[26rem] text-[14px] text-paper/80">Delivery all over Pakistan. Cash on delivery, bank transfer, JazzCash and Easypaisa.</p>
          <p lang="ur" dir="rtl" className="mt-3 w-max font-urdu text-[18px] leading-[2] text-paper/70">کراچی میں تیار، پورے پاکستان میں ڈیلیوری</p>
          <p className="mt-4 max-w-[26rem] text-[12px] text-paper/45">Reference build. Brand, prices and figures are placeholders. Photos and the home film (Aniket Suthar) from Pexels; marble and terrazzo swatches from Poly Haven (CC0).</p>
        </div>
        <div>
          <h4 className="mb-3 font-mono text-[12px] text-paper/50">Shop</h4>
          <ul className="grid gap-2 text-[14px]">{CATEGORIES.map((c) => <li key={c.slug}><Link href={`/shop/${c.slug}`} className="text-paper/85 hover:text-paper">{c.name}</Link></li>)}</ul>
        </div>
        <div>
          <h4 className="mb-3 font-mono text-[12px] text-paper/50">Help</h4>
          <ul className="grid gap-2 text-[14px] text-paper/85">
            <li><Link href="/#process" className="hover:text-paper">How fitting works</Link></li>
            <li><Link href="/checkout" className="hover:text-paper">Checkout</Link></li>
            <li>Delivery all over Pakistan</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-mono text-[12px] text-paper/50">Showroom</h4>
          <ul className="grid gap-2 text-[14px] text-paper/85">
            <li>Shahrah-e-Faisal, Karachi</li>
            <li>Mon to Sat, 11:00 to 21:00</li>
            <li><Link href="/#visit" className="hover:text-paper">Book a free measure</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

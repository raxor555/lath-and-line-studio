import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { Logo } from "./Nav";

export default function Footer() {
  return (
    <footer id="trade" className="overflow-hidden bg-night text-white">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-10">
        <div className="grid gap-12 border-b border-white/12 py-20 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-6 max-w-[24rem] text-[15px] leading-relaxed text-white/70">Wall panels delivered all over Pakistan. Cash on delivery, bank transfer, JazzCash and Easypaisa. Free measuring and fitting in Karachi.</p>
          </div>
          <div>
            <h4 className="label mb-5 text-white/45">Shop</h4>
            <ul className="grid gap-3 text-[14px]">{CATEGORIES.map((c) => <li key={c.slug}><Link href={`/shop/${c.slug}`} className="draw text-white/80 hover:text-white">{c.name}</Link></li>)}</ul>
          </div>
          <div>
            <h4 className="label mb-5 text-white/45">Help</h4>
            <ul className="grid gap-3 text-[14px] text-white/80">
              <li><Link href="/#process" className="draw hover:text-white">How fitting works</Link></li>
              <li><Link href="/#rooms" className="draw hover:text-white">Room ideas</Link></li>
              <li><Link href="/checkout" className="draw hover:text-white">Checkout</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="label mb-5 text-white/45">Karachi</h4>
            <ul className="grid gap-3 text-[14px] text-white/80">
              <li>Free measure &amp; fitting</li>
              <li><Link href="/#visit" className="draw hover:text-white">Book a free measure</Link></li>
            </ul>
          </div>
        </div>
        <p aria-hidden className="select-none pt-10 text-center text-[clamp(3.4rem,15.6vw,16rem)] font-extralight uppercase leading-[0.8] tracking-[-0.06em] text-white/[0.92]">Lath &amp; Line</p>
        <div className="flex flex-wrap justify-between gap-4 py-8 text-[11.5px] leading-relaxed text-white/60">
          <p>Reference build. Brand, prices and figures are placeholders.</p>
          <p>Photos and the home film (Aniket Suthar) from Pexels. Marble and terrazzo swatches cropped from Pexels photos; other finishes rendered from CC0 Poly Haven textures.</p>
        </div>
      </div>
    </footer>
  );
}

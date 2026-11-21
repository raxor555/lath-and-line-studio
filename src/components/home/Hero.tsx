import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Box } from "lucide-react";

/* The home hero is a photograph, so the shop opens instantly on any phone; the 3D lives on /visualizer. */
export default function Hero() {
  return (
    <section className="px-3 pt-[113px]">
      <div className="relative h-[min(86svh,880px)] min-h-[560px] overflow-hidden rounded-[28px] bg-sand">
        <Image src="/photos/shop/hero.jpg" alt="Living room with walnut slat wall panels around a book-matched marble sheet" fill priority sizes="100vw" className="object-cover object-[50%_40%]" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#120d0a]/75 via-[#120d0a]/20 to-transparent" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#120d0a]/45 to-transparent lg:via-transparent" />

        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1400px] flex-col gap-8 px-6 pb-[calc(env(safe-area-inset-bottom)+36px)] text-white sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:pb-14">
          <div className="max-w-[760px]">
            <p className="font-mono text-[12px] text-white/75">Wall panels · Karachi · Delivery all over Pakistan</p>
            <h1 className="mt-4 text-[clamp(2.8rem,5.4vw,5.8rem)] font-light leading-[0.95] tracking-[-0.05em] [text-wrap:balance]">Walls, finished in a day.</h1>
            <p className="mt-5 max-w-[32rem] text-[17px] leading-relaxed text-white/85">PVC and WPC panels, UV marble sheets and jaali, fitted over the wall you already have.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="inline-flex h-[52px] items-center gap-2 rounded-2xl bg-white pl-5 pr-4 text-[15px] font-medium text-ink transition hover:bg-paper">
                Shop all products <ArrowUpRight className="size-4" />
              </Link>
              <Link href="/visualizer" className="inline-flex h-[52px] items-center gap-2 rounded-2xl border border-white/60 px-5 text-[15px] font-medium text-white transition hover:bg-white/15">
                <Box className="size-4" /> Open 3D visualizer
              </Link>
            </div>
          </div>

          {/* the visualizer, introduced rather than loaded */}
          <Link href="/visualizer" className="glass-dark group hidden w-[340px] rounded-3xl p-5 text-white transition hover:bg-black/40 lg:block">
            <p className="font-mono text-[11px] text-white/60">3D visualizer</p>
            <p className="mt-2 text-[20px] font-light leading-snug tracking-[-0.02em]">Walk into a photoreal room and try any finish on its walls.</p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-white/75 group-hover:text-white">Downloads once, then opens instantly <ArrowUpRight className="size-3.5" /></p>
          </Link>
        </div>
      </div>
    </section>
  );
}

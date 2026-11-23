"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import MeasureForm from "@/components/home/MeasureForm";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATEMENT = "A wall is the largest surface in any room. We make panels, slats, jaali and sheets that change it in hours, cut to size in Karachi and fitted by our own team.";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Hyderabad", "Peshawar", "Quetta"];

// room ideas: what each finish looks like on a wall, linked to the product
const ROOMS = [
  { title: "Walnut slats, marble surround", tag: "WPC slats · UV marble sheet", img: "/photos/room-walnut.jpg", alt: "Living room with a walnut wall and marble fireplace surround", href: "/product/wpc-slat-smoked-walnut" },
  { title: "An oak media wall", tag: "WPC slat panels", img: "/photos/room-tv-oak.jpg", alt: "Oak panelled TV wall with a low console", href: "/product/wpc-slat-natural-oak" },
  { title: "Statuario and oak, open plan", tag: "UV marble sheet · WPC slats", img: "/photos/room-marble-slat.jpg", alt: "Living room with a marble shelving wall and slatted TV wall", href: "/product/uv-marble-statuario" },
  { title: "A slatted entrance", tag: "Oak slat divider", img: "/photos/room-divider.jpg", alt: "Hallway with oak slat dividers and a hidden door", href: "/shop/wpc" },
  { title: "Fluted behind the sofa", tag: "PVC fluted panels", img: "/photos/room-fluted-sofa.jpg", alt: "Fluted panel wall behind a velvet sofa", href: "/shop/pvc-panels/fluted" },
];

/** Statement, room ideas (pinned horizontal gallery on desktop) and the one-good-wall chapter. */
export default function Story() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { gsap.set(".st-word", { opacity: 1 }); return; }
    gsap.to(".st-word", { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: ".st-text", start: "top 78%", end: "bottom 40%", scrub: true } });
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const track = root.current?.querySelector<HTMLElement>(".rooms-track");
      const bar = root.current?.querySelector<HTMLElement>(".rooms-progress");
      if (!track) return;
      const dist = () => track.scrollWidth - innerWidth;
      gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: "#rooms", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: (st) => bar && gsap.set(bar, { scaleX: st.progress }) } });
      // each photo slides a little inside its frame while the track moves
      gsap.utils.toArray<HTMLElement>(".rooms-img").forEach((img) =>
        gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: "#rooms", start: "top top", end: () => "+=" + dist(), scrub: true } }));
    });
  }, { scope: root });

  return (
    <div ref={root}>
      {/* statement, at night */}
      <section className="bg-night text-white">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-36 sm:px-10 sm:py-48 lg:grid-cols-[1fr_3fr]">
          <span aria-hidden className="hidden lg:block" />
          <p className="st-text max-w-[24ch] text-[clamp(2rem,4.2vw,4.4rem)] font-extralight leading-[1.08] tracking-[-0.035em]">
            {STATEMENT.split(" ").map((w, i) => <span key={i} className="st-word opacity-[0.16]">{w} </span>)}
          </p>
        </div>
      </section>

      {/* room ideas */}
      <section id="rooms" className="scroll-mt-0 overflow-hidden bg-night text-white">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-6 px-5 pb-10 pt-6 sm:px-10 min-[900px]:pt-[120px]">
          <h2 className="display text-[clamp(2.8rem,6.4vw,6rem)]">Room ideas</h2>
          <p className="max-w-[24rem] text-[15px] leading-relaxed text-white/65">How each finish sits in a real room. Open one to shop the finish on the wall.</p>
        </div>
        <div data-lenis-prevent-touch className="no-scrollbar overflow-x-auto max-[899px]:snap-x max-[899px]:snap-mandatory min-[900px]:overflow-visible">
          <div className="rooms-track flex w-max gap-5 px-5 pb-16 sm:px-10 min-[900px]:gap-8">
            {ROOMS.map((r) => (
              <Link key={r.title} href={r.href} className="group w-[84vw] shrink-0 snap-start min-[900px]:w-[min(52vw,820px)]">
                <div className="relative aspect-[4/5] overflow-hidden min-[900px]:aspect-auto min-[900px]:h-[min(62vh,640px)]">
                  <Image src={r.img} alt={r.alt} fill sizes="(min-width:900px) 52vw, 84vw" className="rooms-img scale-[1.14] object-cover transition-[filter] duration-700 group-hover:brightness-110" />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4 border-t border-white/15 pt-4">
                  <div>
                    <h3 className="text-[clamp(1.3rem,2vw,1.8rem)] font-extralight uppercase leading-tight tracking-[-0.02em]">{r.title}</h3>
                    <p className="label mt-2 text-white/55">{r.tag}</p>
                  </div>
                  <span className="label draw mt-1.5 inline-flex shrink-0 items-center gap-1.5 text-white/80 group-hover:text-white">Shop <ArrowUpRight className="size-3.5" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mx-auto hidden max-w-[1600px] px-10 pb-14 min-[900px]:block">
          <div className="h-px bg-white/15"><div className="rooms-progress h-px origin-left scale-x-0 bg-white" /></div>
        </div>
      </section>

      {/* one good wall */}
      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 py-32 sm:px-10 sm:py-40 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div data-wipe className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:min-h-[720px]">
          <Image src="/photos/shop/wpc-acoustic.jpg" alt="Oak acoustic slats on black felt" fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <h2 data-lines className="display text-[clamp(2.6rem,5.6vw,5.4rem)]">One good wall changes the room.</h2>
          <p data-rise className="mt-8 max-w-[30rem] text-[17px] leading-relaxed text-ink-2">You don&apos;t need to rebuild a room to change it. Panels go straight over the wall you already have, with no plastering and no week of dust.</p>
          <dl className="mt-12 border-t border-ink/15">
            {[["Fitting", "Most walls in a single day"], ["Surface", "Over the existing wall, no demolition"], ["Measure", "Free in Karachi, one price for everything"], ["Delivery", "All over Pakistan, cash on delivery"]].map(([k, v]) => (
              <div key={k} data-rise className="grid grid-cols-[120px_1fr] gap-4 border-b border-ink/15 py-5 sm:grid-cols-[160px_1fr]">
                <dt className="label pt-1 text-muted">{k}</dt>
                <dd className="text-[clamp(1.1rem,1.6vw,1.4rem)] font-light tracking-[-0.01em]">{v}</dd>
              </div>
            ))}
          </dl>
          <Link href="#process" data-rise className="label draw-on mt-10 inline-flex w-max items-center gap-2">How fitting works <ArrowUpRight className="size-3.5" /></Link>
        </div>
      </section>
    </div>
  );
}

const STEPS: [string, string][] = [
  ["Choose", "Browse by material or by room and note the finishes you like."],
  ["Preview", "Send us a photo of your wall and we suggest the finishes that suit it."],
  ["Measure", "We visit, confirm the measurements and send one price for material, trims and fitting."],
  ["Fit", "Our team fits most walls in a single day and clears up before leaving."],
];

export function Process() {
  return (
    <section id="process" className="scroll-mt-24 border-t border-ink/15">
      <div className="mx-auto max-w-[1600px] px-5 py-32 sm:px-10 sm:py-40">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 data-lines className="display max-w-[12ch] text-[clamp(2.8rem,6.4vw,6rem)]">From photo to finished wall</h2>
          <p data-rise className="max-w-[24rem] text-[15px] leading-relaxed text-ink-2 lg:pb-3">Pay by cash on delivery, bank transfer, JazzCash or Easypaisa.</p>
        </div>
        <ol className="mt-20 grid border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, d]) => (
            <li key={t} data-rise className="border-b border-ink/15 py-8 sm:pr-8 lg:border-b-0 lg:border-r lg:px-8 lg:py-10 lg:first:pl-0 lg:last:border-r-0">
              <h3 className="text-[clamp(2rem,3vw,2.8rem)] font-extralight uppercase leading-none tracking-[-0.03em]">{t}</h3>
              <p className="mt-4 max-w-[22rem] text-[15px] leading-relaxed text-ink-2">{d}</p>
            </li>
          ))}
        </ol>
      </div>
      {/* where we deliver */}
      <div className="overflow-hidden border-t border-ink/10 py-5" aria-label="Delivery cities">
        <div className="marquee flex w-max gap-14">
          {[0, 1].flatMap((k) => CITIES.map((c) => (
            <span key={k + c} aria-hidden={k === 1} className="label inline-flex items-center gap-14 whitespace-nowrap text-ink-2">{c}<span className="size-1 rounded-full bg-ink/30" /></span>
          )))}
        </div>
      </div>
    </section>
  );
}

export function Visit() {
  return (
    <section id="visit" className="relative isolate overflow-hidden bg-night text-white">
      <Image src="/photos/room-walnut.jpg" alt="" fill sizes="100vw" data-drift className="-z-10 scale-[1.18] object-cover opacity-40" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/55 to-night/80" />
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 py-36 sm:px-10 sm:py-48 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-24">
        <div>
          <h2 data-lines className="display max-w-[11ch] text-[clamp(3.2rem,8vw,8.2rem)]">Book a free measure</h2>
          <p data-rise className="mt-8 max-w-[30rem] text-[17px] leading-relaxed text-white/75">We visit, measure the wall and send one price for material, trims and fitting. Measuring is free in Karachi; anywhere else in Pakistan, order online and we deliver.</p>
          <Link href="/shop" data-rise className="label draw-on mt-8 inline-flex items-center gap-2 py-1">Or shop all products <ArrowUpRight className="size-4" /></Link>
        </div>
        <div data-rise><MeasureForm /></div>
      </div>
    </section>
  );
}

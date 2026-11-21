"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATEMENT = "A wall is the largest surface in any room. We make panels, slats, jaali and sheets that change it in hours, cut to size in Karachi and fitted by our own teams.";

/* Set to a full international number (e.g. 92XXXXXXXXXX) to turn the WhatsApp buttons into wa.me links. */
const WHATSAPP_NUMBER = "";
const whatsapp = (text: string) => (WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}` : "#visit");
const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Hyderabad", "Peshawar", "Quetta"];

/** Eight-point Mughal star, the motif of the jaali panels. */
function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M12 1.5l2.9 4.1 4.9-.9-.9 4.9 4.1 2.9-4.1 2.9.9 4.9-4.9-.9-2.9 4.1-2.9-4.1-4.9.9.9-4.9L.5 12.5l4.1-2.9-.9-4.9 4.9.9z" />
    </svg>
  );
}

const ROOMS = [
  { title: "Apartment, DHA Karachi", tag: "Walnut slats · Statuario sheet", img: "/photos/room-walnut.jpg", alt: "Living room with a walnut wall and marble fireplace surround", try: "slat-walnut", cta: "Try walnut slats" },
  { title: "Media wall, Clifton, Karachi", tag: "Oak WPC panels", img: "/photos/room-tv-oak.jpg", alt: "Oak panelled TV wall with a low console", try: "slat-oak", cta: "Try oak slats" },
  { title: "Open-plan living, F-7 Islamabad", tag: "Statuario sheet · Oak slats", img: "/photos/room-marble-slat.jpg", alt: "Living room with a marble shelving wall and slatted TV wall", try: "marble-statuario", cta: "Try Statuario" },
  { title: "Entrance hall, Bahria Town Karachi", tag: "Oak slat divider", img: "/photos/room-divider.jpg", alt: "Hallway with oak slat dividers and a hidden door", try: "slat-oak", cta: "Try oak slats" },
];

function Arrow() {
  return <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/20 backdrop-blur-md transition group-hover:bg-white group-hover:text-ink"><ArrowUpRight className="size-4" /></span>;
}

export default function Sections() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(".st-word", { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: ".st-text", start: "top 80%", end: "bottom 45%", scrub: true } });
    gsap.utils.toArray<HTMLElement>(".zoom-img").forEach((el) =>
      gsap.fromTo(el, { scale: 1.14 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom 60%", scrub: true } }));
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const track = root.current?.querySelector<HTMLElement>(".rooms-track");
      if (!track) return;
      gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: "none", scrollTrigger: { trigger: "#rooms", start: "top top", end: () => "+=" + (track.scrollWidth - innerWidth), pin: true, scrub: 1, invalidateOnRefresh: true } });
    });
  }, { scope: root });

  return (
    <div ref={root}>
      {/* statement */}
      <section className="mx-auto grid max-w-[1400px] gap-8 px-6 py-36 sm:px-10 md:grid-cols-[1fr_3fr]">
        <div className="pt-3 text-[14px] text-muted">
          <p>Wall finishes since 2014</p>
          <p className="mt-1">Workshop in Karachi</p>
          <p lang="ur" dir="rtl" className="mt-3 w-max font-urdu text-[19px] leading-[2] text-ink-2">کراچی میں تیار</p>
        </div>
        <p className="st-text max-w-[22ch] text-[clamp(1.9rem,3.8vw,3.7rem)] font-light leading-[1.1] tracking-[-0.035em]">
          {STATEMENT.split(" ").map((w, i) => <span key={i} className="st-word opacity-[0.14]">{w} </span>)}
        </p>
      </section>

      {/* marquee */}
      <div className="overflow-hidden bg-ink py-6 text-paper" aria-hidden>
        <div className="marquee flex w-max gap-12">
          {[0, 1].flatMap((k) => ["Fluted PVC panels", "WPC acoustic slats", "CNC jaali panels", "UV marble sheets", "Adhesive finishes", "Profiles & trims"].map((t) => (
            <span key={k + t} className="inline-flex items-center gap-12 whitespace-nowrap text-[clamp(1.6rem,3vw,2.6rem)] font-light tracking-[-0.02em]">{t}<Star className="size-4 text-clay" /></span>
          )))}
        </div>
      </div>

      {/* facts */}
      <section className="mx-auto max-w-[1400px] px-6 pb-36 sm:px-10">
        <div className="grid gap-3 lg:grid-cols-[1fr_1.45fr]">
          <div className="relative min-h-[420px] overflow-hidden rounded-[26px] lg:min-h-[560px]">
            <Image src="/photos/room-fluted-sofa.jpg" alt="Fluted panel wall behind a velvet sofa" fill sizes="(min-width:1024px) 40vw, 100vw" className="zoom-img object-cover" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[["Typical fitting time for one feature wall", "1", "day"], ["Finishes across PVC, WPC, marble sheet and adhesive", "40+", ""], ["Warranty against swelling, rot and termites", "10", "yr"]].map(([t, n, u]) => (
              <div key={t} className="flex min-h-[250px] flex-col justify-between rounded-[26px] bg-paper p-7">
                <p className="max-w-[18rem] text-ink-2">{t}</p>
                <p className="self-end text-[clamp(3.4rem,6vw,5.8rem)] font-light leading-[0.9] tracking-[-0.05em]">{n}<span className="ml-1 text-[0.38em] tracking-[-0.02em]">{u}</span></p>
              </div>
            ))}
            <div className="flex min-h-[250px] flex-col justify-between rounded-[26px] bg-ink p-7 text-paper">
              <p className="max-w-[22rem] text-[19px] leading-snug">You don&apos;t need to rebuild a room to change it. You need one good wall.</p>
              <Link href="#process" className="w-max border-b border-paper/70 pb-0.5 text-[15px] font-medium">See how fitting works</Link>
            </div>
          </div>
        </div>
      </section>

      {/* rooms */}
      <section id="rooms" className="overflow-hidden bg-paper">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-6 px-6 pb-12 pt-28 sm:px-10">
          <h2 className="text-[clamp(2.4rem,4.8vw,4.8rem)] font-light leading-[0.98] tracking-[-0.045em]">Rooms we&apos;ve finished.</h2>
          <p className="max-w-[26rem] text-ink-2">Real installs, with the finishes used. Tap one to try it on the wall in the house above.</p>
        </div>
        <div data-lenis-prevent-touch className="no-scrollbar overflow-x-auto max-[899px]:snap-x max-[899px]:snap-mandatory min-[900px]:overflow-visible">
          <div className="rooms-track flex w-max gap-4 px-6 pb-28 sm:px-10">
            {ROOMS.map((r) => (
              <article key={r.title} className="w-[82vw] shrink-0 snap-start min-[900px]:w-[min(60vw,860px)]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[26px]">
                  <Image src={r.img} alt={r.alt} fill sizes="(min-width:900px) 60vw, 82vw" className="object-cover" />
                  <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 font-mono text-[12px]">{r.tag}</span>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="text-[26px] font-light tracking-[-0.03em]">{r.title}</h3>
                  <Link href={r.try ? `/visualizer?finish=${r.try}` : "/visualizer"} className="shrink-0 border-b border-ink pb-0.5 text-[14px] font-medium">{r.cta}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* process */}
      <section id="process" className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-36 sm:px-10">
        <h2 className="mb-14 max-w-[14ch] text-[clamp(2.4rem,4.8vw,4.8rem)] font-light leading-[0.98] tracking-[-0.045em]">From photo to finished wall.</h2>
        <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[26px] bg-paper px-7 py-5 text-[15px] text-ink-2">
          <span className="font-mono text-[12px] text-clay">Free fitting in Karachi · Delivery all over Pakistan</span>
          {CITIES.map((c) => <span key={c} className="inline-flex items-center gap-2"><Star className="size-2.5 text-clay" />{c}</span>)}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[["Choose", "Browse by material or by room, then order up to three free samples."], ["Visualize", "Try finishes on the wall in the house above, or send us a photo of yours."], ["Measure", "We visit, confirm the measurements and send one price for material, trims and fitting. Pay by cash on delivery, bank transfer, JazzCash or Easypaisa."], ["Fit", "Our team fits most walls in a single day and clears up before leaving."]].map(([t, d], i) => (
            <div key={t} className="flex min-h-[260px] flex-col justify-between rounded-[26px] bg-paper p-7">
              <span className="font-mono text-[12px] text-clay">0{i + 1}</span>
              <div><h3 className="text-[32px] font-light tracking-[-0.03em]">{t}</h3><p className="mt-2 text-ink-2">{d}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="visit" className="px-3 pb-3">
        <div className="relative overflow-hidden rounded-[28px] bg-ink text-paper">
          <Image src="/photos/room-walnut.jpg" alt="" fill sizes="100vw" className="object-cover opacity-30" />
          <div className="relative mx-auto grid max-w-[1400px] gap-10 px-6 py-36 sm:px-10">
            <div>
              <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-paper/10 px-3.5 py-1.5 text-[13px] text-paper/90"><Star className="size-3 text-clay" /> Delivery all over Pakistan · Free fitting in Karachi</p>
              <h2 className="max-w-[12ch] text-[clamp(3rem,8vw,8.4rem)] font-light leading-[0.94] tracking-[-0.05em]">Bring a photo of your wall.</h2>
              <p lang="ur" dir="rtl" className="mt-6 w-max max-w-full font-urdu text-[clamp(1.3rem,2.2vw,2rem)] leading-[2] text-paper/70">اپنی دیوار کی تصویر بھیجیں، باقی ہم پر چھوڑ دیں</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/visualizer" className="inline-flex h-[52px] items-center gap-2 rounded-2xl bg-paper pl-5 pr-4 font-medium text-ink">Open the visualizer <ArrowUpRight className="size-4" /></Link>
              <a href={whatsapp("Assalam o Alaikum, I would like a quote for my wall.")} target={WHATSAPP_NUMBER ? "_blank" : undefined} rel="noreferrer" className="inline-flex h-[52px] items-center gap-2 rounded-2xl bg-[#25D366] px-5 font-medium text-[#0b2b17]">
                <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.7-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3z"/></svg>
                Send it on WhatsApp
              </a>
              <a href="#visit" className="glass-dark inline-flex h-[52px] items-center rounded-2xl px-5 font-medium">Book a free measure</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

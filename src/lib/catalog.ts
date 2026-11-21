/* Store catalogue. Prices are placeholders in PKR. */

export type Sub = { slug: string; name: string; blurb: string; img: string };
export type Category = { slug: string; name: string; short: string; blurb: string; img: string; subs: Sub[] };
export type Product = {
  slug: string; name: string; category: string; sub: string;
  price: number; unit: "panel" | "sheet" | "roll" | "box" | "piece" | "m²";
  size: string; material: string; colour: string; swatch: string;
  /** metres of wall width one unit covers, for the quantity calculator */
  cover?: number;
  badge?: "Bestseller" | "New" | "Made in Karachi";
  desc: string;
};

const P = "/photos/shop/";
const flute = (a: string, b: string) => `repeating-linear-gradient(90deg,${a} 0 5px,${b} 8px,${a} 11px)`;
const slat = (wood: string) => `repeating-linear-gradient(90deg,${wood} 0 9px,#1d1b19 9px 13px)`;
const solid = (a: string, b: string) => `linear-gradient(135deg,${a},${b})`;

export const CATEGORIES: Category[] = [
  {
    slug: "pvc-panels", name: "PVC Panels", short: "PVC", img: P + "pvc-fluted.jpg",
    blurb: "Waterproof, termite-proof panels that fit straight over the wall you have. Six profiles, 2.9 m long.",
    subs: [
      { slug: "fluted", name: "Fluted (Grill)", blurb: "Half-round flutes on a 26 mm pitch, the most asked-for profile.", img: P + "pvc-fluted.jpg" },
      { slug: "half-round", name: "Half-Round", blurb: "Bold 40 mm ribs for feature walls and reception desks.", img: P + "pvc-halfround.jpg" },
      { slug: "louver", name: "Louver", blurb: "Deep grooves with shadow lines, in wood and stone tones.", img: P + "pvc-louver.jpg" },
      { slug: "3d-wave", name: "3D Wave & Geometric", blurb: "Paintable relief panels that catch the light.", img: P + "pvc-3d.jpg" },
      { slug: "wood-grain", name: "Wood-Grain Flat", blurb: "Flat boards with a printed, textured wood face.", img: P + "pvc-woodgrain.jpg" },
      { slug: "ceiling", name: "Ceiling Panels", blurb: "Light linear boards for ceilings, kitchens and bathrooms.", img: P + "pvc-ceiling.jpg" },
    ],
  },
  {
    slug: "wpc", name: "WPC Slats & Cladding", short: "WPC", img: P + "wpc-slat.jpg",
    blurb: "Wood-plastic composite: the look of timber without swelling, rot or polish.",
    subs: [
      { slug: "indoor-slats", name: "Indoor Slats", blurb: "Slatted boards for TV walls, bedheads and partitions.", img: P + "wpc-slat.jpg" },
      { slug: "acoustic", name: "Acoustic Panels", blurb: "Slats on black acoustic felt that cut echo by up to 85%.", img: P + "wpc-acoustic.jpg" },
      { slug: "outdoor-cladding", name: "Outdoor Cladding", blurb: "UV-stable co-extruded boards for facades and boundary walls.", img: P + "wpc-cladding.jpg" },
      { slug: "decking", name: "Decking", blurb: "Anti-slip boards for terraces, rooftops and pool sides.", img: P + "wpc-decking.jpg" },
    ],
  },
  {
    slug: "marble-sheets", name: "UV Marble Sheets", short: "Marble", img: P + "marble-gloss.jpg",
    blurb: "4 × 8 ft sheets with a UV-cured gloss face. The look of stone at a fraction of the weight.",
    subs: [
      { slug: "high-gloss", name: "High Gloss", blurb: "Mirror finish that bounces light round the room.", img: P + "marble-gloss.jpg" },
      { slug: "matte", name: "Matte & Satin", blurb: "Soft-touch faces for bedrooms and bathrooms.", img: "/photos/cat-sheets.jpg" },
      { slug: "book-matched", name: "Book-Matched", blurb: "Mirrored vein pairs for TV walls and fireplaces.", img: "/photos/room-marble-slat.jpg" },
    ],
  },
  {
    slug: "jaali", name: "Jaali Panels", short: "Jaali", img: P + "jaali-mashrabiya.jpg",
    blurb: "CNC-cut lattice in Mughal and modern patterns, for screens, backlit walls and ceilings.",
    subs: [
      { slug: "mdf-jaali", name: "MDF Jaali", blurb: "12 mm MDF in veneer or lacquer, ready to backlight.", img: P + "jaali-mashrabiya.jpg" },
      { slug: "pvc-jaali", name: "PVC Jaali", blurb: "Moisture-proof lattice for bathrooms and outdoor use.", img: P + "jaali-shadow.jpg" },
      { slug: "dividers", name: "Room Dividers", blurb: "Framed jaali and slat screens, floor to ceiling.", img: P + "jaali-divider.jpg" },
    ],
  },
  {
    slug: "wallpaper", name: "Wallpaper & Adhesive", short: "Wallpaper", img: P + "wallpaper.jpg",
    blurb: "Peel-and-stick sheets and paste-the-wall papers for a weekend makeover.",
    subs: [
      { slug: "wallpaper", name: "Wallpaper", blurb: "Non-woven rolls in damask, linen and plaster looks.", img: P + "wallpaper.jpg" },
      { slug: "adhesive-sheets", name: "Adhesive Sheets", blurb: "Self-adhesive vinyl in stone, terrazzo and plain colours.", img: "/photos/cat-adhesive.jpg" },
    ],
  },
  {
    slug: "accessories", name: "Trims & Accessories", short: "Accessories", img: "/photos/cat-profiles.jpg",
    blurb: "Everything to finish the job: edges, corners, skirting, LED channels and adhesive.",
    subs: [
      { slug: "trims", name: "Trims & Profiles", blurb: "End caps, corners and joints matched to every panel.", img: "/photos/cat-profiles.jpg" },
      { slug: "led", name: "LED Profiles", blurb: "Aluminium channels with diffusers for backlit walls.", img: P + "acc-led.jpg" },
      { slug: "fixings", name: "Adhesive & Fixings", blurb: "Panel adhesive, silicone and concealed clips.", img: "/photos/cat-adhesive.jpg" },
    ],
  },
];

const p = (x: Omit<Product, "desc"> & { desc?: string }): Product => ({ desc: "", ...x });

export const PRODUCTS: Product[] = [
  // PVC — fluted
  p({ slug: "fluted-chalk-white", name: "Fluted Panel, Chalk White", category: "pvc-panels", sub: "fluted", price: 1450, unit: "panel", size: "160 × 2900 × 22 mm", material: "PVC", colour: "White", swatch: flute("#f5f2ec", "#d6d0c6"), cover: 0.16, badge: "Bestseller" }),
  p({ slug: "fluted-charcoal", name: "Fluted Panel, Charcoal", category: "pvc-panels", sub: "fluted", price: 1550, unit: "panel", size: "160 × 2900 × 22 mm", material: "PVC", colour: "Black", swatch: flute("#4b4c4b", "#1f201f"), cover: 0.16 }),
  p({ slug: "fluted-sand", name: "Fluted Panel, Sand", category: "pvc-panels", sub: "fluted", price: 1450, unit: "panel", size: "160 × 2900 × 22 mm", material: "PVC", colour: "Beige", swatch: flute("#d8c5ac", "#a68f77"), cover: 0.16 }),
  p({ slug: "fluted-teak", name: "Fluted Panel, Teak", category: "pvc-panels", sub: "fluted", price: 1650, unit: "panel", size: "160 × 2900 × 22 mm", material: "PVC", colour: "Wood", swatch: flute("#a87a52", "#6e4a2e"), cover: 0.16, badge: "New" }),
  // PVC — half-round
  p({ slug: "half-round-ivory", name: "Half-Round Panel, Ivory", category: "pvc-panels", sub: "half-round", price: 1850, unit: "panel", size: "120 × 2900 × 30 mm", material: "PVC", colour: "White", swatch: flute("#efe9de", "#c9c0b1"), cover: 0.12 }),
  p({ slug: "half-round-graphite", name: "Half-Round Panel, Graphite", category: "pvc-panels", sub: "half-round", price: 1950, unit: "panel", size: "120 × 2900 × 30 mm", material: "PVC", colour: "Grey", swatch: flute("#6b6c6d", "#3b3c3d"), cover: 0.12 }),
  // PVC — louver
  p({ slug: "louver-walnut", name: "Louver Panel, Walnut", category: "pvc-panels", sub: "louver", price: 2250, unit: "panel", size: "195 × 2900 × 12 mm", material: "PVC", colour: "Wood", swatch: slat("#6b4b37"), cover: 0.195, badge: "Bestseller" }),
  p({ slug: "louver-oak", name: "Louver Panel, Light Oak", category: "pvc-panels", sub: "louver", price: 2250, unit: "panel", size: "195 × 2900 × 12 mm", material: "PVC", colour: "Wood", swatch: slat("#c49a6c"), cover: 0.195 }),
  p({ slug: "louver-concrete", name: "Louver Panel, Concrete Grey", category: "pvc-panels", sub: "louver", price: 2150, unit: "panel", size: "195 × 2900 × 12 mm", material: "PVC", colour: "Grey", swatch: slat("#9a9893"), cover: 0.195 }),
  // PVC — 3D
  p({ slug: "3d-wave-white", name: "3D Wave Panel, Paintable White", category: "pvc-panels", sub: "3d-wave", price: 950, unit: "panel", size: "500 × 500 mm", material: "PVC", colour: "White", swatch: "repeating-radial-gradient(circle at 0 50%,#f4f1ec 0 6px,#d9d3c9 9px,#f4f1ec 12px)", cover: 0.5 }),
  p({ slug: "3d-prism-silver", name: "3D Prism Panel, Silver", category: "pvc-panels", sub: "3d-wave", price: 1150, unit: "panel", size: "500 × 500 mm", material: "PVC", colour: "Grey", swatch: "conic-gradient(from 45deg,#c9c9c7 0 25%,#9d9d9b 0 50%,#e3e3e1 0 75%,#b3b3b1 0)", cover: 0.5, badge: "New" }),
  // PVC — wood-grain & ceiling
  p({ slug: "wood-grain-ash", name: "Wood-Grain Board, Ash", category: "pvc-panels", sub: "wood-grain", price: 1250, unit: "panel", size: "250 × 2900 × 9 mm", material: "PVC", colour: "Wood", swatch: solid("#c9b392", "#a88d69"), cover: 0.25 }),
  p({ slug: "wood-grain-smoked", name: "Wood-Grain Board, Smoked Oak", category: "pvc-panels", sub: "wood-grain", price: 1250, unit: "panel", size: "250 × 2900 × 9 mm", material: "PVC", colour: "Wood", swatch: solid("#7a5d45", "#5a4231"), cover: 0.25 }),
  p({ slug: "ceiling-linear-white", name: "Linear Ceiling Panel, White", category: "pvc-panels", sub: "ceiling", price: 690, unit: "panel", size: "200 × 5950 × 8 mm", material: "PVC", colour: "White", swatch: "repeating-linear-gradient(0deg,#f6f4f0 0 18px,#dcd7cf 18px 20px)" }),
  p({ slug: "ceiling-linear-teak", name: "Linear Ceiling Panel, Teak", category: "pvc-panels", sub: "ceiling", price: 790, unit: "panel", size: "200 × 5950 × 8 mm", material: "PVC", colour: "Wood", swatch: "repeating-linear-gradient(0deg,#a87a52 0 18px,#6e4a2e 18px 20px)" }),
  // WPC
  p({ slug: "wpc-slat-natural-oak", name: "WPC Slat Panel, Natural Oak", category: "wpc", sub: "indoor-slats", price: 6900, unit: "panel", size: "600 × 3000 mm", material: "WPC", colour: "Wood", swatch: slat("#c49a6c"), cover: 0.6, badge: "Bestseller" }),
  p({ slug: "wpc-slat-smoked-walnut", name: "WPC Slat Panel, Smoked Walnut", category: "wpc", sub: "indoor-slats", price: 7400, unit: "panel", size: "600 × 3000 mm", material: "WPC", colour: "Wood", swatch: slat("#6b4b37"), cover: 0.6 }),
  p({ slug: "wpc-slat-black", name: "WPC Slat Panel, Matte Black", category: "wpc", sub: "indoor-slats", price: 7200, unit: "panel", size: "600 × 3000 mm", material: "WPC", colour: "Black", swatch: slat("#2a2927"), cover: 0.6 }),
  p({ slug: "acoustic-oak-felt", name: "Acoustic Panel, Oak on Black Felt", category: "wpc", sub: "acoustic", price: 8900, unit: "panel", size: "600 × 2400 × 21 mm", material: "WPC + PET felt", colour: "Wood", swatch: slat("#c49a6c"), cover: 0.6 }),
  p({ slug: "acoustic-walnut-felt", name: "Acoustic Panel, Walnut on Black Felt", category: "wpc", sub: "acoustic", price: 9400, unit: "panel", size: "600 × 2400 × 21 mm", material: "WPC + PET felt", colour: "Wood", swatch: slat("#6b4b37"), cover: 0.6 }),
  p({ slug: "cladding-teak", name: "Outdoor Cladding, Teak", category: "wpc", sub: "outdoor-cladding", price: 2950, unit: "panel", size: "219 × 2900 × 26 mm", material: "Co-extruded WPC", colour: "Wood", swatch: slat("#9a6a42"), cover: 0.219 }),
  p({ slug: "cladding-anthracite", name: "Outdoor Cladding, Anthracite", category: "wpc", sub: "outdoor-cladding", price: 2950, unit: "panel", size: "219 × 2900 × 26 mm", material: "Co-extruded WPC", colour: "Grey", swatch: slat("#4a4b4c"), cover: 0.219 }),
  p({ slug: "decking-coffee", name: "Decking Board, Coffee", category: "wpc", sub: "decking", price: 3400, unit: "piece", size: "140 × 2900 × 25 mm", material: "WPC", colour: "Wood", swatch: "repeating-linear-gradient(0deg,#6e4c35 0 22px,#3e2a1d 22px 24px)" }),
  // Marble
  p({ slug: "uv-marble-statuario", name: "UV Marble Sheet, Statuario", category: "marble-sheets", sub: "high-gloss", price: 5800, unit: "sheet", size: "1220 × 2440 × 3 mm", material: "PVC + UV coat", colour: "White", swatch: "url(/swatches/marble_statuario.jpg) center/cover", cover: 1.22, badge: "Bestseller" }),
  p({ slug: "uv-marble-nero", name: "UV Marble Sheet, Nero Marquina", category: "marble-sheets", sub: "high-gloss", price: 6200, unit: "sheet", size: "1220 × 2440 × 3 mm", material: "PVC + UV coat", colour: "Black", swatch: "url(/swatches/marble_nero.jpg) center/cover", cover: 1.22 }),
  p({ slug: "uv-marble-travertine", name: "Satin Sheet, Travertine", category: "marble-sheets", sub: "matte", price: 5600, unit: "sheet", size: "1220 × 2440 × 3 mm", material: "PVC", colour: "Beige", swatch: "url(/swatches/travertine.jpg) center/cover", cover: 1.22 }),
  p({ slug: "book-matched-calacatta", name: "Book-Matched Pair, Calacatta", category: "marble-sheets", sub: "book-matched", price: 12900, unit: "sheet", size: "2 × 1220 × 2440 mm", material: "PVC + UV coat", colour: "White", swatch: "url(/swatches/marble_statuario.jpg) center/180%", cover: 2.44, badge: "New" }),
  // Jaali
  p({ slug: "jaali-shalimar-walnut", name: "Jaali Sheet, Shalimar Walnut", category: "jaali", sub: "mdf-jaali", price: 14500, unit: "sheet", size: "1220 × 2440 × 12 mm", material: "MDF, walnut veneer", colour: "Wood", swatch: "radial-gradient(circle,#f3cf9c 30%,#5b3d2b 32% 40%,#f3cf9c 42%) 0 0/16px 16px", cover: 1.22, badge: "Made in Karachi" }),
  p({ slug: "jaali-mughal-ivory", name: "Jaali Sheet, Mughal Ivory", category: "jaali", sub: "mdf-jaali", price: 12900, unit: "sheet", size: "1220 × 2440 × 12 mm", material: "MDF, lacquered", colour: "White", swatch: "radial-gradient(circle,#b98a5c 30%,#f4eee4 32% 40%,#b98a5c 42%) 0 0/16px 16px", cover: 1.22, badge: "Made in Karachi" }),
  p({ slug: "jaali-pvc-white", name: "PVC Jaali, Star Lattice White", category: "jaali", sub: "pvc-jaali", price: 8900, unit: "sheet", size: "1220 × 2440 × 8 mm", material: "PVC foam board", colour: "White", swatch: "radial-gradient(circle,#cfc9bf 30%,#f7f5f1 32% 40%,#cfc9bf 42%) 0 0/14px 14px", cover: 1.22 }),
  p({ slug: "divider-oak-slat", name: "Slat Room Divider, Oak", category: "jaali", sub: "dividers", price: 24500, unit: "piece", size: "900 × 2700 mm, framed", material: "Solid wood + WPC", colour: "Wood", swatch: slat("#c49a6c") }),
  // Wallpaper & adhesive
  p({ slug: "wallpaper-damask-champagne", name: "Wallpaper, Damask Champagne", category: "wallpaper", sub: "wallpaper", price: 3200, unit: "roll", size: "0.53 × 10 m roll", material: "Non-woven", colour: "Beige", swatch: solid("#d9c8ad", "#b9a587"), cover: 0.53 }),
  p({ slug: "wallpaper-linen-stone", name: "Wallpaper, Linen Stone", category: "wallpaper", sub: "wallpaper", price: 2900, unit: "roll", size: "0.53 × 10 m roll", material: "Non-woven", colour: "Grey", swatch: solid("#cdc8bf", "#aaa49a"), cover: 0.53 }),
  p({ slug: "adhesive-terrazzo", name: "Adhesive Sheet, Terrazzo", category: "wallpaper", sub: "adhesive-sheets", price: 950, unit: "roll", size: "0.6 × 3 m roll", material: "Self-adhesive vinyl", colour: "White", swatch: "url(/swatches/terrazzo.jpg) center/160%", cover: 0.6 }),
  p({ slug: "adhesive-sage-linen", name: "Adhesive Sheet, Sage Linen", category: "wallpaper", sub: "adhesive-sheets", price: 850, unit: "roll", size: "0.6 × 3 m roll", material: "Self-adhesive vinyl", colour: "Green", swatch: solid("#a3ae95", "#8b977e"), cover: 0.6 }),
  // Accessories
  p({ slug: "trim-end-cap-black", name: "Panel End Cap, Matte Black", category: "accessories", sub: "trims", price: 450, unit: "piece", size: "2900 mm", material: "Aluminium", colour: "Black", swatch: solid("#2a2927", "#111") }),
  p({ slug: "trim-corner-gold", name: "Outside Corner Trim, Brushed Gold", category: "accessories", sub: "trims", price: 650, unit: "piece", size: "2900 mm", material: "Aluminium", colour: "Gold", swatch: solid("#d8bd85", "#a8894e") }),
  p({ slug: "skirting-black-80", name: "Skirting, Black 80 mm", category: "accessories", sub: "trims", price: 520, unit: "piece", size: "80 × 2900 mm", material: "PVC", colour: "Black", swatch: solid("#2a2927", "#111") }),
  p({ slug: "led-profile-recessed", name: "Recessed LED Profile with Diffuser", category: "accessories", sub: "led", price: 1150, unit: "piece", size: "2 m, 3000K strip included", material: "Aluminium", colour: "Silver", swatch: "linear-gradient(90deg,#c9c9c7,#fff6dd 45% 55%,#c9c9c7)", badge: "New" }),
  p({ slug: "panel-adhesive-310", name: "Panel Adhesive, 310 ml", category: "accessories", sub: "fixings", price: 650, unit: "piece", size: "310 ml cartridge", material: "MS polymer", colour: "White", swatch: solid("#f2f1ee", "#d9d7d2") }),
];

/* short, consistent product copy so every page reads properly */
for (const x of PRODUCTS) if (!x.desc) {
  const c = CATEGORIES.find((k) => k.slug === x.category)!, s = c.subs.find((k) => k.slug === x.sub)!;
  x.desc = `${s.blurb} ${x.size}, ${x.material.toLowerCase()}. Sold per ${x.unit}, delivered all over Pakistan, with free measuring and fitting in Karachi.`;
}

export const categoryBySlug = (s: string) => CATEGORIES.find((c) => c.slug === s);
export const productBySlug = (s: string) => PRODUCTS.find((x) => x.slug === s);
export const productsIn = (cat?: string, sub?: string) => PRODUCTS.filter((x) => (!cat || x.category === cat) && (!sub || x.sub === sub));
export const fromPrice = (cat: string, sub?: string) => Math.min(...productsIn(cat, sub).map((x) => x.price));
export const BESTSELLERS = PRODUCTS.filter((x) => x.badge === "Bestseller");
export const pkr = (n: number) => "Rs " + Math.round(n).toLocaleString("en-US");

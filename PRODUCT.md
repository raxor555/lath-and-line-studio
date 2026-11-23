# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Homeowners in Pakistan (Karachi first) redoing a lounge, bedroom, TV wall or entrance. They arrive looking for ideas, compare finishes and prices, and want someone to measure and fit it for them.

## Product Purpose
Lath & Line (placeholder brand) sells interior wall finishes online (PVC fluted panels, WPC slats and cladding, UV marble sheets, CNC jaali, wallpaper and adhesive sheets, trims) and fits them. Success is a visitor adding to cart or booking a free measure.

## Positioning
Supply and fitting from one company: panels delivered all over Pakistan, measured and fitted by the in-house team in Karachi, usually in a day, over the existing wall.

## Operating Context
Shoppers browse on phones as much as desktop. Cash on delivery. Free measuring and fitting in Karachi. A separate 3D visualizer project exists (lath-and-line-visualizer); this site carries no 3D.

## Capabilities and Constraints
- Next.js 16 App Router, Tailwind v4, GSAP + Lenis, zustand cart; deployed on Vercel from master.
- Catalog, prices and copy in `src/lib/catalog.ts`; prices in PKR.
- WhatsApp number is unset (`WHATSAPP_NUMBER` in `src/components/Sections.tsx`).

## Brand Commitments
- Name "Lath & Line" is a placeholder; the slat logo mark in `Nav.tsx` stays.
- Copy is plain, local and specific (Karachi, PKR, cash on delivery).

## Evidence on Hand
- Photos and the hero film are Pexels stock (`public/photos`, `public/video`); swatches from Poly Haven.
- No real projects, reviews, testimonials, phone number, showroom address or client logos. Do not fabricate any of these; keep content as placeholders.

## Product Principles
1. Inspiration first, then the product: show finished rooms before spec sheets.
2. Every finish is one tap from its price and the cart.
3. Fitting is the differentiator: the free measure is always within reach.
4. Fast on a mid-range phone on mobile data.

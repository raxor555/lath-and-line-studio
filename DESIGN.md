---
name: Lath & Line
description: Interior wall finishes, delivered all over Pakistan and fitted in Karachi.
colors:
  clay: "#b25934"
  clay-deep: "#a5512e"
  night: "#13100e"
  bone: "#e7e4df"
  paper: "#f1efeb"
  sand: "#d8d3cb"
  ink: "#1b1612"
  ink-2: "#463c34"
  muted: "#665c54"
  line: "#cfc9c0"
typography:
  display-hero:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(5.6rem, 13.2vw, 13.5rem)"
    fontWeight: 200
    lineHeight: 0.82
    letterSpacing: "-0.07em"
  display:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.8rem, 6.4vw, 6rem)"
    fontWeight: 200
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.6rem, 5.2vw, 5.4rem)"
    fontWeight: 200
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  statement:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 4.4rem)"
    fontWeight: 200
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2rem, 3vw, 2.8rem)"
    fontWeight: 200
    lineHeight: 1
    letterSpacing: "-0.03em"
  price:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "34px"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "-0.03em"
    fontFeature: "\"tnum\""
  body:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: "normal"
  label:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.16em"
rounded:
  none: "0px"
  pill: "9999px"
spacing:
  gutter-sm: "20px"
  gutter: "40px"
  grid-x: "20px"
  grid-y: "56px"
  section: "128px"
  section-lg: "160px"
  chapter-lg: "192px"
  container: "1600px"
components:
  button-primary:
    backgroundColor: "{colors.clay}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 24px 0 28px"
    height: "54px"
  button-primary-hover:
    backgroundColor: "{colors.clay-deep}"
  button-commerce:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "56px"
  button-commerce-hover:
    backgroundColor: "{colors.clay}"
  button-on-night:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 16px 0 20px"
    height: "40px"
  button-on-night-hover:
    backgroundColor: "{colors.clay}"
    textColor: "#ffffff"
  link-underline:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "4px 0"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    height: "56px"
  product-card:
    backgroundColor: "{colors.sand}"
    rounded: "{rounded.none}"
  nav-bar:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    height: "68px"
---

# Design System: Lath & Line

## Overview

**Creative North Star: "A Gallery of Walls"**

The storefront is hung like a gallery, not stocked like a shelf. Full-bleed rooms and finish swatches fill square-cornered frames edge to edge; the structure between them is carried by giant, thin, uppercase Geist and 1px hairline rules, never by boxes. The store alternates between two chapters: night (near-black warm charcoal) for atmosphere, statement and booking, and day (cool stone) for browsing, product detail and checkout. Every surface is flat; depth comes from photography, scrims and the change of chapter.

Density is low and the rhythm is slow: 128–192px between sections, a 1600px container with 20/40px gutters, product grids that breathe (20px across, 56px down). Type does the hierarchy work through scale and weight contrast, from a 13vw extralight wordmark to an 11.5px tracked uppercase label, with almost nothing in between at heavy weights.

Motion is one grammar applied everywhere: heading lines rise out of masks, photo frames wipe open from the bottom, blocks lift into place in batched waves, photos drift against the scroll. All of it uses long expo-out easing and all of it switches off under reduced motion. This system replaced an earlier rounded-card look; rounded containers and boxed stat or feature tiles are the confirmed anti-reference.

**Key Characteristics:**
- Two chapters: night (#13100e) and cool stone (#e7e4df), never cream.
- Square-cornered photography and swatches, full-bleed or in hairline-ruled grids.
- Thin uppercase display type (Geist 200) with negative tracking; tracked uppercase labels.
- 1px hairlines (ink at 15%, white at 12–15%) as the only structural device.
- Pill buttons for actions, drawn underlines for everything secondary.
- One GSAP motion grammar opted into by data attributes.

## Colors

A warm-neutral two-chapter palette with a single terracotta accent reserved for action.

### Primary
- **Fired Clay** (#b25934): the free-measure call to action (hero, measure form, mobile menu), the hover state of every ink or white pill, the focus ring, the text caret, the radio accent and the third slat of the logo mark. It never fills a surface or a section.
- **Deep Clay** (#a5512e): hover for clay-filled pills only.

### Neutral
- **Night Charcoal** (#13100e): night chapters (statement, room ideas, booking, footer), the mega menu, the mobile menu sheet, the drawer scrim at 50%, and the browser theme colour. White text sits on it at stepped opacities (90 / 75 / 70 / 55 / 45).
- **Cool Stone** (#e7e4df): the page ground and day chapters; the scrolled nav at 90% with background blur; the cart drawer.
- **Paper** (#f1efeb): text on ink pills, the light logo mark, and selection text.
- **Sand** (#d8d3cb): the placeholder fill behind photo and swatch frames before they load.
- **Ink** (#1b1612): primary text, commerce pills, selection background, tab and range underlines. As hairlines it is used at 15% (rules, list dividers), 10% (nav and toolbar borders) and 25–30% (input underlines).
- **Ink Second** (#463c34): body copy and supporting paragraphs on stone.
- **Muted Umber** (#665c54): metadata, breadcrumbs, units, inactive tabs.
- **Hairline Stone** (#cfc9c0): rules inside the cart drawer and its quantity stepper.

### Named Rules
**The Clay Is an Action Rule.** Clay fills only the book-a-measure pill; on every other control it appears as a hover or focus state. If clay is sitting still on a non-measure element, it is wrong (the logo slat is the one fixed exception).

**The Two Chapters Rule.** A section is either night or stone; there is no third surface colour and no tinted card on either.

## Typography

**Display Font:** Geist (with Helvetica Neue, Arial, sans-serif)
**Body Font:** Geist (same family)
**Label Font:** Geist, uppercase and tracked

**Character:** One family carries everything; contrast comes from scale, case and weight (200 for display, 300 for prices and statement detail, 400 for reading text and labels). Display is uppercase and tight; reading text is sentence case and open.

### Hierarchy
- **Display Hero** (200, clamp(5.6rem, 13.2vw, 13.5rem), 0.82, -0.07em, uppercase): the home wordmark only. The footer repeats the wordmark at clamp(3.4rem, 15.6vw, 16rem), 0.8, -0.06em.
- **Display** (200, clamp(2.8rem, 6.4vw, 6rem), 0.9, -0.04em, uppercase): section and page headings. Page titles scale up to clamp(3rem, 8.4vw, 8rem); the booking and collections headings to about 8.5rem. Headings often cap at 11–12ch.
- **Headline** (200, clamp(1.6rem, 5.2vw, 5.4rem), 0.95, -0.04em, uppercase): collection index rows and product names (clamp(2.2rem, 3.6vw, 3.6rem)).
- **Statement** (200, clamp(2rem, 4.2vw, 4.4rem), 1.08, -0.035em, sentence case, max 24ch): the night manifesto paragraph, revealed word by word on scroll.
- **Title** (200, clamp(2rem, 3vw, 2.8rem), 1, -0.03em, uppercase): process steps, mega-menu rows (28px), drawer heading (26px), room captions (clamp(1.3rem, 2vw, 1.8rem)).
- **Price** (300, 34px, -0.03em, tabular figures): product price; subtotals at 22–26px in the same voice.
- **Body** (400, 15–17px, 1.625): paragraphs, capped at 24–34rem. 14px for lists, specs and cart lines; 12–13px for fine print.
- **Label** (400, 11.5px, 1.2, 0.16em, uppercase): navigation, buttons, links, metadata, breadcrumbs, spec keys. The logo wordmark is 13px at 0.3em.

### Named Rules
**The Thin Shout Rule.** Large type is always light (200–300) and uppercase with negative tracking; heavy weights do not appear at display sizes.

**The Label Voice Rule.** Every control and every piece of metadata speaks in the 11.5px tracked uppercase label; body text never carries actions.

## Layout

A single 1600px container with 20px gutters on phones and 40px from 640px up. Sections are separated by generous vertical space: 128px for day sections, 160px from 640px, and 144–192px for night chapters. Headings and their supporting paragraph sit on a two-column split (`1fr auto`, bottom-aligned) from 1024px, with the paragraph capped near 24–26rem.

Product grids are two columns on phones, three at 768px and four at 1024px, with 20px between columns and 56px between rows. Product detail splits 1.25fr gallery to 1fr buy column, and the buy column sticks at 124px from the top. Key/value lists use a fixed key column (110–160px). Room ideas become a pinned horizontal track from 900px and a snap-scrolling strip below it.

The nav is a fixed three-zone grid (`1fr auto 1fr`, 68px) under a 32px service line. On home it floats transparent over the film, takes the night colour while the mega menu is open, becomes stone at 90% with blur once scrolled, and hides on scroll down.

## Elevation & Depth

The system is flat. No surface casts a shadow; there are no cards to lift. Depth comes from three things only: photography filling its frame, gradient scrims over film and photos (night at 38–80% from the reading edge), and the switch between night and stone chapters. The one translucent material is the scrolled nav: stone at 90% with a heavy background blur.

### Named Rules
**The Flat Wall Rule.** Nothing rests on top of anything. Overlays (mega menu, mobile sheet, cart drawer) arrive by clip-path or translate, not by shadow.

## Shapes

Two shapes only. Every frame (photo, swatch, room, hero, drawer, input) is square-cornered. Every action (buttons, the quantity stepper on the product page, the confirmation tick, the marquee dot) is a full pill or circle. Structure is drawn with 1px hairlines: top and bottom rules on lists, dividers between steps, underlines under inputs and active tabs. Product frames are 4:5 portrait; swatch close-ups and order thumbnails are square.

## Components

### Buttons
Confident pills against flat walls; secondary actions are never buttons.
- **Shape:** full pill (9999px), 54–56px tall, label typography, trailing up-right arrow icon.
- **Primary (measure):** clay fill, white label, 28px left / 24px right padding; hover darkens to deep clay over 300ms.
- **Commerce (add to cart, checkout, place order):** ink fill, paper label, full width or flex-grow; hover turns clay.
- **On night:** white fill, ink label, 40px tall in the nav; hover turns clay with white text.
- **Focus:** 2px clay outline, 3px offset, everywhere.

### Underline Links
- **Style:** label typography, no background. `draw` links grow a 1px underline from the left on hover (500ms, expo-out); `draw-on` links start underlined and retract to 40% on hover.
- **Use:** every secondary action ("Shop all products", "How fitting works", filters, the add-to-cart text button on cards).

### Inputs / Fields
- **Style:** transparent, square, 56px tall, 1px bottom border only (ink at 25–30% on stone, white at 25% on night), 16–17px text.
- **Focus:** the underline goes to full ink (or full white); the global clay focus ring applies.
- **Choice lists:** payment options are hairline-ruled rows with a clay radio accent; selected text is ink, others muted.

### Product Card
- **Frame:** 4:5, square corners, sand placeholder, the product's own rendered swatch filling the frame; on hover the room it is used in fades in over the swatch and the swatch scales to 1.04.
- **Caption:** range as a 10.5px label in muted, name at 15px, price at 14px tabular with the unit in muted, and a "Add +" draw link to the right.

### Hairline Lists and Tabs
- **Lists:** specs, perks, process steps and the collection index all use ink-15% top and bottom rules with no fill.
- **Tabs:** label text with a 1px ink underline that scales in from the left on hover and stays on for the current page.

### Navigation
- **Style:** three-zone bar, label typography at 75–80% opacity rising to 100% on hover, cart as a text count, book-a-measure as a pill on the right.
- **Mega menu:** night panel opened by a clip-path wipe; collections as 28px extralight rows that indent on hover, the hovered collection's ranges with prices, and its 4:5 room photo crossfading.
- **Mobile:** full-screen night sheet with collections as disclosure rows and a full-width clay pill at the bottom.

### Collection Index (signature)
The collections as huge type rows (headline scale) between ink-15% hairlines, each with its range count and "from" price. On desktop the hovered row indents 24px while the others dim to 35%, and a 320 by 400px room photo follows the cursor (GSAP quickTo, 0.6s expo-out), scaling up from 0.6 as it appears. On phones each row carries a 64px square thumbnail instead.

### Motion Grammar
Opted into with data attributes, run once per page, disabled under reduced motion: `data-lines` (heading lines rise 105% out of a mask, 1.2s expo-out, 0.09s stagger), `data-wipe` (frame opens from the bottom over 1.4s while the photo settles from 1.15x), `data-rise` (32px lift, 1s, batched with 0.08s stagger), `data-drift` (photo moves -8% to 8% with the scroll). CSS transitions use the expo-out curve at 500–700ms.

## Do's and Don'ts

### Do:
- **Do** alternate night (#13100e) and stone (#e7e4df) chapters; give every section 128px or more of vertical space.
- **Do** set headings in Geist 200, uppercase, with negative tracking (-0.03em to -0.07em) and line-height under 1.
- **Do** put every control and metadata line in the 11.5px, 0.16em tracked uppercase label.
- **Do** frame photos and swatches with square corners, 4:5 for products and rooms, filling the frame.
- **Do** separate content with 1px hairlines (ink at 15%, white at 12–15%) instead of fills or boxes.
- **Do** make actions pills and secondary actions drawn-underline links.
- **Do** animate with the data-lines / data-wipe / data-rise / data-drift grammar and expo-out easing, and honour reduced motion.

### Don't:
- **Don't** use rounded cards, rounded photo frames or boxed stat and feature tiles; this system replaced exactly that look.
- **Don't** fill anything with clay except the book-a-measure pill; elsewhere clay is hover and focus only.
- **Don't** add drop shadows to surfaces, cards or buttons.
- **Don't** introduce a third surface colour or a tinted card on either chapter.
- **Don't** set display type in heavy weights or sentence-case display headings (the night statement paragraph is the one sentence-case large text).

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { productBySlug } from "./catalog";

export type Line = { slug: string; qty: number };
type Cart = {
  lines: Line[];
  open: boolean;
  /** increments on every add, so the nav can pulse the cart count */
  pulse: number;
  /** add one or more lines; `open` slides the drawer in (the product page does, quick add doesn't) */
  add: (slug: string, qty?: number, open?: boolean) => void;
  addMany: (items: Line[], open?: boolean) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

const merge = (lines: Line[], items: Line[]) => {
  const out = lines.map((l) => ({ ...l }));
  for (const it of items) {
    const hit = out.find((l) => l.slug === it.slug);
    if (hit) hit.qty += it.qty; else out.push({ ...it });
  }
  return out;
};

export const useCart = create<Cart>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      pulse: 0,
      add: (slug, qty = 1, open = true) => set((s) => ({ open: open || s.open, pulse: s.pulse + 1, lines: merge(s.lines, [{ slug, qty }]) })),
      addMany: (items, open = true) => set((s) => ({ open: open || s.open, pulse: s.pulse + 1, lines: merge(s.lines, items.filter((i) => i.qty > 0)) })),
      setQty: (slug, qty) => set((s) => ({ lines: qty <= 0 ? s.lines.filter((l) => l.slug !== slug) : s.lines.map((l) => (l.slug === slug ? { ...l, qty } : l)) })),
      remove: (slug) => set((s) => ({ lines: s.lines.filter((l) => l.slug !== slug) })),
      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ open }),
    }),
    {
      name: "ll-cart-v1",
      // storage can be unavailable (private mode, blocked site data); the cart then just lives in memory
      storage: createJSONStorage(() => { try { return localStorage; } catch { return sessionStorage; } }),
      partialize: (s) => ({ lines: s.lines }),
      skipHydration: true,
    },
  ),
);

export const cartTotals = (lines: Line[]) => {
  let count = 0, total = 0;
  for (const l of lines) { const p = productBySlug(l.slug); if (!p) continue; count += l.qty; total += p.price * l.qty; }
  return { count, total };
};

/* recently viewed finishes, newest first, kept on this device */
type Recent = { slugs: string[]; see: (slug: string) => void };
export const useRecent = create<Recent>()(
  persist(
    (set) => ({ slugs: [], see: (slug) => set((s) => ({ slugs: [slug, ...s.slugs.filter((x) => x !== slug)].slice(0, 8) })) }),
    { name: "ll-recent-v1", storage: createJSONStorage(() => { try { return localStorage; } catch { return sessionStorage; } }), skipHydration: true },
  ),
);

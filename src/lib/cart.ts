import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { productBySlug } from "./catalog";

export type Line = { slug: string; qty: number };
type Cart = {
  lines: Line[];
  open: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

export const useCart = create<Cart>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      add: (slug, qty = 1) => set((s) => {
        const hit = s.lines.find((l) => l.slug === slug);
        return { open: true, lines: hit ? s.lines.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l)) : [...s.lines, { slug, qty }] };
      }),
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

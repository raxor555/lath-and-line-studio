/** Phones and small tablets. Decides which copy of each 3D file loads (the `_m` copies are half size) and which
 *  set the visualizer's one-time download fetches. One rule, shared, so the two always agree. */
export const LITE = typeof window !== "undefined" && (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 820);

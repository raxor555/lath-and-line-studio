"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Hand, Lamp, Lightbulb, Minus, MoveHorizontal, Plus, ShoppingBag, Sun } from "lucide-react";
import { tour, useTour, type LightGroup } from "@/lib/tour-store";
import { FINISHES, WALLS, WALL_HEIGHT, estimate, finishById, money, supportsDirection, type WallId } from "@/lib/finishes";

export default function DesignPanel() {
  const designOn = useTour((s) => s.designOn);
  const active = useTour((s) => s.active);
  const cfg = useTour((s) => s.walls[s.active]);
  const { setActive, update, setFinish } = useTour.getState();
  const [added, setAdded] = useState(false);
  const f = finishById(cfg.pid);
  const est = estimate(cfg);
  const len = WALLS[active].length;
  const lim = (len - cfg.width) / 2;
  const maxW = f ? Math.floor((len - 0.02) / f.module) * f.module : len;

  const add = () => { setAdded(true); setTimeout(() => setAdded(false), 2200); };
  const lights = useTour((s) => s.lights);
  const collections = useMemo(() => [...new Set(FINISHES.map((x) => x.collection))], []);
  const [tab, setTab] = useState<string | null>(null);
  const shown = tab ? FINISHES.filter((x) => x.collection === tab) : FINISHES;

  /* drag a swatch onto a wall: past a few pixels of travel it becomes a drag, otherwise it's a click */
  const [drag, setDrag] = useState<{ pid: string; bg: string; x: number; y: number } | null>(null);
  const press = useRef<{ pid: string; bg: string; x0: number; y0: number; moved: boolean } | null>(null);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const p = press.current; if (!p) return;
      if (!p.moved && Math.hypot(e.clientX - p.x0, e.clientY - p.y0) > 8) p.moved = true;
      if (p.moved) setDrag({ pid: p.pid, bg: p.bg, x: e.clientX, y: e.clientY });
    };
    const up = (e: PointerEvent) => {
      const p = press.current; press.current = null; if (!p) return;
      setDrag(null);
      if (!p.moved) { setFinish(useTour.getState().active, p.pid); return; }
      // dropped on the 3D view: put it on whichever wall is under the pointer, else on the selected wall
      if (!tour.drop(e.clientX, e.clientY, p.pid)) setFinish(useTour.getState().active, p.pid);
    };
    // a touch that turns into scrolling the strip is cancelled by the browser: forget the press
    const cancel = () => { press.current = null; setDrag(null); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", cancel);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", cancel); };
  }, [setFinish]);
  const grab = (pid: string, bg: string) => (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    press.current = { pid, bg, x0: e.clientX, y0: e.clientY, moved: false };
  };
  const LIGHT_UI: [LightGroup, string, typeof Sun][] = [["day", "Daylight", Sun], ["spots", "Wall spots", Lightbulb], ["lamps", "Lamps", Lamp]];

  return (
    <div className={`absolute inset-0 transition-opacity duration-500 ${designOn ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!designOn}>
      {/* wall switch */}
      <div className={`absolute left-4 top-[calc(env(safe-area-inset-top)+96px)] sm:left-8 ${designOn ? "pointer-events-auto" : ""}`}>
        <h2 className="mb-3 hidden text-[clamp(1.8rem,2.6vw,2.6rem)] font-light leading-none tracking-[-0.035em] text-ink lg:block">Pick a wall. Pick a finish.</h2>
        <div className="glass inline-flex gap-1 rounded-2xl p-1" role="group" aria-label="Wall">
          {(Object.keys(WALLS) as WallId[]).map((id) => (
            <button key={id} onClick={() => setActive(id)} aria-pressed={active === id}
              className={`h-10 rounded-xl px-4 text-[14px] transition ${active === id ? "bg-ink text-paper" : "text-ink-2 hover:bg-white/70"}`}>
              {WALLS[id].label}
            </button>
          ))}
        </div>
        {/* light switches: the bake has each group separately, so switching one off removes its bounce light too */}
        <div className="glass mt-2 flex w-max gap-1 rounded-2xl p-1" role="group" aria-label="Lights">
          {LIGHT_UI.map(([g, label, Icon]) => (
            <button key={g} onClick={() => useTour.getState().toggleLight(g)} aria-pressed={lights[g]}
              className={`inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-[13px] transition ${lights[g] ? "bg-white text-ink shadow-sm" : "text-ink-2/70 hover:bg-white/60"}`}>
              <Icon className={`size-4 ${lights[g] ? "text-clay" : ""}`} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* estimate card */}
      <aside data-lenis-prevent className={`glass absolute right-4 top-[calc(env(safe-area-inset-top)+96px)] w-[340px] overflow-auto rounded-3xl p-5 lg:max-h-[calc(100svh-env(safe-area-inset-top)-96px-210px)] max-lg:inset-x-4 max-lg:bottom-[226px] max-lg:top-auto max-lg:max-h-[36svh] max-lg:w-auto sm:right-8 ${designOn ? "pointer-events-auto" : ""}`} aria-label="Finish and estimate">
        <p className="font-mono text-[12px] text-clay">{f ? f.collection : WALLS[active].label}</p>
        <h3 className="mt-1 text-[28px] font-light leading-tight tracking-[-0.03em]">{f ? f.name : "Plain plaster"}</h3>
        <p className="font-mono text-[12px] text-muted">{f ? `${f.size} · ${money(f.price)} / ${f.unit}` : "Choose a finish below"}</p>

        {f && (
          <div className="mt-5 grid gap-4">
            <div>
              <div className="flex items-baseline justify-between text-[13px] text-ink-2"><span>Width</span><span className="font-mono">{cfg.width.toFixed(2)} m</span></div>
              <div className="mt-1 flex items-center gap-2">
                <button aria-label="Narrower" onClick={() => update(active, { width: cfg.width - f.module })} className="grid size-9 shrink-0 place-items-center rounded-full bg-white/80 hover:bg-white"><Minus className="size-4" /></button>
                <input className="range" type="range" aria-label="Width" min={f.module} max={maxW} step={f.module} value={cfg.width} onChange={(e) => update(active, { width: +e.target.value })} />
                <button aria-label="Wider" onClick={() => update(active, { width: cfg.width + f.module })} className="grid size-9 shrink-0 place-items-center rounded-full bg-white/80 hover:bg-white"><Plus className="size-4" /></button>
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between text-[13px] text-ink-2"><span>Position</span><span className="inline-flex items-center gap-1 text-muted"><MoveHorizontal className="size-3.5" /> or drag on the wall</span></div>
              <input className="range mt-1" type="range" aria-label="Position on wall" min={-1} max={1} step={0.01} disabled={lim <= 0.001} value={lim > 0 ? cfg.center / lim : 0} onChange={(e) => update(active, { center: +e.target.value * lim })} />
            </div>
            <div className="inline-flex w-max gap-1 rounded-2xl bg-white/70 p-1" role="group" aria-label="Direction">
              {(["v", "h"] as const).map((d) => (
                <button key={d} disabled={!supportsDirection(f)} onClick={() => update(active, { dir: d })} aria-pressed={cfg.dir === d}
                  className={`h-9 rounded-xl px-4 text-[13px] transition disabled:opacity-40 ${cfg.dir === d ? "bg-ink text-paper" : "text-ink-2"}`}>
                  {d === "v" ? "Vertical" : "Horizontal"}
                </button>
              ))}
            </div>
            {est && (
              <div className="rounded-2xl bg-white/70 p-4" aria-live="polite">
                <dl className="grid grid-cols-[1fr_auto] gap-y-1.5 text-[13px]">
                  <dt className="text-muted">Covered area</dt><dd className="text-right font-mono">{cfg.width.toFixed(2)} × {WALL_HEIGHT.toFixed(2)} m</dd>
                  <dt className="text-muted">You need</dt><dd className="text-right font-mono">{est.qty} {est.finish.unit}{est.qty === 1 ? "" : "s"}</dd>
                  <dt className="text-muted">Trims</dt><dd className="text-right font-mono">2 end profiles</dd>
                </dl>
                <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
                  <span className="text-[13px] text-muted">Estimate</span>
                  <strong className="text-[30px] font-light tracking-[-0.03em]">{money(est.total)}</strong>
                </div>
              </div>
            )}
            <button onClick={add} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-ink text-[15px] font-medium text-paper transition hover:bg-black">
              <ShoppingBag className="size-4" /> Add {est?.qty} to cart
            </button>
            {added && <p role="status" className="flex items-center gap-1.5 text-[12px] text-muted"><Check className="size-3.5" /> Checkout goes live once the store is connected.</p>}
          </div>
        )}
      </aside>

      {/* category tabs over the finish strip */}
      <div data-lenis-prevent className={`no-scrollbar absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+188px)] flex items-center gap-1.5 overflow-x-auto px-4 sm:px-8 ${designOn ? "pointer-events-auto" : ""}`} role="tablist" aria-label="Panel categories">
        {[null, ...collections].map((c) => (
          <button key={c ?? "all"} role="tab" aria-selected={tab === c} onClick={() => setTab(c)}
            className={`h-8 shrink-0 rounded-full px-3.5 text-[12.5px] transition ${tab === c ? "bg-ink text-paper" : "glass text-ink-2 hover:text-ink"}`}>
            {c ?? "All finishes"}
          </button>
        ))}
        <span className="ml-2 hidden shrink-0 items-center gap-1.5 text-[12px] text-ink-2 sm:inline-flex [text-shadow:0_1px_6px_rgb(255_255_255/0.6)]"><Hand className="size-3.5" /> Drag a finish onto a wall</span>
      </div>

      {/* finish strip */}
      <div data-lenis-prevent className={`no-scrollbar absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+58px)] flex gap-2.5 overflow-x-auto px-4 pb-2 sm:px-8 ${designOn ? "pointer-events-auto" : ""}`} role="group" aria-label="Finishes">
        <Swatch label="Plain wall" sub="Remove finish" bg="linear-gradient(135deg,#f3efe9,#e2dbd1)" on={!cfg.pid} onClick={() => setFinish(active, null)} />
        {shown.map((x) => (
          <Swatch key={x.id} label={x.name} sub={x.collection} bg={x.swatch} on={cfg.pid === x.id} onPointerDown={grab(x.id, x.swatch)}
            onClick={(e) => { if (e.detail === 0) setFinish(active, x.id); /* keyboard; pointer presses are handled on release */ }} />
        ))}
      </div>

      {/* the finish being dragged follows the pointer */}
      {drag && (
        <span className="pointer-events-none fixed z-50 size-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-white shadow-2xl"
          style={{ left: drag.x, top: drag.y, background: drag.bg, backgroundSize: "cover" }} />
      )}
    </div>
  );
}

function Swatch({ label, sub, bg, on, onClick, onPointerDown }: { label: string; sub: string; bg: string; on: boolean; onClick?: (e: React.MouseEvent) => void; onPointerDown?: (e: React.PointerEvent) => void }) {
  return (
    <button onClick={onClick} onPointerDown={onPointerDown} aria-pressed={on} style={{ touchAction: onPointerDown ? "pan-x" : undefined }}
      className={`glass group w-[128px] shrink-0 rounded-2xl p-1.5 text-left transition duration-300 hover:-translate-y-1 ${on ? "ring-2 ring-ink" : ""}`}>
      <span className="block h-[68px] rounded-xl" style={{ background: bg, backgroundSize: "cover" }} />
      <span className="mt-1.5 block px-1 text-[12.5px] font-medium leading-tight">{label}</span>
      <span className="block px-1 pb-1 text-[11px] leading-tight text-muted">{sub}</span>
    </button>
  );
}

"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTour } from "@/lib/tour-store";

/* Keeps a 3D failure from taking the page down with it. Three cases end in the same calm fallback (a photo, a line of
   text and a way on), with the rest of the page still working:
   - the device has no WebGL at all (checked before any 3D is downloaded),
   - the scene throws while loading (an error boundary),
   - the GPU drops the context mid-session, which phones do under memory pressure (offers to try again). */

class Boundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext(); // hand the context straight back
    return !!gl;
  } catch { return false; }
}

export default function SceneGuard({ children }: { children: ReactNode }) {
  const [state, setState] = useState<"checking" | "ok" | "unsupported" | "error" | "lost">("checking");
  const [attempt, setAttempt] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time capability check that needs the DOM
  useEffect(() => { setState(hasWebGL() ? "ok" : "unsupported"); }, []);

  useEffect(() => {
    const el = wrap.current; if (!el || state !== "ok") return;
    // WebGL context events do not bubble, so listen in the capture phase on the wrapper
    const lost = () => setState("lost");
    el.addEventListener("webglcontextlost", lost, true);
    return () => el.removeEventListener("webglcontextlost", lost, true);
  }, [state, attempt]);

  useEffect(() => { if (state !== "ok" && state !== "checking") useTour.getState().setReady(); }, [state]);

  const retry = () => { setAttempt((a) => a + 1); setState("ok"); };

  return (
    <div ref={wrap} className="absolute inset-0">
      {state === "ok" && <Boundary key={attempt} onError={() => setState("error")}>{children}</Boundary>}
      {state !== "ok" && state !== "checking" && (
        <div className="absolute inset-0">
          <Image src="/photos/room-fluted-sofa.jpg" alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[#120d0a]/45" />
          <div className="absolute left-1/2 top-[38%] w-[min(380px,86vw)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-[rgb(247_244_239/0.94)] px-6 py-5 text-center shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)]">
            <p className="font-mono text-[11px] text-clay">Lath &amp; Line · 3D showroom</p>
            <p className="mt-1.5 text-[20px] font-light tracking-[-0.02em] text-ink">
              {state === "lost" ? "The 3D view paused to save memory" : "The 3D view isn't available on this device"}
            </p>
            <p className="mt-2 text-[13px] text-ink-2">Every panel is still in the shop, with photos, sizes and prices.</p>
            <div className="mt-4 flex justify-center gap-2">
              {state === "lost" && (
                <button onClick={retry} className="h-10 rounded-xl border border-ink/20 px-4 text-[14px] font-medium text-ink hover:bg-ink/5">Try again</button>
              )}
              <Link href="/shop" className="inline-flex h-10 items-center rounded-xl bg-ink px-4 text-[14px] font-medium text-paper hover:bg-black">Shop all panels</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

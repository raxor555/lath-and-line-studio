import * as THREE from "three";

/* Procedural textures for the Pakistani details. Drawn once on a canvas: nothing to download, a few ms to build. */

function canvas(w: number, h: number) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  return { c, g: c.getContext("2d")! };
}
function texture(c: HTMLCanvasElement, srgb: boolean, aniso: number) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = aniso;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const star = (g: CanvasRenderingContext2D, cx: number, cy: number, ro: number, ri: number, n = 8, rot = 0) => {
  g.beginPath();
  for (let i = 0; i < n * 2; i++) { const r = i % 2 ? ri : ro, a = rot + (i * Math.PI) / n; g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
  g.closePath();
};

/** Mughal star-and-cross jaali, one repeat per tile. White = solid wood, black = cut-out. */
export function jaaliAlpha(aniso: number) {
  const S = 512, { c, g } = canvas(S, S);
  g.fillStyle = "#000"; g.fillRect(0, 0, S, S);
  g.strokeStyle = "#fff"; g.lineJoin = "miter"; g.lineCap = "square";
  const ri = 0.5 * Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8);
  for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) {
    const cx = (0.5 + ox) * S, cy = (0.5 + oy) * S;
    // main eight-point star whose points meet the neighbours'
    g.lineWidth = S * 0.036; star(g, cx, cy, S * 0.5, S * ri, 8, 0); g.stroke();
    // a smaller star set inside, turned half a point, gives the hand-carved depth
    g.lineWidth = S * 0.022; star(g, cx, cy, S * 0.24, S * 0.185, 8, Math.PI / 8); g.stroke();
    // the diagonal points run into the corners, where they form the cross between stars
    g.lineWidth = S * 0.03;
    for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const t = S * 0.5 * Math.SQRT1_2; g.beginPath(); g.moveTo(cx + dx * t, cy + dy * t); g.lineTo(cx + dx * S * 0.5, cy + dy * S * 0.5); g.stroke();
    }
  }
  const t = texture(c, false, aniso);
  t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}

/** Bokhara-style hand-knotted rug: madder field, rows of guls, layered border, faint abrash banding. */
export function rugTexture(aniso: number) {
  const W = 1380, H = 1020, { c, g } = canvas(W, H);
  const red = "#74211a", navy = "#1e2236", ivory = "#c9b48f", rust = "#9c4e28";
  g.fillStyle = red; g.fillRect(0, 0, W, H);
  // abrash: wool dyed in batches gives soft horizontal colour bands
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let x = 0; x < W; x += 6) { g.fillStyle = `rgba(${rnd() > 0.5 ? "255,240,220" : "40,10,5"},${0.02 + rnd() * 0.05})`; g.fillRect(x, 0, 6 + rnd() * 18, H); }

  const B = 92; // border
  const frame = (inset: number, w: number, col: string) => { g.strokeStyle = col; g.lineWidth = w; g.strokeRect(inset + w / 2, inset + w / 2, W - 2 * inset - w, H - 2 * inset - w); };
  frame(0, 26, navy); frame(26, 5, ivory); frame(B - 12, 5, ivory); frame(B - 7, 9, navy);
  // running diamonds in the main border
  g.fillStyle = navy;
  const dia = (x: number, y: number, r: number, col: string) => { g.fillStyle = col; g.beginPath(); g.moveTo(x, y - r); g.lineTo(x + r, y); g.lineTo(x, y + r); g.lineTo(x - r, y); g.closePath(); g.fill(); };
  for (let x = 70; x < W - 50; x += 44) { dia(x, 56, 15, navy); dia(x, 56, 6, rust); dia(x, H - 56, 15, navy); dia(x, H - 56, 6, rust); }
  for (let y = 100; y < H - 80; y += 44) { dia(56, y, 15, navy); dia(56, y, 6, rust); dia(W - 56, y, 15, navy); dia(W - 56, y, 6, rust); }

  // guls: quartered octagons in a staggered grid, with small minor guls between
  const oct = (x: number, y: number, rx: number, ry: number) => { g.beginPath(); for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + (i * Math.PI) / 4; g.lineTo(x + Math.cos(a) * rx, y + Math.sin(a) * ry); } g.closePath(); };
  const cols = 8, rows = 5, fx = B + 30, fy = B + 30, fw = W - 2 * fx, fh = H - 2 * fy;
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
    const x = fx + (k + 0.5) * (fw / cols), y = fy + (r + 0.5) * (fh / rows), rx = fw / cols * 0.42, ry = fh / rows * 0.36;
    oct(x, y, rx, ry); g.fillStyle = navy; g.fill();
    oct(x, y, rx * 0.84, ry * 0.8); g.fillStyle = red; g.fill();
    g.save(); oct(x, y, rx * 0.84, ry * 0.8); g.clip();
    g.fillStyle = ivory; g.fillRect(x - rx, y - ry, rx, ry); g.fillRect(x, y, rx, ry);
    g.fillStyle = rust; g.fillRect(x, y - ry, rx, ry); g.fillRect(x - rx, y, rx, ry);
    g.restore();
    oct(x, y, rx * 0.84, ry * 0.8); g.lineWidth = 4; g.strokeStyle = navy; g.stroke();
    g.fillStyle = navy; g.fillRect(x - 3, y - ry * 0.8, 6, ry * 1.6); g.fillRect(x - rx * 0.84, y - 3, rx * 1.68, 6);
    dia(x, y, Math.min(rx, ry) * 0.3, rust); dia(x, y, Math.min(rx, ry) * 0.12, navy);
    if (k < cols - 1 && r < rows - 1) { const mx = x + fw / cols / 2, my = y + fh / rows / 2; dia(mx, my, 16, navy); dia(mx, my, 7, ivory); }
  }
  return texture(c, true, aniso);
}

/** Ajrak block print: crimson ground, indigo roundels, white resist dots, black outlines. */
export function ajrakTexture(aniso: number) {
  const S = 256, { c, g } = canvas(S, S);
  const crimson = "#8e1b20", indigo = "#1c2453", white = "#f1e8d6", black = "#141210";
  g.fillStyle = crimson; g.fillRect(0, 0, S, S);
  const medallion = (x: number, y: number) => {
    g.beginPath(); g.arc(x, y, S * 0.36, 0, Math.PI * 2); g.fillStyle = black; g.fill();
    g.beginPath(); g.arc(x, y, S * 0.33, 0, Math.PI * 2); g.fillStyle = indigo; g.fill();
    star(g, x, y, S * 0.27, S * 0.15, 8, Math.PI / 8); g.fillStyle = crimson; g.fill(); g.lineWidth = 3; g.strokeStyle = black; g.stroke();
    star(g, x, y, S * 0.11, S * 0.06, 8, 0); g.fillStyle = indigo; g.fill();
    g.fillStyle = white;
    for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8; g.beginPath(); g.arc(x + Math.cos(a) * S * 0.305, y + Math.sin(a) * S * 0.305, 3.2, 0, Math.PI * 2); g.fill(); }
    for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + (i * Math.PI) / 4; g.beginPath(); g.arc(x + Math.cos(a) * S * 0.19, y + Math.sin(a) * S * 0.19, 2.6, 0, Math.PI * 2); g.fill(); }
    g.beginPath(); g.arc(x, y, 4, 0, Math.PI * 2); g.fill();
  };
  // the centre roundel plus four quarter roundels at the corners make a seamless repeat
  for (const [x, y] of [[0.5, 0.5], [0, 0], [1, 0], [0, 1], [1, 1]]) medallion(x * S, y * S);
  // small white trefoils between roundels
  g.fillStyle = white;
  for (const [x, y] of [[0.5, 0], [0, 0.5], [1, 0.5], [0.5, 1]]) for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2; g.beginPath(); g.arc(x * S + Math.cos(a) * 7, y * S + Math.sin(a) * 7, 3, 0, Math.PI * 2); g.fill(); }
  // cushion faces are ~0.5 m across in UV units: four repeats gives the ~12 cm block of a real ajrak
  const t = texture(c, true, aniso); t.repeat.set(4, 4);
  return t;
}

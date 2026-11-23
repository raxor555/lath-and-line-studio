"""Render one raster swatch per product finish: python scripts/render-swatches.py

Each swatch is real CC0 texture photography from Poly Haven (oak_veneer_01, plastered_wall_04,
concrete_floor_02), cut into the panel's actual profile (flute pitch, slat width, board
joints) and shaded under one raking light from the upper left, the way panels are photographed.
Marble and terrazzo products keep their existing swatches (cropped Pexels photos).
Output: public/swatches/p/<slug>.jpg (720 x 900) plus PROVENANCE.md.
"""
import math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

TEX = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\rayyan\Documents\lath-and-line-visualizer\public\textures"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "swatches", "p")
os.makedirs(OUT, exist_ok=True)
W, H = 720, 900
MM = W / 360.0  # the frame shows 360 mm of wall width

def load(name, scale=1.0):
    im = Image.open(os.path.join(TEX, name, "diff.jpg")).convert("RGB")
    s = max(W / im.width, H / im.height) * scale
    im = im.resize((max(W, int(im.width * s)), max(H, int(im.height * s))), Image.LANCZOS)
    return np.asarray(im.crop((0, 0, W, H)), dtype=np.float32) / 255.0

def hexrgb(h):
    h = h.lstrip("#"); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255.0

def tint(tex, colour, keep=0.55):
    """Keep the texture's grain (luminance detail) but move its average to the product colour."""
    lum = tex.mean(axis=2, keepdims=True)
    detail = lum / max(lum.mean(), 1e-3)
    c = hexrgb(colour)
    return np.clip(c * (1 - keep + keep * detail), 0, 1)

def recolour(tex, colour, amount=0.6):
    mean = tex.reshape(-1, 3).mean(axis=0)
    return np.clip(tex * ((1 - amount) + amount * hexrgb(colour) / np.maximum(mean, 1e-3)), 0, 1)

def light(img, shade):
    return np.clip(img * shade[..., None], 0, 1)

def vignette(img, k=0.18):
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    d = ((x / W - 0.35) ** 2 + (y / H - 0.3) ** 2) ** 0.5
    return np.clip(img * (1 - k * d)[..., None] * 1.04, 0, 1)

def columns(pitch_mm, profile):
    """Per-column shading for a vertical relief. profile(t) -> brightness for t in [0,1) across one pitch."""
    x = np.arange(W) / MM
    t = (x % pitch_mm) / pitch_mm
    row = np.array([profile(v) for v in t], dtype=np.float32)
    return np.tile(row, (H, 1))

def rows(pitch_mm, profile):
    y = np.arange(H) / MM
    t = (y % pitch_mm) / pitch_mm
    col = np.array([profile(v) for v in t], dtype=np.float32)
    return np.tile(col[:, None], (1, W))

# --- profiles (light from the left) --------------------------------------------------------------
def flute(t):  # half-round flute in matte PVC: soft shoulder light, a shallow shadowed valley
    a = (t - 0.5) * math.pi
    s = 0.9 + 0.13 * -math.sin(a)  # left side faces the light
    if t < 0.05 or t > 0.97: s *= 0.82
    return s
def halfround(t):
    a = (t - 0.5) * math.pi
    s = 0.88 + 0.17 * -math.sin(a) * math.cos(a * 0.5)
    if t < 0.04 or t > 0.98: s *= 0.78
    return s
def louver(t):  # flat board with a deep shadow groove
    if t < 0.08: return 0.28
    if t < 0.12: return 0.6
    return 1.02 - 0.08 * t
def slat_on(gap, gapshade=0.12):
    def f(t):
        if t > 1 - gap: return gapshade
        u = t / (1 - gap)
        return 1.06 if u < 0.12 else (0.86 if u > 0.88 else 0.98)
    return f
def board(t):
    return 0.35 if t < 0.012 else 1.0

# --- material sources ----------------------------------------------------------------------------
oak = load("oak_veneer_01", 0.9)
plaster = load("plastered_wall_04", 0.8)
concrete = load("concrete_floor_02", 0.9)
rng = np.random.default_rng(7)

def wood(colour):
    # the oak photo carries the most grain; darker woods are the same grain, recoloured and given more contrast
    if hexrgb(colour).mean() < 0.42:
        lum = oak.mean(axis=2, keepdims=True); d = (lum / lum.mean()) ** 1.6
        return np.clip(hexrgb(colour) * (0.25 + 0.75 * d), 0, 1)
    return recolour(oak, colour, 0.75)

def matte(colour):
    """Moulded PVC: the plaster photo's surface at full strength plus a fine grain, so it reads matte at card size."""
    fine = rng.normal(0, 1, (H, W)).astype(np.float32)
    fine = np.asarray(Image.fromarray(((fine * 22) + 128).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)), dtype=np.float32) / 255 - 0.5
    return np.clip(tint(plaster, colour, 0.7) * (1 + 0.09 * fine)[..., None], 0, 1)

def felt():
    n = rng.normal(0, 1, (H // 2, W // 2)).astype(np.float32)
    n = np.asarray(Image.fromarray(((n * 18) + 40).clip(0, 255).astype(np.uint8)).resize((W, H)).filter(ImageFilter.GaussianBlur(0.7)), dtype=np.float32) / 255
    return np.repeat(n[..., None], 3, axis=2) * np.array([1.0, 0.97, 0.93])

def linen(colour):
    weft = rng.normal(0, 1, (H, 1)).astype(np.float32) * 0.05
    warp = rng.normal(0, 1, (1, W)).astype(np.float32) * 0.05
    fine = rng.normal(0, 1, (H, W)).astype(np.float32) * 0.025
    return np.clip(tint(plaster, colour, 0.25) * (1 + weft + warp + fine)[..., None], 0, 1)

def brushed(colour, band=True):
    n = rng.normal(0, 1, (H, 1)).astype(np.float32)
    n = np.asarray(Image.fromarray(((n * 40) + 128).clip(0, 255).astype(np.uint8)).resize((W, H)), dtype=np.float32) / 255
    band = 1 + (0.35 * np.exp(-(((np.arange(H) / H) - 0.38) ** 2) / 0.004) if band else np.zeros(H))
    return np.clip(hexrgb(colour) * (0.85 + 0.3 * n[..., None]) * band[:, None, None], 0, 1)

def jaali(face, glow):
    img = Image.fromarray((face * 255).astype(np.uint8))
    hole = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(hole)
    step = 92
    for cy in range(-step, H + step, step):
        for cx in range(-step, W + step, step):
            ox = cx + (step // 2 if (cy // step) % 2 else 0)
            pts = []
            for i in range(16):
                r = 34 if i % 2 == 0 else 19
                a = i * math.pi / 8 + math.pi / 16
                pts.append((ox + r * math.cos(a), cy + r * math.sin(a)))
            d.polygon(pts, fill=255)
    back = Image.new("RGB", (W, H), tuple(int(v * 255) for v in hexrgb(glow)))
    # light falls off away from the centre of the backlight
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    fall = np.clip(1.15 - (((x - W * 0.45) / W) ** 2 + ((y - H * 0.4) / H) ** 2) * 1.6, 0.55, 1.15)
    back = Image.fromarray(np.clip(np.asarray(back, dtype=np.float32) * fall[..., None], 0, 255).astype(np.uint8))
    # the cut edge throws a soft shadow onto the backing
    shadow = hole.filter(ImageFilter.GaussianBlur(5)).point(lambda v: 255 - int(v * 0.0))
    out = Image.composite(back, img, hole)
    edge = Image.fromarray((np.asarray(hole.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(1.2)), dtype=np.float32)).astype(np.uint8))
    arr = np.asarray(out, dtype=np.float32) / 255
    arr *= (1 - 0.35 * (np.asarray(edge, dtype=np.float32) / 255))[..., None]
    return arr

def wave(colour, prism=False):
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    if prism:
        cell = 120
        u, v = (x % cell) / cell, (y % cell) / cell
        s = np.where(u > v, np.where(u + v > 1, 0.78, 1.08), np.where(u + v > 1, 0.62, 0.92))
    else:
        s = 0.93 + 0.09 * np.sin((x / W) * math.pi * 6 + np.sin((y / H) * math.pi * 3) * 1.4)
    return light(matte(colour), s.astype(np.float32))

# --- what each product is ------------------------------------------------------------------------
# slug: (kind, colour[, extra])
P = {
    "fluted-chalk-white": ("fluted", "#efebe4"), "fluted-charcoal": ("fluted", "#3c3d3c"),
    "fluted-sand": ("fluted", "#cdb89c"), "fluted-teak": ("fluted-wood", "#9a6c45"),
    "half-round-ivory": ("halfround", "#ece5d8"), "half-round-graphite": ("halfround", "#58595a"),
    "louver-walnut": ("louver-wood", "#6b4b37"), "louver-oak": ("louver-wood", "#c49a6c"), "louver-concrete": ("louver-concrete", "#9a9893"),
    "3d-wave-white": ("wave", "#f1eee8"), "3d-prism-silver": ("prism", "#c4c4c2"),
    "wood-grain-ash": ("boards", "#c9b392"), "wood-grain-smoked": ("boards", "#6e523d"),
    "ceiling-linear-white": ("ceiling", "#f2f0ec"), "ceiling-linear-teak": ("ceiling-wood", "#9a6c45"),
    "wpc-slat-natural-oak": ("slats", "#c49a6c"), "wpc-slat-smoked-walnut": ("slats", "#6b4b37"), "wpc-slat-black": ("slats", "#2e2c2a"),
    "acoustic-oak-felt": ("acoustic", "#c49a6c"), "acoustic-walnut-felt": ("acoustic", "#6b4b37"),
    "cladding-teak": ("cladding", "#9a6a42"), "cladding-anthracite": ("cladding-grey", "#4a4b4c"),
    "decking-coffee": ("decking", "#6e4c35"),
    "jaali-shalimar-walnut": ("jaali", "#5b3d2b", "#f1c88e"), "jaali-mughal-ivory": ("jaali-lacquer", "#efe8dc", "#c99a63"),
    "jaali-pvc-white": ("jaali-lacquer", "#f5f3ef", "#d9cfc0"), "divider-oak-slat": ("divider", "#c49a6c"),
    "wallpaper-damask-champagne": ("damask", "#d6c4a6"), "wallpaper-linen-stone": ("linen", "#c9c3b9"),
    "adhesive-sage-linen": ("linen", "#a0ab92"),
    "trim-end-cap-black": ("metal", "#2b2a28"), "trim-corner-gold": ("metal", "#c9ab72"), "skirting-black-80": ("metal", "#2b2a28"),
    "led-profile-recessed": ("led", "#c6c6c3"), "panel-adhesive-310": ("plaster", "#efeeea"),
}

def render(kind, colour, extra=None):
    if kind in ("fluted", "fluted-wood"):
        base = wood(colour) if kind == "fluted-wood" else matte(colour)
        return light(base, columns(26, flute))
    if kind == "halfround": return light(matte(colour), columns(40, halfround))
    if kind == "louver-wood": return light(wood(colour), columns(48, louver))
    if kind == "louver-concrete": return light(tint(concrete, colour, 0.8), columns(48, louver))
    if kind == "wave": return wave(colour)
    if kind == "prism": return wave(colour, prism=True)
    if kind == "boards": return light(wood(colour), columns(125, board))
    if kind == "ceiling": return light(tint(plaster, colour, 0.25), rows(50, lambda t: 0.45 if t < 0.04 else 1.0))
    if kind == "ceiling-wood": return light(wood(colour), rows(50, lambda t: 0.45 if t < 0.04 else 1.0))
    if kind == "slats":
        s = columns(40, slat_on(0.32, 0.0)); m = s > 0.05
        return np.where(m[..., None], light(wood(colour), s), felt() * 0.6)
    if kind == "acoustic":
        s = columns(40, slat_on(0.34, 0.0)); m = s > 0.05
        return np.where(m[..., None], light(wood(colour), s), felt())
    if kind in ("cladding", "cladding-grey"):
        base = tint(concrete, colour, 0.5) if kind == "cladding-grey" else wood(colour)
        return light(base, columns(55, lambda t: 0.3 if t < 0.05 else (0.82 if t > 0.92 else 1.0)))
    if kind == "decking": return light(wood(colour), rows(70, lambda t: 0.18 if t < 0.05 else (0.9 + 0.1 * math.sin(t * 40))))
    if kind == "jaali": return jaali(wood(colour), extra)
    if kind == "jaali-lacquer": return jaali(tint(plaster, colour, 0.18), extra)
    if kind == "divider":
        s = columns(60, slat_on(0.55, 0.0)); m = s > 0.05
        room = np.full((H, W, 3), hexrgb("#e9e4dc")) * np.linspace(1.05, 0.85, W)[None, :, None]
        return np.where(m[..., None], light(wood(colour), s), room)
    if kind == "damask":
        base = tint(plaster, colour, 0.22)
        motif = Image.new("L", (W, H), 0); d = ImageDraw.Draw(motif)
        for cy in range(-60, H + 120, 180):
            for cx in range(-60, W + 120, 150):
                ox = cx + (75 if (cy // 180) % 2 else 0)
                d.ellipse((ox - 26, cy - 52, ox + 26, cy + 52), outline=255, width=3)
                d.ellipse((ox - 10, cy - 20, ox + 10, cy + 20), fill=255)
                d.arc((ox - 50, cy - 30, ox + 50, cy + 70), 200, 340, fill=255, width=2)
        m = np.asarray(motif.filter(ImageFilter.GaussianBlur(1.1)), dtype=np.float32) / 255
        return np.clip(base * (1 + 0.16 * m)[..., None], 0, 1)
    if kind == "linen": return linen(colour)
    if kind == "metal": return brushed(colour)
    if kind == "led":
        img = brushed(colour, band=False)
        x = np.arange(W) / W
        glow = np.exp(-((x - 0.5) ** 2) / 0.004)[None, :, None] * hexrgb("#fff1d2")
        strip = (np.abs(x - 0.5) < 0.07)[None, :, None]
        return np.clip(np.where(strip, 0.75 + 0.3 * glow, img + 0.25 * glow), 0, 1)
    if kind == "plaster": return tint(plaster, colour, 0.3)
    raise ValueError(kind)

for slug, spec in P.items():
    img = vignette(render(*spec))
    Image.fromarray((img * 255).astype(np.uint8)).save(os.path.join(OUT, f"{slug}.jpg"), quality=84, optimize=True, progressive=True)
    print("wrote", slug, flush=True)

with open(os.path.join(OUT, "PROVENANCE.md"), "w", encoding="utf-8") as f:
    f.write("# Product swatches\n\nRendered by scripts/render-swatches.py from CC0 Poly Haven texture photography "
            "(oak_veneer_01, plastered_wall_04, concrete_floor_02; polyhaven.com, CC0). "
            "Profiles (flute pitch, slat and board widths), raking light, felt and linen grain are procedural. "
            "Illustrative finish renders, not photographs of the products.\n")

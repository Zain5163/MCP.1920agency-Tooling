"""
Muzaree footwear — six-angle static creatives, October 2026.

Every shoe shown is a real Muzaree product photo from the live Shopify store
(reference/product-photos). Prices are the store's own price / compare-at price,
read 2026-10-06. Claims (Cash on Delivery, Easy Exchange, features) are the ones
Muzaree already makes in its own ads and product descriptions.

Run:  python build.py        -> out/<concept>_4x5.jpg and out/<concept>_9x16.jpg
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

HERE = Path(__file__).parent
PHOTOS = HERE.parent.parent / "reference" / "product-photos"
OUT = HERE / "out"
OUT.mkdir(exist_ok=True)

F = "C:/Windows/Fonts/"
UF = str(Path.home() / "AppData/Local/Microsoft/Windows/Fonts") + "/"
SERIF_B = F + "palab.ttf"
SERIF = F + "pala.ttf"
SERIF_I = F + "palai.ttf"
SANS_B = UF + "InterDisplay-Bold.otf"
SANS_SB = UF + "Inter-SemiBold.otf"
SANS = UF + "Inter-Regular.otf"
SANS_M = UF + "Inter-Medium.otf"
SYM = F + "seguisym.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def photo(name):
    return Image.open(next(PHOTOS.glob(name + "_*.jpg"))).convert("RGB")


def cutout(img, thresh=26, feather=2):
    """Prepare a studio product photo for a light canvas.

    The store photos sit on near-white or light grey with a soft vignette, and a
    hard cutout leaves a visible box. Instead the background is lifted to pure
    white (divide by the sampled corner colour, then push the top highlights to
    255) and the photo is later multiplied onto the canvas: white vanishes into
    the canvas colour and the photo's own natural shadow is kept.
    """
    rgb = img.convert("RGB")
    w, h = rgb.size
    pts = [rgb.getpixel(p) for p in [(4, 4), (w - 5, 4), (4, h - 5), (w - 5, h - 5), (w // 2, 4)]]
    bgc = tuple(max(1, min(p[i] for p in pts)) for i in range(3))
    chans = [c.point(lambda v, k=k: min(255, int(v * 255 / k))) for c, k in zip(rgb.split(), bgc)]
    norm = Image.merge("RGB", chans)
    lut = [0 if v < 0 else (255 if v >= 246 else (v if v < 214 else int(214 + (v - 214) * 41 / 32))) for v in range(256)]
    norm = norm.point(lut * 3)
    diff = ImageChops.difference(norm, Image.new("RGB", norm.size, (255, 255, 255))).convert("L")
    box = diff.point(lambda v: 255 if v > thresh else 0).getbbox()
    return norm.crop(box)


def fit(img, w, h):
    im = img.copy()
    im.thumbnail((w, h), Image.LANCZOS)
    return im


def cover(img, w, h):
    r = max(w / img.width, h / img.height)
    im = img.resize((int(img.width * r + 1), int(img.height * r + 1)), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))


def shadow_paste(canvas, img, x, y, *_):
    """Multiply a whitened product photo onto a light area of the canvas."""
    region = canvas.crop((x, y, x + img.width, y + img.height)).convert("RGB")
    canvas.paste(ImageChops.multiply(region, img.convert("RGB")), (x, y))


def rounded(img, r):
    m = Image.new("L", img.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, img.width - 1, img.height - 1), r, fill=255)
    out = img.convert("RGBA")
    out.putalpha(m)
    return out


def text_c(d, cx, y, s, f, fill):
    w = d.textlength(s, font=f)
    d.text((cx - w / 2, y), s, font=f, fill=fill)
    return w


def wrap(d, s, f, maxw):
    words, lines, cur = s.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= maxw:
            cur = t
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    return lines


def pill(d, cx, y, s, f, bg, fg, padx=34, pady=18):
    w = d.textlength(s, font=f)
    asc, desc = f.getmetrics()
    h = asc + desc
    d.rounded_rectangle((cx - w / 2 - padx, y, cx + w / 2 + padx, y + h + pady * 2), (h + pady * 2) // 2, fill=bg)
    d.text((cx - w / 2, y + pady), s, font=f, fill=fg)
    return h + pady * 2


def brand(d, cx, y, fill, size=34):
    f = font(SERIF, size)
    s = "M U Z A R E E"
    text_c(d, cx, y, s, f, fill)


SIZES = {"4x5": (1080, 1350), "9x16": (1080, 1920)}


# ---------------------------------------------------------------- A colour picker
def colour_picker(shape):
    W, H = SIZES[shape]
    tall = shape == "9x16"
    bg = (244, 239, 231)
    c = Image.new("RGBA", (W, H), bg + (255,))
    d = ImageDraw.Draw(c)
    top = 250 if tall else 70
    brand(d, W / 2, top, (90, 74, 58))
    hf = font(SERIF_B, 92)
    text_c(d, W / 2, top + 70, "Which colour", hf, (34, 28, 22))
    text_c(d, W / 2, top + 172, "are you?", hf, (34, 28, 22))
    text_c(d, W / 2, top + 290, "Premium suede loafers  ·  6 colours", font(SANS_M, 34), (110, 92, 72))

    items = [
        ("navy-blue-suede-leather-loafers-men_1", "Espresso", "5,999"),
        ("navy-blue-suede-leather-loafers-for-men_1", "Navy", "5,999"),
        ("grey-suede-leather-loafers-men_1", "Grey", "6,999"),
        ("beige-2-0_1", "Beige", "5,599"),
        ("untitled-may26_01-58-44_1", "Mustard", "5,599"),
        ("black-suede-leather-loafers-men_1", "Black", "6,999"),
    ]
    gx, gy = 60, top + 380
    cw = (W - 2 * gx - 2 * 24) // 3
    ch = 330 if not tall else 360
    lf, pf = font(SANS_SB, 32), font(SANS, 28)
    for i, (name, label, price) in enumerate(items):
        col, row = i % 3, i // 3
        x, y = gx + col * (cw + 24), gy + row * (ch + 24)
        d.rounded_rectangle((x, y, x + cw, y + ch), 28, fill=(255, 255, 255))
        shoe = fit(cutout(photo(name)), cw - 40, ch - 120)
        shadow_paste(c, shoe, x + (cw - shoe.width) // 2, y + 30 + (ch - 120 - shoe.height) // 2, 45, 14, 10)
        text_c(d, x + cw / 2, y + ch - 86, label, lf, (34, 28, 22))
        text_c(d, x + cw / 2, y + ch - 46, "PKR " + price, pf, (120, 100, 80))
    by = gy + 2 * ch + 24 + (60 if not tall else 80)
    pill(d, W / 2, by, "Cash on Delivery  ·  Easy Exchange", font(SANS_SB, 34), (34, 28, 22), (244, 239, 231))
    return c


# ---------------------------------------------------------------- B price drop
def price_drop(shape):
    W, H = SIZES[shape]
    tall = shape == "9x16"
    c = Image.new("RGBA", (W, H), (255, 255, 255, 255))
    d = ImageDraw.Draw(c)
    top = 260 if tall else 80
    brand(d, W / 2, top, (60, 50, 40))
    text_c(d, W / 2, top + 80, "Espresso Suede Loafers", font(SANS_SB, 44), (40, 32, 26))
    shoe = fit(cutout(photo("navy-blue-suede-leather-loafers-men_1")), 900, 640 if not tall else 760)
    sy = top + 170
    shadow_paste(c, shoe, (W - shoe.width) // 2, sy, 60, 24, 22)
    y = sy + shoe.height + 50
    wf = font(SANS, 58)
    s = "Was PKR 11,999"
    w = text_c(d, W / 2, y, s, wf, (150, 150, 150))
    d.line((W / 2 - w / 2 - 6, y + 38, W / 2 + w / 2 + 6, y + 38), fill=(200, 40, 40), width=6)
    text_c(d, W / 2, y + 86, "Now PKR 5,999", font(SANS_B, 110), (20, 20, 20))
    y2 = y + 240
    pill(d, W / 2, y2, "50% OFF  ·  Cash on Delivery", font(SANS_SB, 36), (176, 30, 36), (255, 255, 255))
    return c


# ---------------------------------------------------------------- C cash on delivery, native text post
def cod_native(shape):
    W, H = SIZES[shape]
    tall = shape == "9x16"
    bg = (250, 248, 244)
    c = Image.new("RGBA", (W, H), bg + (255,))
    d = ImageDraw.Draw(c)
    x0 = 90
    top = 300 if tall else 110
    hf = font(SANS_B, 84)
    y = top
    for line in wrap(d, "Buying shoes online shouldn't feel like a gamble.", hf, W - 2 * x0):
        d.text((x0, y), line, font=hf, fill=(22, 22, 22))
        y += 98
    y += 40
    cf, tf = font(SYM, 50), font(SANS_M, 46)
    for t in ["Pay cash when it reaches you", "Wrong size? Easy exchange", "Sizes 39 to 44"]:
        d.ellipse((x0, y + 2, x0 + 58, y + 60), fill=(32, 120, 70))
        d.text((x0 + 12, y + 1), "✓", font=cf, fill=(255, 255, 255))
        d.text((x0 + 84, y + 4), t, font=tf, fill=(40, 40, 40))
        y += 88
    shoe = fit(cutout(photo("black-leather-loafers-honey-sole_1")), 760, 460 if not tall else 520)
    sy = H - shoe.height - (120 if not tall else 420)
    shadow_paste(c, shoe, (W - shoe.width) // 2 + 60, sy, 55, 22, 20)
    brand(d, W / 2, H - (80 if not tall else 360), (90, 90, 90), 30)
    return c


# ---------------------------------------------------------------- D winter chelsea
def winter_chelsea(shape):
    W, H = SIZES[shape]
    tall = shape == "9x16"
    bg = (28, 26, 24)
    c = Image.new("RGBA", (W, H), bg + (255,))
    d = ImageDraw.Draw(c)
    top = 250 if tall else 70
    brand(d, W / 2, top, (200, 180, 150))
    hf = font(SERIF_B, 88)
    text_c(d, W / 2, top + 66, "Winter's here.", hf, (245, 238, 226))
    text_c(d, W / 2, top + 166, "Your boots should be too.", font(SERIF_I, 56), (215, 195, 160))
    gap, pad = 24, 60
    cw = (W - 2 * pad - gap) // 2
    chh = 700 if not tall else 840
    py = top + 280
    for i, n in enumerate(["brown-chelsea-boots-premium-cow-leather_2", "matt-black-chelsea-boots-premium-cow-lea_2"]):
        card = rounded(cover(photo(n), cw, chh), 26)
        c.alpha_composite(card, (pad + i * (cw + gap), py))
    lf = font(SANS_SB, 32)
    text_c(d, pad + cw / 2, py + chh + 22, "Brown", lf, (230, 220, 205))
    text_c(d, pad + cw + gap + cw / 2, py + chh + 22, "Matt Black", lf, (230, 220, 205))
    y = py + chh + 90
    text_c(d, W / 2, y, "Chelsea Boots  ·  Premium Cow Leather", font(SANS_M, 36), (200, 185, 160))
    w = text_c(d, W / 2 - 150, y + 66, "PKR 10,999", font(SANS, 44), (140, 130, 120))
    d.line((W / 2 - 150 - w / 2, y + 92, W / 2 - 150 + w / 2, y + 92), fill=(200, 60, 50), width=4)
    text_c(d, W / 2 + 130, y + 56, "PKR 5,999", font(SANS_B, 60), (245, 238, 226))
    return c


# ---------------------------------------------------------------- E shaadi season
def shaadi(shape):
    W, H = SIZES[shape]
    tall = shape == "9x16"
    bg = (92, 22, 32)
    c = Image.new("RGBA", (W, H), bg + (255,))
    d = ImageDraw.Draw(c)
    gold = (222, 186, 120)
    top = 250 if tall else 80
    m = 34
    d.rectangle((m, m, W - m, H - m), outline=gold, width=3)
    brand(d, W / 2, top, gold)
    text_c(d, W / 2, top + 70, "Shaadi season,", font(SERIF_B, 96), (250, 240, 225))
    text_c(d, W / 2, top + 176, "sorted.", font(SERIF_I, 96), gold)
    text_c(d, W / 2, top + 300, "With kurta, shalwar kameez or a suit.", font(SANS_M, 36), (235, 215, 200))
    panel_y = top + 380
    ph = 560 if not tall else 700
    d.rounded_rectangle((70, panel_y, W - 70, panel_y + ph), 30, fill=(250, 244, 236))
    a = fit(cutout(photo("muzaree-elite-ivory-mild-leather-loafers_1")), 430, ph - 120)
    b = fit(cutout(photo("black-leather-loafers-honey-sole_1")), 430, ph - 120)
    shadow_paste(c, a, int(W * 0.29 - a.width / 2), panel_y + (ph - a.height) // 2 - 10, 50, 16, 14)
    shadow_paste(c, b, int(W * 0.71 - b.width / 2), panel_y + (ph - b.height) // 2 - 10, 50, 16, 14)
    y = panel_y + ph + 40
    lf, pf = font(SANS_SB, 34), font(SANS, 30)
    for cx, label, price in [(W * 0.29, "Elite Ivory Leather", "PKR 8,999"), (W * 0.71, "Black, Honey Sole", "PKR 7,999")]:
        text_c(d, cx, y, label, lf, (250, 240, 225))
        text_c(d, cx, y + 44, price, pf, gold)
    pill(d, W / 2, y + 120, "Cash on Delivery  ·  Easy Exchange", font(SANS_SB, 34), gold, bg)
    return c


# ---------------------------------------------------------------- F details / anatomy
def details(shape):
    W, H = SIZES[shape]
    tall = shape == "9x16"
    bg = (236, 232, 226)
    c = Image.new("RGBA", (W, H), bg + (255,))
    d = ImageDraw.Draw(c)
    top = 260 if tall else 80
    text_c(d, W / 2, top, "Look closer.", font(SERIF_B, 100), (30, 26, 22))
    text_c(d, W / 2, top + 120, "Muzaree Suede Loafers", font(SANS_M, 38), (100, 88, 74))
    shoe = fit(cutout(photo("beige-2-0_1")), 980, 700 if not tall else 800)
    sx, sy = (W - shoe.width) // 2, top + 220
    shadow_paste(c, shoe, sx, sy, 60, 24, 22)
    lf = font(SANS_SB, 34)
    ink = (30, 26, 22)
    calls = [
        ((0.68, 0.30), (W - 60, sy - 40), "Premium suede upper", "r"),
        ((0.20, 0.42), (60, sy - 40), "Hand-finished stitching", "l"),
        ((0.80, 0.30), (W - 60, sy + shoe.height + 40), "Soft cushioned insole", "r"),
        ((0.30, 0.86), (60, sy + shoe.height + 40), "Light, flexible sole", "l"),
    ]
    for (fx, fy), (tx, ty), label, side in calls:
        px, py = sx + shoe.width * fx, sy + shoe.height * fy
        d.ellipse((px - 9, py - 9, px + 9, py + 9), fill=ink)
        w = d.textlength(label, font=lf)
        lx = tx - w if side == "r" else tx
        ex = lx + w / 2
        ey = ty + 50 if ty < py else ty - 6
        d.line((px, py, ex, ey), fill=ink, width=3)
        d.rounded_rectangle((lx - 18, ty - 6, lx + w + 18, ty + 50), 26, fill=(255, 255, 255))
        d.text((lx, ty + 2), label, font=lf, fill=ink)
    y = sy + shoe.height + 150
    text_c(d, W / 2, y, "From PKR 5,599  ·  Cash on Delivery", font(SANS_SB, 40), ink)
    return c


CONCEPTS = {
    "A_colour-picker": colour_picker,
    "B_price-drop": price_drop,
    "C_cod-native": cod_native,
    "D_winter-chelsea": winter_chelsea,
    "E_shaadi-season": shaadi,
    "F_look-closer": details,
}

if __name__ == "__main__":
    for name, fn in CONCEPTS.items():
        for shape in SIZES:
            img = fn(shape).convert("RGB")
            p = OUT / f"{name}_{shape}.jpg"
            img.save(p, quality=92)
            print(p.name, img.size)


# ---------------------------------------------------------------- G Chelsea, one price (February winner's format)
def dark_cutout(img, thresh=40):
    """Cutout for dark leather on white: high contrast, so a hard key is clean."""
    rgb = img.convert("RGB")
    lum = rgb.convert("L")
    lo, hi = 196, 222  # leather and soles sit below lo; the white floor and its reflection above hi
    mask = lum.point(lambda v: 255 if v < lo else (0 if v > hi else int((hi - v) * 255 / (hi - lo))))
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    out = rgb.convert("RGBA")
    out.putalpha(mask)
    return out.crop(mask.point(lambda v: 255 if v > 60 else 0).getbbox())


def chelsea_one_price(shape):
    W, H = SIZES[shape]
    tall = shape == "9x16"
    c = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse((-200, H * 0.30, W + 200, H * 1.05), fill=120)
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    c.paste(Image.new("RGBA", (W, H), (70, 52, 38, 255)), (0, 0), glow)
    d = ImageDraw.Draw(c)
    gold = (226, 190, 128)
    top = 250 if tall else 70
    text_c(d, W / 2, top, "Muzaree", font(SERIF, 46), (240, 232, 220))
    text_c(d, W / 2, top + 80, "Every pair. One price.", font(SERIF_B, 78), (245, 238, 226))
    text_c(d, W / 2, top + 180, "PKR 5,999", font(SERIF_B, 150), gold)
    text_c(d, W / 2, top + 350, "Chelsea Boots  ·  Premium Cow Leather", font(SANS_M, 36), (215, 200, 178))
    bw = 470
    b1 = fit(dark_cutout(photo("brown-chelsea-boots-premium-cow-leather_1")), bw, 520)
    b2 = fit(dark_cutout(photo("matt-black-chelsea-boots-premium-cow-lea_1")), bw, 520)
    by = top + 450 + (60 if tall else 0)
    for b, x in [(b1, W // 2 - bw - 10), (b2, W // 2 + 10)]:
        sh = Image.new("RGBA", (b.width, 60), (0, 0, 0, 0))
        ImageDraw.Draw(sh).ellipse((20, 10, b.width - 20, 50), fill=(0, 0, 0, 200))
        c.alpha_composite(sh.filter(ImageFilter.GaussianBlur(14)), (x, by + b.height - 34))
        c.alpha_composite(b, (x, by))
    y = by + max(b1.height, b2.height) + 40
    lf = font(SANS_SB, 32)
    text_c(d, W // 2 - bw // 2 - 10, y, "Brown", lf, (230, 220, 205))
    text_c(d, W // 2 + bw // 2 + 10, y, "Matt Black", lf, (230, 220, 205))
    pill(d, W / 2, y + 70, "All sizes 39–44  ·  Cash on Delivery", font(SANS_SB, 34), gold, (20, 16, 12))
    return c


# ---------------------------------------------------------------- H black suede Chelsea, full-bleed scene from Muzaree's own ad library
def suede_scene(shape):
    W, H = SIZES[shape]
    tall = shape == "9x16"
    scene = Image.open(HERE.parent.parent / "reference/ad-library-images/11_2026-09-23_2048x2048.jpg").convert("RGB")
    c = cover(scene, W, H).convert("RGBA")
    grad = Image.new("L", (1, 256))
    for i in range(256):
        grad.putpixel((0, i), int(235 * max(0, 1 - i / 150)))
    top_shade = grad.resize((W, int(H * 0.45)))
    c.paste(Image.new("RGBA", (W, top_shade.height), (10, 10, 10, 255)), (0, 0), top_shade)
    bot = grad.transpose(Image.FLIP_TOP_BOTTOM).resize((W, int(H * 0.30)))
    c.paste(Image.new("RGBA", (W, bot.height), (10, 10, 10, 255)), (0, H - bot.height), bot)
    d = ImageDraw.Draw(c)
    top = 250 if tall else 70
    text_c(d, W / 2, top, "M U Z A R E E", font(SERIF, 34), (225, 215, 200))
    text_c(d, W / 2, top + 60, "Slip on. Stand out.", font(SERIF_B, 96), (250, 245, 236))
    text_c(d, W / 2, top + 180, "Black Suede Chelsea  ·  Limited Edition", font(SANS_M, 38), (225, 215, 200))
    yb = H - (200 if not tall else 420)
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(ov).rounded_rectangle((W / 2 - 330, yb - 30, W / 2 + 330, yb + 145), 36, fill=(12, 12, 12, 210))
    c.alpha_composite(ov)
    d = ImageDraw.Draw(c)
    w = text_c(d, W / 2 - 160, yb + 12, "PKR 8,999", font(SANS, 44), (190, 180, 170))
    d.line((W / 2 - 160 - w / 2, yb + 38, W / 2 - 160 + w / 2, yb + 38), fill=(220, 70, 60), width=4)
    text_c(d, W / 2 + 120, yb, "PKR 6,599", font(SANS_B, 64), (250, 245, 236))
    text_c(d, W / 2, yb + 90, "Cash on Delivery  ·  Easy Exchange", font(SANS_SB, 32), (225, 215, 200))
    return c


CONCEPTS["G_chelsea-one-price"] = chelsea_one_price
CONCEPTS["H_suede-chelsea-scene"] = suede_scene

if __name__ == "__main__":
    for name in ["G_chelsea-one-price", "H_suede-chelsea-scene"]:
        for shape in SIZES:
            img = CONCEPTS[name](shape).convert("RGB")
            img.save(OUT / f"{name}_{shape}.jpg", quality=92)
            print(name, shape, img.size)

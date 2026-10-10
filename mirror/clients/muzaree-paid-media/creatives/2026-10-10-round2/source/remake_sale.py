import sys, cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont
src, out, fonts = sys.argv[1:4]
img = cv2.imread(src); h, w = img.shape[:2]
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
mask = np.zeros((h, w), np.uint8)
# old text: "NEW ARRIVALS INCLUDED" + red "SALE" (top band) and "FLAT 30% OFF" (lower band)
top = ((hsv[..., 2] > 90) | ((hsv[..., 1] > 90) & (hsv[..., 2] > 60))).astype(np.uint8) * 255
mask[90:370, :] = top[90:370, :]
mask[330:600, 0:130] = 0          # brass lamp stays (it starts below the old S)
hue, sat = hsv[..., 0], hsv[..., 1]
red = (((hue < 12) | (hue > 165)) & (sat > 80) & (hsv[..., 2] > 50)).astype(np.uint8) * 255
mask[90:400, :] = np.maximum(mask[90:400, :], red[90:400, :])   # the old red letters, lamp included
mask = cv2.dilate(mask, np.ones((7, 7), np.uint8), iterations=2)
clean = cv2.inpaint(img, mask, 9, cv2.INPAINT_TELEA)
blur = cv2.GaussianBlur(clean, (0, 0), 6)
m3 = cv2.GaussianBlur(cv2.merge([mask] * 3).astype(np.float32) / 255, (0, 0), 5)
clean = (clean * (1 - m3) + blur * m3).astype(np.uint8)
# Lower band: replace the old "FLAT 30% OFF" with real carpet from just above, feathered in.
patch = clean[840:950, :].copy()
y0, y1 = 930, 1040
patch = cv2.resize(patch, (w, y1 - y0))
alpha = np.ones((y1 - y0, w), np.float32)
fe = 18
alpha[:fe, :] *= np.linspace(0, 1, fe)[:, None]; alpha[-fe:, :] *= np.linspace(1, 0, fe)[:, None]
a3 = cv2.merge([alpha] * 3)
clean[y0:y1] = (clean[y0:y1] * (1 - a3) + patch * a3).astype(np.uint8)
pil = Image.fromarray(cv2.cvtColor(clean, cv2.COLOR_BGR2RGB)); d = ImageDraw.Draw(pil)
def f(size, wt, name="PlayfairDisplay.ttf"):
    x = ImageFont.truetype(f"{fonts}/{name}", size)
    try: x.set_variation_by_axes([wt])
    except Exception: pass
    return x
def c(y, t, fo, fill):
    d.text(((w - d.textlength(t, font=fo)) / 2, y), t, font=fo, fill=fill)
WHITE, GOLD, RED = (238, 232, 222), (205, 166, 92), (200, 52, 44)
c(118, "WINTER COLLECTION", f(34, 600, "Cinzel.ttf"), GOLD)
c(168, "SALE", f(150, 800), RED)
c(950, "Rs. 5,999", f(84, 600), GOLD)
was = "was Rs. 10,999"; fo = f(30, 400); tw = d.textlength(was, font=fo); x = (w - tw) / 2; y = 1050
d.text((x, y), was, font=fo, fill=WHITE); d.line((x, y + 20, x + tw, y + 20), fill=WHITE, width=2)
c(1095, "Free Delivery  •  Cash on Delivery", f(26, 500), WHITE)
pil.save(f"{out}/chelsea-sale-5999.jpg", quality=92); print("saved")

"""Remake the account's best-ever poster ("chalsea Sales Ad -3", 220 sales at PKR 601)
with today's true price. Same photo, same layout; the old text is removed (OpenCV
inpainting) and today's facts written in a matching serif and gold."""
import sys
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

src, out_dir, fonts = sys.argv[1], sys.argv[2], sys.argv[3]
img = cv2.imread(src)
h, w = img.shape[:2]

# Mask the old text: bright or gold pixels in the text band above the boots.
band = (slice(70, 510), slice(0, w))
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
v = hsv[..., 2]
mask = np.zeros((h, w), np.uint8)
text = (v > 95).astype(np.uint8) * 255
mask[band] = text[band]
# Keep the brass lamp on the left (x < 130, y 180-470) out of the mask: it is part of the set.
mask[180:470, 0:130] = 0
mask = cv2.dilate(mask, np.ones((7, 7), np.uint8), iterations=2)
clean = cv2.inpaint(img, mask, 9, cv2.INPAINT_TELEA)
# Smooth the repaired band a little so no ghost letters remain.
blur = cv2.GaussianBlur(clean, (0, 0), 6)
m3 = cv2.merge([mask, mask, mask]).astype(np.float32) / 255.0
m3 = cv2.GaussianBlur(m3, (0, 0), 5)
clean = (clean * (1 - m3) + blur * m3).astype(np.uint8)

pil = Image.fromarray(cv2.cvtColor(clean, cv2.COLOR_BGR2RGB))
d = ImageDraw.Draw(pil)
serif = f"{fonts}/PlayfairDisplay.ttf"
WHITE, GOLD = (238, 232, 222), (205, 166, 92)

def font(size, weight):
    f = ImageFont.truetype(serif, size)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass
    return f

def centre(y, txt, f, fill):
    tw = d.textlength(txt, font=f)
    d.text(((w - tw) / 2, y), txt, font=f, fill=fill)

centre(92, "Winter Chelsea Sale", font(64, 500), WHITE)
centre(214, "Every Pair Only", font(40, 500), WHITE)
centre(262, "Rs. 5,999", font(108, 600), GOLD)
centre(405, "Free Delivery  •  Cash on Delivery", font(30, 500), WHITE)
centre(452, "Premium Cow Leather  •  Sizes 39–44", font(26, 400), WHITE)

pil.save(f"{out_dir}/chelsea-5999-poster.jpg", quality=92)
# A 1:1 crop for feeds that prefer square (top band + boots).
sq = pil.crop((0, (h - w) // 2 + 60, w, (h - w) // 2 + 60 + w)) if h > w else pil
pil.resize((1080, int(1080 * h / w))).save(f"{out_dir}/chelsea-5999-poster-1080.jpg", quality=92)
print("saved", pil.size)

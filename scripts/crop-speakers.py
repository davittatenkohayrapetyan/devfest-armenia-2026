"""Crop speaker portraits to a matched head size, then lock them against future syncs.

Run after `npm run sync:speakers`, whenever the sync brings in a new speaker:

    pip install pillow "opencv-python-headless<5"
    python scripts/crop-speakers.py

Every photo is cropped square around the face so that the face is the same fraction of the
frame for every speaker — the grid renders them as 80px circles, and a full-frame stage shot
next to a tight headshot reads as two different sizes of person. The face box comes from
OpenCV's frontal-face detector; where it misses or picks the wrong thing, put a manual box in
scripts/speaker-faces.json as {"<speaker id>": [x, y, w, h]} in source-pixel coordinates. An
upload that arrives sideways takes {"<speaker id>": {"rotate": 90}} (degrees counter-clockwise,
applied before detection), optionally with "box" for a manual face box in the rotated image.

Cropped photos are recorded in scripts/speaker-photos.lock.json. sync-speakers.mjs never
re-downloads a locked photo, so a sync cannot overwrite a crop. To re-crop someone: delete their
lock entry, run the sync (fetches the original again), then run this script.

Sessionize serves 400x400 at most, so a speaker whose face is small in their upload ends up
upscaled. The script reports those rather than hiding them; the fix is a better photo.
"""
import json
import os
import sys
from datetime import date

import cv2
import numpy as np
from PIL import Image

SPEAKERS = "public/content/speakers.json"
LOCK = "scripts/speaker-photos.lock.json"
FACES = "scripts/speaker-faces.json"
OUT_SIZE = 400
# Crop side as a multiple of the detected face width. 2.0 puts the face at half the frame:
# head and a little shoulder inside the circle.
SIDE_PER_FACE = 2.0
# Push the crop centre below the face centre by this share of the side, so the chin and
# shoulders get the room rather than empty space above the head.
DROP = 0.1
# Below this source crop size the result is visibly soft at 2x density (160px).
SOFT_BELOW = 160


def load(path, default):
    if not os.path.exists(path):
        return default
    with open(path, encoding="utf8") as f:
        return json.load(f)


def detect(img):
    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    grey = cv2.cvtColor(np.asarray(img), cv2.COLOR_RGB2GRAY)
    found = cascade.detectMultiScale(grey, 1.05, 5, minSize=(30, 30))
    if len(found) == 0:
        return None
    return max(found, key=lambda r: r[2] * r[3]).tolist()


def square(face, w, h):
    x, y, fw, fh = face
    side = min(round(fw * SIDE_PER_FACE), w, h)
    cx = x + fw / 2
    cy = y + fh / 2 + DROP * side
    left = int(min(max(cx - side / 2, 0), w - side))
    top = int(min(max(cy - side / 2, 0), h - side))
    return [left, top, side]


def main():
    speakers = load(SPEAKERS, [])
    lock = load(LOCK, {})
    faces = load(FACES, {})
    changed = False
    for sp in speakers:
        sid = sp["id"]
        if sid in lock:
            continue
        src = os.path.join("public", sp["profilePicture"])
        img = Image.open(src)
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
            bg = Image.new("RGBA", img.size, "white")
            img = Image.alpha_composite(bg, img)
        img = img.convert("RGB")
        override = faces.get(sid)
        if isinstance(override, dict):
            rotate = override.get("rotate", 0)
            img = img.rotate(rotate, expand=True) if rotate else img
            override = override.get("box")
        face = override or detect(img)
        if not face:
            print(f"  NO FACE  {sp['fullName']}: add a box to {FACES} and rerun")
            continue
        left, top, side = square(face, *img.size)
        out = img.crop((left, top, left + side, top + side)).resize(
            (OUT_SIZE, OUT_SIZE), Image.LANCZOS
        )
        rel = f"assets/speakers/{sid}.jpg"
        out.save(os.path.join("public", rel), "JPEG", quality=88, optimize=True)
        if os.path.normpath(src) != os.path.normpath(os.path.join("public", rel)):
            os.remove(src)
        sp["profilePicture"] = rel
        lock[sid] = {
            "name": sp["fullName"],
            "file": rel,
            "crop": [left, top, side],
            "face": face,
            **({"rotate": faces[sid]["rotate"]} if isinstance(faces.get(sid), dict) else {}),
            "lockedAt": date.today().isoformat(),
        }
        changed = True
        soft = "  (soft: small face in upload)" if side < SOFT_BELOW else ""
        print(f"  cropped {sp['fullName']}: {side}px square{soft}")
    if not changed:
        print("Nothing to crop: every speaker photo is already locked.")
        return
    with open(LOCK, "w", encoding="utf8", newline="\n") as f:
        json.dump(dict(sorted(lock.items(), key=lambda kv: kv[1]["name"])), f, indent=2, ensure_ascii=False)
        f.write("\n")
    with open(SPEAKERS, "w", encoding="utf8", newline="\n") as f:
        json.dump(speakers, f, indent=2, ensure_ascii=False)
        f.write("\n")


if __name__ == "__main__":
    sys.exit(main())

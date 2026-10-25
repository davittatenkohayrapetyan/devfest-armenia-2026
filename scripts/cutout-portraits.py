"""Cut speaker and team portraits out of their backgrounds, so the site can sit them on a kit pastel.

Run after `python scripts/crop-speakers.py`, whenever a new speaker has been cropped:

    pip install "rembg[cpu]"
    python scripts/cutout-portraits.py

The cut-out is a transparent WebP beside the source JPG. The colour is not baked in: `.avatar`
in src/style.css fills the circle with the pastel matching the portrait ring at that grid
position, so a new speaker or a reordered grid needs no re-render.

The JPG crop stays as the source. Speakers: the lock entry's "file" moves to the WebP and
"cutout" records the source, so the sync keeps returning the cut-out. To redo one, delete their
WebP and rerun; to go back to the plain photo, point "file" at the JPG again and drop "cutout".
Team photos: organizers.json points at the WebP, and the JPG of the same name is the source.

Uses the u2net_human_seg model (~170 MB, downloaded to ~/.u2net on first run).
"""
import json
import os
import sys

from PIL import Image
from rembg import new_session, remove

SPEAKERS = "public/content/speakers.json"
ORGANIZERS = "public/content/organizers.json"
LOCK = "scripts/speaker-photos.lock.json"
MODEL = "u2net_human_seg"


def load(path):
    with open(path, encoding="utf8") as f:
        return json.load(f)


def save(path, data):
    with open(path, "w", encoding="utf8", newline="\n") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def cut(session, rel_src):
    """Writes <name>.webp beside rel_src (a path under public/) and returns its relative path."""
    rel_out = os.path.splitext(rel_src)[0] + ".webp"
    out_path = os.path.join("public", rel_out)
    if not os.path.exists(out_path):
        img = Image.open(os.path.join("public", rel_src)).convert("RGB")
        remove(img, session=session, post_process_mask=True).save(
            out_path, "WEBP", quality=90, method=6
        )
    return rel_out


def main():
    session = new_session(MODEL)
    speakers, organizers, lock = load(SPEAKERS), load(ORGANIZERS), load(LOCK)

    for sp in speakers:
        entry = lock.get(sp["id"])
        if not entry:
            print(f"  skipped {sp['fullName']}: not cropped yet, run crop-speakers.py first")
            continue
        src = entry.get("cutout", entry["file"])
        out = cut(session, src)
        entry["cutout"], entry["file"], sp["profilePicture"] = src, out, out
        print(f"  speaker {sp['fullName']}")

    # Team photos are hand-placed JPGs with no lock, so the source is the JPG of the same name.
    for o in organizers:
        src = os.path.splitext(o["photo"])[0] + ".jpg"
        o["photo"] = cut(session, src)
        print(f"  team    {o['name']}")

    save(SPEAKERS, speakers)
    save(ORGANIZERS, organizers)
    save(LOCK, dict(sorted(lock.items(), key=lambda kv: kv[1]["name"])))


if __name__ == "__main__":
    sys.exit(main())

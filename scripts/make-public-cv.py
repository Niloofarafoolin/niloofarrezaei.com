#!/usr/bin/env python3
"""
Makes the public copy of the CV from the owner's master PDF.

    python3 scripts/make-public-cv.py "/path/to/master CV.pdf"

What it does:
  1. Finds the contact line that holds one of the owner's private details. The patterns
     for those details are in private/forbidden.json, which is never committed.
  2. Deletes that line from the page for real (the text is removed from the file, not
     covered up), then sets the line again without the private field: same font, size,
     colours, centring, underlines and links.
  3. Replaces the file's title and author fields.
  4. Reads the result back and refuses to keep it if a private detail is still there,
     or if any other word of the CV changed.
  5. Records the file's fingerprint in scripts/approved-files.json. `npm run verify`
     refuses any PDF on the site whose fingerprint is not in that list.

Needs PyMuPDF (`pip install pymupdf`). The font of the contact line must be installed on
this computer, because the rebuilt line is set in the same font.
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
from collections import Counter
from datetime import date
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent.parent
RULES_FILE = ROOT / "private" / "forbidden.json"
OUT = ROOT / "public" / "Niloofar_Rezaei_CV.pdf"
APPROVED = ROOT / "scripts" / "approved-files.json"
TITLE = "Niloofar Rezaei, Curriculum Vitae"
AUTHOR = "Niloofar Rezaei"
NBSP = " "
SEPARATOR = f" {NBSP}|{NBSP} "
FONT_DIRS = [
    Path("/System/Library/Fonts/Supplemental"),
    Path("/System/Library/Fonts"),
    Path("/Library/Fonts"),
    Path.home() / "Library" / "Fonts",
]


def stop(message: str) -> None:
    sys.exit(f"Stopped: {message}")


def load_rules() -> list[tuple[str, re.Pattern[str]]]:
    if not RULES_FILE.exists():
        stop("private/forbidden.json is missing, so there is nothing to check against. See scripts/private-rules.mjs.")
    rules = []
    for rule in json.loads(RULES_FILE.read_text(encoding="utf-8")):
        flags = re.IGNORECASE if "i" in rule.get("flags", "") else 0
        rules.append((rule["name"], re.compile(rule["pattern"], flags)))
    rules.append(("personal email", re.compile(r"gmail\.com", re.IGNORECASE)))
    return rules


def hits(text: str, rules) -> list[str]:
    return [name for name, pattern in rules if pattern.search(text)]


def font_file(name: str) -> Path:
    for folder in FONT_DIRS:
        for stem in (name, name.replace("-", " ")):
            for ext in (".ttf", ".otf"):
                candidate = folder / f"{stem}{ext}"
                if candidate.exists():
                    return candidate
    stop(f"the font “{name}” is not installed, so the contact line cannot be set again in the same font.")


def rgb(color: int) -> tuple[float, float, float]:
    return ((color >> 16 & 255) / 255, (color >> 8 & 255) / 255, (color & 255) / 255)


def words(doc) -> Counter:
    found = Counter()
    for page in doc:
        for word in page.get_text("words"):
            token = word[4].strip(NBSP + " ")
            if token:
                found[token] += 1
    return found


def rebuild_line(page, line, rules) -> tuple[list[str], list[dict]]:
    """Removes one contact line and sets it again without its private fields. Returns what was removed."""
    spans = line["spans"]
    box = pymupdf.Rect(line["bbox"])
    links = [link for link in page.get_links() if link.get("uri") and pymupdf.Rect(link["from"]).intersects(box)]

    def link_for(span):
        span_box = pymupdf.Rect(span["bbox"])
        for link in links:
            overlap = pymupdf.Rect(link["from"]) & span_box
            if not overlap.is_empty and overlap.width > 0.5 * span_box.width:
                return link
        return None

    # Split the line into its fields.
    fields = []
    for span in spans:
        link = link_for(span)
        if link:
            fields.append({"text": span["text"].strip(NBSP + " "), "color": span["color"], "uri": link["uri"]})
            continue
        for piece in span["text"].split("|"):
            piece = piece.strip(NBSP + " ")
            if piece:
                fields.append({"text": piece, "color": span["color"], "uri": None})

    kept = [field for field in fields if not hits(field["text"], rules)]
    dropped = [field for field in fields if hits(field["text"], rules)]
    if not dropped or not kept:
        stop("a private detail sits in a line this script cannot split into fields. Remove it in the master CV instead.")

    plain = next((span for span in spans if not link_for(span)), spans[0])
    size = spans[0]["size"]
    baseline = spans[0]["origin"][1]
    centre = (box.x0 + box.x1) / 2
    path = font_file(spans[0]["font"])
    font = pymupdf.Font(fontfile=str(path))

    # The thin rules under the links, so they can be drawn again.
    underlines = [
        drawing
        for drawing in page.get_drawings()
        if drawing["rect"].height < 1.5
        and box.x0 - 1 <= drawing["rect"].x0
        and drawing["rect"].x1 <= box.x1 + 1
        and baseline - 0.5 <= drawing["rect"].y0 <= baseline + 3
    ]
    underline = underlines[0] if underlines else None

    area = pymupdf.Rect(box.x0 - 1, box.y0, box.x1 + 1, max(box.y1, underline["rect"].y1 if underline else box.y1) + 0.2)
    for block in page.get_text("dict")["blocks"]:
        for other in block.get("lines", []):
            if other["bbox"] != line["bbox"] and pymupdf.Rect(other["bbox"]).intersects(area):
                stop("the contact line overlaps another line, so removing it would damage the page.")

    link_top = min((link["from"].y0 for link in links), default=box.y0)
    link_bottom = max((link["from"].y1 for link in links), default=box.y1)
    for link in links:
        page.delete_link(link)
    page.add_redact_annot(area, fill=False, cross_out=False)
    page.apply_redactions(images=0, graphics=2, text=0)

    def width(text: str) -> float:
        return font.text_length(text, fontsize=size)

    x = centre - (sum(width(field["text"]) for field in kept) + width(SEPARATOR) * (len(kept) - 1)) / 2
    for index, field in enumerate(kept):
        if index:
            page.insert_text((x, baseline), SEPARATOR, fontname="cvline", fontfile=str(path), fontsize=size, color=rgb(plain["color"]))
            x += width(SEPARATOR)
        page.insert_text((x, baseline), field["text"], fontname="cvline", fontfile=str(path), fontsize=size, color=rgb(field["color"]))
        w = width(field["text"])
        if field["uri"]:
            if underline:
                page.draw_rect(
                    pymupdf.Rect(x, underline["rect"].y0, x + w, underline["rect"].y1),
                    color=None,
                    fill=underline.get("fill") or rgb(field["color"]),
                    width=0,
                )
            page.insert_link({"kind": pymupdf.LINK_URI, "from": pymupdf.Rect(x, link_top, x + w, link_bottom), "uri": field["uri"]})
        x += w

    return [name for field in dropped for name in hits(field["text"], rules)], dropped


def main() -> None:
    if len(sys.argv) != 2:
        stop('give the path of the master CV, for example: python3 scripts/make-public-cv.py "/path/to/CV.pdf"')
    source = Path(sys.argv[1]).expanduser()
    if not source.exists():
        stop("that file does not exist.")
    rules = load_rules()

    original = pymupdf.open(source)
    before = words(original)
    doc = pymupdf.open(source)

    removed_names: list[str] = []
    allowed = Counter()
    for page in doc:
        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                text = "".join(span["text"] for span in line["spans"])
                if not hits(text, rules):
                    continue
                if "|" not in text:
                    stop(f"page {page.number + 1} has a private detail ({', '.join(hits(text, rules))}) outside the contact line. Remove it in the master CV instead.")
                names, dropped = rebuild_line(page, line, rules)
                removed_names += names
                for field in dropped:
                    allowed.update(field["text"].split())
                    allowed["|"] += 1

    doc.set_metadata(
        {
            "title": TITLE,
            "author": AUTHOR,
            "subject": "",
            "keywords": "",
            "creator": "",
            "producer": "",
            "creationDate": original.metadata.get("creationDate", ""),
            "modDate": pymupdf.get_pdf_now(),
        }
    )
    doc.del_xml_metadata()
    try:
        doc.subset_fonts()
    except Exception:
        pass  # The whole font stays embedded. The file is a little larger; nothing else changes.

    OUT.parent.mkdir(parents=True, exist_ok=True)
    draft = OUT.with_suffix(".draft.pdf")
    doc.save(draft, garbage=4, deflate=True, clean=True)

    # Read it back as a stranger would.
    result = pymupdf.open(draft)
    problems = []
    for page in result:
        found = hits(page.get_text(), rules)
        if found:
            problems.append(f"page {page.number + 1} still contains: {', '.join(found)}")
    found = hits(" ".join(str(value) for value in result.metadata.values() if value), rules)
    if found:
        problems.append(f"the file's own fields still contain: {', '.join(found)}")
    after = words(result)
    if after - before:
        problems.append(f"{sum((after - before).values())} word(s) appeared that are not in the master")
    if before - after != allowed:
        problems.append("the words removed are not exactly the private field and its separator")
    if result.page_count != original.page_count:
        problems.append("the page count changed")
    if problems:
        draft.unlink()
        stop("the result did not pass its check, so nothing was saved. " + "; ".join(problems) + ".")

    draft.replace(OUT)
    digest = hashlib.sha256(OUT.read_bytes()).hexdigest()
    approved = json.loads(APPROVED.read_text(encoding="utf-8")) if APPROVED.exists() else {}
    approved[OUT.name] = {"sha256": digest, "made": date.today().isoformat()}
    APPROVED.write_text(json.dumps(approved, indent=2) + "\n", encoding="utf-8")

    what = ", ".join(sorted(set(removed_names))) or "nothing"
    print(f"Saved public/{OUT.name} ({OUT.stat().st_size // 1024} KB, {result.page_count} pages). Removed: {what}.")
    print("Checked: no private detail in the text or the file's fields; every other word is unchanged.")


if __name__ == "__main__":
    main()

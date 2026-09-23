#!/usr/bin/env python3
"""Render selected PDF pages and extract OCR text without copying the source PDF.

Example:
  python scripts/extract_pdf_ocr.py "D:/private/book.pdf" --pages 6,74-76 --output private-source/ocr
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable

import pymupdf
from rapidocr_onnxruntime import RapidOCR


def parse_pages(value: str, page_count: int) -> list[int]:
    """Parse one-based page numbers and inclusive ranges such as ``1,4-6``."""
    pages: set[int] = set()
    for part in value.split(","):
        start_text, separator, end_text = part.strip().partition("-")
        try:
            start = int(start_text)
            end = int(end_text) if separator else start
        except ValueError as error:
            raise argparse.ArgumentTypeError(f"Invalid page selection: {part!r}") from error
        if start < 1 or end < start or end > page_count:
            raise argparse.ArgumentTypeError(
                f"Page selection {part!r} is outside 1-{page_count}."
            )
        pages.update(range(start, end + 1))
    return sorted(pages)


def reading_order(result: Iterable[list[object]]) -> list[dict[str, object]]:
    lines = []
    for item in result:
        box, text, confidence = item
        x, y = box[0]
        lines.append({"text": text, "confidence": confidence, "x": x, "y": y})
    # OCR returns boxes; a tolerance groups baselines before sorting left to right.
    return sorted(lines, key=lambda line: (round(float(line["y"]) / 24), float(line["x"])))


def main() -> None:
    parser = argparse.ArgumentParser(description="Render and OCR selected pages from a scanned PDF.")
    parser.add_argument("source", type=Path, help="Path to the source PDF (never copied by this script).")
    parser.add_argument("--pages", default="1", help="One-based pages/ranges, e.g. 6,74-76.")
    parser.add_argument("--output", type=Path, default=Path("private-source/ocr"), help="Output directory.")
    parser.add_argument("--dpi", type=int, default=220, help="Render resolution (default: 220).")
    args = parser.parse_args()

    if not args.source.is_file():
        parser.error(f"Source PDF does not exist: {args.source}")
    if args.dpi <= 0:
        parser.error("--dpi must be positive")

    document = pymupdf.open(args.source)
    pages = parse_pages(args.pages, len(document))
    scale = args.dpi / 72
    args.output.mkdir(parents=True, exist_ok=True)
    ocr = RapidOCR()

    for number in pages:
        image_path = args.output / f"page-{number:03}.png"
        text_path = args.output / f"page-{number:03}.json"
        pixmap = document[number - 1].get_pixmap(
            matrix=pymupdf.Matrix(scale, scale), alpha=False
        )
        pixmap.save(str(image_path))
        result, _ = ocr(str(image_path))
        payload = {"source_page": number, "lines": reading_order(result or [])}
        text_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"OCR page {number}: {image_path} -> {text_path}")


if __name__ == "__main__":
    main()

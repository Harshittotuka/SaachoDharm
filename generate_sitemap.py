from __future__ import annotations

import json
from datetime import UTC, datetime
from pathlib import Path
from urllib.parse import quote

DOMAIN = "https://www.saachodharm.com"
ROOT = Path(__file__).resolve().parent
OUTPUT_PATH = ROOT / "sitemap.xml"
DATA_PATH = ROOT / "data" / "jainsaar_full_data.json"
TIRTH_DATA_PATH = ROOT / "data" / "tirth_sthal_data.json"

TODAY = datetime.now(UTC).strftime("%Y-%m-%d")

STATIC_PAGES = [
    {"url": "/index.html", "priority": 1.0, "changefreq": "weekly", "lastmod": TODAY},
    {"url": "/bhajans.html", "priority": 0.9, "changefreq": "weekly", "lastmod": TODAY},
    {"url": "/about.html", "priority": 0.8, "changefreq": "monthly", "lastmod": TODAY},
    {"url": "/calendar.html", "priority": 0.8, "changefreq": "monthly", "lastmod": TODAY},
    {"url": "/contact.html", "priority": 0.5, "changefreq": "yearly", "lastmod": TODAY},
    {"url": "/jain-bhajan-lyrics.html", "priority": 0.7, "changefreq": "weekly", "lastmod": TODAY},
    {"url": "/tirth-sthal.html", "priority": 0.9, "changefreq": "weekly", "lastmod": TODAY},
    {"url": "/tirth-sthal-detail.html", "priority": 0.8, "changefreq": "weekly", "lastmod": TODAY},
]


def load_json(path: Path):
    if not path.exists():
        return None
    try:
        with path.open("r", encoding="utf-8") as file:
            return json.load(file)
    except Exception:
        return None


def generate_urls() -> list[dict]:
    urls: list[dict] = [*STATIC_PAGES]

    bhajan_data = load_json(DATA_PATH)
    if isinstance(bhajan_data, list):
        for category in bhajan_data:
            items = category.get("items") if isinstance(category, dict) else None
            if not isinstance(items, list):
                continue

            for bhajan in items:
                if not isinstance(bhajan, dict):
                    continue
                slug = (bhajan.get("title") or "").strip()
                if not slug:
                    continue

                encoded_slug = quote(slug, safe="")
                urls.append(
                    {
                        "url": f"/jain-bhajan-lyrics.html?id={encoded_slug}",
                        "priority": 0.6,
                        "changefreq": "monthly",
                        "lastmod": TODAY,
                    }
                )

    tirth_data = load_json(TIRTH_DATA_PATH)
    if isinstance(tirth_data, list):
        for item in tirth_data:
            if not isinstance(item, dict):
                continue
            tirth_id = str(item.get("id", "")).strip()
            if not tirth_id:
                continue

            encoded_id = quote(tirth_id, safe="")
            urls.append(
                {
                    "url": f"/tirth-sthal-detail.html?id={encoded_id}",
                    "priority": 0.8,
                    "changefreq": "weekly",
                    "lastmod": TODAY,
                }
            )

    unique_urls = []
    seen = set()
    for item in urls:
        key = item["url"]
        if key in seen:
            continue
        seen.add(key)
        unique_urls.append(item)

    return unique_urls


def generate_sitemap_xml(urls: list[dict]) -> str:
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]

    for item in urls:
        lines.extend(
            [
                "  <url>",
                f"    <loc>{DOMAIN}{item['url']}</loc>",
                f"    <lastmod>{item['lastmod']}</lastmod>",
                f"    <changefreq>{item['changefreq']}</changefreq>",
                f"    <priority>{item['priority']}</priority>",
                "  </url>",
            ]
        )

    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


def main() -> int:
    urls = generate_urls()
    sitemap = generate_sitemap_xml(urls)
    OUTPUT_PATH.write_text(sitemap, encoding="utf-8")
    print(f"Sitemap generated: {OUTPUT_PATH}")
    print(f"Total URLs: {len(urls)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

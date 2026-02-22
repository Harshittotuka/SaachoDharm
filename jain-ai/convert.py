import json
import re
import uuid

with open(r"C:\Users\harsh\Desktop\SaachoDharm\Main\data\jainsaar_full_data.json", "r", encoding="utf-8") as f:
        data = json.load(f)

converted = []

for category_block in data:
    category_name = category_block.get("category", "")
    items = category_block.get("items", [])

    for item in items:
        title = item.get("title", "")
        lyrics = item.get("lyrics", "")
        link = item.get("link", "")
        video = item.get("video", "")
        audio = item.get("audio", "")

        # Split verses using pattern like "1 ।", "2 ।", etc.
        verses = re.split(r"\s\d+\s*।", lyrics)

        verse_number = 1
        for verse in verses:
            verse = verse.strip()
            if not verse:
                continue

            converted.append({
                "id": f"{title.replace(' ', '_').lower()}_verse_{verse_number}",
                "type": "stotra",
                "title": title.replace("-", " ").title(),
                "language": "hindi",
                "source_category": category_name,
                "verse_number": verse_number,
                "content": {
                    "original": verse,
                    "translation": "",
                    "explanation": ""
                },
                "media": {
                    "video": video,
                    "audio": audio,
                    "link": link
                },
                "metadata": {
                    "author": "",
                    "sect": "",
                    "website": "jainsaar.com"
                }
            })

            verse_number += 1

with open("jain_ai_ready.json", "w", encoding="utf-8") as f:
    json.dump(converted, f, ensure_ascii=False, indent=2)

print("Conversion Complete ✅")
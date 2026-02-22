import json
import faiss
import numpy as np
import ollama

with open("jain_ai_ready.json", "r", encoding="utf-8") as f:
    data = json.load(f)

dimension = 768
index = faiss.IndexFlatL2(dimension)

texts = []

for item in data:
    combined = f"""
Title: {item.get('title', '')}
Type: {item.get('type', '')}
Verse: {item.get('verse_number', '')}
Language: {item.get('language', '')}

Text:
{item.get('content', {}).get('original', '')}

Explanation:
{item.get('content', {}).get('explanation', '')}
"""

    if len(combined.strip()) == 0:
        continue

    MAX_CHARS = 3000
    if len(combined) > MAX_CHARS:
        combined = combined[:MAX_CHARS]

    response = ollama.embeddings(
        model="nomic-embed-text",
        prompt=combined
    )

    vector = np.array(response["embedding"]).astype("float32")
    index.add(np.array([vector]))
    texts.append(combined)

faiss.write_index(index, "jain.index")

with open("texts.json", "w", encoding="utf-8") as f:
    json.dump(texts, f, ensure_ascii=False)

print("Vector database created ✅")
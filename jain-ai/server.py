import json
import faiss
import numpy as np
import ollama
from fastapi import FastAPI
import uvicorn

app = FastAPI()

# Load vector DB
index = faiss.read_index("jain.index")

with open("texts.json", "r", encoding="utf-8") as f:
    texts = json.load(f)

@app.post("/chat")
async def chat(message: dict):
    question = message["message"]

    # Embed question
    embedding = ollama.embeddings(
        model="nomic-embed-text",
        prompt=question
    )

    query_vector = np.array(embedding["embedding"]).astype("float32")

    # Search top 5 matches
    D, I = index.search(np.array([query_vector]), 5)

    # Combine context
    context_chunks = [texts[i] for i in I[0] if i < len(texts)]
    context = "\n\n---\n\n".join(context_chunks)

    # Generate answer
    response = ollama.chat(
        model="mistral",
        messages=[
           {
    "role": "system",
    "content": """
You are a Jain Dharma AI assistant.

CRITICAL RULES:
1. You MUST answer strictly and only from the provided context.
2. You are NOT allowed to use any prior knowledge.
3. If the answer is not explicitly found in the context, respond exactly with:
   "This information is not available in the Jain database yet."
4. Do NOT explain beyond context.
5. Do NOT provide general knowledge.
6. Do NOT recommend books.
7."If you use any knowledge not present in the context, your answer is invalid."
"""
},
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion:\n{question}"
            }
        ]
    )

    return {"reply": response["message"]["content"]}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
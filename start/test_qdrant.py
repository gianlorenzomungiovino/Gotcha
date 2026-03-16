import requests
import json

# Verifica connessione
print("=== Verifica connessione Qdrant ===")
response = requests.get('http://localhost:6333/collections')
print(f"Stato: {response.status_code}")
print(f"Risposta: {response.json()}")

# Crea collection (endpoint corretto per Qdrant)
print("\n=== Creazione collection 'gotcha-project' ===")
collection_data = {
    "vectors": {
        "size": 768,
        "distance": "Cosine"
    },
    "fields": [
        {"name": "content", "type": "text"},
        {"name": "description", "type": "text"},
        {"name": "code", "type": "keyword"}
    ]
}
response = requests.post(
    'http://localhost:6333/collections/gotcha-project',
    json=collection_data
)
print(f"Stato: {response.status_code}")
print(f"Risposta: {response.text}")

# Test upsert (endpoint corretto per Qdrant)
print("\n=== Test Upsert documento ===")
document = {
    "id": "1",
    "vector": [0.1] * 768,
    "content": "Snippet di codice esempio",
    "description": "Questo è un esempio di snippet",
    "code": "javascript"
}
response = requests.post(
    'http://localhost:6333/collections/gotcha-project/points',
    json={"points": [{"vector": document["vector"], "payload": document}]}
)
print(f"Stato: {response.status_code}")
print(f"Risposta: {response.text}")

# Test search (endpoint corretto per Qdrant)
print("\n=== Test ricerca semantica ===")
search_query = {
    "vector": [0.1] * 768,
    "limit": 10
}
response = requests.post(
    'http://localhost:6333/collections/gotcha-project/scroll',
    json=search_query
)
print(f"Stato: {response.status_code}")
print(f"Risposta: {response.text}")
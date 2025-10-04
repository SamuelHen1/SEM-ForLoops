import json, requests

API_KEY = "T2ezpsmv0fJYxOnIu1l0epb5ugVKdhSvLOj0qj1p"

# Option A: list many asteroids
URL = "https://api.nasa.gov/neo/rest/v1/neo/browse"
params = {"api_key": API_KEY, "page": 0, "size": 20}  # size 1–20

try:
    r = requests.get(URL, params=params, timeout=20)
    r.raise_for_status()
    data = r.json()
    with open("data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Saved to data.json")
except requests.RequestException as e:
    print("Request failed:", e)
    if hasattr(e, "response") and e.response is not None:
        print("Status:", e.response.status_code, "| Body:", e.response.text[:300])

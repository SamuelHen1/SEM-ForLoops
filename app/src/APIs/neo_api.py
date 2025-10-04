import math, csv, json, requests
from pathlib import Path

API_KEY = "T2ezpsmv0fJYxOnIu1l0epb5ugVKdhSvLOj0qj1p"
BROWSE_URL = "https://api.nasa.gov/neo/rest/v1/neo/browse"

# === knobs you can tune ===
PAGE_SIZE = 20          # 1–20 per NeoWs docs
MAX_PAGES = 10          # total NEOs ≈ PAGE_SIZE * MAX_PAGES
IMPACT_V_MS = 17_000    # assumed impact speed (m/s)
DEFAULT_PV = 0.14       # used only if we must infer diameter
DEFAULT_RHO = 3000      # kg/m^3 fallback if type can't be inferred

def est_albedo_from_H_Dkm(H, D_km):
    # pV = (1329/D * 10^(-H/5))^2
    return (1329.0 / D_km * (10 ** (-H / 5.0))) ** 2

def classify_density_from_pv(pv):
    # return (class_label, density_kg_m3)
    if pv < 0.08:
        return "C-like", 1800
    if pv < 0.25:
        return "S-like", 3000
    return "M-like", 6500

def mass_from_diameter_and_density(d_km, rho):
    # sphere mass from diameter (km) and density (kg/m^3)
    d_m = d_km * 1000.0
    volume = math.pi/6.0 * d_m**3
    return rho * volume

def energy_mt_from_mass_and_speed(mass, v_ms):
    # kinetic energy in megatons TNT
    E = 0.5 * mass * v_ms**2
    return E / 4.184e15

def mean_or_none(dmin, dmax):
    if dmin is None or dmax is None:
        return None
    return 0.5 * (dmin + dmax)

def extract_close_approach(neo):
    # pick the soonest upcoming approach if available; else first historical
    cad = neo.get("close_approach_data", []) or []
    if not cad:
        return {}
    # choose the entry with the earliest close_approach_date_full if available else close_approach_date
    def key_fn(x):
        return x.get("epoch_date_close_approach") or float('inf')
    # prefer future dates (epoch > now), else min of all
    now_ms = None  # NeoWs gives epoch in ms since 1970; we can just sort by epoch ascending
    cad_sorted = sorted(cad, key=key_fn)
    sel = cad_sorted[0]
    rel_vel_kms = float(sel["relative_velocity"]["kilometers_per_second"]) if sel.get("relative_velocity") else None
    miss_km = float(sel["miss_distance"]["kilometers"]) if sel.get("miss_distance") else None
    return {
        "close_approach_date": sel.get("close_approach_date_full") or sel.get("close_approach_date"),
        "relative_velocity_kms": rel_vel_kms,
        "miss_distance_km": miss_km,
        "orbiting_body": sel.get("orbiting_body"),
    }

def flatten_neo(neo):
    rid   = neo.get("neo_reference_id")
    name  = neo.get("name")
    H     = neo.get("absolute_magnitude_h")

    # diameters (km)
    ed = (neo.get("estimated_diameter") or {}).get("kilometers") or {}
    dmin = ed.get("estimated_diameter_min")
    dmax = ed.get("estimated_diameter_max")
    dmean = mean_or_none(dmin, dmax)

    # try to estimate albedo from H and mean diameter (if available)
    pv_est, kind, rho = None, None, None
    if H is not None and dmean:
        pv_est = est_albedo_from_H_Dkm(H, dmean)
        kind, rho = classify_density_from_pv(pv_est)
    else:
        rho = DEFAULT_RHO  # fallback

    # mass & energy ranges using diameter min/max (if we have them)
    mass_min = mass_max = energy_min_mt = energy_max_mt = None
    if dmin and dmax and rho:
        mass_min = mass_from_diameter_and_density(dmin, rho)
        mass_max = mass_from_diameter_and_density(dmax, rho)
        energy_min_mt = energy_mt_from_mass_and_speed(mass_min, IMPACT_V_MS)
        energy_max_mt = energy_mt_from_mass_and_speed(mass_max, IMPACT_V_MS)

    # orbit basics
    orb = neo.get("orbital_data") or {}
    orbit = {
        "a_au":        safe_float(orb.get("semi_major_axis")),
        "e":           safe_float(orb.get("eccentricity")),
        "i_deg":       safe_float(orb.get("inclination")),
        "period_days": safe_float(orb.get("orbital_period")),
        "epoch_osculation": orb.get("epoch_osculation"),
    }

    approach = extract_close_approach(neo)

    return {
        "neo_reference_id": rid,
        "name": name,
        "absolute_magnitude_h": H,
        "is_potentially_hazardous": neo.get("is_potentially_hazardous_asteroid"),
        "estimated_diameter_km_min": dmin,
        "estimated_diameter_km_max": dmax,
        "estimated_diameter_km_mean": dmean,
        "albedo_estimated": pv_est,
        "type_from_albedo": kind,
        "density_assumed_kg_m3": rho,
        "mass_min_kg": mass_min,
        "mass_max_kg": mass_max,
        "impact_energy_min_Mt": energy_min_mt,
        "impact_energy_max_Mt": energy_max_mt,
        "orbital": orbit,
        "close_approach": approach,
        "nasa_jpl_url": neo.get("nasa_jpl_url"),
        "sentry_object": neo.get("is_sentry_object"),
    }

def safe_float(x):
    try:
        return float(x) if x is not None else None
    except (TypeError, ValueError):
        return None

def fetch_neos(max_pages=MAX_PAGES, page_size=PAGE_SIZE):
    results = []
    for page in range(max_pages):
        params = {"api_key": API_KEY, "page": page, "size": page_size}
        r = requests.get(BROWSE_URL, params=params, timeout=20)
        r.raise_for_status()
        payload = r.json()
        for neo in payload.get("near_earth_objects", []):
            results.append(flatten_neo(neo))

        # optional: stop if we reached total_pages
        pg = payload.get("page") or {}
        total_pages = pg.get("total_pages")
        if total_pages is not None and (page + 1) >= int(total_pages):
            break
    return results

def save_json(path, data):
    Path(path).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

def save_csv(path, rows):
    if not rows:
        return
    keys = [
        "neo_reference_id","name","absolute_magnitude_h","is_potentially_hazardous",
        "estimated_diameter_km_min","estimated_diameter_km_max","estimated_diameter_km_mean",
        "albedo_estimated","type_from_albedo","density_assumed_kg_m3",
        "mass_min_kg","mass_max_kg","impact_energy_min_Mt","impact_energy_max_Mt",
        "orbital.a_au","orbital.e","orbital.i_deg","orbital.period_days",
        "close_approach.close_approach_date","close_approach.relative_velocity_kms",
        "close_approach.miss_distance_km","close_approach.orbiting_body",
        "nasa_jpl_url","sentry_object"
    ]
    # flatten nested keys
    def getk(row, k):
        if "." not in k:
            return row.get(k)
        a, b = k.split(".", 1)
        return (row.get(a) or {}).get(b)

    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(keys)
        for r in rows:
            w.writerow([getk(r, k) for k in keys])

if __name__ == "__main__":
    neos = fetch_neos()
    save_json("neos_enriched.json", neos)
    save_csv("neos_enriched.csv", neos)
    print(f"Saved {len(neos)} objects to neos_enriched.json and neos_enriched.csv")

// src/services/populationDensity.ts
/**
 * Population-density utilities used to approximate casualties.
 * Prefers high-resolution WorldPop 100m rasters per impact coordinate and
 * falls back to country-level averages when required.
 */

export type PopulationDensityResult = {
  countryCode: string;
  countryName: string;
  population: number;
  areaKm2: number;
  densityPerSqKm: number;
  source: string;
  notes?: string;
  localCellPopulation?: number;
  localCellAreaKm2?: number;
  localCellDensityPerSqKm?: number;
  countryMeanDensityPerSqKm?: number;
};

export type CasualtyEstimate = PopulationDensityResult & {
  blastRadiusKm: number;
  impactAreaKm2: number;
  effectiveDensityPerSqKm: number;
  estimatedCasualties: number;
};

const WORLDPOP_SAMPLE_ENDPOINT = "https://api.worldpop.org/v1/services/sample";
const WORLDPOP_TASK_ENDPOINT = "https://api.worldpop.org/v1/tasks/";
const WORLDPOP_DATASET = "wpgppop"; // WorldPop global population, 100m
const WORLDPOP_YEAR = "2020";
const WORLDPOP_CELL_AREA_KM2 = 0.01; // 100m � 100m grid cell � 0.01 km^2
const WORLDPOP_MAX_POLLS = 8;
const WORLDPOP_POLL_INTERVAL_MS = 600;

const locationCache = new Map<string, PopulationDensityResult>();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson<T>(url: string, abortSignal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    signal: abortSignal,
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`);
  }

  return (await response.json()) as T;
}

async function resolveCountry(lat: number, lon: number) {
  type ReverseResponse = {
    countryCode?: string;
    countryName?: string;
  };

  const endpoint = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
  endpoint.searchParams.set("latitude", lat.toString());
  endpoint.searchParams.set("longitude", lon.toString());
  endpoint.searchParams.set("localityLanguage", "en");

  const data = await fetchJson<ReverseResponse>(endpoint.toString());

  if (!data.countryCode) {
    throw new Error("Unable to determine country for this location");
  }

  return data.countryCode;
}

async function loadCountryFacts(iso2: string): Promise<PopulationDensityResult> {
  type RestCountry = {
    cca2?: string;
    name?: { common?: string };
    population?: number;
    area?: number;
  };

  const url = `https://restcountries.com/v3.1/alpha/${encodeURIComponent(iso2)}`;
  const [country] = await fetchJson<RestCountry[]>(url);

  if (!country) {
    throw new Error(`No country data returned for ${iso2}`);
  }

  if (!country.population || !country.area || country.area <= 0) {
    throw new Error(`Population or area unavailable for ${iso2}`);
  }

  const density = country.population / country.area;

  return {
    countryCode: iso2.toUpperCase(),
    countryName: country.name?.common ?? iso2.toUpperCase(),
    population: country.population,
    areaKm2: country.area,
    densityPerSqKm: density,
    source: "BigDataCloud reverse geocode + RestCountries",
    countryMeanDensityPerSqKm: density,
  };
}

async function fetchWorldPopCellPopulation(lat: number, lon: number): Promise<number> {
  const controller = new AbortController();
  const searchParams = new URLSearchParams({
    dataset: WORLDPOP_DATASET,
    year: WORLDPOP_YEAR,
    lat: lat.toString(),
    lon: lon.toString(),
    format: "json",
  });

  const sampleResponse = await fetch(`${WORLDPOP_SAMPLE_ENDPOINT}?${searchParams.toString()}`, {
    headers: { Accept: "application/json" },
    signal: controller.signal,
  });

  if (!sampleResponse.ok) {
    throw new Error(`WorldPop sample request failed (${sampleResponse.status})`);
  }

  const { taskid }: { taskid?: string } = await sampleResponse.json();
  if (!taskid) {
    throw new Error("WorldPop response missing task id");
  }

  for (let attempt = 0; attempt < WORLDPOP_MAX_POLLS; attempt += 1) {
    await delay(WORLDPOP_POLL_INTERVAL_MS);

    const taskResponse = await fetch(`${WORLDPOP_TASK_ENDPOINT}${taskid}?format=json`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!taskResponse.ok) {
      throw new Error(`WorldPop task polling failed (${taskResponse.status})`);
    }

    type TaskBody = {
      status: string;
      error: boolean;
      error_message?: string | null;
      data?: { total_population?: number };
    };

    const body = (await taskResponse.json()) as TaskBody;

    if (body.status === "finished") {
      if (body.error) {
        throw new Error(body.error_message || "WorldPop task returned an error");
      }
      const totalPopulation = body.data?.total_population;
      if (typeof totalPopulation !== "number" || Number.isNaN(totalPopulation)) {
        throw new Error("WorldPop task returned invalid population data");
      }
      return totalPopulation;
    }
  }

  throw new Error("WorldPop task polling timed out");
}

export async function fetchPopulationDensity(lat: number, lon: number): Promise<PopulationDensityResult> {
  const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  const cached = locationCache.get(key);
  if (cached) {
    return cached;
  }

  let iso2: string | null = null;
  try {
    iso2 = await resolveCountry(lat, lon);
  } catch (err) {
    console.warn("Reverse geocode lookup failed", err);
  }

  let countryFacts: PopulationDensityResult | undefined;
  if (iso2) {
    try {
      countryFacts = await loadCountryFacts(iso2);
    } catch (err) {
      console.warn("Country metadata lookup failed", err);
    }
  }

  try {
    const cellPopulation = await fetchWorldPopCellPopulation(lat, lon);
    const cellDensity = cellPopulation / WORLDPOP_CELL_AREA_KM2;
    const result: PopulationDensityResult = {
      countryCode: countryFacts?.countryCode ?? iso2?.toUpperCase() ?? "NA",
      countryName: countryFacts?.countryName ?? iso2?.toUpperCase() ?? "Unknown region",
      population: cellPopulation,
      areaKm2: WORLDPOP_CELL_AREA_KM2,
      densityPerSqKm: cellDensity,
      source: "WorldPop 100m (2020)",
      notes: countryFacts
        ? `Country-wide mean density: ${countryFacts.densityPerSqKm.toFixed(1)} ppl/km^2`
        : undefined,
      localCellPopulation: cellPopulation,
      localCellAreaKm2: WORLDPOP_CELL_AREA_KM2,
      localCellDensityPerSqKm: cellDensity,
      countryMeanDensityPerSqKm: countryFacts?.densityPerSqKm,
    };

    locationCache.set(key, result);
    return result;
  } catch (err) {
    console.warn("WorldPop density lookup failed", err);
  }

  if (countryFacts) {
    const fallback = {
      ...countryFacts,
      notes: "WorldPop lookup unavailable; using national average density.",
      localCellPopulation: undefined,
      localCellAreaKm2: undefined,
      localCellDensityPerSqKm: undefined,
      countryMeanDensityPerSqKm: countryFacts.densityPerSqKm,
    };
    locationCache.set(key, fallback);
    return fallback;
  }

  const fallback: PopulationDensityResult = {
    countryCode: iso2?.toUpperCase() ?? "NA",
    countryName: iso2?.toUpperCase() ?? "Unknown region",
    population: 0,
    areaKm2: 1,
    densityPerSqKm: 0,
    source: "Population data unavailable",
    notes: "Neither WorldPop nor RestCountries returned data for this coordinate.",
    localCellPopulation: undefined,
    localCellAreaKm2: undefined,
    localCellDensityPerSqKm: undefined,
    countryMeanDensityPerSqKm: 0,
  };

  locationCache.set(key, fallback);
  return fallback;
}

export async function estimateCasualties(
  lat: number,
  lon: number,
  blastRadiusM: number
): Promise<CasualtyEstimate> {
  if (!Number.isFinite(blastRadiusM) || blastRadiusM <= 0) {
    throw new Error("Blast radius must be a positive number of meters");
  }

  const density = await fetchPopulationDensity(lat, lon);
  const blastRadiusKm = blastRadiusM / 1000;
  const impactAreaKm2 = Math.PI * blastRadiusKm * blastRadiusKm;

  const localDensity = density.localCellDensityPerSqKm ?? density.densityPerSqKm;
  const countryDensity = density.countryMeanDensityPerSqKm ?? density.densityPerSqKm;

  // Blend between local (WorldPop cell) and national density as the impact radius grows.
  // Small blasts rely on the local cell; large blasts shift toward the broader average.
  const LOCAL_INFLUENCE_SCALE_KM = 5; // ~city scale
  const localWeight = Math.exp(-Math.max(0, blastRadiusKm) / LOCAL_INFLUENCE_SCALE_KM);
  const blendedDensity = localDensity * localWeight + countryDensity * (1 - localWeight);

  // Prevent extreme spikes by clamping to a reasonable maximum multiplier over the higher baseline.
  const maxBaseline = Math.max(localDensity, countryDensity, 1);
  const effectiveDensity = Math.min(blendedDensity, maxBaseline * 5);

  const estimatedCasualties = effectiveDensity * impactAreaKm2;

  return {
    ...density,
    blastRadiusKm,
    impactAreaKm2,
    effectiveDensityPerSqKm: effectiveDensity,
    estimatedCasualties,
  };
}

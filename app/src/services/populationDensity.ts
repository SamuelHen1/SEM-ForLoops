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
  countryPopulation?: number;
  countryAreaKm2?: number;
};

export type CasualtyEstimate = PopulationDensityResult & {
  blastRadiusKm: number;
  impactAreaKm2: number;
  effectiveDensityPerSqKm: number;
  sampledMeanDensityPerSqKm?: number;
  sampledMaxDensityPerSqKm?: number;
  samplePointCount?: number;
  estimatedCasualties: number;
};

const WORLDPOP_SAMPLE_ENDPOINT = "https://api.worldpop.org/v1/services/sample";
const WORLDPOP_TASK_ENDPOINT = "https://api.worldpop.org/v1/tasks/";
const WORLDPOP_DATASET = "wpgppop"; // WorldPop global population, 100m
const WORLDPOP_YEAR = "2020";
const WORLDPOP_CELL_AREA_KM2 = 0.01; // 100m x 100m grid cell ~ 0.01 km^2
const WORLDPOP_MAX_POLLS = 8;
const WORLDPOP_POLL_INTERVAL_MS = 600;
const EARTH_RADIUS_KM = 6371;
const WORLDPOP_SAMPLING_RADIUS_CAP_KM = 60; // keep sampling footprint manageable
const LOCAL_INFLUENCE_SCALE_KM = 8;
const GLOBAL_DENSITY_CEILING_PER_KM2 = 5000;
const GLOBAL_POPULATION_CAP = 8_000_000_000;
const MIN_SAMPLE_RADIUS_KM = 2;
const MAX_SAMPLE_BEARINGS = 6;

const locationCache = new Map<string, PopulationDensityResult>();
const cellPopulationCache = new Map<string, number>();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toRadians = (deg: number) => (deg * Math.PI) / 180;
const toDegrees = (rad: number) => (rad * 180) / Math.PI;

function normaliseLongitude(lon: number) {
  let result = lon;
  while (result > 180) result -= 360;
  while (result < -180) result += 360;
  return result;
}

function destinationPoint(lat: number, lon: number, distanceKm: number, bearingRad: number) {
  const angularDistance = distanceKm / EARTH_RADIUS_KM;
  const latRad = toRadians(lat);
  const lonRad = toRadians(lon);
  const sinLat = Math.sin(latRad);
  const cosLat = Math.cos(latRad);
  const sinAngular = Math.sin(angularDistance);
  const cosAngular = Math.cos(angularDistance);

  const newLat = Math.asin(
    sinLat * cosAngular + cosLat * sinAngular * Math.cos(bearingRad)
  );
  const newLon =
    lonRad +
    Math.atan2(
      Math.sin(bearingRad) * sinAngular * cosLat,
      cosAngular - sinLat * Math.sin(newLat)
    );

  return {
    lat: toDegrees(newLat),
    lon: normaliseLongitude(toDegrees(newLon)),
  };
}

function cellKey(lat: number, lon: number) {
  return `${lat.toFixed(4)},${lon.toFixed(4)}`;
}

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
    countryPopulation: country.population,
    countryAreaKm2: country.area,
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

async function getWorldPopCellPopulation(lat: number, lon: number) {
  const key = cellKey(lat, lon);
  if (cellPopulationCache.has(key)) {
    return cellPopulationCache.get(key)!;
  }
  const population = await fetchWorldPopCellPopulation(lat, lon);
  cellPopulationCache.set(key, population);
  return population;
}

function generateSamplePoints(lat: number, lon: number, radiusKm: number) {
  const points: Array<{ lat: number; lon: number }> = [{ lat, lon }];

  const effectiveRadius = Math.min(
    Math.max(radiusKm, MIN_SAMPLE_RADIUS_KM),
    WORLDPOP_SAMPLING_RADIUS_CAP_KM
  );

  const bearings = Array.from({ length: MAX_SAMPLE_BEARINGS }, (_, i) => (2 * Math.PI * i) / MAX_SAMPLE_BEARINGS);

  const firstRingRadius = Math.max(MIN_SAMPLE_RADIUS_KM, effectiveRadius * 0.6);
  const secondRingRadius = effectiveRadius;

  for (const bearing of bearings) {
    points.push(destinationPoint(lat, lon, firstRingRadius, bearing));
  }

  if (radiusKm > 10) {
    for (const bearing of bearings) {
      points.push(destinationPoint(lat, lon, secondRingRadius, bearing));
    }
  }

  return points;
}

async function sampleWorldPopDensityStats(lat: number, lon: number, radiusKm: number) {
  const points = generateSamplePoints(lat, lon, radiusKm);

  const tasks = points.map(async (point) => {
    try {
      const population = await getWorldPopCellPopulation(point.lat, point.lon);
      return population / WORLDPOP_CELL_AREA_KM2;
    } catch (err) {
      console.warn("WorldPop sample point failed", point, err);
      return null;
    }
  });

  const results = await Promise.allSettled(tasks);
  const densities = results
    .filter((res): res is PromiseFulfilledResult<number | null> => res.status === "fulfilled")
    .map((res) => res.value)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  if (densities.length === 0) {
    return null;
  }

  const sum = densities.reduce((acc, value) => acc + value, 0);
  return {
    meanDensity: sum / densities.length,
    maxDensity: Math.max(...densities),
    minDensity: Math.min(...densities),
    sampleCount: densities.length,
  };
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
    const cellPopulation = await getWorldPopCellPopulation(lat, lon);
    const cellDensity = cellPopulation / WORLDPOP_CELL_AREA_KM2;
    const result: PopulationDensityResult = {
      countryCode: countryFacts?.countryCode ?? iso2?.toUpperCase() ?? "NA",
      countryName: countryFacts?.countryName ?? iso2?.toUpperCase() ?? "Unknown region",
      population: countryFacts?.countryPopulation ?? cellPopulation,
      areaKm2: countryFacts?.countryAreaKm2 ?? WORLDPOP_CELL_AREA_KM2,
      densityPerSqKm: cellDensity,
      source: "WorldPop 100m (2020)",
      notes: countryFacts
        ? `Country-wide mean density: ${countryFacts.densityPerSqKm.toFixed(1)} ppl/km^2`
        : undefined,
      localCellPopulation: cellPopulation,
      localCellAreaKm2: WORLDPOP_CELL_AREA_KM2,
      localCellDensityPerSqKm: cellDensity,
      countryMeanDensityPerSqKm: countryFacts?.countryMeanDensityPerSqKm ?? countryFacts?.densityPerSqKm,
      countryPopulation: countryFacts?.countryPopulation,
      countryAreaKm2: countryFacts?.countryAreaKm2,
    };

    locationCache.set(key, result);
    return result;
  } catch (err) {
    console.warn("WorldPop density lookup failed", err);
  }

  if (countryFacts) {
    const fallback: PopulationDensityResult = {
      ...countryFacts,
      notes: "WorldPop lookup unavailable; using national average density.",
      localCellPopulation: undefined,
      localCellAreaKm2: undefined,
      localCellDensityPerSqKm: undefined,
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
    countryPopulation: undefined,
    countryAreaKm2: undefined,
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

  let sampleStats: Awaited<ReturnType<typeof sampleWorldPopDensityStats>> | null = null;
  if (blastRadiusKm > 1) {
    try {
      sampleStats = await sampleWorldPopDensityStats(lat, lon, blastRadiusKm);
    } catch (err) {
      console.warn("WorldPop radial sampling failed", err);
    }
  }

  const localDensity = sampleStats?.meanDensity ?? density.localCellDensityPerSqKm ?? density.densityPerSqKm;
  const countryDensity = density.countryMeanDensityPerSqKm ?? density.densityPerSqKm;

  const localWeight = Math.exp(-Math.max(0, blastRadiusKm) / LOCAL_INFLUENCE_SCALE_KM);
  const blendedDensity = localDensity * localWeight + countryDensity * (1 - localWeight);

  const densityCeilingCandidates = [GLOBAL_DENSITY_CEILING_PER_KM2];
  if (sampleStats?.maxDensity) densityCeilingCandidates.push(sampleStats.maxDensity * 1.5);
  densityCeilingCandidates.push(countryDensity * 5, localDensity * 5);
  const densityCeiling = Math.max(1, Math.min(...densityCeilingCandidates.filter((n) => Number.isFinite(n) && n > 0)));
  const effectiveDensity = Math.min(Math.max(blendedDensity, 0), densityCeiling);

  const rawCasualties = effectiveDensity * impactAreaKm2;
  const countryPopulationCap = density.countryPopulation ? density.countryPopulation * 0.9 : Number.POSITIVE_INFINITY;
  const estimatedCasualties = Math.min(rawCasualties, countryPopulationCap, GLOBAL_POPULATION_CAP);

  return {
    ...density,
    blastRadiusKm,
    impactAreaKm2,
    effectiveDensityPerSqKm: effectiveDensity,
    sampledMeanDensityPerSqKm: sampleStats?.meanDensity,
    sampledMaxDensityPerSqKm: sampleStats?.maxDensity,
    samplePointCount: sampleStats?.sampleCount,
    estimatedCasualties: Math.max(0, estimatedCasualties),
  };
}

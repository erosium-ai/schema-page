// 🔑 Keywords: business types lock, builder dropdown, schema.org type mapping, v1.1 industry list
// The LOCKED 34-type industry list (Ike approved 2026-07-10 09:16 GMT+7).
// Mirror of trustbadge/src/lib/business-types.ts (textures live there; the
// builder only needs values + labels + schema types). Keep in sync.

export interface BusinessTypeOption {
  value: string;
  label: string;
  schemaType: string;
}

export const BUSINESS_TYPES: BusinessTypeOption[] = [
  { value: "plumber", label: "Plumber", schemaType: "Plumber" },
  { value: "electrician", label: "Electrician", schemaType: "Electrician" },
  { value: "builder_carpenter", label: "Builder / Carpenter", schemaType: "GeneralContractor" },
  { value: "painter", label: "Painter", schemaType: "HousePainter" },
  { value: "roofer", label: "Roofer", schemaType: "RoofingContractor" },
  { value: "landscaper", label: "Landscaper / Gardener", schemaType: "Landscaping" },
  { value: "concreter_paver", label: "Concreter / Paver", schemaType: "GeneralContractor" },
  { value: "handyman", label: "Handyman", schemaType: "HomeAndConstructionBusiness" },
  { value: "locksmith", label: "Locksmith", schemaType: "Locksmith" },
  { value: "pool_care", label: "Pool care", schemaType: "HomeAndConstructionBusiness" },
  { value: "pest_control", label: "Pest control", schemaType: "PestControl" },
  { value: "aircon_refrigeration", label: "Air con / Refrigeration", schemaType: "HVACBusiness" },
  { value: "mechanic", label: "Mechanic / Auto repairs", schemaType: "AutoRepair" },
  { value: "detailing_carwash", label: "Mobile detailing / Car wash", schemaType: "AutoWash" },
  { value: "cleaner", label: "Cleaner (home / commercial)", schemaType: "HousekeepingService" },
  { value: "babysitter_childcare", label: "Babysitter / Childcare", schemaType: "ChildCare" },
  { value: "removalist", label: "Removalist", schemaType: "MovingCompany" },
  { value: "pet_care", label: "Dog groomer / Pet care", schemaType: "LocalBusiness" },
  { value: "hairdresser_barber", label: "Hairdresser / Barber", schemaType: "HairSalon" },
  { value: "beauty_nails", label: "Beauty / Nails", schemaType: "BeautySalon" },
  { value: "fitness_pt", label: "Personal trainer / Fitness", schemaType: "ExerciseGym" },
  { value: "photographer", label: "Photographer", schemaType: "LocalBusiness" },
  { value: "tutor", label: "Tutor / Lessons", schemaType: "LocalBusiness" },
  { value: "cabinet_maker", label: "Cabinet maker", schemaType: "HomeAndConstructionBusiness" },
  { value: "welder_metalworker", label: "Welder / Metal worker", schemaType: "HomeAndConstructionBusiness" },
  { value: "retail", label: "Retail / Shop", schemaType: "Store" },
  { value: "hospitality", label: "Hospitality (café / restaurant / bar)", schemaType: "FoodEstablishment" },
  { value: "fencer", label: "Fencer", schemaType: "HomeAndConstructionBusiness" },
  { value: "renderer", label: "Renderer", schemaType: "HomeAndConstructionBusiness" },
  { value: "bricklayer", label: "Bricklayer", schemaType: "HomeAndConstructionBusiness" },
  { value: "plasterer", label: "Plasterer", schemaType: "HomeAndConstructionBusiness" },
  { value: "glass_repairs", label: "Glass repairs / installs", schemaType: "HomeAndConstructionBusiness" },
  { value: "tiler", label: "Tiler", schemaType: "HomeAndConstructionBusiness" },
  { value: "other", label: "Other / Something else", schemaType: "LocalBusiness" },
];

const VALID_VALUES = new Set(BUSINESS_TYPES.map((t) => t.value));

export function isValidBusinessType(value: unknown): value is string {
  return typeof value === "string" && VALID_VALUES.has(value.trim().toLowerCase());
}

const GBP_HOSTS = [
  "google.com",
  "www.google.com",
  "maps.google.com",
  "maps.app.goo.gl",
  "g.page",
  "business.google.com",
  "share.google",
];

/**
 * Validate + normalise a Google Business Profile URL. Returns the cleaned URL
 * or null when invalid. Only accepts known Google hosts; strips obvious
 * tracking params.
 */
export function sanitizeGbpUrl(input: unknown): string | null {
  const raw = String(input ?? "").trim();
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (!["http:", "https:"].includes(url.protocol)) return null;
  const host = url.hostname.toLowerCase();
  const ok = GBP_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  if (!ok) return null;
  for (const p of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "gclid"]) {
    url.searchParams.delete(p);
  }
  return url.toString();
}

/**
 * Parse suburbs / service areas from a comma- or newline-separated string
 * (or array). Trims, dedupes case-insensitively, strips HTML-ish chars,
 * caps at 20 entries × 60 chars.
 */
export function parseServiceAreas(input: unknown): string[] {
  const parts: string[] = Array.isArray(input)
    ? input.map((v) => String(v ?? ""))
    : String(input ?? "").split(/[,\n;]/);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of parts) {
    const clean = part.replace(/[<>]/g, "").trim().slice(0, 60);
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
    if (out.length >= 20) break;
  }
  return out;
}

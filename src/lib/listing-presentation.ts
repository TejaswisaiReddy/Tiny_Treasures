export const conditionDescriptions: Record<string, string> = {
  "New with tags": "Unworn, with the original tags attached.",
  Excellent: "Almost like new, with no visible stains, holes, or fading.",
  "Very Good": "Light signs of wear; clean, with no damage.",
  Good: "Some visible wear, but fully usable. Describe any marks or fading.",
  "Slightly Used": "Previously worn. Describe the wear and photograph any flaws.",
};

export function displayBrand(brand?: string) {
  const value = brand?.trim().replace(/\s+/g, " ");
  if (!value) return "Brand not specified";
  if (/^h\s*&\s*m$/i.test(value)) return "H&M";
  return value;
}

export function conditionTone(condition: string) {
  if (condition === "New with tags" || condition === "Excellent") return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  if (condition === "Very Good") return "bg-sky-50 text-sky-800 ring-sky-200";
  if (condition === "Good" || condition === "Slightly Used") return "bg-amber-50 text-amber-900 ring-amber-200";
  return "bg-gray-50 text-gray-600 ring-gray-200";
}

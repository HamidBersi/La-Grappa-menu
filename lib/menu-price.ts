/** Saisie : chiffres, une virgule ou un point, max 2 décimales. */
export const PRICE_INPUT_PATTERN = /^\d*(?:[.,]\d{0,2})?$/;

/** Valeur complète avant normalisation (9 / 9,9 / 9.90). */
export const PRICE_PATTERN = /^\d+(?:[.,]\d{1,2})?$/;

export function sanitizePriceInput(raw: string): string {
  let out = "";
  let seenDot = false;
  for (const char of raw.replace(/,/g, ".")) {
    if (char >= "0" && char <= "9") {
      if (seenDot) {
        const decimals = out.split(".")[1] ?? "";
        if (decimals.length >= 2) continue;
      }
      out += char;
      continue;
    }
    if (char === "." && !seenDot) {
      seenDot = true;
      if (!out) out = "0";
      out += ".";
    }
  }
  return out;
}

/** 9,9 / 9.9 / 9 → "9.90". Invalide → null. */
export function normalizeStoredPrice(raw: unknown): string | null {
  if (raw == null) return null;
  if (typeof raw !== "string" && typeof raw !== "number") return null;
  const trimmed = String(raw)
    .trim()
    .replace(/\s/g, "")
    .replace(",", ".")
    .replace(/\.$/, "");
  if (!trimmed) return null;
  if (!/^\d+(?:\.\d{1,2})?$/.test(trimmed)) return null;
  const value = Number.parseFloat(trimmed);
  if (!Number.isFinite(value) || value < 0) return null;
  return value.toFixed(2);
}

/** Chaîne vide → null. Sinon 9.90 */
export function parseOptionalPrice(
  raw: unknown,
): { ok: true; value: string | null } | { ok: false } {
  if (raw === undefined || raw === null) {
    return { ok: true, value: null };
  }
  if (typeof raw !== "string") return { ok: false };
  const trimmed = raw.trim();
  if (!trimmed) return { ok: true, value: null };
  const normalized = normalizeStoredPrice(trimmed);
  if (!normalized) return { ok: false };
  return { ok: true, value: normalized };
}

export function parseRequiredPrice(
  raw: unknown,
): { ok: true; value: string } | { ok: false } {
  const parsed = parseOptionalPrice(raw);
  if (!parsed.ok || !parsed.value) return { ok: false };
  return { ok: true, value: parsed.value };
}

export function headlineFromTiers(tiers: {
  verre: string | null;
  quart: string | null;
  demi: string | null;
  bouteille: string | null;
}): string | null {
  return tiers.verre ?? tiers.bouteille ?? tiers.quart ?? tiers.demi;
}

export function isWineCategoryName(name: string): boolean {
  return /vin|cave|spumante/i.test(name);
}

export const SEARCH_MIN_QUERY_LENGTH = 2;
export const SEARCH_MAX_RESULTS = 8;

function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

/**
 * Match si la requête apparaît n’importe où dans le nom (accents ignorés).
 * "saum" → "Carpaccio de saumon", "arp" → "Carpaccio"
 */
export function matchesDishName(title: string, query: string): boolean {
  const normalizedQuery = fold(query).trim();
  if (normalizedQuery.length < SEARCH_MIN_QUERY_LENGTH) {
    return false;
  }
  return fold(title).includes(normalizedQuery);
}

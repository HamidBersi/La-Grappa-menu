export const SEARCH_MIN_QUERY_LENGTH = 2;
export const SEARCH_MAX_RESULTS = 8;

/**
 * Match si la requête est le début d’au moins un mot du nom.
 * "saum" → "Carpaccio de saumon"
 */
export function matchesWordPrefix(title: string, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length < SEARCH_MIN_QUERY_LENGTH) {
    return false;
  }

  const words = title
    .toLowerCase()
    .split(/[\s'-]+/)
    .filter(Boolean);

  return words.some((word) => word.startsWith(normalizedQuery));
}

export const DISH_EMOJI_OPTIONS = [
  { id: "chili", label: "Piment" },
  { id: "bio", label: "Bio" },
  { id: "veg", label: "Végé" },
  { id: "vegan", label: "Vegan" },
] as const;

export type DishEmojiId = (typeof DISH_EMOJI_OPTIONS)[number]["id"];

const LEGACY: Record<string, DishEmojiId> = {
  "🌶️": "chili",
  "🌶": "chili",
  "🌱": "bio",
  "🌿": "bio",
  "🍃": "bio",
  "🥬": "veg",
};

export function normalizeDishEmoji(raw: unknown): string | null {
  if (raw == null) return null;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (DISH_EMOJI_OPTIONS.some((option) => option.id === trimmed)) {
    return trimmed;
  }
  for (const [symbol, id] of Object.entries(LEGACY)) {
    if (trimmed.includes(symbol)) return id;
  }
  return null;
}

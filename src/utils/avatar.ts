// Soccer-themed avatars represented by emojis
export const AVATAR_OPTIONS = [
  "⚽",
  "🏆",
  "🥅",
  "🏟️",
  "👟",
  "🧤",
  "🏁",
  "🏅",
  "🦓",
  "📣",
  "🎫",
  "🥇",
];

export function getAvatarById(
  id: string | number | undefined | null,
): string | null {
  if (id === undefined || id === null) return null;

  // If the id is a string but not numeric (someone old might have saved "⚽" literally),
  // try to see if it matches our list first to be backward compatible in UI.
  if (typeof id === "string" && isNaN(Number(id))) {
    if (AVATAR_OPTIONS.includes(id)) {
      return id;
    }
    return null;
  }

  // Otherwise assume it's a numeric ID representing the 1-based index
  const numId = Number(id);
  if (numId >= 1 && numId <= AVATAR_OPTIONS.length) {
    return AVATAR_OPTIONS[numId - 1]; // numId 1 maps to index 0
  }

  return null;
}

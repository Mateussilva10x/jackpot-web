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

  if (typeof id === "string" && isNaN(Number(id))) {
    if (AVATAR_OPTIONS.includes(id)) {
      return id;
    }
    return null;
  }

  const numId = Number(id);
  if (numId >= 1 && numId <= AVATAR_OPTIONS.length) {
    return AVATAR_OPTIONS[numId - 1];
  }

  return null;
}

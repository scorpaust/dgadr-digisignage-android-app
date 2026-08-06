export function truncateText(
  text: string,
  maxLength: number,
  ellipsis = "...",
): string {
  if (!text || text.length <= maxLength) return text;

  const sliced = text.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  const trimmed = lastSpace > maxLength * 0.6 ? sliced.slice(0, lastSpace) : sliced;

  return `${trimmed.trimEnd()}${ellipsis}`;
}

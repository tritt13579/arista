// Keep focal points attached to CMS records when images are reordered or reused.
export function imageFocusPosition(value, fallback = 50) {
  const height = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return `center ${Math.min(100, Math.max(0, height))}%`;
}

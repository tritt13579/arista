import { node } from "./dom.js";

export function addGalleryOverflow(button, remaining, total) {
  if (remaining <= 0) return;
  button.classList.add("gallery-album");
  const label = `Xem tất cả ${total} ảnh`;
  const overlay = node("span", "gallery-more-count");
  overlay.setAttribute("aria-hidden", "true");
  const icon = node("span", "gallery-album-icon");
  icon.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="13" height="13" rx="3" transform="rotate(-8 9.5 14.5)"/><path d="M8 7V5a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3"/><circle cx="7.5" cy="12" r="1"/><path d="m4 18 4-4 6 5"/></svg>`;
  overlay.append(icon, node("span", "gallery-album-label", label));
  button.append(overlay);
  button.setAttribute("aria-label", label);
}

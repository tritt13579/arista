import { node } from "../utils/dom.js";
import { imageUrl } from "../utils/image-url.js";
import { imageFocusPosition } from "../utils/image-focus.js";
import { createSectionLayout } from "./section-layout.js";

export function renderStudentMoments(content, showImages) {
  if (!content) return null;
  const { section, inner } = createSectionLayout("moments", content);
  const gallery = node("div", "moments-gallery");
  const images = (content.items || []).map(item => ({
    src: imageUrl(item.image), caption: String(item.title || ""), alt: String(item.title || ""),
    position: imageFocusPosition(item.imageFocusHeight),
  })).filter(item => item.src);
  images.forEach((item, index) => {
    const card = node("figure", "moment-card reveal");
    const button = node("button", "moment-image-button");
    button.type = "button";
    button.setAttribute("aria-label", `View image: ${item.caption || "Student moment"}`);
    button.setAttribute("aria-haspopup", "dialog");
    const image = node("img", "");
    image.alt = item.alt;
    image.style.objectPosition = item.position;
    image.loading = "lazy";
    image.decoding = "async";
    const fallback = node("span", "moment-image-fallback", item.caption || "Image unavailable");
    fallback.hidden = true;
    image.addEventListener("error", () => {
      image.hidden = true;
      fallback.hidden = false;
      button.disabled = true;
    }, { once: true });
    image.src = item.src;
    button.append(image, fallback);
    button.onclick = () => showImages(images, index);
    card.append(button);
    if (item.caption) card.append(node("figcaption", "moment-caption", item.caption));
    gallery.append(card);
  });
  if (gallery.childElementCount) inner.append(gallery);
  const links = node("div", "moments-social-links");
  const paths = {
    youtube: "M8 5v14l11-7z",
    facebook: "M14 8V6c0-.6.4-1 1-1h2V1h-3a5 5 0 0 0-5 5v2H7v4h2v11h5V12h3l1-4z",
  };
  for (const item of content.socialLinks || []) {
    let url;
    try { url = new URL(item.url); } catch { continue; }
    if (url.protocol !== "https:") continue;
    const link = node("a", "moment-social-link");
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const icon = node("span", "moment-social-icon");
    icon.setAttribute("aria-hidden", "true");
    const path = paths[item.platform];
    if (path) icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="${path}"></path></svg>`;
    const copy = node("span", "moment-social-copy");
    copy.append(node("span", "moment-social-title", item.title || item.platform));
    if (item.description) copy.append(node("span", "moment-social-description", item.description));
    link.append(icon, copy);
    links.append(link);
  }
  if (links.childElementCount) inner.append(links);
  section.append(inner);
  return section;
}

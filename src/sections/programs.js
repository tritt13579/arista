import { node } from "../utils/dom.js";
import { imageUrl, setResponsiveImage } from "../utils/image-url.js";
import { imageFocusPosition } from "../utils/image-focus.js";
import { createSectionLayout } from "./section-layout.js";

export function renderPrograms(content, buttonText) {
  if (!content) return null;
  const { section, inner, heading } = createSectionLayout("programs", content);
  if (content.labels) {
    const labels = node("div", "labels");
    for (const label of String(content.labels)
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean))
      labels.append(node("span", "label", label));
    heading.append(labels);
  }
  const grid = node("div", "card-grid");
  (content.items || []).forEach((item) => {
    const detailUrl = String(item.detailUrl || '').trim();
    const hasDetail = /^\/(?!\/)/.test(detailUrl) || /^https:\/\//i.test(detailUrl);
    const card = node(hasDetail ? 'a' : 'article', 'program reveal');
    if (hasDetail) {
      card.href = detailUrl;
      card.setAttribute('aria-label', `Khám phá bộ môn ${item.title || ''}`);
    }
    const media = node("div", "program-media");
    const url = imageUrl(item.image);
    const fallback = () => media.replaceChildren(node("span", "", item.title));
    if (url) {
      const image = node("img", "");
      image.alt = String(item.title || "");
      image.style.objectPosition = imageFocusPosition(item.imageFocusHeight);
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", fallback, { once: true });
      setResponsiveImage(image, item.image, "(max-width: 640px) calc(100vw - 40px), (max-width: 1024px) 46vw, 290px");
      media.append(image);
    } else fallback();
    const body = node("div", "program-copy");
    if (item.categoryLabel)
      body.append(node("span", "category", item.categoryLabel));
    body.append(node("h3", "", item.title), node("p", "", item.description));
    // One native link covers the whole card; its CTA is text, not a nested link.
    if (hasDetail) {
      const details = node('span', 'program-action', buttonText || 'Khám phá bộ môn →');
      body.append(details);
    }
    card.append(media, body);
    grid.append(card);
  });
  if (grid.childElementCount) inner.append(grid);
  section.append(inner);
  return section;
}

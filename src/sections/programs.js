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
    const card = node("article", "program reveal");
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
    // Use one CMS-labelled link to the subject page instead of a registration action.
    const detailUrl = String(item.detailUrl || '').trim();
    if (/^\/(?!\/)/.test(detailUrl) || /^https:\/\//i.test(detailUrl)) {
      const details = node('a', 'program-action', buttonText || 'Khám phá bộ môn →');
      details.href = detailUrl;
      details.setAttribute('aria-label', `${buttonText || 'Khám phá bộ môn →'} — ${item.title || ''}`);
      body.append(details);
    }
    card.append(media, body);
    grid.append(card);
  });
  if (grid.childElementCount) inner.append(grid);
  section.append(inner);
  return section;
}

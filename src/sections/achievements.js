import { node } from "../utils/dom.js";
import { imageUrl, setResponsiveImage } from "../utils/image-url.js";
import { imageFocusPosition } from "../utils/image-focus.js";
import { createSectionLayout } from "./section-layout.js";

export function renderAchievements(content, showImages) {
  if (!content) return null;
  const { section, inner, heading } = createSectionLayout("achievements", content);
  const layout = node("div", "achievements-layout");
  const summary = node("div", "achievements-summary");
  summary.append(heading);
  if (content.featuredValue || content.featuredLabel) {
    const total = node("p", "achievement-total");
    if (content.featuredValue) total.append(node("span", "achievement-total-value", content.featuredValue));
    if (content.featuredLabel) total.append(node("span", "achievement-total-label", content.featuredLabel));
    summary.append(total);
  }
  const counts = node("dl", "award-counts");
  for (const item of content.counts || []) {
    const count = node("div", "award-count");
    count.append(node("dt", "", item.title), node("dd", "", item.value));
    counts.append(count);
  }
  if (counts.childElementCount) summary.append(counts);
  const images = [];
  const createPhoto = (src, caption, alt, className, focusHeight) => {
    const figure = node("figure", className);
    const button = node("button", "achievement-image-button");
    button.type = "button";
    button.setAttribute("aria-label", `View image: ${alt || caption || "Achievement"}`);
    button.setAttribute("aria-haspopup", "dialog");
    const image = node("img", "");
    image.alt = alt || caption || "";
    image.style.objectPosition = imageFocusPosition(focusHeight);
    image.loading = "lazy";
    image.decoding = "async";
    setResponsiveImage(image, src, className === "achievement-main-photo" ? "(max-width: 768px) calc(100vw - 40px), (max-width: 1240px) 46vw, 570px" : "(max-width: 640px) calc(100vw - 40px), (max-width: 1024px) 46vw, 390px");
    const fallback = node("span", "achievement-photo-fallback", caption || alt || "Image unavailable");
    fallback.hidden = true;
    button.append(image, fallback);
    image.addEventListener("error", () => {
      image.hidden = true;
      fallback.hidden = false;
      button.disabled = true;
    }, { once: true });
    const index = images.length;
    images.push({ src, caption, alt });
    button.onclick = () => showImages(images, index);
    figure.append(button);
    if (caption) figure.append(node("figcaption", "", caption));
    return figure;
  };
  const mainImage = imageUrl(content.image);
  if (mainImage) summary.append(createPhoto(mainImage, content.caption, content.imageDescription, "achievement-main-photo", content.imageFocusHeight));
  const list = node("ul", "achievement-list");
  for (const item of content.items || []) {
    const entry = node("li", "achievement-entry reveal");
    if (item.year) entry.append(node("span", "achievement-year", item.year));
    const copy = node("div", "achievement-entry-copy");
    copy.append(node("h3", "", item.title));
    if (item.result) copy.append(node("p", "", item.result));
    entry.append(copy);
    list.append(entry);
  }
  layout.append(summary);
  if (list.childElementCount) layout.append(list);
  else layout.classList.add("achievements-summary-only");
  inner.append(layout);
  const gallery = node("div", "achievement-gallery");
  for (const item of content.photos || []) {
    const src = imageUrl(item.image);
    if (src) gallery.append(createPhoto(src, item.title, item.title, "achievement-proof reveal", item.imageFocusHeight));
  }
  if (gallery.childElementCount) inner.append(gallery);
  section.append(inner);
  return section;
}

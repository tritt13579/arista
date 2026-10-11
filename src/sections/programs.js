import { node } from "../utils/dom.js";
import { imageUrl } from "../utils/image-url.js";
import { imageFocusPosition } from "../utils/image-focus.js";
import { createSectionLayout } from "./section-layout.js";

export function renderPrograms(content, buttonText, action) {
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
      image.src = url;
      media.append(image);
    } else fallback();
    const body = node("div", "program-copy");
    if (item.categoryLabel)
      body.append(node("span", "category", item.categoryLabel));
    body.append(node("h3", "", item.title), node("p", "", item.description));
    if (buttonText) {
      const button = node("button", "program-action", buttonText);
      button.type = "button";
      button.setAttribute("aria-label", `${buttonText} — ${item.title || ""}`);
      button.addEventListener("click", () =>
        action("registration", buttonText, {
          programName: String(item.title || ""),
        }),
      );
      body.append(button);
    }
    card.append(media, body);
    grid.append(card);
  });
  if (grid.childElementCount) inner.append(grid);
  section.append(inner);
  return section;
}

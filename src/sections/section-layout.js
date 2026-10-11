import { node } from "../utils/dom.js";

export function createSectionLayout(key, content) {
  const section = node("section", `section ${key}`);
  section.id = key;
  section.tabIndex = -1;
  const inner = node("div", "section-inner");
  const heading = node("div", "section-heading reveal");
  const copy = node("div", "");
  if (content.introText) copy.append(node("p", "eyebrow", content.introText));
  if (content.heading) {
    const title = node("h2", "", content.heading);
    title.id = `${key}-heading`;
    section.setAttribute("aria-labelledby", title.id);
    copy.append(title);
  }
  if (content.description)
    copy.append(node("p", "section-description", content.description));
  heading.append(copy);
  inner.append(heading);
  return { section, inner, heading };
}

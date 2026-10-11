import { node } from "../utils/dom.js";
import { imageUrl } from "../utils/image-url.js";
import { imageFocusPosition } from "../utils/image-focus.js";
import { createSectionLayout } from "./section-layout.js";

function portrait(item, className) {
  const media = node("div", className);
  const fallback = () => media.replaceChildren(node("span", "portrait-fallback", item.title));
  const url = imageUrl(item.photo);
  if (!url) fallback();
  else {
    const image = node("img", "");
    image.alt = String(item.title || "");
    image.style.objectPosition = imageFocusPosition(item.photoFocusHeight, 20);
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", fallback, { once: true });
    image.src = url;
    media.append(image);
  }
  return media;
}

export function renderTeachers(content, action) {
  if (!content) return null;
  const { section, inner, heading } = createSectionLayout("teachers", content);
  heading.classList.add("teacher-team-heading");
  const description = heading.querySelector(".section-description");
  if (description) heading.append(description);
  const items = content.items || [];
  const featured = items.find((item) => item.featured === true);
  if (featured) {
    const profile = node("article", "featured-teacher reveal");
    const media = node("div", "featured-teacher-media");
    media.append(portrait(featured, "featured-teacher-photo"));
    if (featured.highlightText) media.append(node("p", "teacher-highlight", featured.highlightText));
    const copy = node("div", "featured-teacher-copy");
    if (featured.role) copy.append(node("p", "eyebrow", featured.role));
    const name = node("h3", "featured-teacher-name", featured.title);
    name.id = "featured-teacher-name";
    profile.setAttribute("aria-labelledby", name.id);
    copy.append(name);
    if (featured.credential) copy.append(node("p", "teacher-credential", featured.credential));
    const qualifications = node("ul", "teacher-qualifications");
    for (const text of String(featured.qualifications || "").split(/\r?\n/).map(value => value.trim()).filter(Boolean)) {
      qualifications.append(node("li", "", text));
    }
    if (qualifications.childElementCount) copy.append(qualifications);
    if (content.primaryButtonText) {
      const button = node("button", "cta teacher-action", content.primaryButtonText);
      button.type = "button";
      button.addEventListener("click", () => action("registration", content.primaryButtonText, { teacherName: String(featured.title || "") }));
      copy.append(button);
    }
    profile.append(media, copy);
    inner.insertBefore(profile, heading);
  }
  const team = items.filter(item => item !== featured);
  const grid = node("div", "teacher-grid");
  for (const item of team) {
    const card = node("figure", "teacher-card reveal");
    const caption = node("figcaption", "");
    caption.append(node("h3", "teacher-name", item.title));
    if (item.role) caption.append(node("p", "teacher-role", item.role));
    if (item.credential) caption.append(node("p", "teacher-card-credential", item.credential));
    card.append(portrait(item, "teacher-photo"), caption);
    grid.append(card);
  }
  if (grid.childElementCount) inner.append(grid);
  section.append(inner);
  return section;
}

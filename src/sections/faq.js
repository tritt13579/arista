import { node } from "../utils/dom.js";
import { createSectionLayout } from "./section-layout.js";
import { bindFaqAccordion } from "../utils/faq-accordion.js";

export function renderFaq(content) {
  if (!content) return null;
  const { section, inner, heading } = createSectionLayout("faq", content);
  const phone = String(content.phone || "").trim();
  if (/^\+?[\d\s().-]+$/.test(phone)) {
    const contact = node("p", "faq-contact");
    if (content.contactText) contact.append(document.createTextNode(`${content.contactText} `));
    const link = node("a", "", content.phoneLabel || phone);
    link.href = `tel:${phone.replace(/[^\d+]/g, "")}`;
    contact.append(link);
    heading.querySelector("div").append(contact);
  }
  const list = node("div", "faq-list reveal");
  for (const item of content.items || []) {
    if (!String(item.title || "").trim()) continue;
    const detail = node("details", "faq-item");
    const summary = node("summary", "faq-question");
    const icon = node("span", "faq-icon", "+");
    icon.setAttribute("aria-hidden", "true");
    summary.append(node("span", "", item.title), icon);
    const panel = node("div", "faq-answer-panel");
    panel.append(node("p", "faq-answer", item.answer || ""));
    detail.append(summary, panel);
    list.append(detail);
  }
  inner.append(list);
  section.append(inner);
  section.dispose = bindFaqAccordion(section);
  return section;
}

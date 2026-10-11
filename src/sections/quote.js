import { node } from "../utils/dom.js";

export function renderQuote(content) {
  if (!content?.description) return null;
  const section = node("section", "section quote");
  section.id = "quote";
  const inner = node("div", "section-inner reveal");
  inner.append(node("blockquote", "", content.description));
  section.append(inner);
  return section;
}

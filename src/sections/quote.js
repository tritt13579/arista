import { node } from "../utils/dom.js";

export function renderQuote(content) {
  if (!content?.description) return null;
  const section = node("section", "section quote");
  section.id = "quote";
  const inner = node("div", "section-inner reveal");
  const quote = node("blockquote", "");
  const text = String(content.description);
  const highlights = [...new Set(String(content.labels || "")
    .split(/\r?\n/)
    .map((phrase) => phrase.trim())
    .filter(Boolean))].sort((a, b) => b.length - a.length);
  let offset = 0;
  while (offset < text.length) {
    let nextIndex = text.length;
    let nextPhrase = "";
    for (const phrase of highlights) {
      const index = text.indexOf(phrase, offset);
      if (index >= 0 && index < nextIndex) {
        nextIndex = index;
        nextPhrase = phrase;
      }
    }
    quote.append(document.createTextNode(text.slice(offset, nextIndex)));
    if (!nextPhrase) break;
    quote.append(node("span", "quote-highlight", nextPhrase));
    offset = nextIndex + nextPhrase.length;
  }
  inner.append(quote);
  section.append(inner);
  return section;
}

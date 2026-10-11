import { node } from "../utils/dom.js";
import { createSectionLayout } from "./section-layout.js";

export function renderPhilosophy(content) {
  if (!content) return null;
  const { section, inner } = createSectionLayout("philosophy", content);
  const grid = node("div", "card-grid");
  (content.items || []).forEach((item, index) => {
    const card = node("article", "pillar reveal");
    const number = node(
      "span",
      "card-number",
      String(index + 1).padStart(2, "0"),
    );
    number.setAttribute("aria-hidden", "true");
    card.append(
      number,
      node("h3", "", item.title),
      node("p", "", item.description),
    );
    grid.append(card);
  });
  if (grid.childElementCount) inner.append(grid);
  section.append(inner);
  return section;
}

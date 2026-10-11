import { node } from "../utils/dom.js";
import { createSectionLayout } from "./section-layout.js";

export function renderLearningJourney(content) {
  if (!content) return null;
  const { section, inner } = createSectionLayout("learning-journey", content);
  const steps = node("ol", "journey-steps");
  (content.items || []).forEach((item, index) => {
    const step = node("li", "journey-step reveal");
    const number = node("span", "journey-number");
    number.append(node("span", "journey-number-text", String(index + 1).padStart(2, "0")));
    number.setAttribute("aria-hidden", "true");
    step.append(number, node("h3", "", item.title), node("p", "", item.description));
    steps.append(step);
  });
  if (steps.childElementCount) inner.append(steps);
  section.append(inner);
  return section;
}

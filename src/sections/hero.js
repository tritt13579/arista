import { imageUrl, setResponsiveImage } from "../utils/image-url.js";
import { imageFocusPosition } from "../utils/image-focus.js";

export const heroTemplate = `
<div class="shell" hidden lang="vi">
  <img class="photo" alt="" fetchpriority="high">
  <div class="overlay" aria-hidden="true"></div>
  <main>
    <div class="copy">
      <p class="eyebrow"></p>
      <h1 tabindex="-1"></h1>
      <p class="slogan"></p>
      <p class="description"></p>
      <div class="actions">
        <button class="cta primary" type="button"></button>
        <button class="cta secondary" type="button"></button>
      </div>
    </div>
    <dl aria-label="Arista highlights"></dl>
  </main>
</div>
`;

export function renderHero(root, hero, stats, action) {
  for (const [selector, field] of Object.entries({
    ".eyebrow": "eyebrow",
    h1: "heading",
    ".slogan": "slogan",
    ".description": "description",
  })) {
    root.querySelector(selector).textContent = String(hero[field] ?? "");
    root.querySelector(selector).hidden = !hero[field];
  }
  for (const [selector, field, alt] of [[".photo", "image", hero.imageAlt]]) {
    const img = root.querySelector(selector);
    const url = imageUrl(hero[field]);
    img.hidden = !url;
    setResponsiveImage(img, hero[field], "100vw");
    img.alt = String(alt || "");
    img.style.objectPosition = imageFocusPosition(hero.imageFocusHeight, 40);
  }
  for (const [selector, label, target] of [
    [".primary", hero.primaryLabel, hero.primaryTarget],
    [".secondary", hero.secondaryLabel, hero.secondaryTarget],
  ]) {
    const button = root.querySelector(selector);
    button.textContent = String(label || "");
    button.hidden = !label;
    button.onclick = () => action(String(target || ""), String(label || ""));
  }
  root.querySelector("dl").hidden = !stats.length;
  root.querySelector("dl").replaceChildren(
    ...stats.map((item) => {
      const box = document.createElement("div");
      box.className = "stat";
      const label = document.createElement("dt");
      label.textContent = String(item.title || "");
      const value = document.createElement("dd");
      value.textContent = String(item.value || "");
      box.append(label, value);
      return box;
    }),
  );
}

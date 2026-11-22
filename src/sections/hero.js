import { renderHeroCollage } from './hero-collage.js';
import { imageUrl, setResponsiveImage } from '../utils/image-url.js';
import { imageFocusPosition } from '../utils/image-focus.js';

export const heroTemplate = `
<div class="shell" hidden lang="vi">
  <img class="photo" alt="" fetchpriority="high" decoding="async">
  <div class="overlay" aria-hidden="true"></div>
  <div class="hero-opening-shade" aria-hidden="true"></div>
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
    <div class="hero-visual"></div>
  </main>
</div>
`;

export function renderHero(root, hero, items, action, openViewer) {
  const photo = root.querySelector('.shell > .photo');
  photo.hidden = !imageUrl(hero.image);
  photo.alt = String(hero.imageAlt || '');
  photo.style.objectPosition = imageFocusPosition(hero.imageFocusHeight, 40);
  photo.onerror = () => { photo.hidden = true; };
  setResponsiveImage(photo, hero.image, '100vw');
  for (const [selector, field] of Object.entries({
    ".eyebrow": "eyebrow",
    h1: "heading",
    ".slogan": "slogan",
    ".description": "description",
  })) {
    root.querySelector(selector).textContent = String(hero[field] ?? "");
    root.querySelector(selector).hidden = !hero[field];
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
  renderHeroCollage(root, items, openViewer);
}

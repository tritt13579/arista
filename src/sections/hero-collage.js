import { node } from '../utils/dom.js';
import { imageUrl, setResponsiveImage } from '../utils/image-url.js';
import { bindHeroHover } from '../utils/hero-hover.js';

export const heroArcCoordinates = [
  [50, 0, 34, -3, 9], [28, 5, 36, 5, -11], [8, 13, 34, -6, 3],
  [0, 22, 36, 3, -8], [0, 32, 34, -4, 10], [0, 43, 36, 4, -5],
  [4, 54, 34, -3, 10], [12, 64, 34, 5, -10], [26, 72, 34, -5, 5], [46, 78, 32, 4, -8],
];

export function heroCollageItems(data) {
  return (data.heroImages || [])
    .filter(item => item.show === true && imageUrl(item.image))
    .map(item => ({ src: imageUrl(item.image), title: item.title || 'Ảnh Arista', category: 'Ảnh nổi bật' }));
}

// The ten points describe the curve, not an image-count limit. Interpolation
// gives every record its own position, including when there are more than ten.
export function heroArcPosition(index, count) {
  if (count === 1) return [20, 32, 60, 0, 0];
  const position = index / Math.max(1, count - 1) * (heroArcCoordinates.length - 1);
  const from = Math.floor(position), to = Math.min(from + 1, heroArcCoordinates.length - 1);
  return heroArcCoordinates[from].map((value, column) => value + (heroArcCoordinates[to][column] - value) * (position - from));
}

export function renderHeroCollage(root, items, openViewer) {
  const visual = root.querySelector('.hero-visual');
  visual.dispose?.();
  visual.replaceChildren(); visual.hidden = !items.length;
  root.querySelector('.shell').classList.toggle('hero-without-collage', !items.length);
  if (!items.length) return;
  const canvas = node('div', 'hero-collage');
  canvas.setAttribute('role', 'group'); canvas.setAttribute('aria-label', 'Ảnh nổi bật của Arista');
  canvas.style.setProperty('--hero-front-layer', items.length + 1);
  const images = items.map(item => ({ src: item.src, alt: item.title }));
  const previews = [];
  const frames = [];
  let interaction;
  items.forEach((item, index) => {
    const [left, top, width, start, end] = heroArcPosition(index, items.length);
    const frame = node('div', 'hero-card-entry');
    Object.entries({ left: `${100 - left - width}%`, top: `${top}%`, width: `${width}%`,
      '--start-turn': `${-start}deg`, '--end-turn': `${-end}deg`, '--layer': index + 1,
    }).forEach(([key, value]) => frame.style.setProperty(key, value));
    const button = node('button', 'hero-card'); button.type = 'button';
    button.setAttribute('aria-label', `Xem ảnh: ${item.title}`);
    button.setAttribute('aria-haspopup', 'dialog');
    const surface = node('span', 'hero-card-surface');
    const img = node('img'); img.alt = item.title; img.loading = 'eager'; img.decoding = 'async';
    setResponsiveImage(img, item.src, '(max-width: 640px) 180px, 260px', [240, 360, 480]);
    img.addEventListener('error', () => { img.hidden = true; surface.append(node('span', 'hero-image-fallback', item.title)); }, { once: true });
    surface.append(img); button.append(surface); frame.append(button); canvas.append(frame); previews.push(img); frames.push(frame);
    button.onclick = () => {
      interaction.reset();
      previews.forEach((preview, i) => {
        if (preview.complete && preview.naturalWidth) images[i].previewSrc = preview.currentSrc || preview.src;
      });
      // Tilted thumbnails use the viewer's fade, avoiding an axis-aligned
      // thumbnail flight that would visibly straighten the photo on opening.
      openViewer(images, index);
    };
  });
  visual.append(canvas);
  interaction = bindHeroHover(canvas, frames);
  visual.dispose = () => interaction.dispose();
}

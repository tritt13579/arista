import { node } from '../utils/dom.js';
import { imageUrl, setResponsiveImage } from '../utils/image-url.js';
import { imageFocusPosition } from '../utils/image-focus.js';

function arrow(direction) {
  const button = node('button', 'tp-arrow');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(svg.namespaceURI, 'path');
  path.setAttribute('d', direction === 'previous' ? 'M18 12H6m5-5-5 5 5 5' : 'M6 12h12m-5-5 5 5-5 5');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.5');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.append(path);
  button.append(svg);
  return button;
}

export function renderTestimonials(content) {
  const reviews = (content?.items || []).filter(item => item.show !== false && (item.quote || item.excerpt))
    .map(item => ({ ...item, name: item.title || item.name || '' }));
  if (!reviews.length) return null;
  const section = node('section', 'section testimonials tp-section');
  section.id = 'testimonials';
  section.tabIndex = -1;
  section.setAttribute('aria-labelledby', 'testimonials-heading');
  const inner = node('div', 'section-inner');
  const heading = node('div', 'tp-heading');
  const title = node('h2', '', content.heading || 'Arista qua lời học viên và phụ huynh');
  title.id = 'testimonials-heading';
  if (content.introText) heading.append(node('p', 'eyebrow', content.introText));
  heading.append(title);
  if (content.description) heading.append(node('p', 'tp-description', content.description));
  const body = node('div', 'tp-layout');
  const spotlight = node('div', 'tp-spotlight');
  const display = node('div', 'tp-spotlight-content');
  const list = node('div', 'tp-person-list');
  list.setAttribute('role', 'group');
  list.setAttribute('aria-label', 'Chọn người chia sẻ');
  const controls = node('div', 'tp-controls');
  const previous = arrow('previous');
  const next = arrow('next');
  previous.type = next.type = 'button';
  previous.setAttribute('aria-label', 'Đánh giá trước');
  next.setAttribute('aria-label', 'Đánh giá tiếp theo');
  previous.hidden = next.hidden = reviews.length < 2;
  const counter = node('span', 'tp-counter');
  const status = node('p', 'tp-sr-only');
  status.setAttribute('role', 'status');
  const people = [];
  const animations = new Set();
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0;
  let generation = 0;
  let disposed = false;
  let readId = 0;
  const cancelAnimations = () => animations.forEach(animation => animation.cancel());
  const animate = (frames, options, target = display) => {
    if (motion.matches || disposed) return null;
    const animation = target.animate(frames, options);
    animations.add(animation);
    animation.finished.catch(() => {}).finally(() => animations.delete(animation));
    return animation;
  };
  const person = item => {
    const author = node('div', 'tp-author');
    const words = String(item.name || '').trim().split(/\s+/).filter(Boolean);
    const initials = item.initials || (words.length > 1 ? words[0][0] + words.at(-1)[0] : words[0]?.[0] || '');
    const avatar = node('span', 'tp-avatar', initials);
    avatar.setAttribute('aria-hidden', 'true');
    if (imageUrl(item.photo)) {
      const image = node('img', '');
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      image.style.objectPosition = imageFocusPosition(item.photoFocusHeight);
      setResponsiveImage(image, item.photo, '42px', [80, 160]);
      image.addEventListener('error', () => avatar.replaceChildren(document.createTextNode(initials)), { once: true });
      avatar.replaceChildren(image);
    }
    const text = node('div', '');
    text.append(node('strong', '', item.name), node('span', 'tp-role', item.role));
    author.append(avatar, text);
    return author;
  };
  const show = () => {
    const item = reviews[selected];
    const mark = node('span', 'tp-quote-mark', '“');
    mark.setAttribute('aria-hidden', 'true');
    const wrapper = node('div', 'tp-review-text');
    const quote = node('blockquote', '', item.excerpt || item.quote);
    quote.id = `testimonial-quote-${++readId}`;
    wrapper.append(quote);
    if (item.excerpt && item.quote && item.excerpt !== item.quote) {
      const more = node('button', 'tp-read-more', 'Đọc đầy đủ');
      more.type = 'button';
      more.setAttribute('aria-expanded', 'false');
      more.setAttribute('aria-controls', quote.id);
      let expansion = null;
      more.onclick = () => {
        const startHeight = quote.getBoundingClientRect().height;
        expansion?.cancel();
        const expanded = more.getAttribute('aria-expanded') !== 'true';
        quote.style.height = '';
        quote.textContent = expanded ? item.quote : item.excerpt;
        more.textContent = expanded ? 'Thu gọn' : 'Đọc đầy đủ';
        more.setAttribute('aria-expanded', String(expanded));
        const endHeight = quote.getBoundingClientRect().height;
        quote.style.overflow = 'hidden';
        expansion = animate([
          { height: `${startHeight}px`, opacity: 0.45 },
          { height: `${endHeight}px`, opacity: 1 },
        ], { duration: expanded ? 340 : 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }, quote);
        const current = expansion;
        const finish = () => {
          if (expansion !== current) return;
          quote.style.height = '';
          quote.style.overflow = '';
          expansion = null;
        };
        if (current) current.finished.catch(() => {}).finally(finish);
        else finish();
      };
      wrapper.append(more);
    }
    display.replaceChildren(mark, wrapper, person(item));
    people.forEach((button, index) => button.setAttribute('aria-pressed', String(index === selected)));
    counter.textContent = `${String(selected + 1).padStart(2, '0')} / ${String(reviews.length).padStart(2, '0')}`;
  };
  const change = async index => {
    const request = ++generation;
    cancelAnimations();
    selected = (index + reviews.length) % reviews.length;
    const out = animate([{ opacity: 1 }, { opacity: 0 }], { duration: 130, fill: 'forwards' });
    if (out) await out.finished.catch(() => {});
    out?.cancel();
    if (disposed || request !== generation) return;
    show();
    status.textContent = `Đánh giá ${selected + 1} trên ${reviews.length}: ${reviews[selected].name}`;
    animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 230, easing: 'ease-out' });
  };
  reviews.forEach((item, index) => {
    const button = node('button', 'tp-person-choice');
    button.type = 'button';
    button.append(person(item));
    button.onclick = () => { if (selected !== index) change(index); };
    people.push(button);
    list.append(button);
  });
  previous.onclick = () => change(selected - 1);
  next.onclick = () => change(selected + 1);
  let touch;
  display.addEventListener('touchstart', event => { touch = event.touches.length === 1 ? event.touches[0] : null; }, { passive: true });
  display.addEventListener('touchcancel', () => { touch = null; }, { passive: true });
  display.addEventListener('touchend', event => {
    if (!touch || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touch.clientX;
    const dy = event.changedTouches[0].clientY - touch.clientY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) change(selected + (dx < 0 ? 1 : -1));
    touch = null;
  }, { passive: true });
  const reduce = () => { if (motion.matches) cancelAnimations(); };
  motion.addEventListener('change', reduce);
  section.dispose = () => {
    disposed = true;
    generation++;
    cancelAnimations();
    motion.removeEventListener('change', reduce);
  };
  controls.append(previous, counter, next);
  spotlight.append(display, controls);
  body.append(spotlight, list);
  inner.append(heading, body, status);
  section.append(inner);
  show();
  return section;
}

import { node } from '../utils/dom.js';
import { imageUrl } from '../utils/image-url.js';
import { createSectionLayout } from './section-layout.js';

export function renderRecognitions(content, openViewer) {
  const items = (content?.items || []).filter(item => item.show !== false && imageUrl(item.image));
  if (!content || !items.length) return null;
  const { section, inner } = createSectionLayout('recognitions', content);
  const layout = node('div', 'recognition-layout');
  const stage = node('button', 'recognition-stage');
  stage.type = 'button';
  const photo = node('img');
  photo.decoding = 'async';
  const hint = node('span', 'recognition-expand', 'Xem bản lớn ↗');
  stage.append(photo, hint);
  const copy = node('div', 'recognition-copy');
  const category = node('p', 'eyebrow');
  const title = node('h3');
  const description = node('p', 'recognition-description');
  const facts = node('dl', 'recognition-facts');
  const counter = node('p', 'recognition-counter');
  const status = node('p', 'recognition-status');
  status.setAttribute('role', 'status');
  copy.append(category, title, description, facts, counter);
  layout.append(stage, copy);
  const thumbs = node('div', 'recognition-thumbs');
  thumbs.setAttribute('role', 'group');
  thumbs.setAttribute('aria-label', 'Chọn ghi nhận để xem');
  const error = node('p', 'recognition-error');
  error.setAttribute('role', 'status');
  const gallery = items.map(item => ({ src: imageUrl(item.image), alt: item.title, caption: [item.title, item.recipient, item.issuer, item.year].filter(Boolean).join(' · ') }));
  let selected = 0;
  let request = 0;
  let disposed = false;
  let pending;
  let animation;
  let available = true;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const buttons = items.map((item, index) => {
    const button = node('button', 'recognition-thumb');
    button.type = 'button';
    button.title = item.title;
    button.setAttribute('aria-label', `${item.title} — ${item.year || ''}`);
    button.setAttribute('aria-pressed', String(index === 0));
    const img = node('img');
    img.src = imageUrl(item.image);
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    button.append(img, node('span', '', item.year || item.category || 'Ghi nhận'));
    button.onclick = () => select(index);
    button.onkeydown = event => {
      const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!delta && !['Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + delta + items.length) % items.length;
      buttons[next].focus({ preventScroll: true });
      select(next);
    };
    return button;
  });
  function updateCopy(index) {
    const item = items[index];
    category.textContent = item.category || 'Ghi nhận';
    title.textContent = item.title;
    description.textContent = item.description || '';
    description.hidden = !item.description;
    facts.replaceChildren();
    for (const [label, value] of [['Trao cho', item.recipient], ['Đơn vị / Sự kiện', item.issuer], ['Năm', item.year]]) {
      if (value) facts.append(node('dt', '', label), node('dd', '', String(value)));
    }
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    stage.setAttribute('aria-label', `Mở bản lớn: ${item.title}`);
  }
  function select(index, initial = false) {
    if (disposed || (!initial && index === selected && available)) return;
    selected = index;
    const token = ++request;
    if (pending) pending.onload = pending.onerror = null;
    animation?.cancel();
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    if (!initial) {
      const viewport = thumbs.getBoundingClientRect();
      const bounds = buttons[index].getBoundingClientRect();
      if (bounds.left < viewport.left) thumbs.scrollLeft -= viewport.left - bounds.left + 4;
      else if (bounds.right > viewport.right) thumbs.scrollLeft += bounds.right - viewport.right + 4;
    }
    stage.setAttribute('aria-busy', 'true');
    stage.disabled = true;
    available = false;
    photo.style.opacity = '0';
    error.textContent = '';
    updateCopy(index);
    const loader = new Image();
    pending = loader;
    const fail = () => {
      if (disposed || token !== request) return;
      stage.setAttribute('aria-busy', 'false');
      error.textContent = 'Chưa tải được ảnh. Vui lòng chọn lại hoặc xem ghi nhận khác.';
    };
    loader.onerror = fail;
    loader.onload = async () => {
      try { await loader.decode(); } catch { fail(); return; }
      if (disposed || token !== request) return;
      photo.src = loader.src;
      photo.alt = items[index].title;
      photo.style.opacity = '1';
      available = true;
      stage.disabled = false;
      stage.setAttribute('aria-busy', 'false');
      if (!initial) {
        status.textContent = `Đang xem ${index + 1} trên ${items.length}: ${items[index].title}`;
        if (!motion.matches) animation = photo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: 'ease-out' });
      }
    };
    loader.src = gallery[index].src;
  }
  stage.onclick = () => {
    if (!available) return;
    gallery[selected].thumbnail = stage;
    openViewer(gallery, selected);
  };
  thumbs.append(...buttons);
  inner.append(layout, error, thumbs, status);
  section.append(inner);
  select(0, true);
  section.dispose = () => {
    disposed = true;
    request++;
    if (pending) pending.onload = pending.onerror = null;
    animation?.cancel();
  };
  return section;
}

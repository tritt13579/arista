import { node } from './dom.js';

function icon(pathData, className) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', className);
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(svg.namespaceURI, 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.7');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.append(path);
  return svg;
}

// Native select remains the source of truth for FormData/reset/preselection.
// The visible select-only combobox owns keyboard and pointer presentation.
export function enhanceRegistrationSelect(select, label) {
  const controller = new AbortController();
  const signal = controller.signal;
  const form = select.form;
  const wrapper = node('div', 'registration-select');
  const trigger = node('button', 'registration-select-trigger');
  const value = node('span', 'registration-select-value');
  const list = node('div', 'registration-select-list');
  trigger.type = 'button';
  trigger.id = `${select.id}-trigger`;
  value.id = `${select.id}-value`;
  list.id = `${select.id}-list`;
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-labelledby', label.id);
  list.hidden = true;
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-controls', list.id);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-labelledby', `${label.id} ${value.id}`);
  trigger.append(value, icon('M6 9l6 6 6-6', 'registration-select-chevron'));
  const options = [...select.options].map((option, index) => {
    const item = node('div', 'registration-select-option');
    item.id = `${select.id}-option-${index}`;
    item.setAttribute('role', 'option');
    item.dataset.empty = String(!option.value);
    item.append(node('span', '', option.text), icon('M5 12l4 4L19 6', 'registration-select-check'));
    list.append(item);
    return item;
  });
  select.before(wrapper);
  wrapper.append(select, trigger, list);
  select.hidden = true;
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');
  let active = 0;
  let prefix = '';
  let typedAt = 0;
  let disposed = false;
  const sync = () => {
    if (disposed) return;
    value.textContent = select.selectedOptions[0]?.text || 'Chọn…';
    trigger.dataset.empty = String(!select.value);
    options.forEach((item, index) => item.setAttribute('aria-selected', String(index === select.selectedIndex)));
  };
  const highlight = index => {
    active = Math.max(0, Math.min(options.length - 1, index));
    options.forEach((item, i) => item.classList.toggle('is-active', active === i));
    const item = options[active];
    if (!item) return;
    trigger.setAttribute('aria-activedescendant', item.id);
    // Scroll just the popup, never the surrounding Wix page.
    if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop;
    else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
  };
  const close = () => {
    list.hidden = true;
    wrapper.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
    prefix = '';
  };
  const open = (index = select.selectedIndex) => {
    if (trigger.matches(':disabled') || disposed) return;
    const rect = trigger.getBoundingClientRect();
    const needed = Math.min(260, options.length * 46 + 12);
    wrapper.dataset.side = window.innerHeight - rect.bottom < needed + 12 && rect.top > window.innerHeight - rect.bottom ? 'top' : 'bottom';
    list.hidden = false;
    wrapper.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    highlight(index < 0 ? 0 : index);
  };
  const choose = (index, focus = true) => {
    if (trigger.matches(':disabled') || !select.options[index]) return;
    select.selectedIndex = index;
    sync();
    close();
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
    if (focus) trigger.focus({ preventScroll: true });
  };
  trigger.addEventListener('click', () => list.hidden ? open() : close(), { signal });
  trigger.addEventListener('keydown', event => {
    const opened = !list.hidden;
    if (event.key === 'Tab') { if (opened) choose(active, false); return; }
    if (event.key === 'Escape') { if (opened) { event.preventDefault(); close(); } return; }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      if (event.key === 'Enter' || event.key === ' ') { opened ? choose(active) : open(); return; }
      if (!opened) open();
      if (event.key === 'Home') highlight(0);
      else if (event.key === 'End') highlight(options.length - 1);
      else if (opened) highlight(active + ({ ArrowDown: 1, ArrowUp: -1, PageDown: 10, PageUp: -10 }[event.key] || 0));
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = performance.now();
      prefix = now - typedAt > 700 ? event.key : prefix + event.key;
      typedAt = now;
      if (!opened) open();
      const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('vi').replaceAll('đ', 'd');
      const search = [...prefix].every(char => char === prefix[0]) ? prefix[0] : prefix;
      for (let step = 1; step <= options.length; step++) {
        const index = (active + step) % options.length;
        if (normalize(select.options[index].text).startsWith(normalize(search))) { highlight(index); break; }
      }
    }
  }, { signal });
  options.forEach((item, index) => {
    item.addEventListener('pointermove', event => { if (event.pointerType !== 'touch') highlight(index); }, { signal });
    item.addEventListener('pointerdown', event => event.preventDefault(), { signal });
    item.addEventListener('click', () => choose(index), { signal });
  });
  window.addEventListener('pointerdown', event => {
    if (!list.hidden && !event.composedPath().includes(wrapper)) close();
  }, { capture: true, signal });
  trigger.addEventListener('blur', close, { signal });
  window.addEventListener('resize', close, { signal });
  select.addEventListener('change', sync, { signal });
  form.addEventListener('reset', () => { close(); queueMicrotask(sync); }, { signal });
  sync();
  return { sync, close, dispose() { disposed = true; close(); controller.abort(); } };
}

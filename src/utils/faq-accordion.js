import { gsap } from 'gsap';
import { createScrollRefresh } from './scroll-refresh.js';

export function bindFaqAccordion(section) {
  const controller = new AbortController();
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const states = [];
  let disposed = false;
  const refreshQueue = createScrollRefresh();
  const refresh = () => {
    if (!disposed) refreshQueue.request();
  };
  const setIntent = state => {
    state.detail.dataset.expanded = String(state.expanded);
    state.summary.setAttribute('aria-expanded', String(state.expanded));
    state.panel.inert = !state.expanded;
    state.panel.setAttribute('aria-hidden', String(!state.expanded));
  };
  const settle = state => {
    state.tween?.kill();
    state.tween = null;
    state.detail.open = state.expanded;
    state.panel.style.removeProperty('height');
    state.panel.style.removeProperty('clip-path');
    setIntent(state);
  };
  const transition = (state, expanded) => {
    // Read the current visual pose before interrupting an in-flight transition.
    const wasOpen = state.detail.open;
    const height = wasOpen ? state.panel.getBoundingClientRect().height : 0;
    const clip = wasOpen ? getComputedStyle(state.panel).clipPath : 'inset(0% 0% 100% 0%)';
    state.tween?.kill();
    state.expanded = expanded;
    setIntent(state);
    if (motion.matches) { settle(state); refresh(); return; }
    // Native details must stay open through the closing motion; remove `open`
    // only after the panel has collapsed so the browser cannot hide it early.
    state.detail.open = true;
    state.panel.style.height = 'auto';
    const naturalHeight = state.panel.getBoundingClientRect().height;
    gsap.set(state.panel, {
      height, clipPath: clip === 'none' ? 'inset(0% 0% 0% 0%)' : clip,
    });
    state.tween = gsap.to(state.panel, {
      height: expanded ? naturalHeight : 0,
      clipPath: expanded ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
      duration: expanded ? 0.36 : 0.3,
      ease: 'power2.inOut',
      onComplete: () => { settle(state); refresh(); },
    });
  };
  section.querySelectorAll('.faq-item').forEach(detail => {
    const summary = detail.querySelector('summary');
    const panel = detail.querySelector('.faq-answer-panel');
    const state = { detail, summary, panel, expanded: detail.open, tween: null };
    states.push(state);
    setIntent(state);
    summary.addEventListener('click', event => {
      event.preventDefault();
      transition(state, !state.expanded);
    }, { signal: controller.signal });
    detail.addEventListener('toggle', () => {
      // Preserve native behavior if another browser feature changes `open`.
      if (!state.tween && state.expanded !== detail.open) {
        state.expanded = detail.open;
        setIntent(state);
        refresh();
      }
    }, { signal: controller.signal });
  });
  const finishActive = () => {
    states.forEach(state => { if (state.tween) settle(state); });
    refresh();
  };
  window.addEventListener('resize', finishActive, { signal: controller.signal });
  motion.addEventListener('change', () => { if (motion.matches) finishActive(); }, { signal: controller.signal });
  return () => {
    disposed = true;
    controller.abort();
    refreshQueue.dispose();
    states.forEach(settle);
  };
}

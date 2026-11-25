// Content stays visible by default, including the SEO markup and browsers without
// animation support. Only animate a section when it actually enters the viewport.
export function createBlogMotion(root, { article = false } = {}) {
  const view = root.ownerDocument.defaultView;
  if (!view?.IntersectionObserver || !view.Element.prototype.animate || !view.matchMedia) {
    return { refreshCards() {}, dispose() {} };
  }
  const preference = view.matchMedia('(prefers-reduced-motion: reduce)');
  const played = new WeakSet();
  const pending = new Set();
  const active = new Map();
  let observer;
  let disposed = false;

  const stop = () => {
    observer?.disconnect();
    observer = undefined;
    pending.clear();
    for (const animation of active.values()) animation.cancel();
    active.clear();
  };
  const observe = (element, delay = 0) => {
    if (!element || played.has(element) || !observer) return;
    pending.add(element);
    observer.observe(element);
    delays.set(element, delay);
  };
  const delays = new WeakMap();
  const refreshCards = () => {
    if (article || disposed || !observer) return;
    // Filters and pagination replace cards without replacing the page header.
    for (const element of pending) {
      if (!element.matches('.post-card')) continue;
      observer.unobserve(element);
      pending.delete(element);
    }
    for (const [element, animation] of active) {
      if (!element.matches('.post-card')) continue;
      animation.cancel();
      active.delete(element);
    }
    root.querySelectorAll('#post-results .post-card').forEach((card, index) => {
      observe(card, (index % 3) * 55);
    });
  };
  const start = () => {
    stop();
    if (disposed || preference.matches) return;
    observer = new view.IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        observer.unobserve(target);
        pending.delete(target);
        played.add(target);
        const distance = target.matches('.post-card') ? 18 : 12;
        try {
          const animation = target.animate([
            { opacity: 0, transform: `translateY(${distance}px)` },
            { opacity: 1, transform: 'translateY(0)' },
          ], { duration: 560, delay: delays.get(target) || 0, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' });
          active.set(target, animation);
          const release = () => {
            if (active.get(target) === animation) active.delete(target);
          };
          animation.addEventListener('finish', release, { once: true });
          animation.addEventListener('cancel', release, { once: true });
        } catch { /* Unsupported animations leave normal visible content. */ }
      }
    }, { threshold: 0, rootMargin: '0px 0px -16px 0px' });
    const heading = article
      ? '.article-heading, .article-cover'
      : '.journal-hero .hero-grid > div, .hero-description, .filter-bar';
    root.querySelectorAll(heading).forEach((element, index) => observe(element, index * 45));
    refreshCards();
  };
  const revealFocused = event => {
    for (const [element, animation] of active) {
      if (element.contains(event.target)) animation.finish();
    }
  };
  preference.addEventListener('change', start);
  root.addEventListener('focusin', revealFocused);
  start();
  return {
    refreshCards,
    dispose() {
      disposed = true;
      stop();
      preference.removeEventListener('change', start);
      root.removeEventListener('focusin', revealFocused);
    },
  };
}

import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

export function animateHero(host) {
  host.heroEffects?.revert();
  const media = gsap.matchMedia(); host.heroEffects = media;
  media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 769px)' }, context => {
    const shell = host.shadowRoot.querySelector('.shell');
    const canvas = shell.querySelector('.hero-collage');
    const cards = [...shell.querySelectorAll('.hero-card-entry')];
    const desktop = context.conditions.desktop;
    let split, raf = 0, disposed = false;
    if (!context.conditions.motion) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const rise = (selector, at) => {
      const elements = [...shell.querySelectorAll(selector)].filter(el => !el.hidden);
      if (elements.length) tl.fromTo(elements, { opacity: 0, y: desktop ? 16 : 10 }, {
        opacity: 1, y: 0, duration: 0.65, clearProps: 'opacity,transform',
      }, at);
    };
    rise('.copy > .eyebrow', 0.03);
    const title = shell.querySelector('h1');
    if (!title.hidden && title.textContent.trim()) split = SplitText.create(title, {
      type: 'lines', mask: 'lines', linesClass: 'hero-title-line', autoSplit: true, aria: 'auto',
      onSplit(self) {
        return gsap.fromTo(self.lines, { yPercent: 105, opacity: 0 }, {
          yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.12,
          ease: 'power3.out', clearProps: 'opacity,transform',
        });
      },
    });
    rise('.slogan', 0.36); rise('.description', 0.48); rise('.actions', 0.6);
    if (cards.length) tl.fromTo(cards, { opacity: 0, x: desktop ? 12 : 8, y: 12 }, {
      opacity: 1, x: 0, y: 0, duration: 0.8, stagger: Math.min(0.055, 0.5 / Math.max(1, cards.length - 1)), clearProps: 'opacity,transform',
    }, 0.32);
    const smoothProgress = cards.map(card => gsap.quickTo(card, '--hero-progress', { duration: 0.3, ease: 'power2.out' }));
    // Live geometry: no global refresh, cached anchors or scroll resets.
    const update = () => {
      raf = 0;
      if (disposed || !canvas) return;
      const box = canvas.getBoundingClientRect();
      // Desktop starts at zero on page entry, independently of viewport height.
      // Mobile starts when the lower image block reaches the visible area.
      const traveled = desktop ? -shell.getBoundingClientRect().top : innerHeight * 0.65 - box.top;
      const distance = Math.max(220, Math.min(shell.clientHeight * 0.65, innerHeight * 0.6));
      cards.forEach((card, index) => {
        const delay = index / Math.max(1, cards.length - 1) * 90;
        const progress = Math.max(0, Math.min(1, (traveled - delay) / distance));
        smoothProgress[index](progress);
      });
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    const finishEntrance = () => {
      tl.progress(1);
      if (split) gsap.getTweensOf(split.lines).forEach(tween => tween.progress(1));
    };
    shell.addEventListener('focusin', finishEntrance);
    shell.addEventListener('pointerdown', finishEntrance, true);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.fonts?.ready.then(() => { if (!disposed) schedule(); });
    update();
    return () => {
      disposed = true; cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
      shell.removeEventListener('focusin', finishEntrance); shell.removeEventListener('pointerdown', finishEntrance, true);
      cards.forEach(card => card.style.removeProperty('--hero-progress'));
      split?.revert();
    };
  });
}

import { gsap } from 'gsap';

export function animateProgramHero(root) {
  const media = gsap.matchMedia();
  media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 769px)' }, context => {
    if (!context.conditions.motion) return;
    const hero = root.querySelector('.pd-hero');
    if (!hero) return;
    const desktop = context.conditions.desktop;
    const frame = hero.querySelector('.pd-hero-frame');
    const photo = frame.querySelector('img');
    const photoWindow = frame.querySelector('.pd-hero-photo-window');
    const title = hero.querySelector('h1');
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.6 } });
    timeline.fromTo(hero.querySelector('.pd-eyebrow'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, clearProps: 'transform,opacity' }, 0.04);
    // Keep real line wrapping intact: the name opens horizontally, without
    // changing letter spacing, font metrics or the height of the hero.
    timeline.fromTo(title, { opacity: 0, scaleX: 0.97, clipPath: 'inset(0% 100% 0% 0%)', transformOrigin: 'left center' }, {
      opacity: 1, scaleX: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85,
      clearProps: 'transform,transformOrigin,opacity,clipPath',
    }, 0.12);
    [...hero.querySelectorAll('.pd-slogan > *')].forEach((line, index) => {
      timeline.fromTo(line, { opacity: 0, x: (index ? 1 : -1) * (desktop ? 16 : 8) }, {
        opacity: 1, x: 0, clearProps: 'transform,opacity',
      }, 0.3 + index * 0.12);
    });
    timeline.fromTo([...hero.querySelectorAll('.pd-intro,.pd-hero-actions')], { opacity: 0, y: desktop ? 12 : 8 }, {
      opacity: 1, y: 0, stagger: 0.09, clearProps: 'transform,opacity',
    }, 0.48);
    const tags = [...hero.querySelectorAll('.pd-tags li')];
    if (tags.length) timeline.fromTo(tags, { opacity: 0, y: 6 }, {
      opacity: 1, y: 0, stagger: 0.06, duration: 0.4, clearProps: 'transform,opacity',
    }, 0.69);

    // Own paused image tweens synchronously, so breakpoint/dispose cleanup also
    // works if decode completes after the CMS has rendered another program.
    const photoTimeline = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
    photoTimeline.fromTo(photoWindow, { opacity: 0, clipPath: 'inset(38% 44% 38% 44% round 40px)' }, {
      opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: desktop ? 1.05 : 0.8,
      clearProps: 'opacity,clipPath',
    }, 0);
    photoTimeline.fromTo(photo, { scale: desktop ? 1.04 : 1.02 }, { scale: desktop ? 1.05 : 1, duration: 1.05 }, 0);
    photoTimeline.fromTo(frame, { '--pd-hero-rule-opacity': 0 }, { '--pd-hero-rule-opacity': 1, duration: 0.65 }, 0.18);
    photoTimeline.fromTo([...hero.querySelectorAll('figcaption,.pd-hero-label')], { opacity: 0 }, { opacity: 1, duration: 0.5, clearProps: 'opacity' }, 0.4);
    let disposed = false;
    let requested = false;
    const reveal = async () => {
      if (requested) return;
      requested = true;
      try { if (photo.naturalWidth && photo.decode) await photo.decode(); } catch { /* Display the available image/fallback. */ }
      if (!disposed) photoTimeline.play();
    };
    photo.addEventListener('load', reveal, { once: true });
    photo.addEventListener('error', reveal, { once: true });
    if (!photo.getAttribute('src') || photo.complete) reveal();

    let raf = 0;
    const movePhoto = desktop ? gsap.quickTo(photo, 'y', { duration: 0.4, ease: 'power2.out' }) : null;
    const update = () => {
      raf = 0;
      const bounds = hero.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > innerHeight) return;
      const progress = gsap.utils.clamp(0, 1, -bounds.top / Math.max(1, bounds.height));
      // Stay inside the image's overscan, including shorter desktop heroes.
      movePhoto?.((progress - 0.5) * Math.min(20, photoWindow.clientHeight * 0.035));
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    if (desktop) {
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      schedule();
    }
    const finishForFocus = event => {
      if (!event.target.closest('a,button,input,select,textarea')) return;
      timeline.progress(1);
    };
    hero.addEventListener('focusin', finishForFocus);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      photo.removeEventListener('load', reveal);
      photo.removeEventListener('error', reveal);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      hero.removeEventListener('focusin', finishForFocus);
    };
  });
  return () => media.revert();
}

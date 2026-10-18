import { gsap } from 'gsap';
import { animateRegistrationFooter } from './registration-footer-animation.js';

export function animateProgramScroll(root) {
  const media = gsap.matchMedia();
  media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 769px)' }, context => {
    if (!context.conditions.motion || !globalThis.IntersectionObserver) return;
    const desktop = context.conditions.desktop;
    const entries = new Map();
    const heading = element => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 0.7 } });
      const label = element.querySelector('.pd-eyebrow,.eyebrow');
      const title = element.querySelector('h2');
      const description = element.querySelector('.pd-description,.section-description');
      if (label) tl.fromTo(label, { opacity: 0, x: desktop ? -10 : 0 }, { opacity: 1, x: 0, clearProps: 'transform,opacity' }, 0);
      if (title) tl.fromTo(title, { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' }, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', clearProps: 'opacity,clipPath' }, 0.08);
      if (description) tl.fromTo(description, { opacity: 0, y: 10 }, { opacity: 1, y: 0, clearProps: 'transform,opacity' }, 0.18);
      return tl;
    };
    const watch = (element, animation) => {
      if (element && !element.closest('[hidden]')) entries.set(element, animation);
    };
    root.querySelectorAll('.pd-heading').forEach(el => watch(el, heading(el)));

    const steps = [...root.querySelectorAll('.pd-step')];
    const progressTweens = [];
    steps.forEach(step => {
      step.classList.add('pd-journey-animated');
      const number = step.querySelector('.pd-step-index');
      const progress = gsap.timeline({ paused: true }).fromTo(step, { '--pd-step-progress': 0 }, { '--pd-step-progress': 1, duration: 1, ease: 'none' }, 0)
        .fromTo(number, { opacity: 0.55 }, { opacity: 1, duration: 1, ease: 'none' }, 0);
      progressTweens.push([step, progress]);
      const tl = gsap.timeline({ paused: true, defaults: { duration: 0.7, ease: 'power3.out' } });
      tl.fromTo([...step.querySelectorAll('h3,p')], { opacity: 0, clipPath: 'inset(0% 0% 100% 0%)', y: 8 }, {
        opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', y: 0, stagger: 0.1, clearProps: 'transform,opacity,clipPath',
      });
      watch(step, tl);
    });

    root.querySelectorAll('.pd-teacher').forEach((card, index) => {
      const tl = gsap.timeline({ paused: true, delay: desktop ? (index % 3) * 0.1 : 0, defaults: { duration: 0.8, ease: 'power2.out' } });
      const photo = card.querySelector('.pd-portrait-image');
      if (photo) tl.fromTo(photo, { filter: 'brightness(0.65)', scale: 1.03, clipPath: 'inset(0% 0% 100% 0%)' }, {
        filter: 'brightness(1)', scale: 1, clipPath: 'inset(0% 0% 0% 0%)', clearProps: 'transform,filter,clipPath',
      }, 0);
      tl.fromTo(card, { borderColor: 'rgba(221,212,195,0)' }, { borderColor: '#ddd4c3', clearProps: 'borderColor' }, 0.05);
      const name = card.querySelector('h3');
      if (name) tl.fromTo(name, { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' }, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', clearProps: 'opacity,clipPath' }, 0.15);
      tl.fromTo([...card.querySelectorAll('.pd-teacher-copy > :not(h3)')], { opacity: 0, y: 8 }, {
        opacity: 1, y: 0, stagger: 0.08, clearProps: 'transform,opacity',
      }, 0.25);
      watch(card, tl);
    });

    root.querySelectorAll('.pm-cluster').forEach(cluster => {
      [...cluster.children].forEach((button, index) => {
        const img = button.querySelector('img');
        if (!img) return;
        const masks = ['inset(0% 0% 100% 0%)', 'inset(0% 100% 0% 0%)', 'inset(0% 45% 0% 45%)'];
        const tl = gsap.timeline({ paused: true, delay: index * 0.07 });
        tl.fromTo(img, { opacity: 0, clipPath: masks[index % masks.length], x: desktop ? (index % 2 ? 8 : -8) : 0, scale: 1.035 }, {
          opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', x: 0, scale: 1, duration: 0.85, ease: 'power3.out',
          clearProps: 'transform,opacity,clipPath',
        });
        watch(button, tl);
      });
    });
    root.querySelectorAll('.pm-video').forEach(card => {
      const tl = gsap.timeline({ paused: true });
      const img = card.querySelector('.pm-video-launch > img:not([hidden])');
      const play = card.querySelector('.pm-play-icon');
      if (img) tl.fromTo(img, { filter: 'brightness(0.65)', clipPath: 'inset(0% 100% 0% 0%)' }, {
        filter: 'brightness(1)', clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.out', clearProps: 'filter,clipPath',
      }, 0);
      if (play) {
        tl.fromTo(play, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, clearProps: 'opacity,transform' }, 0.3);
        tl.fromTo(play, { '--pd-play-sweep': -120 }, { '--pd-play-sweep': 120, duration: 0.7, ease: 'power2.inOut' }, 0.5);
      }
      const copy = card.querySelector('.pm-video-copy');
      if (copy) tl.fromTo(copy, { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' }, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.65, clearProps: 'opacity,clipPath' }, 0.2);
      watch(card, tl);
    });
    animateRegistrationFooter(root, desktop, watch);

    const observer = new IntersectionObserver(records => {
      records.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        const animation = entries.get(target);
        // Disable CSS hover interpolation during the GSAP entrance only.
        if (target.matches('.pm-photo')) {
          target.classList.add('pd-media-entering');
          animation.eventCallback('onComplete', () => target.classList.remove('pd-media-entering'));
        }
        animation.play();
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    entries.forEach((_, element) => observer.observe(element));
    const finishInteractive = event => {
      if (!event.target.closest('a,button,input,select,textarea')) return;
      entries.forEach((animation, element) => {
        if (element.contains(event.target)) { observer.unobserve(element); animation.progress(1); }
      });
    };
    root.addEventListener('focusin', finishInteractive);
    root.addEventListener('pointerdown', finishInteractive, true);
    // Read current geometry instead of caching offsets. No global
    // ScrollTrigger.refresh(), scroll resets, pinning or layout mutations.
    let raf = 0;
    const update = () => {
      raf = 0;
      progressTweens.forEach(([element, animation]) => {
        const top = element.getBoundingClientRect().top;
        const progress = gsap.utils.clamp(0, 1, (innerHeight * 0.88 - top) / Math.max(120, innerHeight * 0.38));
        animation.progress(progress);
      });
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      observer.disconnect(); cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      root.removeEventListener('focusin', finishInteractive);
      root.removeEventListener('pointerdown', finishInteractive, true);
      steps.forEach(step => step.classList.remove('pd-journey-animated'));
      root.querySelectorAll('.pd-media-entering').forEach(el => el.classList.remove('pd-media-entering'));
    };
  });
  return () => media.revert();
}

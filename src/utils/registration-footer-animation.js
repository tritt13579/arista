import { gsap } from 'gsap';

// Both pages share the choreography; each page supplies its scroll observer.
export function animateRegistrationFooter(root, desktop, watch) {
  const heading = root.querySelector('.registration .section-heading');
  if (heading) {
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 0.7 } });
    const label = heading.querySelector('.eyebrow');
    const title = heading.querySelector('h2');
    const description = heading.querySelector('.section-description');
    if (label) tl.fromTo(label, { opacity: 0, x: desktop ? -10 : 0 }, { opacity: 1, x: 0, clearProps: 'transform,opacity' }, 0);
    if (title) tl.fromTo(title, { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' }, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', clearProps: 'opacity,clipPath' }, 0.08);
    if (description) tl.fromTo(description, { opacity: 0, y: 10 }, { opacity: 1, y: 0, clearProps: 'transform,opacity' }, 0.18);
    watch(heading, tl);
  }
  const card = root.querySelector('.registration-card');
  if (card) watch(card, gsap.timeline({ paused: true }).fromTo(card, {
    opacity: 0, y: desktop ? 16 : 8, rotation: desktop ? 0.5 : 0, '--pd-invitation-outline': 0,
  }, {
    opacity: 1, y: 0, rotation: 0, '--pd-invitation-outline': 0.35, duration: 0.85, ease: 'power3.out',
    clearProps: 'transform,opacity,--pd-invitation-outline',
  }));
  const details = root.querySelector('.registration-details');
  if (details) watch(details, gsap.timeline({ paused: true }).fromTo(details, {
    opacity: 0, x: desktop ? -14 : 0, y: desktop ? 0 : 8,
  }, { opacity: 1, x: 0, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity' }));
  root.querySelectorAll('.footer-inner > *').forEach(el => watch(el, gsap.timeline({ paused: true }).fromTo(el, {
    opacity: 0, clipPath: 'inset(0% 48% 0% 48%)',
  }, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.65, ease: 'power2.out', clearProps: 'opacity,clipPath' })));
}

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Called inside the component's motion matchMedia context so every tween,
// trigger and responsive text split is reverted together on rerender/disconnect.
export function animateTestimonials(section, desktop) {
  if (!section) return () => {};
  const title = section.querySelector('h2');
  const heading = section.querySelector('.tp-heading');
  const layout = section.querySelector('.tp-layout');
  const split = SplitText.create(title, {
    type: 'lines', mask: 'lines', linesClass: 'tp-title-line', autoSplit: true,
    onSplit(self) {
      return gsap.fromTo(self.lines, { yPercent: 105, opacity: 0 }, {
        yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.11,
        ease: 'power3.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: title, start: 'top 86%', once: true },
      });
    },
  });
  const intro = gsap.fromTo(heading.querySelectorAll('.eyebrow, .tp-description'),
    { opacity: 0, y: 12 }, {
      opacity: 1, y: 0, duration: 0.65, stagger: 0.12,
      ease: 'power3.out', clearProps: 'transform,opacity',
      scrollTrigger: { trigger: heading, start: 'top 86%', once: true },
    });
  const entrance = gsap.timeline({
    defaults: { ease: 'power3.out', clearProps: 'transform,opacity,clipPath' },
    scrollTrigger: { trigger: layout, start: 'top 86%', once: true },
  });
  // A quiet curtain reveal for the card, followed by its quote and signature.
  // Set waiting styles outside the timeline so refreshes cannot restore a
  // fromTo startAt before the user has actually reached the section.
  const card = section.querySelector('.tp-spotlight');
  const quote = section.querySelector('.tp-spotlight-content');
  const mark = section.querySelector('.tp-quote-mark');
  const choices = section.querySelectorAll('.tp-person-choice');
  const controls = section.querySelector('.tp-controls');
  gsap.set(card, { clipPath: desktop ? 'inset(0% 100% 0% 0% round 22px)' : 'inset(0% 0% 100% 0% round 22px)' });
  gsap.set(quote, { opacity: 0, y: 16 });
  gsap.set(mark, { opacity: 0, scale: 0.85, rotation: -8 });
  gsap.set(controls, { opacity: 0, y: 8 });
  entrance.to(card, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 0.85 }, 0);
  entrance.to(quote, { opacity: 1, y: 0, duration: 0.65 }, 0.18);
  entrance.to(mark, { opacity: 1, scale: 1, rotation: 0, duration: 0.6 }, 0.22);
  if (desktop) {
    gsap.set(choices, { opacity: 0, x: 18 });
    entrance.to(choices, { opacity: 1, x: 0, duration: 0.6, stagger: 0.065 }, 0.16);
  }
  entrance.to(controls, { opacity: 1, y: 0, duration: 0.4 }, 0.45);

  const finish = () => {
    intro.progress(1);
    entrance.progress(1);
    gsap.getTweensOf(split.lines).forEach(tween => tween.progress(1));
  };
  section.addEventListener('focusin', finish);
  // Reading full text or changing a longer review must refresh following sections.
  let refreshTimer;
  const resize = new ResizeObserver(() => {
    // Height expansion produces a resize each frame. Refresh only when settled,
    // avoiding a whole-page ScrollTrigger layout pass on every animation frame.
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
  });
  resize.observe(section);
  return () => {
    resize.disconnect();
    clearTimeout(refreshTimer);
    section.removeEventListener('focusin', finish);
    split.revert();
  };
}

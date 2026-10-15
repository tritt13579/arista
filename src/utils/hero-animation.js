import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export function animateHero(host) {
  host.heroEffects?.revert();
  const media = gsap.matchMedia();
  host.heroEffects = media;
  media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 769px)" }, context => {
    if (!context.conditions.motion) return;
    const shell = host.shadowRoot.querySelector(".shell");
    const desktop = context.conditions.desktop;
    const title = shell.querySelector("h1");
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    const rise = (selector, at, duration = 0.5, stagger = 0) => {
      const elements = [...shell.querySelectorAll(selector)].filter(el => !el.hidden);
      if (elements.length) timeline.fromTo(elements, { opacity: 0, y: desktop ? 14 : 8 }, {
        opacity: 1, y: 0, duration, stagger, clearProps: "transform,opacity",
      }, at);
    };
    const photo = shell.querySelector(".photo");
    // Keep text choreography independent from image loading. Create this tween
    // synchronously so matchMedia owns and reverts it even when decode is async.
    const background = gsap.fromTo(shell.querySelector(".hero-opening-shade"), { opacity: 1 }, {
      opacity: 0, duration: 1, ease: "power2.inOut", clearProps: "opacity",
      paused: true,
    });
    let disposed = false;
    let imageRequest = 0;
    const revealPhoto = async () => {
      const request = ++imageRequest;
      const source = photo.currentSrc || photo.src;
      try {
        await photo.decode();
      } catch (_) {
        // A loaded image can still be displayed if decode() is unsupported or
        // rejects. Image errors release the shade onto the static navy fallback.
      }
      if (!disposed && request === imageRequest && source === (photo.currentSrc || photo.src)) background.play();
    };
    const imageError = () => {
      imageRequest++;
      if (!disposed) background.play();
    };
    photo.addEventListener("load", revealPhoto);
    photo.addEventListener("error", imageError);
    if (photo.hidden) imageError();
    else if (photo.complete) {
      if (photo.naturalWidth) revealPhoto();
      else imageError();
    }
    rise(".eyebrow", 0.04, 0.45);

    // Re-split actual rendered lines after font loading and width changes.
    // Returning the tween lets SplitText preserve progress on re-splits.
    let split;
    if (!title.hidden && title.textContent.trim()) split = SplitText.create(title, {
      type: "lines", mask: "lines", linesClass: "hero-title-line",
      autoSplit: true, aria: "auto",
      onSplit(self) {
        return gsap.fromTo(self.lines, { yPercent: 105, opacity: 0 }, {
          yPercent: 0, opacity: 1, duration: desktop ? 0.7 : 0.6,
          stagger: 0.11, delay: 0.12, ease: "power3.out",
          clearProps: "transform,opacity",
        });
      },
    });
    rise(".slogan", 0.4, 0.5);
    rise(".description, .actions", 0.54, 0.5);
    rise(".stat", 0.67, 0.42, 0.07);

    if (desktop) gsap.fromTo(shell.querySelector(".photo"), { scale: 1.05, y: -10 }, {
      y: 10, ease: "none",
      scrollTrigger: { trigger: shell, start: "top top", end: "bottom top", scrub: 0.4 },
    });
    const focus = () => {
      timeline.progress(1);
      if (split) gsap.getTweensOf(split.lines).forEach(tween => tween.progress(1));
    };
    shell.addEventListener("focusin", focus);
    return () => {
      disposed = true;
      imageRequest++;
      photo.removeEventListener("load", revealPhoto);
      photo.removeEventListener("error", imageError);
      shell.removeEventListener("focusin", focus);
      split?.revert();
    };
  });
}

import { gsap } from "gsap";
import { animateRegistrationFooter } from "./registration-footer-animation.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animateTestimonials } from "./testimonial-animation.js";
import { createScrollRefresh } from "./scroll-refresh.js";
export { animateHero } from "./hero-animation.js";

gsap.registerPlugin(ScrollTrigger);

// Select actual nodes inside Shadow DOM. Revert restores styles and kills triggers.
export function observeReveals(host, root) {
  host.scrollEffects?.revert();
  const media = gsap.matchMedia();
  host.scrollEffects = media;
  media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 769px)" }, context => {
    if (!context.conditions.motion) return;
    const desktop = context.conditions.desktop;
    const all = selector => [...root.querySelectorAll(selector)];
    const restores = [];
    const entries = [];
    const enter = (element, from, delay = 0) => {
      if (!element) return;
      element.classList.add("scroll-enter-active");
      restores.push(() => element.classList.remove("scroll-enter-active"));
      const destination = Object.fromEntries(Object.keys(from).map(key => [key,
        key === "clipPath" ? "inset(0% 0% 0% 0%)" : key === "opacity" || key === "scale" ? 1 : 0,
      ]));
      const tween = gsap.fromTo(element, from, {
        duration: 0.8, ease: "power3.out", ...destination, delay,
        clearProps: "transform,opacity,clipPath",
        onComplete: () => element.classList.remove("scroll-enter-active"),
        scrollTrigger: { trigger: element, start: "top 92%", once: true },
      });
      entries.push([element, tween]);
      return tween;
    };
    const mask = (element, direction = "bottom", delay = 0) => {
      const edges = {
        bottom: "inset(0% 0% 100% 0%)",
        left: "inset(0% 100% 0% 0%)",
        right: "inset(0% 0% 0% 100%)",
        center: "inset(0% 50% 0% 50%)",
      };
      return enter(element, { clipPath: edges[direction] }, delay);
    };
    all(".section-heading").filter(heading => !heading.closest(".registration")).forEach(heading => {
      enter(heading.querySelector(".eyebrow"), { opacity: 0, x: -12 });
      mask(heading.querySelector("h2"));
      enter(heading.querySelector(".section-description"), { opacity: 0, y: 12 }, 0.1);
    });

    // Split text nodes only: preserve highlighted phrases and semantic blockquote.
    const quote = root.querySelector("blockquote");
    if (quote) {
      const walker = document.createTreeWalker(quote, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(text => {
        const wrapper = document.createElement("span");
        wrapper.className = "scroll-quote-run";
        text.textContent.split(/(\s+)/).forEach(word => {
          if (/^\s*$/.test(word)) wrapper.append(document.createTextNode(word));
          else {
            const span = document.createElement("span");
            span.className = "scroll-quote-word";
            span.textContent = word;
            wrapper.append(span);
          }
        });
        restores.push(() => wrapper.replaceWith(text));
        text.replaceWith(wrapper);
      });
      gsap.from(all(".scroll-quote-word"), {
        opacity: 0.4, stagger: 0.08, ease: "none",
        scrollTrigger: { trigger: quote, start: "top 88%", end: "bottom 55%", scrub: 0.35 },
      });
    }
    all(".pillar").forEach((card, index) => {
      enter(card, { opacity: 0, y: desktop ? 32 : 18 }, (index % 3) * 0.08);
      mask(card.querySelector("h3"), "left", 0.12);
    });
    all(".program").forEach((card, index) => {
      enter(card, { opacity: 0, y: 28, rotation: desktop ? (index % 2 ? 1.5 : -1.5) : 0 }, (index % 3) * 0.07);
    });
    all(".journey-step").forEach(step => {
      const line = document.createElement("span");
      line.className = "scroll-journey-line";
      line.setAttribute("aria-hidden", "true");
      step.prepend(line);
      gsap.fromTo(line, { scaleX: desktop ? 0 : 1, scaleY: desktop ? 1 : 0 }, {
        scaleX: 1, scaleY: 1, ease: "none",
        scrollTrigger: { trigger: step, start: "top 85%", end: "bottom 60%", scrub: 0.3 },
      });
      enter(step.querySelector(".journey-number"), { opacity: 0, scale: 0.8 }, 0.08);
      enter(step.querySelector("h3"), { opacity: 0, y: 14 }, 0.15);
      enter(step.querySelector("p"), { opacity: 0, y: 14 }, 0.22);
    });
    mask(root.querySelector(".featured-teacher-photo"));
    mask(root.querySelector(".featured-teacher-name"), "left");
    all(".featured-teacher-copy > :not(.featured-teacher-name), .teacher-highlight").forEach(item => enter(item, { opacity: 0, y: 14 }));
    all(".teacher-card").forEach((card, index) => {
      mask(card.querySelector(".teacher-photo"), index % 2 ? "right" : "left", (index % 4) * 0.06);
      enter(card.querySelector("figcaption"), { opacity: 0, y: 12 }, 0.12);
    });
    all(".achievement-total-value").forEach(element => {
      const text = element.textContent;
      const match = text.match(/^(\d+)(\+?)$/);
      if (!match) return mask(element);
      const counter = { value: 0 };
      gsap.to(counter, {
        value: Number(match[1]), duration: 1.2, ease: "power2.out",
        scrollTrigger: { trigger: element, start: "top 92%", once: true },
        onUpdate: () => { element.textContent = `${Math.round(counter.value)}${match[2]}`; },
        onComplete: () => { element.textContent = text; },
      });
      restores.push(() => { element.textContent = text; });
    });
    all(".award-count, .achievement-entry").forEach((item, index) => enter(item, { opacity: 0, x: desktop ? 20 : 0, y: desktop ? 0 : 14 }, (index % 4) * 0.06));
    all(".achievement-main-photo, .achievement-proof").forEach((item, index) => mask(item, index % 2 ? "left" : "bottom", (index % 3) * 0.05));
    all(".moment-card").forEach((item, index) => mask(item, index === 0 ? "center" : index % 2 ? "bottom" : "left", (index % 3) * 0.06));
    all(".faq-item").forEach((item, index) => {
      enter(item, { opacity: 0, y: 12 }, (index % 4) * 0.04);
      gsap.fromTo(item, { "--scroll-rule": 0 }, {
        "--scroll-rule": 1, duration: 0.9, ease: "power2.out",
        scrollTrigger: { trigger: item, start: "top 92%", once: true },
      });
    });
    animateRegistrationFooter(root, desktop, (element, animation) => {
      if (element.closest('[hidden]')) return;
      ScrollTrigger.create({ trigger: element, start: 'top 92%', once: true, animation });
      entries.push([element, animation]);
    });
    const disposeTestimonials = animateTestimonials(root.querySelector(".testimonials"), desktop);

    // Font/image loading can change section geometry after first render.
    let disposed = false;
    const refreshQueue = createScrollRefresh();
    const refresh = () => {
      if (disposed) return;
      refreshQueue.request();
    };
    const focus = event => {
      entries.forEach(([element, tween]) => {
        if (element.contains(event.target)) tween.progress(1);
      });
    };
    root.addEventListener("load", refresh, true);
    root.addEventListener("focusin", focus);
    root.addEventListener("pointerdown", focus, true);
    document.fonts?.ready.then(refresh);
    refresh();
    return () => {
      disposeTestimonials();
      disposed = true;
      refreshQueue.dispose();
      root.removeEventListener("load", refresh, true);
      root.removeEventListener("focusin", focus);
      root.removeEventListener("pointerdown", focus, true);
      restores.forEach(restore => restore());
      all(".scroll-journey-line").forEach(line => line.remove());
    };
  });
}

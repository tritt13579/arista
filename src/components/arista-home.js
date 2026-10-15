// Source entry point. Wix must load dist/arista-home.js, not this module.
import { styles } from "../styles/index.js";
import { observeReveals, animateHero } from "../utils/animations.js";
import { loadFonts } from "../utils/fonts.js";
import {
  headerTemplate,
  renderHeader,
  bindHeader,
  updateHeader,
  closeMenu,
} from "../sections/header.js";
import { heroTemplate, renderHero } from "../sections/hero.js";
import { renderQuote } from "../sections/quote.js";
import { renderPhilosophy } from "../sections/philosophy.js";
import { renderPrograms } from "../sections/programs.js";
import { renderLearningJourney } from "../sections/learning-journey.js";
import { renderTeachers } from "../sections/teachers.js";
import { renderAchievements } from "../sections/achievements.js";
import { renderStudentMoments } from "../sections/student-moments.js";
import { renderFaq } from "../sections/faq.js";
import { renderRegistration } from "../sections/registration.js";
import { renderFooter } from "../sections/footer.js";
import { renderFloatingContacts, updateFloatingContacts } from "../sections/floating-contacts.js";
import { openImageViewer } from "../utils/image-viewer.js";

class AristaHome extends HTMLElement {
  static get observedAttributes() {
    return ["content", "registration-result"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<style>${styles}</style>${headerTemplate}${heroTemplate}<div class="sections" lang="vi"></div>`;
    bindHeader(this);
  }
  connectedCallback() {
    loadFonts();
    this.lastSectionsKey = "";
    this.onViewportChange = () => {
      if (this.viewportFrame) return;
      this.viewportFrame = requestAnimationFrame(() => {
        this.viewportFrame = 0;
        this.updateHeader();
      });
    };
    window.addEventListener("scroll", this.onViewportChange, { passive: true });
    window.addEventListener("resize", this.onViewportChange);
    if ("ResizeObserver" in window) {
      this.headerObserver = new ResizeObserver(this.onViewportChange);
      this.headerObserver.observe(this);
      this.headerObserver.observe(
        this.shadowRoot.querySelector(".header-inner"),
      );
    }
    this.render();
    this.updateHeader();
    this.emit("arista-ready", {});
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.isConnected) return;
    if (name === "registration-result") {
      try {
        this.shadowRoot.getElementById("registration")?.receiveResult(JSON.parse(newValue));
      } catch (_) {
        console.warn("ARISTA: invalid registration response.");
      }
      return;
    }
    this.render();
  }
  emit(name, detail) {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }
  action(target, label, extra = {}) {
    if (this.shadowRoot.querySelector(".mobile-menu").open) {
      closeMenu(this, false, () => this.action(target, label, extra));
      return;
    }
    // Release the modal's scroll lock before navigating to a section.
    this.closeMenu();
    if (target === "top") {
      window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      this.shadowRoot.querySelector("h1")?.focus({ preventScroll: true });
      this.emit("arista-action", { target, label, ...extra });
      return;
    }
    const section = this.shadowRoot.getElementById(target);
    if (target === "registration" && extra.programName) section?.selectProgram(extra.programName);
    if (section && !section.hidden) {
      const inner = section.querySelector(".section-inner");
      const contentInset = inner ? parseFloat(getComputedStyle(inner).paddingTop) || 0 : 0;
      section.style.setProperty("--section-content-inset", `${contentInset}px`);
      section.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
      section.focus({ preventScroll: true });
    }
    this.emit("arista-action", { target, label, ...extra });
    this.closeMenu();
  }
  disconnectedCallback() {
    this.shadowRoot.getElementById("registration")?.dispose();
    this.shadowRoot.querySelector(".floating-contact-shell")?.dispose();
    this.imageViewer?.close();
    this.closeMenu();
    this.scrollEffects?.revert();
    this.heroEffects?.revert();
    cancelAnimationFrame(this.effectsFrame);
    this.headerObserver?.disconnect();
    window.removeEventListener("scroll", this.onViewportChange);
    window.removeEventListener("resize", this.onViewportChange);
    cancelAnimationFrame(this.viewportFrame);
    this.viewportFrame = 0;
  }
  updateHeader() {
    updateHeader(this);
    updateFloatingContacts(this);
  }
  renderSections(data) {
    const key = JSON.stringify([
      data.quote,
      data.philosophy,
      data.programs,
      data.programButtonText,
      data.learningJourney,
      data.teachers,
      data.achievements,
      data.moments,
      data.faq,
      data.registration,
      data.footer,
      data.contacts,
    ]);
    if (key === this.lastSectionsKey) return;
    this.lastSectionsKey = key;
    this.imageViewer?.close();
    const root = this.shadowRoot.querySelector(".sections");
    const blocks = [
      renderQuote(data.quote),
      renderPhilosophy(data.philosophy),
      renderPrograms(
        data.programs,
        data.programButtonText,
        this.action.bind(this),
      ),
      renderLearningJourney(data.learningJourney),
      renderTeachers(data.teachers, this.action.bind(this)),
      renderAchievements(data.achievements, (images, index) => openImageViewer(this, images, index)),
      renderStudentMoments(data.moments, (images, index) => openImageViewer(this, images, index)),
      renderFaq(data.faq),
      renderRegistration(data.registration, detail => this.emit("arista-registration-submit", detail)),
      renderFooter(data.footer, this.action.bind(this)),
    ].filter(Boolean);
    this.scrollEffects?.revert();
    this.shadowRoot.getElementById("registration")?.dispose();
    root.replaceChildren(...blocks);
    const previousContacts = this.shadowRoot.querySelector(".floating-contact-shell");
    previousContacts?.dispose();
    previousContacts?.remove();
    const contacts = renderFloatingContacts(data.contacts, this.action.bind(this));
    if (contacts) this.shadowRoot.append(contacts);
    updateFloatingContacts(this);
    // Hero is rendered later in the same render() call. Creating triggers here
    // synchronously measures sections while Hero is still hidden/has old content.
    // Wait for the final page layout so once-only entries cannot fire offscreen.
    cancelAnimationFrame(this.effectsFrame);
    this.effectsFrame = requestAnimationFrame(() => {
      this.effectsFrame = 0;
      if (this.isConnected) observeReveals(this, root);
    });
  }
  closeMenu() {
    closeMenu(this);
  }
  render() {
    const root = this.shadowRoot;
    let data;
    try {
      data = JSON.parse(this.getAttribute("content") || "null");
    } catch (_) {
      console.error("ARISTA: invalid content JSON.");
      return;
    }
    if (!data) return;
    if (data.state === "error")
      console.error("ARISTA CMS:", data.message || "Failed to load content.");
    if (data.state === "ready") this.renderSections(data);
    if (data.state === "ready" && !data.hero) {
      this.closeMenu();
      root.querySelector(".shell").hidden = true;
      root.querySelector("header").hidden = true;
      this.lastDisplayKey = "";
      return;
    }
    if (!data.hero) return; // A reload error keeps the last good content visible.
    const hero = data.hero;
    const menu = Array.isArray(data.menu) ? data.menu : [];
    const stats = Array.isArray(data.stats) ? data.stats : [];
    const displayKey = JSON.stringify({ hero, menu, stats });
    if (displayKey === this.lastDisplayKey) return;
    this.lastDisplayKey = displayKey;
    root.querySelector(".shell").hidden = false;
    root.querySelector("header").hidden = false;
    const action = this.action.bind(this);
    // Restore SplitText before replacing CMS text, otherwise revert restores
    // the previous heading over the newly rendered content.
    this.heroEffects?.revert();
    this.heroEffects = null;
    renderHero(root, hero, stats, action);
    animateHero(this);
    renderHeader(root, hero, menu, action);
    this.updateHeader();
  }
}
if (!customElements.get("arista-home"))
  customElements.define("arista-home", AristaHome);

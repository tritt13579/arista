// Source entry point. Wix must load dist/arista-home.js, not this module.
import { styles } from "../styles/index.js";
import { observeReveals } from "../utils/animations.js";
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

class AristaHome extends HTMLElement {
  static get observedAttributes() {
    return ["content"];
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
    if (oldValue !== newValue && this.isConnected) this.render();
  }
  emit(name, detail) {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }
  action(target, label, extra = {}) {
    const section = this.shadowRoot.getElementById(target);
    if (section && !section.hidden) {
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
    this.revealObserver?.disconnect();
    this.headerObserver?.disconnect();
    window.removeEventListener("scroll", this.onViewportChange);
    window.removeEventListener("resize", this.onViewportChange);
    cancelAnimationFrame(this.viewportFrame);
    this.viewportFrame = 0;
  }
  updateHeader() {
    updateHeader(this);
  }
  renderSections(data) {
    const key = JSON.stringify([
      data.quote,
      data.philosophy,
      data.programs,
      data.programButtonText,
    ]);
    if (key === this.lastSectionsKey) return;
    this.lastSectionsKey = key;
    const root = this.shadowRoot.querySelector(".sections");
    const blocks = [
      renderQuote(data.quote),
      renderPhilosophy(data.philosophy),
      renderPrograms(
        data.programs,
        data.programButtonText,
        this.action.bind(this),
      ),
    ].filter(Boolean);
    this.revealObserver?.disconnect();
    root.replaceChildren(...blocks);
    observeReveals(this, root);
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
    renderHero(root, hero, stats, action);
    renderHeader(root, hero, menu, action);
    this.updateHeader();
  }
}
if (!customElements.get("arista-home"))
  customElements.define("arista-home", AristaHome);

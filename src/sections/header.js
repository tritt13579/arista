import { imageUrl, setResponsiveImage } from "../utils/image-url.js";
import { imageFocusPosition } from "../utils/image-focus.js";

export const headerTemplate = `
<header hidden lang="vi">
  <div class="header-inner">
    <button class="brand" type="button" aria-label="Back to top">
      <img class="logo" alt="Arista Music Center" hidden>
      <span class="brand-text">Arista</span>
    </button>
    <button class="toggle" type="button" aria-label="Open menu"
      aria-controls="mobile-menu" aria-expanded="false"><span aria-hidden="true" class="menu-icon"></span></button>
    <nav id="arista-nav" aria-label="Main navigation"></nav>
    <button class="cta header-cta" type="button"></button>
  </div>
</header>
<dialog id="mobile-menu" class="mobile-menu" aria-label="Menu chính" aria-modal="true">
  <div class="mobile-menu-top">
    <div class="mobile-brand"></div>
    <button class="menu-close" type="button" aria-label="Close menu" autofocus>✕</button>
  </div>
  <nav class="mobile-nav" aria-label="Điều hướng"></nav>
  <div class="mobile-menu-footer">
    <button class="cta mobile-menu-cta" type="button"></button>
    <p class="mobile-menu-caption"></p>
  </div>
</dialog>
`;

export function renderHeader(root, hero, menu, action) {
  const img = root.querySelector(".logo");
  const url = imageUrl(hero.logo);
  img.hidden = !url;
  if (url) setResponsiveImage(img, hero.logo, "152px", [160, 320, 480]);
  if (!url) img.removeAttribute("src");
  img.alt = "Arista Music Center";
  img.style.objectPosition = imageFocusPosition(hero.logoFocusHeight);
  root.querySelector(".brand-text").hidden = !!url;
  const button = root.querySelector(".header-cta");
  const label = hero.headerLabel || hero.primaryLabel;
  button.textContent = String(label || "");
  button.hidden = !label;
  button.onclick = () =>
    action(String(hero.primaryTarget || ""), String(label || ""));
  root.querySelector("nav").replaceChildren(
    ...menu.map((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "nav-link";
      button.textContent = String(item.title || "");
      button.addEventListener("click", () =>
        action(String(item.target || ""), String(item.title || "")),
      );
      return button;
    }),
  );
  root
    .querySelector(".mobile-brand")
    .replaceChildren(root.querySelector(".brand").cloneNode(true));
  root.querySelectorAll(".brand").forEach(brand => {
    brand.onclick = () => action("top", "Back to top");
  });
  root.querySelector(".mobile-nav").replaceChildren(
    ...menu.map((item, index) => {
      const link = document.createElement("button");
      link.type = "button";
      link.className = "mobile-nav-link";
      link.style.setProperty("--item-index", index);
      const number = document.createElement("span");
      number.className = "menu-number";
      number.setAttribute("aria-hidden", "true");
      number.textContent = String(index + 1).padStart(2, "0");
      const title = document.createElement("span");
      title.className = "menu-title";
      title.textContent = String(item.title || "");
      const arrow = document.createElement("span");
      arrow.className = "menu-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";
      link.append(number, title, arrow);
      link.addEventListener("click", () =>
        action(String(item.target || ""), String(item.title || "")),
      );
      return link;
    }),
  );
  const mobileButton = root.querySelector(".mobile-menu-cta");
  mobileButton.textContent = String(label || "");
  mobileButton.hidden = !label;
  mobileButton.onclick = () =>
    action(String(hero.primaryTarget || ""), String(label || ""));
  root.querySelector(".mobile-menu-caption").textContent = String(
    hero.eyebrow || "",
  );
}

export function bindHeader(host) {
  const dialog = host.shadowRoot.querySelector(".mobile-menu");
  host.shadowRoot.querySelector(".toggle").addEventListener("click", () => {
    if (dialog.open) {
      closeMenu(host, true);
      return;
    }
    const session = { x: window.scrollX, y: window.scrollY };
    host.menuScrollSession = session;
    dialog.showModal();
    restoreMenuScroll(session);
    host.menuScrollFrame = requestAnimationFrame(() => {
      host.menuScrollFrame = 0;
      if (host.menuScrollSession === session && dialog.open) restoreMenuScroll(session);
    });
    host.shadowRoot
      .querySelector(".toggle")
      .setAttribute("aria-expanded", "true");
  });
  host.shadowRoot
    .querySelector(".menu-close")
    .addEventListener("click", () => closeMenu(host, true));
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeMenu(host, true);
  });
  dialog.addEventListener("close", () => {
    if (!dialog.open) closeMenu(host);
  });
  const canScroll = delta => delta < 0 ? dialog.scrollTop > 0 :
    dialog.scrollTop + dialog.clientHeight < dialog.scrollHeight - 1;
  dialog.addEventListener("wheel", event => {
    if (!event.ctrlKey && !canScroll(event.deltaY)) event.preventDefault();
  }, { passive: false });
  let touchY = 0;
  dialog.addEventListener("touchstart", event => {
    touchY = event.touches[0]?.clientY || 0;
  }, { passive: true });
  dialog.addEventListener("touchmove", event => {
    if (event.touches.length !== 1) return;
    const nextY = event.touches[0].clientY;
    if (!canScroll(touchY - nextY)) event.preventDefault();
    touchY = nextY;
  }, { passive: false });
  dialog.addEventListener("keydown", event => {
    if (!["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) return;
    if (event.key === " " && event.target.closest("button")) return;
    event.preventDefault();
    const direction = ["ArrowUp", "PageUp", "Home"].includes(event.key) || (event.key === " " && event.shiftKey) ? -1 : 1;
    const distance = ["Home", "End"].includes(event.key) ? dialog.scrollHeight : ["ArrowUp", "ArrowDown"].includes(event.key) ? 40 : dialog.clientHeight;
    dialog.scrollBy({ top: direction * distance, behavior: "instant" });
  });
  host.shadowRoot.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && dialog.open) {
      const buttons = [...dialog.querySelectorAll("button")].filter(
        (button) => !button.disabled && button.getClientRects().length > 0,
      );
      const first = buttons[0];
      const last = buttons.at(-1);
      const active = host.shadowRoot.activeElement;
      if (
        (event.shiftKey && active === first) ||
        (!event.shiftKey && active === last)
      ) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      }
    }
    if (event.key === "Escape" && dialog.open) {
      event.preventDefault();
      closeMenu(host, true);
    }
  });
  host.shadowRoot.addEventListener("click", (event) => {
    if (!event.target.closest("header, .mobile-menu")) host.closeMenu();
  });
}

export function updateHeader(host) {
  if (window.matchMedia("(min-width: 1025px)").matches) closeMenu(host);
  const header = host.shadowRoot.querySelector("header");
  const rect = host.getBoundingClientRect();
  const height =
    host.shadowRoot.querySelector(".header-inner").getBoundingClientRect()
      .height || 76;
  header.style.left = `${rect.left}px`;
  header.style.width = `${rect.width}px`;
  header.style.top = `${Math.max(0, rect.top)}px`;
  header.style.visibility =
    rect.bottom <= height || rect.top >= window.innerHeight ? "hidden" : "";
  header.classList.toggle("scrolled", rect.top < -40);
  host.style.setProperty("--header-height", `${height}px`);
}

export function closeMenu(host, restoreFocus = false, afterClose = null) {
  const dialog = host.shadowRoot.querySelector(".mobile-menu");
  if (afterClose) host.menuAfterClose = afterClose;
  const animate = dialog.open && host.isConnected && (restoreFocus || afterClose) &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (animate) {
    if (host.menuCloseAnimations) return;
    dialog.classList.add("is-closing");
    const timing = { duration: 180, easing: "ease-in", fill: "forwards" };
    const fade = dialog.animate([{ opacity: getComputedStyle(dialog).opacity }, { opacity: 0 }], timing);
    host.menuCloseAnimations = [fade, ...[...dialog.children].map(child =>
      child.animate([{ transform: "translateY(0)" }, { transform: "translateY(8px)" }], timing))];
    fade.finished.then(() => {
      if (host.menuCloseAnimations?.[0] === fade) finishMenuClose(host, restoreFocus);
    }).catch(() => {});
    return;
  }
  finishMenuClose(host, restoreFocus);
}

function finishMenuClose(host, restoreFocus) {
  const dialog = host.shadowRoot.querySelector(".mobile-menu");
  const afterClose = host.menuAfterClose;
  host.menuAfterClose = null;
  const animations = host.menuCloseAnimations;
  host.menuCloseAnimations = null;
  const session = host.menuScrollSession;
  const wasOpen = dialog.open;
  host.menuScrollSession = null;
  cancelAnimationFrame(host.menuScrollFrame);
  host.menuScrollFrame = 0;
  if (dialog.open) dialog.close();
  animations?.forEach(animation => animation.cancel());
  dialog.classList.remove("is-closing");
  host.shadowRoot
    .querySelector(".toggle")
    .setAttribute("aria-expanded", "false");
  host.shadowRoot
    .querySelector(".toggle")
    .setAttribute("aria-label", "Open menu");
  if (restoreFocus && wasOpen && host.isConnected)
    host.shadowRoot.querySelector(".toggle").focus({ preventScroll: true });
  if (session) restoreMenuScroll(session);
  if (host.isConnected) afterClose?.();
}

function restoreMenuScroll(session) {
  if (Math.abs(window.scrollX - session.x) > 0.5 || Math.abs(window.scrollY - session.y) > 0.5)
    window.scrollTo({ left: session.x, top: session.y, behavior: "instant" });
}

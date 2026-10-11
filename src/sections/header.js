import { imageUrl } from "../utils/image-url.js";

export const headerTemplate = `
<header hidden lang="vi">
  <div class="header-inner">
    <div class="brand">
      <img class="logo" alt="Arista Music Center" hidden>
      <span class="brand-text">Arista</span>
    </div>
    <button class="toggle" type="button" aria-label="Open menu"
      aria-controls="arista-nav" aria-expanded="false">☰ Menu</button>
    <nav id="arista-nav" aria-label="Main navigation"></nav>
    <button class="cta header-cta" type="button"></button>
  </div>
</header>
`;

export function renderHeader(root, hero, menu, action) {
  const img = root.querySelector(".logo");
  const url = imageUrl(hero.logo);
  img.hidden = !url;
  if (url && img.getAttribute("src") !== url) img.src = url;
  if (!url) img.removeAttribute("src");
  img.alt = "Arista Music Center";
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
}

export function bindHeader(host) {
  host.shadowRoot.querySelector(".toggle").addEventListener("click", () => {
    const open = host.shadowRoot.querySelector("nav").classList.toggle("open");
    host.shadowRoot
      .querySelector(".toggle")
      .setAttribute("aria-expanded", String(open));
    host.shadowRoot
      .querySelector(".toggle")
      .setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  host.shadowRoot.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      host.shadowRoot.querySelector("nav").classList.contains("open")
    ) {
      host.closeMenu();
      host.shadowRoot.querySelector(".toggle").focus();
    }
  });
  host.shadowRoot.addEventListener("click", (event) => {
    if (!event.target.closest("header")) host.closeMenu();
  });
}

export function updateHeader(host) {
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

export function closeMenu(host) {
  host.shadowRoot.querySelector("nav").classList.remove("open");
  host.shadowRoot
    .querySelector(".toggle")
    .setAttribute("aria-expanded", "false");
  host.shadowRoot
    .querySelector(".toggle")
    .setAttribute("aria-label", "Open menu");
}

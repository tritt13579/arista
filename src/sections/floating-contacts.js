import { node } from "../utils/dom.js";

const paths = {
  call: "M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z",
  messenger: "M12 2C6.4 2 2 6.1 2 11.7c0 2.9 1.2 5.5 3.2 7.3V22l3-1.6c1.2.3 2.4.5 3.8.5 5.6 0 10-4.1 10-9.7S17.6 2 12 2zm1 12.9-2.5-2.7-5 2.7 5.5-5.8 2.6 2.7 4.9-2.7z",
};

export function contactHref(value, phone = false) {
  const text = String(value || "").trim();
  if (phone) return /^\+?[\d\s().-]+$/.test(text) && /\d/.test(text) ? `tel:${text.replace(/[^\d+]/g, "")}` : "";
  try { const url = new URL(text); return url.protocol === "https:" ? url.href : ""; }
  catch { return ""; }
}

export function renderFloatingContacts(content, action) {
  if (!content) return null;
  const shell = node("div", "floating-contact-shell");
  shell.hidden = true;
  const bar = node("nav", "floating-contacts");
  bar.id = "floating-contact-options";
  bar.setAttribute("aria-label", "Contact options");
  for (const [kind, href, label] of [
    ["call", contactHref(content.phone, true), content.callLabel],
    ["zalo", contactHref(content.zaloUrl), content.zaloLabel],
    ["messenger", contactHref(content.messengerUrl), content.messengerLabel],
  ]) {
    if (!href || !label) continue;
    const link = node("a", "floating-contact");
    link.href = href;
    link.setAttribute("aria-label", kind === "call" ? `${label}: ${content.phone}` : label);
    if (kind !== "call") { link.target = "_blank"; link.rel = "noopener noreferrer"; }
    const icon = node("span", `contact-icon contact-icon-${kind}`);
    icon.setAttribute("aria-hidden", "true");
    if (kind === "zalo") icon.textContent = "Zalo";
    else icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="${paths[kind]}"></path></svg>`;
    link.append(icon, node("span", "contact-label", label));
    bar.append(link);
  }
  if (content.registrationLabel) {
    const button = node("button", "floating-registration", content.registrationLabel);
    button.type = "button";
    button.onclick = () => action("registration", content.registrationLabel);
    bar.append(button);
  }
  if (!bar.childElementCount) return null;
  const toggle = node("button", "floating-contact-toggle");
  toggle.type = "button";
  toggle.setAttribute("aria-controls", bar.id);
  toggle.innerHTML = '<svg class="contact-toggle-chat" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5a9.5 9.5 0 0 1 19 0Z"/><path d="M7 11h.01M12 11h.01M17 11h.01" stroke-linecap="round" stroke-width="3"/></svg><svg class="contact-toggle-close" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  const toggleIcon = node("span", "contact-toggle-icon");
  toggleIcon.setAttribute("aria-hidden", "true");
  toggleIcon.append(...toggle.childNodes);
  toggle.replaceChildren(toggleIcon, node("span", "", "Liên hệ"));
  const mobile = matchMedia("(max-width: 640px)");
  const events = new AbortController();
  let closeTimer;
  const items = [...bar.children];
  items.forEach((item, index) => {
    item.style.setProperty("--contact-open-delay", `${(items.length - index - 1) * 30}ms`);
    item.style.setProperty("--contact-close-delay", `${index * 25}ms`);
  });
  const setOpen = (open, restoreFocus = false) => {
    const wasOpen = shell.classList.contains("is-open");
    if (open || wasOpen) {
      clearTimeout(closeTimer);
      shell.classList.toggle("is-closing", !open);
      if (!open) closeTimer = setTimeout(() => shell.classList.remove("is-closing"), 230);
    }
    if (open && mobile.matches && !shell.classList.contains("is-open")) {
      // Measure the resting layout once; animation only changes transform and opacity.
      const distances = items.map(item => bar.clientHeight - item.offsetTop - item.offsetHeight / 2 + 36);
      items.forEach((item, index) => item.style.setProperty("--contact-travel", `${distances[index]}px`));
    }
    shell.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Đóng liên hệ" : "Mở liên hệ");
    bar.inert = mobile.matches && !open;
    bar.setAttribute("aria-hidden", String(mobile.matches && !open));
    if (restoreFocus) toggle.focus({ preventScroll: true });
  };
  toggle.onclick = () => setOpen(!shell.classList.contains("is-open"));
  bar.addEventListener("click", event => {
    if (event.target.closest("a, button")) setOpen(false);
  });
  document.addEventListener("pointerdown", event => {
    if (!event.composedPath().includes(shell)) setOpen(false);
  }, { signal: events.signal });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && shell.classList.contains("is-open")) {
      event.preventDefault();
      setOpen(false, true);
    }
  }, { signal: events.signal });
  shell.addEventListener("focusout", event => {
    if (!shell.contains(event.relatedTarget)) setOpen(false);
  });
  mobile.addEventListener("change", () => setOpen(false), { signal: events.signal });
  shell.closeContacts = () => setOpen(false);
  shell.dispose = () => {
    clearTimeout(closeTimer);
    events.abort();
  };
  setOpen(false);
  shell.append(bar, toggle);
  return shell;
}

export function updateFloatingContacts(host) {
  const shell = host.shadowRoot.querySelector(".floating-contact-shell");
  if (!shell) return;
  const rect = host.getBoundingClientRect();
  shell.style.left = `${rect.left}px`;
  shell.style.width = `${rect.width}px`;
  shell.hidden = rect.top >= -window.innerHeight * .7 || rect.bottom <= 0 || rect.top >= window.innerHeight;
  if (shell.hidden) shell.closeContacts();
}

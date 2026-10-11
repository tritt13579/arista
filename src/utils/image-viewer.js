import { node } from "./dom.js";

export function openImageViewer(host, images, initialIndex) {
  host.closeMenu();
  if (!host.imageViewer) {
    const dialog = node("dialog", "image-viewer");
    dialog.setAttribute("aria-label", "Image viewer");
    const close = node("button", "viewer-close", "✕");
    close.type = "button";
    close.setAttribute("aria-label", "Close image");
    const previous = node("button", "viewer-previous", "‹");
    previous.type = "button";
    previous.setAttribute("aria-label", "Previous image");
    const next = node("button", "viewer-next", "›");
    next.type = "button";
    next.setAttribute("aria-label", "Next image");
    const figure = node("figure", "viewer-figure");
    const image = node("img", "");
    const caption = node("figcaption", "");
    caption.tabIndex = 0;
    caption.id = "image-viewer-caption";
    dialog.setAttribute("aria-describedby", caption.id);
    const status = node("p", "viewer-status");
    status.setAttribute("aria-live", "polite");
    figure.append(image, caption);
    dialog.append(close, previous, figure, next, status);
    const viewer = { dialog, items: [], index: 0, session: null, scrollFrame: 0 };
    const canScrollCaption = (target, delta) => caption.contains(target) &&
      (delta < 0 ? caption.scrollTop > 0 : caption.scrollTop + caption.clientHeight < caption.scrollHeight - 1);
    dialog.addEventListener("wheel", event => {
      if (!event.ctrlKey && !canScrollCaption(event.target, event.deltaY)) event.preventDefault();
    }, { passive: false });
    let touchY = 0;
    dialog.addEventListener("touchstart", event => {
      touchY = event.touches[0]?.clientY || 0;
    }, { passive: true });
    dialog.addEventListener("touchmove", event => {
      if (event.touches.length !== 1) return;
      const nextY = event.touches[0].clientY;
      if (!canScrollCaption(event.target, touchY - nextY)) event.preventDefault();
      touchY = nextY;
    }, { passive: false });
    const render = () => {
      const item = viewer.items[viewer.index];
      image.src = item.src;
      image.alt = item.alt || item.caption || "";
      caption.textContent = item.caption || "";
      status.textContent = `${viewer.index + 1} / ${viewer.items.length}`;
      previous.hidden = next.hidden = viewer.items.length < 2;
    };
    const move = direction => {
      viewer.index = (viewer.index + direction + viewer.items.length) % viewer.items.length;
      render();
    };
    viewer.close = () => {
      if (!viewer.session && !dialog.open) return;
      const session = viewer.session;
      viewer.session = null;
      cancelAnimationFrame(viewer.scrollFrame);
      viewer.scrollFrame = 0;
      if (dialog.open) dialog.close();
      if (session) {
        if (host.isConnected && session.trigger?.isConnected && host.shadowRoot.activeElement !== session.trigger)
          session.trigger.focus({ preventScroll: true });
        restorePosition(session);
      }
    };
    viewer.render = render;
    close.onclick = viewer.close;
    previous.onclick = () => move(-1);
    next.onclick = () => move(1);
    dialog.addEventListener("cancel", event => { event.preventDefault(); viewer.close(); });
    dialog.addEventListener("close", () => { if (!dialog.open) viewer.close(); });
    dialog.addEventListener("click", event => { if (event.target === dialog) viewer.close(); });
    dialog.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      } else if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
        if (event.key === " " && event.target.closest("button")) return;
        event.preventDefault();
        if (caption.contains(event.target)) {
          const direction = ["ArrowUp", "PageUp", "Home"].includes(event.key) || (event.key === " " && event.shiftKey) ? -1 : 1;
          const distance = ["Home", "End"].includes(event.key) ? caption.scrollHeight : ["ArrowUp", "ArrowDown"].includes(event.key) ? 40 : caption.clientHeight;
          caption.scrollBy({ top: direction * distance, behavior: "instant" });
        }
      }
    });
    host.shadowRoot.append(dialog);
    host.imageViewer = viewer;
  }
  const viewer = host.imageViewer;
  viewer.items = images;
  viewer.index = initialIndex;
  viewer.render();
  if (!viewer.dialog.open) {
    const session = {
      x: window.scrollX,
      y: window.scrollY,
      trigger: host.shadowRoot.activeElement || document.activeElement,
    };
    viewer.session = session;
    const restoreScroll = () => {
      if (viewer.session === session && viewer.dialog.open)
        restorePosition(session);
    };
    viewer.dialog.showModal();
    const close = viewer.dialog.querySelector(".viewer-close");
    if (host.shadowRoot.activeElement !== close) close.focus({ preventScroll: true });
    restoreScroll();
    viewer.scrollFrame = requestAnimationFrame(() => {
      viewer.scrollFrame = 0;
      restoreScroll();
    });
  }
}

function restorePosition(session) {
  if (Math.abs(window.scrollX - session.x) > 0.5 || Math.abs(window.scrollY - session.y) > 0.5)
    window.scrollTo({ left: session.x, top: session.y, behavior: "instant" });
}

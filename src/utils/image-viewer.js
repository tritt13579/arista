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
    const stage = node("div", "viewer-stage");
    const message = node("p", "viewer-message");
    message.setAttribute("role", "status");
    stage.append(message);
    const caption = node("figcaption", "");
    caption.tabIndex = 0;
    caption.id = "image-viewer-caption";
    dialog.setAttribute("aria-describedby", caption.id);
    const status = node("p", "viewer-status");
    status.setAttribute("aria-live", "polite");
    figure.append(stage, caption);
    dialog.append(close, previous, figure, next, status);
    const viewer = { dialog, items: [], index: 0, session: null, scrollFrame: 0, generation: 0, prefetch: null };
    const load = src => {
      const image = new Image();
      image.decoding = "async";
      const ready = new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error("Image unavailable"));
      }).then(async () => {
        if (image.decode) await image.decode();
        return image;
      });
      image.src = src;
      return { src, ready };
    };
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
    const render = (direction = 0) => {
      const generation = ++viewer.generation;
      const item = viewer.items[viewer.index];
      stage.querySelector("img")?.remove();
      message.hidden = false;
      message.textContent = "Đang tải ảnh…";
      stage.setAttribute("aria-busy", "true");
      caption.textContent = item.caption || "";
      caption.scrollTop = 0;
      status.textContent = `${viewer.index + 1} / ${viewer.items.length}`;
      previous.hidden = next.hidden = viewer.items.length < 2;
      const request = viewer.prefetch?.src === item.src ? viewer.prefetch : load(item.src);
      viewer.prefetch = null;
      request.ready.then(image => {
        if (generation !== viewer.generation) return;
        image.alt = item.alt || item.caption || "";
        image.style.setProperty("--viewer-enter-x", `${direction * 32}px`);
        stage.append(image);
        message.hidden = true;
        stage.removeAttribute("aria-busy");
        // Warm exactly one neighbour, only after the selected image is ready.
        if (viewer.items.length > 1 && dialog.open) {
          const nextItem = viewer.items[(viewer.index + 1) % viewer.items.length];
          const warm = load(nextItem.src);
          viewer.prefetch = warm;
          warm.ready.catch(() => {
            if (viewer.prefetch === warm) viewer.prefetch = null;
          });
        }
      }).catch(() => {
        if (generation !== viewer.generation) return;
        stage.removeAttribute("aria-busy");
        message.textContent = "Không tải được ảnh. Vui lòng chuyển ảnh khác hoặc mở lại để thử lại.";
      });
    };
    const move = direction => {
      viewer.index = (viewer.index + direction + viewer.items.length) % viewer.items.length;
      render(direction);
    };
    viewer.close = () => {
      if (!viewer.session && !dialog.open) return;
      const session = viewer.session;
      viewer.session = null;
      viewer.generation++;
      viewer.prefetch = null;
      stage.querySelector("img")?.remove();
      stage.removeAttribute("aria-busy");
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

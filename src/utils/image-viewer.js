import { node } from "./dom.js";
import { responsiveImage } from "./image-url.js";
import { thumbnailTransition, thumbnailTiming } from "./thumbnail-transition.js";

export function openImageViewer(host, images, initialIndex, options = {}) {
  host.closeMenu();
  if (!host.imageViewer) {
    const dialog = node("dialog", "image-viewer");
    dialog.setAttribute("aria-label", "Image viewer");
    const shade = node("div", "viewer-shade");
    shade.setAttribute("aria-hidden", "true");
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
    dialog.append(shade, close, previous, figure, next, status);
    const viewer = { dialog, items: [], index: 0, session: null, scrollFrame: 0, generation: 0, prefetch: null };
    const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewer.cancelTransition = () => {
      viewer.transition?.cancel();
      viewer.transition = null;
      viewer.opening = false;
      dialog.classList.remove("is-zooming");
    };
    const transition = (opening, image, thumbnail, interrupted) => {
      const opacity = getComputedStyle(shade).opacity;
      viewer.cancelTransition();
      const flight = thumbnailTransition(dialog, stage, image, thumbnail, opening, interrupted);
      dialog.classList.toggle("is-zooming", !!flight);
      const fade = shade.animate([{ opacity: opening ? 0 : opacity }, { opacity: opening ? 1 : 0 }], {
        duration: flight ? opening ? 260 : thumbnailTiming.close : 200, easing: "ease-out", fill: "both",
      });
      const chrome = [close, previous, next, caption, status, message, ...(!flight ? [stage] : [])].map(element =>
        element.animate([{ opacity: opening ? 0 : getComputedStyle(element).opacity }, { opacity: opening ? 1 : 0 }], {
          duration: !flight ? 200 : opening ? 180 : 120, delay: opening && flight ? 100 : 0, easing: "ease-out", fill: "both",
        }));
      const job = {
        cancel() { flight?.cancel(); fade.cancel(); chrome.forEach(animation => animation.cancel()); },
        finished: Promise.all([fade.finished, flight?.finished]).then(() => true, () => false),
      };
      viewer.transition = job;
      return job;
    };
    viewer.animateOpen = () => {
      if (reduceMotion()) return;
      const thumbnail = viewer.items[viewer.index]?.thumbnail;
      const job = transition(true, thumbnail?.querySelector("img"), thumbnail);
      viewer.opening = true;
      job.finished.then(finished => {
        if (finished && viewer.transition === job) viewer.cancelTransition();
      });
    };
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
      stage.classList.remove("viewer-has-preview");
      const quietLoading = viewer.options.quietLoading === true;
      message.hidden = quietLoading;
      message.textContent = quietLoading ? "" : "Đang tải ảnh…";
      stage.setAttribute("aria-busy", "true");
      caption.textContent = item.caption || "";
      caption.hidden = viewer.options.showCaption === false;
      if (caption.hidden) dialog.removeAttribute("aria-describedby");
      else dialog.setAttribute("aria-describedby", caption.id);
      caption.scrollTop = 0;
      status.textContent = `${viewer.index + 1} / ${viewer.items.length}`;
      previous.hidden = next.hidden = viewer.items.length < 2;
      let fullReady = false;
      let fullFailed = false;
      const previewSrc = item.previewSrc || responsiveImage(item.src, "640px", [640]).src;
      const prepareImage = image => {
        image.alt = item.alt || item.caption || "";
        image.style.setProperty("--viewer-enter-x", `${direction * 32}px`);
        if (viewer.opening && !direction) image.classList.add("viewer-refined");
      };
      if (previewSrc && previewSrc !== item.src) {
        load(previewSrc).ready.then(image => {
          if (generation !== viewer.generation || fullReady) return;
          prepareImage(image);
          image.classList.add("viewer-preview");
          stage.append(image);
          stage.classList.add("viewer-has-preview");
          message.hidden = quietLoading;
          message.textContent = quietLoading ? "" : fullFailed ? "Chưa tải được ảnh chất lượng cao." : "Đang tải ảnh chất lượng cao…";
        }).catch(() => {
          // A failed thumbnail must not interrupt the original image request.
        });
      }
      const request = viewer.prefetch?.src === item.src ? viewer.prefetch : load(item.src);
      viewer.prefetch = null;
      request.ready.then(image => {
        if (generation !== viewer.generation) return;
        fullReady = true;
        prepareImage(image);
        const preview = stage.querySelector("img");
        if (preview) {
          // Sharpen in place without repeating the slide animation.
          image.classList.add("viewer-refined");
          preview.remove();
        }
        stage.append(image);
        stage.classList.remove("viewer-has-preview");
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
        fullFailed = true;
        stage.removeAttribute("aria-busy");
        const hasPreview = !!stage.querySelector("img");
        message.hidden = quietLoading && hasPreview;
        message.textContent = hasPreview
          ? quietLoading ? "" : "Chưa tải được ảnh chất lượng cao."
          : "Không tải được ảnh. Vui lòng chuyển ảnh khác hoặc mở lại để thử lại.";
      });
    };
    const move = direction => {
      if (viewer.closing) return;
      if (viewer.opening) viewer.cancelTransition();
      viewer.index = (viewer.index + direction + viewer.items.length) % viewer.items.length;
      render(direction);
    };
    const finishClose = () => {
      if (!viewer.session && !dialog.open) return;
      const session = viewer.session;
      viewer.session = null;
      viewer.closing = false;
      viewer.cancelTransition();
      dialog.classList.remove("is-closing");
      viewer.generation++;
      viewer.prefetch = null;
      stage.querySelector("img")?.remove();
      stage.classList.remove("viewer-has-preview");
      stage.removeAttribute("aria-busy");
      cancelAnimationFrame(viewer.scrollFrame);
      viewer.scrollFrame = 0;
      if (dialog.open) dialog.close();
      window.removeEventListener("resize", viewer.onResize);
      if (session) {
        if (host.isConnected && session.trigger?.isConnected && host.shadowRoot.activeElement !== session.trigger)
          session.trigger.focus({ preventScroll: true });
        restorePosition(session);
      }
    };
    viewer.close = (withAnimation = false) => {
      if (!withAnimation || !dialog.open || !host.isConnected || reduceMotion()) {
        finishClose();
        return;
      }
      if (viewer.closing) return;
      viewer.closing = true;
      viewer.generation++;
      viewer.prefetch = null;
      const thumbnail = viewer.items[viewer.index]?.thumbnail;
      if (thumbnail?.isConnected && viewer.session) viewer.session.trigger = thumbnail;
      const activeFlight = dialog.querySelector(".viewer-flight");
      const image = stage.querySelector("img") || activeFlight?.querySelector("img");
      image?.getAnimations().forEach(animation => animation.finish());
      const interrupted = activeFlight ? {
        frame: {
          left: parseFloat(activeFlight.style.left), top: parseFloat(activeFlight.style.top),
          width: parseFloat(activeFlight.style.width), height: parseFloat(activeFlight.style.height),
        },
        transform: getComputedStyle(activeFlight).transform,
        clipPath: getComputedStyle(activeFlight).clipPath,
      } : {};
      dialog.classList.add("is-closing");
      const job = transition(false, image, thumbnail, interrupted);
      job.finished.then(finished => {
        if (finished && viewer.transition === job) finishClose();
      });
    };
    viewer.render = render;
    viewer.onResize = () => {
      if (viewer.closing) viewer.close();
      else viewer.cancelTransition();
    };
    close.onclick = () => viewer.close(true);
    previous.onclick = () => move(-1);
    next.onclick = () => move(1);
    dialog.addEventListener("cancel", event => { event.preventDefault(); viewer.close(true); });
    dialog.addEventListener("close", () => { if (!dialog.open) viewer.close(); });
    dialog.addEventListener("click", event => { if (event.target === dialog) viewer.close(true); });
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
  if (viewer.closing || viewer.opening) viewer.close();
  viewer.items = images;
  viewer.options = options;
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
    window.addEventListener("resize", viewer.onResize);
    viewer.animateOpen();
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

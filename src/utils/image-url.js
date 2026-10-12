export function imageUrl(value) {
  if (typeof value !== "string") return "";
  // Wix CMS Image fields return wix:image://v1/<media-id>/<filename>#...
  const match = value.match(/^wix:image:\/\/v1\/([^/]+)\//);
  if (match) return `https://static.wixstatic.com/media/${match[1]}`;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ||
      (url.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(url.hostname))
      ? url.href
      : "";
  } catch (_) {
    return "";
  }
}

// Resize the whole image; CSS object-fit/object-position still controls the crop.
// Height is a generous bound so portrait images are sized primarily by width.
export function responsiveImage(value, sizes = "100vw", widths = [320, 480, 640, 960, 1280, 1920, 2560]) {
  const original = imageUrl(value);
  let url;
  try { url = new URL(original); } catch { return { src: original, srcset: "", sizes: "" }; }
  const media = url.pathname.match(/^\/media\/([^/]+)$/);
  if (url.hostname !== "static.wixstatic.com" || !media || !/\.(jpe?g|png|webp)$/i.test(media[1]) || url.search) {
    return { src: original, srcset: "", sizes: "" };
  }
  const metadata = String(value).split("#")[1];
  const originWidth = Number(new URLSearchParams(metadata).get("originWidth"));
  const originHeight = Number(new URLSearchParams(metadata).get("originHeight"));
  const maximum = originWidth > 0 && originHeight > 0
    ? Math.floor(Math.min(originWidth, originWidth * 5000 / originHeight)) : 2560;
  const candidates = [...new Set(widths.map(width => Math.min(width, maximum)))].filter(width => width > 0).sort((a, b) => a - b);
  const variant = width => `${original}/v1/fit/w_${width},h_5000/file.webp`;
  return { src: variant(candidates.find(width => width >= 640) || candidates.at(-1)), srcset: candidates.map(width => `${variant(width)} ${width}w`).join(", "), sizes };
}

const fallbackHandlers = new WeakMap();

export function setResponsiveImage(image, value, sizes, widths) {
  const source = responsiveImage(value, sizes, widths);
  if (image.getAttribute("src") === source.src && (image.getAttribute("srcset") || "") === source.srcset && (image.getAttribute("sizes") || "") === source.sizes) return;
  const previous = fallbackHandlers.get(image);
  if (previous) image.removeEventListener("error", previous, true);
  fallbackHandlers.delete(image);
  image.removeAttribute("srcset");
  image.removeAttribute("sizes");
  if (!source.src) { image.removeAttribute("src"); return; }
  if (source.srcset) {
    // Retry the original only if the CDN variant fails; existing section error
    // handlers still handle a failure of the original on the second attempt.
    const fallback = event => {
      event.stopImmediatePropagation();
      fallbackHandlers.delete(image);
      image.removeAttribute("srcset");
      image.removeAttribute("sizes");
      image.src = imageUrl(value);
    };
    fallbackHandlers.set(image, fallback);
    image.addEventListener("error", fallback, { capture: true, once: true });
    image.sizes = source.sizes;
    image.srcset = source.srcset;
  }
  image.src = source.src;
}

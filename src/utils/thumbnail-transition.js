// Both directions keep a full-size frame fixed and animate only uniform
// transforms and cropping, so the photo never stretches or fades into a copy.
export const thumbnailTiming = { open: 480, close: 420 };

export function thumbnailTransition(dialog, stage, image, thumbnail, opening, interrupted = {}) {
  if (!image?.naturalWidth || !thumbnail?.isConnected) return null;
  const small = thumbnail.getBoundingClientRect();
  const area = stage.getBoundingClientRect();
  if (!small.width || !small.height || !area.width || !area.height) return null;
  const scale = Math.min(area.width / image.naturalWidth, area.height / image.naturalHeight);
  const large = { width: image.naturalWidth * scale, height: image.naturalHeight * scale };
  large.left = area.left + (area.width - large.width) / 2;
  large.top = area.top + (area.height - large.height) / 2;
  const base = interrupted.frame || large;
  const radius = parseFloat(getComputedStyle(thumbnail).borderRadius) || 0;
  const focus = getComputedStyle(thumbnail.querySelector("img") || thumbnail).objectPosition.split(" ");
  const fraction = value => value?.endsWith("%") ? Math.min(1, Math.max(0, parseFloat(value) / 100)) : 0.5;
  const ratio = Math.max(small.width / base.width, small.height / base.height);
  const cropX = (base.width * ratio - small.width) * fraction(focus[0]);
  const cropY = (base.height * ratio - small.height) * fraction(focus[1]);
  const right = base.width * ratio - small.width - cropX;
  const bottom = base.height * ratio - small.height - cropY;
  const smallTransform = `translate(${small.left - base.left - cropX}px, ${small.top - base.top - cropY}px) scale(${ratio})`;
  const smallCrop = `inset(${cropY / ratio}px ${right / ratio}px ${bottom / ratio}px ${cropX / ratio}px round ${radius / ratio}px)`;
  const fullTransform = "translate(0px, 0px) scale(1)";
  const fullCrop = "inset(0px 0px 0px 0px round 0px)";
  const fromTransform = opening ? smallTransform : interrupted.transform || fullTransform;
  const fromCrop = opening ? smallCrop : interrupted.clipPath || fullCrop;
  const flight = document.createElement("div");
  flight.className = "viewer-flight";
  flight.setAttribute("aria-hidden", "true");
  Object.assign(flight.style, {
    left: `${base.left}px`, top: `${base.top}px`,
    width: `${base.width}px`, height: `${base.height}px`,
    transformOrigin: "0 0", transform: fromTransform, clipPath: fromCrop,
    willChange: "transform, clip-path",
  });
  const copy = document.createElement("img");
  copy.alt = "";
  copy.src = image.currentSrc || image.src;
  flight.append(copy);
  dialog.append(flight);
  const timing = {
    duration: opening ? thumbnailTiming.open : thumbnailTiming.close,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "both",
  };
  const animations = [
    flight.animate([{ transform: fromTransform }, { transform: opening ? fullTransform : smallTransform }], timing),
    flight.animate([{ clipPath: fromCrop }, { clipPath: opening ? fullCrop : smallCrop }], timing),
  ];
  const previousVisibility = thumbnail.style.visibility;
  thumbnail.style.visibility = "hidden";
  return {
    finished: Promise.all(animations.map(animation => animation.finished)).then(() => true, () => false),
    cancel() {
      animations.forEach(animation => animation.cancel());
      flight.remove();
      thumbnail.style.visibility = previousVisibility;
    },
  };
}

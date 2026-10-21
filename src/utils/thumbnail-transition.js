// Both directions keep a full-size frame fixed and animate only uniform
// transforms and cropping, so the photo never stretches or fades into a copy.
export const thumbnailTiming = { open: 480, close: 420 };

// Return the painted image rectangle, excluding borders, padding and letterboxing.
export function thumbnailImageRect(box, style, naturalWidth, naturalHeight) {
  const px = value => parseFloat(value) || 0;
  const leftInset = px(style.borderLeftWidth) + px(style.paddingLeft);
  const topInset = px(style.borderTopWidth) + px(style.paddingTop);
  const width = box.width - leftInset - px(style.borderRightWidth) - px(style.paddingRight);
  const height = box.height - topInset - px(style.borderBottomWidth) - px(style.paddingBottom);
  const rect = { left: box.left + leftInset, top: box.top + topInset, width, height };
  if (style.objectFit !== 'contain' || !naturalWidth || !naturalHeight) return rect;
  const scale = Math.min(width / naturalWidth, height / naturalHeight);
  const position = style.objectPosition.split(' ');
  const fraction = value => value?.endsWith('%') ? Math.min(1, Math.max(0, parseFloat(value) / 100)) : 0.5;
  const paintedWidth = naturalWidth * scale;
  const paintedHeight = naturalHeight * scale;
  return {
    left: rect.left + (width - paintedWidth) * fraction(position[0]),
    top: rect.top + (height - paintedHeight) * fraction(position[1]),
    width: paintedWidth, height: paintedHeight,
  };
}

export function thumbnailTransition(dialog, stage, image, thumbnail, opening, interrupted = {}) {
  if (!image?.naturalWidth || !thumbnail?.isConnected) return null;
  const thumbnailImage = thumbnail.querySelector('img');
  const target = thumbnailImage || thumbnail;
  const targetStyle = getComputedStyle(target);
  const contained = targetStyle.objectFit === 'contain';
  const small = thumbnailImage
    ? thumbnailImageRect(target.getBoundingClientRect(), targetStyle, target.naturalWidth, target.naturalHeight)
    : thumbnail.getBoundingClientRect();
  const area = stage.getBoundingClientRect();
  if (!small.width || !small.height || !area.width || !area.height) return null;
  const scale = Math.min(area.width / image.naturalWidth, area.height / image.naturalHeight);
  const large = { width: image.naturalWidth * scale, height: image.naturalHeight * scale };
  large.left = area.left + (area.width - large.width) / 2;
  large.top = area.top + (area.height - large.height) / 2;
  const base = interrupted.frame || large;
  const radius = contained ? 0 : parseFloat(getComputedStyle(thumbnail).borderRadius) || 0;
  const focus = targetStyle.objectPosition.split(" ");
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
  // Contained images leave their surrounding frame in place throughout the flight.
  const hiddenTarget = contained ? target : thumbnail;
  const previousVisibility = hiddenTarget.style.visibility;
  hiddenTarget.style.visibility = "hidden";
  return {
    finished: Promise.all(animations.map(animation => animation.finished)).then(() => true, () => false),
    cancel() {
      animations.forEach(animation => animation.cancel());
      flight.remove();
      hiddenTarget.style.visibility = previousVisibility;
    },
  };
}

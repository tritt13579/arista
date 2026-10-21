// Keep the currently raised photo while the pointer is on its painted area.
// Only choose a new candidate from the original geometry after leaving it.
export function bindHeroHover(canvas, frames) {
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const buttons = frames.map(frame => frame.querySelector('.hero-card'));
  const surfaces = frames.map(frame => frame.querySelector('.hero-card-surface'));
  let active = -1, candidate = -1, timer = 0, disposed = false;
  const activate = index => {
    if (index === active) return;
    if (active >= 0) frames[active].classList.remove('is-hover-active');
    active = index;
    if (active >= 0) frames[active].classList.add('is-hover-active');
  };
  const reset = () => {
    clearTimeout(timer); timer = 0; candidate = -1;
    activate(-1);
  };
  const hit = (button, x, y) => {
    const box = button.getBoundingClientRect();
    if (!box.width || !box.height) return false;
    const matrix = new DOMMatrix(getComputedStyle(button).transform);
    const width = button.offsetWidth, height = button.offsetHeight;
    // Account for an outer editor/site scale as well as the card's rotation.
    const scaleX = box.width / (Math.abs(matrix.a) * width + Math.abs(matrix.c) * height);
    const scaleY = box.height / (Math.abs(matrix.b) * width + Math.abs(matrix.d) * height);
    const point = matrix.inverse().transformPoint({
      x: (x - box.left - box.width / 2) / scaleX,
      y: (y - box.top - box.height / 2) / scaleY,
    });
    return Math.abs(point.x) <= width / 2 && Math.abs(point.y) <= height / 2;
  };
  const move = event => {
    if (disposed || event.pointerType === 'touch' || !fine.matches) { reset(); return; }
    const target = canvas.getRootNode().elementFromPoint(event.clientX, event.clientY);
    if (active >= 0 && surfaces[active].contains(target)) {
      clearTimeout(timer); timer = 0; candidate = active;
      return;
    }
    let next = -1;
    for (let i = buttons.length - 1; i >= 0; i--) {
      if (hit(buttons[i], event.clientX, event.clientY)) { next = i; break; }
    }
    if (next === candidate) return;
    reset(); candidate = next;
    if (next >= 0) timer = setTimeout(() => {
      timer = 0;
      if (!disposed && candidate === next && fine.matches) activate(next);
    }, 140);
  };
  const focus = event => {
    const index = buttons.indexOf(event.target);
    // Pointer focus occurs between pointerdown and click. Lowering the card
    // there can put a different photo under the pointer and cancel the click.
    if (index < 0 || !event.target.matches(':focus-visible')) return;
    reset();
    activate(index);
  };
  const blurFocus = event => {
    if (!canvas.contains(event.relatedTarget)) reset();
  };
  canvas.addEventListener('pointermove', move, { passive: true });
  canvas.addEventListener('pointerleave', reset);
  canvas.addEventListener('pointercancel', reset);
  canvas.addEventListener('focusin', focus);
  canvas.addEventListener('focusout', blurFocus);
  window.addEventListener('blur', reset);
  window.addEventListener('scroll', reset, { passive: true });
  window.addEventListener('resize', reset);
  fine.addEventListener('change', reset);
  return {
    reset,
    dispose() {
      disposed = true; reset();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', reset);
      canvas.removeEventListener('pointercancel', reset);
      canvas.removeEventListener('focusin', focus);
      canvas.removeEventListener('focusout', blurFocus);
      window.removeEventListener('blur', reset);
      window.removeEventListener('scroll', reset);
      window.removeEventListener('resize', reset);
      fine.removeEventListener('change', reset);
    },
  };
}

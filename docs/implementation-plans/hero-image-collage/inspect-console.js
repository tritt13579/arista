// Run on the REFERENCE website with #about-us, not on Wix or Arista.
(() => {
  window.aristaReferenceInspect?.stop();
  const section = document.querySelector('#about-us');
  if (!section) return console.warn('Không tìm thấy #about-us. Hãy mở website mẫu.');
  const cards = [...section.querySelectorAll('div.group')].filter(el =>
    el.querySelector(':scope > img') && el.style.top && el.style.left);
  const round = n => Math.round(n * 100) / 100;
  const rect = el => {
    const r = el.getBoundingClientRect();
    return { x: round(r.x), y: round(r.y), width: round(r.width), height: round(r.height) };
  };
  const shown = el => {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.display === 'none' || s.visibility === 'hidden') return false;
    }
    return true;
  };
  const env = () => ({ width: innerWidth, height: innerHeight, dpr: devicePixelRatio,
    scrollY: round(scrollY), reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches });
  const styles = el => {
    const s = getComputedStyle(el);
    const keys = ['display', 'position', 'width', 'height', 'top', 'left', 'zIndex',
      'transform', 'transformOrigin', 'translate', 'rotate', 'scale', 'opacity',
      'filter', 'objectFit', 'objectPosition', 'overflow', 'borderRadius', 'boxShadow',
      'transitionProperty', 'transitionDuration', 'transitionTimingFunction',
      'animationName', 'animationDuration', 'animationIterationCount', 'pointerEvents',
      'gridTemplateColumns', 'gap', 'padding', 'backgroundColor'];
    return Object.fromEntries(keys.map(key => [key, s[key]]));
  };
  const nativeAnimations = () => section.getAnimations({ subtree: true }).map(a => ({
    targetCard: cards.indexOf(a.effect?.target), targetTag: a.effect?.target?.tagName,
    playState: a.playState, currentTime: a.currentTime,
    timing: a.effect?.getTiming(), keyframes: a.effect?.getKeyframes(),
  }));
  const report = { version: 1, url: location.href, collectedAt: new Date().toISOString(),
    note: 'Computed styles and geometry only; native animation list does not include all JS animations.',
    snapshots: [], traces: [] };
  let timer;
  let active;
  let removeListeners = () => {};
  const stop = () => {
    clearInterval(timer); timer = undefined;
    removeListeners(); removeListeners = () => {};
    if (active) { active.endedAt = performance.now(); active = undefined; }
  };
  const capture = label => {
    const snapshot = { label, env: env(), section: { rect: rect(section), styles: styles(section) },
      gsapGlobalAvailable: !!window.gsap, scrollTriggerGlobalAvailable: !!window.ScrollTrigger,
      nativeAnimations: nativeAnimations(),
      cards: cards.map((card, index) => ({ index, shown: shown(card), className: card.className,
        inlineStyle: card.getAttribute('style'), rect: rect(card), styles: styles(card),
        parent: { className: card.parentElement.className, rect: rect(card.parentElement), styles: styles(card.parentElement) },
        image: { src: card.querySelector('img').currentSrc, styles: styles(card.querySelector('img')) },
      })),
    };
    report.snapshots.push(snapshot);
    console.log('Đã chụp:', label, snapshot);
    console.table(snapshot.cards.filter(c => c.shown).map(c => ({ index: c.index,
      top: c.styles.top, left: c.styles.left, width: c.styles.width,
      transform: c.styles.transform, filter: c.image.styles.filter })));
    return snapshot;
  };
  const trace = (label = 'trace', seconds = 15) => {
    stop();
    capture(`${label}-start`);
    const duration = Math.min(60, Math.max(1, Number(seconds) || 15)) * 1000;
    const start = performance.now();
    active = { label, startedAt: start, frames: [], events: [] };
    const record = active;
    report.traces.push(record);
    const event = e => {
      const card = e.target instanceof Element ? e.target.closest('div.group') : null;
      record.events.push({ t: round(performance.now() - start), type: e.type, card: cards.indexOf(card),
        x: e.clientX, y: e.clientY, scrollY: round(scrollY) });
    };
    ['pointerover', 'pointerout', 'click'].forEach(type => section.addEventListener(type, event, true));
    window.addEventListener('scroll', event, { passive: true });
    removeListeners = () => {
      ['pointerover', 'pointerout', 'click'].forEach(type => section.removeEventListener(type, event, true));
      window.removeEventListener('scroll', event);
    };
    const sample = () => {
      const elapsed = performance.now() - start;
      record.frames.push({ t: round(elapsed), env: env(),
        cards: cards.map((card, index) => {
          if (!shown(card)) return null;
          const s = getComputedStyle(card), img = getComputedStyle(card.querySelector('img'));
          return { index, transform: s.transform, translate: s.translate, rotate: s.rotate,
            scale: s.scale, opacity: s.opacity, zIndex: s.zIndex, filter: img.filter,
            parentOpacity: getComputedStyle(card.parentElement).opacity, rect: rect(card) };
        }).filter(Boolean) });
      if (elapsed >= duration) {
        stop(); capture(`${label}-end`);
        console.log(`Đã đo xong “${label}”. Chạy copy(JSON.stringify(aristaReferenceInspect.report)) để gửi kết quả.`);
      }
    };
    sample(); timer = setInterval(sample, 100);
    console.log(`Đang đo “${label}” trong ${duration / 1000} giây.`);
  };
  const download = () => {
    stop();
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'reference-about-us-inspect.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  window.aristaReferenceInspect = { report, capture, trace, stop, download };
  capture('initial');
  console.log('Sẵn sàng. Các lệnh: aristaReferenceInspect.trace("idle", 10), .trace("scroll", 15), .trace("hover", 10), .download().');
})();

import { ScrollTrigger } from 'gsap/ScrollTrigger';

// A global refresh temporarily resets scroll positions. Never run it while
// native smooth navigation (or a user's scroll) is still moving the page.
const owners = new Set();
const pending = new Set();
let timer;
let lastScroll = -Infinity;
let navigationUntil = 0;
let requestAfter = 0;

function schedule() {
  clearTimeout(timer);
  if (!pending.size) return;
  const wait = Math.max(0, requestAfter - performance.now(),
    lastScroll + 180 - performance.now(), navigationUntil - performance.now());
  timer = setTimeout(flush, Math.max(16, wait));
}

function flush() {
  if (!pending.size) return;
  const now = performance.now();
  if (now < requestAfter || now < navigationUntil || now - lastScroll < 180) {
    schedule();
    return;
  }
  // Also respect ScrollTrigger's own scrolling window, including its
  // automatic refreshes and scrollEnd handling.
  if (ScrollTrigger.isScrolling()) {
    timer = setTimeout(flush, 100);
    return;
  }
  pending.clear();
  ScrollTrigger.refresh();
}

function onScroll() {
  lastScroll = performance.now();
  if (pending.size) schedule();
}

export function beginSectionNavigation() {
  // Protect the interval before the browser emits its first smooth-scroll
  // event too. Subsequent events keep the refresh deferred until settled.
  navigationUntil = performance.now() + 350;
  if (pending.size) schedule();
}

export function createScrollRefresh() {
  const owner = {};
  owners.add(owner);
  if (owners.size === 1) window.addEventListener('scroll', onScroll, { passive: true });
  return {
    request() {
      if (!owners.has(owner)) return;
      pending.add(owner);
      requestAfter = performance.now() + 120;
      schedule();
    },
    dispose() {
      pending.delete(owner);
      owners.delete(owner);
      if (!owners.size) {
        clearTimeout(timer);
        window.removeEventListener('scroll', onScroll);
        lastScroll = -Infinity;
        navigationUntil = 0;
      } else schedule();
    },
  };
}

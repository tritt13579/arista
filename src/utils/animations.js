export function observeReveals(host, root) {
  if (
    "IntersectionObserver" in window &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    host.revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.remove("waiting");
            host.revealObserver.unobserve(entry.target);
          }
      },
      { threshold: 0.05 },
    );
    root.querySelectorAll(".reveal").forEach((item) => {
      item.classList.add("waiting");
      host.revealObserver.observe(item);
    });
  }
}

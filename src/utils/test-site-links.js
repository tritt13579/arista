// Keep preview navigation local to the Test Site without changing canonical URLs.
export function testSiteHref(href, currentHref) {
  try {
    const current = new URL(currentHref);
    if (current.searchParams.get('rc') !== 'test-site' || !href || href.startsWith('#')) return href;
    const target = new URL(href, current);
    if (!['http:', 'https:'].includes(target.protocol) || target.origin !== current.origin) return href;
    target.searchParams.set('rc', 'test-site');
    return `${target.pathname}${target.search}${target.hash}`;
  } catch { return href; }
}

export function preserveTestSiteLinks(root) {
  if (new URL(location.href).searchParams.get('rc') !== 'test-site') return () => {};
  const update = () => {
    root.querySelectorAll('a[href]').forEach(link => {
      const previous = link.getAttribute('href');
      const next = testSiteHref(previous, location.href);
      if (previous !== next) link.setAttribute('href', next);
    });
  };
  update();
  const observer = new MutationObserver(update);
  observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
  return () => observer.disconnect();
}

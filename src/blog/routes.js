const pathKey = path => path.replace(/\/+$/, '').split('/').map(decodeURIComponent).join('/');

// Use the public Wix category slug, rather than deriving a slug from its label.
// IDs remain a fallback for older payloads without public category URLs.
export function blogCategoryKey(category) {
  try {
    if (category?.url) return decodeURIComponent(new URL(category.url, 'https://arista.invalid').pathname.split('/').filter(Boolean).at(-1));
  } catch { /* Fall back to the stable ID. */ }
  return category?.id || '';
}

export function blogFilterHref(blogPath, category = '', page = 1, currentUrl = '') {
  const url = new URL(blogPath, 'https://arista.invalid');
  // Preserve testing and campaign parameters, never inherit another route/hash.
  try { url.search = new URL(currentUrl, url).search; } catch { /* No current URL. */ }
  url.searchParams.delete('category');
  url.searchParams.delete('page');
  if (category || page > 1) {
    url.searchParams.set('category', category);
    url.searchParams.set('page', String(page));
  }
  return `${url.pathname}${url.search}`;
}

// Resolve in Velo too: the same category is selected in SEO HTML and the browser.
export function withBlogRoute(data, currentUrl) {
  if (data.state !== 'ready' || data.post) return data;
  try {
    const current = new URL(currentUrl || data.paths.blog, 'https://arista.invalid');
    const path = pathKey(current.pathname);
    const blogPath = pathKey(data.paths.blog);
    const routeKind = path === blogPath ? 'list' : 'category';
    const rawPage = current.searchParams.get('page') || '1';
    const requestedPage = /^\d+$/.test(rawPage) && Number.isSafeInteger(Number(rawPage)) ? Math.max(1, Number(rawPage)) : 1;
    const route = { routeKind, routeUrl: `${current.pathname}${current.search}`, requestedPage };
    const key = path === blogPath ? current.searchParams.get('category') : '';
    if (path === blogPath && !key) return { ...data, ...route, activeCategoryId: '', categoryMissing: false };
    const category = key
      ? data.categories.find(item => item.id === key) || data.categories.find(item => blogCategoryKey(item) === key)
      : data.categories.find(item => item.url && pathKey(new URL(item.url, current).pathname) === path);
    return { ...data, ...route, activeCategoryId: category?.id || '', categoryMissing: !category };
  } catch {
    return { ...data, activeCategoryId: '', categoryMissing: true };
  }
}

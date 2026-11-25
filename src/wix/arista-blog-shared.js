// Build to Public/arista-blog-page.js. Never place this in masterPage.js.
import wixData from 'wix-data';
import wixLocationFrontend from 'wix-location-frontend';
import wixWindowFrontend from 'wix-window-frontend';
import { createBlogPayload, createBlogSeoMarkup } from '../blog/payload.js';
import { withBlogRoute, blogCategoryKey } from '../blog/routes.js';

async function readAll(query) {
  let result = await query.limit(100).find();
  const items = [...result.items];
  while (result.hasNext()) { result = await result.next(); items.push(...result.items); }
  return items;
}

export async function startBlog($w, { postPage = false, submitTrialRegistration }) {
  const element = $w('#aristaBlog');
  // IDs verified in this site's Editor; keep the app components for routing/fallback.
  const native = $w(postPage ? '#post1' : '#blog1');
  let payload = { state: 'loading' };
  const diagnostic = { version: 'blog-slug-route-6', postPage, stage: 'loading' };
  const report = () => element.setAttribute('data-arista-blog-debug', JSON.stringify(diagnostic));
  const send = () => {
    report();
    element.seoMarkup = createBlogSeoMarkup(payload);
    element.setAttribute('content', JSON.stringify(payload));
  };
  const nativeFallback = async error => {
    console.warn('ARISTA BLOG: native viewer retained.', error);
    diagnostic.stage = 'native-fallback';
    diagnostic.error = String(error?.message || error);
    report();
    payload = { state: 'error' };
    element.seoMarkup = '';
    await native.expand();
    await element.collapse();
  };
  element.on('arista-ready', send);
  let submitting = false;
  element.on('arista-registration-submit', async event => {
    const { requestId, values } = event.detail || {};
    if (typeof requestId !== 'string' || !requestId || requestId.length > 100) return;
    const reply = result => element.setAttribute('registration-result', JSON.stringify({ ...result, requestId }));
    if (submitting) { reply({ ok: false, message: 'Đăng ký trước vẫn đang được xử lý.' }); return; }
    submitting = true;
    try { reply(await submitTrialRegistration(values)); }
    catch { reply({ ok: false, message: 'Chưa nhận được xác nhận. Vui lòng thử lại hoặc liên hệ hotline.' }); }
    finally { submitting = false; }
  });
  send();
  try {
    const current = postPage ? await native.getPost() : null;
    if (postPage && !current?._id) throw new Error('Wix has not provided a current post.');
    const [posts, categories, settings, sections, programs, writers, currentPost] = await Promise.all([
      readAll(wixData.query('Blog/Posts').descending('publishedDate')),
      readAll(wixData.query('Blog/Categories')),
      readAll(wixData.query('AristaSiteSettings')),
      readAll(wixData.query('AristaPageContent')),
      readAll(wixData.query('AristaPrograms')),
      // Public profile data only. No elevated permissions and no private contact fields.
      readAll(wixData.query('Members/PublicData')).catch(() => []),
      current ? wixData.get('Blog/Posts', current._id) : null,
    ]);
    // Public routing fields only: distinguish an empty query from dropped URL records.
    console.info('ARISTA BLOG DATA', JSON.stringify({
      postCount: posts.length,
      posts: posts.map(post => ({ id: post._id, title: post.title,
        postPageURL: post.postPageURL, urlType: typeof post.postPageURL,
        fields: Object.keys(post).filter(key => /url|slug/i.test(key)) })),
    }));
    diagnostic.stage = 'data-read';
    diagnostic.postCount = posts.length;
    diagnostic.posts = posts.map(post => ({ id: post._id, title: post.title,
      postPageURL: post.postPageURL, urlType: typeof post.postPageURL,
      routeFields: Object.fromEntries(Object.entries(post).filter(([key]) => /url|slug/i.test(key))) }));
    report();
    if (settings.length !== 1) throw new Error('AristaSiteSettings requires exactly one record.');
    if (postPage && !currentPost) throw new Error('Current post is not available in public Blog/Posts.');
    // Prefer Wix's URL; /post/ prefix verified from the native feed on this site.
    if (currentPost && !currentPost.postPageURL) currentPost.postPageURL = current.postPageUrl;
    const allContent = createBlogPayload({ posts, currentPost, categories, writers, settings: settings[0], sections, programs,
      paths: { home: '/', blog: '/blog', registration: '/#registration', postBasePath: '/post/', categoryBasePath: '/blog/categories/' } });
    if (allContent.state !== 'ready') throw new Error(`Native post viewer required: ${allContent.unsupported.join(', ')}`);
    let renderedKind;
    let renderedMissing = false;
    const syncRoute = async () => {
      payload = withBlogRoute(allContent, wixLocationFrontend.url);
      if (payload.categoryMissing && payload.routeKind !== 'list') throw new Error('Native Blog routing required for this URL.');
      diagnostic.stage = 'ready';
      diagnostic.categoryId = payload.activeCategoryId || '';
      diagnostic.page = payload.requestedPage || 1;
      if (renderedKind === 'list' && payload.routeKind === 'list' && !renderedMissing && !payload.categoryMissing && !postPage) {
        report();
        element.seoMarkup = createBlogSeoMarkup(payload);
        element.setAttribute('blog-route', JSON.stringify({ routeKind: payload.routeKind,
          routeUrl: payload.routeUrl, activeCategoryId: payload.activeCategoryId,
          requestedPage: payload.requestedPage }));
      } else {
        send();
        await element.expand();
        await native.collapse();
      }
      renderedKind = payload.routeKind;
      renderedMissing = !!payload.categoryMissing;
    };
    await syncRoute();
    if (!postPage && wixWindowFrontend.rendering.env === 'browser') {
      wixLocationFrontend.onChange(() => syncRoute().catch(nativeFallback));
      element.on('arista-blog-filter-change', event => {
        const { categoryId, page } = event.detail || {};
        if (payload.routeKind !== 'list' || typeof categoryId !== 'string'
            || (categoryId && !allContent.categories.some(item => item.id === categoryId))
            || !Number.isSafeInteger(page) || page < 1) return;
        const category = blogCategoryKey(allContent.categories.find(item => item.id === categoryId));
        if (categoryId === (payload.activeCategoryId || '') && page === (payload.requestedPage || 1)) return;
        // Exactly one Wix URL operation per interaction. Never add then remove:
        // each call creates a history entry. Explicit page=1 resets pagination.
        if (!category && page === 1) wixLocationFrontend.queryParams.remove(['category', 'page']);
        else wixLocationFrontend.queryParams.add({ category, page: String(page) });
      });
    }

  } catch (error) {
    // Do not hide content we cannot render. Preserve Wix's native rich-content viewer.
    await nativeFallback(error);
  }
}

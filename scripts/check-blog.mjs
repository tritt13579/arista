import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createBlogPayload, createBlogSeoMarkup } from '../src/blog/payload.js';
import { safeBlogUrl, normalizeBlogPost, resolveBlogPostUrl, resolveBlogCategoryUrl } from '../src/blog/content.js';
import { withBlogRoute, blogFilterHref, blogCategoryKey } from '../src/blog/routes.js';
import { richContentToHtml } from '../src/blog/rich-content.js';
import { imageUrl } from '../src/utils/image-url.js';
import { listResults, categoryLinks } from '../src/blog/view.js';
import { homeHeaderMenu } from '../src/sections/header.js';
const text = value => ({ type: 'TEXT', textData: { text: value } });
const paragraph = value => ({ type: 'PARAGRAPH', nodes: [text(value)] });
const settings = { brandName: 'Arista Music Center', logo: 'https://example.com/logo.png' };
const categories = [{ _id: 'piano', label: 'Piano' }, { _id: 'practice', label: 'Luyện tập' }];
const writers = [{ _id: 'brand', nickname: settings.brandName }];
const paths = { home: '/', piano: '/bo-mon/piano', blog: '/blog', registration: '/#registration' };
const headerItems = homeHeaderMenu([{ title: 'Chương trình', target: 'programs' }, { title: 'Hỏi đáp', target: 'faq' }]);
assert.equal(headerItems.at(-2).target, 'faq');
assert.deepEqual(headerItems.at(-1), { title: 'Góc học nhạc', href: '/blog' });
assert.equal(homeHeaderMenu(headerItems).filter(item => item.href === '/blog').length, 1);
const record = {
  _id: 'one', title: '<script>unsafe</script>', excerpt: 'Bài học', postPageURL: '/post/real-wix-url',
  categories: ['piano'], author: 'brand', publishedDate: '2026-11-22T00:00:00Z', timeToRead: 3,
  richContent: { nodes: [paragraph('Mở đầu'), { type: 'HEADING', headingData: { level: 2 }, nodes: [text('Tiêu đề')] },
    paragraph('Nội dung <img src=x onerror=alert(1)>'),
    { type: 'IMAGE', imageData: { image: { src: { id: 'asset.jpg' }, width: 100, height: 100 }, altText: 'Ảnh "đàn"' } },
    { type: 'TABLE', nodes: [{ type: 'TABLE_ROW', nodes: [{ type: 'TABLE_CELL', nodes: [paragraph('Ô dữ liệu')] }] }] },
    { type: 'VIDEO', videoData: { video: { src: { url: 'https://youtu.be/jNQXAC9IVRw' } }, title: 'Hướng dẫn' } },
  ] },
};
const payload = createBlogPayload({ posts: [record], currentPost: record, categories, writers, settings, paths });
const { testSiteHref } = await import('../src/utils/test-site-links.js');
const testPage = 'https://www.aristamusiccenter.com/blog?rc=test-site';
assert.equal(testSiteHref('/post/piano', testPage), '/post/piano?rc=test-site');
assert.equal(testSiteHref('/?other=1#registration', testPage), '/?other=1&rc=test-site#registration');
assert.equal(testSiteHref('/blog?rc=test-site', testPage), '/blog?rc=test-site');
assert.equal(testSiteHref('https://www.aristamusiccenter.com/bo-mon/piano', testPage), '/bo-mon/piano?rc=test-site');
for (const target of ['#blog-section-1', 'tel:0824000219', 'https://zalo.me/0935672244', 'https://example.com/blog']) {
  assert.equal(testSiteHref(target, testPage), target);
}
assert.equal(testSiteHref('/post/piano', 'https://www.aristamusiccenter.com/blog'), '/post/piano');
const withContacts = createBlogPayload({ posts: [record], categories, writers, settings: { ...settings, primaryPhone: '0935672244', callButtonText: 'Gọi' }, paths });
assert.equal(withContacts.contacts.phone, '0935672244');
assert.equal(payload.state, 'ready');
const sitePrograms = JSON.parse(fs.readFileSync('cms/content.json', 'utf8')).AristaPrograms;
for (const program of sitePrograms) {
  const subjectCategories = [{ _id: 'subject', label: program.title }];
  const subjectPost = { ...record, categories: ['subject'] };
  const subjectPayload = createBlogPayload({ posts: [subjectPost], currentPost: subjectPost, categories: subjectCategories, programs: sitePrograms, writers, settings, paths });
  assert.deepEqual(subjectPayload.post.relatedProgram, { title: program.title, url: program.detailUrl });
  const markup = createBlogSeoMarkup(subjectPayload);
  assert.ok(markup.includes(`Tìm hiểu lớp ${program.title}`));
  assert.ok(!markup.split('</header>')[0].includes('Lớp Piano'));
}
assert.equal(payload.post.relatedProgram, null);
const generalPayload = createBlogPayload({ currentPost: { ...record, categories: ['practice'] }, categories, programs: sitePrograms, writers, settings, paths });
assert.equal(generalPayload.post.relatedProgram, null);
assert.ok(!createBlogSeoMarkup(generalPayload).includes('class="sidebar-link"'));
const multiplePayload = createBlogPayload({ currentPost: { ...record, categories: ['p', 'v'] }, categories: [{ _id: 'p', label: 'Piano' }, { _id: 'v', label: 'Violin' }], programs: sitePrograms, writers, settings, paths });
assert.equal(multiplePayload.post.relatedProgram, null);
for (const mainCategory of ['v', { _id: 'v' }]) {
  const mainPayload = createBlogPayload({ currentPost: { ...record, categories: ['p', 'v'], mainCategory }, categories: [{ _id: 'p', label: 'Piano' }, { _id: 'v', label: 'Violin' }], programs: sitePrograms, writers, settings, paths });
  assert.deepEqual(mainPayload.post.relatedProgram, { title: 'Violin', url: '/bo-mon/violin' });
  assert.equal(mainPayload.post.category, 'Violin');
  assert.ok(createBlogSeoMarkup(mainPayload).includes('Tìm hiểu lớp Violin'));
  const linkedCategories = categoryLinks(mainPayload.post, '/blog');
  assert.ok(linkedCategories.indexOf('Violin') < linkedCategories.indexOf('Piano'));
  assert.ok(linkedCategories.includes('/blog?category=v'));
  assert.equal(listResults({ ...mainPayload, posts: [mainPayload.post] }, 'p').count, 1);
  assert.equal(listResults({ ...mainPayload, posts: [mainPayload.post] }, 'v').count, 1);
}
const manyCategories = { url: '/post/test', categories: ['Piano', 'Violin', 'Guitar'].map((label, i) => ({ id: String(i), label })) };
const compactCategories = categoryLinks(manyCategories, '/blog', true);
assert.ok(compactCategories.includes('Piano') && compactCategories.includes('Violin'));
assert.ok(!compactCategories.includes('Guitar') && compactCategories.includes('>+1</a>'));
assert.ok(compactCategories.includes('/post/test#article-categories'));
assert.ok(categoryLinks(manyCategories, '/blog').includes('Guitar'));
const invalidMain = createBlogPayload({ currentPost: { ...record, categories: ['p', 'v'], mainCategory: 'absent' }, categories: [{ _id: 'p', label: 'Piano' }, { _id: 'v', label: 'Violin' }], programs: sitePrograms, writers, settings, paths });
assert.equal(invalidMain.post.relatedProgram, null);
assert.equal(payload.post.url, '/post/real-wix-url');
assert.equal(payload.post.avatar.type, 'logo');
assert.equal(payload.post.sections.length, 2);
const captioned = structuredClone(record);
captioned.richContent.nodes.find(node => node.type === 'IMAGE').nodes = [
  { type: 'CAPTION', nodes: [paragraph('Chú thích <ảnh> & nội dung')] }
];
const captionPayload = createBlogPayload({ posts: [captioned], currentPost: captioned, categories, writers, settings, paths });
assert.equal(captionPayload.state, 'ready');
const captionMarkup = createBlogSeoMarkup(captionPayload);
assert.ok(captionMarkup.includes('<figure class="article-figure"><img'));
assert.ok(captionMarkup.includes('<figcaption><p>Chú thích &lt;ảnh&gt; &amp; nội dung</p></figcaption>'));
const seo = createBlogSeoMarkup(payload);
assert.equal((seo.match(/<h1>/g) || []).length, 1);
assert.ok(seo.includes('Nội dung &lt;img'));
assert.ok(seo.includes('<table>') && seo.includes('youtube-nocookie.com/embed/jNQXAC9IVRw'));
assert.ok(!seo.includes('<script>'));
assert.equal(safeBlogUrl('javascript:alert(1)'), '');
assert.equal(safeBlogUrl('//evil.example'), '');
assert.equal(safeBlogUrl('/\\evil.example'), '');
assert.equal(safeBlogUrl('/post/valid?x=1'), '/post/valid?x=1');
assert.equal(resolveBlogPostUrl({ postPageUrl: '/post/wix-url' }), '/post/wix-url');
const observedRecord = { ...record, postPageURL: undefined, postPageUrl: '/unknown', slug: 'nguoi-moi-hoc-piano-nen-bat-dau-tu-dau' };
const repaired = createBlogPayload({ posts: [observedRecord], settings, paths: { ...paths, postBasePath: '/post/' } });
assert.equal(repaired.posts.length, 1);
assert.equal(repaired.posts[0].url, '/post/nguoi-moi-hoc-piano-nen-bat-dau-tu-dau');
assert.equal(resolveBlogPostUrl({ postPageUrl: '/unknown', slug: 'piano' }), '');
assert.equal(resolveBlogPostUrl({ slug: '../bad' }, '/post/'), '');
assert.equal(resolveBlogPostUrl({ slug: 'piano?x=1' }, '/post/'), '');
assert.equal(resolveBlogPostUrl({ slug: 'học-piano' }, '/post/'), '/post/h%E1%BB%8Dc-piano');
const badLink = { nodes: [{ type: 'PARAGRAPH', nodes: [{ type: 'TEXT', textData: { text: 'click', decorations: [{ type: 'LINK', linkData: { link: { url: 'javascript:alert(1)' } } }] } }] }] };
assert.equal(richContentToHtml(badLink, imageUrl), '<p>click</p>');
const pianoLink = url => ({ nodes: [{ type: 'PARAGRAPH', nodes: [{ type: 'TEXT', textData: {
  text: 'lớp Piano tại Arista', decorations: [{ type: 'UNDERLINE' }, { type: 'LINK', linkData: { link: { url, target: 'TOP' } } }]
} }] }] });
for (const url of ['/bo-mon/piano', 'https://www.aristamusiccenter.com/bo-mon/piano']) {
  assert.ok(richContentToHtml(pianoLink(url), imageUrl).includes(`<a href="${url}"`));
  assert.ok(!richContentToHtml(pianoLink(url), imageUrl).includes('<u>'));
}
const underlinedText = { nodes: [{ type: 'TEXT', textData: { text: 'Nhấn mạnh', decorations: [{ type: 'UNDERLINE' }] } }] };
assert.equal(richContentToHtml(underlinedText, imageUrl), '<u>Nhấn mạnh</u>');
for (const url of ['//evil.example/path', '/\\evil.example', '/\nevil.example', 'javascript:alert(1)']) {
  assert.ok(!richContentToHtml(pianoLink(url), imageUrl).includes('<a '));
}
const unsupported = createBlogPayload({ currentPost: { ...record, richContent: { nodes: [{ type: 'HTML', htmlData: { html: '<script>alert(1)</script>' } }] } }, settings, paths });
assert.equal(unsupported.state, 'unsupported');
assert.equal(createBlogSeoMarkup(unsupported), '');
assert.equal(createBlogPayload({ currentPost: { ...record, richContent: undefined }, settings, paths }).state, 'unsupported');
assert.equal(createBlogPayload({ currentPost: { ...record, richContent: { nodes: [{ type: 'VIDEO', videoData: { video: { src: { id: 'private-video' } } } }] } }, settings, paths }).state, 'unsupported');
assert.equal(normalizeBlogPost({ ...record, publishedDate: 'bad' }).date, '');
assert.equal(normalizeBlogPost(record, categories, [{ _id: 'brand', nickname: 'Một tác giả', profilePhoto: 'https://example.com/photo.jpg' }], settings).avatar.type, 'photo');
assert.equal(normalizeBlogPost(record).avatar.type, 'initials');
const list = createBlogPayload({ posts: Array.from({ length: 25 }, (_, i) => ({ ...record, _id: String(i), title: `Bài ${i}`, postPageURL: `/post/${i}`, categories: i % 2 ? ['practice'] : ['piano'] })), categories, writers, settings, paths });
assert.equal((listResults(list).html.match(/class="post-card /g) || []).length, 12);
assert.equal((listResults(list, '', 3).html.match(/class="post-card /g) || []).length, 1);
assert.ok(!listResults(list, 'piano').html.includes('featured-card'));
assert.equal(listResults(list, 'piano').count, 13);
assert.equal(listResults(list, 'missing').count, 0);

// Reproduce the live regression: a Violin URL must not show the Piano feed,
// including the SEO HTML generated before the custom element runs.
const routedCategories = [
  { _id: 'piano', label: 'Piano', slug: 'piano', description: 'Hướng dẫn Piano <Arista>' },
  { _id: 'violin', label: 'Violin', categoryPageUrl: 'https://www.aristamusiccenter.com/blog/categories/violin' },
  { _id: 'art', label: 'Mỹ thuật', categoryPageSlug: 'my-thuat' },
];
const routed = createBlogPayload({ posts: [{ ...record, title: 'Bài chỉ thuộc Piano' }],
  currentPost: null, categories: routedCategories, settings, paths: { ...paths, categoryBasePath: '/blog/categories/' } });
const allRoute = withBlogRoute(routed, 'https://www.aristamusiccenter.com/blog');
assert.equal(allRoute.activeCategoryId, '');
assert.equal(listResults(allRoute).count, 1);
for (const url of ['/blog/categories/piano', '/blog/categories/piano/', '/blog?category=piano', '/blog/categories/piano?rc=test-site']) {
  const selected = withBlogRoute(routed, url);
  assert.equal(selected.activeCategoryId, 'piano');
  const markup = createBlogSeoMarkup(selected);
  assert.ok(markup.includes(url.startsWith('/blog?') ? 'Góc <em>học nhạc.</em>' : 'Kiến thức <em>Piano.</em>'));
  if (!url.startsWith('/blog?')) assert.ok(markup.includes('Hướng dẫn Piano &lt;Arista&gt;'));
  assert.ok(markup.includes('data-category="piano" aria-current="page"'));
  assert.ok(!markup.includes('featured-card'));
  assert.ok(markup.includes('data-category=""'));
}
const violinMarkup = createBlogSeoMarkup(withBlogRoute(routed, '/blog/categories/violin'));
assert.ok(violinMarkup.includes('Kiến thức <em>Violin.</em>'));
assert.ok(violinMarkup.includes('Chưa có bài viết trong chuyên mục này.'));
assert.ok(!violinMarkup.includes('Bài chỉ thuộc Piano'));
for (const url of ['/blog/categories/missing', '/blog/categories/%zz', '/blog/tags/piano', '/blog?category=missing']) {
  const missing = withBlogRoute(routed, url);
  assert.equal(missing.categoryMissing, true);
  assert.ok(!createBlogSeoMarkup(missing).includes('Bài chỉ thuộc Piano'));
}
assert.equal(withBlogRoute(payload, '/blog/categories/violin').post.id, payload.post.id);
assert.ok(categoryLinks(routed.posts[0], '/blog').includes('href="/blog?category=piano&amp;page=1"'));
assert.equal(resolveBlogCategoryUrl({ categoryPageUrl: '/blog/categories/piano?x=1' }), '/blog/categories/piano');
assert.equal(resolveBlogCategoryUrl({ categoryPageUrl: '/unknown', slug: 'piano' }), '/blog/categories/piano');
assert.equal(resolveBlogCategoryUrl({ categoryPageSlug: 'my-thuat' }), '/blog/categories/my-thuat');
for (const slug of ['../bad', '..', '%bad?x=1', 'bad#hash', 'bad\\path', 'bad\npath']) {
  assert.equal(resolveBlogCategoryUrl({ slug }), '');
}
assert.throws(() => createBlogPayload({ settings, paths: { ...paths, categoryBasePath: '/blog/categories/' },
  categories: [{ _id: 'missing', label: 'Missing URL' }] }), /categories.*categoryPageUrl/);
assert.throws(() => createBlogPayload({ posts: [{ ...record, postPageURL: '' }], settings, paths }), /postPageURL/);
const source = fs.readFileSync('src/wix/arista-blog-shared.js', 'utf8');
assert.ok(source.includes("wixData.get('Blog/Posts', current._id)"));
assert.ok(!source.includes('suppressAuth') && !source.includes('draftPosts'));
assert.ok(source.includes("'#post1' : '#blog1'"));
assert.ok(source.includes('wixLocationFrontend.onChange'));
assert.ok(source.includes('withBlogRoute(allContent, wixLocationFrontend.url)'));
for (const file of ['dist/arista-blog.js', 'dist/arista-blog-page.js']) {
  const output = fs.readFileSync(file, 'utf8');
  assert.ok(!output.includes('src/preview/blog-content') && !output.includes('cms/content.json'));
}
console.info('Blog checks passed: public data, escaped rich content, native fallback, URLs, avatars, pagination, SEO and production isolation.');

assert.equal(blogFilterHref('/blog', 'violin', 1, '/blog?category=piano&page=2&rc=test-site&utm_source=fb'), '/blog?rc=test-site&utm_source=fb&category=violin&page=1');
assert.equal(blogFilterHref('/blog', '', 1, '/blog?category=piano&page=2&rc=test-site'), '/blog?rc=test-site');
assert.equal(blogFilterHref('/blog', '', 2), '/blog?category=&page=2');
for (const page of ['bad', '-3', 'Infinity', '0', '999999999999999999999']) {
  assert.equal(withBlogRoute(routed, `/blog?category=piano&page=${page}`).requestedPage, 1);
}
const pageTwo = withBlogRoute(list, '/blog?category=piano&page=2');
assert.equal(pageTwo.requestedPage, 2);
assert.equal(pageTwo.routeKind, 'list');
assert.equal((createBlogSeoMarkup(pageTwo).match(/class="post-card /g) || []).length, 1);
assert.equal(listResults(list, 'piano', 999).page, 2);
assert.equal(withBlogRoute(routed, '/blog/categories/piano').routeKind, 'category');

// Slugs differ from IDs: URL generation and old links must select the same feed.
const slugData = { ...routed, categories: [
  { id: 'uuid-piano', label: 'Đổi tên vẫn giữ slug', url: '/blog/categories/piano' },
  { id: 'uuid-art', label: 'Mỹ thuật', url: '/blog/categories/my-thuat' },
  { id: 'uuid-vi', label: 'Tiếng Việt', url: '/blog/categories/h%E1%BB%8Dc-nh%E1%BA%A1c' },
] };
for (const key of ['uuid-piano', 'piano']) {
  const resolved = withBlogRoute(slugData, `/blog?category=${key}&page=2`);
  assert.equal(resolved.activeCategoryId, 'uuid-piano');
  assert.equal(resolved.requestedPage, 2);
  assert.equal(resolved.categoryMissing, false);
}
assert.equal(withBlogRoute(slugData, '/blog?category=my-thuat').activeCategoryId, 'uuid-art');
assert.equal(withBlogRoute(slugData, '/blog?category=h%E1%BB%8Dc-nh%E1%BA%A1c').activeCategoryId, 'uuid-vi');
assert.equal(blogCategoryKey(slugData.categories[0]), 'piano');
assert.equal(blogCategoryKey({id:'legacy-id'}), 'legacy-id');
const slugMarkup = createBlogSeoMarkup(withBlogRoute(slugData, '/blog'));
assert.ok(slugMarkup.includes('href="/blog?category=piano&amp;page=1" data-category="uuid-piano"'));
assert.ok(!slugMarkup.includes('category=uuid-piano'));
assert.ok(categoryLinks({categories:slugData.categories}, '/blog').includes('category=my-thuat&amp;page=1'));

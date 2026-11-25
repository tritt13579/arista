import { escapeHtml as e } from './rich-content.js';
import { safeBlogUrl, postBodyMarkup } from './content.js';
const href = value => e(safeBlogUrl(value));
export const PAGE_SIZE = 12;

export function categoryLinks(post, blogPath, compact = false) {
  const categories = post.categories || [];
  const visible = compact ? categories.slice(0, 2) : categories;
  if (!visible.length) return '';
  const links = visible.map(item => `<a href="${href(`${blogPath}?category=${encodeURIComponent(item.id)}`)}">${e(item.label)}</a>`);
  if (compact && categories.length > 2) links.push(`<a class="category-more" href="${href(post.url)}#article-categories" aria-label="Xem tất cả ${categories.length} chuyên mục">+${categories.length - 2}</a>`);
  return `<span class="category-links ${compact ? 'category-links--compact' : ''}" aria-label="Chuyên mục">${links.join('')}</span>`;
}

export function blogAvatar(post) {
  const kind = ['logo', 'photo'].includes(post.avatar?.type) && post.avatar.src ? post.avatar.type : 'initials';
  const initials = post.author.trim().split(/\s+/).slice(0, 2).map(word => Array.from(word)[0] || '').join('').toLocaleUpperCase('vi');
  return `<span class="author-mark author-mark--${kind}" aria-hidden="true">${kind === 'initials' ? e(initials) : `<img src="${e(post.avatar.src)}" alt="" width="36" height="36">`}</span>`;
}

export function blogCard(post, featured = false, blogPath = '/blog') {
  const level = featured ? 2 : 3;
  return `<article class="post-card ${featured ? 'featured-card' : ''}">
    <a class="card-image" href="${href(post.url)}" tabindex="-1" aria-hidden="true">${post.image ? `<img src="${e(post.image)}" alt="" loading="${featured ? 'eager' : 'lazy'}">` : '<span class="missing-cover">Arista · Góc học nhạc</span>'}<span class="image-arrow">↗</span></a>
    <div class="card-copy"><div class="post-meta">${categoryLinks(post, blogPath, true)}<span class="reading-time">${post.minutes} phút đọc</span></div>
    <h${level}><a href="${href(post.url)}">${e(post.title)}</a></h${level}><p>${e(post.excerpt)}</p>
    <a class="text-link" href="${href(post.url)}">Đọc bài viết <span aria-hidden="true">↗</span></a></div></article>`;
}

export function listResults(data, category = '', page = 1) {
  const filtered = data.posts.filter(post => !category || post.categories.some(item => item.id === category));
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.max(1, Math.min(pages, page));
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  if (!visible.length) return { count: 0, html: '<p class="blog-empty" role="status">Chưa có bài viết trong chuyên mục này.</p>' };
  const featured = !category && current === 1;
  const chosen = featured ? visible.find(post => post.featured) || visible[0] : null;
  const rest = visible.filter(post => post !== chosen);
  const html = `${chosen ? blogCard(chosen, true, data.paths.blog) : ''}${rest.length ? `<div class="post-grid ${chosen ? '' : 'category-grid'}">${rest.map(post => blogCard(post, false, data.paths.blog)).join('')}</div>` : ''}
    ${pages > 1 ? `<nav class="blog-pagination" aria-label="Trang bài viết">${Array.from({ length: pages }, (_, i) => `<button type="button" data-blog-page="${i + 1}" ${current === i + 1 ? 'aria-current="page"' : ''}>${i + 1}</button>`).join('')}</nav>` : ''}`;
  return { count: filtered.length, html };
}

export function renderBlogMarkup(data) {
  if (data.state !== 'ready') return `<p role="status">${data.state === 'error' ? 'Chưa tải được bài viết. Vui lòng tải lại trang.' : 'Đang tải Góc học nhạc…'}</p>`;
  const paths = data.paths;
  const brand = data.logo ? `<img src="${e(data.logo)}" alt="${e(data.brandName)}" width="100" height="60">` : e(data.brandName);
  const navigation = `<a href="${href(paths.home)}">Về Arista</a><a href="${href(paths.blog)}" ${data.post ? '' : 'aria-current="page"'}>Góc học nhạc</a>`;
  const header = `<header class="blog-header"><div class="header-wrap"><a class="brand" href="${href(paths.home)}">${brand}</a><nav class="desktop-nav" aria-label="Điều hướng chính">${navigation}</nav><a class="header-contact" href="${href(paths.registration)}" data-registration>Đăng ký tư vấn ↗</a><button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="blog-mobile-menu"><span></span><span></span></button></div><nav id="blog-mobile-menu" class="mobile-links" hidden>${navigation}<a href="${href(paths.registration)}" data-registration>Đăng ký tư vấn ↗</a></nav></header>`;
  if (!data.post) {
    const result = listResults(data);
    return `${header}<main id="blog-main"><section class="journal-hero"><div class="container hero-grid"><div><p class="eyebrow">CHIA SẺ TỪ ARISTA</p><h1>Góc <em>học nhạc.</em></h1></div><p class="hero-description">Một chút kiến thức, một nguồn cảm hứng.<br>Cùng bạn đi xa hơn trên hành trình âm nhạc.</p></div></section><section class="journal-content container" aria-label="Bài viết"><div class="filter-bar"><div class="filters" role="group" aria-label="Lọc chuyên mục"><button type="button" data-category="" aria-pressed="true">Tất cả</button>${data.categories.map(item => `<button type="button" data-category="${e(item.id)}" aria-pressed="false">${e(item.label)}</button>`).join('')}</div><p class="result-count" aria-live="polite">${result.count} bài viết</p></div><div id="post-results">${result.html}</div></section></main>`;
  }
  const post = data.post;
  const date = post.date ? `<span>·</span><time datetime="${e(post.date)}">${new Date(post.date).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</time>` : '';
  const headings = post.sections.filter(section => section.title);
  const related = data.posts.filter(item => item.id !== post.id).sort((a, b) => Number(b.categories.some(c => post.categories.some(p => p.id === c.id))) - Number(a.categories.some(c => post.categories.some(p => p.id === c.id)))).slice(0, 2);
  return `${header}<main id="blog-main"><section class="article-hero container"><nav class="breadcrumbs" aria-label="Đường dẫn"><a href="${href(paths.home)}">Arista</a><span>/</span><a href="${href(paths.blog)}">Góc học nhạc</a><span>/</span><span>${e(post.category)}</span></nav><div class="article-heading"><div class="article-category-heading">${categoryLinks(post, paths.blog)}</div><h1>${e(post.title)}</h1><div class="byline">${blogAvatar(post)}<span>${e(post.author)}</span>${date}<span>·</span><span>${post.minutes} phút đọc</span></div></div>${post.image ? `<figure class="article-cover"><img src="${e(post.image)}" alt="${e(post.title)}" fetchpriority="high"></figure>` : ''}</section>
    <div class="reading-layout container"><aside class="article-sidebar">${headings.length ? `<details class="toc" open><summary>Trong bài viết</summary><nav aria-label="Mục lục">${headings.map(section => `<a href="#${e(section.id)}" data-toc="${e(section.id)}">${e(section.title)}</a>`).join('')}</nav></details>` : ''}${post.relatedProgram ? `<a class="sidebar-link" href="${href(post.relatedProgram.url)}"><span>HỌC CÙNG ARISTA</span><span class="sidebar-link-label"><span>Tìm hiểu lớp ${e(post.relatedProgram.title)}</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17 17 7M7 7h10v10"/></svg></span></a>` : ''}</aside><article class="article-body" aria-label="Nội dung bài viết">${postBodyMarkup(post)}${post.categories.length ? `<nav id="article-categories" class="article-categories" aria-label="Các chuyên mục của bài viết"><span>Chuyên mục</span>${categoryLinks(post, paths.blog)}</nav>` : ''}<div class="article-end"><a href="${href(paths.blog)}">← Về Góc học nhạc</a><button type="button" id="copy-article"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg><span>Sao chép liên kết</span></button><span id="share-status" role="status"></span></div></article></div>
    ${related.length ? `<section class="related-posts container"><div class="section-heading"><div><p class="eyebrow">ĐỌC THÊM MỘT CHÚT</p><h2>Tiếp nối <em>cảm hứng.</em></h2></div><a class="text-link" href="${href(paths.blog)}">Tất cả bài viết ↗</a></div><div class="post-grid">${related.map(item => blogCard(item, false, paths.blog)).join('')}</div></section>` : ''}</main>`;
}

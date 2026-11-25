import { imageUrl } from '../utils/image-url.js';
import { richContentToHtml, richContentToText, escapeHtml, imageValue } from './rich-content.js';

export function safeBlogUrl(value) {
  const url = String(value || '').trim();
  if (/[\u0000-\u0020\\]/.test(url)) return '';
  return /^\/(?!\/)/.test(url) || /^https:\/\//i.test(url) ? url : '';
}

export function resolveBlogPostUrl(raw, postBasePath = '') {
  for (const value of [raw.postPageURL, raw.postPageUrl]) {
    const candidate = safeBlogUrl(value);
    if (candidate && !/^\/unknown(?:[/?#]|$)/i.test(candidate)) return candidate;
  }
  // Configure the prefix only after verifying this site's native Blog link.
  const slug = typeof raw.slug === 'string' ? raw.slug.trim() : '';
  if (!/^\/(?!\/)[\w/-]+\/$/.test(postBasePath) || !slug ||
      /[\u0000-\u0020/\\?#]/.test(slug) || ['.', '..'].includes(slug)) return '';
  return `${postBasePath}${encodeURIComponent(slug)}`;
}
const supported = new Set(['TEXT', 'PARAGRAPH', 'HEADING', 'BULLETED_LIST', 'ORDERED_LIST',
  'LIST_ITEM', 'BLOCKQUOTE', 'CODE_BLOCK', 'DIVIDER', 'TABLE', 'TABLE_ROW', 'TABLE_CELL', 'IMAGE', 'CAPTION', 'GALLERY', 'VIDEO']);

export function unsupportedBlocks(content) {
  const missing = new Set();
  const visit = node => {
    if (!supported.has(node?.type)) missing.add(node?.type || 'UNKNOWN');
    // Uploaded Wix video needs the native viewer; external videos remain explicit links.
    if (node?.type === 'VIDEO' && !/^https:\/\//i.test(node.videoData?.video?.src?.url || '')) missing.add('WIX_VIDEO');
    if (node?.type === 'IMAGE' && !imageUrl(imageValue(node.imageData?.image))) missing.add('IMAGE_SOURCE');
    (Array.isArray(node?.nodes) ? node.nodes : []).forEach(visit);
  };
  (content?.nodes || []).forEach(visit);
  return [...missing];
}

// Accept only Blog/Posts public records, never drafts or elevated backend results.
export function normalizeBlogPost(raw, categories = [], writers = [], settings = {}, detail = false, paths = {}) {
  const ids = (raw.categories || []).map(item => typeof item === 'string' ? item : item?._id).filter(Boolean);
  const mainCategoryId = typeof raw.mainCategory === 'string' ? raw.mainCategory : raw.mainCategory?._id;
  const labels = categories.filter(item => ids.includes(item._id))
    .sort((a, b) => Number(b._id === mainCategoryId) - Number(a._id === mainCategoryId));
  const writerId = typeof raw.author === 'string' ? raw.author : raw.author?._id;
  const writer = writers.find(item => item._id === writerId);
  const author = writer?.nickname || 'Tác giả';
  const avatar = imageUrl(writer?.profilePhoto);
  const logo = imageUrl(settings.logo);
  const isBrand = author === settings.brandName;
  const body = raw.richContent;
  const date = new Date(raw.publishedDate || '');
  const unsupported = detail ? unsupportedBlocks(body) : [];
  if (detail && !Array.isArray(body?.nodes)) unsupported.push('MISSING_RICH_CONTENT');
  const sections = [];
  if (detail && !unsupported.length) {
    for (const node of body.nodes) {
      if (node.type === 'HEADING' && Number(node.headingData?.level || 2) <= 2) {
        sections.push({ id: `blog-section-${sections.length + 1}`, title: richContentToText({ nodes: [node] }), body: '' });
      } else {
        if (!sections.length) sections.push({ id: 'blog-introduction', title: '', body: '' });
        sections.at(-1).body += richContentToHtml({ nodes: [node] }, imageUrl);
      }
    }
  }
  return {
    id: String(raw._id || ''), title: String(raw.title || ''), excerpt: String(raw.excerpt || ''),
    url: resolveBlogPostUrl(raw, paths.postBasePath), image: imageUrl(raw.coverImage),
    categories: labels.map(item => ({ id: item._id, label: String(item.label || '') })),
    mainCategoryId: labels.some(item => item._id === mainCategoryId) ? mainCategoryId : '',
    category: String(labels[0]?.label || 'Góc học nhạc'), author,
    avatar: avatar ? { type: isBrand ? 'logo' : 'photo', src: avatar }
      : isBrand && logo ? { type: 'logo', src: logo } : { type: 'initials' },
    date: Number.isFinite(date.getTime()) ? date.toISOString() : '',
    minutes: Math.max(1, Math.round(Number(raw.timeToRead) || Math.ceil(String(raw.plainContent || '').split(/\s+/).length / 220))),
    featured: raw.featured === true || raw.pinned === true,
    sections, unsupported,
  };
}

export function postBodyMarkup(post) {
  return post.sections.map(section => `<section id="${escapeHtml(section.id)}">${section.title ? `<h2>${escapeHtml(section.title)}</h2>` : ''}${section.body}</section>`).join('');
}

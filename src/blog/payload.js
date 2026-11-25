import { createHomeContent } from '../content/home-content.js';
import { imageUrl } from '../utils/image-url.js';
import { normalizeBlogPost } from './content.js';
import { renderBlogMarkup } from './view.js';
import { createHomeSeoMarkup } from '../seo/markup.js';
import { safeBlogUrl, resolveBlogCategoryUrl } from './content.js';

function relatedProgram(post, programs) {
  const key = value => String(value || '').normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi');
  const matches = post.categories.flatMap(category => {
    const program = programs.find(item => item.show === true && key(item.title) === key(category.label));
    const url = safeBlogUrl(program?.detailUrl);
    return program && /^\/bo-mon\/[^/?#]+$/.test(url)
      ? [{ categoryId: category.id, title: String(program.title), url }] : [];
  });
  const chosen = matches.find(item => item.categoryId === post.mainCategoryId)
    || (matches.length === 1 ? matches[0] : null);
  return chosen ? { title: chosen.title, url: chosen.url } : null;
}

export function createBlogPayload({ posts = [], currentPost = null, categories = [], writers = [], settings, sections = [], programs = [], paths }) {
  if (!settings || !paths?.blog || !paths?.home || !paths?.registration) throw new Error('Missing blog site configuration.');
  const home = createHomeContent(settings, sections, [], [], programs);
  const normalized = posts.map(post => normalizeBlogPost(post, categories, writers, settings, false, paths)).filter(post => post.url);
  // A missing route is an integration error, not an empty blog. Retain native feed.
  if (normalized.length !== posts.length) throw new Error('Some public posts are missing a usable postPageURL.');
  const post = currentPost ? normalizeBlogPost(currentPost, categories, writers, settings, true, paths) : null;
  if (post?.unsupported.length) return { state: 'unsupported', unsupported: post.unsupported };
  if (post) post.relatedProgram = relatedProgram(post, programs);
  const publicCategories = categories.map(item => ({ id: String(item._id), label: String(item.label || ''),
    description: String(item.description || ''),
    url: resolveBlogCategoryUrl(item, paths.categoryBasePath || `${paths.blog}/categories/`) }));
  if (paths.categoryBasePath && publicCategories.some(item => !item.url)) {
    throw new Error('Some public categories are missing a usable categoryPageUrl or slug.');
  }
  return {
    state: 'ready', posts: normalized, post,
    categories: publicCategories,
    brandName: settings.brandName || 'Arista Music Center', logo: imageUrl(settings.logo),
    paths, contacts: home.contacts, registration: home.registration, footer: home.footer,
  };
}

// One generated view is used for both browser rendering and bot fallback HTML.
export function createBlogSeoMarkup(payload) {
  if (payload?.state !== 'ready') return '';
  return renderBlogMarkup(payload) + createHomeSeoMarkup({ state: 'ready', registration: payload.registration, footer: payload.footer });
}

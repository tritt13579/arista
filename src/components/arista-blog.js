import blogStyles from '../styles/blog-preview.css';
import baseStyles from '../styles/base.css';
import sectionStyles from '../styles/sections.css';
import registrationStyles from '../styles/registration.css';
import footerStyles from '../styles/footer.css';
import responsiveStyles from '../styles/responsive.css';
import { renderBlogMarkup, listResults, blogAvatar } from '../blog/view.js';
import { renderRegistration } from '../sections/registration.js';
import { renderFooter } from '../sections/footer.js';
import { loadFonts } from '../utils/fonts.js';
import floatingStyles from '../styles/floating-contacts.css';
import { renderFloatingContacts, updateFloatingContacts } from '../sections/floating-contacts.js';
import { preserveTestSiteLinks } from '../utils/test-site-links.js';
import { createBlogMotion } from '../utils/blog-animation.js';
import { withBlogRoute } from '../blog/routes.js';

// Local preview font paths do not exist on Wix; loadFonts supplies hosted fonts.
const hostedBlogStyles = blogStyles.replace(/@font-face\s*\{[^}]*\}/g, '').replace(/@import\s+url\([^;]*\);/g, '');

class AristaBlog extends HTMLElement {
  static get observedAttributes() { return ['content', 'registration-result', 'blog-route']; }
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  connectedCallback() { loadFonts(); this.render(); this.emit('arista-ready', {}); }
  disconnectedCallback() { this.dispose(); }
  emit(name, detail) { this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true })); }
  attributeChangedCallback(name, previous, next) {
    if (previous === next || !this.isConnected) return;
    if (name === 'registration-result') {
      try { this.registration?.receiveResult(JSON.parse(next)); } catch { /* Invalid reply ignored. */ }
    } else if (name === 'blog-route') {
      try { this.applyRoute?.(JSON.parse(next)); } catch { /* Invalid route ignored. */ }
    } else this.render();
  }
  dispose() {
    cancelAnimationFrame(this.filterScrollFrame);
    this.pendingFilterScroll = false;
    this.motion?.dispose();
    this.motion = undefined;
    this.applyRoute = undefined;
    this.events?.abort(); this.registration?.dispose();
    this.shadowRoot.querySelector('.floating-contact-shell')?.dispose();
    this.contactObserver?.disconnect();
    this.disposeLinks?.(); this.disposeFooterLinks?.();
  }
  render() {
    this.dispose();
    this.events = new AbortController();
    const signal = this.events.signal;
    let data;
    try { data = JSON.parse(this.getAttribute('content') || '{"state":"loading"}'); }
    catch { data = { state: 'error' }; }
    // Velo supplies the actual page route in Preview/iframes. The fallback is
    // useful when loading this component directly in a local browser.
    if (data.state === 'ready' && !('activeCategoryId' in data)) data = withBlogRoute(data, location.href);
    const root = this.shadowRoot;
    root.innerHTML = `<style>${hostedBlogStyles}\n${floatingStyles}
      :host{display:block;min-width:0;background:#f7f5f0;color:#0c0f33;font-family:"Be Vietnam Pro",Arial,sans-serif;--navy:#0c0f33;--paper:#f7f5f0;--gold:#d9a441;--muted:#67697a;--line:#dddcd8}
      .brand img{height:60px;width:100px;object-fit:contain}.missing-cover{display:grid;place-items:center;height:100%;color:#0c0f33}.blog-pagination{display:flex;justify-content:center;gap:10px;margin-top:40px}.blog-pagination a{display:block;text-decoration:none;color:inherit;padding:10px 16px;border:1px solid #dddcd8;background:transparent}.blog-pagination [aria-current]{background:#0c0f33;color:white}.article-body img{max-width:100%;height:auto;display:block;margin:24px 0}.article-body table{width:100%;border-collapse:collapse;display:block;overflow:auto}.article-body td{padding:12px;border:1px solid #dddcd8;min-width:110px}.article-body pre{overflow:auto}.blog-video{aspect-ratio:16/9;margin:24px 0}.blog-video iframe{width:100%;height:100%;border:0}.article-body a{color:inherit;text-decoration:underline}.article-body blockquote{border-left:3px solid #d9a441;margin:24px 0;padding-left:20px}
      </style><div id="blog-app">${renderBlogMarkup(data)}</div><div id="blog-shared-footer"></div>`;
    if (data.state !== 'ready') return;
    const shared = root.getElementById('blog-shared-footer').attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    // The shared base fills a standalone home element. Here it is nested after
    // the article: a 100% minimum height would repeat the outer element's height
    // and leave a large empty scroll area below the visible footer on Wix.
    style.textContent = [baseStyles, sectionStyles, registrationStyles, footerStyles, responsiveStyles,
      ':host{min-height:0}'
    ].join('\n');
    shared.append(style);
    this.registration = renderRegistration(data.registration, detail => this.emit('arista-registration-submit', detail));
    if (this.registration) shared.append(this.registration);
    const footer = renderFooter(data.footer, () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    if (footer) shared.append(footer);
    const contacts = renderFloatingContacts(data.contacts, () => {
      this.registration?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    if (contacts) {
      root.append(contacts);
      const update = () => updateFloatingContacts(this);
      window.addEventListener('scroll', update, { passive: true, signal });
      window.addEventListener('resize', update, { signal });
      this.contactObserver = new ResizeObserver(update);
      this.contactObserver.observe(this);
      update();
    }
    this.disposeLinks = preserveTestSiteLinks(root);
    this.disposeFooterLinks = preserveTestSiteLinks(shared);
    const menu = root.querySelector('#blog-mobile-menu');
    const toggle = root.querySelector('.menu-toggle');
    const close = () => { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Mở menu'); };
    toggle.addEventListener('click', () => { menu.hidden = !menu.hidden; toggle.setAttribute('aria-expanded', String(!menu.hidden)); toggle.setAttribute('aria-label', menu.hidden ? 'Mở menu' : 'Đóng menu'); }, { signal });
    root.addEventListener('keydown', event => { if (event.key === 'Escape') close(); }, { signal });
    root.querySelectorAll('[data-registration]').forEach(link => link.addEventListener('click', event => {
      if (!this.registration) return;
      event.preventDefault(); close(); this.registration.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, { signal }));
    this.applyRoute = route => {
      if (data.post || route.routeKind !== data.routeKind || route.categoryMissing) return;
      data = { ...data, ...route };
      const results = listResults(data, data.activeCategoryId || '', data.requestedPage || 1);
      root.querySelector('#post-results').innerHTML = results.html;
      root.querySelector('.result-count').textContent = `${results.count} bài viết`;
      root.querySelectorAll('[data-category]').forEach(link => {
        if (link.dataset.category === (data.activeCategoryId || '')) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      this.motion?.refreshCards();
      if (this.pendingFilterScroll) {
        this.pendingFilterScroll = false;
        cancelAnimationFrame(this.filterScrollFrame);
        // Wait for the new results to determine the document height. Align below
        // the sticky header; scrollIntoView(start) would put filters behind it.
        this.filterScrollFrame = requestAnimationFrame(() => {
          if (signal.aborted) return;
          const filter = root.querySelector('.filter-bar');
          const header = root.querySelector('.blog-header');
          const offset = (header?.getBoundingClientRect().height || 0) + 16;
          window.scrollBy({ top: filter.getBoundingClientRect().top - offset, behavior: 'instant' });
        });
      }
    };
    root.addEventListener('click', event => {
      const link = event.target.closest('[data-category], [data-blog-page]');
      // Keep native links for modified clicks, new tabs and Wix category pages.
      if (link && data.routeKind === 'list' && !event.defaultPrevented && event.button === 0
          && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        const categoryId = link.hasAttribute('data-category') ? link.dataset.category : data.activeCategoryId || '';
        const page = link.hasAttribute('data-category') ? 1 : Number(link.dataset.blogPage);
        if (categoryId === (data.activeCategoryId || '') && page === (data.requestedPage || 1)) return;
        this.pendingFilterScroll = true;
        this.emit('arista-blog-filter-change', { categoryId, page });
      }
      const toc = event.target.closest('[data-toc]');
      if (toc) { event.preventDefault(); const section = root.getElementById(toc.dataset.toc); if (section) window.scrollBy({ top: section.getBoundingClientRect().top - 110, behavior: 'smooth' }); }
    }, { signal });
    root.querySelector('#copy-article')?.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(location.href); root.querySelector('#share-status').textContent = 'Đã sao chép liên kết'; }
      catch { root.querySelector('#share-status').textContent = 'Bạn có thể sao chép địa chỉ trên thanh trình duyệt.'; }
    }, { signal });
    const avatar = root.querySelector('.author-mark img');
    avatar?.addEventListener('error', () => { avatar.parentElement.outerHTML = blogAvatar({ ...data.post, avatar: { type: 'initials' } }); }, { once: true, signal });
    this.emit('arista-blog-rendered', { postId: data.post?.id || '' });
    if (data.post && location.hash === '#article-categories') {
      requestAnimationFrame(() => root.getElementById('article-categories')?.scrollIntoView({ block: 'start' }));
    }
    this.motion = createBlogMotion(root, { article: !!data.post });
  }
}
if (!customElements.get('arista-blog')) customElements.define('arista-blog', AristaBlog);

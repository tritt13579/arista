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

// Local preview font paths do not exist on Wix; loadFonts supplies hosted fonts.
const hostedBlogStyles = blogStyles.replace(/@font-face\s*\{[^}]*\}/g, '').replace(/@import\s+url\([^;]*\);/g, '');

class AristaBlog extends HTMLElement {
  static get observedAttributes() { return ['content', 'registration-result']; }
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  connectedCallback() { loadFonts(); this.render(); this.emit('arista-ready', {}); }
  disconnectedCallback() { this.dispose(); }
  emit(name, detail) { this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true })); }
  attributeChangedCallback(name, previous, next) {
    if (previous === next || !this.isConnected) return;
    if (name === 'registration-result') {
      try { this.registration?.receiveResult(JSON.parse(next)); } catch { /* Invalid reply ignored. */ }
    } else this.render();
  }
  dispose() {
    this.motion?.dispose();
    this.motion = undefined;
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
    const root = this.shadowRoot;
    root.innerHTML = `<style>${hostedBlogStyles}\n${floatingStyles}
      :host{display:block;min-width:0;background:#f7f5f0;color:#0c0f33;font-family:"Be Vietnam Pro",Arial,sans-serif;--navy:#0c0f33;--paper:#f7f5f0;--gold:#d9a441;--muted:#67697a;--line:#dddcd8}
      .brand img{height:60px;width:100px;object-fit:contain}.missing-cover{display:grid;place-items:center;height:100%;color:#0c0f33}.blog-pagination{display:flex;justify-content:center;gap:10px;margin-top:40px}.blog-pagination button{padding:10px 16px;border:1px solid #dddcd8;background:transparent}.blog-pagination [aria-current]{background:#0c0f33;color:white}.article-body img{max-width:100%;height:auto;display:block;margin:24px 0}.article-body table{width:100%;border-collapse:collapse;display:block;overflow:auto}.article-body td{padding:12px;border:1px solid #dddcd8;min-width:110px}.article-body pre{overflow:auto}.blog-video{aspect-ratio:16/9;margin:24px 0}.blog-video iframe{width:100%;height:100%;border:0}.article-body a{color:inherit;text-decoration:underline}.article-body blockquote{border-left:3px solid #d9a441;margin:24px 0;padding-left:20px}
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
    const requestedCategory = new URL(location.href).searchParams.get('category');
    let category = !data.post && data.categories.some(item => item.id === requestedCategory) ? requestedCategory : '';
    let page = 1;
    const updateResults = () => {
      const results = listResults(data, category, page);
      root.querySelector('#post-results').innerHTML = results.html;
      root.querySelector('.result-count').textContent = `${results.count} bài viết`;
      root.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
      this.motion?.refreshCards();
    };
    if (category) updateResults();
    root.addEventListener('click', event => {
      const button = event.target.closest('[data-category],[data-blog-page]');
      if (button) {
        if ('category' in button.dataset) { category = button.dataset.category; page = 1; }
        else page = Number(button.dataset.blogPage);
        updateResults();
        if ('blogPage' in button.dataset) root.querySelector('.filter-bar').scrollIntoView({ block: 'start' });
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

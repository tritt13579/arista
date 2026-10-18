import base from '../styles/base.css';
import sections from '../styles/sections.css';
import registrationStyles from '../styles/registration.css';
import footerStyles from '../styles/footer.css';
import viewerStyles from '../styles/image-viewer.css';
import detailStyles from '../styles/program-detail.css';
import { node } from '../utils/dom.js';
import { loadFonts } from '../utils/fonts.js';
import { renderRegistration } from '../sections/registration.js';
import { renderFooter } from '../sections/footer.js';
import { renderProgramMoments } from '../sections/program-moments.js';
import momentsStyles from '../styles/program-moments.css';
import { balanceGrid } from '../utils/balanced-grid.js';
import { setResponsiveImage } from '../utils/image-url.js';
import { renderProgramSkeleton } from '../sections/program-skeleton.js';
import skeletonStyles from '../styles/program-skeleton.css';
import { animateProgramHero } from '../utils/program-hero-animation.js';
import { animateProgramScroll } from '../utils/program-scroll-animation.js';

const styles = [base, sections, registrationStyles, footerStyles, viewerStyles, detailStyles, momentsStyles, skeletonStyles].join('\n');
const text = (tag, className, value) => node(tag, className, value || '');
const link = (label, href, className = '') => {
  const element = text('a', className, label);
  element.href = href;
  return element;
};
const image = (src, alt, className = '', eager = false) => {
  const img = node('img', className);
  if (src) setResponsiveImage(img, src.startsWith('wix:') ? src : new URL(src, document.baseURI).href, '(max-width: 700px) 90vw, 650px');
  else img.classList.add('image-unavailable');
  img.alt = alt;
  img.loading = eager ? 'eager' : 'lazy';
  img.decoding = 'async';
  if (eager) img.fetchPriority = 'high';
  img.addEventListener('error', () => img.classList.add('image-unavailable'), { once: true });
  return img;
};
const heading = (eyebrow, title, description) => {
  const box = node('div', 'pd-heading pd-reveal');
  box.append(text('p', 'pd-eyebrow', eyebrow), text('h2', '', title));
  if (description) box.append(text('p', 'pd-description', description));
  return box;
};
const section = (id, className = '') => {
  const el = node('section', `pd-section ${className}`);
  el.id = id;
  el.tabIndex = -1;
  return el;
};

class AristaProgram extends HTMLElement {
  static get observedAttributes() { return ['content', 'registration-result']; }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.renderPending();
  }
  connectedCallback() {
    loadFonts(); this.render();
    this.dispatchEvent(new CustomEvent('arista-ready', { bubbles: true, composed: true }));
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.isConnected || oldValue === newValue) return;
    if (name === 'registration-result') {
      try { this.registration?.receiveResult(JSON.parse(this.getAttribute(name))); } catch (_) { /* Invalid external payload. */ }
    } else this.render();
  }
  disconnectedCallback() { this.dispose(); }
  closeMenu() {}
  renderPending(data) {
    const style = node('style'); style.textContent = styles;
    if (data?.state === 'error') {
      const status = text('p', 'pd-loading', data.message || 'Chưa tải được nội dung. Vui lòng thử lại.');
      status.setAttribute('role', 'alert');
      this.shadowRoot.replaceChildren(style, status);
    } else this.shadowRoot.replaceChildren(style, renderProgramSkeleton());
  }
  dispose() {
    this.disposeHeroAnimation?.();
    this.disposeScrollAnimation?.();
    this.disposeHeroAnimation = this.disposeScrollAnimation = null;
    this.controller?.abort();
    this.registration?.dispose();
    this.moments?.dispose();
    clearTimeout(this.resultTimer);
    this.imageViewer?.close(false);
    this.imageViewer = null;
  }
  render() {
    if (!this.hasAttribute('content')) return;
    let data;
    try { data = JSON.parse(this.getAttribute('content')); } catch { return; }
    if (!data?.title) {
      this.dispose();
      this.renderPending(data);
      return;
    }
    const journeyItems = (data.journey || []).filter(item => Array.isArray(item) && item[0]);
    const teacherItems = (data.teachers || []).filter(item => item && item.show !== false && item.title);
    this.dispose();
    this.controller = new AbortController();
    this.shadowRoot.replaceChildren();
    const style = node('style');
    style.textContent = styles;
    const header = node('header', 'pd-header');
    const brand = link('', data.homeUrl || './index.html', 'pd-brand');
    brand.setAttribute('aria-label', 'Arista — Trang chủ');
    brand.append(image(data.logo, 'Arista Music Center', '', true));
    header.append(brand, link('← Các bộ môn', data.programsUrl || './index.html?section=programs', 'pd-home-link'), link('Đăng ký', '#registration', 'cta pd-header-cta pd-register-link'));
    const main = node('main');
    main.id = 'main';
    const hero = section('overview', `pd-hero pd-${data.slug}`);
    const heroCopy = node('div', 'pd-hero-copy');
    heroCopy.append(text('p', 'pd-eyebrow', data.kicker));
    const h1 = text('h1', '', data.title);
    h1.tabIndex = -1;
    const slogan = node('p', 'pd-slogan');
    slogan.append(text('span', '', data.headline[0]), text('em', '', data.headline[1]));
    heroCopy.append(h1, slogan, text('p', 'pd-intro', data.intro));
    const actions = node('div', 'pd-hero-actions');
    const exploreTarget = journeyItems.length ? 'journey' : teacherItems.length ? 'teachers' : 'moments';
    actions.append(link(`Đăng ký học ${data.title} ↗`, '#registration', 'pd-button'), link(journeyItems.length ? 'Hành trình học ↓' : 'Khám phá bộ môn ↓', `#${exploreTarget}`, 'pd-text-link'));
    heroCopy.append(actions);
    const tags = node('ul', 'pd-tags');
    data.tags.forEach(tag => tags.append(text('li', '', tag)));
    heroCopy.append(tags);
    const heroMedia = node('figure', 'pd-hero-media');
    const heroFrame = node('div', 'pd-hero-frame');
    const heroImage = image(data.hero, data.heroCaption, '', true);
    if (data.heroFocusHeight != null) heroImage.style.objectPosition = `center ${Math.max(0, Math.min(100, Number(data.heroFocusHeight) || 0))}%`;
    const heroPhotoWindow = node('div', 'pd-hero-photo-window');
    heroPhotoWindow.append(heroImage);
    heroFrame.append(heroPhotoWindow);
    const heroLabel = text('span', 'pd-hero-label', 'Confidence in being yourself');
    heroLabel.setAttribute('aria-hidden', 'true');
    heroFrame.append(heroLabel);
    heroMedia.append(heroFrame, text('figcaption', '', data.heroCaption));
    hero.append(heroCopy, heroMedia);
    const nav = node('nav', 'pd-subnav');
    nav.setAttribute('aria-label', `Nội dung bộ môn ${data.title}`);
    for (const [id, label] of [...(journeyItems.length ? [['journey', 'Hành trình học']] : []), ...(teacherItems.length ? [['teachers', 'Giảng viên']] : []), ['moments', 'Ảnh & video']
      // Temporarily disabled with the program awards section:
      // , ...(data.awards?.length ? [['awards', 'Thành tích']] : [])
    ]) nav.append(link(label, `#${id}`));

    const journey = section('journey', 'pd-journey');
    journey.hidden = !journeyItems.length;
    const journeyInner = node('div', 'pd-journey-inner');
    journeyInner.append(heading('Từng bước, theo nhịp của bạn', 'Một hành trình.\nNhiều điều để khám phá.', 'Các chặng dưới đây là gợi ý nội dung. Lộ trình thực tế sẽ được trao đổi cùng giảng viên, dựa trên nền tảng và mục tiêu của người học.'));
    const steps = node('ol', 'pd-steps');
    journeyItems.forEach(([title, description], index) => {
      const item = node('li', 'pd-step pd-reveal');
      item.style.setProperty('--delay', `${(index % 4) * 65}ms`);
      item.append(text('span', 'pd-step-index', String(index + 1).padStart(2, '0')), text('h3', '', title), text('p', '', description));
      steps.append(item);
    });
    balanceGrid(steps, 4, 3, 2);
    journeyInner.append(steps);
    journey.append(journeyInner);

    const teachers = section('teachers', 'pd-teachers');
    teachers.hidden = !teacherItems.length;
    const teacherInner = node('div', 'pd-teachers-inner');
    teacherInner.append(heading('Người đồng hành', 'Kỹ thuật được dẫn dắt.\nCảm hứng được nuôi dưỡng.'));
    const columns = teacherItems.length === 3 || teacherItems.length >= 5 ? 3 : 2;
    const teacherGrid = node('div', `pd-teacher-grid ${teacherItems.length === 1 ? 'is-single' : columns === 3 ? 'uses-portraits' : ''}`);
    teacherItems.forEach(teacher => {
      const card = node('article', 'pd-teacher pd-reveal');
      if (teacher.photo) {
        const portrait = image(teacher.photo, teacher.title, 'pd-portrait-image');
        portrait.style.objectPosition = `center ${teacher.photoFocusHeight ?? 30}%`;
        const portraitWindow = node('div', 'pd-portrait pd-portrait-window');
        portraitWindow.append(portrait);
        card.append(portraitWindow);
      } else {
        const placeholder = node('div', 'pd-portrait pd-person-placeholder');
        placeholder.append(text('span', '', data.preview ? 'A' : teacher.title.trim().charAt(0)), text('small', '', data.preview ? 'Ảnh giảng viên\nsẽ bổ sung' : ''));
        card.append(placeholder);
      }
      const copy = node('div', 'pd-teacher-copy');
      copy.append(text('p', 'pd-eyebrow', teacher.role), text('h3', '', teacher.title));
      if (teacher.credential) copy.append(text('p', 'pd-credential', teacher.credential));
      if (teacher.qualifications) {
        const list = node('ul');
        teacher.qualifications.split('\n').filter(Boolean).forEach(value => list.append(text('li', '', value)));
        copy.append(list);
      } else if (data.preview) copy.append(text('p', 'pd-muted', teacher.placeholder
        ? 'Hồ sơ minh họa. Tên, học vị, trường đào tạo và ảnh sẽ được cập nhật sau khi xác nhận.'
        : 'Hồ sơ đang dùng ảnh và tên hiển thị từ trang chủ. Tên đầy đủ, học vị và trường đào tạo sẽ được bổ sung sau.'));
      card.append(copy);
      teacherGrid.append(card);
    });
    balanceGrid(teacherGrid, columns, 2, 1);
    teacherInner.append(teacherGrid);
    teachers.append(teacherInner);

    const moments = renderProgramMoments(this, data, heading('Âm nhạc bước ra khỏi trang giấy', 'Những khoảnh khắc\nđáng được lưu giữ.', 'Một buổi tập, một sân khấu, một lần tự tin hơn. Khám phá những hình ảnh và câu chuyện tại Arista.'));
    this.moments = moments;
    if (moments.hidden) nav.querySelector('a[href="#moments"]')?.remove();
    if (exploreTarget === 'moments' && moments.hidden) actions.querySelector('.pd-text-link').href = '#registration';

    main.append(hero, nav, journey, teachers, moments);
    /* Program awards temporarily disabled at the client's request.
       Keep this renderer and its CSS for a future restore; home awards are unchanged.
    if (data.awards.length) {
      const awards = section('awards', 'pd-awards');
      const awardCopy = node('div', 'pd-award-copy');
      awardCopy.append(heading('Những dấu mốc tự hào', 'Từ phòng học\nđến sân khấu lớn.'));
      data.awards.forEach(item => {
        const row = node('article', 'pd-award pd-reveal');
        row.append(text('span', '', item.year), text('h3', '', item.title), text('p', '', item.result));
        awardCopy.append(row);
      });
      const figure = node('figure', 'pd-award-photo pd-reveal');
      const awardImage = image(data.awardImage, `Thành tích bộ môn ${data.title} tại Arista`);
      awardImage.style.objectPosition = `center ${Math.max(0, Math.min(100, Number(data.awardImageFocusHeight ?? 50)))}%`;
      figure.append(awardImage, text('figcaption', '', 'Một dấu mốc, nhiều nỗ lực phía sau.'));
      awards.append(awardCopy);
      if (data.awardImage) awards.append(figure);
      else awards.classList.add('pd-awards-text-only');
      main.append(awards);
    }
    */
    const registration = renderRegistration(data.registration, ({ requestId, values }) => {
      this.dispatchEvent(new CustomEvent('arista-registration-submit', { detail: { requestId, values, ...(data.preview ? { demo: true } : {}) }, bubbles: true, composed: true }));
      if (data.preview) this.resultTimer = setTimeout(() => registration.receiveResult({ requestId, ok: true, demo: true }), 450);
    });
    this.registration = registration;
    registration.selectProgram(data.title);
    // Keep the page's program selected when starting another local submission.
    registration.querySelector('.registration-reset').addEventListener('click', () => registration.selectProgram(data.title));
    main.append(registration);
    main.querySelectorAll('section').forEach(item => {
      const title = item.querySelector('h1, h2');
      if (!title) return;
      title.id ||= `${item.id}-heading`;
      item.setAttribute('aria-labelledby', title.id);
    });
    const footer = renderFooter(data.footer, () => {
      window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      h1.focus({ preventScroll: true });
    });
    const skip = link('Bỏ qua điều hướng', '#main', 'pd-skip');
    main.tabIndex = -1;
    this.shadowRoot.append(style, skip, header, main, footer);
    this.shadowRoot.addEventListener('click', event => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const destination = this.shadowRoot.getElementById(anchor.hash.slice(1));
      if (!destination) return;
      event.preventDefault();
      destination.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      destination.focus({ preventScroll: true });
    }, { signal: this.controller.signal });
    this.disposeHeroAnimation = animateProgramHero(this.shadowRoot);
    this.disposeScrollAnimation = animateProgramScroll(this.shadowRoot);
  }
}

if (!customElements.get('arista-program')) customElements.define('arista-program', AristaProgram);

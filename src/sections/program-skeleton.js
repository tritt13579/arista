import { node } from '../utils/dom.js';

// Static placeholders only: no CMS text, interactive controls or image requests.
export function renderProgramSkeleton() {
  const shell = node('div', 'pd-skeleton');
  shell.setAttribute('role', 'status');
  shell.setAttribute('aria-live', 'polite');
  shell.innerHTML = `
    <span class="pd-sk-status">Đang tải nội dung bộ môn…</span>
    <div aria-hidden="true" aria-busy="true">
      <div class="pd-header">
        <span class="pd-sk-block pd-sk-logo"></span>
        <span class="pd-sk-block pd-sk-header-link"></span>
        <span class="cta pd-header-cta pd-sk-block pd-sk-header-button">Đăng ký</span>
      </div>
      <div class="pd-section pd-hero">
        <div class="pd-hero-copy">
          <p class="pd-eyebrow"><span class="pd-sk-block pd-sk-eyebrow"></span></p>
          <h1><span class="pd-sk-block pd-sk-title"></span></h1>
          <p class="pd-slogan"><span class="pd-sk-block pd-sk-slogan"></span><em class="pd-sk-block pd-sk-slogan-accent"></em></p>
          <div class="pd-intro">
            <span class="pd-sk-block pd-sk-line"></span>
            <span class="pd-sk-block pd-sk-line"></span>
            <span class="pd-sk-block pd-sk-line pd-sk-line-short"></span>
          </div>
          <div class="pd-hero-actions"><span class="pd-sk-block pd-sk-button"></span><span class="pd-sk-block pd-sk-link"></span></div>
          <div class="pd-tags"><span class="pd-sk-block pd-sk-tag"></span><span class="pd-sk-block pd-sk-tag"></span><span class="pd-sk-block pd-sk-tag"></span></div>
        </div>
        <div class="pd-hero-media">
          <div class="pd-sk-block pd-sk-photo"></div>
          <span class="pd-sk-block pd-sk-caption"></span>
        </div>
      </div>
      <div class="pd-subnav"><span class="pd-sk-block pd-sk-nav"></span><span class="pd-sk-block pd-sk-nav"></span><span class="pd-sk-block pd-sk-nav"></span></div>
    </div>`;
  return shell;
}

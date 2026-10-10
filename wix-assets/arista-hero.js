// Replace the entire Wix sample custom-element file with this file.
// Keep the source tag name: wix-default-custom-element
(() => {
  const DEFAULTS = {
    image: 'https://static.wixstatic.com/media/d63cf9_42d1d0dfcae34bc3bf97467d7121a351~mv2.jpg',
    imageAlt: 'Dàn nhạc học viên Arista biểu diễn bên vịnh Nha Trang',
    eyebrow: 'Trung tâm âm nhạc · Nha Trang',
    title: 'Ươm mầm tài năng',
    slogan: 'Confidence in being yourself',
    description: 'Đào tạo Piano, Violin, Guitar, Thanh nhạc, Trống, Saxophone, Đàn bầu và Mỹ thuật cho trẻ em và người lớn. Lộ trình bài bản từ vỡ lòng đến luyện thi quốc tế, cùng sân khấu thật cho mỗi học viên.',
    primaryLabel: 'Đăng ký học thử →',
    secondaryLabel: 'Xem lộ trình học',
    stats: [
      { value: '43', label: 'Giải thưởng tại Piano Got Talent 2026' },
      { value: '15+', label: 'Năm giảng dạy của giám đốc chuyên môn' },
      { value: '8', label: 'Bộ môn âm nhạc & mỹ thuật' },
      { value: '11K', label: 'Người theo dõi · 100% đề xuất' }
    ]
  };

  class AristaHero extends HTMLElement {
    static get observedAttributes() { return ['content']; }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;1,500&display=swap">
        <style>
          :host { display:block; width:100%; color:#fff; background:#0c0f33; }
          * { box-sizing:border-box; }
          .hero { position:relative; overflow:hidden; isolation:isolate; display:flex; align-items:center; min-height:760px; padding:110px 32px 80px; font-family:'Be Vietnam Pro',Arial,sans-serif; }
          .background,.overlay { position:absolute; inset:0; width:100%; height:100%; z-index:-1; }
          .background { object-fit:cover; object-position:center 40%; }
          .overlay { background:linear-gradient(90deg,rgba(12,15,51,.88),rgba(12,15,51,.60) 45%,rgba(12,15,51,.10) 75%),linear-gradient(0deg,#0c0f33 8%,rgba(12,15,51,.80) 45%,rgba(12,15,51,.35) 80%,rgba(12,15,51,.45)); }
          .layout { width:100%; max-width:1176px; margin:0 auto; display:grid; grid-template-columns:minmax(0,1.15fr) minmax(0,1fr); align-items:end; gap:48px; }
          .copy { display:flex; flex-direction:column; align-items:flex-start; gap:22px; min-width:0; }
          .eyebrow { margin:0; display:flex; align-items:center; gap:12px; color:#f0c878; font-size:12px; font-weight:600; line-height:1.6; letter-spacing:.18em; text-transform:uppercase; }
          .eyebrow:before { content:''; width:28px; height:1px; background:currentColor; flex-shrink:0; }
          h1 { margin:0; font-family:'Playfair Display',Georgia,serif; font-weight:500; font-size:clamp(44px,6vw,78px); line-height:1.12; overflow-wrap:break-word; }
          .slogan { margin:0; font-family:'Playfair Display',Georgia,serif; font-style:italic; color:#f0c878; font-size:clamp(23px,2.5vw,34px); line-height:1.35; }
          .description { margin:0; max-width:540px; font-size:16px; line-height:1.8; color:rgba(255,255,255,.86); }
          .actions { display:flex; flex-wrap:wrap; gap:14px; margin-top:2px; }
          button { appearance:none; font:600 14px/1.5 'Be Vietnam Pro',Arial,sans-serif; cursor:pointer; border:1px solid transparent; border-radius:999px; padding:14px 24px; transition:background .2s,color .2s,border-color .2s,transform .2s; }
          .primary { background:#d9a441; color:#0c0f33; }
          .primary:hover { background:#f0c878; transform:translateY(-2px); }
          .secondary { background:transparent; color:#fff; border-color:rgba(255,255,255,.5); }
          .secondary:hover { color:#f0c878; border-color:#f0c878; transform:translateY(-2px); }
          button:focus-visible { outline:3px solid #fff; outline-offset:4px; }
          .stats { margin:0; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1px; border:1px solid rgba(255,255,255,.16); border-radius:20px; overflow:hidden; background:rgba(255,255,255,.16); backdrop-filter:blur(8px); }
          .stat { margin:0; padding:24px 20px; background:rgba(12,15,51,.68); }
          dt { font-size:13px; line-height:1.65; color:rgba(255,255,255,.82); }
          dd { margin:0 0 8px; font-family:'Playfair Display',Georgia,serif; font-size:40px; line-height:1.1; color:#f0c878; }
          .copy,.stats { animation:arista-enter .75s ease-out both; }
          .stats { animation-delay:.16s; }
          @keyframes arista-enter { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          @media (max-width:850px) {
            .hero { min-height:0; padding:80px 28px 64px; }
            .layout { grid-template-columns:1fr; gap:36px; }
            .copy { max-width:640px; }
            h1 { font-size:60px; }
            .stats { width:100%; max-width:640px; }
          }
          @media (max-width:480px) {
            .hero { padding:56px 20px 40px; }
            .copy { gap:18px; }
            h1 { font-size:44px; }
            .eyebrow { font-size:10px; letter-spacing:.12em; }
            .slogan { font-size:24px; }
            .description { font-size:14px; line-height:1.8; }
            .actions { width:100%; gap:12px; }
            button { width:100%; padding:14px 16px; }
            .stat { padding:20px 14px; }
            dd { font-size:34px; }
            dt { font-size:12px; }
          }
          @media (prefers-reduced-motion:reduce) {
            .copy,.stats { animation:none; }
            button { transition:none; }
          }
        </style>
        <section class="hero" lang="vi" aria-labelledby="hero-title">
          <img class="background" fetchpriority="high" decoding="async" alt="">
          <div class="overlay" aria-hidden="true"></div>
          <div class="layout">
            <div class="copy">
              <p class="eyebrow"></p>
              <h1 id="hero-title"></h1>
              <p class="slogan"></p>
              <p class="description"></p>
              <div class="actions">
                <button type="button" class="primary"></button>
                <button type="button" class="secondary"></button>
              </div>
            </div>
            <dl class="stats" aria-label="Arista qua những con số"></dl>
          </div>
        </section>`;
      this.shadowRoot.querySelector('.primary').addEventListener('click', () => this.sendAction('registration'));
      this.shadowRoot.querySelector('.secondary').addEventListener('click', () => this.sendAction('learning-journey'));
    }

    connectedCallback() { this.renderContent(); }
    attributeChangedCallback() { if (this.isConnected) this.renderContent(); }

    sendAction(action) {
      // Velo page code will connect these actions to native Wix sections/forms.
      this.dispatchEvent(new CustomEvent('arista-action', { detail: { action }, bubbles:true, composed:true }));
    }

    renderContent() {
      let supplied = {};
      try {
        const parsed = JSON.parse(this.getAttribute('content') || '{}');
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) supplied = parsed;
      } catch (error) {
        console.warn('Arista hero: invalid content JSON; using default content.');
      }
      const data = { ...DEFAULTS, ...supplied };
      const root = this.shadowRoot;
      const fields = { '.eyebrow':'eyebrow', 'h1':'title', '.slogan':'slogan', '.description':'description', '.primary':'primaryLabel', '.secondary':'secondaryLabel' };
      Object.entries(fields).forEach(([selector, key]) => {
        root.querySelector(selector).textContent = typeof data[key] === 'string' ? data[key] : DEFAULTS[key];
      });
      const image = root.querySelector('.background');
      let imageUrl = DEFAULTS.image;
      try { const url = new URL(data.image); if (url.protocol === 'https:') imageUrl = url.href; } catch (error) { /* Keep the default HTTPS image. */ }
      if (image.getAttribute('src') !== imageUrl) image.src = imageUrl;
      image.alt = typeof data.imageAlt === 'string' ? data.imageAlt : DEFAULTS.imageAlt;
      const stats = Array.isArray(data.stats) ? data.stats.slice(0,4) : DEFAULTS.stats;
      const items = stats.map((stat) => {
        const item = document.createElement('div');
        item.className = 'stat';
        const label = document.createElement('dt');
        const value = document.createElement('dd');
        label.textContent = String((stat && stat.label) || '');
        value.textContent = String((stat && stat.value) || '');
        // Keep definition-list semantics while displaying each number first.
        item.append(label, value);
        item.style.display = 'flex';
        item.style.flexDirection = 'column';
        value.style.order = '-1';
        return item;
      });
      root.querySelector('.stats').replaceChildren(...items);
    }
  }

  if (!customElements.get('wix-default-custom-element')) {
    customElements.define('wix-default-custom-element', AristaHero);
  }
})();

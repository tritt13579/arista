// Standalone menu and hero component. Tag name: arista-home.
// No Wix imports here: Velo page code sends CMS data via the content attribute.
(() => {
  function imageUrl(value) {
    if (typeof value !== 'string') return '';
    // Wix CMS Image fields return wix:image://v1/<media-id>/<filename>#...
    const match = value.match(/^wix:image:\/\/v1\/([^/]+)\//);
    if (match) return `https://static.wixstatic.com/media/${match[1]}`;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)) ? url.href : '';
    } catch (_) { return ''; }
  }

  class AristaHome extends HTMLElement {
    static get observedAttributes() { return ['content']; }
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;1,500&display=swap">
        <style>
          :host{display:flex;flex-direction:column;min-height:100%;background:#0c0f33;color:white;font-family:'Be Vietnam Pro',Arial,sans-serif;width:100%;min-width:0}
          *{box-sizing:border-box} [hidden]{display:none!important}
          button{font:inherit;cursor:pointer;touch-action:manipulation} button:focus-visible,a:focus-visible{outline:3px solid #f0c878;outline-offset:4px}
          .shell{position:relative;isolation:isolate;overflow:hidden;flex:1;display:flex;flex-direction:column}.photo,.overlay{position:absolute;inset:0;z-index:-1;width:100%;height:100%}
          .photo{object-fit:cover;object-position:center 40%}.overlay{background:linear-gradient(90deg,rgba(12,15,51,.9),rgba(12,15,51,.6) 45%,rgba(12,15,51,.15)),linear-gradient(0deg,#0c0f33,rgba(12,15,51,.3))}
          header{position:relative;z-index:2;width:100%;max-width:1240px;margin:0 auto;padding:18px 28px;display:flex;align-items:center;gap:24px;min-height:84px;border-bottom:1px solid #ffffff1f}
          .brand{flex:none;font:500 25px Georgia,serif;white-space:nowrap}.logo{display:block;max-width:152px;max-height:48px;object-fit:contain}
          nav{display:flex;flex:1;justify-content:center;gap:20px;min-width:0}
          .nav-link{border:0;background:none;color:#ffffffdf;padding:10px 0;min-height:44px;font-size:13px;white-space:nowrap;transition:color .2s}.nav-link:hover{color:#f0c878}
          .toggle{display:none;color:white;background:#0c0f3340;border:1px solid #ffffff50;padding:10px 14px;min-height:44px;border-radius:8px;margin-left:auto}
          .cta{display:inline-block;border:1px solid transparent;border-radius:999px;padding:14px 24px;font-size:14px;font-weight:600;background:#d9a441;color:#0c0f33;transition:transform .2s,background .2s}
          .cta:hover{background:#f0c878;transform:translateY(-2px)}.secondary{background:transparent;color:white;border-color:#ffffff80}.secondary:hover{background:#ffffff10}
          .header-cta{flex:none;white-space:nowrap;padding:12px 20px;font-size:13px}
          main{width:100%;flex:1;max-width:1240px;margin:auto;padding:100px 28px 76px;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);align-items:end;gap:56px;min-height:650px}
          .copy{display:flex;flex-direction:column;align-items:flex-start;gap:22px}
          .eyebrow{display:flex;align-items:center;gap:12px;margin:0;color:#f0c878;letter-spacing:.16em;text-transform:uppercase;font-size:11px;font-weight:600;line-height:1.8}
          .eyebrow:before{content:'';flex:none;width:28px;height:1px;background:currentColor}
          h1{margin:0;font:500 clamp(44px,5.6vw,76px)/1.12 'Playfair Display',Georgia,serif;overflow-wrap:break-word;text-wrap:balance}
          .slogan{margin:0;color:#f0c878;font:italic 500 clamp(22px,2.6vw,32px)/1.4 'Playfair Display',Georgia,serif}
          .description{margin:0;color:#ffffffdc;font-size:15px;line-height:1.85;max-width:560px;white-space:pre-line}
          .actions{display:flex;flex-wrap:wrap;gap:14px}
          dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;margin:0;border:1px solid #ffffff29;background:#ffffff29;border-radius:20px;overflow:hidden;backdrop-filter:blur(8px)}
          .stat{background:#0c0f33bb;padding:24px 20px;display:flex;flex-direction:column;gap:10px}
          dt{font-size:13px;line-height:1.65;color:#ffffffd9}dd{order:-1;margin:0;font:500 40px/1.1 'Playfair Display',Georgia,serif;color:#f0c878}
          @media(max-width:1100px){header{gap:16px}.toggle{display:block}nav{display:none;position:absolute;top:100%;left:20px;right:20px;flex-direction:column;gap:2px;padding:12px;background:#0c0f33f5;border:1px solid #ffffff29;border-radius:14px;box-shadow:0 20px 40px #0004}nav.open{display:flex}.nav-link{text-align:left;padding:10px 14px;white-space:normal}.nav-link:hover{background:#ffffff0d;border-radius:8px}main{gap:36px}}
          @media(max-width:800px){main{grid-template-columns:1fr;min-height:0;padding:64px 24px 56px;gap:40px}.copy{max-width:620px}h1{font-size:clamp(44px,7vw,64px)}dl{width:100%;max-width:620px}}
          @media(max-width:540px){header{padding:16px 20px;min-height:76px}.header-cta{display:none}.logo{max-width:136px;max-height:44px}main{padding:48px 20px;gap:32px}.copy{gap:20px}h1{font-size:44px}.eyebrow{font-size:10px;letter-spacing:.12em}.description{font-size:14px}.stat{padding:22px 16px}.slogan{font-size:24px}}
          @media(max-width:380px){h1{font-size:40px}.actions{width:100%}.actions button{width:100%}dd{font-size:34px}}
          @media(prefers-reduced-motion:reduce){.cta,.nav-link{transition:none}}
        </style>
        <div class="shell" hidden lang="vi">
          <img class="photo" alt="" fetchpriority="high"><div class="overlay" aria-hidden="true"></div>
          <header><div class="brand"><img class="logo" alt="Arista Music Center" hidden><span class="brand-text">Arista</span></div><button class="toggle" type="button" aria-label="Open menu" aria-controls="arista-nav" aria-expanded="false">☰ Menu</button><nav id="arista-nav" aria-label="Main navigation"></nav><button class="cta header-cta" type="button"></button></header>
          <main><div class="copy"><p class="eyebrow"></p><h1></h1><p class="slogan"></p><p class="description"></p><div class="actions"><button class="cta primary" type="button"></button><button class="cta secondary" type="button"></button></div></div><dl aria-label="Arista highlights"></dl></main>
        </div>`;
      this.shadowRoot.querySelector('.toggle').addEventListener('click', () => {
        const open = this.shadowRoot.querySelector('nav').classList.toggle('open');
        this.shadowRoot.querySelector('.toggle').setAttribute('aria-expanded', String(open));
        this.shadowRoot.querySelector('.toggle').setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
      this.shadowRoot.addEventListener('keydown', event => {
        if (event.key === 'Escape' && this.shadowRoot.querySelector('nav').classList.contains('open')) {
          this.closeMenu();
          this.shadowRoot.querySelector('.toggle').focus();
        }
      });
      this.shadowRoot.addEventListener('click', event => {
        if (!event.target.closest('header')) this.closeMenu();
      });
    }
    connectedCallback() {
      this.render();
      this.emit('arista-ready', {});
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue && this.isConnected) this.render();
    }
    emit(name, detail) { this.dispatchEvent(new CustomEvent(name, { detail, bubbles:true, composed:true })); }
    action(target, label) {
      this.emit('arista-action', { target, label });
      this.closeMenu();
    }
    closeMenu() {
      this.shadowRoot.querySelector('nav').classList.remove('open');
      this.shadowRoot.querySelector('.toggle').setAttribute('aria-expanded', 'false');
      this.shadowRoot.querySelector('.toggle').setAttribute('aria-label', 'Open menu');
    }
    render() {
      const root = this.shadowRoot;
      let data;
      try { data = JSON.parse(this.getAttribute('content') || 'null'); }
      catch (_) { console.error('ARISTA: invalid content JSON.'); return; }
      if (!data) return;
      if (data.state === 'error') console.error('ARISTA CMS:', data.message || 'Failed to load content.');
      if (data.state === 'ready' && !data.hero) { root.querySelector('.shell').hidden = true; return; }
      if (!data.hero) return; // A reload error keeps the last good content visible.
      const hero = data.hero;
      const menu = Array.isArray(data.menu) ? data.menu : [];
      const stats = Array.isArray(data.stats) ? data.stats : [];
      const displayKey = JSON.stringify({ hero, menu, stats });
      if (displayKey === this.lastDisplayKey) return;
      this.lastDisplayKey = displayKey;
      root.querySelector('.shell').hidden = false;
      for (const [selector, field] of Object.entries({'.eyebrow':'eyebrow','h1':'heading','.slogan':'slogan','.description':'description'})) {
        root.querySelector(selector).textContent = String(hero[field] ?? '');
        root.querySelector(selector).hidden = !hero[field];
      }
      for (const [selector, field, alt] of [['.photo','image',hero.imageAlt],['.logo','logo','Arista Music Center']]) {
        const img = root.querySelector(selector);
        const url = imageUrl(hero[field]);
        img.hidden = !url;
        if (url && img.getAttribute('src') !== url) img.src = url;
        if (!url) img.removeAttribute('src');
        img.alt = String(alt || '');
      }
      root.querySelector('.brand-text').hidden = !!imageUrl(hero.logo);
      for (const [selector, label, target] of [['.primary',hero.primaryLabel,hero.primaryTarget],['.header-cta',hero.headerLabel || hero.primaryLabel,hero.primaryTarget],['.secondary',hero.secondaryLabel,hero.secondaryTarget]]) {
        const button = root.querySelector(selector);
        button.textContent = String(label || '');
        button.hidden = !label;
        button.onclick = () => this.action(String(target || ''), String(label || ''));
      }
      root.querySelector('nav').replaceChildren(...menu.map(item => {
        const button = document.createElement('button');
        button.type = 'button';button.className = 'nav-link';button.textContent = String(item.title || '');
        button.addEventListener('click', () => this.action(String(item.target || ''), String(item.title || '')));
        return button;
      }));
      root.querySelector('dl').hidden = !stats.length;
      root.querySelector('dl').replaceChildren(...stats.map(item => {
        const box = document.createElement('div');box.className = 'stat';
        const label = document.createElement('dt');label.textContent = String(item.title || '');
        const value = document.createElement('dd');value.textContent = String(item.value || '');
        box.append(label,value);return box;
      }));
    }
  }
  if (!customElements.get('arista-home')) customElements.define('arista-home', AristaHome);
})();

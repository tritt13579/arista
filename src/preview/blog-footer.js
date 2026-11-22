import { createHomeContent } from '../content/home-content.js';
import { renderRegistration } from '../sections/registration.js';
import { renderFooter } from '../sections/footer.js';

// Reuse the homepage renderers, styles and sample CMS data in the local blog.
// Shadow DOM keeps blog typography from changing the shared sections.
export async function mountSharedFooter() {
  const host = document.querySelector('#shared-blog-footer');
  if (!host) return;
  const read = async url => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Cannot load shared footer (${response.status}).`);
    return response;
  };
  const [content, ...styles] = await Promise.all([
    read(new URL('../../cms/content.json', import.meta.url)).then(response => response.json()),
    ...['base', 'sections', 'registration', 'footer', 'responsive'].map(name =>
      read(new URL(`../styles/${name}.css`, import.meta.url)).then(response => response.text()))
  ]);
  const settings = { ...content.AristaSiteSettings[0] };
  for (const key of ['logo', 'locationImage']) {
    if (settings[key]) settings[key] = new URL(`../../${settings[key]}`, import.meta.url).href;
  }
  const home = createHomeContent(settings, content.AristaPageContent, [], [], content.AristaPrograms);
  const root = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = styles.join('\n');
  const registration = renderRegistration(home.registration, ({ requestId }) => {
    setTimeout(() => registration.receiveResult({ requestId, ok: true, demo: true }), 500);
  });
  root.append(style, registration, renderFooter(home.footer, () => window.scrollTo({ top: 0, behavior: 'smooth' })));
  host.scrollToRegistration = () => registration.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

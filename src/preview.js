import './components/arista-home.js';
import { createHomeContent } from './content/home-content.js';

const element = document.querySelector('arista-home');
const contentUrl = new URL('../cms/content.json', import.meta.url);
const content = await fetch(contentUrl).then(response => {
  if (!response.ok) throw new Error(`Cannot load sample content (${response.status}).`);
  return response.json();
});
// Sample array order represents the CMS mirrored order. No custom sorting.
const settings = { ...content.AristaSiteSettings[0] };
const sections = content.AristaPageContent.map(item => ({ ...item }));
const assetUrl = value => value ? new URL(`../${value}`, import.meta.url).href : '';
settings.logo = assetUrl(settings.logo);
for (const section of sections) section.image = assetUrl(section.image);
element.setAttribute('content', JSON.stringify(createHomeContent(settings, sections, content.AristaHeroHighlights)));
element.addEventListener('arista-action', event => console.info('ARISTA ACTION (sections pending):', event.detail));

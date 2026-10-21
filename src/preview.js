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
settings.locationImage = assetUrl(settings.locationImage);
for (const section of sections) section.image = assetUrl(section.image);
const programs = content.AristaPrograms.map(item => ({ ...item, image: assetUrl(item.image) }));
const teachers = content.AristaTeachers.map(item => ({ ...item, photo: assetUrl(item.photo) }));
const achievementPhotos = content.AristaAchievementPhotos.map(item => ({ ...item, image: assetUrl(item.image) }));
const studentMoments = content.AristaStudentMoments.map(item => ({ ...item, image: assetUrl(item.image) }));
const testimonials = (content.AristaTestimonials || []).map(item => ({ ...item, photo: assetUrl(item.photo) }));
const recognitions = (content.AristaRecognitions || []).map(item => ({ ...item, image: assetUrl(item.image) }));
const heroImages = (content.AristaHeroImages || []).map(item => ({ ...item, image: assetUrl(item.image) }));
const home = createHomeContent(settings, sections, content.AristaHeroHighlights, content.AristaTeachingPhilosophy, programs, content.AristaLearningJourney, teachers, content.AristaAchievements, content.AristaAwardCounts, achievementPhotos, studentMoments, content.AristaFaq, testimonials, recognitions, heroImages);
element.setAttribute('content', JSON.stringify(home));
// Local-only links to the two detail prototypes. Production cards stay intact.
element.shadowRoot.querySelectorAll('.program').forEach(card => {
  const title = card.querySelector('h3')?.textContent;
  if (!['Piano', 'Violin'].includes(title)) return;
  const link = document.createElement('a');
  link.className = 'program-action';
  link.textContent = 'Khám phá bộ môn →';
  link.href = `./${title.toLowerCase()}.html`;
  link.style.cssText = 'display:block;text-decoration:none;margin-top:16px';
  card.querySelector('.program-copy').append(link);
});
const initialSection = new URL(location.href).searchParams.get('section');
if (['programs', 'testimonials'].includes(initialSection)) {
  requestAnimationFrame(() => element.shadowRoot.getElementById(initialSection)?.scrollIntoView({ block: 'start' }));
}
element.addEventListener('arista-action', event => console.info('ARISTA ACTION:', event.detail));
// Local preview never writes personal information to Wix.
element.addEventListener('arista-registration-submit', event => {
  const { requestId } = event.detail;
  setTimeout(() => element.setAttribute('registration-result', JSON.stringify({ requestId, ok: true, demo: true })), 500);
});

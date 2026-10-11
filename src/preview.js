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
const programs = content.AristaPrograms.map(item => ({ ...item, image: assetUrl(item.image) }));
const teachers = content.AristaTeachers.map(item => ({ ...item, photo: assetUrl(item.photo) }));
const achievementPhotos = content.AristaAchievementPhotos.map(item => ({ ...item, image: assetUrl(item.image) }));
const studentMoments = content.AristaStudentMoments.map(item => ({ ...item, image: assetUrl(item.image) }));
element.setAttribute('content', JSON.stringify(createHomeContent(settings, sections, content.AristaHeroHighlights, content.AristaTeachingPhilosophy, programs, content.AristaLearningJourney, teachers, content.AristaAchievements, content.AristaAwardCounts, achievementPhotos, studentMoments, content.AristaFaq)));
element.addEventListener('arista-action', event => console.info('ARISTA ACTION (sections pending):', event.detail));

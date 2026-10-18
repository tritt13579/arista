import { createHomeContent } from './home-content.js';

const lines = value => String(value || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
const ordered = rows => [...rows].filter(row => row.show === true).sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0) || String(a._id || a.title).localeCompare(String(b._id || b.title)));

// Browser-free adapter, bundled separately for import by Wix page code.
export function createProgramContent(detail, tables, settings, sections, programs) {
  if (!detail?.programKey || !detail.title || detail.show !== true) throw new Error('Bộ môn chưa được bật hiển thị.');
  const home = createHomeContent(settings, sections, [], [], programs);
  if (!home.registration) throw new Error('Chưa có nội dung form đăng ký trong AristaPageContent.');
  const rows = key => ordered((tables[key] || []).filter(row => row.programKey === detail.programKey));
  const media = rows('AristaProgramMedia');
  const registration = { ...home.registration, programs: [...new Set([...home.registration.programs, detail.title])] };
  return {
    state: 'ready', preview: false, slug: detail.programKey, title: detail.title,
    homeUrl: '/arista', programsUrl: '/arista?section=programs', logo: settings.logo || '',
    kicker: detail.kicker || '', headline: [detail.headline || '', detail.headlineAccent || ''], intro: detail.intro || '',
    hero: detail.heroImage || '', heroFocusHeight: detail.heroImageFocusHeight ?? 50, heroCaption: detail.heroCaption || '',
    tags: lines(detail.tags), mediaLayout: detail.mediaLayout === 'portraits' ? 'portraits' : 'editorial',
    journey: rows('AristaProgramJourney').filter(row => row.title).map(row => [row.title, row.description || '']),
    teachers: rows('AristaProgramTeachers').filter(row => row.name?.trim()).map(row => ({
      title: row.name, role: row.role || '', credential: row.credential || '', qualifications: row.qualifications || '',
      photo: row.photo || '', photoFocusHeight: row.photoFocusHeight ?? 30,
    })),
    gallery: media.filter(row => row.kind === 'image' && row.image).map(row => ({ src: row.image, caption: row.caption || row.title, imageFocusHeight: row.imageFocusHeight ?? 50 })),
    videos: media.filter(row => row.kind === 'video' && row.youtubeUrl).map(row => ({ url: row.youtubeUrl, title: row.title, cover: row.image || '', description: row.caption || '' })),
    // Program awards are paused; no collection or image fields are required.
    // awards: rows('AristaProgramAwards').filter(row => row.title), awardImage: detail.awardImage || '', awardImageFocusHeight: detail.awardImageFocusHeight ?? 50,
    awards: [],
    registration, footer: home.footer,
  };
}

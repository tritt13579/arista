// Paste into the Arista Preview page code, never masterPage.js.
// Custom Element ID: aristaHome. Tag: arista-home.
// Required: pageContentDataset, heroHighlightsDataset, philosophyDataset,
// programsDataset, learningJourneyDataset, teachersDataset (Read, no sorts; mirror CMS order).
// Also required: achievementsDataset, awardCountsDataset, achievementPhotosDataset (Read, no sorts).
// Student Moments: studentMomentsDataset (Read, no sorts).
// FAQ: faqDataset (Read, no sorts).
import wixData from 'wix-data';
import { submitTrialRegistration } from 'backend/trial-registration.web';

$w.onReady(function () {
  // Hide the mobile Wix bar on this page only. A missing bar must not block CMS loading.
  try {
    const quickActionBar = $w('#quickActionBar1');
    if (typeof quickActionBar.hide === 'function') {
      quickActionBar.hide().catch(error => {
        console.warn('ARISTA: could not hide Quick Action Bar.', error);
      });
    }
  } catch (error) {
    console.warn('ARISTA: Quick Action Bar is unavailable on this view.', error);
  }
  const element = $w('#aristaHome');
  let payload = { state: 'loading' };
  let lastSent = '';
  const send = () => {
    const next = JSON.stringify(payload);
    if (next === lastSent) return;
    lastSent = next;
    element.setAttribute('content', next);
  };
  element.on('arista-ready', send);
  element.on('arista-action', event => {
    // Rendered section navigation is handled inside the Custom Element.
    // Registration actions can preselect a program inside the Custom Element.
    console.info('ARISTA ACTION:', event.detail);
  });

  let submitting = false;
  element.on('arista-registration-submit', async event => {
    const { requestId, values } = event.detail || {};
    if (typeof requestId !== 'string' || requestId.length > 100) return;
    if (submitting) {
      element.setAttribute('registration-result', JSON.stringify({ requestId, ok: false, message: 'Đăng ký trước vẫn đang được xử lý. Vui lòng chờ.' }));
      return;
    }
    submitting = true;
    try {
      const result = await submitTrialRegistration(values);
      element.setAttribute('registration-result', JSON.stringify({ ...result, requestId }));
    } catch (_) {
      element.setAttribute('registration-result', JSON.stringify({ requestId, ok: false, message: 'Chưa nhận được xác nhận. Vui lòng kiểm tra kết nối hoặc liên hệ hotline trước khi gửi lại.' }));
    } finally {
      submitting = false;
    }
  });

  const sections = readDataset($w('#pageContentDataset'));
  const highlights = readDataset($w('#heroHighlightsDataset'));
  const philosophy = readDataset($w('#philosophyDataset'));
  const programs = readDataset($w('#programsDataset'));
  const learningJourney = readDataset($w('#learningJourneyDataset'));
  const teachers = readDataset($w('#teachersDataset'));
  const achievements = readDataset($w('#achievementsDataset'));
  const awardCounts = readDataset($w('#awardCountsDataset'));
  const achievementPhotos = readDataset($w('#achievementPhotosDataset'));
  const studentMoments = readDataset($w('#studentMomentsDataset'));
  const faq = readDataset($w('#faqDataset'));
  send();
  Promise.all([
    wixData.query('AristaSiteSettings').limit(2).find({ consistentRead: true }),
    sections,
    highlights,
    philosophy,
    programs,
    learningJourney,
    teachers,
    achievements,
    awardCounts,
    achievementPhotos,
    studentMoments,
    faq
  ]).then(([settingsResult, sections, highlights, philosophy, programs, learningJourney, teachers, achievements, awardCounts, achievementPhotos, studentMoments, faq]) => {
    if (settingsResult.items.length !== 1) throw new Error('Site Settings must contain exactly one visible record.');
    const settings = settingsResult.items[0];
    const visible = sections.filter(item => item.showSection === true);
    const hero = visible.find(item => item.sectionKey === 'hero');
    if (sections.filter(item => item.sectionKey === 'hero').length !== 1) throw new Error('Page Content must contain exactly one Hero record.');
    payload = {
      state: 'ready',
      hero: hero ? {
        eyebrow: hero.introText, heading: hero.heading, slogan: hero.tagline,
        description: hero.description, image: hero.image, imageAlt: hero.imageDescription,
        imageFocusHeight: hero.imageFocusHeight,
        logo: settings.logo, headerLabel: settings.registrationButtonText,
        logoFocusHeight: settings.logoFocusHeight,
        primaryLabel: hero.primaryButtonText, primaryTarget: 'registration',
        secondaryLabel: hero.secondaryButtonText, secondaryTarget: 'learning-journey'
      } : null,
      menu: visible.filter(item => item.showInMenu === true).map(item => ({ title: item.menuLabel || '', target: item.sectionKey })),
      stats: highlights.filter(item => item.show === true).map(item => ({ title: item.title || '', value: String(item.value ?? '') })),
      quote: visible.find(item => item.sectionKey === 'quote') || null,
      philosophy: createSection('philosophy', philosophy),
      programs: createSection('programs', programs),
      learningJourney: createSection('learning-journey', learningJourney),
      teachers: createSection('teachers', teachers),
      achievements: createAchievements(),
      moments: createMoments(),
      faq: createFaq(),
      registration: createRegistration(),
      footer: { logo: settings.logo, logoFocusHeight: settings.logoFocusHeight, brandName: settings.brandName || '', description: settings.footerDescription || '', copyright: settings.copyrightText || '' },
      contacts: { phone: settings.primaryPhone || '', callLabel: settings.callButtonText || '', zaloUrl: settings.zaloUrl || '', zaloLabel: settings.zaloButtonText || '', messengerUrl: settings.messengerUrl || '', messengerLabel: settings.messengerButtonText || '', registrationLabel: settings.floatingRegistrationButtonText || '' },
      programButtonText: settings.programButtonText || ''
    };
    function createRegistration() {
      const section = visible.find(item => item.sectionKey === 'registration');
      const keys = ['addressLabel', 'phoneLabel', 'hoursLabel', 'address', 'openingHours', 'primaryPhone', 'primaryPhoneLabel', 'secondaryPhone', 'secondaryPhoneLabel', 'locationImage', 'locationImageDescription', 'locationImageFocusHeight'];
      return section ? { ...section, ...Object.fromEntries(keys.map(key => [key, settings[key]])), programs: programs.filter(item => item.show === true).map(item => item.title) } : null;
    }
    function createFaq() {
      const section = createSection('faq', faq);
      return section ? { ...section, contactText: settings.faqContactText || '', phone: settings.primaryPhone || '', phoneLabel: settings.primaryPhoneLabel || '' } : null;
    }
    function createMoments() {
      const section = createSection('moments', studentMoments);
      return section ? { ...section, socialLinks: ['youtube', 'facebook'].map(platform => ({
        platform, url: settings[`${platform}Url`] || '', title: settings[`${platform}Title`] || '', description: settings[`${platform}Description`] || ''
      })) } : null;
    }
    function createAchievements() {
      const section = createSection('achievements', achievements);
      return section ? { ...section, counts: awardCounts.filter(item => item.show === true), photos: achievementPhotos.filter(item => item.show === true) } : null;
    }
    function createSection(key, items) {
      const section = visible.find(item => item.sectionKey === key);
      return section ? { ...section, items: items.filter(item => item.show === true) } : null;
    }
    // console.info('ARISTA CMS READY', { menu: payload.menu.length, highlights: payload.stats.length });
    send();
  }).catch(error => {
    payload = { state: 'error', message: error.message || String(error) };
    console.error('ARISTA CMS ERROR', error);
    send();
  });
});

function readDataset(dataset) {
  return new Promise((resolve, reject) => {
    dataset.onReady(async () => {
      try {
        const total = dataset.getTotalCount();
        const items = [];
        for (let start = 0; start < total; start += 100) {
          const result = await dataset.getItems(start, Math.min(100, total - start));
          items.push(...result.items);
        }
        resolve(items);
      } catch (error) { reject(error); }
    });
  });
}

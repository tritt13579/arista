// Shared data adapter for local preview and the Wix component payload contract.
export function createHomeContent(settings, sections, highlights, philosophy = [], programs = [], learningJourney = [], teachers = [], achievements = [], awardCounts = [], achievementPhotos = [], studentMoments = [], faq = [], testimonials = []) {
  const visible = sections.filter(section => section.showSection === true);
  const hero = visible.find(section => section.sectionKey === 'hero');
  return {
    state: 'ready',
    hero: hero ? {
      eyebrow: hero.introText,
      heading: hero.heading,
      slogan: hero.tagline,
      description: hero.description,
      image: hero.image,
      imageFocusHeight: hero.imageFocusHeight,
      imageAlt: hero.imageDescription,
      logo: settings.logo,
      logoFocusHeight: settings.logoFocusHeight,
      headerLabel: settings.registrationButtonText,
      primaryLabel: hero.primaryButtonText,
      primaryTarget: 'registration',
      secondaryLabel: hero.secondaryButtonText,
      secondaryTarget: 'learning-journey'
    } : null,
    menu: visible.filter(section => section.showInMenu === true).map(section => ({
      title: section.menuLabel,
      target: section.sectionKey
    })),
    stats: highlights.filter(item => item.show === true).map(item => ({ title: item.title, value: item.value })),
    quote: visible.find(section => section.sectionKey === 'quote') || null,
    philosophy: createSection('philosophy', philosophy),
    programs: createSection('programs', programs),
    learningJourney: createSection('learning-journey', learningJourney),
    teachers: createSection('teachers', teachers),
    achievements: createAchievements(),
    moments: createMoments(),
    testimonials: createSection('testimonials', testimonials),
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
}

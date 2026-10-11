// Shared data adapter for local preview and the Wix component payload contract.
export function createHomeContent(settings, sections, highlights, philosophy = [], programs = []) {
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
      imageAlt: hero.imageDescription,
      logo: settings.logo,
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
    programButtonText: settings.programButtonText || ''
  };
  function createSection(key, items) {
    const section = visible.find(item => item.sectionKey === key);
    return section ? { ...section, items: items.filter(item => item.show === true) } : null;
  }
}

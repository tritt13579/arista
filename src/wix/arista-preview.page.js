// Paste into the Arista Preview page code, never masterPage.js.
// Custom Element ID: aristaHome. Tag: arista-home.
// Required now: pageContentDataset and heroHighlightsDataset (Read, no sorts).
import wixData from 'wix-data';

$w.onReady(function () {
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
    // Scrolling and native Wix Form integration are implemented with the remaining sections.
    console.info('ARISTA ACTION (sections pending):', event.detail);
  });

  const sections = readDataset($w('#pageContentDataset'));
  const highlights = readDataset($w('#heroHighlightsDataset'));
  send();
  Promise.all([
    wixData.query('AristaSiteSettings').limit(2).find({ consistentRead: true }),
    sections,
    highlights
  ]).then(([settingsResult, sections, highlights]) => {
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
        logo: settings.logo, headerLabel: settings.registrationButtonText,
        primaryLabel: hero.primaryButtonText, primaryTarget: 'registration',
        secondaryLabel: hero.secondaryButtonText, secondaryTarget: 'learning-journey'
      } : null,
      menu: visible.filter(item => item.showInMenu === true).map(item => ({ title: item.menuLabel || '', target: item.sectionKey })),
      stats: highlights.filter(item => item.show === true).map(item => ({ title: item.title || '', value: String(item.value ?? '') }))
    };
    console.info('ARISTA CMS READY', { menu: payload.menu.length, highlights: payload.stats.length });
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

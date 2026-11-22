// HTML fallback for Wix Custom Element bots. Input is the SAME ready payload
// sent to the visible component, never a second CMS query or local seed data.
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const text = (tag, value) => String(value ?? '').trim() ? `<${tag}>${escape(value)}</${tag}>` : '';
const paragraphs = values => values.map(value => text('p', value)).join('');
const list = (values, tag = 'ul') => values.length ? `<${tag}>${values.map(value => text('li', value)).join('')}</${tag}>` : '';
const lines = value => String(value || '').split(/\r?\n/).filter(value => value.trim());
const items = section => (section?.items || []).filter(item => item.show !== false);
const section = (content, body = '') => content && content.showSection !== false
  ? `<section>${text('p', content.introText)}${text('h2', content.heading)}${text('p', content.description)}${body}</section>` : '';
const article = (title, values) => `<article>${text('h3', title)}${paragraphs(values)}</article>`;

function safeLink(url, label) {
  const href = String(url || '').trim();
  // Same URL rules as the program cards. Escape attributes as well as text.
  if (!/^\/(?!\/)/.test(href) && !/^https:\/\//i.test(href)) return '';
  return `<a href="${escape(href)}">${escape(label)}</a>`;
}

function registration(content) {
  return section(content, paragraphs([
    content?.address, content?.primaryPhoneLabel || content?.primaryPhone,
    content?.secondaryPhoneLabel || content?.secondaryPhone, content?.openingHours,
  ]));
}

function footer(content) {
  return content ? `<footer>${paragraphs([content.description, content.copyright])}</footer>` : '';
}

export function createHomeSeoMarkup(data) {
  if (data?.state !== 'ready') return '';
  const hero = data.hero;
  const heroHtml = hero ? `<section>${text('p', hero.eyebrow)}${text('h1', hero.heading)}${paragraphs([hero.slogan, hero.description])}</section>` : '';
  const cards = content => items(content).map(item => article(item.title, [item.description])).join('');
  const featured = items(data.teachers).find(item => item.featured === true);
  const teachers = items(data.teachers).map(item => article(item.title, [
    item.role, item.credential, ...(item === featured ? lines(item.qualifications) : []),
    ...(item === featured ? [item.highlightText] : []),
  ])).join('');
  // Recognition text is available through the visible certificate selector.
  const recognitions = items(data.recognitions).filter(item => item.image).map(item => article(item.title, [
    item.category || 'Ghi nhận', item.description, item.recipient, item.issuer, item.year,
  ])).join('');
  const reviews = items(data.testimonials).filter(item => item.quote || item.excerpt);
  const testimonials = reviews.map(item => `<article><blockquote>${escape(item.quote || item.excerpt)}</blockquote>${paragraphs([item.title || item.name, item.role])}</article>`).join('');
  const achievements = data.achievements;
  return `<div lang="vi">${heroHtml}${data.quote?.description ? `<blockquote>${escape(data.quote.description)}</blockquote>` : ''}${
    section(data.philosophy, cards(data.philosophy))
  }${section(data.programs, items(data.programs).map(item => article(item.title, [item.categoryLabel, item.description]) + safeLink(item.detailUrl, data.programButtonText || 'Khám phá bộ môn →')).join(''))}${
    section(data.learningJourney, cards(data.learningJourney))
  }${section(data.teachers, teachers)}${recognitions ? section(data.recognitions, recognitions) : ''}${
    section(achievements, paragraphs([achievements?.featuredValue, achievements?.featuredLabel, achievements?.caption]) +
      (achievements?.counts || []).map(item => paragraphs([item.title, item.value])).join('') +
      items(achievements).map(item => article(item.title, [item.year, item.result])).join(''))
  }${section(data.moments)}${testimonials ? section(data.testimonials, testimonials) : ''}${
    section(data.faq, items(data.faq).filter(item => String(item.title || '').trim()).map(item => article(item.title, [item.answer])).join(''))
  }${registration(data.registration)}${footer(data.footer)}</div>`;
}

export function createProgramSeoMarkup(data) {
  if (data?.state !== 'ready') return '';
  const journey = data.journey || [];
  const teachers = data.teachers || [];
  // Keep fixed section headings in sync with arista-program.js.
  return `<div lang="vi"><section>${text('p', data.kicker)}${text('h1', data.title)}${
    text('p', (data.headline || []).join(' '))
  }${text('p', data.intro)}${list(data.tags || [])}${text('p', data.heroCaption)}</section>${journey.length ? section({
    introText: 'Từng bước, theo nhịp của bạn', heading: 'Một hành trình.\nNhiều điều để khám phá.',
    description: 'Các chặng dưới đây là gợi ý nội dung. Lộ trình thực tế sẽ được trao đổi cùng giảng viên, dựa trên nền tảng và mục tiêu của người học.',
  }, journey.map(([title, description]) => article(title, [description])).join('')) : ''}${teachers.length ? section({
    introText: 'Người đồng hành', heading: 'Kỹ thuật được dẫn dắt.\nCảm hứng được nuôi dưỡng.',
  }, teachers.map(item => article(item.title, [item.role, item.credential]) + list(lines(item.qualifications))).join('')) : ''}${
    (data.gallery?.length || data.videos?.length) ? section({
      introText: 'Âm nhạc bước ra khỏi trang giấy', heading: 'Những khoảnh khắc\nđáng được lưu giữ.',
      description: 'Một buổi tập, một sân khấu, một lần tự tin hơn. Khám phá những hình ảnh và câu chuyện tại Arista.',
    }) : ''
  }${registration(data.registration)}${footer(data.footer)}</div>`;
  // Program awards are paused in the UI. Do not expose them to bots either.
  // Media titles/captions hidden in the UI are intentionally not added here.
}

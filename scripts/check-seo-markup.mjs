import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createHomeSeoMarkup, createProgramSeoMarkup } from '../src/seo/markup.js';

const heroDescription = 'Học nhạc tại Nha Trang cùng Arista Music Center với các lớp Piano, Violin, Guitar, Thanh nhạc, Trống, Saxophone, Đàn bầu và Mỹ thuật dành cho trẻ em và người lớn. Lộ trình bài bản từ vỡ lòng đến luyện thi quốc tế, cùng cơ hội biểu diễn trên sân khấu thực tế.';
const home = {
  state: 'ready', hero: { heading: 'Ươm mầm tài năng', description: heroDescription },
  programs: { heading: 'Bộ môn', items: [
    { title: 'Piano', detailUrl: '/bo-mon/piano', description: 'CMS mới' },
    { title: 'Ẩn', show: false },
    { title: '<script>alert(1)</script>', description: 'A & B', detailUrl: 'javascript:alert(1)' },
    { title: 'Quoted URL', detailUrl: '/bo-mon/" onmouseover="alert(1)' },
  ] },
  teachers: null, faq: { items: [{ title: 'Học lúc nào?', answer: 'Theo lịch hẹn' }] },
  philosophy: { showSection: false, heading: 'SECTION HIDDEN' },
  testimonials: { items: [{ title: 'Phụ huynh', excerpt: 'Ngắn', quote: 'Đầy đủ & đúng CMS' }] },
};
let html = createHomeSeoMarkup(home);
assert.ok(html.includes(heroDescription));
assert.equal((html.match(/<h1>/g) || []).length, 1);
assert.ok(html.includes('href="/bo-mon/piano"'));
assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
assert.ok(html.includes('A &amp; B'));
assert.ok(html.includes('/bo-mon/&quot; onmouseover=&quot;alert(1)'));
assert.ok(!html.includes('javascript:'));
assert.ok(!html.includes('<h3>Ẩn</h3>'));
assert.ok(!html.includes('SECTION HIDDEN'));
assert.ok(html.includes('Theo lịch hẹn'));
assert.ok(html.includes('Đầy đủ &amp; đúng CMS'));
home.hero.description = 'Client cập nhật CMS';
assert.ok(createHomeSeoMarkup(home).includes('Client cập nhật CMS'));
assert.ok(!createHomeSeoMarkup(home).includes(heroDescription));

const program = {
  state: 'ready', title: 'Violin', headline: ['Một cây vĩ,', 'ngàn sắc thái.'],
  teachers: [{ title: 'Cô Trân', qualifications: 'Học viện Âm nhạc Huế\nCử nhân Violin' }],
  awards: [{ title: 'AWARD PAUSED' }],
  gallery: [{ caption: 'IMAGE TITLE HIDDEN' }],
  videos: [{ title: 'VIDEO TITLE HIDDEN' }],
};
html = createProgramSeoMarkup(program);
assert.ok(html.includes('<h1>Violin</h1>'));
assert.ok(html.includes('Cô Trân'));
assert.ok(html.includes('Học viện Âm nhạc Huế'));
assert.ok(!html.includes('AWARD PAUSED'));
assert.ok(!html.includes('TITLE HIDDEN'));
assert.ok(!html.includes('Một hành trình.'));
assert.ok(!html.includes('Piano'));
for (const state of ['loading', 'error']) {
  assert.equal(createHomeSeoMarkup({ ...home, state }), '');
  assert.equal(createProgramSeoMarkup({ ...program, state }), '');
}

// Exercise the actual page send() wiring, with Wix selectors/datasets mocked.
// This catches a builder that works in isolation but never reaches seoMarkup.
for (const file of ['arista-preview.page.js', 'arista-program.page.js']) {
  const element = { setAttribute(name, value) { this[name] = value; }, on() {} };
  const dataset = {
    onReady(callback) { callback(); }, getTotalCount() { return 1; },
    async getItems() { return { items: [{ sectionKey: 'hero', showSection: true, heading: 'Live CMS hero' }] }; },
    getCurrentItem() { return { title: 'Violin', programKey: 'violin', show: true }; },
  };
  const query = { eq() { return this; }, limit() { return this; }, async find() { return { items: [{}], hasNext: () => false }; } };
  const $w = selector => selector === '#aristaHome' || selector === '#aristaProgram' ? element : dataset;
  let pageReady;
  $w.onReady = callback => { pageReady = callback(); };
  const source = fs.readFileSync(`src/wix/${file}`, 'utf8').replace(/^import .+;\r?\n/gm, '');
  const context = vm.createContext({ $w, wixData: { query: () => query },
    createHomeSeoMarkup, createProgramSeoMarkup,
    createProgramContent: () => program, submitTrialRegistration: async () => ({}),
  });
  vm.runInContext(source, context);
  assert.equal(typeof pageReady?.then, 'function', `${file}: Wix must receive the CMS initialization promise`);
  await pageReady;
  const payload = JSON.parse(element.content);
  assert.equal(payload.state, 'ready', file);
  const build = file.includes('preview') ? createHomeSeoMarkup : createProgramSeoMarkup;
  assert.equal(element.seoMarkup, build(payload), file);
  assert.ok(element.seoMarkup.startsWith('<div lang="vi">'), file);
}
console.info('SEO markup checks passed: escaping, visibility, CMS updates, program isolation and Velo wiring.');

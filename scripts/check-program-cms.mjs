import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createProgramContent } from '../src/content/program-content.js';
import { youtubeThumbnailUrl } from '../src/utils/program-media-layout.js';

for (const url of [
  'https://www.youtube.com/watch?v=cKxF08yHJ_A&t=6s',
  'https://youtu.be/cKxF08yHJ_A',
  'https://www.youtube.com/shorts/cKxF08yHJ_A',
  'https://www.youtube-nocookie.com/embed/cKxF08yHJ_A',
]) assert.equal(youtubeThumbnailUrl(url), 'https://i.ytimg.com/vi/cKxF08yHJ_A/hqdefault.jpg');
for (const url of ['', 'javascript:alert(1)', 'https://example.com/watch?v=cKxF08yHJ_A', 'https://youtube.com/watch?v=invalid']) assert.equal(youtubeThumbnailUrl(url), '');

const home = JSON.parse(fs.readFileSync('cms/content.json', 'utf8'));
const tables = JSON.parse(fs.readFileSync('cms/program-content.json', 'utf8'));
const schema = JSON.parse(fs.readFileSync('cms/program-schema.json', 'utf8'));
const make = (detail, rows = tables) => createProgramContent(detail, rows, home.AristaSiteSettings[0], home.AristaPageContent, home.AristaPrograms);
const [piano, violin] = tables.AristaProgramDetails;
const expectedPrograms = {
  piano: { teachers: ['Trần Hữu Nhật Hoàng', 'Trần Hoàng Ái Mỹ'], photos: 5, videos: 4 },
  violin: { teachers: ['Võ Thị Huyền Trân'], photos: 6, videos: 4 },
  guitar: { teachers: ['Trần Duy Toàn', 'Lê Hồng Cơ'], photos: 5, videos: 4 },
  saxophone: { teachers: ['Phạm Văn Duy'], photos: 5, videos: 2 },
  drum: { teachers: ['Nguyễn Đình Khoa'], photos: 6, videos: 2 },
  'dan-bau': { teachers: ['Trần Anh Túc'], photos: 3, videos: 0 },
  vocal: { teachers: ['Hà Thị Diệp Anh', 'Nguyễn Văn Tài'], photos: 8, videos: 2 },
  'my-thuat': { teachers: ['Đinh Thanh Hải', 'Hà Trúc Thảo'], photos: 6, videos: 2 },
};
assert.deepEqual(tables.AristaProgramDetails.map(row => row.programKey).sort(), Object.keys(expectedPrograms).sort());
assert.equal(tables.AristaProgramTeachers.length, 12);
assert.equal(tables.AristaProgramMedia.length, 64);
for (const detail of tables.AristaProgramDetails) {
  const expected = expectedPrograms[detail.programKey];
  const data = make(detail);
  assert.equal(data.preview, false);
  assert.deepEqual(data.teachers.map(item => item.title), expected.teachers);
  assert.equal(data.gallery.length, 0);
  assert.equal(data.videos.length, 0);
  assert.equal(data.journey.length, 4);
  assert.ok(data.registration.programs.includes(detail.title));
  const homeCard = home.AristaPrograms.find(row => row.title === detail.title);
  assert.equal(homeCard?.detailUrl, `/bo-mon/${detail.programKey}`);
  const media = tables.AristaProgramMedia.filter(row => row.programKey === detail.programKey);
  assert.equal(media.filter(row => row.kind === 'image').length, expected.photos);
  assert.equal(media.filter(row => row.kind === 'video').length, expected.videos);
  assert.ok(media.every(row => row.show === false && row.image === '' && row.youtubeUrl === '' && row.caption === ''));
  const readyMedia = structuredClone(tables);
  readyMedia.AristaProgramMedia = media.map(row => ({ ...row, show: true,
    image: row.kind === 'image' ? 'https://example.com/photo.jpg' : '',
    youtubeUrl: row.kind === 'video' ? 'https://www.youtube.com/watch?v=abcdefghijk' : '',
  }));
  assert.equal(make(detail, readyMedia).gallery.length, expected.photos);
  assert.equal(make(detail, readyMedia).videos.length, expected.videos);
}
assert.equal(schema.collections.length, 4);
assert.ok(!Object.hasOwn(tables, 'AristaProgramAwards'));
assert.ok(!schema.collections.find(c => c.id === 'AristaProgramDetails').fields.some(f => f.id.startsWith('award')));
assert.ok(!fs.existsSync('cms/program-import/AristaProgramAwards.csv'));
assert.ok(fs.existsSync('cms/program-archive/AristaProgramAwards.csv'));
assert.equal(make(piano).awards.length, 0);
assert.equal(make(violin).awards.length, 0);
assert.equal(make(piano, { ...tables, AristaProgramAwards: [{ title: 'Old award', programKey: 'piano', show: true }] }).awards.length, 0, 'Paused awards must not leak from legacy CMS data');
assert.throws(() => make({ ...piano, show: false }));
const populated = structuredClone(tables);
populated.AristaProgramTeachers = [
  { programKey: 'piano', name: 'Second', show: true, sortOrder: 2 },
  { programKey: 'piano', name: 'First', show: true, sortOrder: 1 },
  { programKey: 'piano', name: '', show: true },
  { programKey: 'violin', name: 'Other', show: true },
  { programKey: 'piano', name: 'Hidden', show: false },
];
assert.deepEqual(make(piano, populated).teachers.map(t => t.title), ['First', 'Second']);
for (const collection of schema.collections) {
  const csv = fs.readFileSync(`cms/program-import/${collection.id}.csv`, 'utf8');
  assert.ok(csv.startsWith('\uFEFF'));
  const parsed = []; let row = [], cell = '', quoted = false;
  for (const char of csv.slice(1)) {
    if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(cell); cell = ''; }
    else if (char === '\n' && !quoted) { row.push(cell.replace(/\r$/, '')); parsed.push(row); row = []; cell = ''; }
    else cell += char;
  }
  assert.equal(quoted, false);
  assert.deepEqual(parsed[0], collection.fields.map(f => f.id));
  assert.equal(parsed.length, tables[collection.id].length + 1);
  for (let i = 0; i < tables[collection.id].length; i++) {
    const source = tables[collection.id][i];
    assert.equal(parsed[i + 1].length, collection.fields.length);
    collection.fields.forEach((f, col) => {
      assert.equal(parsed[i + 1][col], String(source[f.id]));
      if (f.type === 'Image') assert.equal(source[f.id], '');
      if (f.type === 'Boolean') assert.equal(typeof source[f.id], 'boolean');
      if (f.type === 'Number') assert.equal(typeof source[f.id], 'number');
    });
  }
}

// Exercise the actual Velo bridge: paginated CMS, ready handshake and real
// backend response correlation. No real Wix write is made by these mocks.
const pageCode = fs.readFileSync('src/wix/arista-program.page.js', 'utf8').replace(/^import .*;$/gm, '');
const handlers = {}, attributes = {};
const element = { on: (name, handler) => { handlers[name] = handler; }, setAttribute: (name, value) => { attributes[name] = JSON.parse(value); } };
let datasetReady, pageReady, backendCalls = 0;
const collections = { ...home, ...tables };
const context = {
  console, createProgramContent,
  submitTrialRegistration: async () => { backendCalls++; return { ok: true }; },
  $w: Object.assign(id => {
    if (id === '#aristaProgram') return element;
    if (id === '#programDetailsDataset') return { onReady: handler => { datasetReady = handler; }, getCurrentItem: () => piano };
    return {};
  }, { onReady: handler => { pageReady = handler; } }),
  wixData: { query: id => {
    assert.notEqual(id, 'AristaProgramAwards', 'Wix must load without an awards collection');
    let rows = [...collections[id]];
    const result = index => ({ items: rows.slice(index, index + 2), hasNext: () => index + 2 < rows.length, next: async () => result(index + 2) });
    const query = { eq: (field, value) => { rows = rows.filter(row => row[field] === value); return query; }, limit: () => query, find: async () => result(0) };
    return query;
  } },
};
vm.runInNewContext(pageCode, context);
pageReady(); assert.equal(attributes.content.state, 'loading');
await datasetReady(); assert.equal(attributes.content.state, 'ready');
assert.equal(attributes.content.journey.length, 4, 'Query pagination must not drop journey rows');
handlers['arista-ready'](); assert.equal(attributes.content.slug, 'piano');
await handlers['arista-registration-submit']({ detail: { requestId: 'test-1', values: {} } });
assert.equal(backendCalls, 1);
assert.deepEqual(attributes['registration-result'], { ok: true, requestId: 'test-1' });
console.log('PASS: all 8 program pages, 12 supplied teachers, 44 photo/20 video slots, home card URLs, CSV round-trip, filtering/order, CMS bridge pagination, ready handshake and backend result correlation.');

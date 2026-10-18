import fs from 'node:fs';
import { createProgramPreview } from '../src/preview/program-detail-data.js';

const cms = JSON.parse(fs.readFileSync('cms/content.json', 'utf8'));
const drafts = JSON.parse(fs.readFileSync('cms/program-drafts.json', 'utf8'));
const data = Object.fromEntries(['AristaProgramDetails', 'AristaProgramJourney', 'AristaProgramTeachers', 'AristaProgramMedia'].map(id => [id, []]));
const archivedAwards = [];
for (const draft of drafts) {
  const { programKey } = draft;
  data.AristaProgramDetails.push({ title: draft.title, programKey, show: true, kicker: draft.kicker, headline: draft.headline[0], headlineAccent: draft.headline[1], intro: draft.intro, tags: draft.tags.join('\n'), heroImage: '', heroImageFocusHeight: 50, heroCaption: '', mediaLayout: draft.mediaLayout });
  draft.journey.forEach(([title, description], index) => data.AristaProgramJourney.push({ title, programKey, description, sortOrder: index + 1, show: true }));
  draft.teachers.forEach(([name, credential, qualifications], index) => data.AristaProgramTeachers.push({ title: `${draft.title} — ${name}`, programKey, name, role: `Giảng viên ${draft.title}`, credential, qualifications, photo: '', photoFocusHeight: 30, sortOrder: index + 1, show: true }));
  // Blank slots are never rendered until the client supplies media and enables them.
  for (const [kind, count] of [['image', draft.photos], ['video', draft.videos]]) for (let index = 1; index <= count; index++) {
    const label = programKey === 'guitar' && kind === 'video' ? `${index <= 2 ? 'Classic' : 'Lead/Bass'} — Video ${index <= 2 ? index : index - 2}` : `${kind === 'image' ? 'Ảnh' : 'Video'} ${index}`;
    data.AristaProgramMedia.push({ title: `${draft.title} — ${label}`, programKey, kind, image: '', imageFocusHeight: 50, youtubeUrl: '', caption: '', sortOrder: index, show: false });
  }
}
// Keep the earlier local awards draft archived; new program pages do not use it.
for (const programKey of ['piano', 'violin']) createProgramPreview(cms, programKey).awards.forEach((row, index) => archivedAwards.push({ title: row.title, programKey, year: String(row.year || ''), result: row.result || '', sortOrder: index + 1, show: true }));
const notes = {
  title: ['Tên dòng', 'Text', 'Tên để nhận biết dòng trong CMS. Ở bảng giảng viên và ảnh/video, tên này dùng để quản lý; tên giảng viên hiển thị lấy từ name.'],
  programKey: ['Mã bộ môn', 'Text', 'Dùng piano, violin, guitar, saxophone, drum, dan-bau, vocal hoặc my-thuat. Phải giống mã ở bảng AristaProgramDetails. Guitar bao gồm Classic và Lead/Bass. Không đổi sau khi đã tạo URL.'],
  show: ['Hiển thị', 'Boolean', 'Bật để hiển thị, tắt để ẩn. Các trang, chặng học và hồ sơ đã có tên đang bật; ảnh/video trống đang tắt, cần bổ sung dữ liệu rồi bật.'],
  sortOrder: ['Thứ tự', 'Number', 'Số nhỏ hiển thị trước. Dùng 1, 2, 3… trong từng bộ môn; ảnh và video được xếp riêng.'],
  kicker: ['Dòng nhỏ đầu trang', 'Text', 'Dòng chữ phía trên tên bộ môn trong hero.'],
  headline: ['Slogan dòng đầu', 'Text', 'Phần đầu câu slogan dưới tên bộ môn. Nên viết ngắn.'],
  headlineAccent: ['Slogan dòng nhấn', 'Text', 'Phần chữ nhấn của slogan trong hero. Nên viết ngắn.'],
  intro: ['Giới thiệu ngắn', 'Text', 'Đoạn giới thiệu trong hero. Khoảng 1–2 câu để vừa màn hình. Đây là bản nháp cần duyệt.'],
  tags: ['Nhãn giới thiệu', 'Text', 'Các nhãn nhỏ dưới nút đăng ký. Mỗi nhãn một dòng, nên dùng tối đa 3 nhãn ngắn.'],
  heroImage: ['Ảnh đầu trang', 'Image', 'Chọn ảnh chính đúng bộ môn trong Media Manager. Nên dùng ảnh dọc, rõ mặt người; đây là ảnh lớn ở hero.'],
  heroImageFocusHeight: ['Vị trí ảnh đầu trang', 'Number', '0 lấy phần trên, 50 ở giữa, 100 lấy phần dưới khi ảnh bị cắt khung.'],
  heroCaption: ['Chú thích ảnh đầu trang', 'Text', 'Dòng chữ dưới ảnh hero; cũng là mô tả ảnh cho người dùng trình đọc màn hình. Điền sau khi chọn ảnh.'],
  mediaLayout: ['Kiểu bố cục ảnh', 'Text', 'editorial: bố cục ảnh xen kẽ; portraits: bố cục phù hợp ảnh dọc. Chỉ dùng một trong hai giá trị này.'],
  awardImage: ['Ảnh thành tích', 'Image', 'Ảnh lớn cạnh danh sách thành tích. Để trống nếu không cần ảnh; danh sách vẫn hiển thị.'],
  awardImageFocusHeight: ['Vị trí ảnh thành tích', 'Number', '0 phần trên, 50 giữa, 100 phần dưới ảnh trong khung.'],
  description: ['Mô tả chặng học', 'Text', 'Đoạn mô tả dưới tên chặng ở phần Hành trình học. Nội dung mẫu cần giảng viên duyệt.'],
  name: ['Tên giảng viên hiển thị', 'Text', 'Tên thật hiển thị trên thẻ Giảng viên, ví dụ Thầy/Cô + họ tên. Để trống thì hồ sơ không hiển thị.'],
  role: ['Vai trò', 'Text', 'Dòng nhỏ phía trên tên, ví dụ Giảng viên Piano. Chỉ điền thông tin đã xác nhận.'],
  credential: ['Học vị / chuyên môn', 'Text', 'Dòng nổi bật dưới tên giảng viên. Chỉ điền học vị/chuyên môn đã được xác nhận. Có thể để trống.'],
  qualifications: ['Thông tin chuyên môn', 'Text', 'Mỗi thông tin một dòng: trường đào tạo, kinh nghiệm… Chỉ điền dữ kiện đã xác nhận.'],
  photo: ['Ảnh giảng viên', 'Image', 'Chọn chân dung giảng viên đúng hồ sơ. Nếu có tên nhưng chưa có ảnh, giao diện dùng chữ cái đầu của tên.'],
  photoFocusHeight: ['Vị trí chân dung', 'Number', '0 phần trên, 50 giữa, 100 phần dưới; chỉnh để mặt không bị cắt.'],
  kind: ['Loại nội dung', 'Text', 'image cho ảnh, video cho video YouTube. Viết đúng tiếng Anh chữ thường.'],
  image: ['Ảnh / bìa video', 'Image', 'Với image: ảnh trong mục Khoảnh khắc. Với video: ảnh bìa của video. Thêm từ Media Manager.'],
  imageFocusHeight: ['Vị trí ảnh / bìa', 'Number', '0 phần trên, 50 giữa, 100 phần dưới trong khung ảnh.'],
  youtubeUrl: ['Link YouTube', 'Text', 'Chỉ điền cho kind = video. Dán link thật, ví dụ https://www.youtube.com/watch?v=… hoặc https://youtu.be/…; không dán mã iframe.'],
  caption: ['Chú thích ảnh / video', 'Text', 'Mô tả ngắn nội dung thực tế. Với ảnh, đây là chú thích trong khung xem ảnh.'],
  year: ['Năm thành tích', 'Text', 'Năm hiển thị cạnh thành tích, ví dụ 2026.'],
  result: ['Kết quả', 'Text', 'Giải thưởng/kết quả của bộ môn. Kiểm tra lại nội dung trước khi công khai.'],
};
const names = { AristaProgramDetails: 'Thông tin trang bộ môn', AristaProgramJourney: 'Hành trình học bộ môn', AristaProgramTeachers: 'Giảng viên bộ môn', AristaProgramMedia: 'Ảnh và video bộ môn', AristaProgramAwards: 'Thành tích bộ môn' };
const schema = { version: 1, collections: Object.entries(data).map(([id, rows]) => ({ id, name: names[id], fields: Object.keys(rows[0]).map(id => ({ id, name: notes[id][0], type: notes[id][1], description: notes[id][2] })) })) };
const quote = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
fs.mkdirSync('cms/program-import', { recursive: true });
// Retain the old draft outside the active import folder to prevent accidental setup.
fs.mkdirSync('cms/program-archive', { recursive: true });
const awardFields = ['title', 'programKey', 'year', 'result', 'sortOrder', 'show'];
fs.writeFileSync('cms/program-archive/AristaProgramAwards.csv', '\uFEFF' + [awardFields, ...archivedAwards.map(row => awardFields.map(field => row[field]))].map(row => row.map(quote).join(',')).join('\r\n') + '\r\n');
fs.writeFileSync('cms/program-archive/README.md', '# Thành tích trang bộ môn — đang tạm ẩn\n\nKhông import file trong thư mục này lên Wix ở giai đoạn hiện tại. Renderer, mục menu, truy vấn và adapter đang được comment. Khi bật lại cần khôi phục các phần đó, thêm collection AristaProgramAwards và field ảnh thành tích nếu sử dụng. Thành tích trang chủ không thay đổi.\n');
if (fs.existsSync('cms/program-import/AristaProgramAwards.csv')) fs.unlinkSync('cms/program-import/AristaProgramAwards.csv');
for (const { id, fields } of schema.collections) {
  const rows = [fields.map(f => f.id), ...data[id].map(row => fields.map(f => row[f.id]))];
  fs.writeFileSync(`cms/program-import/${id}.csv`, '\uFEFF' + rows.map(row => row.map(quote).join(',')).join('\r\n') + '\r\n');
}
fs.writeFileSync('cms/program-schema.json', JSON.stringify(schema, null, 2) + '\n');
fs.writeFileSync('cms/program-content.json', JSON.stringify(data, null, 2) + '\n');
fs.writeFileSync('docs/program-cms-field-notes.vi.md', '# Ghi chú các field trang bộ môn\n\nCó 8 trang; Guitar gồm Classic và Lead/Bass. Nội dung giới thiệu/lộ trình là bản nháp để duyệt. Tên, học vị và trường đào tạo do chủ dự án cung cấp; ảnh, bìa và link YouTube để trống để bổ sung sau. Không import lại các collection trang chủ khác.\n\n' + schema.collections.map(c => `## ${c.name} — ${c.id}\n\n| Field ID | Kiểu | Giải thích |\n| --- | --- | --- |\n${c.fields.map(f => `| ${f.id} | ${f.type} | ${f.description} |`).join('\n')}\n`).join('\n'));
console.log(`Exported 4 program CSVs for ${drafts.length} pages, ${data.AristaProgramTeachers.length} teachers and ${data.AristaProgramMedia.length} media slots; awards stay archived.`);

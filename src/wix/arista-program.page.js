// Dynamic Item Page: AristaProgramDetails. Dataset ID: programDetailsDataset.
// Custom Element ID: aristaProgram; tag: arista-program.
import wixData from 'wix-data';
import { createProgramContent } from 'public/arista-program-content.js';
import { submitTrialRegistration } from 'backend/trial-registration.web';

$w.onReady(function () {
  const element = $w('#aristaProgram');
  let payload = { state: 'loading' };
  const send = () => element.setAttribute('content', JSON.stringify(payload));
  element.on('arista-ready', send);
  send();
  try {
    const bar = $w('#quickActionBar1');
    if (typeof bar.hide === 'function') bar.hide().catch(error => console.warn('ARISTA QAB:', error));
  } catch (_) { /* Mobile-only Wix element. */ }

  let submitting = false;
  element.on('arista-registration-submit', async event => {
    const { requestId, values } = event.detail || {};
    if (typeof requestId !== 'string' || !requestId || requestId.length > 100) return;
    const reply = result => element.setAttribute('registration-result', JSON.stringify({ ...result, requestId }));
    if (submitting) { reply({ ok: false, message: 'Đăng ký trước vẫn đang được xử lý. Vui lòng chờ.' }); return; }
    submitting = true;
    try { reply(await submitTrialRegistration(values)); }
    catch (_) { reply({ ok: false, message: 'Chưa nhận được xác nhận. Vui lòng kiểm tra kết nối hoặc liên hệ hotline trước khi gửi lại.' }); }
    finally { submitting = false; }
  });

  $w('#programDetailsDataset').onReady(async () => {
    try {
      const detail = $w('#programDetailsDataset').getCurrentItem();
      if (!detail?.programKey || detail.show !== true) throw new Error('Bộ môn chưa được bật hiển thị.');
      const childIds = ['AristaProgramJourney', 'AristaProgramTeachers', 'AristaProgramMedia'
        // Program awards are paused. Do not require this collection on Wix yet.
        // , 'AristaProgramAwards'
      ];
      const [settings, sections, programs, ...children] = await Promise.all([
        readAll(wixData.query('AristaSiteSettings')),
        readAll(wixData.query('AristaPageContent')),
        readAll(wixData.query('AristaPrograms')),
        ...childIds.map(id => readAll(wixData.query(id).eq('programKey', detail.programKey))),
      ]);
      if (settings.length !== 1) throw new Error('AristaSiteSettings cần đúng một dòng.');
      payload = createProgramContent(detail, Object.fromEntries(childIds.map((id, index) => [id, children[index]])), settings[0], sections, programs);
      console.info('ARISTA PROGRAM READY', { programKey: detail.programKey, teachers: payload.teachers.length, photos: payload.gallery.length, videos: payload.videos.length });
    } catch (error) {
      console.error('ARISTA PROGRAM CMS:', error);
      payload = { state: 'error', message: 'Chưa tải được thông tin bộ môn. Vui lòng thử tải lại trang hoặc liên hệ Arista.' };
    }
    send();
  });
});

async function readAll(query) {
  let result = await query.limit(100).find({ consistentRead: true });
  const items = [...result.items];
  while (result.hasNext()) { result = await result.next(); items.push(...result.items); }
  return items;
}

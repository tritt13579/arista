// Create backend/trial-registration.web.js in Wix and paste this file there.
import { Permissions, webMethod } from 'wix-web-module';
import { submissions } from 'wix-forms.v2';
import { elevate } from 'wix-auth';

const FORM_ID = '1a3ca13f-0752-41c7-94ab-776889eec506';
const PROGRAMS = ['Piano', 'Violin', 'Guitar', 'Saxophone', 'Trống', 'Đàn bầu', 'Thanh nhạc', 'Mỹ thuật'];
const STUDENT_TYPES = ['Trẻ em / thiếu nhi', 'Người lớn'];
const recentPhones = new Map();
const COOLDOWN = 60000;

function validate(values) {
  if (!values || typeof values !== 'object' || Array.isArray(values)) throw new Error('Invalid input.');
  const text = (key, limit) => {
    const value = values[key] ?? '';
    if (typeof value !== 'string' || value.length > limit) throw new Error('Invalid field.');
    return value.trim();
  };
  if (text('website', 200)) throw new Error('Invalid submission.');
  const full_name = text('full_name', 120);
  const rawPhone = text('phone', 30);
  if (!full_name || !/^[+0-9 ().-]+$/.test(rawPhone)) throw new Error('Invalid name or phone.');
  let phone = rawPhone.replace(/[ ().-]/g, '');
  if (phone.startsWith('0')) phone = '+84' + phone.slice(1);
  else if (phone.startsWith('84')) phone = '+' + phone;
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error('Invalid phone.');
  const student_type = text('student_type', 80);
  const program = text('program', 80);
  if (student_type && !STUDENT_TYPES.includes(student_type)) throw new Error('Invalid student type.');
  if (program && !PROGRAMS.includes(program)) throw new Error('Invalid program.');
  const result = { full_name, phone };
  if (student_type) result.student_type = student_type;
  if (program) result.program = program;
  const message = text('message', 2000);
  if (message) result.message = message;
  return result;
}

export const submitTrialRegistration = webMethod(Permissions.Anyone, async values => {
  let fields;
  try {
    fields = validate(values);
  } catch (_) {
    return { ok: false, message: 'Vui lòng kiểm tra họ tên, số điện thoại và các lựa chọn rồi gửi lại.' };
  }
  const now = Date.now();
  // Best-effort protection on this server instance, not a durable rate limiter or CAPTCHA.
  for (const [phone, time] of recentPhones) if (now - time >= COOLDOWN) recentPhones.delete(phone);
  if (recentPhones.has(fields.phone)) return { ok: false, message: 'Số điện thoại này vừa gửi đăng ký. Vui lòng chờ một phút trước khi gửi lại.' };
  if (recentPhones.size >= 1000) return { ok: false, message: 'Hệ thống đang bận. Vui lòng thử lại sau hoặc liên hệ hotline.' };
  recentPhones.set(fields.phone, now);
  try {
    const createSubmission = elevate(submissions.createSubmission);
    await createSubmission({ formId: FORM_ID, submissions: fields });
    return { ok: true };
  } catch (_) {
    // Keep the cooldown: an uncertain response must not encourage immediate duplicates.
    return { ok: false, message: 'Chưa nhận được xác nhận. Vui lòng kiểm tra kết nối hoặc liên hệ hotline trước khi gửi lại.' };
  }
});

import { node } from "../utils/dom.js";
import { createSectionLayout } from "./section-layout.js";
import { imageUrl, setResponsiveImage } from "../utils/image-url.js";
import { imageFocusPosition } from "../utils/image-focus.js";
import { contactHref } from "./floating-contacts.js";

export function renderRegistration(content, submit) {
  if (!content) return null;
  const { section, inner, heading } = createSectionLayout("registration", content);
  const copy = node("div", "registration-copy");
  copy.append(heading);
  const details = node("div", "registration-details");
  const source = imageUrl(content.locationImage);
  if (source) {
    const image = node("img", "registration-location-image");
    image.alt = content.locationImageDescription || "";
    image.loading = "lazy";
    image.decoding = "async";
    setResponsiveImage(image, content.locationImage, "(max-width: 1024px) 110px, 150px", [160, 320, 480]);
    image.style.objectPosition = imageFocusPosition(content.locationImageFocusHeight);
    image.onerror = () => { image.remove(); details.classList.add("without-image"); };
    details.append(image);
  } else details.classList.add("without-image");
  const info = node("div", "registration-info");
  const addInfo = (label, lines) => {
    if (!lines.length) return;
    const group = node("div", "registration-info-group");
    group.append(node("h3", "", label));
    group.append(...lines);
    info.append(group);
  };
  if (content.address) addInfo(content.addressLabel, [node("p", "", content.address)]);
  const phones = [
    [content.primaryPhone, content.primaryPhoneLabel],
    [content.secondaryPhone, content.secondaryPhoneLabel],
  ].flatMap(([phone, label]) => {
    const href = contactHref(phone, true);
    if (!href) return [];
    const link = node("a", "", label || phone);
    link.href = href;
    return [link];
  });
  addInfo(content.phoneLabel, phones);
  if (content.openingHours) addInfo(content.hoursLabel, [node("p", "", content.openingHours)]);
  details.append(info);
  copy.append(details);

  const card = node("div", "registration-card");
  const form = node("form", "registration-form");
  form.setAttribute("aria-labelledby", "registration-form-heading");
  const title = node("h3", "", "Đăng ký học thử");
  title.id = "registration-form-heading";
  form.append(title, node("p", "registration-form-caption", content.caption || "Chỉ mất 30 giây. Chúng tôi sẽ gọi lại trong giờ hoạt động."));
  const fields = node("fieldset", "registration-fields");
  fields.append(node("legend", "registration-sr-only", "Thông tin đăng ký học thử"));
  const grid = node("div", "registration-field-grid");
  const controls = {};
  const field = (key, labelText, tag, options = []) => {
    const label = node("label", `registration-field registration-field-${key}`);
    label.append(node("span", "", labelText));
    const control = node(tag, "");
    control.name = key;
    control.id = `registration-${key}`;
    if (tag === "select") {
      control.append(new Option("Chọn…", ""));
      options.forEach(value => control.append(new Option(value, value)));
    }
    label.append(control);
    controls[key] = control;
    return label;
  };
  grid.append(field("full_name", "Họ và tên *", "input"), field("phone", "Số điện thoại *", "input"));
  controls.full_name.required = true;
  controls.full_name.maxLength = 120;
  controls.full_name.autocomplete = "name";
  controls.phone.type = "tel";
  controls.phone.required = true;
  controls.phone.maxLength = 30;
  controls.phone.autocomplete = "tel";
  controls.phone.inputMode = "tel";
  controls.phone.minLength = 7;
  controls.phone.oninput = () => controls.phone.setCustomValidity(controls.phone.value && !/^[+0-9 ().-]+$/.test(controls.phone.value) ? "Vui lòng nhập số điện thoại hợp lệ." : "");
  grid.append(field("student_type", "Người học", "select", ["Trẻ em / thiếu nhi", "Người lớn"]));
  grid.append(field("program", "Bộ môn", "select", content.programs || []));
  const message = field("message", "Lời nhắn", "textarea");
  controls.message.maxLength = 2000;
  controls.message.placeholder = "Thời gian có thể học, câu hỏi thêm…";
  grid.append(message);
  // A hidden honeypot catches basic automated submissions; it is not CAPTCHA.
  const trap = field("website", "Website", "input");
  trap.hidden = true;
  controls.website.tabIndex = -1;
  controls.website.autocomplete = "off";
  const button = node("button", "registration-submit", content.primaryButtonText || "Gửi đăng ký");
  button.type = "submit";
  fields.append(grid, trap, button);
  const status = node("p", "registration-status");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.tabIndex = -1;
  form.append(fields, status);

  const success = node("div", "registration-success");
  success.hidden = true;
  success.tabIndex = -1;
  success.setAttribute("role", "status");
  const successText = node("p", "", "Arista sẽ liên hệ lại sớm nhất để xếp lịch học thử.");
  const reset = node("button", "registration-reset", "Gửi đăng ký khác");
  reset.type = "button";
  success.append(node("h3", "", "Cảm ơn bạn!"), successText, reset);
  let pending = null;
  let timeout;
  const finish = result => {
    if (!pending || result?.requestId !== pending) return;
    clearTimeout(timeout);
    pending = null;
    fields.disabled = false;
    form.removeAttribute("aria-busy");
    button.textContent = content.primaryButtonText || "Gửi đăng ký";
    if (result.ok) {
      form.hidden = true;
      success.hidden = false;
      successText.textContent = result.demo ? "Đây là bản thử local. Thông tin chưa được gửi đến Arista." : "Arista sẽ liên hệ lại sớm nhất để xếp lịch học thử.";
      form.reset();
      success.focus({ preventScroll: true });
    } else {
      status.textContent = result.message || "Chưa gửi được đăng ký. Vui lòng thử lại hoặc liên hệ hotline.";
      status.classList.add("is-error");
      status.focus({ preventScroll: true });
    }
  };
  form.onsubmit = event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    pending = crypto.randomUUID();
    const requestId = pending;
    const values = Object.fromEntries(new FormData(form));
    fields.disabled = true;
    form.setAttribute("aria-busy", "true");
    button.textContent = "Đang gửi…";
    status.textContent = "";
    status.classList.remove("is-error");
    timeout = setTimeout(() => finish({ requestId, ok: false, message: "Chưa nhận được xác nhận. Vui lòng kiểm tra kết nối hoặc liên hệ hotline trước khi gửi lại." }), 45000);
    submit({ requestId, values });
  };
  reset.onclick = () => {
    success.hidden = true;
    form.hidden = false;
    status.textContent = "";
    controls.full_name.focus({ preventScroll: true });
  };
  section.receiveResult = finish;
  section.selectProgram = name => {
    if (!pending && [...controls.program.options].some(option => option.value === name)) {
      if (!success.hidden) reset.click();
      controls.program.value = name;
    }
  };
  section.dispose = () => clearTimeout(timeout);
  card.append(form, success);
  inner.replaceChildren(copy, card);
  section.append(inner);
  return section;
}

import { createProgramPreview } from './program-detail-data.js';

const host = document.querySelector('arista-program');
try {
  const response = await fetch(new URL('../../cms/content.json', import.meta.url));
  if (!response.ok) throw new Error(`Không tải được dữ liệu (${response.status}).`);
  const cms = await response.json();
  const data = createProgramPreview(cms, host.getAttribute('program'));
  // Shared Wix image helpers accept absolute URLs, just like the home preview.
  const assetUrl = value => value ? new URL(`../../${value}`, import.meta.url).href : '';
  data.registration.locationImage = assetUrl(data.registration.locationImage);
  data.footer.logo = assetUrl(data.footer.logo);
  host.setAttribute('content', JSON.stringify(data));
} catch (error) {
  host.textContent = `${error.message} Vui lòng mở trang qua Live Server và chạy npm run build.`;
}

import { mkdir, writeFile } from 'node:fs/promises';
import { posts } from '../src/preview/blog-content.js';

const destination = new URL('../output/blog-import/', import.meta.url);
await mkdir(destination, { recursive: true });
const escape = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Related articles have no public Wix URL yet. Keep their wording without a dead demo link.
const liveBody = html => html.replace(/href="\.\/piano\.html"/g, 'href="https://www.aristamusiccenter.com/bo-mon/piano"')
  .replace(/<a href="\.\/blog-post\.html\?bai=[^"]+">([\s\S]*?)<\/a>/g, '$1');
const plain = html => html.replace(/<\/(?:p|div|h[1-6]|li|tr|dl|dd)>/g, '\n\n').replace(/<\/dt>/g, ':\n').replace(/<\/(?:th|td)>/g, '\t')
  .replace(/<li[^>]*>/g, '• ').replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\n{3,}/g, '\n\n').trim();
for (const [index, post] of posts.entries()) {
  const sections = post.sections.map(section => `<h2>${escape(section.title)}</h2>${liveBody(section.body)}${section.media ? `<p>[CHÈN ẢNH: ${escape(section.media.src.split('/').pop())}]</p><p>${escape(section.media.caption)}${section.media.source ? ` — Ảnh: ${escape(section.media.credit)}` : ''}</p>` : ''}`).join('\n');
  const sources = `<h2>Tài liệu tham khảo</h2><ul>${post.sources.map(source => `<li><a href="${escape(source.url)}">${escape(source.title)}</a></li>`).join('')}</ul>`;
  const credit = `<p>Ảnh bìa minh họa: ${escape(post.cover.credit)}${post.cover.source ? ` — <a href="${escape(post.cover.source)}">Nguồn ảnh</a>` : ''}.</p>`;
  const body = `<p>${escape(post.introduction)}</p>\n${sections}\n${sources}\n${credit}`;
  const prefix = `${String(index + 1).padStart(2, '0')}-${post.slug}`;
  const metadata = `TIÊU ĐỀ: ${post.title}\nCHUYÊN MỤC: ${post.category}\nSLUG ĐỀ XUẤT: ${post.slug}\nSEO TITLE: ${post.title} | Arista\nMETA DESCRIPTION: ${post.description}\nTÓM TẮT: ${post.excerpt}\nẢNH BÌA: ${post.cover.src.replace('./', '')}\nALT ẢNH BÌA: ${post.cover.alt}\nTÁC GIẢ: Chọn hồ sơ Arista Music Center nếu có; không tạo danh tính cá nhân giả.\nTRẠNG THÁI: Lưu nháp, chưa xuất bản.\n\n`;
  await writeFile(new URL(`${prefix}.txt`, destination), metadata + 'NỘI DUNG BÀI — sao chép từ đoạn bên dưới:\n\n' + plain(body) + '\n\nLIÊN KẾT THAM KHẢO:\n' + post.sources.map(source => `${source.title}\n${source.url}`).join('\n\n'), 'utf8');
  await writeFile(new URL(`${prefix}.html`, destination), `<!doctype html><html lang="vi"><meta charset="utf-8"><title>${escape(post.title)}</title><style>body{max-width:760px;margin:40px auto;padding:0 24px;font:17px/1.8 Arial;color:#171a38}h2{font-size:25px}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:10px}</style><h1>${escape(post.title)}</h1><p><em>Bản để sao chép nội dung vào Wix Blog. Chèn ảnh tại vị trí được đánh dấu; chưa xuất bản.</em></p><hr><article>${body}</article></html>`, 'utf8');
}
console.info(`Exported ${posts.length} drafts to output/blog-import (HTML and text).`);

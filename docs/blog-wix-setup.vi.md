# Tích hợp Góc học nhạc với Wix Blog

Trạng thái ngày 22/11/2026: đã tạo và lưu `Public/custom-elements/arista-blog.js` và `Public/arista-blog-page.js` trong Editor Arista. Sau đó code local có chỉnh thêm xử lý Post chưa có dữ liệu và font; cần dán lại hai tệp build mới nhất trước khi Preview. Chưa xác nhận chèn được Custom Element; chưa dán page code, tạo ba bài nháp, thay menu trang chủ hoặc Publish. Từ đây người dùng thao tác Wix, trợ lý sửa code và kiểm tra khi cần.

## Thao tác tiếp theo trong Editor (người dùng làm)

Làm trang **Blog** trước để kiểm tra kết nối; chưa cần làm cả hai trang một lúc.

1. Backend & Public → mở `custom-elements/arista-blog.js`, thay toàn bộ nội dung bằng `dist/arista-blog.js` mới nhất trong project. Làm tương tự `Public/arista-blog-page.js` với `dist/arista-blog-page.js`. Dùng Ctrl+A trong vùng code, dán rồi Save; không dán nhầm vào trang chủ.
2. Chuyển Page sang **Blog**. Add Elements (+) → Embed Code → Custom element → bấm nút **+** bên phải mục này. Chỉ bấm chữ tiêu đề có thể không chèn phần tử. Nếu đã có một Custom Element thì chọn nó, không thêm lần nữa.
3. Chọn phần tử vừa thêm → Choose Source/cấu hình nguồn: chọn **Velo file**, tệp `custom-elements/arista-blog.js`; Tag name: `arista-blog`. Trong Properties & Events, đặt ID là `aristaBlog` (ô ID không nhập dấu #).
4. Đặt phần tử trong vùng nội dung của trang Blog, trên feed hiện tại; kéo giãn ngang bằng tùy chọn Stretch nếu có. Không đặt vào header/footer dùng chung. Tạm giữ header/footer và feed Wix để có thể kiểm tra fallback.
5. Mở **page code của Blog**, thay code mặc định bằng nội dung `src/wix/arista-blog.page.js`. Không dán vào `masterPage.js` hoặc tệp Public.
6. Save → Preview/Test Site. Giao diện “Góc học nhạc” phải xuất hiện hoặc hiển thị trạng thái chưa có bài; không chỉ kiểm tra trong canvas Editor. Nếu feed Wix cũ vẫn hiện, gửi lỗi console có tiền tố `ARISTA BLOG` để sửa trước.
7. Khi Blog chạy được, lặp lại bước 2–5 trên trang **Post**, cùng ID/tag/source, nhưng page code dùng `src/wix/arista-blog-post.page.js`. Giữ `post1` để lấy bài hiện tại và fallback.

Chưa Publish. Sau khi xác nhận Preview mới chỉnh layout riêng trang, nhập nội dung, ảnh và menu. Cần kiểm tra cả chiều cao trang, vì Custom Element phải hiển thị hết footer và bài dài trên Wix; local chưa chứng minh điều này.

## Kiến trúc dữ liệu

- Khách soạn bài trong Wix Blog. Không tạo collection bài viết thứ hai.
- Custom Element `arista-blog` hiển thị giao diện riêng. Cùng một payload tạo giao diện và `seoMarkup`.
- Trang Blog hiện có `/blog`, phần tử Wix feed có ID `blog1`. Trang Post có phần tử `post1` hỗ trợ `getPost()`. Hai ID đã đọc trực tiếp trong Editor ngày 22/11/2026; chưa đổi chúng.
- Giữ trang Post và cấu trúc URL/SEO của Wix. Ưu tiên URL hợp lệ từ `postPageURL` hoặc `postPageUrl`. Runtime Test Site đã xác nhận trả `postPageUrl: /unknown` cho bài đã xuất bản; native feed cùng site xác nhận URL `/post/nguoi-moi-hoc-piano-nen-bat-dau-tu-dau`. Vì vậy cấu hình `postBasePath: /post/` làm fallback từ slug, không tự giả định prefix cho site khác. Bản sửa `blog-route-fix-3` đã kiểm thử local, cần người dùng dán lại Public module lên Wix và cập nhật Test Site.
- Đọc công khai `Blog/Posts`, `Blog/Categories`, CMS cấu hình Arista và hồ sơ công khai `Members/PublicData`. Không nâng quyền, đọc drafts hay thông tin liên hệ riêng tư. Chưa có hồ sơ công khai thì ghi “Tác giả”, không tự gán một người khác.
- Form dùng lại `backend/trial-registration.web` hiện có. Không thay backend form hoặc ID form.

## File cần đưa lên Wix khi triển khai

Chạy `npm run check`, sau đó dùng:

| File project | Đích Wix |
| --- | --- |
| `dist/arista-blog.js` | `Public/custom-elements/arista-blog.js`, nguồn Velo file của CE |
| `dist/arista-blog-page.js` | `Public/arista-blog-page.js` |
| `src/wix/arista-blog.page.js` | Page code của trang Blog |
| `src/wix/arista-blog-post.page.js` | Page code của trang Post |

Không chọn file `src/components/arista-blog.js` làm nguồn trực tiếp vì còn import CSS.

Trên mỗi trang Blog/Post, thêm một Custom Element có ID `aristaBlog`, tag `arista-blog`. Chọn nguồn bundle ở trên, căn toàn chiều rộng và kiểm tra chiều cao khi bài dài trên desktop/mobile. Giữ `blog1`/`post1`, không xóa ứng dụng Wix Blog. Code chỉ collapse thành phần native sau khi tải được dữ liệu phù hợp; khi lỗi hoặc định dạng chưa hỗ trợ sẽ giữ viewer native.

Khi gắn CE thành công, dùng thiết lập layout **riêng từng trang** để bỏ header/footer Wix cũ, vì CE đã chứa phần đăng ký/footer chung. Không xóa SITE_HEADER hoặc SITE_FOOTER dùng chung toàn website. Xác nhận cả chế độ fallback vẫn có đường điều hướng phù hợp trước khi xuất bản.

## Nội dung và giới hạn cần kiểm thử trên Wix

- Đã hỗ trợ đoạn văn, tiêu đề, liên kết, chữ đậm/nghiêng, danh sách, ảnh, gallery cơ bản, bảng, trích dẫn và YouTube nhúng.
- Đã chốt dùng YouTube cho video trước. Video HTTPS ngoài YouTube hiện là liên kết mở video. Video upload trực tiếp Wix và khối HTML/embed/app chưa hỗ trợ trong renderer riêng: toàn bài giữ viewer Wix, không âm thầm bỏ nội dung.
- Phân trang 12 bài, chuyên mục không có bài nổi bật; “Tất cả” có bài nổi bật ở trang đầu. Chỉ đọc bài đã công khai trong `Blog/Posts`.
- Ba bài đang ở dữ liệu local; chưa đưa vào Wix. Bản nháp không đọc qua collection public: Preview bài nháp phải dùng viewer Wix. Không publish bài chỉ để vượt qua giới hạn này khi chưa thống nhất.
- Ảnh trong bài cần tải lên Wix Media Manager và chèn vào bài bằng Blog composer. Giữ ghi nguồn ảnh, tài liệu tham khảo và liên kết nội bộ sau khi nhập. Xem `assets/images/blog/sources.json`.
- Avatar tác giả: lấy hồ sơ công khai, tên trùng brandName dùng nền logo; ảnh người dùng cover; thiếu ảnh hiện chữ cái. Khi đổi nickname hoặc ảnh cần xác nhận lại payload thật.
- Khi chuyển bài trong cùng trang Post, cần kiểm tra Wix có chạy lại page lifecycle và `getPost()` hay không. Chưa coi kiểm thử local là chứng minh hành vi này trên Wix.

## Điều kiện trước khi Publish

1. Bundle và page code thực sự được lưu trên hai trang; các phần tử native dùng đúng ID.
2. Kiểm tra trên Wix Preview bằng một bài đã công khai phù hợp; không để URL mẫu `wix.com/demone2` lọt vào menu/kết quả thật. Sáu bài template cần được xác nhận trong Manage Posts trước khi thay hoặc đưa vào thùng rác.
3. Không trùng header, footer, H1, bài viết hoặc markup Article. Giữ canonical/title/description do Wix Blog quản lý; kiểm tra riêng từng bài.
4. Kiểm tra mobile, link bài, lọc, phân trang, mục lục, ảnh/bảng/video và form. Chỉ gửi đăng ký thử đến backend khi được chỉ định; kiểm thử local dùng demo response.
5. Chạy URL Inspection/Live Test sau khi xuất bản và xem HTML rendered. Không kết luận chắc chắn index hoặc xếp hạng từ unit test.

## Nguồn kỹ thuật đã đối chiếu

- https://dev.wix.com/docs/api-reference/business-solutions/cms/collection-management/wix-app-collections/wix-blog-collections
- https://dev.wix.com/docs/velo/velo-only-apis/$w/post-page/get-post
- https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/seo-markup
- https://dev.wix.com/docs/api-reference/business-solutions/cms/collection-management/wix-app-collections/wix-members-collections
- Renderer Ricos dựa trên mã `wix-headless-templates/blog/project/src/wix/rich-content.ts` của plugin Wix, điều chỉnh YouTube và kiểm tra khối chưa hỗ trợ.

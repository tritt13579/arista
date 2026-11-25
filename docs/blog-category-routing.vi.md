# Bộ lọc chuyên mục Blog — phương án A

## Thay hai file trong Wix

Sau khi chạy `npm run build`, thay toàn bộ nội dung rồi Save:

| File trong project | File trong Wix |
| --- | --- |
| `dist/arista-blog.js` | `Public/custom-elements/arista-blog.js` |
| `dist/arista-blog-page.js` | `Public/arista-blog-page.js` |

Hai trang dùng chung hai file này. Giữ page code Blog/Post, slug category và cấu hình index hiện tại. Thử Test Site trước khi Publish live.

## Luồng sau thay đổi

- `/blog` hiển thị tất cả bài, tiêu đề “Góc học nhạc”.
- Bấm Piano tại `/blog`: lọc tại chỗ, URL thành `/blog?category=piano&page=1`. Không dựng lại header, footer, form đăng ký.
- Slug lấy từ URL chuyên mục đã cấu hình trong Wix, không suy ra từ tên. URL cũ dùng ID vẫn được hỗ trợ; các link mới dùng slug.
- Khi đổi bộ lọc/phân trang, chờ danh sách cập nhật rồi cuộn thanh lọc tới dưới header cố định, chừa 16px. Back/Forward không gọi thêm thao tác cuộn này.
- Phân trang thành `...&page=2`. Đổi chuyên mục luôn về `page=1`.
- Bấm Tất cả trở về `/blog`, bỏ cả `category` và `page` trong một thao tác.
- Trang 2 của Tất cả dùng `/blog?category=&page=2`.
- Mỗi lần bấm chỉ gọi một API cập nhật query Wix. Không gọi add rồi remove liên tiếp, không tự dùng History API trong custom element.
- Back/Forward nhận URL qua `wixLocationFrontend.onChange` và đồng bộ lại danh sách. Tải lại/chia sẻ URL khôi phục bộ lọc và trang.
- Nhãn chuyên mục trên thẻ/bài viết trỏ tới `/blog?category=piano&page=1`. Đây là điều hướng bình thường; lọc tại chỗ áp dụng cho thanh lọc và phân trang trên `/blog`.
- Ctrl/Cmd + click hoặc mở tab mới dùng liên kết thật.
- Giữ query khác như `rc=test-site`, `utm_source` khi đổi bộ lọc.
- Chuyên mục trống hiện thông báo. ID không tồn tại trên `/blog` hiện “Không tìm thấy chuyên mục”.
- `/blog/categories/piano` vẫn tồn tại: hiển thị tiêu đề/mô tả Piano và đúng bài. Chọn chuyên mục khác hoặc Tất cả từ trang này điều hướng về `/blog?...`; sau đó lọc tại chỗ.
- Phân trang trên URL category gốc giữ đường dẫn category và dùng liên kết điều hướng bình thường.

## SEO

Giữ thiết lập index, title, description và canonical do Wix quản lý. Code cung cấp nội dung SEO markup phù hợp URL, không sửa canonical hoặc bật/tắt index. Code không thêm URL query thành trang riêng trong sitemap.

## Kiểm tra sau khi thay file

1. Mở `/blog?rc=test-site`, chọn Piano → Violin → Tất cả. Kiểm tra URL, nhãn chọn và số bài; dùng thanh lọc tại `/blog` không tải lại trang.
2. Gõ thử thông tin vào form đăng ký, đổi bộ lọc rồi kiểm tra thông tin vẫn còn.
3. Nếu có trên 12 bài trong một nhóm: chọn trang 2 → nhóm khác. URL mới có `page=1`; Back một lần trở lại nhóm trước, trang 2. Forward trở lại nhóm mới.
4. Tải lại URL đang lọc, kiểm tra đúng nhóm/trang. Thử mở link bộ lọc trong tab mới.
5. Mở `/blog/categories/piano?rc=test-site`, kiểm tra nội dung Piano; bấm nhóm khác chuyển về `/blog?...`.
6. Mở bài viết, bấm nhãn chuyên mục ở đầu/cuối bài để vào danh sách đã lọc.
7. Kiểm tra trên điện thoại, chuyên mục trống và ID không tồn tại.
8. Trong Search Console Live Test, kiểm tra nội dung render và canonical của `/blog`, một URL query và một URL category. Kiểm thử cục bộ không xác nhận metadata do Wix xuất trên live.

## Đã kiểm tra cục bộ

`npm run check` và trình duyệt với custom element + Velo bridge thực, API Wix được mô phỏng: lọc, phân trang, mỗi thao tác một cập nhật URL, Back/Forward, giữ DOM/form, tải lại, URL category, query Test Site/campaign và mobile.

Cần kiểm tra trên Wix Test Site vì môi trường cục bộ không chạy router, SEO engine và API thực của Wix. Nếu URL category gốc trả HTTP 404, cần kiểm tra route đang publish trong Wix; code bộ lọc không sửa route của ứng dụng Wix.

## Kiểm tra sửa lỗi cuộn và URL slug

- Đã tái hiện trên Wix Test Site bản cũ: header cao 88px nhưng thanh lọc bị cuộn lên vị trí gần 0px, nên bị che.
- Thử file custom element mới bằng cách thay response trong trình duyệt kiểm tra, không thay file Wix: desktop thanh lọc ở 103.625px sau header 88px; mobile ở 91.969px sau header 76px. Thông báo chuyên mục trống hiển thị dưới thanh lọc.
- Luồng URL slug được kiểm tra cục bộ với Velo bridge thực và API Wix mô phỏng. Cần thay cả hai file để bridge trên Wix cũng ghi query bằng slug.

# Thêm Cảm nhận học viên và phụ huynh vào Wix

Code và CSV đã sẵn sàng trong source. Cần thực hiện các bước dưới đây trong Wix;
chưa có thay đổi nào được tự động publish lên site.

## 1. Tạo collection mới

Trong CMS, tạo collection tên **Arista — Testimonials**.
Collection ID phải đúng: **AristaTestimonials**.

Import file `cms/import/AristaTestimonials.csv`. File chứa sáu lời chia sẻ.
Dùng tên cột làm Field ID và kiểm tra kiểu dữ liệu:

| Field ID | Kiểu | Ý nghĩa |
|---|---|---|
| `title` | Text | Tên người chia sẻ; dùng field Title có sẵn nếu ID là `title`. |
| `role` | Text | Thông tin dưới tên, ví dụ Học viên · Violin hoặc Phụ huynh Nguyên Huy. |
| `excerpt` | Text | Trích đoạn ngắn hiện khi chưa bấm Đọc đầy đủ. |
| `quote` | Text | Toàn bộ chia sẻ hiện khi bấm Đọc đầy đủ. |
| `photo` | Image | Ảnh chân dung tùy chọn. Để trống thì hiện chữ viết tắt của tên. |
| `photoFocusHeight` | Number | Căn chân dung: 0 phía trên, 50 giữa, 100 phía dưới. |
| `show` | Boolean | Bật để hiện người này; tắt để ẩn mà không xóa. |

Khi import Boolean, chọn giá trị **true** là bật, **false** là tắt. Sau import,
kiểm tra sáu ô `show` đều được tick. `excerpt` và `quote` dùng Text, không dùng
Rich Text. Ảnh đang để trống trong CSV; chọn ảnh thật trong Media Manager sau.

Quyền collection: khách truy cập **Everyone** được đọc; chỉ quản trị viên/người
quản lý nội dung được thêm, sửa và xóa. Section này không thu nhận đánh giá từ khách.

Mỗi hàng là một lời chia sẻ; có thể thêm hàng mới. Số đếm trên trang tự cập nhật.
Thứ tự lấy theo dataset như các danh sách hiện có. Mặc định hiện lời chia sẻ đầu
tiên đang bật `show`. Các trích đoạn đã được biên tập ngắn từ nội dung bạn cung cấp;
client có thể chỉnh lại `excerpt` và `quote` trong CMS.

## 2. Thêm một dòng vào AristaPageContent

Mở collection **AristaPageContent** đang có. Import file
`cms/import/AristaPageContent-testimonials-only.csv` theo cách **thêm bản ghi mới**,
giữ các bản ghi cũ. File này chỉ có một dòng Testimonials.

Không cần tạo field mới trong collection này. Map các cột vào đúng field có sẵn.
Nếu đã có dòng `sectionKey = testimonials`, sửa dòng đó thay vì import lần nữa.

Các giá trị cần kiểm tra:

- `sectionKey`: **testimonials** (không đổi).
- `introText`: Cảm nhận từ Arista.
- `heading`: Arista qua lời học viên và phụ huynh.
- `description`: Những chia sẻ về hành trình học tập, sự tiến bộ và niềm vui cùng âm nhạc.
- `showSection`: **true** để hiện section.
- `showInMenu`: **false** để giữ menu hiện tại gọn.

Code đặt section sau Khoảnh khắc, trước FAQ; thứ tự dòng Page Content không đổi
vị trí section trên trang. Không import lại toàn bộ `AristaPageContent.csv`, vì
bản local có thể khác các nội dung bạn đã chỉnh trong Wix.

## 3. Thêm dataset trên đúng page Arista

Trong Wix Editor, mở page Arista đang dùng custom element `aristaHome`:

1. Thêm một **Dataset**, kết nối với **AristaTestimonials**.
2. Đặt Element ID: **testimonialsDataset**.
3. Chọn chế độ **Read only**.
4. Không thêm sort hoặc filter nếu muốn giữ cách lấy danh sách như hiện tại.
5. Không cần kéo thêm repeater, text hoặc ảnh trên canvas; custom element tự render.

Nếu collection dùng Sandbox/Live, bảo đảm dữ liệu đã có ở môi trường bạn đang test.

## 4. Cập nhật code

Sau khi collection và dataset đã sẵn sàng:

1. Thay page code Arista bằng `src/wix/arista-preview.page.js`.
2. Thay nội dung Velo File custom element đang dùng bằng `dist/arista-home.js`.
3. Giữ Element ID **aristaHome**, tag **arista-home**. Không sửa backend đăng ký.
4. Save, mở **Test Site** và tải lại trang.

## 5. Kiểm tra trước khi publish

- Section hiện sau Khoảnh khắc, có sáu người và số đếm `01 / 06`.
- Hai mũi tên nằm giữa vòng tròn trên desktop và mobile.
- Bấm tên hoặc mũi tên: nội dung và trạng thái được chọn khớp nhau.
- Bấm Đọc đầy đủ/Thu gọn: chiều cao chuyển nhẹ, không để chữ bị cắt sau khi xong.
- Bấm nhanh nhiều lần vẫn hiện đúng trạng thái cuối.
- Tắt `show` của một người rồi reload: danh sách và tổng số cùng giảm.
- Tắt `showSection` của Testimonials rồi reload: section được ẩn.
- Đổi tên, trích đoạn, nội dung hoặc ảnh trong CMS rồi reload: giao diện cập nhật.

Tham khảo hướng dẫn import của Wix:
https://support.wix.com/en/article/importing-data-to-a-database-collection

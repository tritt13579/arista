# Thêm section Ghi nhận & dấu ấn lên Wix

Section nằm sau Giảng viên, trước Thành tích học viên. Bản local có sẵn 7 ghi nhận từ 8 ảnh client cung cấp; hai ảnh giấy khen “Kiến Tạo Tài Năng” trùng nội dung nên chỉ dùng ảnh `a7c28699...`.

## 1. Tạo collection

Tạo collection có ID **AristaRecognitions**. Import `cms/import/AristaRecognitions.csv`, rồi kiểm tra kiểu field:

| Field ID | Kiểu | Hướng dẫn cho người cập nhật |
|---|---|---|
| title | Text | Tên bằng khen hoặc ghi nhận; hiện bên cạnh ảnh và khi mở ảnh lớn. |
| category | Text | Nhập “Trung tâm” hoặc “Giảng viên”; hiện phía trên tên ghi nhận. |
| recipient | Text | Người hoặc đơn vị nhận. Cần ghi đúng trung tâm hay cá nhân. |
| issuer | Text | Tên đơn vị trao hoặc sự kiện; hiện trong phần thông tin bên phải. |
| year | Number | Năm ghi nhận, ví dụ 2026; hiện trong thông tin và dưới thumbnail. |
| description | Text | Một hoặc hai câu giải thích nội dung ghi nhận. |
| image | Image | Chọn ảnh bằng khen / kỷ niệm chương từ Wix Media Manager. CSV để trống field này. |
| imageFocusHeight | Number | Giữ 50. Section này luôn hiện toàn bộ ảnh nên không dùng vị trí cắt ảnh. |
| show | Boolean | Bật để hiện bản ghi; tắt để ẩn. Cần có ảnh mới xuất hiện ngoài trang. |

Cho phép khách truy cập đọc collection. Áp dụng thứ tự CMS lên site và đặt thứ tự mong muốn; ảnh đầu tiên là ảnh mặc định. Có thể thêm hoặc ẩn dòng bất kỳ; dải thumbnail cuộn ngang khi nhiều ảnh.

## 2. Chọn ảnh cho 7 dòng

Ảnh ở `assets/images/chung-chi-cua-trung-tam/`; upload lên Wix rồi chọn ở field `image`:

| Tên ghi nhận | File ảnh |
|---|---|
| Giấy khen dành cho Trung tâm Arista Music Center | 736c6344-1f73-4626-8653-573e58852406.jpg |
| Đơn vị đồng hành Festival Piano Talent toàn quốc | 637ecaa4-be44-4a9f-9a6c-475bc54a70b7.jpg |
| Kỷ niệm chương tri ân nhà tài trợ | 860f9ec2-3943-4ead-88b3-92399cfc48f2.jpg |
| Kiến Tạo Tài Năng — Empowering Talent | a7c28699-af6a-49a4-8163-58ce6ac78176.jpg |
| Teacher Appreciation — Crescendo 2025 | caabc819-1437-4cd2-8bf1-2867916463ff.jpg |
| Award of Best Performing Teacher | 04e075bf-7ed8-49f0-990e-d876f649eb8a.jpg |
| Teacher Appreciation — Crescendo 2024 | 026447fb-caa4-413f-adb8-e99f60c8188f.jpg |

Nội dung mẫu được đọc từ ảnh client cung cấp, nên client kiểm tra lại cách ghi tên sự kiện/đơn vị trao trước khi publish.

## 3. Thêm nội dung section

Import **chỉ** `cms/import/AristaPageContent-recognitions-only.csv` vào collection **AristaPageContent** đang có, theo cách thêm dòng mới. Không xóa hay import đè toàn bộ dữ liệu cũ. Nếu đã thêm dòng `sectionKey = recognitions` thì chỉnh dòng đó, tránh tạo trùng.

`showSection = true` bật section. `showInMenu = false` mặc định để không làm menu dài thêm; có thể bật và đặt `menuLabel` nếu muốn. Tiêu đề và mô tả nằm ở dòng này.

## 4. Nối dataset và cập nhật code

Trên trang chủ trong Wix Editor, thêm dataset nối **AristaRecognitions**, chế độ **Read**, ID **recognitionsDataset**, không đặt sort để dùng thứ tự CMS như các collection trang chủ khác.

- Cập nhật `public/custom-elements/arista-home.js` bằng nội dung `dist/arista-home.js` đã build.
- Cập nhật **page code trang chủ** bằng `src/wix/arista-preview.page.js` mới. Không dán vào masterPage.js.
- Không cần sửa code hoặc CMS của program page.

Lưu, tạo/cập nhật Test Site. Nếu có Sandbox/Live riêng, đồng bộ dữ liệu sang môi trường đang test.

## 5. Kiểm tra

Trên local, mở `index.html` bằng Live Server và cuộn đến sau Giảng viên. Trên Wix, kiểm tra ảnh đầu tiên, 7 thumbnail, đổi nhanh nhiều ảnh, mở ảnh lớn rồi Escape và giao diện điện thoại. Không có autoplay. Ảnh dọc/ngang đều giữ đầy đủ nội dung; lỗi tải có thông báo và cho chọn lại.

Hiệu ứng xuất hiện dùng GSAP hiện có: ảnh mở dần từ trái, thông tin hiện lệch nhịp, thumbnail hiện nối tiếp. Đổi ảnh fade 320 ms sau khi tải và giải mã; giảm/tắt chuyển động theo thiết lập thiết bị.

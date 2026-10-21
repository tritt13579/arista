> Cập nhật mới: cung C dùng collection riêng `AristaHeroImages`, không còn tự lấy từ Recognitions/AchievementPhotos và không giới hạn 10 ảnh. Xem [hướng dẫn hiện tại](../../hero-images-wix-setup.vi.md). Các mô tả nguồn ảnh/giới hạn cũ bên dưới là lịch sử các phương án trước.

# Hero đã chốt — nền kem, cánh cung chữ C ngược

## Nội dung và ảnh

Hero giữ chữ, slogan, mô tả và hai nút từ dòng `hero` trong AristaPageContent. Khối 4 số liệu cũ không còn hiển thị ở hero; dữ liệu CMS được giữ nguyên.

Cụm ảnh dùng dữ liệu hiện có, không thêm collection:

- `AristaRecognitions` → ảnh ghi nhận.
- `AristaAchievementPhotos` → ảnh thành tích học viên.
- Lấy các dòng bật `show`, có ảnh hợp lệ, trong các section đang bật hiển thị; xen kẽ một ghi nhận và một thành tích, theo thứ tự CMS mỗi bảng.
- Bỏ ảnh trùng URL, tối đa 10 ảnh. Khi có ít hơn 10, các ảnh được trải đều theo toàn bộ cung.
- Thay ảnh bằng field `image`, tên ảnh trong nhãn hỗ trợ truy cập lấy từ `title`. Không hiển thị chú thích dưới cánh cung.
- Không có ảnh: hero vẫn hiện chữ/nút, thu về một cột. Ảnh tải lỗi có tên ảnh thay thế trong khung.
- `hero.image` và `imageFocusHeight` của ảnh nền cũ không dùng để vẽ background nữa. Không cần xóa tài sản trong Media Manager.

## Hành vi

Ảnh luôn giữ màu. Hover/focus hoặc chạm chọn ảnh sẽ đưa ảnh lên trước để xem rõ hơn. Chạm lại ảnh đang chọn bỏ trạng thái chọn. Không mở ảnh lớn từ cụm hero; các section ghi nhận/thành tích bên dưới vẫn giữ trình xem chi tiết.

Load ban đầu: chữ hiện lần lượt, tiêu đề mở theo dòng; ảnh fade và dịch chuyển nhẹ theo thứ tự. Không chờ tải hết ảnh mới hiện chữ. Cuộn thay đổi scale/rotation trong cánh cung, có nội suy mềm; không pin hoặc chiếm quyền cuộn. Tôn trọng prefers-reduced-motion.

## Kiểm tra local và cập nhật Wix

1. Mở `index.html` bằng Live Server. Chỉ có một hero, không còn mẫu so sánh.
2. Kiểm tra desktop, mobile, menu điều hướng, hover/chạm ảnh và chế độ giảm chuyển động.
3. Cập nhật `public/custom-elements/arista-home.js` trên Wix bằng `dist/arista-home.js` mới.
4. Nếu trang đang dùng phiên bản đã hỗ trợ Recognitions, không cần đổi page code hoặc import lại CMS. Nếu chưa có Recognitions, làm theo `docs/recognitions-wix-setup.vi.md` để nối dataset và page code; hero vẫn dùng ảnh thành tích sẵn có nếu dữ liệu đó được truyền vào.
5. Save và cập nhật Test Site để kiểm tra trước khi Publish.

Chưa có thao tác cập nhật hoặc Publish Wix trong lần sửa source này.

## Bố cục desktop hiện tại — hướng A

Theo lựa chọn mới: thu cụm ảnh để thấy trọn hero. Dùng tối đa 10 ảnh, trải đều trên đường cung chữ C ngược, không còn chú thích phía dưới.

- Main có chiều cao tối thiểu `min(734px, 100svh)`, tương ứng nhịp chiều cao hero cũ.
- Kích thước cung bị giới hạn thêm bởi chiều cao còn lại sau padding và khoảng đệm; co cả width/height theo cùng tỷ lệ, không ép méo ảnh hoặc cắt nội dung.
- Cửa sổ desktop thấp (≤720px): giảm khoảng cách, tiêu đề, slogan và chữ mô tả để nội dung mẫu vừa màn hình.
- Cột chữ căn xuống theo hero cũ; cụm ảnh căn giữa độc lập. Khoảng đệm dưới trên desktop thông thường là 72px và giảm theo chiều cao màn hình. Nội dung CMS dài hơn, browser zoom lớn hoặc màn rất thấp có thể làm section giãn tự nhiên, không dùng height cố định để giấu phần dư.
- Mobile giữ bố cục dọc và cuộn tự nhiên; không thu cả hero vào một màn điện thoại.

Đã đo local với dữ liệu mẫu: 1366×768 → hero 734px, 1280×720 → 720px, 1440×900 → 734px, 1024×600 → 600px. Lần đo kích thước trên dùng 8 ảnh. Sau đó đã đổi giới hạn trở lại 10 ảnh theo yêu cầu, giữ nguyên quy tắc tính kích thước cung.

## Tinh chỉnh nhịp ảnh

Giảm góc xoay ban đầu còn khoảng 4–5 độ và làm bóng nhẹ hơn. Ảnh hiện nối tiếp cách nhau 55ms, fade và dịch nhẹ trong 800ms. Desktop ở đầu trang bắt đầu với tiến độ cuộn bằng 0; scale từ 1.35 lên tối đa 1.43, góc xoay chỉ thay đổi thêm nhẹ khi cuộn. Cuộn ngược về đầu khôi phục trạng thái ban đầu. Chế độ giảm chuyển động giữ ảnh tĩnh.

Đã kiểm tra lại với 10 ảnh ở desktop 1440×900, 1366×768, 1280×720, 1024×600 và mobile 390×844; không tràn ngang. npm run check đã qua.


## Cung ảnh trên màn hình lớn

Với viewport từ 1440px rộng và 800px cao, hero dùng chiều cao clamp(734px, 100svh - 24px, 900px) để cung ảnh có thêm chỗ. Màn thấp và mobile giữ quy tắc cũ. Đo ở 1920×1080: canvas cung rộng 435px (trước khoảng 324px), hero cao 900px; 1920×900: canvas 419px, hero 876px. Tất cả 10 ảnh nằm trong hero, không tràn ngang. Đã kiểm tra thêm 1440×900, 1366×768, 1280×720, 390×844 và npm run check.


## Co giãn theo viewport thực tế (thay thế ngưỡng màn lớn phía trên)

Desktop dùng frame min(100svh, 900px). Cột ảnh tận dụng riêng khoảng từ 104px dưới đầu hero tới 24px trước cuối hero, độc lập với padding cột chữ. Canvas lấy kích thước nhỏ hơn giữa 86% chiều rộng cột và chiều cao khả dụng quy đổi theo tỷ lệ 4/6; bỏ giới hạn canvas 440px và breakpoint tăng kích thước 1440×800. Vì vậy scale hệ điều hành/zoom trình duyệt tự phản ánh qua viewport CSS. Khoảng đệm dành cho card có transform được giữ lại. Mobile không thay đổi.

Đã đo 1536×730: canvas 388px, ảnh từ y91 tới y682, hero 730px; 1536×864: canvas 470px; 1920×1080: canvas 470px, hero 900px. Đã kiểm tra thêm 1366×768, 1280×720, 1024×600, 800×600 và 390×844: không tràn ngang, ảnh không đè cột chữ. Đã kiểm tra entrance bình thường và chế độ giảm chuyển động.


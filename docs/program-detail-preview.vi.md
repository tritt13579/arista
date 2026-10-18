# Hai trang mẫu bộ môn: Piano và Violin

## Mở bản mẫu

Chạy `npm run build`, mở thư mục dự án bằng Live Server rồi vào:

- `http://127.0.0.1:5500/piano.html`
- `http://127.0.0.1:5500/violin.html`

Trang chủ local có thêm liên kết **Khám phá bộ môn →** trong card Piano/Violin.
Thanh đầu trang mẫu có liên kết chuyển giữa hai bộ môn. Liên kết **Các bộ môn**
đưa về section bộ môn trên trang chủ local.

Đây là bản duyệt giao diện local. Chưa tạo trang hoặc collection mới trên Wix.
Form chỉ mô phỏng gửi thành công, không gửi thông tin đến Wix, CRM hoặc email.
Các file HTML mẫu có `noindex, nofollow`.

## Khung bố cục đồng nhất với trang chủ

- Khung nội dung tối đa 1240px, đã bao gồm padding hai bên 24px; phần nội dung bên trong tối đa 1192px. Mobile dùng lề 20px.
- Khoảng cách section theo trang chủ: 110px trên desktop, 80px trên tablet và 60px trên mobile.
- Hero dùng tỷ lệ cột và breakpoint của trang chủ; từ 768px trở xuống chuyển thành một cột. Giữ ảnh vòm và nội dung riêng của trang bộ môn.
- Các section và ảnh giảng viên cuộn tự nhiên, không bị ép theo chiều cao màn hình. Riêng hero desktop giới hạn chiều cao ảnh và giảm khoảng cách/cỡ chữ ở màn hình thấp để thấy đủ nút đăng ký và các nhãn thông tin ngay màn hình đầu; nội dung CMS dài hoặc phóng to chữ vẫn được phép mở rộng, không bị cắt.
- Nền Hành trình và Giảng viên tràn ngang, nội dung bên trong vẫn cùng lề với các section khác. Form và footer tiếp tục dùng CSS chung với trang chủ.
- Cửa sổ xem ảnh/video vẫn giới hạn theo màn hình để giữ nút đóng và điều khiển trong vùng nhìn.

## Nội dung đang dùng

- Giới thiệu, mục tiêu và các chặng học là bản nháp, cần client duyệt.
- Piano có hai vị trí giảng viên: hồ sơ thầy Trần Hữu Nhật Hoàng lấy từ dữ liệu
  trang chủ; hồ sơ thứ hai là chỗ giữ, chưa có tên, bằng cấp hoặc ảnh thật.
- Violin có 3 hồ sơ để duyệt layout: một hồ sơ từ trang chủ, vẫn là tên chung
  “Giảng viên Violin”, và hai hồ sơ chờ bổ sung, không có tên/bằng cấp/ảnh giả.
- Piano vẫn giữ hai mục thành tích mẫu trong dữ liệu local để khôi phục sau;
  section và mục điều hướng hiện được comment, không hiển thị.
  Client cần xác nhận nội dung, hình ảnh trước khi sử dụng chính thức.
- Violin không có dữ liệu thành tích nên cả section và liên kết điều hướng được ẩn.
- Ảnh hiện dùng lại tài nguyên trang chủ; một số ảnh là hoạt động chung của trung tâm.
- Piano minh họa 8 ảnh và 3 video. Violin có 12 ảnh và 8 video để thử ô xem thêm;
  các ảnh Violin từ vị trí thứ năm được lặp và ghi rõ là ảnh minh họa bố cục.
- Chưa có link YouTube cụ thể. Ô video hiển thị ảnh bìa/chỗ giữ; bấm vào mở
  danh sách video mẫu có thông báo chờ link, không phát video không liên quan.
- Không thêm phần đánh giá học viên.
- Form và footer dùng chung dữ liệu/component/CSS với trang chủ. Form chỉ khác
  ở bộ môn được chọn sẵn theo trang, và được chọn lại khi bấm gửi đăng ký khác.
  Logo footer đưa về đầu trang. Không có khối gợi ý bộ môn `pd-related`.

## Chỗ sửa bản mẫu

`src/preview/program-detail-data.js` tạo dữ liệu riêng của từng trang từ
`cms/content.json`. Có thể sửa:

- `headline`, `intro`: nội dung giới thiệu ngắn tại hero. Section Giới thiệu riêng
  đã được bỏ để tránh lặp nội dung, cùng các field `aboutTitle`, `about`, `benefits`.
- `journey`: các chặng học, không dùng như cam kết thời gian hoặc kết quả học tập.
- `teachers`: danh sách hồ sơ; đặt `show: false` để ẩn một hồ sơ.
- `gallery`: danh sách ảnh với `src`, `caption`, `focusHeight` (0–100, mặc định 50)
  và `show` (đặt false để ẩn). Không giới hạn tổng số ảnh trong viewer.
- `mediaLayout`: `editorial` (khung ngang xen kẽ) hoặc `portraits` (ảnh dọc nổi bật).
  Số lượng ảnh quyết định cách ghép các cụm; không phải tự sửa CSS từng bộ môn.
- `videos`: danh sách video, mỗi mục có `url`, `title`, `cover`, `description`,
  `show`. Link YouTube hỗ trợ dạng `watch?v=...`, `youtu.be/...`, `shorts/...`
  hoặc `embed/...`. URL chưa hợp lệ sẽ không hiển thị.
  `placeholder: true` chỉ dành cho chỗ giữ local khi chưa có link thật.
  Chỉ khi bấm xem mới tạo iframe, dùng `youtube-nocookie.com`; đóng, chuyển video
  hoặc render lại sẽ gỡ iframe cũ để dừng phát.
- `awards`: dữ liệu cũ được giữ để khôi phục; renderer và mục menu hiện được comment
  nên không hiển thị kể cả khi mảng có dữ liệu.
- `registration`, `footer`: lấy từ cùng adapter/dữ liệu CMS của trang chủ, không
  viết riêng nội dung cho từng trang. Bộ môn được chọn sẵn theo trang.

Thay đổi dữ liệu preview thì reload trang. Thay đổi component hoặc CSS thì chạy
`npm run build` hoặc dùng `npm run dev` để build tự động.

## Khoảnh khắc dài hơn và tự bố trí theo số lượng

Ngoài trang hiển thị tối đa 10 ảnh và 6 video, tính sau khi lọc các mục ẩn/thiếu
dữ liệu. Đúng 10 ảnh/6 video thì vẫn hiện ảnh/video bình thường. Chỉ khi vượt
giới hạn mới phủ ô cuối bằng “Xem tất cả N ảnh/video”, với N là tổng số mục.
Ô này chiếm một trong 10/6 vị trí, không tạo thêm card thứ 11/7.

- 1–6 ảnh: mỗi số lượng có một mẫu riêng, phối khung lớn và khung nhỏ.
- 7 ảnh: cụm 3 + 4; 8 ảnh: cụm 5 + 3; 9 ảnh: cụm 6 + 3; 10 ảnh: cụm 6 + 4.
- Video xen giữa các cụm ảnh. 1 video dùng khung nổi bật; 2 video chia đôi;
  từ 3 video trở lên có 1 khung nổi bật và lưới các video còn lại (2/3/4/5 mục).
- Mobile giữ các khung ảnh theo cụm và đưa video về một cột để dễ xem.
- Tất cả ảnh, kể cả ảnh vượt giới hạn, nằm trong viewer hiện có. Ảnh không có
  thumbnail ngoài trang đóng bằng fade theo hành vi đang dùng.
- Trang bộ môn ẩn chú thích phủ trên ảnh, nhãn góc thumbnail video và tên video
  dưới card. Tên video vẫn được dùng trong danh sách phát/cửa sổ video và nhãn
  truy cập. Viewer ảnh không hiện caption hay thông báo tải/nâng chất lượng;
  ảnh lớn tự thay vào sau khi tải và giải mã xong. Nếu còn ảnh xem trước thì giữ
  ảnh đó khi bản lớn lỗi; chỉ báo lỗi khi không có ảnh nào xem được. Tùy chọn này
  không thay đổi viewer đang dùng ở trang chủ.
- Video mở cửa sổ riêng với trình phát và toàn bộ danh sách. Chọn video vượt
  giới hạn ngay trong danh sách, hoặc dùng nút video trước/sau.
- Cửa sổ video dùng chiều cao theo viewport, dành sẵn chỗ cho tiêu đề và nút đóng;
  trình phát co theo phần còn lại, chỉ danh sách video được cuộn. Thanh cuộn mảnh
  màu vàng trầm trên nền navy. Màn hình ngang thấp chuyển về hai cột; ở chiều cao
  từ 450px trở xuống, bỏ nút trước/sau và chuyển video bằng danh sách để dành chỗ.
  Tiêu đề dài rút gọn tối đa hai dòng (một dòng khi màn hình thấp), có title để xem
  nội dung đầy đủ. Mục video đang chọn tự được đưa vào vùng nhìn của danh sách.
- Có thể để chỉ ảnh hoặc chỉ video; khi không có cả hai, ẩn phần Khoảnh khắc
  và mục điều hướng tương ứng.

## Animation riêng cho trang bộ môn

- Hero: tên bộ môn mở ngang, hai dòng slogan đi vào từ hai hướng ngắn, mô tả/nút/nhãn xuất hiện nối tiếp. Ảnh mở từ tâm trong khung vòm sau khi sẵn sàng, viền hiện sau; chữ không đợi ảnh. Desktop có parallax nhỏ trong vùng ảnh được cắt, mobile bỏ parallax.
- Heading section: nhãn, tiêu đề và mô tả có nhịp riêng. Hành trình dùng đường kẻ/số sáng dần theo vị trí cuộn, tên/mô tả mở xuống một lần.
- Giảng viên: ảnh mở dọc và sáng dần, tên hé ngang, học vị/thông tin hiện nối tiếp. Giữ kích thước các thẻ và ảnh như bố cục trước.
- Gallery: mở từng ảnh trong mỗi cụm qua mask dọc/ngang/từ tâm và lệch nhẹ lớp hình; ô xem thêm theo thứ tự cuối cụm. Vùng nút bấm đứng yên. Video mở ảnh bìa, hiện nút phát và quét sáng qua nút một lần.
- Đăng ký: khung form xuất hiện như thiệp mời, desktop nghiêng nhẹ 0,5 độ rồi về thẳng; phần liên hệ đi vào từ hướng đối diện. Footer mở nhẹ từ tâm. Không animate từng input.
- Hiệu ứng xuất hiện chạy một lần khi vào vùng nhìn. Đường kẻ Hành trình và parallax theo cuộn. Focus/bấm vào điều khiển sẽ hoàn tất hiệu ứng tương ứng để giữ khả năng thao tác.
- Dùng GSAP có sẵn, không thêm Motion, không pin section hoặc thay đổi chiều cao bố cục. Dùng IntersectionObserver và một vòng requestAnimationFrame theo sự kiện cuộn, không gọi ScrollTrigger.refresh() toàn trang. Điểm cuộn menu vẫn căn nội dung cách dưới menu 24px.
- Tôn trọng prefers-reduced-motion: bỏ toàn bộ hiệu ứng mới và hiển thị nội dung ngay. Thay breakpoint hoặc render CMS mới sẽ dọn timeline/listener/style của lần trước. Skeleton vẫn dùng cơ chế hiện có.

## Cấu trúc code

- `piano.html`, `violin.html`: hai đường dẫn local.
- `src/preview/program-detail.js`: nạp dữ liệu mẫu.
- `src/preview/program-detail-data.js`: nội dung nháp, liên kết dữ liệu trang chủ.
- `src/components/arista-program.js`: component riêng `<arista-program>`.
- `src/utils/program-hero-animation.js`: chuỗi mở đầu hero và parallax ảnh desktop.
- `src/utils/program-scroll-animation.js`: hiệu ứng cuộn từng section và dọn trạng thái.
- `src/styles/program-detail.css`: bố cục desktop/tablet/mobile.
- `src/sections/program-moments.js`: các cụm ảnh/video và danh sách video mở rộng.
- `src/styles/program-moments.css`: bố cục Khoảnh khắc và cửa sổ video.
- `src/utils/program-media-layout.js`: giới hạn hiển thị và cách ghép cụm theo số lượng.
- `src/utils/balanced-grid.js`: chia hàng/căn giữa theo số bước học và số giảng viên.
- `dist/arista-program.js`: bundle riêng, không nhồi trang chi tiết vào bundle home.

Component dùng lại form đăng ký, dropdown, font và viewer ảnh hiện có. Animation
cuộn dùng IntersectionObserver và Web Animations, tôn trọng giảm chuyển động;
không thêm thư viện và không cần refresh vị trí cuộn toàn trang.

## Hành trình học và Giảng viên

- Nút “Khám phá hành trình” tại hero tới section Hành trình học, không còn link
  tới section Giới thiệu đã xóa.
- Hành trình học chia hàng cân đối, tối đa 4 cột desktop, 3 cột tablet, 2 cột
  mobile. Ví dụ desktop: 5 bước thành 3 + 2; 6 bước 3 + 3; 7 bước 4 + 3;
  9 bước 3 + 3 + 3. Hàng cuối căn giữa và số bước từ 10 hiển thị đúng 10, 11…
- Giảng viên có nền navy toàn chiều ngang, tiêu đề trắng và điểm nhấn vàng;
  card nền kem, Khoảnh khắc trở lại nền kem với khoảng cách rõ ràng.
- Một giảng viên dùng card ngang lớn; 2 hoặc 4 người dùng card ngang hai cột;
  3 người và từ 5 người trở lên dùng card dọc tối đa ba cột desktop.
  Tablet tối đa hai cột, mobile một cột. Hàng cuối chưa đủ cột được căn giữa.
- Không có bước học/giảng viên thì ẩn section tương ứng cùng mục menu. Không
  giới hạn tổng số item trong code; nên biên tập để nội dung vẫn dễ đọc.

## Sau khi duyệt

Thành tích trên trang bộ môn hiện được tạm comment theo yêu cầu client, cả section
và mục điều hướng. Dữ liệu mẫu cũ vẫn được giữ để có thể khôi phục; không cần tạo
collection hoặc thêm ảnh thành tích trên Wix. Thành tích trang chủ không thay đổi.

Đã bổ sung bộ tích hợp Wix riêng: xem [hướng dẫn lắp Wix](program-wix-setup.vi.md),
CSV trong `cms/program-import/` và ghi chú field trong `program-cms-field-notes.vi.md`.
Local vẫn dùng dữ liệu minh họa và form demo. Payload từ CMS Wix dùng `preview=false`,
gọi backend đăng ký thật; các ô media/hồ sơ trống được bỏ qua. Cần cấu hình trang
động, import dữ liệu và copy bundle/public module theo hướng dẫn trước khi Test Site.

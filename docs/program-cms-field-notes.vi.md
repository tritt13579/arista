# Ghi chú các field trang bộ môn

Có 8 trang; Guitar gồm Classic và Lead/Bass. Nội dung giới thiệu/lộ trình là bản nháp để duyệt. Tên, học vị và trường đào tạo do chủ dự án cung cấp; ảnh, bìa và link YouTube để trống để bổ sung sau. Không import lại các collection trang chủ khác.

## Thông tin trang bộ môn — AristaProgramDetails

| Field ID | Kiểu | Giải thích |
| --- | --- | --- |
| title | Text | Tên để nhận biết dòng trong CMS. Ở bảng giảng viên và ảnh/video, tên này dùng để quản lý; tên giảng viên hiển thị lấy từ name. |
| programKey | Text | Dùng piano, violin, guitar, saxophone, drum, dan-bau, vocal hoặc my-thuat. Phải giống mã ở bảng AristaProgramDetails. Guitar bao gồm Classic và Lead/Bass. Không đổi sau khi đã tạo URL. |
| show | Boolean | Bật để hiển thị, tắt để ẩn. Các trang, chặng học và hồ sơ đã có tên đang bật; ảnh/video trống đang tắt, cần bổ sung dữ liệu rồi bật. |
| kicker | Text | Dòng chữ phía trên tên bộ môn trong hero. |
| headline | Text | Phần đầu câu slogan dưới tên bộ môn. Nên viết ngắn. |
| headlineAccent | Text | Phần chữ nhấn của slogan trong hero. Nên viết ngắn. |
| intro | Text | Đoạn giới thiệu trong hero. Khoảng 1–2 câu để vừa màn hình. Đây là bản nháp cần duyệt. |
| tags | Text | Các nhãn nhỏ dưới nút đăng ký. Mỗi nhãn một dòng, nên dùng tối đa 3 nhãn ngắn. |
| heroImage | Image | Chọn ảnh chính đúng bộ môn trong Media Manager. Nên dùng ảnh dọc, rõ mặt người; đây là ảnh lớn ở hero. |
| heroImageFocusHeight | Number | 0 lấy phần trên, 50 ở giữa, 100 lấy phần dưới khi ảnh bị cắt khung. |
| heroCaption | Text | Dòng chữ dưới ảnh hero; cũng là mô tả ảnh cho người dùng trình đọc màn hình. Điền sau khi chọn ảnh. |
| mediaLayout | Text | editorial: bố cục ảnh xen kẽ; portraits: bố cục phù hợp ảnh dọc. Chỉ dùng một trong hai giá trị này. |

## Hành trình học bộ môn — AristaProgramJourney

| Field ID | Kiểu | Giải thích |
| --- | --- | --- |
| title | Text | Tên để nhận biết dòng trong CMS. Ở bảng giảng viên và ảnh/video, tên này dùng để quản lý; tên giảng viên hiển thị lấy từ name. |
| programKey | Text | Dùng piano, violin, guitar, saxophone, drum, dan-bau, vocal hoặc my-thuat. Phải giống mã ở bảng AristaProgramDetails. Guitar bao gồm Classic và Lead/Bass. Không đổi sau khi đã tạo URL. |
| description | Text | Đoạn mô tả dưới tên chặng ở phần Hành trình học. Nội dung mẫu cần giảng viên duyệt. |
| sortOrder | Number | Số nhỏ hiển thị trước. Dùng 1, 2, 3… trong từng bộ môn; ảnh và video được xếp riêng. |
| show | Boolean | Bật để hiển thị, tắt để ẩn. Các trang, chặng học và hồ sơ đã có tên đang bật; ảnh/video trống đang tắt, cần bổ sung dữ liệu rồi bật. |

## Giảng viên bộ môn — AristaProgramTeachers

| Field ID | Kiểu | Giải thích |
| --- | --- | --- |
| title | Text | Tên để nhận biết dòng trong CMS. Ở bảng giảng viên và ảnh/video, tên này dùng để quản lý; tên giảng viên hiển thị lấy từ name. |
| programKey | Text | Dùng piano, violin, guitar, saxophone, drum, dan-bau, vocal hoặc my-thuat. Phải giống mã ở bảng AristaProgramDetails. Guitar bao gồm Classic và Lead/Bass. Không đổi sau khi đã tạo URL. |
| name | Text | Tên thật hiển thị trên thẻ Giảng viên, ví dụ Thầy/Cô + họ tên. Để trống thì hồ sơ không hiển thị. |
| role | Text | Dòng nhỏ phía trên tên, ví dụ Giảng viên Piano. Chỉ điền thông tin đã xác nhận. |
| credential | Text | Dòng nổi bật dưới tên giảng viên. Chỉ điền học vị/chuyên môn đã được xác nhận. Có thể để trống. |
| qualifications | Text | Mỗi thông tin một dòng: trường đào tạo, kinh nghiệm… Chỉ điền dữ kiện đã xác nhận. |
| photo | Image | Chọn chân dung giảng viên đúng hồ sơ. Nếu có tên nhưng chưa có ảnh, giao diện dùng chữ cái đầu của tên. |
| photoFocusHeight | Number | 0 phần trên, 50 giữa, 100 phần dưới; chỉnh để mặt không bị cắt. |
| sortOrder | Number | Số nhỏ hiển thị trước. Dùng 1, 2, 3… trong từng bộ môn; ảnh và video được xếp riêng. |
| show | Boolean | Bật để hiển thị, tắt để ẩn. Các trang, chặng học và hồ sơ đã có tên đang bật; ảnh/video trống đang tắt, cần bổ sung dữ liệu rồi bật. |

## Ảnh và video bộ môn — AristaProgramMedia

| Field ID | Kiểu | Giải thích |
| --- | --- | --- |
| title | Text | Tên để nhận biết dòng trong CMS. Ở bảng giảng viên và ảnh/video, tên này dùng để quản lý; tên giảng viên hiển thị lấy từ name. |
| programKey | Text | Dùng piano, violin, guitar, saxophone, drum, dan-bau, vocal hoặc my-thuat. Phải giống mã ở bảng AristaProgramDetails. Guitar bao gồm Classic và Lead/Bass. Không đổi sau khi đã tạo URL. |
| kind | Text | image cho ảnh, video cho video YouTube. Viết đúng tiếng Anh chữ thường. |
| image | Image | Với image: ảnh trong mục Khoảnh khắc. Với video: ảnh bìa của video. Thêm từ Media Manager. |
| imageFocusHeight | Number | 0 phần trên, 50 giữa, 100 phần dưới trong khung ảnh. |
| youtubeUrl | Text | Chỉ điền cho kind = video. Dán link thật, ví dụ https://www.youtube.com/watch?v=… hoặc https://youtu.be/…; không dán mã iframe. |
| caption | Text | Mô tả ngắn nội dung thực tế. Với ảnh, đây là chú thích trong khung xem ảnh. |
| sortOrder | Number | Số nhỏ hiển thị trước. Dùng 1, 2, 3… trong từng bộ môn; ảnh và video được xếp riêng. |
| show | Boolean | Bật để hiển thị, tắt để ẩn. Các trang, chặng học và hồ sơ đã có tên đang bật; ảnh/video trống đang tắt, cần bổ sung dữ liệu rồi bật. |

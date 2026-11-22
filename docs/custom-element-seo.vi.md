# HTML SEO cho Custom Element trên Wix

## Mục đích và giới hạn

Hai page code gán `seoMarkup` ngay khi payload CMS ở trạng thái `ready`.
HTML được tạo từ cùng payload gửi vào giao diện, không đọc `cms/content.json`
và không truy vấn thêm một bộ dữ liệu khác. Giữ nguyên nội dung client đã nhập.

Quan trọng: page `onReady` phải trả về Promise tải CMS và gán markup, để Wix
chờ nội dung trước khi chụp HTML server. Trang chủ dùng `return Promise.all(...)`;
trang bộ môn dùng `async onReady` và `await` dataset cùng các truy vấn liên quan.
Nếu chỉ thêm `seoMarkup` vào hàm send nhưng không chờ, bản HTML server vẫn có
thể chỉ chứa `state: loading` và `seoMarkup: ""`.

Markup chứa các tiêu đề, giới thiệu, bộ môn/liên kết, lộ trình, giáo viên,
ghi nhận, thành tích trang chủ, đánh giá, hỏi đáp và thông tin liên hệ tương ứng.
Các mục ẩn không được thêm; thành tích bộ môn đang tắt và title/caption media
đã ẩn trên trang bộ môn không được thêm. HTML này là bản nội dung văn bản,
không sao chép animation, form tương tác hay toàn bộ bố cục ảnh.

Đây là HTML phục vụ bot, **không phải JSON-LD**. Không dán vào Add New Markup
trong SEO Settings. Không thêm chữ ẩn vào Wix Editor.

Wix hỗ trợ `seoMarkup` cho bot không xử lý JavaScript. Việc này chưa đảm bảo
SEO Setup Checklist sẽ chuyển xanh hoặc Google sẽ lập chỉ mục/xếp hạng.

Tài liệu: https://dev.wix.com/docs/velo/velo-only-apis/%24w/custom-element/seo-markup

## Cập nhật Wix theo thứ tự

1. Chạy `npm run check` ở local (đã chạy khi triển khai).
2. Trong Wix Editor, bật Dev Mode nếu chưa bật. Mở **Code Files → Public**.
   Tạo **JavaScript file** tên `arista-seo.js`, nằm trực tiếp trong **Public**,
   cùng cấp `arista-program-content.js`, không nằm trong `custom-elements`.
   Dán toàn bộ nội dung `dist/arista-seo.js`.
3. Mở page code của trang chủ Arista, dán nội dung
   `src/wix/arista-preview.page.js`. Custom Element ID vẫn là `aristaHome`.
   File mang tên preview trong repo nhưng dùng cho trang chủ hiện tại.
4. Mở page code của **Arista — Program Details (Item)**, dán nội dung
   `src/wix/arista-program.page.js`. ID vẫn là `aristaProgram`, dataset
   vẫn là `programDetailsDataset`. Chỉ sửa template dynamic page một lần,
   không phải từng bộ môn.
5. Save, kiểm tra không có lỗi import/biên dịch, rồi Publish.

Không cần sửa collection, import CSV, thêm dataset, đổi nguồn Velo file,
thay bundle `arista-home.js`/`arista-program.js`, hay đổi SEO title/description.
Nếu page code trên Wix có chỉnh riêng ngoài repo, áp dụng các thay đổi dưới đây
thay cho việc ghi đè toàn file.

### Thay đổi chính trong page code

Trang chủ thêm import:

```js
import { createHomeSeoMarkup } from 'public/arista-seo.js';
```

Trong `send()`, ngay trước `element.setAttribute('content', next)` thêm:

```js
element.seoMarkup = createHomeSeoMarkup(payload);
```

Trang bộ môn thêm import:

```js
import { createProgramSeoMarkup } from 'public/arista-seo.js';
```

Đổi hàm `send` thành:

```js
const send = () => {
  element.seoMarkup = createProgramSeoMarkup(payload);
  element.setAttribute('content', JSON.stringify(payload));
};
```

## Kiểm tra sau khi Publish

1. Mở URL chính thức `/` và một trang `/bo-mon/piano` (không dùng rc=test-site).
   Giao diện, nội dung CMS và form vẫn hoạt động bình thường.
2. Trong checklist, mở **Add text to the homepage → Refresh**.
   Nếu còn đỏ, không tiếp tục sửa câu chữ chỉ để đạt dấu xanh.
3. Kiểm tra từ phía Google: sau khi kết nối Search Console, dùng
   **URL Inspection → Test Live URL → View Tested Page → HTML**.
   Tìm đoạn giới thiệu mới, tên bộ môn và tên giáo viên đúng với CMS Live.
   Nếu chưa có Search Console, có thể dùng Rich Results Test ở
   https://search.google.com/test/rich-results, test URL chính thức rồi mở
   **View tested page → HTML**. Không có rich result hợp lệ không đồng nghĩa
   HTML nội dung bị lỗi; đó là bài kiểm tra dữ liệu có cấu trúc riêng.
4. HTML phải có một H1 phù hợp từng trang; không có thành tích bộ môn đang ẩn,
   không bị lẫn thông tin giữa các bộ môn. Chọn một thay đổi text nhỏ có thật
   trong CMS Live để kiểm tra markup cập nhật cùng nội dung nếu cần.

Không dựa vào View Source thông thường hoặc chỉ DOM trong trình duyệt người dùng
để kết luận bản HTML bot nhận được, vì `seoMarkup` phục vụ bot riêng.
Nếu checklist vẫn đỏ nhưng Google đọc được nội dung, xử lý checklist với Wix
Support hoặc xác minh Search Console thủ công; không thêm text trùng lặp/ẩn.

## Bảo trì

Khi thêm section mới hoặc thay đổi các tiêu đề cố định của trang bộ môn,
cập nhật `src/seo/markup.js`, chạy `npm run check` và thay Public/arista-seo.js
bằng bundle mới. Các thay đổi text CMS thông thường không cần build lại.

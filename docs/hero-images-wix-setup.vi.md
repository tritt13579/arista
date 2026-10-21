# Tự chọn ảnh cung C ở đầu trang

Ảnh hero dùng collection riêng `AristaHeroImages`, độc lập với chứng chỉ và thành tích. Không tự lấy ảnh từ hai bảng cũ nữa. Không cần đổi collection của program page hoặc thêm dòng trong AristaPageContent.

## 1. Tạo collection và import

Tạo collection với **Collection ID** chính xác là `AristaHeroImages`. Tên hiển thị có thể đặt “Arista — Ảnh cung C đầu trang”. Import **chỉ** `cms/import/AristaHeroImages.csv` vào bảng mới. Không import đè các bảng đang có.

CSV có 10 dòng gợi ý để giữ nội dung hiện tại; đây không phải giới hạn. Có thể xóa, thêm hoặc ẩn dòng tùy ý. Ảnh để trống trong CSV: chọn lại ảnh đã có trong Wix Media Manager, không cần upload lại nếu ảnh đã tồn tại.

| Field ID | Kiểu trên Wix | Ghi chú cho client |
|---|---|---|
| title | Text | Đặt tên ngắn để nhận biết ảnh trong bảng và mô tả ảnh cho công cụ hỗ trợ đọc. Không hiện chữ này trên hero. |
| image | Image | Chọn ảnh muốn đưa lên cung C đầu trang. Có thể là giấy khen, ảnh học viên hoặc ảnh khác. Ảnh được hiện đầy đủ, không cắt nội dung. |
| imageFocusHeight | Number | Giữ 50. Cung C hiện toàn bộ ảnh nên field này không thay đổi cách cắt ảnh. |
| show | Boolean | Bật để hiển thị. Tắt để tạm ẩn mà không xóa dòng. Dòng chưa chọn ảnh cũng không hiện. |

Cho khách truy cập quyền đọc collection; chỉ người có quyền quản lý CMS được sửa. Bật **Apply order to site** và sắp xếp các dòng theo thứ tự muốn hiện từ đầu tới cuối cung. Dataset không đặt sort riêng.

## 2. Nối dataset trên trang chủ

Trong Wix Editor, thêm dataset nối `AristaHeroImages`:

- Chế độ **Read**.
- Element ID **heroImagesDataset** (phân biệt chữ hoa/thường).
- Không đặt filter hoặc sort riêng nếu muốn quản lý bằng `show` và thứ tự CMS.
- Dataset không cần nối trực tiếp vào hình ảnh trong Editor; page code đọc dữ liệu và truyền cho Custom Element.

Dataset đọc tất cả các trang dữ liệu, không giới hạn theo số item trên một page của dataset.

## 3. Cập nhật cả hai file

1. Thay nội dung `public/custom-elements/arista-home.js` trên Wix bằng `dist/arista-home.js` mới.
2. Thay **page code trang chủ** bằng `src/wix/arista-preview.page.js` mới. Không dán vào masterPage.js hoặc page code của trang bộ môn.
3. Save, cập nhật Test Site rồi kiểm tra. Nếu có Sandbox/Live riêng, đồng bộ dữ liệu sang môi trường đang xem.

Phải thêm dataset trước khi chạy page code mới. Nếu chỉ cập nhật Custom Element nhưng chưa cập nhật page code, cung ảnh sẽ chưa có dữ liệu. Nếu không có ảnh nào bật hiển thị, hero chỉ hiện cột chữ/nút.

## 4. Số lượng và bố cục

- Không giới hạn 10 ảnh trong code. Mỗi dòng hợp lệ có vị trí riêng trên đường cung; không bỏ ảnh sau ảnh thứ 10.
- Một ảnh: hiện một khung lớn ở giữa cột ảnh. Từ hai ảnh trở lên: trải theo đường cung chữ C ngược.
- Kích thước cả cung tiếp tục co giãn theo khung nhìn. Thêm nhiều ảnh không làm hero cao vô hạn; ảnh sẽ chồng lên nhau nhiều hơn. Hover trên desktop đưa ảnh lên trước tạm thời; click/chạm mở trình xem ảnh lớn.
- Để dễ nhận diện từng ảnh, nên dùng khoảng 6–12 ảnh. Đây chỉ là gợi ý nội dung, client vẫn có thể chọn số lượng khác.
- Nhịp xuất hiện được giới hạn tổng độ trễ khoảng nửa giây, nên nhiều ảnh không làm người xem phải chờ từng ảnh trong nhiều giây.

Kiểm tra sau khi cập nhật: thêm/ẩn/đổi thứ tự ảnh; thử 1, 5 và hơn 10 ảnh; kiểm tra desktop và mobile. Thay ảnh ở bảng này không thay ảnh ở section chứng chỉ hoặc thành tích.

Lệnh console kiểm tra trên trang chủ Test Site:

```js
(() => {
  const host = document.querySelector('arista-home');
  const data = JSON.parse(host?.getAttribute('content') || '{}');
  console.log('ARISTA HERO IMAGES', {
    state: data.state,
    fieldExists: Array.isArray(data.heroImages),
    received: data.heroImages?.length,
    rendered: host?.shadowRoot?.querySelectorAll('.hero-card').length
  });
  console.table(data.heroImages || []);
})();
```

`fieldExists: false` nghĩa là page code vẫn chưa truyền field mới. Có dữ liệu nhưng không hiện: kiểm tra field `image` đúng kiểu Image và đã chọn ảnh, `show` đúng kiểu Boolean và bật.

## Tương tác hướng A

Desktop dùng bộ điều khiển hover hướng B: chỉ một ảnh được đưa lên trước tại một thời điểm. Dừng chuột trên cùng một ảnh 140ms mới kích hoạt; lướt nhanh qua ảnh thì hủy yêu cầu. Ảnh nâng khoảng 2px trên màn hình, phóng thêm 1,5%, không xoay thêm. Viền nâu vàng và bóng nhẹ; chuyển động vào/ra 220ms. Không có icon mở rộng trên ảnh.

Ưu tiên giữ ảnh đang nổi nếu con trỏ còn nằm trên surface thực tế đang hiển thị (xét phần tử được vẽ dưới con trỏ, gồm cả góc xoay và phần ảnh phóng ra). Khi ra khỏi ảnh đang nổi mới tìm ảnh kế tiếp theo khung button gốc và đợi 140ms. Vì vậy rê trên phần ảnh đang che ảnh khác không làm ảnh phía sau giành hover. Pointer focus không hạ lớp giữa pointerdown và click; click vùng chồng lấp mở đúng ảnh đang nhìn thấy. Không dùng delay z-index, không giữ nhiều ảnh cùng lớp trên. Rời cung, cuộn, resize, mở viewer hoặc thay nội dung sẽ hủy hover đang chờ; listener/timer được dọn khi render lại hoặc tháo component.

Click/chạm một lần mở viewer chung, đúng ảnh đang bấm; có chuyển tới các ảnh còn lại, Escape/nút đóng, khôi phục focus. Không còn aria-pressed hoặc trạng thái chọn cố định. Viewer dùng fade vì thumbnail hero nghiêng; không giả lập bay theo khung chữ nhật khiến ảnh bị nắn thẳng đột ngột. Không hiện caption hoặc thông báo tải chất lượng cao; ảnh nét tự thay khi tải xong, vẫn báo lỗi nếu không tải được ảnh.

Bàn phím: Tab tới ảnh, Enter/Space mở viewer. Màn cảm ứng không dùng hover. Tôn trọng prefers-reduced-motion. Đã kiểm tra hover vào/rời, mở đúng ảnh, chuyển ảnh, Escape, bàn phím và tap trên viewport 390×844.

Lần cập nhật tương tác này chỉ cần thay dist/arista-home.js lên public/custom-elements/arista-home.js; không cần đổi collection hoặc page code.


Đã thử lướt nhanh 10 ảnh, dừng và rê chậm lần lượt: số ảnh ở lớp trên luôn 0 hoặc 1; không còn 3 ảnh giữ lớp trên như trước. Đã thử mở viewer bằng click/Enter, tap mobile, thay dữ liệu trong lúc chờ hover và tháo/gắn lại component. npm run check đã qua.

# Kết quả phân tích mobile và kết luận tổng hợp

Nguồn: `reference-about-us-inspect-mobile.json` ở gốc repository, do người dùng cung cấp ngày 21/10/2026; URL trong file là `https://chiic-digital.com/`. Đối chiếu với `desktop-findings.vi.md` và HTML ban đầu.

## Dữ liệu đo thực tế

- Viewport **440 × 956 CSS px**, DPR khoảng 3. Lần đo này không phải 390px như đề nghị ban đầu; vẫn đủ xác nhận nhánh mobile ở kích thước được đo, chưa khẳng định mọi chiều rộng hẹp hơn.
- 5 snapshot, trace mobile-idle 101 mẫu / 10 giây và mobile-scroll 151 mẫu / 15 giây.
- Chỉ card index 0–9 hiện; nhánh desktop 10–19 ẩn.
- Section 440 × 1160.95 px, padding 64px 24px. Khung cung ảnh 392 × 588px, đúng tỷ lệ 4/6.
- Section gốc cao hơn viewport; đây là section độc lập phía dưới trang, không phải một khối hero được ép vừa màn hình.

## Đã xác nhận

1. Cùng mô hình với desktop: 10 card giữ vị trí theo cung chữ C; scale/rotate thay đổi theo cuộn, không di chuyển theo quỹ đạo vòng cung.
2. Scale từng card đi từ **1 đến 1.5**, góc đầu/cuối giống bảng desktop: −3→9, 5→−11, −6→3, 3→−8, −4→10, 4→−5, −3→10, 5→−10, −5→5, 4→−8 độ.
3. Có độ trễ tiến độ theo thứ tự card: ảnh phía trên tiến trước, ảnh phía dưới tiến sau.
4. Cuộn lên đảo ngược trạng thái. Trong trace có lượt đi xuống, lên về scrollY 774.4, sau đó đi xuống lần nữa; không phải hiệu ứng chỉ chạy một lần.
5. Trong mobile-idle, scrollY giữ nguyên **1663.2** suốt 10 giây; tất cả card giữ nguyên transform, filter và z-index. Không thấy autoplay hoặc chuyển động tự lặp.
6. Trong cả hai trace, filter đều `grayscale(1)` và z-index giữ nguyên 10–100. **Không có sự kiện chạm được ghi trong trace này.**
7. Bằng chứng bổ sung từ người dùng: **chạm ảnh chỉ đổi màu như desktop, không mở ảnh lớn**. Phần đổi màu khi chạm là quan sát của người dùng, không phải kết quả đo filter trong file hiện tại. Chưa cần đo riêng thời gian giữ trạng thái màu sau khi chạm vì không phải yêu cầu khớp tuyệt đối.

Ví dụ tiến độ mobile:

| scrollY gần đúng | Scale card 1 | Scale card 6 | Scale card 10 |
|---|---|---|---|
| 774.4, trước khi vào vùng | 1 | 1 | 1 |
| 1062.4, cuộn xuống | 1.10 | 1 | 1 |
| 2028, cuộn xuống | 1.5 | 1.43 | 1.34 |
| 955.2, cuộn ngược lên | 1.05 | 1 | 1 |
| 774.4, trở về trước vùng | 1 | 1 | 1 |

## Kết luận cho việc chuyển thể

Tên mô tả chính xác: **cụm ảnh xếp theo cung, phóng/xoay theo cuộn, tương tác đổi màu và đưa ảnh lên trước**. Không phải carousel, slideshow, vòng ảnh tự chạy hay gallery mở lớn.

Đã đủ dữ liệu hành vi để tạo prototype Arista. Không cần lấy thêm console hoặc toàn bộ mã JS trang mẫu, trừ khi người dùng muốn khớp chính xác timing/start/end.

## Các quyết định thiết kế cần chốt trước implementation

- Yêu cầu ban đầu nói “2 slide”, còn mẫu mới có 10 ảnh đồng thời: cần thống nhất rằng chuyển sang cụm ảnh nhiều lớp thay cho slider 2 nội dung.
- Cung ảnh đặt bên phải hero: đề xuất thử phản chiếu **tọa độ**, để khoảng trống cung hướng về phần chữ trái, giữ ảnh không bị lật. Đây là lựa chọn thiết kế, không phải hành vi nguồn đã xác nhận.
- Chọn số ảnh từ tài sản thật của client; không bắt buộc 10. Nên thử đủ số ảnh trước khi quyết định vì bố cục cung phụ thuộc số card.
- Hero cần một trạng thái ban đầu đã đọc được ngay khi mở. Mẫu gốc bắt đầu scale 1 rồi phóng khi cuộn tới section giữa trang; không bê nguyên start/end đó lên đầu website.
- Giấy khen cần hiện đầy đủ chữ/khung. Dùng contain hoặc bố cục phù hợp, không cắt bằng cover như ảnh sự kiện.
- Mobile không bê nguyên section dài 1161px vào hero; cần cân đối chữ giới thiệu và khung cung, tránh kéo phần đầu trang quá dài. Xác định ưu tiên giữa giữ cung như mẫu và bản gọn trước khi code.
- Click mở lớn là chức năng mới nếu áp dụng ở Arista, phải nêu rõ, không coi là lấy từ mẫu.
- Chưa chốt giữ grayscale/tap-to-color cho tài sản Arista. Có thể giữ ảnh màu để giấy khen và học viên nhận diện rõ hơn; cần người dùng chọn.

Chưa chỉnh component, CSS, CMS hay animation sản phẩm trong bước phân tích này.

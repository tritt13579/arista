> Cập nhật mới: cung C dùng collection riêng `AristaHeroImages`, không còn tự lấy từ Recognitions/AchievementPhotos và không giới hạn 10 ảnh. Xem [hướng dẫn hiện tại](../../hero-images-wix-setup.vi.md). Các mô tả nguồn ảnh/giới hạn cũ bên dưới là lịch sử các phương án trước.

# Implement plan — phân tích cụm ảnh tham khảo cho hero Arista

Trạng thái: **đã chốt và triển khai một hero nền kem, không ảnh nền, cụm tối đa 10 ảnh chữ C ngược mở về chữ trái, co theo chiều cao desktop (hướng A)**.

## Bản hiện tại

- Đã xóa cả 6 prototype và module `src/preview/hero-studies.*`; `index.html` dùng chính component production.
- Menu nền kem đặc `#faf6ee`, chữ navy, tương ứng với menu program page hiện tại.
- Chữ xuất hiện theo thứ tự eyebrow → tiêu đề từng dòng → slogan → mô tả → nút. Ảnh hiện lần lượt, có dịch chuyển ngắn và fade.
- Scroll đổi scale/rotate theo thứ tự card với chuyển động nội suy 300ms; cuộn ngược đảo chiều. Không có ScrollTrigger mới hoặc thao tác đổi scroll position trong hero.
- Ảnh luôn có màu. Hover/focus/chạm đưa ảnh lên trước và đổi chú thích; không mở viewer, không autoplay. Ảnh giấy khen được hiện đầy đủ bằng contain.
- Reduced motion: tắt entrance và chuyển động theo cuộn, giữ bố cục tĩnh.
- Hướng dẫn nguồn ảnh và cập nhật Wix: [hero đã chốt](production-hero.vi.md).

Đã nhận bản đo desktop. Xem [kết quả phân tích desktop](desktop-findings.vi.md): chuyển động scale/rotate theo cuộn, hover đổi màu và nâng z-index; không phải slider chạy vòng. Phần bên dưới giữ lại ghi nhận từ HTML ban đầu để truy nguồn, các mục “cần xác minh” đã được giải đáp một phần trong báo cáo mới.

Đã nhận thêm bản đo mobile và xác nhận của người dùng: **chạm chỉ đổi màu, không mở ảnh lớn**. Xem [kết quả phân tích mobile](mobile-findings.vi.md). Hiện đủ bằng chứng để thiết kế bản chuyển thể, không cần lấy thêm console hoặc toàn bộ bundle của site mẫu.

## Mục tiêu

Phân tích đúng section `#about-us` của website mẫu trước khi quyết định cách chuyển cụm ảnh sang bên phải hero Arista. Các đề xuất slider/autoplay trước đây chỉ là ý tưởng, chưa phải mô tả đã xác minh của website mẫu.

Nguồn: HTML người dùng gửi ngày 21/10/2026, lưu tại `reference-section.html`, cùng ảnh chụp trong hội thoại. Không dùng ảnh của website tham khảo làm tài sản cho Arista.

## Đã xác nhận từ HTML

- Section `#about-us`, đặt `overflow-hidden`; các ảnh có thể bị cắt ở mép section.
- Có **hai cây DOM riêng** cho mobile (`lg:hidden`) và desktop (`hidden ... lg:grid`). Mỗi cây có **10 card ảnh**, không phải 20 ảnh đang hiển thị cùng lúc.
- Desktop khai báo grid 3 cột `1.15fr 0.7fr 1fr`: cụm ảnh, tiêu đề, mô tả/CTA. Mobile có chữ đặt trong khoảng trống giữa vòng cung và phần mô tả phía dưới.
- Khung cụm ảnh có tỷ lệ `4/6`, width 100%, max-width theo class `max-w-md`. Cần computed style để biết kích thước px và breakpoint thật, không mặc định giá trị Tailwind.
- Card ảnh absolute, tỷ lệ `4/3`, bo góc, bóng đổ, overflow hidden. Hình nằm trong card dùng `object-cover`.
- Các card được đặt theo **một cung hình chữ C**, đi từ trên phải sang trái rồi trở về dưới phải. Đây là bố trí theo tọa độ cố định, không có bằng chứng trong HTML cho thấy card chạy theo đường cong.
- Z-index tăng lần lượt 10–100 theo thứ tự DOM, nên card sau chồng lên card trước.
- Inline transform chứa rotate/scale. Bản mobile đang có scale 1.5; desktop ở trạng thái khác nhau giữa các card. Đây là một thời điểm của trang, không suy ra thời lượng hay cơ chế điều khiển.
- Ảnh có class `grayscale` và transition filter 500 ms ease-out. Chưa xác nhận khi nào bỏ grayscale.
- Wrapper mobile có opacity 0 và translateY(32px), desktop opacity 1 / transform none ở thời điểm chép HTML. Không kết luận mobile bị lỗi vì có thể nhánh đó đang ẩn hoặc animation chưa chạy.
- HTML không chứa điều khiển previous/next, dots hay track slider rõ ràng trong cụm ảnh.
- `will-change`, các thuộc tính translate/rotate/scale reset và transform inline tương thích với kiểu cập nhật từ thư viện JS, **chưa đủ chứng minh dùng GSAP**.

## Tọa độ card — dùng chung trong hai nhánh

| Card | top | left | width | z-index | Góc mobile trong HTML |
|---|---|---|---|---|---|
| 1 | 0% | 50% | 34% | 10 | 9° |
| 2 | 5% | 28% | 36% | 20 | −11° |
| 3 | 13% | 8% | 34% | 30 | 3° |
| 4 | 22% | 0% | 36% | 40 | −8° |
| 5 | 32% | 0% | 34% | 50 | 10° |
| 6 | 43% | 0% | 36% | 60 | −5° |
| 7 | 54% | 4% | 34% | 70 | 10° |
| 8 | 64% | 12% | 34% | 80 | −10° |
| 9 | 72% | 26% | 34% | 90 | 5° |
| 10 | 78% | 46% | 32% | 100 | −8° |

Các góc và scale là trạng thái đo được trong HTML, không coi là keyframe đầu/cuối.

## Cần xác minh trên trang thật

1. Đứng yên không rê chuột: rotate/scale có tự đổi theo thời gian không? Có lặp không?
2. Cuộn xuống/chậm rồi lên: trạng thái có đi theo vị trí cuộn, đảo chiều, hay chỉ chạy một lần khi xuất hiện?
3. Hover một card: filter, scale, rotate và z-index có thay đổi không? Rời chuột có trở lại không?
4. Click card có mở lớn/điều hướng hay không? Chỉ thử sau khi lưu dữ liệu trace.
5. Desktop và mobile hiển thị nhánh nào, kích thước cụm ảnh, khoảng trống chữ và phạm vi ảnh tràn như thế nào?
6. Nếu chưa đủ dữ liệu: lấy đoạn JS chứa selector/animation từ Sources, kèm tên file. Không lấy toàn bộ bundle dài trước khi xác định cần tìm gì.

## Quy trình lấy dữ liệu bằng Console

Mở website **mẫu**, không chạy trên Wix Editor hoặc Arista. Dán toàn bộ `inspect-console.js` vào DevTools Console. Script chỉ đọc computed style/geometry và lắng nghe tương tác; không thay layout, không cài thư viện và không gọi API riêng của site.

Thực hiện lần lượt, chờ thông báo hoàn tất trước lệnh tiếp:

```js
// Ở section, đưa chuột ra ngoài ảnh và đứng yên 10 giây.
aristaReferenceInspect.trace('desktop-idle', 10);

// Cuộn chậm qua section, sau đó cuộn ngược lên trong 15 giây.
aristaReferenceInspect.trace('desktop-scroll-down-up', 15);

// Đứng yên, rê vào một ảnh, giữ 2 giây, rời ra; thử ảnh khác.
aristaReferenceInspect.trace('desktop-hover', 12);
```

Chuyển giả lập mobile 390px, tải lại trang để site khởi tạo đúng breakpoint, dán lại script và đo idle/scroll tương tự. Download kết quả desktop trước khi reload vì dữ liệu chỉ lưu trong RAM:

```js
aristaReferenceInspect.download();
// Hoặc sao chép vào clipboard để gửi dạng text:
copy(JSON.stringify(aristaReferenceInspect.report));
// Dừng thu thập nếu cần:
aristaReferenceInspect.stop();
```

Gửi JSON desktop và mobile; video màn hình ngắn có cảnh đứng yên, cuộn và hover sẽ giúp đối chiếu trực quan. Không cần console log unrelated/cookies/network HAR.

Script lấy cả các nhánh DOM ẩn trong snapshot nhưng chỉ ghi card của nhánh có display/visibility đang bật vào trace. `shown` không đồng nghĩa đã nằm trong viewport hoặc opacity > 0. Native `getAnimations()` có thể không thấy animation do JS cập nhật mỗi frame; danh sách rỗng không chứng minh không có animation. Tần suất lấy mẫu 100 ms dùng để xác định hành vi, không đo FPS hay suy ngược chính xác easing.

## Kế hoạch sau khi nhận kết quả

- Cập nhật tài liệu bằng số liệu thực tế, tách rõ quan sát và suy luận.
- Chốt lại với người dùng: giữ bao nhiêu ảnh, cung giữ chiều nào khi đặt bên phải, animation theo cuộn hay thời gian, có mở ảnh lớn không.
- Thiết kế cách hiển thị ảnh giấy khen đầy đủ nội dung và ảnh học viên, tránh copy `object-cover` cho giấy khen.
- Kiểm tra sự cân bằng với chữ trái, lớp phủ nền hero, menu, viewport thấp và mobile trước khi thay khối thống kê.
- Chỉ sau đó sửa component/CSS/animation, cấu trúc CMS, CSV và tài liệu cập nhật Wix. Hiện chưa thay đổi code sản phẩm.

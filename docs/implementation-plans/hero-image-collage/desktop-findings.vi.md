# Kết quả phân tích desktop — CHIIC About Us

Nguồn: file người dùng cung cấp `reference-about-us-inspect.json` ở gốc repository, URL ghi trong dữ liệu `https://chiic-digital.com/`. Ngày phân tích: 21/10/2026. Chỉ đọc dữ liệu đã cung cấp; chưa đọc JS gốc của website.

## Phạm vi đo

- 7 snapshot, 3 trace: idle (79 mẫu), scroll (151 mẫu), hover (121 mẫu), tổng 351 mẫu.
- Viewport rộng 1528 CSS px, cao 486 px trong các trace; snapshot initial cao 566 px. DPR 1.25. Reduced motion tắt.
- Card desktop có index 10–19 trong file; card 0–9 thuộc nhánh mobile ẩn. Báo cáo này gọi card desktop là 1–10 để dễ đọc.
- Section rộng 1512.8 px, cao 938.46 px, padding 96px 40px. Khung ảnh 497.11 × 745.66 px. Card đầu có kích thước trước transform khoảng 169.01 × 126.75 px, bo góc 8 px.
- `window.gsap` và `window.ScrollTrigger` không có; không thấy native animations trong snapshot. Không suy ra site không dùng thư viện: thư viện có thể được bundle nội bộ, animation JS không xuất hiện trong `getAnimations()`.

## Kết luận đã có bằng chứng

### 1. Bố cục tĩnh theo cung chữ C, chuyển động gắn với cuộn

Card giữ vị trí bố trí ban đầu. Ma trận transform đo được chỉ có rotate + uniform scale, translation trong ma trận là 0,0. Không thấy cơ chế chạy card dọc đường cong, tự thay ảnh, autoplay hoặc slider ngang trong lần đo này.

Cuộn xuống: các card lần lượt scale 1 → 1.5 và xoay từ góc ban đầu sang góc đích. Các card ở trên tiến trước, các card dưới tiến sau. Cuộn ngược: scale và góc xoay đảo ngược về trạng thái đầu. Đây là kiểu animation có tiến độ theo cuộn, không phải hiệu ứng hiện một lần.

| Card | Góc đầu | Góc tại scale 1.5 | Scale đầu → cuối |
|---|---|---|---|
| 1 | −3° | 9° | 1 → 1.5 |
| 2 | 5° | −11° | 1 → 1.5 |
| 3 | −6° | 3° | 1 → 1.5 |
| 4 | 3° | −8° | 1 → 1.5 |
| 5 | −4° | 10° | 1 → 1.5 |
| 6 | 4° | −5° | 1 → 1.5 |
| 7 | −3° | 10° | 1 → 1.5 |
| 8 | 5° | −10° | 1 → 1.5 |
| 9 | −5° | 5° | 1 → 1.5 |
| 10 | 4° | −8° | 1 → 1.5 |

Ví dụ trong trace scroll:

| Thời điểm gần đúng | scrollY | Scale card 1 | Scale card 6 | Scale card 10 |
|---|---|---|---|---|
| 1.2 s | 974.4 | 1 | 1 | 1 |
| 2.4 s | 1387.2 | 1.1754 | 1 | 1 |
| 3.6 s | 1747.2 | 1.4648 | 1.2047 | 1 |
| 4.8 s | 2110.4 | 1.5 | 1.4916 | 1.2925 |
| 6.0 s | 2456 | 1.5 | 1.5 | 1.5 |
| 8.4 s, đang cuộn lên | 1784.8 | 1.495 | 1.2344 | 1.0282 |
| 10.8 s | 917.6 | 1 | 1 | 1 |

Các giá trị này mô tả lần đo hiện tại, không dùng nguyên scrollY làm hằng số triển khai. Chưa xác định chính xác start/end, scrub delay hoặc easing từ mã nguồn.

### 2. Hover đổi màu và lớp chồng

- Trạng thái thường: ảnh `grayscale(1)`; card có z-index gốc 10,20,...100.
- Khi con trỏ vào card, filter chuyển tới `grayscale(0)` và card được nâng lên z-index **999**.
- Rời card: filter quay lại grayscale và z-index về giá trị cũ.
- CSS transition filter đã đo: 0.5 s, `cubic-bezier(0, 0, 0.2, 1)`.
- Quan sát rõ ở card index 19: pointerover ~1877.7 ms và pointerout ~5551.3 ms trong trace hover; card có filter chuyển về 0 rồi về 1, z-index 100 ↔ 999.
- Không có bằng chứng cho hover tự phóng thêm: trong các khoảng scrollY đứng yên, transform của card không thay đổi dù hover. Thay đổi scale/rotate trong trace hover xảy ra cùng các lần cuộn.

### 3. Không thấy tự chạy khi đứng yên

Tên trace không bảo đảm thao tác được giữ đúng: trace idle cũng chứa 168 sự kiện scroll và hover; trace hover chứa 70 sự kiện scroll. Vì vậy phải xét riêng các đoạn scrollY ổn định.

- Idle: scrollY 1674.4 giữ nguyên ~0–8.3 s; sau 0.5 s đầu, transform card 1 và 10 chỉ có một giá trị trong phần còn lại. Không thấy tự chạy.
- Hover: scrollY 1974.4 ổn định ~0–7.0 s, và 1774.4 ổn định ~8–12 s; transform ổn định, filter/z-index thay đổi theo con trỏ.
- Scroll: sau khi trở về đầu vùng, transform trở về trạng thái đầu và giữ nguyên trong đoạn đứng yên cuối.

Đủ để mô tả hành vi desktop quan sát được là **bố cục ảnh xếp chồng + scale/rotate theo cuộn + hover tô màu/nâng lớp**. Chưa chứng minh site không có chế độ khác ở breakpoint khác.

## Những gì còn thiếu

1. **Mobile**: file hiện tại không có viewport mobile; các trạng thái mobile trong HTML là nhánh ẩn, không thể dùng làm bằng chứng runtime. Cần một lượt idle + scroll ở 390px, reload sau khi đổi viewport, dán lại script.
2. **Click**: không có click trong dữ liệu. Chưa biết card có mở ảnh lớn hoặc điều hướng. Có thể xác nhận bằng quan sát trực tiếp; không bắt buộc lấy thêm trace nếu người dùng mô tả rõ.
3. **Mã nguồn animation**: chỉ cần nếu yêu cầu khớp chính xác ngưỡng cuộn/easing. Để dựng hành vi tương đương, dữ liệu desktop hiện tại đã đủ, không cần lấy toàn bộ bundle.

## Hệ quả cho hero Arista — đề xuất, chưa chốt

- Phân biệt mục tiêu client ban đầu (2 slide chứng chỉ/thành tích) với mẫu mới (10 ảnh cùng xuất hiện theo cung). Đây là hai cấu trúc khác nhau; không gọi mẫu này là slider.
- Hero nằm ngay đầu trang nên ảnh phải có trạng thái đẹp ngay khi mở, không giấu nội dung chính để chờ cuộn tới giữa section như mẫu.
- Mẫu gốc có section cao ~938 px và khung ảnh cao ~746 px ở desktop đo được. Không bê nguyên chiều cao đó sang hero rồi làm phần đầu trang dài quá màn hình.
- Nếu chuyển cụm ảnh sang phải, cần quyết định giữ cung chữ C hay phản chiếu để phần mở hướng về chữ bên trái. Phản chiếu tọa độ nếu cần, không dùng scaleX(-1) lên ảnh/chữ.
- Scale 1.5 làm ảnh chồng lấn mạnh; thử prototype với ảnh client thật trước khi quyết định giữ mức phóng này.
- Giấy khen cần giữ đầy đủ và có cách mở bản lớn. Không mặc định dùng object-cover giống ảnh sự kiện của mẫu.
- Không triển khai autoplay, dots, kéo/vuốt slider nếu chưa có quyết định riêng: chúng không được xác nhận từ mẫu.

## Bước tiếp theo

Nhận thêm kết quả mobile hoặc xác nhận chỉ cần học hành vi desktop. Sau đó chốt cách chuyển cụm ảnh vào hero Arista và mới bắt đầu implementation.

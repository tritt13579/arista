# Đối chiếu hero hiện tại với UI mẫu — chỉ phân tích

Nguồn: source hiện tại và đo local bằng Chromium sau khi trả lại 10 ảnh; đối chiếu HTML + hai JSON tham khảo người dùng đã cung cấp. Không thay đổi code UI trong lượt phân tích này.

## Những điểm giống và thay đổi có chủ ý

- Đủ 10 card, cùng bảng tọa độ % và tỷ lệ khung cung 4/6, card 4/3.
- Cung đã được phản chiếu bằng tọa độ theo yêu cầu: mở sang trái. Các góc xoay được đổi dấu tương ứng, không lật ảnh.
- Hero dùng nền kem, không ảnh nền; chữ Arista ở bên trái. Mẫu gốc là section About Us ở giữa trang, có bố cục nội dung khác.
- Ảnh Arista giữ màu, không dùng grayscale-to-color như mẫu. Đây là lựa chọn chuyển thể trước đó, không phải lỗi CSS.

## Khác biệt ảnh hưởng mạnh đến cảm giác thị giác

1. **Quy mô cụm ảnh**: tại cùng viewport 1528×486, mẫu đo được khung cung khoảng 497×746px, bản hiện tại khoảng 201×302px. Khung hiện tại chỉ khoảng 40% kích thước mỗi chiều. Vì mẫu cho section cuộn dài, còn hero hiện tại có yêu cầu vừa viewport. Ở 1366×768, bản hiện tại khoảng 355×532px; ở 1440×900 khoảng 342×513px, do mục tiêu hero tối đa 734px và padding phụ thuộc chiều cao viewport.
2. **Cách ảnh lấp đầy card**: mẫu dùng object-fit cover; bản hiện tại dùng contain để bảo toàn giấy khen. Với một số ảnh dọc, khoảng trống trong card 4/3 chiếm khoảng 42–44% diện tích. Người xem nhận ra các ô nền trống thay vì các tấm ảnh lấp kín như mẫu.
3. **Trạng thái animation khi vào trang**: ở 1440×900, sau load tại scrollY 0, 8 card đầu đã có scale 1.5; hai card cuối khoảng 1.491 và 1.474. Cụm ảnh gần trạng thái cuối ngay từ đầu. Ở 1366×768, sáu card đầu scale 1.5. Trong mẫu gốc, section ở giữa trang, người xem đi từ trước vùng kích hoạt vào vùng animation, nên thấy tiến trình phóng từng card rõ hơn. Chưa có start/end JS gốc để khớp tuyệt đối.
4. **Nội dung ảnh**: mẫu chủ yếu dùng ảnh sự kiện/tập thể dạng ngang, ít chữ nhỏ. Arista xen ảnh người với giấy chứng nhận dọc/ngang và kỷ niệm chương, nên mật độ chi tiết và sự đồng nhất khác nhau.
5. **Bề mặt card**: bản hiện tại có nền kem và border 1px; mẫu không khai báo border tương tự trong class card, ảnh cover kín khung. Bóng đổ mẫu là đen hai lớp; hiện tại nâu một lớp. Đây là khác biệt phụ nhưng góp phần tạo cảm giác giống thẻ giấy hơn ảnh nổi.
6. **Tương tác**: mẫu hover đổi grayscale→màu và z-index999. Bản hiện tại ảnh luôn có màu; hover/focus nâng lớp, chạm chọn giữ trạng thái lớp phía trước tới khi bỏ chọn/chọn ảnh khác. Không có chuyển đổi màu để nhấn mạnh ảnh đang tương tác.

## Ưu tiên nếu cần chỉnh gần mẫu hơn (chưa được yêu cầu triển khai)

- Chốt cân bằng giữa quy mô ảnh và yêu cầu vừa màn hình; không thể giữ nguyên cụm 746px cùng nội dung/padding rồi nhét vào viewport thấp.
- Chọn ảnh ngang cho thumbnail hero hoặc chấp nhận crop cover; giấy khen dọc không thể vừa hiện trọn vừa lấp đầy card ngang nếu không có khoảng trống.
- Tách tiến độ animation của hero khỏi cách kích hoạt section giữa trang: tạo trạng thái đầu rõ rồi cho cuộn tiếp tục thay đổi, tránh scale bão hòa ngay khi load.
- Sau đó mới tinh chỉnh border, shadow hoặc hiệu ứng tương tác; không cần sửa tọa độ cung trước vì normalized coordinates đã đúng theo phép phản chiếu đã chọn.

Kết luận: cảm giác chưa giống mẫu chủ yếu do **quy mô bị thu, letterboxing trong ảnh và tiến độ animation**, không phải thiếu số lượng card hay sai tỷ lệ cung cơ bản.

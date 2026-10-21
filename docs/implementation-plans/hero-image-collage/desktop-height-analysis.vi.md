# Hero vượt chiều cao desktop — phân tích, chưa sửa layout

Đo trên bản local hiện tại bằng Chromium, viewport CSS thực tế, reduced motion để loại bỏ ảnh hưởng entrance. Không thay source layout trong bước này.

## Kết quả

| Viewport | Chiều cao hero | Cụm ảnh và chú thích | Khung cung | Vượt viewport |
|---|---|---|---|---|
| 1920 × 1080 | 966px | 796px | 660px | Không, còn 114px |
| 1440 × 900 | 966px | 796px | 660px | 66px |
| 1366 × 768 | 966px | 796px | 660px | 198px |
| 1280 × 720 | 966px | 796px | 660px | 246px |
| 1536 × 730 | 966px | 796px | 660px | 236px |
| 1024 × 768 | 913px | 743px | 585px | 145px |

## Nguyên nhân

- `.hero-collage` lấy width theo cột (max-width 440px), tỷ lệ 4/6 tạo height 660px. Hiện chỉ responsive theo width, chưa theo chiều cao viewport.
- Khung cung 660px + margin trên/dưới 24/40px + caption min-height 72px = visual 796px.
- Main padding trên 112px + dưới 58px = 170px, tổng 966px.
- `min-height: 734px` chỉ là chiều cao tối thiểu; không giới hạn section ở 734px hoặc viewport.
- `align-items:center` căn cột chữ giữa khối 796px, khiến đáy nút khoảng 751–758px trên viewport 720–768px.
- Ở 1024px, caption xuống dòng làm chiều cao tăng thêm. Không thể chỉ tính canvas mà bỏ chiều cao chữ thực tế.
- Menu fixed đã được chừa trong padding đầu; không cộng thêm menu lần nữa khi tính tổng.

## Các hướng đề xuất (chưa triển khai)

1. **Giữ tỷ lệ cung, giới hạn kích thước theo chiều cao viewport**: lấy diện tích còn lại sau padding/caption để tính cả width và height của cung. Giữ nguyên ảnh, tọa độ, số lượng. Trên viewport thấp ảnh sẽ nhỏ hơn.
2. **Làm cung thấp hơn, giữ ảnh tương đối lớn**: giảm chiều cao khung so với chiều rộng, tính lại tọa độ/góc/card scale; cân nhắc ít ảnh hơn. Cần duyệt vì hình dáng và độ chồng lấn khác bản đã chốt.
3. **Cho hero tiếp tục cuộn nhưng đưa chữ/nút lên trên**: giữ ảnh lớn, giảm khoảng trống và căn cột chữ theo top. Không đạt yêu cầu thấy toàn bộ hero trong màn đầu, nhưng đảm bảo thông điệp/CTA thấy trước.

Đề xuất ưu tiên hướng 1 cùng padding và typography theo viewport thấp, để giữ bố cục đã chọn. Không dùng height:100vh + overflow:hidden để giấu phần bị dư. Nội dung CMS dài hơn, zoom lớn hoặc viewport quá thấp vẫn cần được phép tăng chiều cao tự nhiên.

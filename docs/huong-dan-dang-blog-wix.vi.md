# Hướng dẫn nhập bài và định dạng Wix Blog cho Arista

Tài liệu này dành cho người nhập bài trên website Arista, gồm hướng dẫn cụ thể cho bài “Luyện piano tại nhà: tập gì trong 20 phút?” và quy trình dùng lại cho các bài sau. Nhập bài bằng Wix Blog; giao diện website được code riêng. Hoàn thành các bước rồi lưu nháp để kiểm tra, chưa xuất bản.

## Bài 2 cần những tệp nào

Các đường dẫn dưới đây tính từ thư mục dự án `C:\Users\tritt\Desktop\work\arista`.

| Tệp | Dùng để làm gì |
| --- | --- |
| `output/blog-import/02-xay-dung-thoi-quen-luyen-piano-tai-nha.txt` | Nội dung và các giá trị để nhập thủ công |
| `output/blog-import/02-xay-dung-thoi-quen-luyen-piano-tai-nha.html` | Bản dễ đọc, xem thứ tự nội dung và cách chia đoạn |
| `assets/images/blog/practice-plan.png` | Ảnh bìa sơ đồ buổi tập, đã chuyển sang PNG |
| `assets/images/blog/practice-hands.jpg` | Ảnh chèn trong mục “10 phút: sửa một đoạn khó” |

Không upload tệp TXT/HTML làm bài viết; mở để sao chép nội dung. Không dùng tệp SVG để nhập ảnh bài này, dùng PNG đã chuẩn bị.

## Bước 1 Nhập tiêu đề và nội dung

Trong Dashboard → Blog → Posts, mở bài nháp thứ hai đang tạo. Nếu chưa tạo mới dùng Create New Post, tránh tạo trùng bài.

Ô tiêu đề:

> Luyện piano tại nhà: tập gì trong 20 phút?

Ô nội dung: lấy phần sau dòng `NỘI DUNG BÀI — sao chép từ đoạn bên dưới:` trong TXT. Không dán các dòng TIÊU ĐỀ, CHUYÊN MỤC, SEO TITLE, META DESCRIPTION, TÓM TẮT, đường dẫn ảnh hoặc hướng dẫn trạng thái vào nội dung bài.

Ở cuối TXT có phần `LIÊN KẾT THAM KHẢO` phục vụ việc lấy URL. Không dán phần đó thêm lần nữa nếu đã có mục “Tài liệu tham khảo” trong bài. Cách gắn nguồn ở bước 7 dưới đây.

Nếu sao chép từ TXT, dùng Paragraph cho nội dung rồi áp dụng Heading và danh sách trong Wix. Nếu sao chép bản HTML có định dạng, vẫn kiểm tra lại kiểu từng tiêu đề và các dòng trống sau khi dán.

Đoạn mở đầu bắt đầu bằng “Có hôm bạn ngồi trước đàn khá lâu…”: để Paragraph, không đổi thành Heading, không in đậm toàn đoạn. Giữ câu cuối giải thích 20 phút chỉ là ví dụ, không phải yêu cầu cho mọi người học.

## Bước 2 Đặt các tiêu đề đúng cấp

Đặt con trỏ vào dòng tiêu đề hoặc chọn đúng dòng đó → Text style → Heading 2. Không chọn cả đoạn nội dung theo sau. Không chỉ tăng cỡ chữ để giả làm tiêu đề.

Các dòng phải là Heading 2:

1. 2 phút: mở đúng bài, chọn đúng việc
2. 10 phút: sửa một đoạn khó
3. 5 phút: đưa đoạn vừa sửa trở lại câu nhạc
4. 3 phút: ghi lại kết quả và câu hỏi
5. Giữ nhịp sinh hoạt, không chạy theo số phút
6. Tài liệu tham khảo

Các số 1–6 ở trên chỉ để liệt kê trong hướng dẫn, không thêm chúng vào tiêu đề bài. Tiêu đề thực tế bắt đầu bằng “2 phút”, “10 phút”… như nội dung gốc.

Tiêu đề chính đã ở ô Add Title riêng, không dán lại vào nội dung và không tạo thêm Heading 1.

Các đoạn bên dưới dùng Paragraph, căn trái. Không căn đều hai lề, không đổi font/màu từng đoạn, không dùng nhiều lần Enter để tạo khoảng cách. Giao diện code riêng quản lý font và khoảng cách khi hiển thị.

## Bước 3 Định dạng phần nhật ký

Trong mục “3 phút: ghi lại kết quả và câu hỏi”, có mẫu nhật ký. Không cần dựng bảng, khung màu hoặc chèn ảnh cho phần này.

Dòng nhãn **VÍ DỤ NHẬT KÝ SAU BUỔI TẬP**: để Paragraph và in đậm.

Định dạng nội dung thành bốn đoạn Paragraph như dưới, mỗi đoạn chỉ in đậm nhãn trước dấu hai chấm:

**Đoạn đã tập:** Cuối ô nhịp 4 đến đầu ô nhịp 5.

**Điều đã làm được:** Tay trái chuyển vị trí liền hơn ở tốc độ chậm.

**Cần hỏi giáo viên:** Khi ghép hai tay, em thường dừng ở nốt đầu ô 5. Em nên đếm thế nào?

**Buổi tiếp theo:** Kiểm tra lại chỗ nối trước khi chơi cả câu.

Không biến bốn nhãn này thành Heading 2; chúng là nội dung ví dụ thuộc mục nhật ký. Nếu bản dán bị dính “Đoạn đã tậpCuối ô…”, tách và sửa đúng theo mẫu trên.

## Bước 4 Tải và đặt ảnh

### Thư mục ảnh

Trong Media Manager → Site Files, tạo thư mục:

```text
Blog
└── Kien-thuc-hoc-nhac
    └── luyen-piano-20-phut
```

Đây chỉ là cách quản lý, tên thư mục không làm bài tự lên kết quả Google. Upload `practice-plan.png` và `practice-hands.jpg`. Có thể giữ tên tệp hiện tại để dễ đối chiếu tài liệu.

### Ảnh bìa

Mở Settings → General → Featured image, chọn `practice-plan.png` (sơ đồ 02–10–05–03). Nếu Wix tự lấy ảnh bàn tay trong nội dung làm bìa thì đổi lại đúng sơ đồ này.

Alt text ảnh bìa:

> Sơ đồ buổi tập piano 20 phút gồm chuẩn bị, tập trung, nối câu và ghi chú.

Featured image hiện không có ô caption riêng trong cài đặt đã kiểm tra của site. Không nhập ghi nguồn vào Alt text. Ảnh bìa này là minh họa do dự án tạo, không phải ảnh Unsplash; không ghi tên Kateryna/Isaac cho ảnh bìa.

Không cần chèn lại sơ đồ ảnh bìa vào nội dung bài nếu không có mục đích riêng.

### Ảnh trong nội dung

Tìm cuối mục “10 phút: sửa một đoạn khó”, sau đoạn kết bằng “theo hướng dẫn của giáo viên”, trước tiêu đề “5 phút: đưa đoạn vừa sửa trở lại câu nhạc”.

Tại vị trí `[CHÈN ẢNH: practice-hands.jpg]`, xóa dòng đánh dấu, dùng Add → Image → chọn `practice-hands.jpg`. Đặt ảnh căn giữa theo luồng nội dung, không cho chữ chạy bao quanh ảnh. Chỉ cần ảnh vừa chiều rộng nội dung, không kéo méo hoặc crop làm mất bàn tay.

Alt text ảnh trong bài:

> Người chơi piano nhìn ngang, hai tay trên bàn phím và phản chiếu trên thân đàn.

Bấm ảnh → cài đặt ảnh để nhập Alt text. Nếu thấy Write a caption dưới ảnh, dùng caption:

> Tập riêng chỗ nối giữa hai câu giúp buổi tập có một nhiệm vụ rõ ràng.

Xóa đoạn văn bên ngoài ảnh có cùng câu để không bị lặp caption. Không giữ dòng `[CHÈN ẢNH…]`, tên tệp hoặc đường dẫn trong nội dung xuất bản.

Ảnh này là ảnh minh họa của Isaac Ibbott, không mô tả là học viên hoặc cơ sở Arista. Ghi nguồn cuối bài theo bước 7. Câu “Ảnh: Isaac Ibbott / Unsplash” chỉ cần xuất hiện một lần ở vị trí ghi nguồn đã chọn.

## Bước 5 General và chuyên mục

Settings → General:

| Trường | Giá trị |
| --- | --- |
| Featured image | `practice-plan.png` |
| Alt text | Sơ đồ buổi tập piano 20 phút gồm chuẩn bị, tập trung, nối câu và ghi chú. |
| Excerpt | Một buổi tập có mục tiêu, ví dụ sửa đoạn khó và mẫu nhật ký ngắn để biết hôm nay mình đã tiến bộ ở đâu. |
| Writer | Chọn hồ sơ Arista Music Center nếu có và đúng người/đơn vị chịu trách nhiệm nội dung. Không gõ tên một giáo viên khi họ chưa là tác giả bài. |
| Publish date | Để lịch xuất bản thực tế khi quyết định đăng; không đặt ngày cũ giả. |
| Related posts | Có thể để trống khi các bài khác còn là nháp. |
| Feature this post | Tạm không bật; chưa cần quyết định bài nổi bật. |

Settings → Categories: nhập “Kiến thức học nhạc” → Add/Create hoặc nút xác nhận → đánh dấu chọn chuyên mục vừa tạo. Phải thấy Categories có số 1 và ô chuyên mục được chọn; nhập tên vào ô tạo rồi bỏ đó chưa phải đã gán chuyên mục.

Tags có thể để trống. Không cần thêm nhiều tag/tạo chuyên mục gần giống nhau chỉ để đủ trường.

## Bước 6 SEO

SEO → Basics, nhập:

**Title tag**

```text
Luyện piano tại nhà: tập gì trong 20 phút? | Arista
```

**Meta description**

```text
Gợi ý buổi luyện piano 20 phút tại nhà, cách tập đoạn khó, dùng máy đếm nhịp và ghi nhật ký luyện tập. Điều chỉnh theo bài giáo viên giao.
```

**URL slug**

```text
xay-dung-thoi-quen-luyen-piano-tai-nha
```

Chỉ nhập phần slug, không nhập cả tên miền. Đây là slug đã dùng trong dữ liệu local; tiêu đề bài và slug không cần giống từng chữ. Khi bài đã có URL được chia sẻ/đăng thật, không tự đổi slug thường xuyên.

Giữ **Let search engines index this page** bật để bài đủ điều kiện index khi xuất bản. Không thêm noindex riêng cho bài dự định công khai.

SEO → Assistant: Focus keyword có thể nhập “luyện piano tại nhà” để dùng gợi ý của Wix, không bắt buộc. Không sửa câu chữ gượng ép để mọi mục đều xanh. Không tự thêm schema Article thứ hai trong Advanced; giữ cấu hình Wix và kiểm tra khi tích hợp.

Social share: nếu Wix đã dùng đúng tiêu đề và ảnh bìa thì có thể giữ. Nếu đang hiện ảnh khác, chọn lại `practice-plan.png`. Không cần điền mọi mục nâng cao để lưu nháp.

## Bước 7 Liên kết và nguồn

### Link nội bộ tới lớp Piano

Trong đoạn cuối, bôi đen “lớp Piano tại Arista” → Ctrl+K.

Nếu chọn được Dynamic page → trang bộ môn → Piano thì dùng. Nếu không có trong danh sách, chọn Web address và nhập:

```text
https://www.aristamusiccenter.com/bo-mon/piano
```

Tắt Open link in a new tab cho link nội bộ. Giữ Nofollow và Sponsored tắt. Không cần tự đổi chữ xanh/gạch chân; giao diện code riêng quản lý cách hiển thị.

### Link tới bài 1

Bôi đen “lộ trình bắt đầu học piano” trong đoạn cuối. Khi bài 1 còn nháp, ghi nhớ vị trí để bổ sung sau; không dùng link trang chỉnh sửa Dashboard hoặc link preview riêng tư. Khi bài 1 có URL công khai xác nhận được, gắn URL đó và mở cùng tab. Không tự đoán URL từ slug nếu chưa kiểm tra tuyến URL Wix.

Sau khi bài 2 có URL công khai, quay lại bài 1 gắn link vào “cách tổ chức một buổi luyện piano tại nhà”. Chưa cần liên kết qua lại khi cả hai đang nháp.

### Tài liệu tham khảo

Cuối bài chỉ giữ một tiêu đề Heading 2 “Tài liệu tham khảo”, bên dưới là một mục danh sách:

> Oak National Academy · Effective practice techniques

Bôi đen tên tài liệu → Ctrl+K → Web address → nhập:

```text
https://www.thenational.academy/teachers/lessons/effective-practice-techniques
```

Bật Open link in a new tab, có thể giữ Noreferrer bật; Nofollow và Sponsored tắt. Muốn tạo dấu đầu dòng thì dùng nút Bulleted list, không gõ ký tự • thủ công.

Không giữ thêm một khối “LIÊN KẾT THAM KHẢO” lặp nội dung hoặc URL dài đứng riêng sau khi đã gắn link vào tên tài liệu.

### Nguồn ảnh cuối bài

Sau tài liệu tham khảo, thêm hai đoạn Paragraph:

> Ảnh trong bài: Isaac Ibbott / Unsplash — Nguồn ảnh.

Chỉ bôi đen “Nguồn ảnh” → Ctrl+K → Web address:

```text
https://unsplash.com/photos/person-playing-piano--002g4wurYQ
```

Mở tab mới, Nofollow/Sponsored tắt. Đoạn còn lại:

> Minh họa ảnh bìa: Arista.

Không sao chép dòng ghi nguồn Kateryna Hliznitsova từ bài 1 sang bài 2. Nếu đã ghi Isaac và nguồn một lần dưới ảnh, không cần lặp lại ở cuối; chọn một vị trí ghi công rõ ràng.

## Bước 8 Kiểm tra và lưu nháp

- Tiêu đề chính chỉ có trong ô Add Title; sáu tiêu đề mục dùng Heading 2.
- Đoạn mở đầu và thân bài dùng Paragraph, không định dạng cả bài thành heading.
- Mẫu nhật ký có bốn nhãn, nội dung không dính chữ.
- Đúng ảnh bìa sơ đồ và ảnh bàn tay trong mục 10 phút, cả hai có Alt text.
- Caption ảnh chỉ xuất hiện một lần; không có dòng CHÈN ẢNH hay đường dẫn tệp.
- Không có khoảng trắng tạo bằng nhiều đoạn rỗng hoặc dấu • gõ tay.
- Chuyên mục được chọn, Excerpt đã điền, Writer phù hợp.
- Title tag, meta description, slug đúng; cho phép index khi xuất bản.
- Có link lớp Piano, nguồn tài liệu, nguồn ảnh; không có link demo local, Dashboard hoặc bài chưa công khai.
- Giữ câu giải thích 20 phút là một gợi ý và cần điều chỉnh theo hướng dẫn giáo viên; không thêm lời hứa chắc chắn tiến bộ sau một số ngày.
- Trên đầu trang thấy Draft Saved/Saved. Chưa bấm Publish.

Gửi bài để kiểm tra trước. Bản nháp không xuất hiện trong danh sách công khai `Blog/Posts` của giao diện code riêng. Không Publish chỉ để bỏ qua bước kiểm tra.

## Quy trình dùng cho bài sau

1. Chuẩn bị người đọc, một chủ đề chính, mục tiêu của bài và thông tin đáng tin cậy; xác nhận tác giả và quyền dùng ảnh.
2. Soạn tiêu đề, đoạn mở đầu, các Heading 2 và Paragraph ngắn; dùng Heading 3 cho mục con thực sự. Dùng danh sách thật cho nội dung liệt kê và bảng thật khi cần so sánh.
3. Chuẩn bị một ảnh bìa, ảnh nội dung có lý do sử dụng, Alt text riêng cho từng ảnh, caption khi cần giải thích; ghi nguồn một lần. Không trình bày ảnh stock như ảnh khách hàng/cơ sở thật.
4. Nhập vào Blog, chọn một chuyên mục phù hợp, Writer, Excerpt và ảnh bìa. Không tạo lại các chuyên mục đã có chỉ khác hoa/thường.
5. Điền title tag rõ chủ đề, meta description mô tả đúng nội dung và slug ngắn có nghĩa. Không nhồi từ khóa hoặc đổi URL bài cũ chỉ để tối ưu hình thức.
6. Liên kết tới trang dịch vụ liên quan và bài thực sự hữu ích đã có URL; gắn nguồn hỗ trợ thông tin trong bài. Link nội bộ cùng tab, nguồn bên ngoài tab mới theo quy ước Arista.
7. Video dùng YouTube trước: chèn bằng khối video/liên kết YouTube của Blog, không dùng khối HTML tùy ý hoặc upload Wix video nếu chưa kiểm tra hỗ trợ renderer riêng.
8. Lưu nháp, kiểm tra nội dung và hiển thị, rồi mới quyết định ngày xuất bản. Sau khi xuất bản cần kiểm tra cả URL thật, mobile, ảnh/caption, mục lục, liên kết, canonical và metadata của giao diện code riêng. Thiết lập đúng không bảo đảm Google index hoặc xếp hạng trong thời hạn cố định.

## Phần nhập bài và giao diện code riêng

Heading và cấu trúc Paragraph/List/Image là dữ liệu bài viết. Font, màu link, độ rộng, khoảng cách và bố cục do code website quản lý; không nên sửa thủ công từng đoạn để bù lỗi giao diện.

Khi nhập caption thật vào khối ảnh, cần kiểm tra caption cũng xuất hiện trên giao diện code riêng sau tích hợp. Kiểm tra trong Wix composer chưa đủ để khẳng định renderer riêng đã hiển thị mọi định dạng. Nếu gặp khối chưa hỗ trợ, giữ nội dung trong viewer Wix để sửa code, không xóa nội dung chỉ để ép giao diện mới chạy.

# Đưa 8 trang bộ môn vào Wix

Code và CSV đã được chuẩn bị trong repo. Chưa thay đổi hoặc publish site qua kết nối Wix: connector không truy cập được site hiện tại. Thực hiện các bước Editor dưới đây, tương tự cách đã gắn arista-home.

**Bản hiện tại tạm ẩn Thành tích trên trang bộ môn.** Renderer, mục menu, truy vấn và ánh xạ dữ liệu thành tích đã được comment; không cần tạo collection AristaProgramAwards hoặc các field awardImage/awardImageFocusHeight. CSV cũ được giữ trong `cms/program-archive/`, không import. Thành tích trang chủ không thay đổi.

## 1. Import 4 collection mới

Dùng 4 file trong `cms/program-import/` cho trang bộ môn. CSV UTF-8 có BOM, hỗ trợ tiếng Việt và xuống dòng trong một ô. File `cms/import/AristaPrograms.csv` riêng dành cho các card trang chủ, được bổ sung cột detailUrl để nối đến đủ 8 trang; không import các bảng trang chủ khác.

Nếu đã có collection: chỉ xóa các dòng cũ trong **4 collection trang bộ môn**, giữ collection, field ID/kiểu dữ liệu, quyền đọc và dataset hiện có, rồi import lại. Không cần tạo lại Dynamic Item Page hoặc custom element. Các dòng trong AristaProgramDetails dùng chung template để tạo 8 URL, không cần tạo 8 template riêng.

| Collection ID phải đúng | File CSV | Số dòng mẫu |
| --- | --- | --- |
| AristaProgramDetails | AristaProgramDetails.csv | 8 trang |
| AristaProgramJourney | AristaProgramJourney.csv | 32: mỗi môn 4 chặng |
| AristaProgramTeachers | AristaProgramTeachers.csv | 12 hồ sơ đã điền tên/học vị/trường |
| AristaProgramMedia | AristaProgramMedia.csv | 64: 44 ô ảnh + 20 ô video |

| Bộ môn | programKey | URL dự kiến | Giảng viên | Ảnh khoảnh khắc | Video |
| --- | --- | --- | ---: | ---: | ---: |
| Piano | piano | /bo-mon/piano | 2 | 5 | 4 |
| Violin | violin | /bo-mon/violin | 1 | 6 | 4 |
| Guitar (Classic + Lead/Bass) | guitar | /bo-mon/guitar | 2 | 5 | 4 |
| Saxophone | saxophone | /bo-mon/saxophone | 1 | 5 | 2 |
| Trống | drum | /bo-mon/drum | 1 | 6 | 2 |
| Đàn bầu | dan-bau | /bo-mon/dan-bau | 1 | 3 | 0 |
| Thanh nhạc | vocal | /bo-mon/vocal | 2 | 8 | 2 |
| Mỹ thuật | my-thuat | /bo-mon/my-thuat | 2 | 6 | 2 |

Guitar gồm 2 ô video Classic + 2 ô video Lead/Bass, dùng chung 2 giảng viên (không tạo hồ sơ trùng). Số ảnh trong bảng là ảnh Khoảnh khắc; **chưa tính** 8 ảnh hero, 12 ảnh giảng viên và bìa video cần thêm riêng. Số ô chỉ là dữ liệu chuẩn bị ban đầu, không phải giới hạn: có thể thêm dòng media sau này.

Trong CMS tạo collection thường (Multiple items) và import file tương ứng. Kiểm tra **Collection ID**, **Field ID** và **kiểu dữ liệu** theo `cms/program-schema.json` / `docs/program-cms-field-notes.vi.md`. CSV không tự thiết lập kiểu field, quyền đọc hay ghi chú field.

Làm lần lượt từng bảng:

1. Vào **CMS → Create Collection**, chọn tạo collection của bạn, loại nhiều dòng (Multiple items). Tên hiển thị có thể bằng tiếng Việt theo bảng ở dưới; **Collection ID phải đúng** bảng trên. Nếu giao diện dùng nhãn khác, kiểm tra kết quả cuối cùng là một collection nhiều dòng với đúng ID.
2. Mở collection, chọn chức năng **Import CSV** và chọn file cùng tên trong `cms/program-import/`.
3. Trong bước ghép cột, giữ **Field ID trùng tiêu đề cột CSV**. Có thể đổi tên hiển thị sang tiếng Việt nhưng không đổi ID. Đặt đúng kiểu Text/Number/Boolean/Image; không import mọi cột thành Text.
4. Nếu Wix bỏ qua cột ảnh trống, thêm field Image thủ công sau import. Danh sách field đầy đủ ở `docs/program-cms-field-notes.vi.md`.
5. Kiểm tra tổng số dòng theo bảng trên; mở một dòng để kiểm tra tiếng Việt/xuống dòng. Kiểm tra giá trị show thực sự là Boolean.
6. Thiết lập quyền đọc công khai và quyền ghi cho quản trị viên; lặp lại với collection kế tiếp.

Tên hiển thị gợi ý: **Trang bộ môn**, **Hành trình học bộ môn**, **Giảng viên bộ môn**, **Ảnh & video bộ môn**. Không cần tạo lại các bảng AristaSiteSettings, AristaPageContent, AristaPrograms đang dùng trên trang chủ.

- `show`: **Boolean** (true/false), không phải Text. Đảm bảo các dòng trang và hành trình là true; hồ sơ/media chưa hoàn thiện là false.
- `sortOrder`, các field `...FocusHeight`: **Number**.
- `heroImage`, `photo`, `image`: **Image**, các ô đang trống. Nếu import không tạo field trống thì thêm thủ công với đúng Field ID.
- Những field còn lại: **Text** (cả `tags`, `qualifications` và `youtubeUrl`). `tags` / `qualifications`: mỗi ý một dòng.
- Quyền collection: khách truy cập đọc được; chỉ quản trị viên được thêm/sửa/xóa. Không cho khách ghi vào các bảng nội dung.
- Nếu site dùng Sandbox, đưa dữ liệu đã duyệt sang Live trước khi kiểm tra bản published. Việc import CSV vào Sandbox không chứng minh Live đã có dữ liệu.
- Bộ CSV này dùng khi khởi tạo hoặc thay thế dữ liệu trang bộ môn sau khi đã xóa các dòng cũ theo hướng dẫn trên. Sau khi đã bổ sung ảnh/link và chỉnh sửa trên CMS, không import lặp lại vào bảng còn dữ liệu để tránh tạo bản sao hoặc mất chỉnh sửa.

## 2. Những nội dung cần bổ sung

**AristaProgramDetails:** chọn `heroImage` cho từng môn; viết `heroCaption` mô tả ảnh thật. Duyệt lại slogan, intro, nhãn đối tượng học. Nội dung giới thiệu/lộ trình là bản nháp, không phải cam kết đầu ra hay lịch học.

**AristaProgramTeachers:** đã điền tên ở **name**, vai trò **role**, học vị **credential**, trường đào tạo/chứng chỉ ở **qualifications** theo thông tin chủ dự án cung cấp. Kiểm tra cách viết tên/học vị trước khi công khai; ảnh **photo** đang trống. Hồ sơ đang bật **show=true**: khi thiếu ảnh, UI hiển thị chữ cái đầu của tên. Có thể tắt show cho đến khi đã thêm ảnh. Không điền tên ở title rồi bỏ trống name: code sẽ bỏ qua hồ sơ chưa có name. Không bổ sung kinh nghiệm hoặc thành tích chưa được xác nhận.

**AristaProgramMedia:** đổi title thành tên nội dung thật. Với `kind=image`, thêm image và caption; với `kind=video`, thêm youtubeUrl thật. Field image của video là tùy chọn: có ảnh thì ưu tiên ảnh CMS, để trống thì tự lấy thumbnail YouTube cho cả card và danh sách phát. Nếu ảnh bìa tải lỗi, video vẫn bấm mở được; dòng danh sách thiếu ảnh dùng một cột để tiêu đề không bị bó hẹp. Không cần API key hay thay đổi schema CMS. Bật show cho dòng đã hoàn thiện. Các link YouTube trong CSV đang để trống; không nhúng video minh họa trên Wix. Có thể thêm bao nhiêu dòng tùy nội dung: ngoài trang tối đa 10 ảnh / 6 video, vượt số này hiện ô “Xem tất cả …”; mở thư viện xem được các mục còn lại.


Ở mọi bảng con: programKey phải đúng mã trong bảng trên; sortOrder số nhỏ trước; show=false để ẩn. Dòng thiếu ảnh/link/tên cần thiết tự bị bỏ qua, không hiện hồ sơ hoặc media giả. Toàn bộ 64 dòng ảnh/video đang show=false; thêm ảnh/link thật, sửa tên/chú thích cho đúng nội dung rồi bật show. Đàn bầu chưa có dòng video theo yêu cầu hiện tại.

## 3. Tạo một trang động dùng chung

Từ collection **AristaProgramDetails**, tạo **Dynamic Item Page**. Đặt cấu trúc URL **`/bo-mon/{programKey}`** trong cấu hình trang động, chọn field programKey làm phần biến. Khi đó hai URL dự kiến là `/bo-mon/piano` và `/bo-mon/violin`; kiểm tra lại URL Wix thực sự tạo.

- Dataset động kết nối AristaProgramDetails: đổi ID thành **programDetailsDataset**, Read-only. Không cần thêm dataset cho 3 bảng con; code truy vấn trực tiếp theo programKey.
- Dùng trang không có header/footer Wix mặc định, giống trang arista hiện tại, vì custom element đã chứa header/footer riêng. Xóa các phần tử mẫu của dynamic page để không bị lặp nội dung.
- Thêm **Custom Element**, ID **aristaProgram**, tag **arista-program**, kéo rộng phù hợp trang và kiểm tra ở cả desktop/mobile.
- Build bằng `npm run build`. Tạo file Velo **public/custom-elements/arista-program.js**, dán **toàn bộ dist/arista-program.js**. Chọn file này ở nguồn **Velo file** của custom element; không dán file src có import CSS.
- Tạo file Velo **public/arista-program-content.js**, dán **toàn bộ dist/arista-program-content.js**. Đây là module xử lý dữ liệu, không phải file chọn làm nguồn custom element.
- Dán **src/wix/arista-program.page.js** vào code của **trang động**. Không dán vào masterPage.js hoặc trang chủ.
- Giữ backend **backend/trial-registration.web.js** hiện đang dùng. Code này gọi cùng backend/form thông báo đã cấu hình; không tạo form Wix hay automation mới.

Tài liệu Wix xác nhận [custom element trao đổi dữ liệu qua attributes/events](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/handle-events), và phải đợi [dataset onReady trước getCurrentItem](https://dev.wix.com/docs/velo/velo-only-apis/$w/dynamic-dataset/get-current-item). Code đã xử lý cả hai.

## 4. Nối link từ các card trang chủ

Trong collection **AristaPrograms đang có**, thêm **một field Text** với ID **detailUrl**. Không import đè collection này.

- Dòng Piano: dán URL item page thực tế, dự kiến `/bo-mon/piano`.
- Dòng Violin: dự kiến `/bo-mon/violin`.
- Sáu môn còn lại: dùng URL theo bảng trên. `cms/import/AristaPrograms.csv` đã có đủ detailUrl cho 8 card; nếu bảng trang chủ hiện đã có ảnh và chỉnh sửa của client, nên chỉ thêm/sửa cột detailUrl trực tiếp trên 8 dòng hiện có, không xóa dữ liệu đó để import lại. CSV xuất các ô Image trống: nếu thay toàn bộ AristaPrograms bằng CSV, cần chọn lại ảnh card.

Cập nhật file Velo **public/custom-elements/arista-home.js** bằng bundle **dist/arista-home.js** mới. Trang chủ sẽ có link “Khám phá bộ môn →” khi detailUrl hợp lệ; nút đăng ký vẫn chọn sẵn môn như trước. Page code trang chủ hiện dùng nguyên item từ AristaPrograms nên không cần thay đổi.

Đường quay về trong payload hiện là `/arista` và `/arista?section=programs`. Nếu đổi URL trang chủ, chỉnh hai giá trị homeUrl/programsUrl trong `src/content/program-content.js`, build và cập nhật public module. `?section=programs` được component trang chủ hỗ trợ để đến section Bộ môn.

## 5. Test trước khi publish

1. Mở Test Site lần lượt **8 item** theo bảng trên. Console phải có `ARISTA PROGRAM READY`, đúng programKey; không có `ARISTA PROGRAM CMS` báo lỗi.
2. Trước khi bổ sung dữ liệu: hero có vùng ảnh trống; giảng viên hiện tên/chuyên môn với chữ cái đầu thay ảnh; Khoảnh khắc tự ẩn vì ảnh/link trống và show=false. Đây là trạng thái dữ liệu đã chuẩn bị, không phải lỗi code.
   Khi đang chờ CMS, component hiển thị skeleton màu kem mô phỏng header, chữ và ảnh hero; không còn dòng chữ chờ trên giao diện. Skeleton được thay ngay khi nhận dữ liệu, không có thời gian chờ giả. Hiệu ứng nhịp sáng tự tắt với prefers-reduced-motion. Lỗi tải CMS vẫn hiển thị thông báo lỗi riêng.
3. Thêm một ảnh/hồ sơ/link thật và bật show; tải lại, kiểm tra đúng môn, đúng thứ tự. Tắt show kiểm tra ẩn. Thêm nhiều ảnh/video để thử “Xem tất cả”.
   Trang bộ môn và thanh điều hướng không được có mục Thành tích, kể cả bản local Piano còn giữ dữ liệu mẫu cũ. Trang chủ vẫn có Thành tích như trước.
4. Mở/đóng ảnh và video; thử mobile, Escape, chuyển video liên tục. Video phải dừng khi đóng.
5. Form cuối trang phải chọn sẵn đúng môn theo URL (Trống/Thanh nhạc/Mỹ thuật dùng tên tiếng Việt như card trang chủ). Gửi **một đăng ký test có đánh dấu TEST**, kiểm tra Submissions và email automation như form trang chủ. Dữ liệu test này sẽ ghi thật vào Wix; không có giả lập thành công trong payload Wix.
6. Kiểm tra card trang chủ đi đúng URL, nút Các bộ môn quay về đúng section, header/footer không bị lặp. Bản Test Site có thể cần điều hướng qua menu Editor để kiểm tra từng trang; link đường dẫn thường cần bản đã publish để xem công khai.
   Khi bấm menu Hành trình học/Giảng viên/Ảnh & video hoặc nút Đăng ký, đầu nội dung section nằm cách dưới hai thanh điều hướng khoảng 24px. Khoảng bù cuộn đã trừ padding đầu section (110/80/60px theo breakpoint), không thay đổi bố cục section khi cuộn bình thường.
   Header trang bộ môn dùng chiều cao 76px như trang chủ. Nút header “Đăng ký” dùng chung kiểu CTA nền vàng, chữ 14px, padding 11px 20px; thanh điều hướng dính bên dưới và skeleton cũng theo kích thước này.
   Logo header giữ tỷ lệ tự nhiên, giới hạn tối đa 152×48px trên desktop và 136×44px ở màn hình ≤640px, cùng lề trái với header trang chủ; không ép vào một khung rộng rồi căn giữa ảnh bên trong.
   Khung nội dung trang bộ môn tối đa 1240px đã bao gồm padding 24px mỗi bên, mobile 20px, giống trang chủ. Hero chuyển một cột ở chiều rộng ≤768px. Riêng hero desktop điều chỉnh ảnh và khoảng cách theo chiều cao màn hình để giữ hàng nhãn thông tin trong vùng nhìn; các section còn lại cuộn tự nhiên. Khi cập nhật riêng thay đổi bố cục này, chỉ cần build và thay nội dung public/custom-elements/arista-program.js bằng dist/arista-program.js; không cần sửa CMS, dataset hoặc page code.
   Trong Mobile Editor, kiểm tra Custom Element rộng đủ khung trang 320px, vị trí ngang 0. Không để chiều rộng mặc định 280px: nó tạo khoảng trắng 40px bên phải dù CSS bên trong đã đặt width:100%. Cấu hình này thuộc Editor, không nằm trong bundle JavaScript.
7. Cấu hình SEO title/description riêng cho template/item page theo nội dung đã duyệt. Không tự bật indexing toàn site. Chỉ publish sau khi đã bổ sung ảnh và duyệt bản nháp.

Debug nhanh trong Console của trang bộ môn (đúng frame chứa custom element):

```js
(() => {
  const host = document.querySelector('arista-program');
  let data;
  try { data = JSON.parse(host?.getAttribute('content') || 'null'); } catch (error) { console.warn(error); }
  console.log('ARISTA PROGRAM DEBUG', {
    componentFound: !!host, state: data?.state, message: data?.message,
    programKey: data?.slug, preview: data?.preview,
    teachers: data?.teachers?.length, photos: data?.gallery?.length,
    videos: data?.videos?.length, awards: data?.awards?.length,
    form: !!host?.shadowRoot?.querySelector('#registration'),
  });
})();
```

`state=ready`, `preview=false`, đúng programKey là CMS đã vào component. Có dữ liệu mà không hiển thị thì kiểm tra show, name/image/youtubeUrl và bộ lọc programKey.

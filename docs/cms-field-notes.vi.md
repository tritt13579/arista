# Ghi chú các field CMS Arista

Tài liệu này đối chiếu với schema và code hiện tại của project. Tên field trong cột đầu là Field ID để nhận diện đúng cột trong Wix; chỉ copy phần “Ghi chú để dán vào Wix” vào phần mô tả của field tương ứng.

Ghi chú không tự xuất hiện trong Wix khi thêm file này vào project. Cần nhập vào phần mô tả field của từng collection trong CMS. Không đổi Field ID hoặc kiểu dữ liệu khi thêm ghi chú.

## Arista — Site Settings (`AristaSiteSettings`)

Bảng cấu hình chung. Chỉ giữ một dòng; không thêm dòng thứ hai hoặc xóa dòng đang dùng.

| Field ID | Ghi chú để dán vào Wix |
|---|---|
| `title` | Tên dòng cấu hình để nhận biết trong CMS, không phải tiêu đề website. Giữ tên hiện tại và chỉ dùng một dòng trong bảng này. |
| `logo` | Logo hiển thị ở menu đầu trang và chân trang. Bấm chọn hoặc tải logo mới; ưu tiên ảnh nền trong suốt, rõ nét. |
| `logoFocusHeight` | Căn logo theo chiều dọc trong khung ở menu và chân trang. Nhập số từ 0 đến 100: 0 ưu tiên phía trên, 50 ở giữa, 100 phía dưới. Thường giữ 50; nếu logo không bị cắt thì thay số có thể không tạo khác biệt rõ. |
| `brandName` | Tên thương hiệu dùng làm mô tả logo ở chân trang; cũng hiển thị thay logo nếu thiếu hoặc lỗi ảnh. Ví dụ: Arista Music Center. Không thay thế tiêu đề SEO hoặc tên trên tab trình duyệt. |
| `registrationButtonText` | Chữ trên nút đăng ký ở menu đầu trang, gồm cả menu điện thoại. Ví dụ: Đăng ký học thử. Sửa chữ không thay đổi chức năng mở phần đăng ký. |
| `programButtonText` | Chữ trên nút trong từng thẻ bộ môn ở phần Các bộ môn. Ví dụ: Đăng ký học thử. Nút vẫn dẫn tới form và chọn bộ môn tương ứng. |
| `teacherButtonText` | Field dự phòng, hiện chưa được giao diện sử dụng. Sửa field này chưa làm đổi chữ trên website. Muốn đổi nút ở hồ sơ giảng viên lớn, sửa Primary Button Text trong Page Content, dòng Teachers. |
| `callButtonText` | Chữ trên nút gọi điện trong nhóm liên hệ nổi. Ví dụ: Gọi. Số được gọi lấy từ Primary Phone. |
| `floatingRegistrationButtonText` | Chữ trên nút đăng ký trong nhóm liên hệ nổi. Nên nhập ngắn, ví dụ: Học thử. |
| `zaloButtonText` | Chữ trên nút Zalo trong nhóm liên hệ nổi. Ví dụ: Zalo. Đường dẫn được đặt riêng ở Zalo URL. |
| `messengerButtonText` | Chữ trên nút Messenger trong nhóm liên hệ nổi. Ví dụ: Messenger. Đường dẫn được đặt riêng ở Messenger URL. |
| `addressLabel` | Tiêu đề nhỏ phía trên địa chỉ trong phần Đăng ký học thử. Ví dụ: Địa chỉ. Địa chỉ thực tế nhập ở Address. |
| `phoneLabel` | Tiêu đề nhỏ phía trên các số điện thoại trong phần Đăng ký học thử. Ví dụ: Liên hệ. |
| `hoursLabel` | Tiêu đề nhỏ phía trên giờ hoạt động trong phần Đăng ký học thử. Ví dụ: Giờ hoạt động. |
| `primaryPhone` | Số điện thoại chính: dùng cho nút Gọi, liên hệ trong Hỏi đáp và phần Đăng ký học thử. Nhập số như 0935672244 hoặc +84935672244; không thêm tên người vào đây. |
| `primaryPhoneLabel` | Chữ hiển thị cho số điện thoại chính ở Hỏi đáp và Đăng ký học thử. Có thể nhập: 093.567.2244 (Mr. Hoàng). Khi đổi số, nhớ sửa cả Primary Phone để nút gọi đúng số. |
| `secondaryPhone` | Số điện thoại thứ hai trong phần Đăng ký học thử. Nhập số điện thoại, không thêm tên người. Để trống nếu không muốn hiện số thứ hai. |
| `secondaryPhoneLabel` | Chữ hiển thị cho số điện thoại thứ hai trong phần Đăng ký học thử. Có thể thêm dấu chấm và tên người liên hệ; số được gọi lấy từ Secondary Phone. |
| `address` | Địa chỉ trung tâm hiển thị cạnh form Đăng ký học thử. Nhập địa chỉ đầy đủ, dễ tìm. Sửa ở đây không tự cập nhật địa chỉ trong hồ sơ doanh nghiệp hoặc SEO của Wix. |
| `openingHours` | Giờ hoạt động hiển thị cạnh form Đăng ký học thử. Ví dụ: Thứ Hai – Chủ nhật: 8:00 – 21:00. |
| `locationImage` | Ảnh địa điểm trung tâm cạnh thông tin liên hệ trong phần Đăng ký học thử. Bấm chọn hoặc tải ảnh mới; ưu tiên ảnh rõ mặt tiền hoặc không gian trung tâm. |
| `locationImageFocusHeight` | Căn ảnh địa điểm trong khung: nhập 0 đến 100. 0 ưu tiên phía trên, 50 ở giữa, 100 phía dưới. Nếu phần cần thấy nằm gần đầu ảnh, thử giảm số rồi kiểm tra lại website. |
| `locationImageDescription` | Mô tả ngắn ảnh địa điểm để trình đọc màn hình hiểu ảnh. Ví dụ: Mặt tiền Trung tâm âm nhạc Arista tại Nha Trang. Không hiển thị thành chú thích dưới ảnh. |
| `facebookUrl` | Link Facebook của trung tâm, dùng cho ô Facebook ở cuối phần Khoảnh khắc học viên. Dán URL đầy đủ bắt đầu bằng https://. Để trống để ẩn ô liên kết này. |
| `facebookTitle` | Tiêu đề ô liên kết Facebook ở cuối phần Khoảnh khắc học viên. Nhập ngắn, dễ hiểu, ví dụ: Theo dõi Arista trên Facebook. |
| `facebookDescription` | Mô tả ngắn trong ô liên kết Facebook ở cuối phần Khoảnh khắc học viên. Ví dụ: Cập nhật hoạt động và hình ảnh mới nhất của học viên. |
| `youtubeUrl` | Link kênh hoặc nội dung YouTube, dùng cho ô YouTube ở cuối phần Khoảnh khắc học viên. Dán URL đầy đủ bắt đầu bằng https://. Để trống để ẩn ô liên kết này. |
| `youtubeTitle` | Tiêu đề ô liên kết YouTube ở cuối phần Khoảnh khắc học viên. Ví dụ: Xem các tiết mục biểu diễn. |
| `youtubeDescription` | Mô tả ngắn trong ô liên kết YouTube ở cuối phần Khoảnh khắc học viên. Ví dụ: Những tiết mục của giảng viên và học viên Arista. |
| `zaloUrl` | Link mở Zalo khi bấm nút Zalo trong nhóm liên hệ nổi. Dán link đầy đủ bắt đầu bằng https:// và kiểm tra mở đúng tài khoản của trung tâm. Để trống để ẩn nút. |
| `messengerUrl` | Link mở Messenger khi bấm nút Messenger trong nhóm liên hệ nổi. Dán link đầy đủ bắt đầu bằng https:// và kiểm tra mở đúng trang trò chuyện. Để trống để ẩn nút. |
| `footerDescription` | Đoạn giới thiệu trung tâm ở chân trang, cạnh hoặc dưới logo. Nên viết ngắn khoảng một đến hai câu. |
| `copyrightText` | Dòng bản quyền ở cuối website. Nhập nguyên câu muốn hiển thị, gồm cả năm nếu cần; năm không tự đổi. Ví dụ: © 2026 Arista Music Center. |
| `faqContactText` | Lời mời liên hệ ở cuối phần Hỏi đáp, đi cùng số điện thoại chính. Ví dụ: Bạn còn thắc mắc? Liên hệ Arista để được tư vấn. |

## Arista — Page Content (`AristaPageContent`)

Mỗi dòng là một section có sẵn. Chọn đúng dòng trước khi sửa; một số field chỉ có tác dụng ở các dòng được nêu trong ghi chú. Không thêm section mới bằng cách tự tạo dòng hoặc đổi Section Key.

| Field ID | Ghi chú để dán vào Wix |
|---|---|
| `title` | Tên section để nhận biết dòng trong CMS, ví dụ Hero, Teachers hoặc FAQ. Không phải tiêu đề hiển thị trên website; muốn đổi tiêu đề hãy sửa Heading. |
| `sectionKey` | Mã kỹ thuật để website biết dòng này thuộc section nào. Giữ nguyên giá trị hiện tại; không sửa, dịch tên hoặc để trống. |
| `introText` | Dòng giới thiệu nhỏ phía trên tiêu đề section; ở Hero là dòng nhỏ đầu banner và cũng dùng trong menu điện thoại. Nhập ngắn. Dòng Quote không dùng field này. |
| `heading` | Tiêu đề chính của section, ví dụ Đội ngũ giảng viên. Ở Hero là tiêu đề lớn trên banner. Dòng Registration dùng cho tiêu đề phần giới thiệu, không đổi tiêu đề cố định trên thẻ form. Dòng Quote không dùng field này. |
| `tagline` | Slogan trên banner đầu trang, chỉ dùng ở dòng Hero. Ví dụ: Confidence in being yourself. Các dòng khác hiện không sử dụng. |
| `description` | Mô tả bên dưới tiêu đề section. Riêng dòng Quote: nhập toàn bộ câu trích dẫn vào đây. Muốn tô màu một cụm trong câu Quote, nhập thêm cụm đó vào Labels. |
| `image` | Chỉ dùng ở dòng Hero để đổi ảnh nền banner và dòng Achievements để đổi ảnh lớn của phần Thành tích. Ảnh địa điểm cạnh form nằm trong Site Settings; ảnh bộ môn, giảng viên và khoảnh khắc nằm ở các bảng riêng. |
| `imageFocusHeight` | Căn ảnh của dòng Hero hoặc Achievements trong khung. Nhập 0 đến 100: 0 ưu tiên phía trên, 50 ở giữa, 100 phía dưới. Không làm đổi vị trí ảnh của các bảng khác. |
| `imageDescription` | Mô tả ngắn ảnh của dòng Hero hoặc Achievements cho khả năng tiếp cận. Viết ảnh có ai hoặc hoạt động gì; không phải chú thích hiển thị dưới ảnh. |
| `primaryButtonText` | Chữ nút chính. Hero: nút đăng ký trên banner; Teachers: nút ở hồ sơ giảng viên nổi bật; Registration: nút gửi form. Sửa chữ không đổi chức năng nút. Các dòng khác hiện không dùng. |
| `secondaryButtonText` | Chữ nút thứ hai trên banner, chỉ dùng ở dòng Hero. Nút dẫn đến phần Lộ trình học. Ví dụ: Xem lộ trình học. |
| `menuLabel` | Tên section hiển thị trên menu, ví dụ Giảng viên hoặc Thành tích. Chỉ hiện khi Show in Menu và Show Section cùng được bật. Nên nhập ngắn để menu không quá dài. |
| `showInMenu` | Bật để thêm liên kết của section vào menu; tắt để bỏ liên kết khỏi menu nhưng vẫn giữ section trên trang nếu Show Section đang bật. |
| `showSection` | Bật để hiển thị cả section; tắt để ẩn section và liên kết menu của nó. Nên dùng để ẩn tạm thay vì xóa dòng. Tắt Hero cũng làm mất phần menu đầu trang hiện tại. |
| `labels` | Chỉ dùng ở Quote và Programs. Quote: mỗi dòng là một cụm chữ cần tô màu, phải khớp đúng với câu trong Description. Programs: mỗi dòng là một nhãn như Cơ bản hoặc Nâng cao. Các dòng khác hiện không dùng. |
| `featuredValue` | Con số nổi bật ở phần Thành tích, chỉ dùng ở dòng Achievements. Ví dụ: 43. Nhập thủ công; số này không tự cộng từ danh sách giải thưởng. |
| `featuredLabel` | Chú thích cho con số nổi bật ở phần Thành tích, chỉ dùng ở dòng Achievements. Ví dụ: giải thưởng tại Việt Nam Piano Got Talent 2026. |
| `caption` | Achievements: chú thích hiển thị dưới ảnh lớn và khi mở ảnh. Registration: câu hướng dẫn nhỏ dưới tiêu đề thẻ form. Các dòng khác hiện không sử dụng. |

## Arista — Hero Highlights (`AristaHeroHighlights`)

Các con số nổi bật trên banner đầu trang. Mỗi dòng là một ô số liệu.

| Field ID | Ghi chú để dán vào Wix |
|---|---|
| `title` | Chú thích của một ô số liệu trên banner đầu trang. Ví dụ: Năm giảng dạy của giám đốc chuyên môn. Nên viết ngắn để dễ đọc. |
| `value` | Giá trị lớn trong ô số liệu trên banner, ví dụ 15+, 43 hoặc 11K. Nhập cả dấu cộng hoặc chữ nếu cần; số không tự tính từ các collection khác. |
| `show` | Bật để hiện ô số liệu này trên banner; tắt để ẩn tạm mà vẫn giữ nội dung trong CMS. |

## Arista — Teaching Philosophy (`AristaTeachingPhilosophy`)

Các ý trong phần Triết lý giảng dạy. Tiêu đề chung của phần này sửa trong Page Content.

| Field ID | Ghi chú để dán vào Wix |
|---|---|
| `title` | Tiêu đề của một ý trong phần Triết lý giảng dạy. Mỗi dòng là một ý riêng; nên dùng câu ngắn. |
| `description` | Nội dung giải thích bên dưới tiêu đề của ý này trong phần Triết lý giảng dạy. Nên viết ngắn, dễ hiểu. |
| `show` | Bật để hiện ý này trong phần Triết lý giảng dạy; tắt để ẩn tạm. |

## Arista — Programs (`AristaPrograms`)

Các thẻ bộ môn. Tên bộ môn đang được dùng cho cả lựa chọn trong form đăng ký.

| Field ID | Ghi chú để dán vào Wix |
|---|---|
| `title` | Tên bộ môn trên thẻ và trong form đăng ký, ví dụ Piano hoặc Violin. Muốn đổi tên hoặc thêm bộ môn mới, báo dev để cập nhật kiểm tra form; chỉ sửa CMS có thể khiến gửi đăng ký bị từ chối. |
| `categoryLabel` | Nhãn nhỏ trên thẻ bộ môn, dùng để giới thiệu hoặc phân loại. Nhập ngắn; để trống nếu không muốn hiện nhãn. |
| `description` | Mô tả bộ môn dưới tên trên thẻ. Có thể giới thiệu người học phù hợp hoặc nội dung học; nên viết ngắn để các thẻ cân đối. |
| `image` | Ảnh trên thẻ bộ môn. Bấm chọn hoặc tải ảnh mới đúng với bộ môn; kiểm tra phần ảnh bị cắt trên điện thoại sau khi thay. |
| `imageFocusHeight` | Căn ảnh bộ môn trong khung: nhập 0 đến 100. 0 ưu tiên phía trên, 50 ở giữa, 100 phía dưới. Nếu ảnh bị cắt đầu, thử giảm số rồi xem lại. |
| `show` | Bật để hiện bộ môn trên trang và trong danh sách chọn của form. Tắt để ẩn bộ môn khỏi cả hai nơi mà không xóa dữ liệu. |

## Arista — Learning Journey (`AristaLearningJourney`)

Các bước trong Lộ trình học. Số bước được tạo theo thứ tự hiển thị, không nhập trong tiêu đề.

| Field ID | Ghi chú để dán vào Wix |
|---|---|
| `title` | Tên một bước trong Lộ trình học, ví dụ Làm quen nhạc cụ. Không cần thêm 01, 02 vào tên vì website tự đánh số theo thứ tự hiển thị. |
| `description` | Mô tả ngắn nội dung học ở bước này, hiển thị dưới tên bước. Ví dụ: Tư thế, cách cầm và đặt tay đúng. |
| `show` | Bật để hiện bước này trong Lộ trình học; tắt để ẩn tạm. Các bước còn lại sẽ được đánh số liên tục. |

## Arista — Teachers (`AristaTeachers`)

Mỗi dòng là một giảng viên. Bật Featured Teacher cho một người để hiển thị hồ sơ lớn; những người còn lại hiển thị ở các thẻ nhỏ.

| Field ID | Ghi chú để dán vào Wix |
|---|---|
| `title` | Tên giảng viên hiển thị trên website. Có thể nhập cả cách xưng hô, ví dụ: Thầy Trần Hữu Nhật Hoàng. |
| `role` | Vai trò hoặc bộ môn giảng dạy. Ở hồ sơ lớn, đây là dòng nhỏ phía trên tên; ở thẻ nhỏ, nằm dưới tên. Ví dụ: Giám đốc chuyên môn hoặc Giảng viên Violin. |
| `credential` | Bằng cấp hoặc thông tin chuyên môn ngắn, hiển thị trong hồ sơ giảng viên. Ví dụ: Thạc sĩ Biểu diễn Piano. |
| `photo` | Ảnh chân dung giảng viên, dùng ở hồ sơ lớn hoặc thẻ nhỏ. Chọn ảnh rõ mặt, đủ nét; không dùng ảnh chụp nhóm nếu khó nhận biết người. |
| `photoFocusHeight` | Căn chân dung trong khung: nhập 0 đến 100. 0 ưu tiên đầu ảnh, 50 ở giữa, 100 cuối ảnh. Nếu bị cắt đầu, thử 20–30 rồi kiểm tra lại. Để trống hiện dùng mức 20. |
| `qualifications` | Danh sách chuyên môn hoặc kinh nghiệm, chỉ hiển thị trong hồ sơ giảng viên nổi bật. Mỗi ý nhập trên một dòng; website tự tạo gạch đầu dòng. |
| `highlightText` | Câu ngắn trên nhãn đè lên ảnh của giảng viên nổi bật. Ví dụ: Hơn 15 năm giảng dạy piano. Không hiện ở các thẻ giảng viên nhỏ. |
| `featured` | Bật để chọn giảng viên có hồ sơ lớn ở đầu phần Giảng viên. Chỉ nên bật cho một người; nếu bật nhiều, website chọn người đầu tiên trong danh sách đang hiển thị. |
| `show` | Bật để hiện giảng viên; tắt để ẩn cả ảnh và thông tin của người này. Giảng viên nổi bật cũng cần bật mục này để xuất hiện. |

## Arista — Achievements (`AristaAchievements`)

Danh sách cuộc thi, sự kiện và kết quả trong phần Thành tích. Các số liệu tổng hợp và ảnh được chỉnh riêng.

| Field ID | Ghi chú để dán vào Wix |
|---|---|
| `title` | Tên cuộc thi hoặc sự kiện trong danh sách Thành tích. Nhập tên đầy đủ, đúng chính tả. |
| `year` | Năm hoặc mốc thời gian hiển thị cạnh thành tích. Ví dụ: 2026 hoặc 2025–2026. Sửa năm không tự sắp xếp lại danh sách. |
| `result` | Kết quả hoặc mô tả thành tích bên dưới tên cuộc thi/sự kiện. Có thể ghi loại giải, số giải hoặc thành tích của học viên. |
| `show` | Bật để hiện thành tích này; tắt để ẩn tạm. Việc bật/tắt không tự cập nhật các con số tổng hợp ở những bảng khác. |

## Arista — Award Counts (`AristaAwardCounts`)

Các ô số liệu tổng hợp trong phần Thành tích. Đây không phải các số liệu trên banner đầu trang.

| Field ID | Ghi chú để dán vào Wix |
|---|---|
| `title` | Nhãn mô tả một số liệu trong phần Thành tích, ví dụ tên loại giải. Không phải tên cuộc thi trong danh sách chi tiết. |
| `value` | Giá trị của số liệu tương ứng trong phần Thành tích. Nhập số hoặc nội dung ngắn cần hiển thị; không tự tính từ danh sách thành tích. |
| `show` | Bật để hiện số liệu này trong phần Thành tích; tắt để ẩn tạm. |

## Arista — Achievement Photos (`AristaAchievementPhotos`)

Các ảnh bổ sung của phần Thành tích. Ảnh lớn chính của section nằm trong Page Content, dòng Achievements.
Trên trang hiện tối đa 8 ảnh bổ sung. Nếu có nhiều hơn, ảnh cuối có icon album và dòng “Xem tất cả N ảnh” (N là tổng số ảnh trong thư viện); bấm ảnh để mở thư viện có toàn bộ ảnh đang bật Show Item. Không cần nhập con số này trong CMS.

| Field ID | Ghi chú để dán vào Wix |
|---|---|
| `title` | Chú thích của ảnh thành tích, hiển thị cùng ảnh và khi mở ảnh lớn. Nhập tên sự kiện hoặc nội dung ảnh, có thể thêm năm. |
| `image` | Ảnh bổ sung trong phần Thành tích. Bấm chọn hoặc tải ảnh mới; nên dùng ảnh rõ nét vì khách có thể bấm xem toàn màn hình. |
| `imageFocusHeight` | Căn ảnh thành tích trong khung nhỏ: nhập 0 đến 100. 0 ưu tiên phía trên, 50 ở giữa, 100 phía dưới. Không cắt ảnh gốc khi mở xem toàn màn hình. |
| `show` | Bật để hiện ảnh trong phần Thành tích và trình xem ảnh; tắt để ẩn tạm. |

## Arista — Student Moments (`AristaStudentMoments`)

Các ảnh Khoảnh khắc học viên. Ảnh nổi bật trong bố cục phụ thuộc thứ tự danh sách, không có field chọn ảnh nổi bật riêng.
Trên trang hiện tối đa 8 ảnh. Nếu có nhiều hơn, ảnh cuối có icon album và dòng “Xem tất cả N ảnh” (N là tổng số ảnh trong thư viện); bấm ảnh để mở thư viện có toàn bộ ảnh đang bật Show Item. Không cần nhập con số này trong CMS.

| Field ID | Ghi chú để dán vào Wix |
|---|---|
| `title` | Chú thích ảnh trong phần Khoảnh khắc học viên và khi mở ảnh lớn. Nhập ngắn, ví dụ: Đàn bầu hoặc tên buổi biểu diễn. |
| `image` | Ảnh trong phần Khoảnh khắc học viên. Chọn hoặc tải ảnh rõ nét; website bố trí ảnh theo thứ tự danh sách. |
| `imageFocusHeight` | Căn ảnh trong khung Khoảnh khắc: nhập 0 đến 100. 0 ưu tiên đầu ảnh, 50 ở giữa, 100 cuối ảnh. Nếu muốn giữ khuôn mặt gần đầu ảnh, thử giảm xuống 20–30. Ảnh mở toàn màn hình vẫn hiển thị đầy đủ. |
| `show` | Bật để hiện ảnh trong Khoảnh khắc học viên và trình xem ảnh; tắt để ẩn tạm. Bố cục sẽ phân bổ lại theo các ảnh còn hiện. |

## Arista — FAQ (`AristaFaq`)

Các câu hỏi và câu trả lời trong phần Hỏi đáp.

| Field ID | Ghi chú để dán vào Wix |
|---|---|
| `title` | Câu hỏi hiển thị trong phần Hỏi đáp. Nhập đầy đủ câu hỏi, ví dụ: Người lớn chưa biết nhạc có học được không? |
| `answer` | Câu trả lời hiện ra khi khách bấm vào câu hỏi. Nhập văn bản dễ hiểu; có thể xuống dòng để chia ý. Không nhập mã HTML. |
| `show` | Bật để hiện câu hỏi và câu trả lời này; tắt để ẩn tạm mà không xóa nội dung. |

## Arista — Testimonials (`AristaTestimonials`)

Những chia sẻ của học viên và phụ huynh, nằm sau Khoảnh khắc và trước Hỏi đáp.
Mỗi hàng là một người chia sẻ. Có thể thêm hàng mới; số lượng trên trang tự cập nhật.
Tiêu đề và mô tả section nằm ở Page Content, dòng Testimonials.

| Field ID | Ghi chú để dán vào Wix |
|---|---|
| `title` | Tên người chia sẻ, hiện dưới lời đánh giá và trong danh sách chọn bên phải. Nhập tên muốn công khai, ví dụ Trúc Dương hoặc Chị Như. |
| `role` | Thông tin dưới tên: ghi bộ môn của học viên hoặc tên con của phụ huynh, ví dụ Học viên · Piano hoặc Phụ huynh Nguyên Huy. |
| `excerpt` | Đoạn chia sẻ ngắn hiện ngay khi xem đánh giá. Chọn những ý tiêu biểu, khoảng 40–60 từ. Để trống thì trang hiện toàn bộ nội dung ở Chia sẻ đầy đủ. |
| `quote` | Nội dung chia sẻ đầy đủ, hiện khi khách bấm Đọc đầy đủ. Nhập văn bản thông thường, không nhập mã HTML. Nếu giống trích đoạn ngắn thì không có nút mở rộng. |
| `photo` | Ảnh chân dung của người chia sẻ. Chọn ảnh trong Media Manager; để trống thì trang tự hiện chữ viết tắt của tên. |
| `photoFocusHeight` | Căn chân dung trong hình tròn: nhập 0–100. 0 ưu tiên phía trên, 50 ở giữa, 100 phía dưới. Không cần sửa nếu không có ảnh. |
| `show` | Bật để hiện lời chia sẻ; tắt để ẩn tạm. Danh sách và tổng số đánh giá trên trang tự cập nhật khi tải lại. |

## Lưu ý chung khi hướng dẫn client

- Chỉ sửa nội dung, ảnh và các công tắc hiển thị; không đổi Field ID, Collection ID, Section Key hoặc kiểu dữ liệu.
- Các bảng danh sách hiện lấy thứ tự mà dataset cung cấp từ CMS; không có field sắp xếp theo số riêng. Sửa tên hoặc năm không tự đổi thứ tự.
- Lưu nội dung rồi reload trang thật để kiểm tra. Nếu collection có Sandbox/Live, cần bảo đảm dữ liệu được cập nhật ở Live.
- CMS không tự chỉnh tiêu đề SEO, ảnh Social Share, thông tin doanh nghiệp Wix hoặc nội dung email automation.
- Tiêu đề cố định trên thẻ form, nhãn các ô nhập, nội dung báo thành công/lỗi và chữ “Liên hệ” của nút mở liên hệ nổi hiện được đặt trong code; không phải field CMS.
- Khi dùng Velo File, sửa nội dung CMS không cần build lại bundle. Chỉ thay đổi giao diện hoặc tính năng trong source code mới cần build và cập nhật file vào Wix.

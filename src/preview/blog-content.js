// Publication-oriented editorial content; local data only, not live Wix records.
// Illustrations are original. Stock photo sources and licenses are recorded alongside each asset.
const photo = (file, alt, photographer, source, caption, position = "center") => ({
  src: `./assets/images/blog/${file}`, alt, photographer, source, caption, position,
  credit: `${photographer} / Unsplash`,
});
const illustration = (file, alt, caption) => ({
  src: `./assets/images/blog/${file}`, alt, caption, credit: "Minh họa: Arista",
});
const firstCover = photo("first-lesson.jpg", "Hai bàn tay đặt trên bàn phím piano gỗ", "Kateryna Hliznitsova",
  "https://unsplash.com/photos/a-person-playing-a-piano-with-their-hands-SOw2TJnbS2I",
  "Ảnh minh họa thao tác trên bàn phím piano.");
const practiceCover = illustration("practice-plan.svg", "Sơ đồ buổi tập piano 20 phút: chuẩn bị, tập trung, nối câu và ghi chú",
  "Một cách chia buổi tập để thử áp dụng; điều chỉnh thời lượng cùng giáo viên.");
const buyingCover = photo("grand-room.jpg", "Đàn grand piano màu đen và ghế trong căn phòng sáng", "Clu Soh",
  "https://unsplash.com/photos/black-grand-piano-on-white-room-0OHsrQ6G5Cc",
  "Piano cơ cần được cân nhắc cùng diện tích và điều kiện sử dụng tại nhà.", "center 72%");

export const posts = [
  {
    slug: "nguoi-moi-hoc-piano-nen-bat-dau-tu-dau",
    title: "Người mới học piano nên bắt đầu từ đâu?",
    category: "Piano",
    author: "Arista Music Center",
    authorAvatar: { type: "logo", src: "./assets/images/v3/logo.png" },
    excerpt: "Tìm nốt Đô, chuẩn bị tư thế và đọc câu nhạc đầu tiên: một lộ trình khởi đầu dành cho người chưa từng học đàn.",
    description: "Người mới học piano bắt đầu thế nào? Hướng dẫn nhận biết bàn phím, tư thế ngồi, tiết tấu và chuẩn bị cho buổi học đầu tiên.",
    cover: firstCover, image: firstCover.src, imageAlt: firstCover.alt,
    introduction: "Bạn không cần chơi được một bài hoàn chỉnh để có một buổi học piano đầu tiên hiệu quả. Điều cần hơn là biết cách tìm nốt trên đàn, ngồi thoải mái và nghe được mình đang chơi gì. Bài viết này giúp bạn hình dung những việc nên làm trước khi bước vào các bản nhạc dài.",
    sections: [
      { id: "muc-tieu", title: "1. Chọn một điểm xuất phát cụ thể",
        body: `<p>Hãy viết một câu ngắn: “Tôi muốn tự chơi một bản nhạc yêu thích”, “Tôi muốn biết đọc bản nhạc” hoặc “Tôi muốn học để đệm hát”. Những mong muốn này có thể đi cùng nhau, nhưng một ưu tiên ban đầu sẽ giúp bạn trao đổi với giáo viên rõ hơn.</p><p>Tiếp theo, ghi lại điều kiện thực tế: bạn có đàn ở nhà chưa, thường rảnh vào lúc nào và đã từng học nhạc hay chưa. Nếu đăng ký cho trẻ, phụ huynh có thể kể về những hoạt động âm nhạc con thích. Không cần cho con học trước một bài để “chuẩn bị kiểm tra”.</p>` },
      { id: "ban-phim", title: "2. Dùng nhóm phím đen để tìm nốt Đô",
        body: `<p>Nhìn dọc bàn phím, bạn sẽ thấy các phím đen lặp lại thành nhóm hai và nhóm ba. Phím trắng ngay bên trái mỗi nhóm hai phím đen là nốt Đô, ký hiệu C. Từ Đô đi sang phải, các phím trắng lần lượt là Rê, Mi, Fa, Sol, La, Si rồi trở lại Đô ở quãng cao hơn.</p><p>Thử tìm ba nốt Đô ở ba vị trí khác nhau. Chơi từng nốt và lắng nghe: về phía phải, âm thanh cao hơn; về phía trái, âm thanh trầm hơn. Mục tiêu là nhận ra quy luật, chưa cần nhớ hết bàn phím.</p>`,
        media: illustration("keyboard-map.svg", "Bàn phím một quãng tám: Đô C, Rê D, Mi E, Fa F, Sol G, La A, Si B, Đô C; Đô ở bên trái nhóm hai phím đen.", "Tìm nhóm hai phím đen, rồi nhìn sang phím trắng liền bên trái để xác định nốt Đô.") },
      { id: "tu-the", title: "3. Chỉnh ghế trước khi chỉnh ngón",
        body: `<p>Đặt ghế đối diện đàn, ngồi sao cho cánh tay có khoảng trống để di chuyển. Theo hướng dẫn tư thế của Yamaha, độ cao ghế nên cho phép khuỷu tay gần ngang bàn phím; vai và cánh tay được thả lỏng. Với trẻ nhỏ, cần điểm tựa chân phù hợp thay vì để hai chân treo lơ lửng.</p><p>Đặt tay lên đàn với các ngón cong tự nhiên, tránh gồng vai hoặc ép cổ tay vào một vị trí cố định. Một bức ảnh không đủ để đánh giá kỹ thuật: hãy nhờ giáo viên quan sát khi bạn đang chơi và chuyển tay giữa các vị trí.</p>` },
      { id: "not-va-nhip", title: "4. Học nốt và nhịp trong một câu ngắn",
        body: `<p>Biết tên nốt chưa có nghĩa là đã chơi đúng một câu nhạc. Bạn còn cần nhận ra nốt nào dài, nốt nào ngắn và khi nào phải nghỉ. Hãy nghe hoặc vỗ tiết tấu trước, rồi thử đưa tiết tấu đó lên đàn theo bài được hướng dẫn.</p><p>Chọn một câu ngắn vừa sức. Đọc tên nốt, xác định ngón tay và chơi chậm để theo dõi cả âm thanh lẫn nhịp. Nếu đang phải đoán nhiều nốt cùng lúc, nên giảm lượng thông tin cần xử lý thay vì cố đẩy tốc độ. Bạn có thể đánh dấu chỗ chưa hiểu để hỏi ở buổi học tiếp theo.</p>` },
      { id: "buoi-hoc-dau", title: "5. Mang gì tới buổi học đầu tiên?",
        body: `<p>Một cuốn sổ nhỏ và thông tin về cây đàn đang sử dụng là đủ để bắt đầu cuộc trao đổi. Nếu có bản nhạc hoặc video biểu diễn khiến bạn muốn học, hãy lưu liên kết để giáo viên hiểu sở thích của bạn.</p><div class="editorial-note"><strong>Ba câu hỏi nên hỏi giáo viên</strong><ul><li>Với nền tảng hiện tại, tôi nên tập việc gì đầu tiên?</li><li>Thế nào là hoàn thành bài tập được giao?</li><li>Đàn và góc luyện tập ở nhà cần điều chỉnh gì?</li></ul></div><p>Đừng lấy tốc độ học của một người khác làm lịch trình cho mình. Một bước khởi đầu tốt là biết rõ bài tập ở nhà và cách tự nhận ra chỗ cần hỗ trợ.</p>` },
      { id: "sau-buoi-hoc", title: "Sau buổi học: biến hướng dẫn thành việc làm",
        body: `<p>Trước khi rời lớp, thử nhắc lại bằng lời việc mình sẽ tập ở nhà. Ví dụ: “Em tìm nốt Đô, đọc câu đầu và giữ nhịp theo cách cô vừa hướng dẫn”. Nếu chưa nói rõ được, hãy hỏi lại ngay.</p><p>Khi đã có bài tập cụ thể, đọc tiếp <a href="./blog-post.html?bai=xay-dung-thoi-quen-luyen-piano-tai-nha">cách tổ chức một buổi luyện piano tại nhà</a>. Nếu bạn đang tìm nơi bắt đầu tại Nha Trang, có thể xem <a href="./piano.html">chương trình Piano của Arista</a> và trao đổi về mục tiêu học của mình.</p>` },
    ],
    sources: [
      { title: "Yamaha · Now, Let's Play Some Notes! — cấu trúc bàn phím", url: "https://www.yamaha.com/en/musical_instrument_guide/piano/play/" },
      { title: "Yamaha · Correct Posture When Playing the Piano — tư thế", url: "https://www.yamaha.com/en/musical_instrument_guide/piano/play/play002.html" },
    ],
  },
  {
    slug: "xay-dung-thoi-quen-luyen-piano-tai-nha",
    title: "Luyện piano tại nhà: tập gì trong 20 phút?",
    category: "Kiến thức học nhạc",
    author: "Arista Music Center",
    authorAvatar: { type: "logo", src: "./assets/images/v3/logo.png" },
    excerpt: "Một buổi tập có mục tiêu, ví dụ sửa đoạn khó và mẫu nhật ký ngắn để biết hôm nay mình đã tiến bộ ở đâu.",
    description: "Gợi ý buổi luyện piano 20 phút tại nhà, cách tập đoạn khó, dùng máy đếm nhịp và ghi nhật ký luyện tập. Điều chỉnh theo bài giáo viên giao.",
    cover: practiceCover, image: practiceCover.src, imageAlt: practiceCover.alt,
    introduction: "Có hôm bạn ngồi trước đàn khá lâu nhưng chỉ chơi đi chơi lại phần mình đã thuộc. Một buổi tập ngắn sẽ dễ theo dõi hơn nếu bạn chọn trước một việc cần giải quyết. Dưới đây là ví dụ tổ chức 20 phút cho người đã có bài tập được giáo viên hướng dẫn; đây không phải thời lượng bắt buộc cho mọi người học.",
    sections: [
      { id: "chuan-bi", title: "2 phút: mở đúng bài, chọn đúng việc",
        body: `<p>Đặt bản nhạc, bút chì và ghi chú buổi học ở cạnh đàn. Tắt các thông báo có thể làm gián đoạn. Đọc lại yêu cầu của giáo viên rồi chọn một mục tiêu có thể kiểm tra được: chẳng hạn nối được hai ô nhịp không dừng, hoặc giữ đúng tiết tấu một câu tay trái.</p><p>Tránh ghi “tập cả bài cho hay”. Mục tiêu đó quá rộng để quyết định mình nên làm gì trong mười phút tiếp theo. Nếu chưa hiểu ký hiệu hoặc cách đếm, hãy ghi câu hỏi thay vì tự đoán rồi lặp lại nhiều lần.</p>` },
      { id: "tap-trung", title: "10 phút: sửa một đoạn khó",
        body: `<p>Khoanh đoạn vướng và xác định lỗi đang xảy ra: quên nốt, đổi ngón chưa thuận hay mất nhịp khi ghép tay? Mỗi nguyên nhân cần cách xử lý khác nhau. Với lỗi đọc nốt, hãy xác định nốt trước khi chơi; với lỗi chuyển ngón, kiểm tra lại cách bấm được hướng dẫn.</p><p>Ví dụ bạn thường dừng ở chỗ nối ô nhịp 4 và 5. Thử bắt đầu từ cuối ô 4, đi qua đầu ô 5 rồi mới mở rộng sang hai phía. Cách này giúp luyện chính chỗ nối, thay vì thuộc hơn phần mở đầu nhưng vẫn vướng ở cùng một điểm.</p><p>Tập chậm, lặp đoạn ngắn và dùng máy đếm nhịp là những kỹ thuật được Oak National Academy đưa vào bài học về luyện tập hiệu quả. Nếu chưa phối hợp được hai tay, có thể tách tay rồi ghép lại theo hướng dẫn của giáo viên.</p>`,
        media: photo("practice-hands.jpg", "Người chơi piano nhìn ngang, hai tay trên bàn phím và phản chiếu trên thân đàn", "Isaac Ibbott",
          "https://unsplash.com/photos/person-playing-piano--002g4wurYQ", "Tập riêng chỗ nối giữa hai câu giúp buổi tập có một nhiệm vụ rõ ràng.") },
      { id: "noi-cau", title: "5 phút: đưa đoạn vừa sửa trở lại câu nhạc",
        body: `<p>Khi đoạn nhỏ đã ổn hơn, bắt đầu từ một chút trước đoạn đó và chơi tiếp qua phía sau. Lắng nghe xem nhịp có bị ngắt khi đi vào phần vừa sửa hay không. Đây là bước khác với việc chơi riêng hai ô nhịp: bạn đang luyện chuyển động trong cả câu.</p><p>Nếu dùng máy đếm nhịp, chọn tốc độ đủ chậm để còn nghe và kiểm soát cách chơi. Không tăng tốc chỉ vì đã chơi đúng một lần. Khi gặp cùng một lỗi, dừng lại xác định nguyên nhân thay vì để tiếng máy chạy rồi cố đuổi theo.</p>` },
      { id: "nhat-ky", title: "3 phút: ghi lại kết quả và câu hỏi",
        body: `<p>Chơi lại đoạn vừa tập một lần, hoặc thu âm ngắn để nghe sau khi rời tay khỏi đàn. Mục đích là kiểm tra mục tiêu ban đầu, không phải tạo một bản thu hoàn hảo. Chỉ cần vài dòng để buổi tập sau không phải bắt đầu lại từ việc nhớ mình đang vướng gì.</p><div class="practice-journal"><p class="journal-label">VÍ DỤ NHẬT KÝ SAU BUỔI TẬP</p><dl><dt>Đoạn đã tập</dt><dd>Cuối ô nhịp 4 đến đầu ô nhịp 5.</dd><dt>Điều đã làm được</dt><dd>Tay trái chuyển vị trí liền hơn ở tốc độ chậm.</dd><dt>Cần hỏi giáo viên</dt><dd>Khi ghép hai tay, em thường dừng ở nốt đầu ô 5. Em nên đếm thế nào?</dd><dt>Buổi tiếp theo</dt><dd>Kiểm tra lại chỗ nối trước khi chơi cả câu.</dd></dl></div>` },
      { id: "duy-tri", title: "Giữ nhịp sinh hoạt, không chạy theo số phút",
        body: `<p>Khung 2–10–5–3 ở trên là một cách phân chia để thử. Bạn có thể rút ngắn hoặc chia thành hai lượt tùy bài tập và mức tập trung. Với trẻ nhỏ, phụ huynh nên giúp chuẩn bị góc đàn, hỏi con đang tập việc gì và ghi lại câu hỏi; phần sửa kỹ thuật nên trao đổi cùng giáo viên.</p><p>Chọn một thời điểm thuận tiện gắn với sinh hoạt quen thuộc, như sau khi nghỉ ngơi buổi chiều. Nếu bỏ lỡ một ngày, quay lại bằng mục tiêu nhỏ ở buổi tiếp theo; không cần biến lịch tập thành cuộc thi bù thời gian.</p><p>Nếu bạn chưa có bài tập đầu tiên, hãy xem <a href="./blog-post.html?bai=nguoi-moi-hoc-piano-nen-bat-dau-tu-dau">lộ trình bắt đầu học piano</a>. Với những vướng mắc lặp lại nhiều buổi, mang nhật ký đến lớp sẽ giúp giáo viên thấy rõ bạn cần hỗ trợ ở đâu. Bạn cũng có thể tìm hiểu <a href="./piano.html">lớp Piano tại Arista</a> để trao đổi về cách học phù hợp.</p>` },
    ],
    sources: [
      { title: "Oak National Academy · Effective practice techniques", url: "https://www.thenational.academy/teachers/lessons/effective-practice-techniques" },
    ],
  },
  {
    slug: "piano-co-hay-piano-dien-cho-nguoi-moi",
    title: "Piano cơ hay piano điện: chọn theo nhu cầu học",
    category: "Piano",
    author: "Arista Music Center",
    authorAvatar: { type: "logo", src: "./assets/images/v3/logo.png" },
    excerpt: "So sánh cách phát âm, bàn phím, tai nghe và việc chăm sóc đàn, kèm những câu hỏi nên mang theo khi thử đàn.",
    description: "So sánh piano cơ và piano điện cho người mới học: âm thanh, bàn phím, tai nghe, bảo dưỡng và danh sách kiểm tra khi thử đàn.",
    cover: buyingCover, image: buyingCover.src, imageAlt: buyingCover.alt,
    introduction: "Một cây đàn phù hợp cần đáp ứng cả việc học lẫn sinh hoạt trong nhà. Thay vì hỏi loại nào tốt hơn trong mọi trường hợp, hãy bắt đầu từ giờ tập, chỗ đặt đàn và khả năng chăm sóc lâu dài. Bảng dưới đây giúp bạn chuẩn bị trước khi đi thử đàn, không thay cho việc kiểm tra một cây đàn cụ thể.",
    sections: [
      { id: "khac-biet", title: "Khác biệt bắt đầu từ cách tạo âm thanh",
        body: `<p>Ở piano cơ, chuyển động của phím truyền tới bộ máy búa gõ vào dây; rung động được truyền tới bảng cộng hưởng để tạo âm thanh. Piano điện dùng cảm biến và hệ thống điện tử để phát âm qua loa hoặc tai nghe. Vì vậy, cách âm thanh lan trong phòng và phản hồi khi chơi có thể khác nhau.</p><p>Cảm giác phím còn phụ thuộc từng mẫu và tình trạng đàn. Một số piano điện có bộ máy mô phỏng chuyển động búa; tên gọi “piano điện” không tự cho biết bàn phím cụ thể sẽ phản hồi ra sao. Hãy thử từ lực nhẹ đến mạnh thay vì chỉ nghe một bản trình diễn có sẵn.</p>` },
      { id: "so-sanh", title: "So sánh theo tình huống sử dụng",
        body: `<p class="table-hint">Vuốt ngang để xem đầy đủ bảng so sánh →</p><div class="article-table-wrap" role="region" aria-label="Bảng so sánh piano cơ và piano điện" tabindex="0"><table class="article-table"><caption>Những điểm nên hỏi khi chọn đàn</caption><thead><tr><th scope="col">Cân nhắc</th><th scope="col">Piano cơ</th><th scope="col">Piano điện</th></tr></thead><tbody><tr><th scope="row">Giờ luyện tập</th><td>Âm thanh phát trực tiếp trong phòng; cần tính đến người cùng nhà.</td><td>Có thể chỉnh âm lượng; kiểm tra cổng tai nghe trên mẫu định mua.</td></tr><tr><th scope="row">Chỗ đặt đàn</th><td>Đo kích thước đàn, khoảng ghế và đường vận chuyển.</td><td>Có cả loại gọn và loại tủ; vẫn cần chân đỡ, ghế và nguồn điện phù hợp.</td></tr><tr><th scope="row">Chăm sóc</th><td>Cần lên dây và kiểm tra bộ máy theo tình trạng sử dụng.</td><td>Không lên dây như piano cơ; vẫn cần bảo quản, bảo hành và sửa chữa khi có lỗi.</td></tr><tr><th scope="row">Cảm giác phím</th><td>Kiểm tra độ đều và tình trạng bộ máy.</td><td>Kiểm tra cơ chế phím, độ nhạy lực và phản hồi pedal theo từng mẫu.</td></tr></tbody></table></div><p>Thông tin trong bảng là tiêu chí sử dụng để trao đổi với người bán. Đàn cơ có hệ thống silent hoặc những mẫu hybrid là trường hợp riêng: cần kiểm tra đúng cấu hình thay vì suy từ nhãn “cơ” hay “điện”.</p>` },
      { id: "sinh-hoat", title: "Nếu thường phải tập vào giờ yên tĩnh",
        body: `<p>Hãy thử tai nghe trực tiếp trên mẫu đàn dự định mua. Kiểm tra cách cắm, chỉnh âm lượng và việc loa có tắt khi cắm tai nghe hay không. Đừng mặc định một chức năng sẽ hoạt động giống nhau trên tất cả các mẫu.</p><p>Tai nghe giúp hạn chế âm thanh từ loa nhưng tiếng cơ học của bàn phím và pedal vẫn có thể nghe thấy trong phòng. Cần trao đổi với gia đình về giờ tập, vị trí đàn và độ ổn định của chân đỡ. Đo cả khoảng kéo ghế ra khi ngồi, không chỉ đo chiều rộng thân đàn.</p>`,
        media: photo("digital-headphones.jpg", "Tai nghe đặt trên bàn phím điện có các nút điều khiển", "Viktor Forgacs",
          "https://unsplash.com/photos/headphones-on-piano-keyboard-in-studio-H6YkQEnD5Gk", "Tai nghe và khả năng điều chỉnh âm lượng là những tính năng cần thử trên đúng mẫu đàn.") },
      { id: "thu-dan", title: "Danh sách kiểm tra khi đến thử đàn",
        body: `<p>Mang một câu nhạc hoặc bài tập mình đã biết; nếu chưa chơi được, nhờ giáo viên hoặc người có chuyên môn đi cùng. Đề nghị được thử thay vì chỉ nghe người bán biểu diễn. Ghi lại tên mẫu và điều mình cảm nhận để so sánh sau buổi thử.</p><ul><li><strong>Bàn phím:</strong> thử ở vùng trầm, giữa và cao; có phím nào kẹt, phản hồi thất thường hoặc phát tiếng bất thường không?</li><li><strong>Lực chơi:</strong> cùng một nốt, thử nhẹ rồi mạnh hơn. Âm thanh có thay đổi theo cách bạn điều khiển không?</li><li><strong>Pedal:</strong> kiểm tra hoạt động và phụ kiện đi kèm; hỏi rõ pedal rời hay bộ pedal, có phải mua thêm không.</li><li><strong>Sử dụng tại nhà:</strong> thử ghế và chân đàn, đo chỗ đặt, hỏi cách vận chuyển và lắp đặt.</li><li><strong>Sau khi mua:</strong> hỏi đơn vị bảo hành, phạm vi bảo hành, lịch chăm sóc và các chi phí phát sinh.</li></ul>` },
      { id: "quyet-dinh", title: "Quyết định bằng tổng nhu cầu, không chỉ giá đàn",
        body: `<p>Ghi ngân sách cho cả đàn, ghế, pedal, vận chuyển và những phụ kiện thực sự cần. Với đàn cũ, tình trạng của chính cây đàn quan trọng hơn mô tả quảng cáo; nên có người có chuyên môn kiểm tra trước khi thanh toán.</p><p>Bạn chưa cần mua ngay để chứng minh mình nghiêm túc với việc học. Trước hết, trao đổi về <a href="./piano.html">mục tiêu học Piano</a>, thử các lựa chọn và xác định điều kiện luyện tập tại nhà. Sau khi có đàn, một <a href="./blog-post.html?bai=xay-dung-thoi-quen-luyen-piano-tai-nha">buổi tập có mục tiêu rõ ràng</a> sẽ giúp bạn sử dụng cây đàn đúng với mục đích đã chọn.</p>` },
    ],
    sources: [
      { title: "Yamaha · Choosing a Piano: Acoustic or Digital?", url: "https://www.yamaha.com/en/musical_instrument_guide/piano/selection/selection002.html" },
      { title: "Yamaha · P-225 — ví dụ về bàn phím 88 phím có trọng lượng và phụ kiện", url: "https://shop.usa.yamaha.com/en/p/instruments/keyboards-synthesizers/digital-pianos/p-225-88-key-portable-digital-piano" },
      { title: "Yamaha · TransAcoustic — ví dụ về chế độ quiet trên piano cơ", url: "https://usa.yamaha.com/products/musical_instruments/pianos/transacoustic/ta3/index.html" },
    ],
  },
];

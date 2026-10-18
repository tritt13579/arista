// Draft copy for local review, not published CMS content. Existing people and
// awards are taken from the home sample; unknown facts stay explicit placeholders.
import { createHomeContent } from '../content/home-content.js';

export function createProgramPreview(cms, slug) {
  const piano = slug === 'piano';
  const title = piano ? 'Piano' : 'Violin';
  const program = cms.AristaPrograms.find(item => item.title === title);
  const settings = cms.AristaSiteSettings[0];
  const primary = cms.AristaTeachers.find(item => piano ? item.featured : item.role === 'Violin');
  const home = createHomeContent(settings, cms.AristaPageContent, cms.AristaHeroHighlights, [], cms.AristaPrograms);
  const moment = title => cms.AristaStudentMoments.find(item => item.title.includes(title));
  const photo = item => ({ src: item.image, caption: item.title });
  const pianoPhotos = [
    photo(cms.AristaAchievementPhotos.find(item => item.title.includes('Festival'))),
    photo(moment('Piano Việt Nam')),
    photo(moment('Christmas')),
    ...cms.AristaAchievementPhotos.filter(item => !item.title.includes('Festival')).map(photo),
  ];
  const violinPhotos = [
    photo(moment('Violin')), photo(moment('vịnh')), photo(moment('Christmas')),
    { src: primary.photo, caption: 'Giảng viên Violin · Ảnh từ trang chủ' },
  ];
  // Local-only duplicates demonstrate the 10-photo cap without inventing events.
  const gallery = piano ? pianoPhotos : Array.from({ length: 12 }, (_, index) => ({
    ...violinPhotos[index % violinPhotos.length],
    caption: `${violinPhotos[index % violinPhotos.length].caption}${index >= 4 ? ' · Ảnh lặp minh họa bố cục' : ''}`,
  }));
  const videoTitles = piano
    ? ['Khi những phím đàn cất lời', 'Một buổi học Piano tại Arista', 'Tự tin trên sân khấu']
    : ['Lắng nghe những tiếng vĩ đầu tiên', 'Hòa tấu cùng nhau', 'Một buổi học Violin', 'Từ phòng tập đến sân khấu', 'Những giai điệu yêu thích', 'Kết nối bằng âm nhạc', 'Câu chuyện sau mỗi buổi tập', 'Thêm một khoảnh khắc đáng nhớ'];
  return {
    slug, title, preview: true, logo: settings.logo,
    kicker: piano ? 'Bộ môn phím · Arista Music Center' : 'Bộ môn dây · Arista Music Center',
    headline: piano ? ['Từng phím đàn,', 'một thế giới mới.'] : ['Một cây vĩ,', 'ngàn sắc thái.'],
    intro: piano
      ? 'Từ những nốt nhạc đầu tiên đến câu chuyện của riêng bạn. Khám phá Piano tại Arista, nơi kỹ thuật và cảm xúc cùng lớn lên qua từng buổi học.'
      : 'Lắng nghe, cảm nhận và để âm nhạc cất lời. Khám phá Violin tại Arista qua những giờ học cá nhân và trải nghiệm hòa tấu cùng nhau.',
    hero: program.image,
    heroCaption: piano ? 'Học viên Arista bên những phím đàn.' : 'Khoảnh khắc biểu diễn Violin tại Arista.',
    tags: ['Trẻ em & người lớn', 'Từ những bước đầu', piano ? 'Độc tấu & biểu diễn' : 'Cá nhân & hòa tấu'],
    journey: piano ? [
      ['Làm quen', 'Tìm hiểu nhạc cụ, tư thế ngồi, nốt nhạc và những giai điệu đầu tiên.'],
      ['Xây nền tảng', 'Luyện phối hợp hai tay, đọc nhạc và hình thành thói quen tập luyện.'],
      ['Phát triển', 'Khám phá tác phẩm, kỹ thuật và cách diễn đạt phù hợp với khả năng.'],
      ['Tự tin thể hiện', 'Hướng tới biểu diễn hoặc trao đổi lộ trình luyện thi với giảng viên.'],
    ] : [
      ['Làm quen', 'Cầm đàn, cầm vĩ và tìm cảm giác thoải mái khi chơi.'],
      ['Tạo âm thanh', 'Luyện dây buông, đặt ngón và cảm nhận cao độ.'],
      ['Chơi giai điệu', 'Kết nối kỹ thuật với những bản nhạc vừa sức.'],
      ['Chơi cùng nhau', 'Khám phá hòa tấu và làm quen trải nghiệm biểu diễn.'],
    ],
    teachers: [primary, ...Array.from({ length: piano ? 1 : 2 }, (_, index) => ({
      title: `Giảng viên ${title} thứ ${index === 0 ? 'hai' : 'ba'}`,
      role: 'Hồ sơ chờ bổ sung', credential: '', photo: '', qualifications: '', placeholder: true,
    }))],
    gallery,
    mediaLayout: piano ? 'editorial' : 'portraits',
    // Add an actual YouTube URL after review; never embed an unrelated sample.
    videos: videoTitles.map((title, index) => ({
      url: '', title, placeholder: true,
      cover: index === 0 ? program.image : gallery[index % gallery.length].src,
      description: index === 0 ? 'Video minh họa bố cục. Link YouTube thật sẽ được bổ sung sau.' : '',
    })),
    awards: piano ? cms.AristaAchievements.filter(item => item.show && /Piano/.test(item.title)).slice(0, 2) : [],
    awardImage: piano ? cms.AristaAchievementPhotos.find(item => item.title.includes('Festival')).image : '',
    registration: home.registration,
    footer: home.footer,
  };
}

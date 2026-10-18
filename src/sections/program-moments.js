import { node } from '../utils/dom.js';
import { imageUrl, setResponsiveImage } from '../utils/image-url.js';
import { openImageViewer } from '../utils/image-viewer.js';
import { programPhotoGroups, PROGRAM_PHOTO_LIMIT, PROGRAM_VIDEO_LIMIT, youtubeVideoId, youtubeThumbnailUrl } from '../utils/program-media-layout.js';

const text = (tag, className, value) => node(tag, className, value || '');
const picture = (src, alt, decorative = false) => {
  const img = node('img');
  img.alt = decorative ? '' : alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  if (src) setResponsiveImage(img, src.startsWith('wix:') ? src : new URL(src, document.baseURI).href, '(max-width: 700px) 90vw, 900px');
  else img.hidden = true;
  img.addEventListener('error', () => { img.hidden = true; }, { once: true });
  return img;
};
// CMS covers take precedence; YouTube thumbnails are only a display fallback.
const videoCover = item => picture((typeof item.cover === 'string' && item.cover.trim()) || youtubeThumbnailUrl(item.url), '', true);
const moreOverlay = (total, kind) => {
  const overlay = node('span', 'pm-more');
  overlay.append(text('span', 'pm-more-icon', kind === 'ảnh' ? '▧' : '▷'), text('span', '', `Xem tất cả ${total} ${kind}`));
  return overlay;
};

export function renderProgramMoments(host, data, heading) {
  const section = node('section', `pd-section pd-moments pm-layout-${data.mediaLayout || 'editorial'}`);
  section.id = 'moments';
  section.tabIndex = -1;
  section.append(heading);
  const photos = (data.gallery || []).filter(item => item.show !== false && item.src);
  // Empty URLs are allowed only for explicitly marked local placeholders.
  const sourceVideos = data.videos || (data.video ? [data.video] : []);
  const videos = sourceVideos.filter(item => item.show !== false && (youtubeVideoId(item.url) || item.placeholder === true));
  section.hidden = !photos.length && !videos.length;
  section.dataset.photoCount = String(photos.length);
  section.dataset.videoCount = String(videos.length);
  const flow = node('div', 'pm-flow');
  const galleryItems = photos.map(item => ({ ...item, src: imageUrl(item.src.startsWith('wix:') ? item.src : new URL(item.src, document.baseURI).href), alt: item.caption || data.title }));
  let dialog;
  let player;
  let playlist;
  let videoTitle;
  let videoCounter;
  let activeVideo = 0;
  let opener;
  let savedPosition;
  let disposed = false;
  const revealSelectedVideo = () => {
    if (!dialog?.open) return;
    const button = playlist.children[activeVideo];
    const bounds = playlist.getBoundingClientRect();
    const item = button.getBoundingClientRect();
    if (item.top < bounds.top) playlist.scrollTop -= bounds.top - item.top;
    else if (item.bottom > bounds.bottom) playlist.scrollTop += item.bottom - bounds.bottom;
  };
  const restorePosition = () => {
    if (savedPosition && (Math.abs(scrollY - savedPosition.y) > 1 || Math.abs(scrollX - savedPosition.x) > 1)) {
      window.scrollTo({ left: savedPosition.x, top: savedPosition.y, behavior: 'instant' });
    }
  };
  const finishVideo = () => {
    if (!dialog?.open && !savedPosition) return;
    player?.replaceChildren(); // Stop playback immediately, including Escape.
    if (dialog?.open) dialog.close();
    if (!disposed && opener?.isConnected) opener.focus({ preventScroll: true });
    restorePosition();
    savedPosition = null;
    opener = null;
  };
  const selectVideo = index => {
    activeVideo = (index + videos.length) % videos.length;
    const item = videos[activeVideo];
    videoTitle.textContent = item.title || `Video ${activeVideo + 1}`;
    videoTitle.title = videoTitle.textContent;
    videoCounter.textContent = `${activeVideo + 1} / ${videos.length} video`;
    player.replaceChildren();
    const id = youtubeVideoId(item.url);
    if (id) {
      const iframe = node('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
      iframe.title = item.title || `Video ${activeVideo + 1}`;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      player.append(iframe);
    } else {
      const placeholder = node('div', 'pm-player-placeholder');
      placeholder.append(picture(item.cover, ''), text('p', '', 'Video minh họa bố cục\nChưa có link YouTube. Bạn có thể chọn các video khác trong danh sách.'));
      player.append(placeholder);
    }
    [...playlist.children].forEach((button, position) => {
      button.setAttribute('aria-current', String(position === activeVideo));
      button.classList.toggle('is-current', position === activeVideo);
    });
    revealSelectedVideo();
  };
  const openVideo = (index, trigger) => {
    host.imageViewer?.close(false);
    if (!dialog) {
      dialog = node('dialog', 'pm-video-viewer');
      dialog.setAttribute('aria-labelledby', 'pm-video-title');
      const top = node('div', 'pm-viewer-top');
      videoCounter = text('p', 'pm-video-counter', '');
      videoCounter.setAttribute('aria-live', 'polite');
      const close = text('button', 'pm-viewer-close', '✕');
      close.type = 'button';
      close.setAttribute('aria-label', 'Đóng video');
      close.onclick = finishVideo;
      top.append(videoCounter, close);
      const body = node('div', 'pm-viewer-body');
      const main = node('div', 'pm-viewer-main');
      player = node('div', 'pm-player');
      videoTitle = node('h3', 'pm-video-title');
      videoTitle.id = 'pm-video-title';
      const controls = node('div', 'pm-viewer-controls');
      const previous = text('button', '', '← Video trước');
      const next = text('button', '', 'Video sau →');
      for (const button of [previous, next]) button.type = 'button';
      previous.onclick = () => selectVideo(activeVideo - 1);
      next.onclick = () => selectVideo(activeVideo + 1);
      controls.append(previous, next);
      controls.hidden = videos.length < 2;
      main.append(player, videoTitle, controls);
      const library = node('div', 'pm-library');
      library.append(text('h3', '', `Tất cả ${videos.length} video`));
      playlist = node('div', 'pm-playlist');
      videos.forEach((item, position) => {
        const button = node('button', 'pm-playlist-item');
        button.type = 'button';
        button.setAttribute('aria-label', `Xem video ${position + 1}: ${item.title || ''}`);
        button.append(videoCover(item), text('span', '', `${String(position + 1).padStart(2, '0')} · ${item.title || 'Video'}`));
        button.onclick = () => selectVideo(position);
        playlist.append(button);
      });
      library.append(playlist);
      body.append(main, library);
      dialog.append(top, body);
      dialog.addEventListener('cancel', event => { event.preventDefault(); finishVideo(); });
      dialog.addEventListener('close', () => { if (!dialog.open) player.replaceChildren(); });
      dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) finishVideo();
      });
      host.shadowRoot.append(dialog);
    }
    opener = trigger;
    savedPosition = { x: scrollX, y: scrollY };
    selectVideo(index);
    dialog.showModal();
    dialog.querySelector('.pm-viewer-close').focus({ preventScroll: true });
    revealSelectedVideo();
    restorePosition();
  };

  const photoBlock = (count, start, groupIndex) => {
    const cluster = node('div', `pm-cluster pm-recipe-${count}`);
    cluster.dataset.group = String(groupIndex + 1);
    photos.slice(start, start + count).forEach((item, offset) => {
      const index = start + offset;
      const more = photos.length > PROGRAM_PHOTO_LIMIT && index === PROGRAM_PHOTO_LIMIT - 1;
      const button = node('button', `pm-photo pd-reveal${more ? ' pm-overflow' : ''}`);
      button.type = 'button';
      button.dataset.photoIndex = String(index);
      button.setAttribute('aria-label', more ? `Xem tất cả ${photos.length} ảnh` : `Xem ảnh: ${item.caption || data.title}`);
      const img = picture(item.src, item.caption || data.title);
      img.style.objectPosition = `center ${item.imageFocusHeight ?? item.focusHeight ?? 50}%`;
      button.append(img);
      if (more) button.append(moreOverlay(photos.length, 'ảnh'));
      else button.append(text('span', 'pm-photo-expand', '↗'));
      galleryItems[index].thumbnail = button;
      button.onclick = () => { finishVideo(); openImageViewer(host, galleryItems, index, { showCaption: false, quietLoading: true }); };
      cluster.append(button);
    });
    return cluster;
  };

  const videoBlock = (items, start, featured = false) => {
    const block = node('div', `pm-videos pm-videos-${items.length}${featured ? ' pm-featured' : ''}`);
    items.forEach((item, offset) => {
      const index = start + offset;
      const more = videos.length > PROGRAM_VIDEO_LIMIT && index === PROGRAM_VIDEO_LIMIT - 1;
      const article = node('article', 'pm-video pd-reveal');
      const launch = node('button', `pm-video-launch${more ? ' pm-overflow' : ''}`);
      launch.type = 'button';
      launch.dataset.videoIndex = String(index);
      launch.setAttribute('aria-label', more ? `Xem tất cả ${videos.length} video` : `Xem video: ${item.title || `Video ${index + 1}`}`);
      launch.append(videoCover(item));
      if (more) launch.append(moreOverlay(videos.length, 'video'));
      else {
        const play = text('span', 'pm-play-icon', '▷');
        play.setAttribute('aria-hidden', 'true');
        launch.append(play);
      }
      launch.onclick = () => openVideo(index, launch);
      const copy = node('div', 'pm-video-copy');
      copy.append(text('p', 'pd-eyebrow', `Góc nghe & xem · ${String(index + 1).padStart(2, '0')}`));
      if (item.description) copy.append(text('p', 'pm-video-description', item.description));
      if (featured) copy.append(text('span', 'pm-video-hint', 'Mở video & danh sách phát ↗'));
      article.append(launch, copy);
      block.append(article);
    });
    return block;
  };

  const groups = programPhotoGroups(photos.length);
  const visibleVideos = videos.slice(0, PROGRAM_VIDEO_LIMIT);
  let start = 0;
  if (groups.length) {
    flow.append(photoBlock(groups[0], start, 0));
    start += groups[0];
  }
  const firstVideos = visibleVideos.length === 2 ? 2 : Math.min(1, visibleVideos.length);
  if (firstVideos) flow.append(videoBlock(visibleVideos.slice(0, firstVideos), 0, firstVideos === 1));
  groups.slice(1).forEach((count, index) => {
    flow.append(photoBlock(count, start, index + 1));
    start += count;
  });
  if (visibleVideos.length > firstVideos) {
    const label = node('div', 'pm-video-heading');
    label.append(text('p', 'pd-eyebrow', 'Còn nhiều điều để lắng nghe'), text('h3', '', 'Mỗi video, một câu chuyện.'));
    flow.append(label, videoBlock(visibleVideos.slice(firstVideos), firstVideos));
  }
  section.append(flow);
  section.dispose = () => {
    disposed = true;
    finishVideo();
    dialog?.remove();
  };
  return section;
}

export const PROGRAM_PHOTO_LIMIT = 10;
export const PROGRAM_VIDEO_LIMIT = 6;

// Compose complete rows rather than stretching the original small mosaic.
// The last group always has its own complete layout, with no empty grid cells.
export function programPhotoGroups(count) {
  const visible = Math.max(0, Math.min(PROGRAM_PHOTO_LIMIT, Math.floor(count)));
  if (!visible) return [];
  if (visible <= 6) return [visible];
  return { 7: [3, 4], 8: [5, 3], 9: [6, 3], 10: [6, 4] }[visible];
}

export function youtubeVideoId(value) {
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    const hostname = url.hostname.replace(/^www\./, '');
    const id = hostname === 'youtu.be' ? url.pathname.slice(1) :
      ['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(hostname)
        ? url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] : '';
    return /^[\w-]{11}$/.test(id || '') ? id : null;
  } catch { return null; }
}

export function youtubeThumbnailUrl(value) {
  const id = youtubeVideoId(value);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
}

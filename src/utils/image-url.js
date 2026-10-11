export function imageUrl(value) {
  if (typeof value !== "string") return "";
  // Wix CMS Image fields return wix:image://v1/<media-id>/<filename>#...
  const match = value.match(/^wix:image:\/\/v1\/([^/]+)\//);
  if (match) return `https://static.wixstatic.com/media/${match[1]}`;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ||
      (url.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(url.hostname))
      ? url.href
      : "";
  } catch (_) {
    return "";
  }
}

import { node } from "../utils/dom.js";
import { imageUrl, setResponsiveImage } from "../utils/image-url.js";
import { imageFocusPosition } from "../utils/image-focus.js";

export function renderFooter(content, action) {
  if (!content) return null;
  const footer = node("footer", "site-footer");
  const inner = node("div", "footer-inner");
  const brand = node("button", "footer-brand");
  brand.type = "button";
  brand.setAttribute("aria-label", "Back to top");
  brand.onclick = () => action("top", "Back to top");
  const url = imageUrl(content.logo);
  if (url) {
    const image = node("img", "");
    image.alt = String(content.brandName || "Arista Music Center");
    image.loading = "lazy";
    image.style.objectPosition = imageFocusPosition(content.logoFocusHeight);
    image.addEventListener("error", () => brand.replaceChildren(document.createTextNode(content.brandName || "Arista")), { once: true });
    setResponsiveImage(image, content.logo, "160px", [160, 320, 480]);
    brand.append(image);
  } else brand.textContent = content.brandName || "Arista";
  inner.append(brand);
  if (content.description) inner.append(node("p", "footer-description", content.description));
  if (content.copyright) inner.append(node("p", "footer-copyright", content.copyright));
  footer.append(inner);
  return footer;
}

const fontStylesheet =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=Be+Vietnam+Pro:wght@400;500;600&display=swap";
export function loadFonts() {
  // Font faces must be registered in the document, not only in a shadow tree.
  if (document.querySelector("link[data-arista-fonts]")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = fontStylesheet;
  link.dataset.aristaFonts = "";
  document.head.append(link);
}

import { posts } from "./blog-content.js";
import { mountSharedFooter } from "./blog-footer.js";

const app = document.querySelector("#blog-app");
const params = new URLSearchParams(location.search);
const isArticle = location.pathname.endsWith("blog-post.html");
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
const postUrl = (post) =>
  `./blog-post.html?bai=${encodeURIComponent(post.slug)}`;
const readingTime = (post) =>
  Math.max(
    1,
    Math.ceil(
      [post.introduction, ...post.sections.map((section) => section.body)]
        .join(" ")
        .replace(/<[^>]*>/g, " ")
        .split(/\s+/).length / 220,
    ),
  );

const header = `
  <header class="blog-header">
    <div class="header-wrap">
      <a class="brand" href="./index.html" aria-label="Arista Music Center — Trang chủ">
        <span class="brand-name">Arista<span class="brand-dot">.</span></span>
        <span class="brand-subtitle">MUSIC CENTER</span>
      </a>
      <nav class="desktop-nav" aria-label="Điều hướng chính">
        <a href="./index.html">Về Arista</a><a href="./piano.html">Lớp Piano</a>
        <a href="./blog.html" aria-current="${isArticle ? "false" : "page"}">Góc học nhạc</a>
      </nav>
      <a class="header-contact" href="./index.html?section=registration">Đăng ký tư vấn <span aria-hidden="true">↗</span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="blog-mobile-menu" aria-label="Mở menu"><span></span><span></span></button>
    </div>
    <nav id="blog-mobile-menu" class="mobile-links" aria-label="Điều hướng điện thoại" hidden>
      <a href="./index.html">Về Arista</a><a href="./piano.html">Lớp Piano</a>
      <a href="./blog.html">Góc học nhạc</a>
      <a href="./index.html?section=registration">Đăng ký tư vấn ↗</a>
    </nav>
  </header>`;

const footer = `<div id="shared-blog-footer"></div>`;

function card(post, featured = false) {
  return `<article class="post-card ${featured ? "featured-card" : ""}">
    <a class="card-image" href="${postUrl(post)}" tabindex="-1" aria-hidden="true">
      <img src="${post.image}" alt="" width="1400" height="940" ${featured ? 'fetchpriority="high"' : 'loading="lazy"'}>
      <span class="image-arrow" aria-hidden="true">↗</span>
    </a>
    <div class="card-copy">
      <div class="post-meta"><span>${post.category}</span><span>${readingTime(post)} phút đọc</span></div>
      <h${featured ? "2" : "3"}><a href="${postUrl(post)}">${post.title}</a></h${featured ? "2" : "3"}>
      <p>${post.excerpt}</p>
      <a class="text-link" href="${postUrl(post)}">Đọc bài viết <span aria-hidden="true">↗</span></a>
    </div>
  </article>`;
}

function renderList() {
  app.innerHTML = `${header}<main id="main">
    <section class="journal-hero"><div class="container hero-grid">
      <div><p class="eyebrow">CHIA SẺ TỪ ARISTA</p><h1>Góc <em>học nhạc.</em></h1></div>
      <p class="hero-description">Một chút kiến thức, một nguồn cảm hứng.<br>Cùng bạn đi xa hơn trên hành trình âm nhạc.</p>
    </div></section>
    <section class="journal-content container" aria-label="Bài viết">
      <div class="filter-bar"><div class="filters" role="group" aria-label="Lọc chuyên mục">
        ${["Tất cả", "Piano", "Kiến thức học nhạc"].map((category) => `<button type="button" data-category="${category}" aria-pressed="false">${category}</button>`).join("")}
      </div><p class="result-count" aria-live="polite"></p></div>
      <div id="post-results"></div>
    </section>
  </main>${footer}`;
  const update = (category, changeUrl = true) => {
    const filtered = posts.filter(
      (post) => category === "Tất cả" || post.category === category,
    );
    document.querySelectorAll("[data-category]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.category === category),
      );
    });
    document.querySelector(".result-count").textContent =
      `${filtered.length} bài viết`;
    document.querySelector("#post-results").innerHTML = category === "Tất cả"
      ? `${card(filtered[0], true)}${
        filtered.length > 1
          ? `<div class="post-grid">${filtered
              .slice(1)
              .map((post) => card(post))
              .join("")}</div>`
          : ""
      }`
      : `<div class="post-grid category-grid">${filtered.map(post => card(post)).join("")}</div>`;
    if (changeUrl) {
      const url = new URL(location.href);
      category === "Tất cả"
        ? url.searchParams.delete("chuyen-muc")
        : url.searchParams.set("chuyen-muc", category);
      history.replaceState(null, "", url);
    }
  };
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => update(button.dataset.category));
  });
  const category = params.get("chuyen-muc");
  update(
    ["Piano", "Kiến thức học nhạc"].includes(category) ? category : "Tất cả",
    false,
  );
}


function renderArticle() {
  const slug = params.get("bai") || posts[0].slug;
  const post = posts.find((item) => item.slug === slug);
  if (!post) {
    document.title = "Không tìm thấy bài viết | Arista";
    app.innerHTML = `${header}<main id="main" class="container not-found"><p class="eyebrow">GÓC HỌC NHẠC</p><h1>Chưa tìm thấy bài viết.</h1><p>Hãy quay lại danh sách để khám phá những chia sẻ khác từ Arista.</p><a class="gold-button" href="./blog.html">Xem các bài viết ↗</a></main>${footer}`;
    return;
  }
  document.title = `${post.title} | Arista — Bản xem trước`;
  document.querySelector('meta[name="description"]').content = post.description;
  app.innerHTML = `${header}<main id="main">
    <section class="article-hero container">
      <nav class="breadcrumbs" aria-label="Đường dẫn"><a href="./index.html">Arista</a><span aria-hidden="true">/</span><a href="./blog.html">Góc học nhạc</a><span aria-hidden="true">/</span><a href="./blog.html?chuyen-muc=${encodeURIComponent(post.category)}">${post.category}</a></nav>
      <div class="article-heading"><p class="eyebrow">${post.category.toLocaleUpperCase("vi")}</p><h1>${post.title}</h1>
        <div class="byline"><span class="author-mark" aria-hidden="true">A</span><span>Arista Music Center</span><span class="meta-dot" aria-hidden="true">·</span><span>${readingTime(post)} phút đọc</span><span class="draft-label">Bài mẫu</span></div>
      </div>
      <figure class="article-cover"><img src="${post.image}" alt="${escape(post.imageAlt)}" width="1400" height="940" fetchpriority="high"><figcaption>Ảnh minh họa · <a href="${post.imageSource}" target="_blank" rel="noopener noreferrer">${post.photographer} / Unsplash</a></figcaption></figure>
    </section>
    <div class="reading-layout container">
      <aside class="article-sidebar"><details class="toc" open><summary>Trong bài viết</summary><nav aria-label="Mục lục">${post.sections.map((section) => `<a href="#${section.id}">${section.title}</a>`).join("")}</nav></details>
        <a class="sidebar-link" href="./piano.html"><span>HỌC CÙNG ARISTA</span>Tìm hiểu lớp Piano <span aria-hidden="true">↗</span></a>
      </aside>
      <article class="article-body" aria-label="Nội dung bài viết"><p class="article-intro">${post.introduction}</p>
        ${post.sections.map((section) => `<section id="${section.id}"><h2>${section.title}</h2>${section.body}</section>`).join("")}
        <div class="reading-sources"><details><summary>Tài liệu tham khảo</summary><ul>${post.sources.map((source) => `<li><a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.title} ↗</a></li>`).join("")}</ul></details></div>
        <div class="article-end"><a href="./blog.html">← Về Góc học nhạc</a><button type="button" id="copy-article">Sao chép liên kết ↗</button><span id="share-status" role="status"></span></div>
      </article>
    </div>
    <section class="related-posts container"><div class="section-heading"><div><p class="eyebrow">ĐỌC THÊM MỘT CHÚT</p><h2>Tiếp nối <em>cảm hứng.</em></h2></div><a class="text-link" href="./blog.html">Tất cả bài viết ↗</a></div><div class="post-grid">${posts
      .filter((item) => item !== post)
      .map((item) => card(item))
      .join("")}</div></section>
  </main>${footer}`;
  document
    .querySelector("#copy-article")
    .addEventListener("click", async () => {
      const status = document.querySelector("#share-status");
      try {
        await navigator.clipboard.writeText(location.href);
        status.textContent = "Đã sao chép liên kết";
      } catch {
        status.textContent =
          "Bạn có thể sao chép địa chỉ trên thanh trình duyệt.";
      }
    });
  const sections = [...document.querySelectorAll(".article-body > section")];
  const tocLinks = [...document.querySelectorAll(".toc a")];
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) return;
      tocLinks.forEach((link) => {
        if (link.hash === `#${visible.target.id}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-100px 0px -60% 0px" },
  );
  sections.forEach((section) => observer.observe(section));
  if (location.hash)
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
}

if (isArticle) renderArticle();
else renderList();

await mountSharedFooter();
document.querySelectorAll('a[href="./index.html?section=registration"]').forEach(link => {
  link.addEventListener("click", event => {
    const footer = document.querySelector("#shared-blog-footer");
    if (!footer?.scrollToRegistration) return;
    event.preventDefault();
    closeMenu();
    footer.scrollToRegistration();
  });
});

const toggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#blog-mobile-menu");
const closeMenu = () => {
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Mở menu");
  mobileMenu.hidden = true;
};
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
  mobileMenu.hidden = !open;
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileMenu.hidden) {
    closeMenu();
    toggle.focus();
  }
});
matchMedia("(min-width: 901px)").addEventListener("change", closeMenu);

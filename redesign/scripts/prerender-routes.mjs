import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const projectRoot = process.cwd();
const distRoot = resolve(projectRoot, "dist/client");
const baseHtml = await readFile(resolve(distRoot, "index.html"), "utf8");
const legacyPages = JSON.parse(await readFile(resolve(projectRoot, "src/content/legacy-pages.json"), "utf8"));
const livePages = JSON.parse(await readFile(resolve(projectRoot, "src/content/live-pages.json"), "utf8"));
const origin = "https://wearemissioncontrol.com";

const currentPages = {
  "/": {
    title: "Mission Control — From AI-built to business-ready",
    description: "Mission Control builds production-grade software from zero and rescues AI-built MVPs that need security, compliance, app-store readiness and maintainability.",
    blocks: [
      { tag: "h1", text: "Your prototype worked. Now make it survive production." },
      { tag: "p", text: "We build production-grade software from day one — and rescue AI-built MVPs that hit the wall. Secure, compliant, approved and ready to scale." },
    ],
  },
  "/our-process": { ...livePages["/our-process"], title: "Our Process — Mission Control" },
  "/case-studies": { ...livePages["/case-studies"], title: "Case Studies — Mission Control" },
  "/about": { ...livePages["/about"], title: "About Us — Mission Control" },
  "/contact": { ...livePages["/contact"], title: "Contact Us — Mission Control" },
  "/blog": { ...livePages["/blog"], title: "News & Blog — Mission Control" },
};

const blogRoutes = [
  ["/blog/why-cant-ai-just-build-this-app-for-us", "Why Can't AI Just Build This App For Us? — Mission Control", "AI is a remarkable tool, but production software still depends on decisions, accountability and engineering discipline.", "/assets/live/blog-ai-app.webp"],
  ["/blog/picking-the-right-tool-for-the-job", "Picking the Right Tool for the Job — Mission Control", "Native, React Native and Flutter can all be right or wrong. The useful question is which constraints matter for the product.", "/assets/live/blog-right-tool.png"],
  ["/blog/framework-fairphone-we-like-our-hardware-like-our-software", "Framework & Fairphone — We Like Our Hardware Like Our Software — Mission Control", "Modular, repairable hardware that changes with our needs, matching the open software we develop and love.", "/assets/live/blog-framework.jpg"],
  ["/blog/2025-the-year-of-the-linux-omarchy-desktop", "2025: The Year of the Linux (Omarchy) Desktop — Mission Control", "After years of distro-hopping, the Mission Control console has settled. This might finally be the year of the Linux desktop.", "/assets/live/blog-omarchy.png"],
];

for (const [route, title, description, ogImage] of blogRoutes) {
  currentPages[route] = { ...livePages[route], title, description, ogImage: `${origin}${ogImage}`, article: true };
}

const pages = new Map(legacyPages.map((page) => [page.route.replace(/\/$/, "") || "/", page]));
for (const [route, page] of Object.entries(currentPages)) pages.set(route, { route, ...page });

const escapeHtml = (value = "") => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function pageBlocks(page) {
  const blocks = page.blocks || page.content || [];
  let skippedFirstHeading = false;
  return blocks.map((block) => {
    const type = block.type || block.tag;
    if (type === "image") return block.src ? `<figure><img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt || "")}" /></figure>` : "";
    const text = escapeHtml(block.text || "");
    if (!text) return "";
    if (type === "heading" || /^h[1-4]$/.test(type)) {
      const level = block.level || Number(type.slice(1)) || 2;
      const safeLevel = Math.min(4, Math.max(1, level));
      if (!skippedFirstHeading) {
        skippedFirstHeading = true;
        return "";
      }
      return `<h${safeLevel}>${text}</h${safeLevel}>`;
    }
    if (type === "quote") return `<blockquote>${text}</blockquote>`;
    if (type === "list-item") return `<p>${text}</p>`;
    return `<p>${text}</p>`;
  }).join("\n");
}

function renderPage(page, route) {
  const title = page.title || "Mission Control";
  const description = page.description || "Mission Control builds and hardens production-grade software.";
  const canonical = `${origin}${route === "/" ? "/" : `${route}/`}`;
  const image = page.ogImage || `${origin}/assets/visuals/forpaws-feature.png`;
  const article = Boolean(page.article || page.published || route.startsWith("/blog/"));
  const schema = {
    "@context": "https://schema.org",
    "@type": article ? "Article" : "WebPage",
    name: title,
    headline: article ? title : undefined,
    description,
    url: canonical,
    isPartOf: { "@type": "WebSite", name: "Mission Control", url: `${origin}/` },
    publisher: { "@type": "Organization", name: "Mission Control", url: `${origin}/` },
    ...(page.published ? { datePublished: page.published } : {}),
    ...(page.modified ? { dateModified: page.modified } : {}),
  };
  const displayTitle = title.replace(/\s+[—|-]\s+Mission Control.*$/i, "");
  const fallback = `<main class="seo-fallback" data-route="${escapeHtml(route)}"><h1>${escapeHtml(displayTitle)}</h1>${pageBlocks(page)}</main>`;
  const meta = [
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:locale" content="en_GB" />`,
    `<meta property="og:type" content="${article ? "article" : "website"}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:site_name" content="Mission Control" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script id="page-schema" type="application/ld+json">${JSON.stringify(schema)}</script>`,
  ].join("\n    ");

  return baseHtml
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/>/s, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace("</head>", `    ${meta}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
}

for (const [route, page] of pages) {
  const output = route === "/" ? resolve(distRoot, "index.html") : resolve(distRoot, `.${route}/index.html`);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, renderPage(page, route), "utf8");
}

const routes = [...pages.keys()].sort();
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${origin}${route === "/" ? "/" : `${route}/`}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(resolve(distRoot, "sitemap.xml"), sitemap, "utf8");
await writeFile(resolve(distRoot, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, "utf8");

console.log(`Prerendered ${routes.length} indexable routes with page-specific SEO metadata.`);

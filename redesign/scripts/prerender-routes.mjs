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
  "/services": {
    title: "Software Development Services — Mission Control",
    description: "Explore Mission Control's mobile, web, desktop, AI, product strategy, self-management, modernisation and long-term software support services.",
    schemaType: "CollectionPage",
    blocks: [
      { tag: "h1", text: "Products with a job to do." },
      { tag: "p", text: "From the first product question to launch day and long-term operation, Mission Control brings strategy, design and engineering together around one outcome." },
      { tag: "h2", text: "Every surface. Every stage." },
      { tag: "p", text: "Since 2013, we have created mobile applications, web platforms, desktop software, AI systems and the operational tools behind them." },
      { tag: "p", text: "Our capabilities include application development, AI products, product strategy, self-management platforms, modernisation and long-term product support." },
    ],
  },
  "/our-history": {
    title: "Our History — Mission Control",
    description: "Founded in 2013, Mission Control has delivered mobile apps, web platforms, AI systems and global digital programmes for more than a decade.",
    schemaType: "AboutPage",
    ogImage: `${origin}/assets/live/vulcan-works-hq.jpg`,
    blocks: [
      { tag: "h1", text: "More than a decade in production." },
      { tag: "p", text: "Mission Control has designed, built and operated digital products since 2013 through several generations of devices, frameworks and technology hype." },
      { tag: "h2", text: "Built around products, not trends." },
      { tag: "p", text: "Our history spans early mobile innovation, Oxford University Press dictionary platforms, NHS healthcare programmes, retail technology, applied machine learning, accessibility and today's AI-assisted products." },
      { tag: "p", text: "The studio remains independent, based in Northampton and directly connected to the clients and users behind every mission." },
    ],
  },
  "/open-source-and-sustainable-development": {
    title: "Open Source & Sustainable Development — Mission Control",
    description: "How Mission Control applies Linux, open-source thinking, sustainable technology and responsible engineering to long-lived digital products.",
    ogImage: `${origin}/assets/live/framework-tux.jpg`,
    blocks: [
      { tag: "h1", text: "Open tools. Clear choices. Better software." },
      { tag: "p", text: "Mission Control is a long-standing advocate for Linux, open-source software, sustainable technology and development choices that give clients lasting control." },
      { tag: "h2", text: "Independence is a product feature." },
      { tag: "p", text: "We value accessible design, transparent trade-offs, maintainable code, repairable technology, client ownership and responsible use of artificial intelligence." },
      { tag: "p", text: "Open source is a practical way to protect adaptability and understanding, not a rule that overrides the needs of the product." },
    ],
  },
};

const servicePages = [
  {
    route: "/mobile-and-web-app-development",
    title: "Mobile, Web & Desktop Applications — Mission Control",
    description: "Mission Control designs and builds bespoke mobile, web and desktop applications across iOS, Android, macOS, Windows, Linux and the web.",
    image: "/assets/legacy/wp-content/uploads/2025/03/mobile-web-app-hero-img.png",
    heading: "Every platform. One product vision.",
    copy: "Since 2013, we have designed and built digital products for organisations ranging from ambitious start-ups to the NHS, Mars, Oxford University Press and Dictionary.com. Our work connects customer applications, web platforms, desktop software, operational tools and third-party systems into one coherent service.",
  },
  {
    route: "/ai-agent",
    title: "AI Products & Intelligent Agents — Mission Control",
    description: "Mission Control designs responsible AI products, custom machine-learning systems and intelligent workflows grounded in a genuine user or business need.",
    image: "/assets/legacy/wp-content/uploads/2025/03/ai-agent-hero-img.png",
    heading: "Useful AI. No theatre.",
    copy: "Our AI work includes custom machine learning, intelligent workflows, generative features and production governance. For Mars Petcare, the ForPaws neural network achieved more than 96 percent matching accuracy using up to 17 facial markers across more than 130 dog breeds.",
  },
  {
    route: "/product-strategy-and-prototyping",
    title: "Product Strategy & Prototyping — Mission Control",
    description: "Mission Control helps organisations define, test and plan new digital products before committing to a full production build.",
    image: "/assets/visuals/orbit-map.png",
    heading: "Find the right product before writing too much code.",
    copy: "We combine product discovery, experience definition, technical direction and focused prototypes to reduce uncertainty. Previous programmes include innovation work for the Financial Times and Eurostar, Mediacom and Walmart, and Mars Petcare.",
  },
  {
    route: "/self-management-platforms",
    title: "Self-Management Platforms — Mission Control",
    description: "Mission Control builds self-service and self-management platforms for healthcare, learning, mobility, retail and specialist support services.",
    image: "/assets/live/clickbsl.png",
    heading: "Complex services made clear, useful and human.",
    copy: "We combine accessible customer applications with the operational tools behind them: content management, bookings, notifications, reporting, permissions and administration. Our experience includes more than eight NHS condition apps, RACK retail-crime reporting and BikeAway cycle-hub booking.",
  },
  {
    route: "/support-modernisation-and-product-rescue",
    title: "Support, Modernisation & Product Rescue — Mission Control",
    description: "Mission Control audits, modernises and operates existing software, including inherited platforms and AI-built MVPs that need production hardening.",
    image: "/assets/live/blog-ai-app.webp",
    heading: "Bring us the roadmap—or bring us the mess.",
    copy: "We audit architecture, dependencies, security, data flows and maintainability before creating a prioritised plan. Our work covers production hardening, migrations, interface renewal, release management, monitoring and long-term support.",
  },
];

for (const service of servicePages) {
  currentPages[service.route] = {
    title: service.title,
    description: service.description,
    schemaType: "Service",
    ogImage: `${origin}${service.image}`,
    blocks: [
      { tag: "h1", text: service.heading },
      { tag: "p", text: service.description },
      { tag: "h2", text: "What we bring to the mission" },
      { tag: "p", text: service.copy },
      { tag: "p", text: "Every engagement connects product thinking, accessible design, production engineering, launch readiness and a practical plan for what happens next." },
    ],
  };
}

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
    "@type": article ? "Article" : page.schemaType || "WebPage",
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

import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { glob } from "tinyglobby";
import * as cheerio from "cheerio";

const workspaceRoot = resolve(process.cwd(), "..");
const outputPath = resolve(process.cwd(), "src/content/legacy-pages.json");
const legacyAssetRoot = resolve(process.cwd(), "public/assets/legacy");

const htmlFiles = await glob(["**/index.html"], {
  cwd: workspaceRoot,
  absolute: true,
  ignore: [
    "redesign/**",
    "wp-content/**",
    "wp-json/**",
    "**/feed/**",
    "comments/**",
  ],
});

const cleanText = (value = "") => value
  .replace(/\u00a0/g, " ")
  .replace(/\s+/g, " ")
  .replace(/Suggested text:\s*/gi, "")
  .replace(/https?:\/\/(?:www\.)?missioncontrol\.uk\.com/gi, "https://wearemissioncontrol.com")
  .replace(/\bmissioncontrol\.uk\.com\b/gi, "wearemissioncontrol.com")
  .trim();

function routeFromFile(file) {
  const directory = relative(workspaceRoot, file).split(sep).slice(0, -1).join("/");
  return directory ? `/${directory}` : "/";
}

function normaliseHref(href = "") {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return href;
  try {
    const url = new URL(href, "https://missioncontrol.uk.com/");
    if (["missioncontrol.uk.com", "www.missioncontrol.uk.com"].includes(url.hostname)) {
      return `${url.pathname.replace(/\/index\.html$/, "/")}${url.search}${url.hash}`;
    }
    return url.href;
  } catch {
    return href.replace(/index\.html$/, "");
  }
}

function extractPage(file, html) {
  const $ = cheerio.load(html);
  const route = routeFromFile(file);

  $("script, style, noscript, template, svg, header, footer, nav, form, .site-header, .site-footer, .elementor-location-header, .elementor-location-footer, .comments-area, .post-navigation").remove();

  const preferred = $(".elementor-widget-theme-post-content .elementor-widget-container, article .entry-content, main #primary, main, #primary").filter((_, element) => cleanText($(element).text()).length > 80);
  const container = preferred.first().length ? preferred.first() : $("body");
  const blocks = [];
  let previousSignature = "";

  container.find("h1, h2, h3, h4, p, li, blockquote, img, .elementor-widget-text-editor > .elementor-widget-container").each((_, element) => {
    const node = $(element);
    const tag = element.tagName?.toLowerCase();

    if (tag === "div") {
      if (node.find("p, h1, h2, h3, h4, li, blockquote").length) return;
      const rawText = node.text().replace(/\r/g, "");
      const paragraphs = rawText.split(/\n\s*\n+/).map(cleanText).filter((text) => text.length > 20);
      for (const text of paragraphs) {
        const signature = `paragraph:${text}`;
        if (signature === previousSignature) continue;
        blocks.push({ type: "paragraph", text });
        previousSignature = signature;
      }
      return;
    }

    if (tag === "img") {
      const src = normaliseHref(node.attr("src") || node.attr("data-src") || "");
      const alt = cleanText(node.attr("alt") || "");
      if (!src || /logo|avatar/i.test(`${src} ${alt}`)) return;
      const signature = `image:${src}`;
      if (signature === previousSignature) return;
      blocks.push({ type: "image", src, alt });
      previousSignature = signature;
      return;
    }

    if (node.parents("li").length && tag !== "li") return;
    const text = cleanText(node.text());
    if (!text || text.length < 2) return;
    const links = node.find("a[href]").map((__, anchor) => ({
      text: cleanText($(anchor).text()),
      href: normaliseHref($(anchor).attr("href") || ""),
    })).get().filter((link) => link.text && link.href);
    const type = tag === "li" ? "list-item" : tag === "blockquote" ? "quote" : tag.startsWith("h") ? "heading" : "paragraph";
    const level = tag.startsWith("h") ? Number(tag.slice(1)) : undefined;
    const signature = `${type}:${text}`;
    if (signature === previousSignature) return;
    blocks.push({ type, ...(level ? { level } : {}), text, ...(links.length ? { links } : {}) });
    previousSignature = signature;
  });

  const h1 = blocks.find((block) => block.type === "heading" && block.level === 1)?.text;
  const title = cleanText($("title").first().text()) || h1 || "Mission Control";
  const firstParagraph = blocks.find((block) => block.type === "paragraph")?.text || "";
  const description = route.startsWith("/case-studies/") && firstParagraph.length > 80
    ? firstParagraph
    : cleanText($("meta[name='description']").attr("content") || "") || firstParagraph;
  const ogImage = normaliseHref($("meta[property='og:image']").attr("content") || "");
  const published = $("meta[property='article:published_time']").attr("content") || $("time[datetime]").first().attr("datetime") || "";
  const modified = $("meta[property='article:modified_time']").attr("content") || "";

  return {
    route,
    title,
    description,
    canonical: `https://wearemissioncontrol.com${route === "/" ? "/" : `${route}/`}`,
    ogImage,
    published,
    modified,
    blocks,
  };
}

const pages = [];
for (const file of htmlFiles.sort()) {
  const html = await readFile(file, "utf8");
  const page = extractPage(file, html);
  if (page.route === "/" || page.blocks.length < 2) continue;
  pages.push(page);
}

for (const page of pages) {
  const assetFields = [
    ...(page.ogImage ? [{ holder: page, key: "ogImage" }] : []),
    ...page.blocks.filter((block) => block.type === "image" && block.src).map((block) => ({ holder: block, key: "src" })),
  ];
  for (const { holder, key } of assetFields) {
    let url;
    try {
      url = new URL(holder[key], "https://missioncontrol.uk.com/");
    } catch {
      continue;
    }
    if (!["missioncontrol.uk.com", "www.missioncontrol.uk.com"].includes(url.hostname) || !url.pathname.startsWith("/wp-content/")) continue;
    const localSource = resolve(workspaceRoot, `.${url.pathname}`);
    if (!existsSync(localSource)) continue;
    const localTarget = resolve(legacyAssetRoot, `.${url.pathname}`);
    await mkdir(dirname(localTarget), { recursive: true });
    await copyFile(localSource, localTarget);
    holder[key] = `/assets/legacy${url.pathname}`;
  }
}

await writeFile(outputPath, `${JSON.stringify(pages, null, 2)}\n`, "utf8");
console.log(`Extracted ${pages.length} legacy routes to ${relative(process.cwd(), outputPath)}`);

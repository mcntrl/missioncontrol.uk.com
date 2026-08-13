import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { glob } from "tinyglobby";
import * as cheerio from "cheerio";

const distRoot = resolve(process.cwd(), "dist/client");
const files = await glob(["**/index.html"], { cwd: distRoot, absolute: true });
const failures = [];
const titles = new Map();
const canonicals = new Map();

for (const file of files) {
  const html = await readFile(file, "utf8");
  const $ = cheerio.load(html);
  const route = relative(distRoot, file) === "index.html" ? "/" : `/${relative(distRoot, file).replace(/\/index\.html$/, "")}`;
  const title = $("title").text().trim();
  const description = $("meta[name='description']").attr("content")?.trim() || "";
  const canonical = $("link[rel='canonical']").attr("href")?.trim() || "";
  const h1Count = $("#root .seo-fallback h1").length;
  const bodyText = $("#root .seo-fallback").text().replace(/\s+/g, " ").trim();
  const schema = $("script#page-schema").text().trim();

  if (!title) failures.push(`${route}: missing title`);
  if (description.length < 45) failures.push(`${route}: description is too short (${description.length})`);
  if (!canonical.startsWith("https://wearemissioncontrol.com/")) failures.push(`${route}: invalid canonical ${canonical}`);
  if (h1Count !== 1) failures.push(`${route}: expected one static H1, found ${h1Count}`);
  if (bodyText.length < 100) failures.push(`${route}: static body copy is too short (${bodyText.length})`);
  try { JSON.parse(schema); } catch { failures.push(`${route}: invalid JSON-LD`); }
  if (titles.has(title)) failures.push(`${route}: duplicate title also used by ${titles.get(title)}`); else titles.set(title, route);
  if (canonicals.has(canonical)) failures.push(`${route}: duplicate canonical also used by ${canonicals.get(canonical)}`); else canonicals.set(canonical, route);
}

const sitemap = await readFile(resolve(distRoot, "sitemap.xml"), "utf8");
const sitemapCount = (sitemap.match(/<url>/g) || []).length;
if (sitemapCount !== files.length) failures.push(`sitemap: ${sitemapCount} URLs for ${files.length} HTML routes`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Verified ${files.length} prerendered routes: unique titles and canonicals, metadata, JSON-LD, static H1/body content, and sitemap coverage.`);

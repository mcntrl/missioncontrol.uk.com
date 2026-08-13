import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const liveRaw = JSON.parse(fs.readFileSync(path.join(root, "src/content/live-pages.json"), "utf8"));
const legacyRaw = JSON.parse(fs.readFileSync(path.join(root, "src/content/legacy-pages.json"), "utf8"));

const clean = (value = "") => String(value).replace(/\s+/g, " ").trim();
const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const livePages = Object.entries(liveRaw).map(([route, page]) => ({
  route,
  source: "current",
  title: clean(page.title),
  description: clean(page.description),
  canonical: page.canonical || `https://wearemissioncontrol.com${route === "/" ? "/" : `${route}/`}`,
  modified: "",
  content: (page.content || []).map((block) => ({
    type: block.tag,
    text: clean(block.text),
  })),
}));

const currentRoutes = new Set(livePages.map((page) => page.route));
const legacyPages = legacyRaw
  .filter((page) => !currentRoutes.has(page.route))
  .map((page) => ({
    route: page.route,
    source: "legacy",
    title: clean(page.title),
    description: clean(page.description),
    canonical: page.canonical || `https://wearemissioncontrol.com${page.route}/`,
    modified: page.modified || "",
    content: (page.blocks || [])
      .filter((block) => block.type !== "image")
      .map((block) => ({
        type: block.type === "heading" ? `h${block.level || 2}` : block.type,
        text: clean(block.text),
      })),
  }));

const pages = [...livePages, ...legacyPages];

function renderContent(blocks) {
  return blocks
    .filter((block) => block.text)
    .map((block) => {
      if (/^h[1-4]$/.test(block.type)) {
        const level = Math.min(Number(block.type.slice(1)) + 2, 6);
        return `<h${level}>${escapeHtml(block.text)}</h${level}>`;
      }
      if (block.type === "list-item") return `<div class="list-item">${escapeHtml(block.text)}</div>`;
      if (block.type === "quote") return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
      return `<p>${escapeHtml(block.text)}</p>`;
    })
    .join("\n");
}

function renderPage(page, index) {
  const searchText = clean([
    page.route,
    page.title,
    page.description,
    ...page.content.map((block) => block.text),
  ].join(" ")).toLowerCase();

  return `
    <article class="page-card" id="page-${index}" data-source="${page.source}" data-route="${escapeHtml(page.route)}" data-search="${escapeHtml(searchText)}">
      <header class="page-header">
        <div>
          <div class="route-line">
            <span class="source ${page.source}">${page.source === "current" ? "CURRENT SITE" : "PRESERVED LEGACY"}</span>
            <code>${escapeHtml(page.route)}</code>
          </div>
          <h2>${escapeHtml(page.title)}</h2>
        </div>
        <a href="http://localhost:4174${escapeHtml(page.route)}" target="_blank" rel="noreferrer">View page ↗</a>
      </header>

      <section class="seo-block">
        <div><span>SEO title</span><strong>${escapeHtml(page.title)}</strong></div>
        <div><span>Meta description</span><p>${escapeHtml(page.description || "No description captured — requires review")}</p></div>
        <div><span>Canonical</span><code>${escapeHtml(page.canonical)}</code></div>
        ${page.modified ? `<div><span>Last modified</span><time>${escapeHtml(page.modified)}</time></div>` : ""}
      </section>

      <details class="copy-panel" ${page.source === "current" ? "open" : ""}>
        <summary>Page copy <span>${page.content.length} blocks</span></summary>
        <div class="page-copy">${renderContent(page.content)}</div>
      </details>

      <section class="decision" aria-label="Sign-off decision">
        <div class="decision-buttons" role="group" aria-label="Review status">
          <button type="button" data-status="approved">✓ Approve</button>
          <button type="button" data-status="changes">✎ Needs changes</button>
          <button type="button" data-status="pending">Reset</button>
        </div>
        <label>
          <span>Reviewer notes</span>
          <textarea rows="3" placeholder="Add the exact wording or change required…"></textarea>
        </label>
      </section>
    </article>`;
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex,nofollow" />
    <title>Mission Control — Content sign-off</title>
    <style>
      :root { color-scheme: dark; --bg:#090c0e; --panel:#101519; --line:#293139; --muted:#8c969e; --text:#f3f5f5; --lime:#c7f637; --orange:#ff5b35; --blue:#6cc4ff; }
      * { box-sizing:border-box; }
      html { scroll-behavior:smooth; }
      body { margin:0; background:var(--bg); color:var(--text); font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
      button,input,textarea { font:inherit; }
      .shell { width:min(1460px,100%); margin:0 auto; padding:32px; }
      .masthead { border:1px solid var(--line); padding:28px; background:var(--panel); display:grid; grid-template-columns:1fr auto; gap:24px; align-items:end; }
      .eyebrow,.source,.seo-block span,.decision label>span { font:700 11px ui-monospace,SFMono-Regular,Menlo,monospace; letter-spacing:.12em; text-transform:uppercase; }
      .eyebrow { color:var(--lime); }
      h1 { max-width:760px; margin:12px 0 8px; font-size:clamp(38px,6vw,72px); line-height:.92; letter-spacing:-.055em; }
      .intro { color:#bac1c6; max-width:780px; line-height:1.6; margin:0; }
      .progress { min-width:260px; }
      .progress-row { display:flex; justify-content:space-between; margin-bottom:8px; font:12px ui-monospace,monospace; }
      .progress-bar { height:8px; border:1px solid var(--line); background:#080a0c; }
      .progress-bar i { display:block; height:100%; width:0; background:var(--lime); transition:width .2s ease; }
      .toolbar { position:sticky; top:0; z-index:10; display:grid; grid-template-columns:minmax(220px,1fr) repeat(3,auto); gap:10px; padding:14px 0; background:rgba(9,12,14,.95); backdrop-filter:blur(12px); }
      .toolbar input,.toolbar button { min-height:44px; border:1px solid var(--line); background:var(--panel); color:var(--text); padding:0 14px; }
      .toolbar button { cursor:pointer; font:700 11px ui-monospace,monospace; letter-spacing:.08em; text-transform:uppercase; }
      .toolbar button.active { border-color:var(--lime); color:var(--lime); }
      .summary { display:flex; gap:16px; color:var(--muted); padding:12px 2px 20px; font:12px ui-monospace,monospace; }
      .summary strong { color:var(--text); }
      .pages { display:grid; gap:18px; }
      .page-card { border:1px solid var(--line); background:var(--panel); }
      .page-card.is-approved { border-color:#63801a; }
      .page-card.is-changes { border-color:var(--orange); }
      .page-header { display:grid; grid-template-columns:1fr auto; align-items:start; gap:20px; padding:24px; border-bottom:1px solid var(--line); }
      .route-line { display:flex; align-items:center; flex-wrap:wrap; gap:10px; }
      .source { display:inline-block; padding:5px 7px; color:#091012; background:var(--lime); }
      .source.legacy { background:#39444d; color:#eef1f2; }
      code { color:#b9c2c8; overflow-wrap:anywhere; }
      .page-header h2 { margin:14px 0 0; font-size:clamp(24px,3vw,42px); line-height:1.02; letter-spacing:-.035em; }
      .page-header a { color:var(--orange); text-decoration:none; font:700 11px ui-monospace,monospace; letter-spacing:.08em; text-transform:uppercase; }
      .seo-block { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--line); border-bottom:1px solid var(--line); }
      .seo-block>div { min-width:0; padding:18px 20px; background:#0c1114; }
      .seo-block span { display:block; color:var(--lime); margin-bottom:7px; }
      .seo-block strong,.seo-block p,.seo-block code,.seo-block time { margin:0; font-size:14px; line-height:1.55; font-weight:500; }
      details summary { cursor:pointer; padding:18px 20px; border-bottom:1px solid var(--line); font:700 12px ui-monospace,monospace; letter-spacing:.08em; text-transform:uppercase; }
      details summary span { color:var(--muted); margin-left:8px; }
      .page-copy { max-width:860px; padding:28px 24px 34px; }
      .page-copy h3,.page-copy h4,.page-copy h5,.page-copy h6 { margin:28px 0 8px; line-height:1.1; letter-spacing:-.025em; }
      .page-copy h3 { font-size:30px; }
      .page-copy h4 { font-size:23px; color:#e4e8ea; }
      .page-copy h5,.page-copy h6 { font-size:18px; }
      .page-copy p,.list-item,.page-copy blockquote { color:#c3c9cd; line-height:1.7; }
      .list-item { position:relative; padding-left:22px; margin:7px 0; }
      .list-item::before { content:"+"; position:absolute; left:0; color:var(--orange); }
      .page-copy blockquote { border-left:2px solid var(--orange); margin:18px 0; padding:2px 0 2px 18px; }
      .decision { display:grid; grid-template-columns:auto 1fr; gap:22px; padding:20px 24px; border-top:1px solid var(--line); background:#0b0f12; }
      .decision-buttons { display:flex; gap:8px; align-self:start; }
      .decision button { border:1px solid var(--line); background:transparent; color:var(--text); padding:10px 12px; cursor:pointer; }
      .decision button.selected[data-status="approved"] { border-color:var(--lime); color:var(--lime); }
      .decision button.selected[data-status="changes"] { border-color:var(--orange); color:var(--orange); }
      .decision label>span { display:block; color:var(--muted); margin-bottom:8px; }
      textarea { width:100%; resize:vertical; border:1px solid var(--line); background:#080b0d; color:var(--text); padding:12px; line-height:1.5; }
      .empty { display:none; border:1px dashed var(--line); padding:50px; text-align:center; color:var(--muted); }
      footer { color:var(--muted); padding:30px 2px; font-size:13px; }
      @media (max-width:760px) {
        .shell { padding:16px; }
        .masthead,.page-header,.decision { grid-template-columns:1fr; }
        .progress { min-width:0; }
        .toolbar { grid-template-columns:1fr 1fr; }
        .toolbar input { grid-column:1/-1; }
        .seo-block { grid-template-columns:1fr; }
        .decision-buttons { flex-wrap:wrap; }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <header class="masthead">
        <div>
          <div class="eyebrow">Mission Control / Editorial review</div>
          <h1>Content sign-off</h1>
          <p class="intro">Approve the wording and metadata route by route. Current pages are listed first; preserved historic content follows. Decisions and notes are saved only in this browser.</p>
        </div>
        <div class="progress" aria-live="polite">
          <div class="progress-row"><span>Review progress</span><strong id="progressText">0 / ${pages.length}</strong></div>
          <div class="progress-bar"><i id="progressBar"></i></div>
        </div>
      </header>

      <nav class="toolbar" aria-label="Content filters">
        <input id="search" type="search" placeholder="Search routes, titles or copy…" aria-label="Search content" />
        <button class="active" data-filter="all">All pages</button>
        <button data-filter="current">Current</button>
        <button data-filter="legacy">Legacy</button>
      </nav>
      <div class="summary"><span><strong>${livePages.length}</strong> current</span><span><strong>${legacyPages.length}</strong> legacy-only</span><span><strong>${pages.length}</strong> unique routes</span><span id="visibleCount">${pages.length} shown</span></div>
      <section class="pages">${pages.map(renderPage).join("\n")}</section>
      <div class="empty" id="empty">No content matches this filter.</div>
      <footer>This review sheet is marked noindex and is not part of the production sitemap.</footer>
    </main>
    <script>
      const key = "mission-control-content-signoff-v1";
      const cards = [...document.querySelectorAll(".page-card")];
      const search = document.querySelector("#search");
      const filterButtons = [...document.querySelectorAll("[data-filter]")];
      let activeFilter = "all";
      let state = {};
      try { state = JSON.parse(localStorage.getItem(key) || "{}"); } catch { state = {}; }

      function save() { localStorage.setItem(key, JSON.stringify(state)); updateProgress(); }
      function applyCardState(card) {
        const route = card.dataset.route;
        const saved = state[route] || { status: "pending", notes: "" };
        card.classList.toggle("is-approved", saved.status === "approved");
        card.classList.toggle("is-changes", saved.status === "changes");
        card.querySelectorAll("[data-status]").forEach((button) => button.classList.toggle("selected", button.dataset.status === saved.status));
        card.querySelector("textarea").value = saved.notes || "";
      }
      function updateProgress() {
        const reviewed = cards.filter((card) => ["approved", "changes"].includes(state[card.dataset.route]?.status)).length;
        document.querySelector("#progressText").textContent = reviewed + " / " + cards.length;
        document.querySelector("#progressBar").style.width = (reviewed / cards.length * 100) + "%";
      }
      function applyFilters() {
        const query = search.value.trim().toLowerCase();
        let visible = 0;
        cards.forEach((card) => {
          const matchesType = activeFilter === "all" || card.dataset.source === activeFilter;
          const matchesQuery = !query || card.dataset.search.includes(query);
          const show = matchesType && matchesQuery;
          card.hidden = !show;
          if (show) visible += 1;
        });
        document.querySelector("#visibleCount").textContent = visible + " shown";
        document.querySelector("#empty").style.display = visible ? "none" : "block";
      }

      cards.forEach((card) => {
        applyCardState(card);
        card.querySelectorAll("[data-status]").forEach((button) => button.addEventListener("click", () => {
          const route = card.dataset.route;
          state[route] = { ...(state[route] || {}), status: button.dataset.status };
          applyCardState(card);
          save();
        }));
        card.querySelector("textarea").addEventListener("input", (event) => {
          const route = card.dataset.route;
          state[route] = { ...(state[route] || { status: "pending" }), notes: event.target.value };
          save();
        });
      });
      filterButtons.forEach((button) => button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        filterButtons.forEach((item) => item.classList.toggle("active", item === button));
        applyFilters();
      }));
      search.addEventListener("input", applyFilters);
      updateProgress();
    </script>
  </body>
</html>`;

fs.writeFileSync(path.join(root, "content-signoff.html"), html);
console.log(`Generated content-signoff.html for ${pages.length} unique routes (${livePages.length} current, ${legacyPages.length} legacy-only).`);

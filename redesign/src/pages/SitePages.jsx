import {
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  Code,
  CreditCard,
  LockKey,
  ShieldCheck,
} from "@phosphor-icons/react";
import {
  blogPosts,
  caseStudies,
  clients,
  currentPageContent,
  processPhases,
} from "../content/site-data";
import { ContactForm } from "../components/SiteChrome";

const readinessSignals = [
  { number: "01", name: "Security", description: "Threat modelled, penetration tested, dependency controlled.", Icon: ShieldCheck },
  { number: "02", name: "Data & GDPR", description: "Privacy by default, lawful processing, deletion flows documented.", Icon: LockKey },
  { number: "03", name: "App stores", description: "Guideline-compliant builds, metadata and approvals prepared.", Icon: AppWindow },
  { number: "04", name: "Payments", description: "Providers integrated, webhooks secured, failures handled.", Icon: CreditCard },
  { number: "05", name: "Maintainability", description: "Readable, tested and monitored code built to evolve.", Icon: Code },
];

const stations = [
  ["01", "Discover", "Define the mission"],
  ["02", "Build", "Engineer the core"],
  ["03", "Harden", "Secure, comply & scale"],
  ["04", "Launch", "Stores, payments & go-live"],
  ["05", "Operate", "Monitor, improve, evolve"],
];

function ReadinessList() {
  return (
    <div className="signal-list">
      {readinessSignals.map(({ number, name, description, Icon }) => (
        <article className="signal-row" key={number}>
          <Icon className="signal-icon" weight="duotone" aria-hidden="true" />
          <span className="signal-number">{number}</span>
          <h3>{name}</h3>
          <p>{description}</p>
          <span className="signal-state"><i /> Clear</span>
        </article>
      ))}
    </div>
  );
}

export function ClientBand({ compact = false }) {
  return (
    <section className={`client-band ${compact ? "is-compact" : ""}`} aria-label="Selected clients">
      <span>Trusted to deliver missions for</span>
      <div className="client-logos">
        {clients.map((client) => <img key={client.name} src={client.src} alt={client.name} />)}
      </div>
    </section>
  );
}

export function PageHero({ eyebrow, title, intro, code = "MC—INT", image = "/assets/visuals/orbit-map.png", children }) {
  return (
    <section className="page-hero" aria-labelledby="page-title">
      <div className="page-hero-copy">
        <div className="mission-meta"><span className="status-dot" /> {code} <i /> Northampton, UK</div>
        <span className="hero-kicker">{eyebrow}</span>
        <h1 id="page-title">{title}</h1>
        {intro && <p className="page-hero-intro">{intro}</p>}
        {children}
      </div>
      <div className="page-hero-visual"><img src={image} alt="" /></div>
    </section>
  );
}

export function LaunchCta({ title = "From AI-built to business-ready.", copy = "Bring us an idea, or bring us a mess. Either way, you launch." }) {
  return (
    <section className="launch-cta">
      <span className="eyebrow">Next launch window</span>
      <h2>{title}</h2>
      <p>{copy}</p>
      <a className="button button-primary" href="/contact">Book an assessment <ArrowRight weight="bold" /></a>
    </section>
  );
}

export function HomePage({ openAssessment }) {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <div className="mission-meta"><span className="status-dot" /> Black box launch room <i /> Est. 2013 <i /> Northampton, UK</div>
          <p className="hero-kicker">Build from zero. Rescue what almost works.</p>
          <h1 id="hero-heading">Your prototype<br />worked.<br /><br />Now make it<br />survive production.</h1>
          <p className="hero-lede">We build production-grade software from day one — and rescue AI-built MVPs that hit the wall. Secure, compliant, approved and ready to scale.</p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={openAssessment}>Book an assessment <ArrowRight weight="bold" /></button>
            <a className="text-link" href="/our-process">View the flight plan <ArrowRight /></a>
          </div>
        </div>
        <div className="hero-visual" aria-label="Five-stage production launch path">
          <img src="/assets/visuals/orbit-map.png" alt="Abstract mission launch trajectory with five readiness stations" />
          <ol className="station-legend">
            {stations.map(([number, title, description]) => (
              <li key={number} className={number === "04" ? "active" : ""}>
                <span>{number}</span><strong>{title}</strong><small>{description}</small>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="readiness" aria-labelledby="readiness-title">
        <div className="section-intro">
          <div><span className="eyebrow">Launch readiness check</span><h2 id="readiness-title">Five signals. One standard.</h2></div>
          <p>Before we launch anything, it must pass our operational checklist.</p>
        </div>
        <ReadinessList />
      </section>

      <ClientBand />

      <section className="featured-mission" aria-labelledby="mission-title">
        <img className="mission-image" src="/assets/visuals/forpaws-feature.png" alt="ForPaws lost-dog identification experience" />
        <div className="mission-copy">
          <span className="eyebrow">Featured mission</span>
          <p className="mission-client">Mars ForPaws</p>
          <h2 id="mission-title">AI-powered lost-dog matching.</h2>
          <p>We designed and launched an app that identifies dogs from up to 17 facial markers across more than 130 breeds.</p>
          <div className="mission-outcome"><span>Mission outcome</span><strong>96%+ match accuracy</strong><small>Concept to live in 12 weeks</small></div>
          <a className="text-link" href="/case-studies">View mission details <ArrowRight /></a>
        </div>
      </section>
    </>
  );
}

export function ProcessPage() {
  return (
    <>
      <PageHero eyebrow="Our process" title="The flight plan." code="MC—PROC" intro={currentPageContent["/our-process"].description} />
      <section className="process-grid" aria-label="Four-stage delivery process">
        {processPhases.map((phase) => (
          <article className="process-card" key={phase.number}>
            <div className="process-index"><span>{phase.number}</span><small>{phase.timing}</small></div>
            <h2>{phase.title}</h2><p>{phase.copy}</p><span className="process-state"><i /> Go</span>
          </article>
        ))}
      </section>
      <section className="readiness internal-readiness">
        <div className="section-intro"><div><span className="eyebrow">Go / no-go poll</span><h2>Five stations. Zero surprises.</h2></div><p>Every mission is tested against the same production standard.</p></div>
        <ReadinessList />
      </section>
      <LaunchCta title="Know exactly what stands between your MVP and launch." />
    </>
  );
}

export function CaseStudiesPage() {
  return (
    <>
      <PageHero eyebrow="Case studies" title="The flight log." code="MC—LOG" intro={currentPageContent["/case-studies"].description || "More than a decade of missions for major clients, built from the ground up and flown in production."} />
      <section className="mission-grid" aria-label="Mission case studies">
        {caseStudies.map((study) => (
          <article className="mission-card" key={study.mission}>
            <div className="mission-card-top"><span>Mission {study.mission}</span><strong><i /> {study.status}</strong></div>
            <div className="mission-card-image"><img src={study.image} alt={study.client} /></div>
            <div className="mission-card-body"><span className="mission-client">{study.client}</span><h2>{study.title}</h2><p>{study.copy}</p></div>
            <dl>{study.stats.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          </article>
        ))}
      </section>
      <LaunchCta title="Yours could be next to the launchpad." copy="Rescue, rebuild, or ground-up — the mission continues." />
    </>
  );
}

export function AboutPage() {
  const crew = ["director.png", "crew.png", "crew-2.png", "crew-3.png", "crew-4.png", "crew-5.png"];
  return (
    <>
      <PageHero eyebrow="About Mission Control" title="On console since 2013." code="MC—CREW" intro={currentPageContent["/about"].description} image="/assets/live/vulcan-works-hq.jpg" />
      <section className="story-layout">
        <div className="story-heading"><span className="eyebrow">Operating principle</span><h2>Exceptional doesn’t happen by accident.</h2></div>
        <div className="story-copy">
          <p>Exceptional digital experiences are engineered through innovative thinking, technical expertise and a deep understanding of human behaviour. That philosophy guides every project we fly.</p>
          <p>Our work spans industries and continents, connected by a commitment to products that do not merely meet expectations — they redefine them.</p>
          <p>It is also why we are the natural choice for rescue and hardening work. We know where generated code cuts corners because we have spent more than a decade building the systems it imitates.</p>
        </div>
      </section>
      <section className="hq-feature">
        <img src="/assets/live/vulcan-works-hq.jpg" alt="The Mission Control sign hanging outside Vulcan Works, Northampton" />
        <div><span className="eyebrow">Northampton base</span><h2>From the Iron Works to Mission Control.</h2><p>Our studio sits inside Vulcan Works, a Grade II listed landmark in Northampton’s Cultural Quarter. The same walls that once housed industrial innovation now witness the digital systems we build and fly.</p></div>
      </section>
      <ClientBand compact />
      <section className="crew-section">
        <div className="section-intro"><div><span className="eyebrow">The people who build the things</span><h2>The crew on console.</h2></div><p>No account managers between you and the people writing the code.</p></div>
        <div className="crew-grid">{crew.map((image, index) => <figure key={image}><img src={`/assets/live/${image}`} alt={index === 0 ? "Ink sketch portrait of a Mission Control flight director" : "Ink sketch portrait of a Mission Control crew member"} /><figcaption><span>Console {String(index + 1).padStart(2, "0")}</span><strong>{index === 0 ? "Flight director" : "Mission crew"}</strong></figcaption></figure>)}</div>
        <div className="crew-note"><p>The team has designed, built and flown digital products from first sketch to day-two support since 2013. Mobile apps, web platforms, AI systems and bespoke video infrastructure: if it ships, someone on this console has built it from zero.</p><p>We are unapologetically a bunch of geeks. People who genuinely love computing build better things on it.</p></div>
      </section>
      <LaunchCta title="Come see what we can do for you." copy="Rescue, rebuild, or ground-up — we’d love to hear what you’re flying." />
    </>
  );
}

export function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Book an assessment" title="Open a channel." code="MC—COMMS" intro={currentPageContent["/contact"].description} />
      <section className="contact-layout">
        <div className="contact-panel"><span className="eyebrow">Mission brief</span><h2>Tell us what needs to launch.</h2><ContactForm /></div>
        <aside className="contact-aside">
          <div><span>Comms</span><a href="mailto:hello@wearemissioncontrol.com">hello@wearemissioncontrol.com</a><a href="tel:+441604913390">+44 (0)1604 913390</a></div>
          <div><span>Base</span><address>Unit 24, Vulcan Works<br />34–38 Guildhall Road<br />Northampton NN1 1EW</address></div>
          <div><span>Response window</span><strong>Within one working day</strong></div>
        </aside>
      </section>
    </>
  );
}

export function BlogPage() {
  return (
    <>
      <PageHero eyebrow="News & blog" title="The transmission log." code="MC—TX" intro={currentPageContent["/blog"].description} />
      <section className="blog-grid" aria-label="Latest transmissions">
        {blogPosts.map((post) => (
          <article className="blog-card" key={post.path}>
            <a className="blog-card-image" href={post.path}><img src={post.image} alt={post.title} /></a>
            <div className="blog-meta"><span>{post.code} · {post.category}</span><time>{post.date}</time></div>
            <h2><a href={post.path}>{post.title}</a></h2><p>{post.excerpt}</p>
            <a className="text-link" href={post.path}>Read transmission <ArrowRight /></a>
          </article>
        ))}
      </section>
      <LaunchCta title="Got a mission for the crew?" />
    </>
  );
}

function RichBlocks({ blocks, skipFirstHeading = true }) {
  let skipped = false;
  return blocks.map((block, index) => {
    if (skipFirstHeading && block.type === "heading" && !skipped) { skipped = true; return null; }
    if (block.type === "image") return <figure className="article-image" key={`${block.src}-${index}`}><img src={block.src} alt={block.alt || ""} /></figure>;
    if (block.type === "list-item") return <div className="article-list-item" key={`${block.text}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><p>{block.text}</p></div>;
    if (block.type === "quote") return <blockquote key={`${block.text}-${index}`}>{block.text}</blockquote>;
    if (block.type === "heading") {
      const Heading = block.level <= 2 ? "h2" : "h3";
      return <Heading key={`${block.text}-${index}`}>{block.text}</Heading>;
    }
    return <p key={`${block.text}-${index}`}>{block.text}</p>;
  });
}

export function ArticlePage({ post }) {
  const source = currentPageContent[post.path];
  const articleBlocks = source?.content?.map((block) => ({ type: block.tag.startsWith("h") ? "heading" : "paragraph", level: block.tag.startsWith("h") ? Number(block.tag.slice(1)) : undefined, text: block.text })) || [];
  return (
    <>
      <article className="article-page">
        <header className="article-header"><div className="article-meta"><span>{post.code} · {post.category}</span><time>{post.date}</time></div><h1>{post.title}</h1><p>{post.excerpt}</p></header>
        <figure className="article-lead-image"><img src={post.image} alt={post.title} /></figure>
        <div className="article-layout"><aside><span className="status-dot" /> Transmission verified<strong>Mission Control crew</strong><a href="/blog">Back to the log <ArrowRight /></a></aside><div className="article-body"><RichBlocks blocks={articleBlocks} /></div></div>
      </article>
      <LaunchCta />
    </>
  );
}

function titleWithoutBrand(title) {
  return title.replace(/\s+[—|-]\s+Mission Control(?:\s+-\s+Page.*)?$/i, "").replace(/^\p{Extended_Pictographic}+\s*/u, "");
}

export function LegacyPage({ page }) {
  const title = titleWithoutBrand(page.title);
  const isArchive = page.route.startsWith("/category/") || page.route.startsWith("/author/");
  const isLegal = ["/privacy-policy", "/cookie-policy", "/terms-of-service", "/security"].includes(page.route);
  const relatedLinks = [...new Map(page.blocks.flatMap((block) => block.links || []).filter((link) => link.href.startsWith("/")).map((link) => [link.href, link])).values()].slice(0, 12);
  return (
    <>
      <PageHero eyebrow={isArchive ? "Transmission archive" : isLegal ? "Mission protocol" : page.route.startsWith("/case-studies/") ? "Archived mission" : "Flight archive"} title={title} code="MC—ARC" intro={page.description} />
      <article className={`legacy-page ${isLegal ? "is-legal" : ""}`}>
        <div className="legacy-index"><span>Original route</span><code>{page.route}</code><strong><i /> Preserved</strong></div>
        <div className="article-body"><RichBlocks blocks={page.blocks} />{relatedLinks.length > 0 && <section className="related-links"><h2>Related transmissions</h2>{relatedLinks.map((link) => <a href={link.href} key={link.href}>{link.text}<ArrowUpRight /></a>)}</section>}</div>
      </article>
      {!isLegal && <LaunchCta />}
    </>
  );
}

export function NotFoundPage() {
  return <><PageHero eyebrow="Navigation anomaly" title="This route is off the map." code="MC—404" intro="The mission path you requested does not exist, but the console is still online." /><LaunchCta title="Return to a known flight path." /></>;
}

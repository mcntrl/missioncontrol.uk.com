import livePages from "./live-pages.json";
import legacyPages from "./legacy-pages.json";

export const primaryNav = [
  { label: "Our process", href: "/our-process" },
  { label: "Case studies", href: "/case-studies" },
  { label: "About us", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export const clients = [
  { name: "NHS", src: "/assets/clients/nhs.png" },
  { name: "Mars", src: "/assets/clients/mars.png" },
  { name: "Oxford University Press", src: "/assets/clients/oxford.png" },
  { name: "Dictionary.com", src: "/assets/clients/dictionary.png" },
  { name: "Financial Times", src: "/assets/clients/financial-times.png" },
  { name: "Pearson", src: "/assets/clients/pearson.png" },
  { name: "Mediacom", src: "/assets/clients/mediacom.png" },
  { name: "Art Fund", src: "/assets/clients/art-fund.png" },
];

export const processPhases = [
  {
    number: "01",
    timing: "T-minus 4 weeks",
    title: "Intake",
    copy: "We accept the codebase as-is, without judgement. We obtain repository access, hosting credentials and available documentation, then inventory what was built, assumed and omitted.",
  },
  {
    number: "02",
    timing: "T-minus 3 weeks",
    title: "Audit",
    copy: "The go/no-go poll: security, GDPR and data protection, app-store readiness, payments and maintainability — prioritised into a clear fixed-price plan.",
  },
  {
    number: "03",
    timing: "T-minus 2 weeks",
    title: "Harden",
    copy: "We remediate every red item: secrets, authentication, data flows, payment resilience, tests, environments, monitoring and deployment pipelines.",
  },
  {
    number: "04",
    timing: "T-zero",
    title: "Launch & hold",
    copy: "We manage store submissions and go-live, then hold the console with SLA-backed support, severity classifications, monitoring and alerts.",
  },
];

export const caseStudies = [
  {
    mission: "01",
    status: "Active",
    client: "Positive Signs",
    title: "ClickBSL",
    image: "/assets/live/clickbsl.png",
    copy: "A bespoke video-calling platform connecting deaf users to British Sign Language interpreters on demand, with document sharing, landline call-out and desktop technical assistance.",
    stats: [["Platforms", "iOS / Android / FireOS"], ["Interpreter ops", "Booking + scheduling + admin"], ["Status", "Live — clickbsl.com"]],
  },
  {
    mission: "02",
    status: "Complete",
    client: "Smart_R Education",
    title: "Smart_R eLearning apps",
    image: "/assets/live/smartr.png",
    copy: "A gamified mobile learning platform for GCSE students combining micro-lessons, adaptive learning journeys, real-time progress tracking, leaderboards and friend challenges.",
    stats: [["Build time", "6 months"], ["Platforms", "iOS / Android / Web"], ["Codebase", "Single Flutter app"]],
  },
  {
    mission: "03",
    status: "Complete",
    client: "Mars Petcare",
    title: "ForPaws AI",
    image: "/assets/visuals/forpaws-feature.png",
    copy: "An AI-powered mobile app helping owners locate lost dogs using a custom neural network that reads up to 17 facial markers and recognises more than 130 breeds.",
    stats: [["Match accuracy", "96%+"], ["Timeline", "12 weeks"], ["Outcome", "New Mars division created"]],
  },
  {
    mission: "04",
    status: "Complete",
    client: "NHS",
    title: "Condition app programme",
    image: "/assets/clients/nhs.png",
    copy: "A suite of self-management apps for chronic and acute conditions including HIV, diabetes, neonatal care, obesity and pregnancy, powered by a bespoke publishing system.",
    stats: [["Condition apps", "8+"], ["Platforms", "iOS / Android / Web"], ["Editors", "NHS teams across the UK"]],
  },
  {
    mission: "05",
    status: "Complete",
    client: "RACK",
    title: "Retail Action Crime Kit",
    image: "/assets/live/rack.png",
    copy: "A mobile app transforming retail-crime reporting from hours of paperwork into minutes, integrating reports directly with law-enforcement systems and hotspot analytics.",
    stats: [["Report time", "Hours → minutes"], ["Police integration", "Direct"], ["Recognition", "Industry innovation award"]],
  },
  {
    mission: "06",
    status: "Complete",
    client: "BikeAway",
    title: "Bike-hub booking",
    image: "/assets/live/bikeaway.png",
    copy: "A self-management booking system for cycle lockers with NFC unlocking, supported by iOS and Android apps, a web booking engine and an administration interface.",
    stats: [["Unlock method", "NFC — no key or QR"], ["Connectivity", "None required"], ["Deployment", "UK rail + public venues"]],
  },
  {
    mission: "07",
    status: "Complete",
    client: "Oxford University Press",
    title: "Dictionary platforms",
    image: "/assets/clients/oxford.png",
    copy: "A five-year engagement scaling from two African-language dictionary microsites to more than 15 language properties connected to OUP's lexical-data system.",
    stats: [["Engagement", "5+ years"], ["Language sites", "15+"], ["Peak traffic", "20,000 requests/min"]],
  },
  {
    mission: "08",
    status: "Ongoing",
    client: "Mediacom",
    title: "Retail app programmes",
    image: "/assets/clients/mediacom.png",
    copy: "Retail-commerce prototypes and MVPs including Walmart Scan & Go, subsequently adopted into Walmart's main application across multiple territories.",
    stats: [["Flagship", "Walmart Scan & Go"], ["Outcome", "Adopted into main app"], ["Territories", "US + France + Poland"]],
  },
  {
    mission: "09",
    status: "Complete",
    client: "Dictionary.com × OUP",
    title: "Lexico",
    image: "/assets/clients/dictionary.png",
    copy: "A major dictionary platform launched in 2019 with every page developed in-house, lexical-data integrations, Trending Words and Word of the Day modules.",
    stats: [["Launched", "June 2019"], ["Stack", "Rails + Remarkable CMS"], ["Operations", "Hosted and managed by MC"]],
  },
];

export const blogPosts = [
  {
    path: "/blog/why-cant-ai-just-build-this-app-for-us",
    code: "TX-04",
    category: "AI",
    date: "13 Feb 2026",
    title: "Why can't AI just build this app for us?",
    excerpt: "AI is a remarkable tool — one we use — but production software still depends on decisions, accountability and engineering discipline that prompts do not supply.",
    image: "/assets/live/blog-ai-app.webp",
  },
  {
    path: "/blog/picking-the-right-tool-for-the-job",
    code: "TX-03",
    category: "Engineering",
    date: "28 Aug 2025",
    title: "Picking the right tool for the job",
    excerpt: "Native, React Native and Flutter can all be right or wrong. The useful question is which constraints actually matter for the product in front of us.",
    image: "/assets/live/blog-right-tool.png",
  },
  {
    path: "/blog/framework-fairphone-we-like-our-hardware-like-our-software",
    code: "TX-02",
    category: "Hardware",
    date: "18 Aug 2025",
    title: "Framework & Fairphone — we like our hardware like our software",
    excerpt: "Modular, repairable and ours: hardware that changes with our needs, matching the open software we develop and love.",
    image: "/assets/live/blog-framework.jpg",
  },
  {
    path: "/blog/2025-the-year-of-the-linux-omarchy-desktop",
    code: "TX-01",
    category: "Linux",
    date: "16 Aug 2025",
    title: "2025: The year of the Linux (Omarchy) desktop",
    excerpt: "After years of distro-hopping, the console has settled. This might finally be the year of the Linux desktop.",
    image: "/assets/live/blog-omarchy.png",
  },
];

export const currentPageContent = livePages;
export const legacyPageMap = new Map(legacyPages.map((page) => [page.route.replace(/\/$/, "") || "/", page]));

export const allIndexableRoutes = [
  "/",
  "/our-process",
  "/case-studies",
  "/about",
  "/contact",
  "/blog",
  ...blogPosts.map((post) => post.path),
  ...legacyPages.map((page) => page.route),
].filter((route, index, routes) => routes.indexOf(route) === index);

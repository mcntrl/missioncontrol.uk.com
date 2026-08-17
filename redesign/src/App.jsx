import { useEffect, useMemo, useState } from "react";
import { AssessmentModal, SiteFooter, SiteHeader } from "./components/SiteChrome";
import { blogPosts, legacyPageMap, servicePages } from "./content/site-data";
import {
  AboutPage,
  ArticlePage,
  BlogPage,
  CaseStudiesPage,
  ContactPage,
  HistoryPage,
  HomePage,
  LegacyPage,
  NotFoundPage,
  PrinciplesPage,
  ProcessPage,
  ServiceDetailPage,
  ServicesPage,
} from "./pages/SitePages";

const canonicalOrigin = "https://wearemissioncontrol.com";

const routeSeo = {
  "/": {
    title: "Mission Control — From AI-built to business-ready",
    description: "Mission Control builds production-grade software from zero and rescues AI-built MVPs that need security, compliance, app-store readiness and maintainability.",
  },
  "/our-process": {
    title: "Our Process — Mission Control",
    description: "Every rescue follows the same disciplined sequence: intake, audit, harden, launch and hold — with one fixed price agreed before work begins.",
  },
  "/case-studies": {
    title: "Case Studies — Mission Control",
    description: "More than a decade of production software missions for organisations including the NHS, Mars, Oxford University Press, Dictionary.com and Walmart.",
  },
  "/about": {
    title: "About Us — Mission Control",
    description: "On console since 2013, Mission Control designs, builds and hardens production-grade mobile applications, web platforms and AI systems from Northampton.",
  },
  "/contact": {
    title: "Contact Us — Mission Control",
    description: "Open a channel with Mission Control about an AI-built MVP, a product that needs hardening, or a new bespoke software mission.",
  },
  "/blog": {
    title: "News & Blog — Mission Control",
    description: "Dispatches from the Mission Control console: launches, engineering opinions, AI, Linux, hardware and practical product guidance.",
  },
  "/services": {
    title: "Software Development Services — Mission Control",
    description: "Explore Mission Control's mobile, web, desktop, AI, product strategy, self-management, modernisation and long-term software support services.",
    schemaType: "CollectionPage",
  },
  "/our-history": {
    title: "Our History — Mission Control",
    description: "Founded in 2013, Mission Control has delivered mobile apps, web platforms, AI systems and global digital programmes for more than a decade.",
    schemaType: "AboutPage",
    image: "/assets/live/vulcan-works-hq.jpg",
  },
  "/open-source-and-sustainable-development": {
    title: "Open Source & Sustainable Development — Mission Control",
    description: "How Mission Control applies Linux, open-source thinking, sustainable technology and responsible engineering to long-lived digital products.",
    image: "/assets/live/framework-tux.jpg",
  },
};

function normalisePath(pathname) {
  const clean = pathname.replace(/\/index\.html$/, "").replace(/\/$/, "");
  return clean || "/";
}

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement(selector.startsWith("link") ? "link" : "meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function useSeo(path, title, description, type = "website", image = "/assets/visuals/forpaws-feature.png", schemaType = "WebPage") {
  useEffect(() => {
    const canonical = `${canonicalOrigin}${path === "/" ? "/" : `${path}/`}`;
    document.title = title;
    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('link[rel="canonical"]', { rel: "canonical", href: canonical });
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    setMeta('meta[property="og:type"]', { property: "og:type", content: type });
    setMeta('meta[property="og:image"]', { property: "og:image", content: image.startsWith("http") ? image : `${canonicalOrigin}${image}` });
    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });

    const previousSchema = document.getElementById("page-schema");
    previousSchema?.remove();
    const schema = document.createElement("script");
    schema.id = "page-schema";
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": type === "article" ? "Article" : schemaType,
      name: title,
      description,
      url: canonical,
      isPartOf: { "@type": "WebSite", name: "Mission Control", url: `${canonicalOrigin}/` },
      publisher: { "@type": "Organization", name: "Mission Control", url: `${canonicalOrigin}/` },
    });
    document.head.appendChild(schema);
  }, [description, image, path, schemaType, title, type]);
}

function resolveRoute(path) {
  const post = blogPosts.find((item) => item.path === path);
  if (post) return { kind: "article", post };
  const service = servicePages.find((item) => item.route === path);
  if (service) return { kind: "service-detail", service };
  if (routeSeo[path]) return { kind: path === "/" ? "home" : path.slice(1) };
  const legacy = legacyPageMap.get(path);
  if (legacy) return { kind: "legacy", page: legacy };
  return { kind: "not-found" };
}

export function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const path = normalisePath(window.location.pathname);
  const route = useMemo(() => resolveRoute(path), [path]);

  const seo = route.kind === "article"
    ? { title: `${route.post.title} — Mission Control`, description: route.post.excerpt, type: "article", image: route.post.image }
    : route.kind === "service-detail"
      ? {
          title: route.service.seoTitle || `${route.service.title} — Mission Control`,
          description: route.service.description,
          type: route.service.schemaType === "Article" ? "article" : "website",
          image: route.service.image,
          schemaType: route.service.schemaType || "Service",
        }
    : route.kind === "legacy"
      ? { title: route.page.title, description: route.page.description || "Mission Control archive", type: route.page.published ? "article" : "website", image: route.page.ogImage || "/assets/visuals/orbit-map.png" }
      : routeSeo[path] || { title: "Route not found — Mission Control", description: "The requested Mission Control route could not be found." };

  useSeo(path, seo.title, seo.description, seo.type, seo.image, seo.schemaType);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  let page;
  switch (route.kind) {
    case "home": page = <HomePage openAssessment={() => setModalOpen(true)} />; break;
    case "our-process": page = <ProcessPage />; break;
    case "case-studies": page = <CaseStudiesPage />; break;
    case "about": page = <AboutPage />; break;
    case "contact": page = <ContactPage />; break;
    case "blog": page = <BlogPage />; break;
    case "services": page = <ServicesPage />; break;
    case "our-history": page = <HistoryPage />; break;
    case "open-source-and-sustainable-development": page = <PrinciplesPage />; break;
    case "service-detail": page = <ServiceDetailPage service={route.service} />; break;
    case "article": page = <ArticlePage post={route.post} />; break;
    case "legacy": page = <LegacyPage page={route.page} />; break;
    default: page = <NotFoundPage />;
  }

  return (
    <div className="site-shell">
      <SiteHeader />
      <main>{page}</main>
      <SiteFooter />
      <AssessmentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

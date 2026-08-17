import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, CheckCircle, List, X } from "@phosphor-icons/react";
import { footerServiceLinks, primaryNav } from "../content/site-data";

export function Brand() {
  return (
    <a className="brand" href="/" aria-label="Mission Control home">
      <span>Mission</span>
      <span>Control</span>
      <ArrowUpRight weight="bold" aria-hidden="true" />
    </a>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryNav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <a className="header-cta" href="/contact">Book an assessment <ArrowRight weight="bold" /></a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X weight="bold" /> : <List weight="bold" />}
        </button>
      </header>
      <nav className={`mobile-menu ${menuOpen ? "is-open" : ""}`} id="mobile-menu" aria-label="Mobile navigation">
        {primaryNav.map((item) => (
          <a key={item.href} href={item.href}>{item.label}<ArrowRight /></a>
        ))}
        <a className="mobile-contact" href="/contact">Book an assessment <ArrowRight /></a>
      </nav>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand"><Brand /><p>Independent product and software studio.<br />On console since 2013.</p></div>
      <div>
        <h2>Services</h2>
        {footerServiceLinks.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
      </div>
      <div>
        <h2>Company</h2>
        <a href="/about">About Mission Control</a>
        <a href="/our-history">Our history</a>
        <a href="/our-process">Our process</a>
        <a href="/case-studies">Case studies</a>
        <a href="/open-source-and-sustainable-development">Our principles</a>
        <a href="/blog">News & insights</a>
      </div>
      <div>
        <h2>Base & comms</h2>
        <address>Unit 24, Vulcan Works<br />34–38 Guildhall Road<br />Northampton NN1 1EW</address>
        <a href="mailto:hello@wearemissioncontrol.com">hello@wearemissioncontrol.com</a>
        <a href="tel:+441604913390">+44 (0)1604 913390</a>
      </div>
      <div>
        <h2>Orbit</h2>
        <a href="https://www.linkedin.com/company/missioncntrl">LinkedIn</a>
        <a href="https://x.com/missioncntrlhq">X / Twitter</a>
        <a href="https://fosstodon.org/@missioncontrol">Mastodon</a>
        <a href="/contact">Contact us</a>
      </div>
      <div className="footer-base"><span className="status-dot" /> All systems nominal <span>© 2026 Mission Control · Est. 2013</span></div>
    </footer>
  );
}

export function ContactForm({ compact = false, onComplete }) {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };
  if (submitted) {
    return (
      <div className="success-state" aria-live="polite">
        <CheckCircle weight="duotone" aria-hidden="true" />
        <span className="eyebrow">Transmission received</span>
        <h2>A human will take it from here.</h2>
        <p>We’ll review the mission and reply within one working day.</p>
        {onComplete && <button className="button button-primary" type="button" onClick={onComplete}>Return to base</button>}
      </div>
    );
  }
  return (
    <form className={`assessment-form ${compact ? "is-compact" : ""}`} onSubmit={handleSubmit}>
      <label>Name<input name="name" autoComplete="name" required placeholder="Your name" /></label>
      <label>Work email<input name="email" type="email" autoComplete="email" required placeholder="you@company.com" /></label>
      <label>Company<input name="company" autoComplete="organization" placeholder="Company or team" /></label>
      <label>Phone<input name="phone" type="tel" autoComplete="tel" placeholder="Optional" /></label>
      <fieldset>
        <legend>Mission type</legend>
        <label className="choice"><input name="mission" type="radio" defaultChecked /> Rescue an AI-built MVP</label>
        <label className="choice"><input name="mission" type="radio" /> Build from zero</label>
      </fieldset>
      <label className="form-wide">What needs to launch?<textarea name="brief" rows="5" required placeholder="A short mission brief" /></label>
      <label className="form-consent form-wide"><input name="consent" type="checkbox" required /> I agree that Mission Control may use these details to respond to this enquiry.</label>
      <button className="button button-primary form-submit" type="submit">Send mission brief <ArrowRight weight="bold" /></button>
    </form>
  );
}

export function AssessmentModal({ open, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    requestAnimationFrame(() => dialogRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="assessment-modal" role="dialog" aria-modal="true" aria-labelledby="assessment-title" tabIndex="-1" ref={dialogRef} onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close assessment form"><X weight="bold" /></button>
        <span className="eyebrow">Open a channel</span>
        <h2 id="assessment-title">Book an assessment.</h2>
        <p className="modal-intro">Tell us what you have, where it has hit the wall, and what launch looks like.</p>
        <ContactForm compact onComplete={onClose} />
      </section>
    </div>
  );
}

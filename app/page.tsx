"use client"

import { useState } from "react"

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get("name") || "")
    const phone = String(data.get("phone") || "")
    const email = String(data.get("email") || "")
    const details = String(data.get("details") || "")

    alert(
      `Demo form submitted:\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nDetails: ${details}\n\nNext step: wire this to email, Google Forms, or a CRM.`
    )

    form.reset()
  }

  return (
    <>
      {/* Header / Nav */}
      <header className="header">
        <div className="container nav">
          <a className="brand" href="#top" aria-label="Emil’s Renovations Home">
            <span className="brand-mark">ER</span>
          </a>

          <nav className={`nav-links ${menuOpen ? "is-open" : ""}`} aria-label="Primary">
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>
            <a href="#services" onClick={() => setMenuOpen(false)}>
              Services
            </a>
            <a href="#portfolio" onClick={() => setMenuOpen(false)}>
              Portfolio
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
          </nav>

          <a className="btn btn-outline" href="#contact">
            Request a Consultation
          </a>

          <button
            className={`hamburger ${menuOpen ? "is-open" : ""}`}
            aria-label="Open menu"
            aria-expanded={menuOpen ? "true" : "false"}
            onClick={() => setMenuOpen((v) => !v)}
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <main id="top" className="hero">
        <div className="hero-bg" aria-hidden="true"></div>

        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>Premium Home Renovation, Thoughtfully Done</h1>
            <p>
              Craftsmanship-driven renovations designed to elevate your home, enhance functionality, and
              stand the test of time.
            </p>

            <div className="hero-actions">
              <a className="btn btn-gold" href="#contact">
                Request a Consultation
              </a>
              <a className="btn btn-outline" href="#portfolio">
                View Our Work
              </a>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="trust">
          <div className="container trust-inner">
            <span>Fully Licensed &amp; Insured</span>
            <span className="dot">•</span>
            <span>Quality Materials</span>
            <span className="dot">•</span>
            <span>Attention to Detail</span>
            <span className="dot">•</span>
            <span>Client-Focused Service</span>
          </div>
        </div>
      </main>

      {/* About */}
      <section id="about" className="section">
        <div className="container split">
          <div className="split-copy">
            <h2>Renovation Built on Precision and Integrity</h2>
            <p>
              Emil’s Renovations is a boutique home renovation company specializing in high-quality
              residential transformations. Every project is approached with care, craftsmanship, and a
              commitment to excellence.
            </p>
            <p>
              From thoughtful planning to flawless execution, we focus on details that matter, clean
              lines, durable finishes, and results that feel refined, functional, and personal.
            </p>
            <p className="emphasis">
              Our goal is simple, deliver renovation work we are proud to put our name on.
            </p>

            <div className="badges">
              <div className="badge">
                <div className="badge-title">Craftsmanship</div>
                <div className="badge-sub">Detail-driven execution</div>
              </div>
              <div className="badge">
                <div className="badge-title">Communication</div>
                <div className="badge-sub">Clear scope and timelines</div>
              </div>
              <div className="badge">
                <div className="badge-title">Respect</div>
                <div className="badge-sub">Clean, organized job sites</div>
              </div>
            </div>
          </div>

          <div className="split-media">
            <div className="image-card">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=70"
                alt="Modern kitchen renovation"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2>Our Services</h2>
            <p>Comprehensive renovation services tailored to your home.</p>
          </div>

          <div className="grid">
            <article className="card">
              <h3>Home Renovations</h3>
              <p>Full and partial renovations designed to enhance both form and function.</p>
              <ul>
                <li>Open concept updates</li>
                <li>Interior reconfiguration</li>
                <li>Finish upgrades</li>
              </ul>
            </article>

            <article className="card">
              <h3>Kitchen Renovations</h3>
              <p>Custom cabinetry, countertops, flooring, and modern finishes built for daily living.</p>
              <ul>
                <li>Cabinetry and millwork</li>
                <li>Countertops and tile</li>
                <li>Lighting and fixtures</li>
              </ul>
            </article>

            <article className="card">
              <h3>Bathroom Renovations</h3>
              <p>Clean, timeless bathrooms with quality fixtures and precise craftsmanship.</p>
              <ul>
                <li>Tile and waterproofing</li>
                <li>Vanities and storage</li>
                <li>Showers and tubs</li>
              </ul>
            </article>

            <article className="card">
              <h3>Flooring Installation</h3>
              <p>Hardwood, laminate, vinyl, and tile installed with accuracy and care.</p>
              <ul>
                <li>Subfloor prep</li>
                <li>Trim and transitions</li>
                <li>Repairs and replacement</li>
              </ul>
            </article>

            <article className="card">
              <h3>Interior Finishes</h3>
              <p>Painting, trim work, drywall, and detail-focused finishing touches.</p>
              <ul>
                <li>Interior painting</li>
                <li>Baseboards, casing, doors</li>
                <li>Drywall repair</li>
              </ul>
            </article>

            <article className="card">
              <h3>Custom Projects</h3>
              <p>Tailored solutions for unique spaces and specific client needs.</p>
              <ul>
                <li>Built-ins and feature walls</li>
                <li>Accent lighting</li>
                <li>Entryways and mudrooms</li>
              </ul>
            </article>
          </div>

          <div className="center">
            <a className="btn btn-gold" href="#contact">
              Get a Quote
            </a>
          </div>
        </div>
      </section>

      {/* Portfolio placeholder */}
      <section id="portfolio" className="section">
        <div className="container">
          <div className="section-head">
            <h2>Our Work</h2>
            <p>A selection of projects showcasing quality and detail.</p>
          </div>

          <div className="portfolio">
            <div className="port-item"></div>
            <div className="port-item"></div>
            <div className="port-item"></div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section section-cta">
        <div className="container cta">
          <div>
            <h2>Ready to Transform Your Home?</h2>
            <p>Let’s discuss your project and bring your vision to life with expert craftsmanship.</p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="row">
              <label>
                Name
                <input required name="name" placeholder="Your name" />
              </label>
              <label>
                Phone
                <input required name="phone" placeholder="(555) 555-5555" />
              </label>
            </div>

            <label>
              Email
              <input required type="email" name="email" placeholder="you@email.com" />
            </label>

            <label>
              Project details
              <textarea required name="details" rows={4} placeholder="Tell us about your project"></textarea>
            </label>

            <button className="btn btn-gold" type="submit">
              Request a Consultation
            </button>
            <p className="fineprint">This form is a demo. I can wire it to email, Google Forms, or a CRM.</p>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <div className="brand-mark small">ER</div>
            <div>
              <div className="footer-title">Emil’s Renovations</div>
              <div className="footer-sub">Premium Home Transformation</div>
            </div>
          </div>

          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-note">
            <div>Service Area: Your City + Surrounding Areas</div>
            <div>Email: hello@emilsrenovations.com</div>
            <div>Phone: (555) 555-5555</div>
          </div>
        </div>
      </footer>
    </>
  )
}

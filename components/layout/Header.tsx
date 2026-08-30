"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { brand, business, nav } from "@/lib/content"

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container site-header__inner">
        <a href="#top" className="brand" aria-label={`${brand.name} — home`}>
          <Image
            src={brand.mark.src}
            width={brand.mark.width}
            height={brand.mark.height}
            alt=""
            className="brand__logo"
            priority
            sizes="52px"
          />
          <span className="brand__wordmark">
            <span className="brand__name">Emil&rsquo;s Renovations</span>
            <span className="brand__tagline">{brand.tagline}</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          <ul className="site-nav__list">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <a href={business.phoneHref} className="site-header__phone">
            <svg
              className="site-header__phone-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 6a2 2 0 0 1 2-2Z" />
            </svg>
            {business.phoneDisplay}
          </a>
          <a href="#contact" className="btn btn--gold site-header__cta">
            Request a Consultation
          </a>
        </div>

        <button
          type="button"
          className={`menu-toggle${open ? " is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`mobile-menu${open ? " is-open" : ""}`}
        hidden={!open}
      >
        <nav aria-label="Mobile" className="mobile-menu__nav">
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="btn btn--gold mobile-menu__cta"
            onClick={() => setOpen(false)}
          >
            Request a Consultation
          </a>
          <a
            href={business.phoneHref}
            className="mobile-menu__call"
            onClick={() => setOpen(false)}
          >
            Call {business.phoneDisplay}
          </a>
          <p className="mobile-menu__license">{business.license}</p>
        </nav>
      </div>
    </header>
  )
}

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Eyebrow from "@/components/ui/Eyebrow"
import { getTestimonials } from "@/lib/testimonials"

export default function TestimonialsCarousel() {
  const items = getTestimonials()
  const count = items.length
  const [index, setIndex] = useState(0)
  const [perPage, setPerPage] = useState(1)
  const touchX = useRef<number | null>(null)

  // Show 2 reviews at once on wider screens, 1 on mobile. Initial value stays 1
  // to match server render (no hydration mismatch); updated after mount.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 760px)")
    const update = () => setPerPage(mq.matches ? 2 : 1)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const pages = Math.max(1, Math.ceil(count / perPage))
  // Derive a valid page during render (no state to clamp when perPage changes).
  const page = Math.min(index, pages - 1)

  const go = useCallback((n: number) => setIndex(((n % pages) + pages) % pages), [pages])
  const next = useCallback(() => go(page + 1), [go, page])
  const prev = useCallback(() => go(page - 1), [go, page])

  // No verified reviews and not in dev → render nothing (never fake content).
  if (count === 0) return null

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      next()
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      prev()
    }
  }
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)()
    touchX.current = null
  }

  return (
    <section id="reviews" className="section reviews" aria-labelledby="reviews-title">
      <div className="container">
        <div className="section__head reviews__head">
          <Eyebrow as="p">Client Reviews</Eyebrow>
          <h2 id="reviews-title" className="section__title">
            In our clients&rsquo; words
          </h2>
        </div>

        <div
          className="reviews__carousel"
          role="group"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* All four testimonials stay in the DOM; the track windows the view. */}
          <div className="reviews__viewport">
            <ul
              className="reviews__track"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {items.map((t) => (
                <li key={t.name + t.quote.slice(0, 12)} className="reviews__cell">
                  <figure className="reviews__card">
                    <span className="reviews__mark" aria-hidden="true">
                      &ldquo;
                    </span>
                    <blockquote className="reviews__quote">{t.quote}</blockquote>
                    <figcaption className="reviews__cite">
                      <span className="reviews__name">
                        {t.location ? `${t.name} · ${t.location}` : t.name}
                      </span>
                      {t.projectType && (
                        <span className="reviews__meta">{t.projectType}</span>
                      )}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>

          {pages > 1 && (
            <div className="reviews__controls">
              <button
                type="button"
                className="reviews__arrow"
                onClick={prev}
                aria-label="Previous testimonials"
              >
                <span aria-hidden="true">&larr;</span>
              </button>

              <div className="reviews__dots">
                {Array.from({ length: pages }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`reviews__dot${i === page ? " is-active" : ""}`}
                    aria-label={`Show testimonials page ${i + 1} of ${pages}`}
                    aria-current={i === page ? "true" : undefined}
                    onClick={() => go(i)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="reviews__arrow"
                onClick={next}
                aria-label="Next testimonials"
              >
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"

export type CarouselSlide = {
  src: string
  width: number
  height: number
  alt: string
  label?: string
}

type Props = {
  slides: CarouselSlide[]
  ariaLabel: string
  sizes?: string
  priority?: boolean
  className?: string
}

// Restrained, accessible image carousel: grid-stacked cross-fade, circular
// arrow controls, small dots, keyboard + touch/swipe, no autoplay. Reduced
// motion is handled globally (transitions collapse to instant).
export default function ImageCarousel({
  slides,
  ariaLabel,
  sizes,
  priority,
  className,
}: Props) {
  const count = slides.length
  const [index, setIndex] = useState(0)
  const touchX = useRef<number | null>(null)

  const go = useCallback(
    (n: number) => setIndex(count ? (n + count) % count : 0),
    [count]
  )
  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

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
    <div
      className={`carousel${className ? ` ${className}` : ""}`}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="carousel__frame">
        <div className="carousel__viewport" aria-live="polite">
          {slides.map((s, i) => (
            <figure
              key={s.src}
              className={`carousel__slide${i === index ? " is-active" : ""}`}
              aria-hidden={i === index ? undefined : true}
            >
              <Image
                src={s.src}
                width={s.width}
                height={s.height}
                alt={s.alt}
                priority={priority && i === 0}
                sizes={sizes}
                className="carousel__img"
              />
              {s.label && (
                <figcaption className="carousel__label">{s.label}</figcaption>
              )}
            </figure>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--prev"
              onClick={prev}
              aria-label="Previous image"
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--next"
              onClick={next}
              aria-label="Next image"
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="carousel__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`carousel__dot${i === index ? " is-active" : ""}`}
              aria-label={`Show image ${i + 1} of ${count}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

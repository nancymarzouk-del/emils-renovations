import Eyebrow from "@/components/ui/Eyebrow"
import ImageCarousel, { type CarouselSlide } from "@/components/ui/ImageCarousel"
import { business, hero, projects, trustPoints } from "@/lib/content"

// Strongest real finished photographs (kitchen + bathroom), alternating rooms.
const heroSlides: CarouselSlide[] = [
  projects[0].primary,
  projects[1].primary,
  projects[0].secondary[0],
  projects[1].secondary[0],
]

export default function Hero() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div className="hero__copy">
            <Eyebrow as="p">{hero.eyebrow}</Eyebrow>
            <h1 id="hero-title" className="hero__title">
              {hero.title}
            </h1>
            <p className="hero__body">{hero.body}</p>
            <div className="hero__actions">
              <a href="#contact" className="btn btn--gold">
                Request a Consultation
              </a>
              <a href="#work" className="text-link">
                View Our Work
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </div>

          <div className="hero__media">
            <ImageCarousel
              slides={heroSlides}
              ariaLabel="Featured Emil's Renovations projects"
              priority
              className="carousel--hero"
              sizes="(max-width: 900px) 92vw, 42vw"
            />
          </div>
        </div>
      </section>

      <div className="trust-strip" aria-label="Credentials">
        <div className="container trust-strip__inner">
          {trustPoints.map((point, i) => (
            <span key={i} className="trust-strip__item">
              {i === 0 ? (
                <a href={business.phoneHref} className="trust-strip__phone">
                  {business.phoneDisplay}
                </a>
              ) : null}
              {i === 0 ? <span className="trust-strip__sep">·</span> : null}
              {point}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

import Image from "next/image"
import Eyebrow from "@/components/ui/Eyebrow"
import { projects } from "@/lib/content"

// Compact landscape gallery: two grouped project lanes (Kitchen, Bathroom).
// Every tile is a fixed-height landscape crop of Emil's real photography, so
// portrait images never dictate section height. No carousel needed — all real
// work is visible at once, in a low, controlled vertical footprint.
export default function SelectedWork() {
  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="container">
        <div className="section__head work__head">
          <Eyebrow as="p">Our Work</Eyebrow>
          <h2 id="work-title" className="section__title">
            Spaces Transformed with Purpose
          </h2>
        </div>

        <div className="work-lanes">
          {projects.map((project) => {
            const images = [project.primary, ...project.secondary]
            return (
              <div key={project.id} className="work-lane">
                <h3 className="work-lane__label">{project.title}</h3>
                <div
                  className="work-lane__grid"
                  data-count={images.length}
                >
                  {images.map((img) => (
                    <figure key={img.src} className="work-tile">
                      <Image
                        src={img.src}
                        width={img.width}
                        height={img.height}
                        alt={img.alt}
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                        className="work-tile__img"
                      />
                    </figure>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

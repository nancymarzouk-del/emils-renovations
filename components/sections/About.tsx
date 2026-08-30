import Image from "next/image"
import Eyebrow from "@/components/ui/Eyebrow"
import { about } from "@/lib/content"

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__media">
          <Image
            src={about.image.src}
            width={about.image.width}
            height={about.image.height}
            alt={about.image.alt}
            sizes="(max-width: 900px) 90vw, 44vw"
            className="about__image"
          />
        </div>

        <div className="about__copy">
          <Eyebrow as="p">{about.eyebrow}</Eyebrow>
          <h2 id="about-title" className="section__title">
            {about.title}
          </h2>
          {about.paragraphs.map((p, i) => (
            <p key={i} className="about__paragraph">
              {p}
            </p>
          ))}
          <p className="about__emphasis">{about.emphasis}</p>
        </div>
      </div>
    </section>
  )
}

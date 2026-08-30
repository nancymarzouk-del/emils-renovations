import Image from "next/image"
import Eyebrow from "@/components/ui/Eyebrow"
import { process } from "@/lib/content"

export default function Process() {
  return (
    <section id="process" className="section process" aria-labelledby="process-title">
      <div className="container">
        <div className="process__head">
          <Eyebrow as="p">{process.eyebrow}</Eyebrow>
          <h2 id="process-title" className="section__title">
            {process.title}
          </h2>
          <p className="process__body">{process.body}</p>
        </div>

        <ul className="process__grid">
          {process.images.map((img) => (
            <li key={img.src} className="process__item">
              <div className="process__frame">
                <Image
                  src={img.src}
                  width={img.width}
                  height={img.height}
                  alt={img.alt}
                  sizes="(max-width: 700px) 90vw, 30vw"
                  className="process__image"
                />
              </div>
              <p className="process__caption">{img.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

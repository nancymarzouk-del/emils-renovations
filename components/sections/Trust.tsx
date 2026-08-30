import Eyebrow from "@/components/ui/Eyebrow"
import { business, principles, trust } from "@/lib/content"

// One compact trust band replacing the former About / Process / Why Emil's
// sections — short statement, the four principles, and the license.
export default function Trust() {
  return (
    <section id="about" className="section trust" aria-labelledby="trust-title">
      <div className="container trust__inner">
        <div className="trust__lead">
          <Eyebrow as="p">{trust.eyebrow}</Eyebrow>
          <h2 id="trust-title" className="trust__title">
            {trust.title}
          </h2>
          <p className="trust__intro">{trust.intro}</p>
          <p className="trust__license">
            {business.licenseLabel} &middot; {business.license}
          </p>
        </div>

        <ul className="trust__principles">
          {principles.map((principle) => (
            <li key={principle.title} className="trust__principle">
              <h3 className="trust__principle-title">{principle.title}</h3>
              <p className="trust__principle-desc">{principle.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

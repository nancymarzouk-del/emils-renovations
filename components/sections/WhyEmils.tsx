import Eyebrow from "@/components/ui/Eyebrow"
import Icon from "@/components/ui/Icon"
import { business, principles, whyEmils } from "@/lib/content"

export default function WhyEmils() {
  return (
    <section className="section why" aria-labelledby="why-title">
      <div className="container">
        <div className="section__head">
          <Eyebrow as="p">{whyEmils.eyebrow}</Eyebrow>
          <h2 id="why-title" className="section__title">
            {whyEmils.title}
          </h2>
        </div>

        <ul className="principles">
          {principles.map((principle) => (
            <li key={principle.title} className="principle">
              <span className="principle__icon">
                <Icon name={principle.icon} />
              </span>
              <h3 className="principle__title">{principle.title}</h3>
              <p className="principle__desc">{principle.description}</p>
            </li>
          ))}
        </ul>

        <div className="why__credentials">
          <p className="why__license">
            {business.licenseLabel} &middot; {business.license}
          </p>
          <a href={business.phoneHref} className="text-link why__phone">
            Call {business.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  )
}

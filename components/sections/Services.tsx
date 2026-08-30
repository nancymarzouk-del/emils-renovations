import Eyebrow from "@/components/ui/Eyebrow"
import Icon from "@/components/ui/Icon"
import { services } from "@/lib/content"

// Compact capability band — six services scannable at a glance (icon + name).
export default function Services() {
  return (
    <section id="services" className="section services" aria-labelledby="services-title">
      <div className="container">
        <div className="section__head services__head">
          <Eyebrow as="p">Services</Eyebrow>
          <h2 id="services-title" className="section__title">
            Our Services
          </h2>
        </div>

        <ul className="service-band">
          {services.map((service) => (
            <li key={service.index} className="service-chip">
              <span className="service-chip__icon">
                <Icon name={service.icon} />
              </span>
              <span className="service-chip__name">{service.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

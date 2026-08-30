import Image from "next/image"
import { brand, business, nav } from "@/lib/content"

// Compact footer. Uses the SAME approved ER mark + wordmark treatment as the
// header (not the full lockup image) so branding is consistent site-wide.
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <a href="#top" className="brand site-footer__brand" aria-label={`${brand.name} — home`}>
          <Image
            src={brand.mark.src}
            width={brand.mark.width}
            height={brand.mark.height}
            alt=""
            className="brand__logo site-footer__mark"
            sizes="40px"
          />
          <span className="brand__wordmark">
            <span className="brand__name">Emil&rsquo;s Renovations</span>
            <span className="brand__tagline">{brand.tagline}</span>
          </span>
        </a>

        <nav className="site-footer__nav" aria-label="Footer">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-footer__meta">
          <a href={business.phoneHref} className="site-footer__phone">
            {business.phoneDisplay}
          </a>
          <span className="site-footer__license">{business.license}</span>
        </div>
      </div>

      <div className="container site-footer__base">
        <p>&copy; {year} {brand.name}</p>
      </div>
    </footer>
  )
}

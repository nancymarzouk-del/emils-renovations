import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Hero from "@/components/sections/Hero"
import Services from "@/components/sections/Services"
import SelectedWork from "@/components/sections/SelectedWork"
import TestimonialsCarousel from "@/components/sections/TestimonialsCarousel"
import Contact from "@/components/sections/Contact"
import { siteUrl } from "@/lib/site"

// LocalBusiness structured data — verified facts only (name, website, phone,
// and the California Contractor License as an identifier). No invented address,
// hours, ratings, geo, email, or claims.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Emil's Renovations",
  url: siteUrl,
  telephone: "+1-925-212-4048",
  identifier: {
    "@type": "PropertyValue",
    name: "California Contractor License",
    value: "851429",
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <span id="top" aria-hidden="true" />
        <Hero />
        <Services />
        <SelectedWork />
        <TestimonialsCarousel />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

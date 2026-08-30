// Testimonials / reviews.
//
// CONTENT RULE: only VERIFIED, owner-approved reviews appear here. The quotes
// below were lightly edited for readability with the customers' original
// meaning preserved. No last names, no star ratings, no review-platform logos
// (none were provided). These render in both development and production.

export type Testimonial = {
  quote: string
  name: string
  location?: string
  projectType?: string
}

// Verified, owner-approved reviews.
export const testimonials: Testimonial[] = [
  {
    quote:
      "Emil remodeled three bathrooms in my home, and they all look amazing. He consistently does wonderful work, and I’m always impressed with the results. I highly recommend Emil’s Renovations.",
    name: "Linda",
    location: "Brentwood",
    projectType: "Bathroom Renovations",
  },
  {
    quote:
      "I had a great experience with Emil’s Renovations. They did an amazing job on my flooring and were professional, efficient, and attentive to every detail. The floors look beautiful, and I couldn’t be happier with the results.",
    name: "Dan",
    location: "Oakland",
    projectType: "Flooring Installation",
  },
  {
    quote:
      "Emil’s Renovations did an excellent job repairing the dry rot on the exterior of my home. They were professional, efficient, and thorough throughout the project. The repairs look great, and I’m extremely happy with the results.",
    name: "Denise",
    location: "Martinez",
    projectType: "Exterior Repair",
  },
  {
    quote:
      "We had a wonderful experience with Emil’s Renovations for our kitchen remodel. They were professional, reliable, and paid close attention to every detail. Our kitchen turned out beautifully, and we highly recommend them.",
    name: "Shane",
    location: "San Ramon",
    projectType: "Kitchen Renovation",
  },
]

// Returns the verified reviews. (No development-only placeholders remain — real
// reviews now render in every environment.)
export function getTestimonials(): Testimonial[] {
  return testimonials
}

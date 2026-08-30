// Central content for Emil's Renovations.
// Rule: only real, substantiated content. No invented projects, locations,
// testimonials, statistics, certifications, or contact details.

import type { IconName } from "@/components/ui/Icon"

export type NavItem = { label: string; href: string }

export const brand = {
  name: "Emil's Renovations",
  tagline: "Premium Home Transformation",
  // Full transparent lockup (gold ER + wordmark + tagline) — used in the footer.
  logo: {
    src: "/logo/emils-renovations-logo-transparent.png",
    width: 1000,
    height: 979,
    alt: "Emil's Renovations — Premium Home Transformation",
  },
  // Transparent ER monogram — used as the header mark (decorative; wordmark text
  // is rendered alongside it).
  mark: {
    src: "/logo/emils-renovations-mark.png",
    width: 852,
    height: 714,
  },
}

// Verified, owner-approved business information for public display.
// Do not add classifications, insurance claims, addresses, or other details.
export const business = {
  phoneDisplay: "(925) 212-4048",
  phoneHref: "tel:+19252124048",
  licenseLabel: "California Contractor License",
  license: "License #851429",
}

export const nav: NavItem[] = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Our Work", href: "#work" },
  { label: "Testimonials", href: "#reviews" },
  { label: "Contact", href: "#contact" },
]

// Compact credibility points integrated as a thin strip (no separate About /
// Why section). Only verified, real information.
export const trustPoints = [
  "Licensed California Contractor · #851429",
  "Craftsmanship and attention to detail",
  "Clear communication, start to finish",
]

export const hero = {
  eyebrow: "Residential Renovation",
  title: "Premium Home Renovation, Thoughtfully Done",
  body:
    "Craftsmanship-driven renovations that elevate how your home looks, feels, and functions — built with care and made to last.",
  image: {
    src: "/images/hero/hero-kitchen.jpg",
    width: 1536,
    height: 2048,
    alt:
      "Finished kitchen renovation with two-tone cabinetry, quartz countertops, and warm brushed-metal fixtures.",
  },
}

export const about = {
  eyebrow: "Our Craft",
  title: "Renovation Built on Precision and Integrity",
  paragraphs: [
    "Emil's Renovations is a boutique home renovation company specializing in high-quality residential transformations. Every project is approached with care, craftsmanship, and a commitment to excellence.",
    "From thoughtful planning to flawless execution, we focus on the details that matter — clean lines, durable finishes, and results that feel refined, functional, and personal.",
  ],
  emphasis:
    "Our goal is simple: deliver renovation work we are proud to put our name on.",
  image: {
    src: "/images/about/about-craftsmanship.jpg",
    width: 1536,
    height: 2048,
    alt:
      "Close-up of a finished kitchen detail — quartz countertop, undermount sink, and brushed gold faucet.",
  },
}

export type Service = {
  index: string
  title: string
  description: string
  items: string[]
  icon: IconName
}

export const services: Service[] = [
  {
    index: "01",
    title: "Home Renovations",
    description:
      "Full and partial renovations designed to enhance both form and function.",
    items: ["Open-concept updates", "Interior reconfiguration", "Finish upgrades"],
    icon: "home",
  },
  {
    index: "02",
    title: "Kitchen Renovations",
    description:
      "Custom cabinetry, countertops, flooring, and modern finishes built for daily living.",
    items: ["Cabinetry and millwork", "Countertops and tile", "Lighting and fixtures"],
    icon: "kitchen",
  },
  {
    index: "03",
    title: "Bathroom Renovations",
    description:
      "Clean, timeless bathrooms with quality fixtures and precise craftsmanship.",
    items: ["Tile and waterproofing", "Vanities and storage", "Showers and tubs"],
    icon: "bathroom",
  },
  {
    index: "04",
    title: "Flooring Installation",
    description:
      "Hardwood, laminate, vinyl, and tile installed with accuracy and care.",
    items: ["Subfloor preparation", "Trim and transitions", "Repairs and replacement"],
    icon: "flooring",
  },
  {
    index: "05",
    title: "Interior Finishes",
    description:
      "Painting, trim work, drywall, and the detail-focused finishing touches.",
    items: ["Interior painting", "Baseboards, casing, doors", "Drywall repair"],
    icon: "finishes",
  },
  {
    index: "06",
    title: "Custom Projects",
    description: "Tailored solutions for unique spaces and specific client needs.",
    items: ["Built-ins and feature walls", "Accent lighting", "Entryways and mudrooms"],
    icon: "custom",
  },
]

export type ProjectImage = {
  src: string
  width: number
  height: number
  alt: string
}

export type Project = {
  id: string
  kicker: string
  title: string
  description: string
  primary: ProjectImage
  secondary: ProjectImage[]
  // `compact` = source imagery is lower-resolution (e.g. video stills); render
  // the dominant image at a restrained size so it is never upscaled.
  compact?: boolean
}

export const projects: Project[] = [
  {
    id: "kitchen",
    kicker: "Our Work — 01",
    title: "Kitchen Renovation",
    description:
      "Two-tone cabinetry, quartz surfaces, and warm brushed-metal fixtures.",
    primary: {
      src: "/images/kitchen/kitchen-range-wide.jpg",
      width: 1536,
      height: 2048,
      alt:
        "Renovated kitchen featuring a stainless gas range, marble-look backsplash, and two-tone cabinetry.",
    },
    secondary: [
      {
        src: "/images/kitchen/kitchen-sink-detail.jpg",
        width: 1536,
        height: 2048,
        alt:
          "Kitchen detail — quartz countertop, deep undermount sink, and brushed gold faucet against a marble-look backsplash.",
      },
    ],
  },
  {
    id: "bathroom",
    kicker: "Our Work — 02",
    title: "Bathroom Renovation",
    description:
      "Large-format grey tile, a floating vanity, and a pebble-mosaic floor.",
    compact: true,
    primary: {
      src: "/images/bathroom/bathroom-finished-wide.jpg",
      width: 540,
      height: 960,
      alt:
        "Finished bathroom with grey tile walls, a walk-in shower, a floating vanity, and a pebble-mosaic floor.",
    },
    secondary: [
      {
        src: "/images/bathroom/bathroom-window-vanity.jpg",
        width: 540,
        height: 960,
        alt: "Bathroom with natural light, a floating vanity, and a rainfall shower.",
      },
      {
        src: "/images/bathroom/bathroom-vanity.jpg",
        width: 540,
        height: 960,
        alt: "Floating bathroom vanity with an LED mirror and a glass shower enclosure.",
      },
    ],
  },
]

export type ProcessImage = ProjectImage & { caption: string }

export const process = {
  eyebrow: "The Work Behind the Work",
  title: "Built right, from what you see to what you don't.",
  body:
    "The quality of a renovation is decided long before the final surface. We build with attention to structure, waterproofing, and precise installation — the parts of the work that never show, but always last.",
  // Real construction photography. No image is labeled "before" or "after".
  images: [
    {
      src: "/images/process/process-framing.jpg",
      width: 960,
      height: 1707,
      alt: "Renovation in progress — new wall framing and an open subfloor.",
      caption: "Framing & structure",
    },
    {
      src: "/images/details/detail-tilework.jpg",
      width: 960,
      height: 1707,
      alt: "Close-up of precise large-format tile installation with leveling clips.",
      caption: "Tile & precision",
    },
    {
      src: "/images/process/process-demo.jpg",
      width: 960,
      height: 1707,
      alt:
        "Renovation in progress — an interior taken back to the studs for a full rebuild.",
      caption: "Taken back to the studs",
    },
  ] as ProcessImage[],
}

export type Principle = { title: string; description: string; icon: IconName }

export const principles: Principle[] = [
  {
    title: "Craftsmanship",
    description: "Detail-driven execution on every surface.",
    icon: "craftsmanship",
  },
  {
    title: "Communication",
    description: "Clear scope, clear timelines, no surprises.",
    icon: "communication",
  },
  {
    title: "Respect",
    description: "Clean, organized, considerate job sites.",
    icon: "respect",
  },
  {
    title: "Attention to Detail",
    description: "Refined down to the final finish.",
    icon: "detail",
  },
]

export const whyEmils = {
  eyebrow: "Why Emil's",
  title: "A standard we hold on every project",
}

// Compact trust band — consolidates the substance of About / Why Emil's into a
// short, scannable statement plus the four principles and the license.
export const trust = {
  eyebrow: "Why Emil's",
  title: "Built on precision and integrity",
  intro:
    "A boutique residential renovation company — detail-driven work, thoughtfully done, and finished to a standard we're proud to put our name on.",
}

export const contact = {
  eyebrow: "Start a Project",
  title: "Ready to Transform Your Home?",
  body: "Tell us about your project.",
}

// Optional project-type choices for the consultation form (mirrors real
// services; no invented offerings).
export const projectTypes = [
  "Home Renovation",
  "Kitchen Renovation",
  "Bathroom Renovation",
  "Flooring Installation",
  "Interior Finishes",
  "Custom Project",
]

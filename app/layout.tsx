import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import { siteUrl } from "@/lib/site"
import "./globals.css"

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Emil's Renovations — Premium Home Renovation",
    template: "%s — Emil's Renovations",
  },
  description:
    "Emil's Renovations is a boutique residential renovation company specializing in high-quality kitchen, bathroom, and whole-home transformations — craftsmanship-driven work, thoughtfully done.",
  applicationName: "Emil's Renovations",
  keywords: [
    "home renovation",
    "kitchen renovation",
    "bathroom renovation",
    "residential renovation",
    "custom renovation",
    "home remodeling",
  ],
  openGraph: {
    title: "Emil's Renovations — Premium Home Renovation",
    description:
      "Craftsmanship-driven residential renovations — kitchens, bathrooms, and whole-home transformations, thoughtfully done.",
    siteName: "Emil's Renovations",
    type: "website",
    images: [
      {
        url: "/images/hero/hero-kitchen.jpg",
        width: 1536,
        height: 2048,
        alt: "Finished kitchen renovation by Emil's Renovations.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emil's Renovations — Premium Home Renovation",
    description:
      "Craftsmanship-driven residential renovations — kitchens, bathrooms, and whole-home transformations.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable}`}>{children}</body>
    </html>
  )
}

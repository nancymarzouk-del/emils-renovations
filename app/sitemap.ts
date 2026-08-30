import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/site"

// Single-page marketing site — only the homepage is a public, indexable route.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}

// Single source of truth for the production site URL.
// Set NEXT_PUBLIC_SITE_URL to the real domain (https://www.emilsrenovations.com)
// in the deployment environment. Falls back to localhost during local dev so
// metadata/OG/sitemap URLs still resolve.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

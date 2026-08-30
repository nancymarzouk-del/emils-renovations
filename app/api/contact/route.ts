import { NextResponse } from "next/server"
import { Resend } from "resend"
import { rateLimit } from "@/lib/rate-limit"

// Node runtime (Resend SDK is not Edge-compatible).
export const runtime = "nodejs"

// Destination + sender are configurable via environment variables.
// The destination defaults to the owner's verified inquiry address.
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "Embak69@yahoo.com"
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "Emil's Renovations <onboarding@resend.dev>"
const RESEND_API_KEY = process.env.RESEND_API_KEY

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Strip control characters (U+0000-U+001F, U+007F), collapse repeated
// whitespace, trim, and cap length.
function clean(value: unknown, max: number): string {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .trim()
    .slice(0, max)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function POST(request: Request) {
  // --- Basic per-IP rate limiting (5 requests / 10 minutes) ---
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  const limit = rateLimit(`contact:${ip}`, { max: 5, windowMs: 10 * 60 * 1000 })
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a little while." },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  // --- Anti-spam: honeypot field (real users never fill this) ---
  if (clean(body.company, 100)) {
    // Silently accept so bots don't learn they were caught. Nothing is sent.
    return NextResponse.json({ ok: true })
  }

  // --- Anti-spam: reject near-instant submissions (likely automated) ---
  const renderedAt = Number(body.renderedAt)
  if (Number.isFinite(renderedAt) && Date.now() - renderedAt < 2500) {
    return NextResponse.json({ ok: true })
  }

  // --- Validate + sanitize ---
  const name = clean(body.name, 100)
  const phone = clean(body.phone, 40)
  const email = clean(body.email, 160)
  const projectType = clean(body.projectType, 60)
  const details = clean(body.details, 4000)

  const fields: Record<string, string> = {}
  if (!name) fields.name = "Please enter your name."
  if (!phone) fields.phone = "Please enter a phone number."
  if (!email || !EMAIL_RE.test(email)) fields.email = "Please enter a valid email."
  if (!details) fields.details = "Please add a few details about your project."
  if (Object.keys(fields).length > 0) {
    return NextResponse.json(
      { error: "Please review the highlighted fields.", fields },
      { status: 422 }
    )
  }

  const subject = `New consultation request — ${name}`
  const textBody = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    projectType ? `Project type: ${projectType}` : null,
    "",
    "Project details:",
    details,
  ]
    .filter((line) => line !== null)
    .join("\n")

  const htmlBody = `<div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#1a1a1a">
    <h2 style="margin:0 0 16px">New consultation request</h2>
    <p style="margin:0 0 6px"><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p style="margin:0 0 6px"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p style="margin:0 0 6px"><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${
      projectType
        ? `<p style="margin:0 0 6px"><strong>Project type:</strong> ${escapeHtml(
            projectType
          )}</p>`
        : ""
    }
    <p style="margin:16px 0 4px"><strong>Project details</strong></p>
    <p style="margin:0;white-space:pre-wrap">${escapeHtml(details)}</p>
  </div>`

  // --- Not configured: preview success in dev, clear error in production ---
  if (!RESEND_API_KEY) {
    if (process.env.NODE_ENV !== "production") {
      // Preview mode for local design review: nothing is sent.
      console.info("[contact] preview mode — RESEND_API_KEY unset; no email sent")
      return NextResponse.json({ ok: true, preview: true })
    }
    return NextResponse.json(
      { error: "Email delivery is not configured yet. Please call us instead." },
      { status: 503 }
    )
  }

  // --- Send via Resend; visitor's email as Reply-To ---
  try {
    const resend = new Resend(RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    })
    if (error) {
      // Do not log submitted content — only the failure reason.
      console.error("[contact] delivery failed:", error.message)
      return NextResponse.json(
        { error: "We couldn't send your message. Please call us instead." },
        { status: 502 }
      )
    }
    return NextResponse.json({ ok: true })
  } catch {
    console.error("[contact] unexpected error while sending")
    return NextResponse.json(
      { error: "Something went wrong. Please try again or call us." },
      { status: 500 }
    )
  }
}

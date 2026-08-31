import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
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
// Optional owner copy of the internal notification, delivered via BCC on the
// same send so Emil's visible recipient list never shows it. Absent/empty →
// only CONTACT_TO_EMAIL receives the notification. Server-side only; never sent
// to the client, and never used for the customer confirmation.
const COPY_EMAIL = process.env.CONTACT_COPY_EMAIL?.trim()

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

// Short, readable, uppercase consultation reference (e.g. CON-A7K4P).
// Derived from a built-in UUID — no database, no client state, no new package.
function consultationRef(): string {
  return `CON-${randomUUID().replace(/-/g, "").slice(0, 5).toUpperCase()}`
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
  // Field name is non-semantic ("contact_website") so browsers/password managers
  // don't autofill it for legitimate visitors.
  const honeypot = clean(body.contact_website, 100)
  if (honeypot) {
    // Silently accept so bots don't learn they were caught. Nothing is sent.
    return NextResponse.json({ ok: true })
  }

  // --- Anti-spam: reject near-instant submissions (likely automated) ---
  // elapsedMs is the time the visitor spent on the page, measured on the client
  // as a single-clock duration. Using a duration (not client-vs-server absolute
  // timestamps) makes this immune to clock skew, which previously produced false
  // silent-successes for legitimate users whose device clock ran ahead.
  const elapsedMs = Number(body.elapsedMs)
  if (Number.isFinite(elapsedMs) && elapsedMs >= 0 && elapsedMs < 2500) {
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

  // --- Consultation reference (server-generated, used in subject + both bodies) ---
  const consultationId = consultationRef()
  const projectTypeDisplay = projectType || "Not specified"

  const subject = `New Consultation Request | ${consultationId} | ${name}`

  const textBody = [
    "New Consultation Request",
    "",
    `Consultation ID: ${consultationId}`,
    "",
    "CUSTOMER INFORMATION",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Project Type: ${projectTypeDisplay}`,
    "",
    "PROJECT DETAILS",
    details,
    "",
    "--",
    "Emil's Renovations",
    "(925) 212-4048",
    "California Contractor License #851429",
    "www.emilsrenovations.com",
  ].join("\n")

  // Branded, email-client-safe HTML (table layout, inline styles, no images,
  // no webfonts, no JS). Charcoal/near-black background with warm gold accents
  // and ivory text to match the Emil's Renovations brand.
  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Consultation Request</title>
</head>
<body style="margin:0;padding:0;background-color:#14110d;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#14110d;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#1c1813;border:1px solid #2e2820;">
          <!-- HEADER -->
          <tr>
            <td align="center" style="padding:34px 32px 22px 32px;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;letter-spacing:2px;color:#c9a25b;">EMIL&rsquo;S RENOVATIONS</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#9a8f7d;padding-top:8px;">Premium Home Transformation</div>
            </td>
          </tr>
          <!-- GOLD DIVIDER -->
          <tr>
            <td style="padding:0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="2" style="height:2px;background-color:#b8934a;font-size:0;line-height:0;">&nbsp;</td></tr></table>
            </td>
          </tr>
          <!-- TITLE + REFERENCE -->
          <tr>
            <td style="padding:26px 32px 4px 32px;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#f4efe6;">New Consultation Request</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#c9a25b;padding-top:8px;">Consultation ID: <strong>${escapeHtml(
                consultationId
              )}</strong></div>
            </td>
          </tr>
          <!-- CUSTOMER INFORMATION -->
          <tr>
            <td style="padding:22px 32px 0 32px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9a8f7d;padding-bottom:8px;">Customer Information</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;">
                <tr>
                  <td style="padding:6px 0;color:#9a8f7d;width:130px;vertical-align:top;">Name</td>
                  <td style="padding:6px 0;color:#f4efe6;vertical-align:top;">${escapeHtml(
                    name
                  )}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#9a8f7d;vertical-align:top;">Phone</td>
                  <td style="padding:6px 0;color:#f4efe6;vertical-align:top;">${escapeHtml(
                    phone
                  )}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#9a8f7d;vertical-align:top;">Email</td>
                  <td style="padding:6px 0;color:#f4efe6;vertical-align:top;">${escapeHtml(
                    email
                  )}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#9a8f7d;vertical-align:top;">Project Type</td>
                  <td style="padding:6px 0;color:#f4efe6;vertical-align:top;">${escapeHtml(
                    projectTypeDisplay
                  )}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- PROJECT DETAILS -->
          <tr>
            <td style="padding:22px 32px 0 32px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9a8f7d;padding-bottom:8px;">Project Details</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#f4efe6;white-space:pre-wrap;">${escapeHtml(
                details
              )}</div>
            </td>
          </tr>
          <!-- ACTION -->
          <tr>
            <td style="padding:26px 32px 6px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#b8934a;">
                    <a href="mailto:${escapeHtml(
                      email
                    )}" style="display:inline-block;padding:13px 30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#14110d;text-decoration:none;">Reply to Customer</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- FOOTER DIVIDER -->
          <tr>
            <td style="padding:24px 32px 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="height:1px;background-color:#2e2820;font-size:0;line-height:0;">&nbsp;</td></tr></table>
            </td>
          </tr>
          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding:18px 32px 32px 32px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.75;color:#9a8f7d;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:15px;letter-spacing:1px;color:#c9a25b;">Emil&rsquo;s Renovations</div>
              <div>(925) 212-4048</div>
              <div>California Contractor License #851429</div>
              <div>www.emilsrenovations.com</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  // --- Customer confirmation email (separate send, to the visitor only) ---
  // Simpler, customer-facing, same brand palette. Reuses the SAME consultation
  // ID. Contains no internal recipient, no copy recipient, and no internal-only
  // details — only what's appropriate to confirm receipt.
  const customerSubject = `We received your request | ${consultationId} | Emil's Renovations`

  const customerText = [
    "EMIL'S RENOVATIONS",
    "Premium Home Transformation",
    "",
    "Thank you for contacting Emil's Renovations.",
    "",
    "We've received your consultation request and will be in touch shortly.",
    "",
    `Consultation Reference: ${consultationId}`,
    "",
    "Prefer to talk now?",
    "Call or text (925) 212-4048.",
    "",
    "--",
    "Emil's Renovations",
    "California Contractor License #851429",
    "www.emilsrenovations.com",
  ].join("\n")

  const customerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>We received your request</title>
</head>
<body style="margin:0;padding:0;background-color:#14110d;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#14110d;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#1c1813;border:1px solid #2e2820;">
          <!-- HEADER -->
          <tr>
            <td align="center" style="padding:34px 32px 22px 32px;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;letter-spacing:2px;color:#c9a25b;">EMIL&rsquo;S RENOVATIONS</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#9a8f7d;padding-top:8px;">Premium Home Transformation</div>
            </td>
          </tr>
          <!-- GOLD DIVIDER -->
          <tr>
            <td style="padding:0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="2" style="height:2px;background-color:#b8934a;font-size:0;line-height:0;">&nbsp;</td></tr></table>
            </td>
          </tr>
          <!-- MESSAGE -->
          <tr>
            <td style="padding:28px 32px 4px 32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;color:#f4efe6;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#f4efe6;padding-bottom:12px;">Thank you for contacting Emil&rsquo;s Renovations.</div>
              <div>We&rsquo;ve received your consultation request and will be in touch shortly.</div>
            </td>
          </tr>
          <!-- REFERENCE -->
          <tr>
            <td style="padding:20px 32px 0 32px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9a8f7d;padding-bottom:6px;">Consultation Reference</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;color:#c9a25b;"><strong>${escapeHtml(
                consultationId
              )}</strong></div>
            </td>
          </tr>
          <!-- CALL / TEXT -->
          <tr>
            <td style="padding:24px 32px 0 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#f4efe6;">
              <div style="color:#9a8f7d;">Prefer to talk now?</div>
              <div style="padding-top:2px;">Call or text <a href="tel:+19252124048" style="color:#c9a25b;text-decoration:none;font-weight:bold;">(925) 212-4048</a>.</div>
            </td>
          </tr>
          <!-- FOOTER DIVIDER -->
          <tr>
            <td style="padding:26px 32px 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="height:1px;background-color:#2e2820;font-size:0;line-height:0;">&nbsp;</td></tr></table>
            </td>
          </tr>
          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding:18px 32px 32px 32px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.75;color:#9a8f7d;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:15px;letter-spacing:1px;color:#c9a25b;">Emil&rsquo;s Renovations</div>
              <div>California Contractor License #851429</div>
              <div>www.emilsrenovations.com</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  // --- Not configured: preview success in dev, clear error in production ---
  if (!RESEND_API_KEY) {
    if (process.env.NODE_ENV !== "production") {
      // Preview mode for local design review: nothing is sent.
      return NextResponse.json({ ok: true, preview: true })
    }
    return NextResponse.json(
      { error: "Email delivery is not configured yet. Please call us instead." },
      { status: 503 }
    )
  }

  // --- Send via Resend ---
  // 1) Internal branded notification to Emil. The visitor's email stays as
  //    Reply-To, and CONTACT_COPY_EMAIL (if set) rides along as a BCC so the
  //    visible recipient list never exposes it.
  // 2) A separate customer confirmation to the visitor only.
  // Success is reported to the site ONLY after Resend accepts BOTH sends.
  try {
    const resend = new Resend(RESEND_API_KEY)

    const internal = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      bcc: COPY_EMAIL || undefined,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    })
    if (internal.error) {
      // Log the error type only — never submitted content, addresses, or keys.
      console.error(
        "[contact] Resend internal delivery error:",
        internal.error.name ?? "unknown"
      )
      return NextResponse.json(
        { error: "We couldn't send your message. Please call us instead." },
        { status: 502 }
      )
    }

    const confirmation = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: customerSubject,
      text: customerText,
      html: customerHtml,
    })
    if (confirmation.error) {
      // Log the error type only — never submitted content, addresses, or keys.
      console.error(
        "[contact] Resend confirmation delivery error:",
        confirmation.error.name ?? "unknown"
      )
      return NextResponse.json(
        { error: "We couldn't send your message. Please call us instead." },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    // Log the error type only — never submitted content, addresses, or keys.
    console.error(
      "[contact] Resend send threw:",
      err instanceof Error ? err.name : "unknown"
    )
    return NextResponse.json(
      { error: "Something went wrong. Please try again or call us." },
      { status: 500 }
    )
  }
}

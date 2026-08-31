"use client"

import { useEffect, useRef, useState } from "react"
import Eyebrow from "@/components/ui/Eyebrow"
import Icon from "@/components/ui/Icon"
import { business, contact, projectTypes } from "@/lib/content"

// Pre-filled SMS to Emil (standard "?body=" query form). The visitor must still
// press Send in their Messages app — the website never sends anything itself.
const SMS_HREF = `sms:+19252124048?body=${encodeURIComponent(
  "Hi Emil, I found Emil's Renovations online and would like to discuss a renovation project."
)}`

type Status = "idle" | "submitting" | "success" | "error"
type FieldErrors = Partial<Record<"name" | "phone" | "email" | "details", string>>

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const mountedAt = useRef(0)

  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === "submitting") return

    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email"),
      projectType: data.get("projectType"),
      details: data.get("details"),
      // Honeypot — neutral, non-semantic field name so browsers/password
      // managers won't autofill it (real users never see or fill it).
      contact_website: data.get("contact_website"),
      // Time on page, measured entirely on the CLIENT clock (a duration, not an
      // absolute timestamp) so client/server clock skew can't falsely flag a
      // real submission. Falls back to a large value if mount time is missing.
      elapsedMs: mountedAt.current ? Date.now() - mountedAt.current : 60000,
    }

    setStatus("submitting")
    setErrorMsg("")
    setFieldErrors({})

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus("success")
        form.reset() // clear only on success; failures keep the entered values
      } else {
        setStatus("error")
        setFieldErrors(result?.fields ?? {})
        setErrorMsg(
          result?.error ?? "We couldn't send your message. Please try again."
        )
      }
    } catch {
      setStatus("error")
      setErrorMsg("Network error — please check your connection and try again.")
    }
  }

  const describedBy = (field: keyof FieldErrors) =>
    fieldErrors[field] ? `${field}-error` : undefined

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container contact__card contact__grid">
        <div className="contact__intro">
          <Eyebrow as="p">{contact.eyebrow}</Eyebrow>
          <h2 id="contact-title" className="section__title">
            {contact.title}
          </h2>
          <p className="contact__body">{contact.body}</p>

          <dl className="contact__direct">
            <div className="contact__direct-item">
              <dt>Call</dt>
              <dd>
                <a href={business.phoneHref} className="contact__phone">
                  {business.phoneDisplay}
                </a>
              </dd>
            </div>
            <div className="contact__direct-item">
              <dt>{business.licenseLabel}</dt>
              <dd>{business.license}</dd>
            </div>
          </dl>

          <div className="contact__text-option">
            <h3 className="contact__text-title">Prefer to text?</h3>
            <p className="contact__text-body">
              Text Emil directly at{" "}
              <span className="contact__text-number">{business.phoneDisplay}</span>{" "}
              and tell us a little about your project.
            </p>
            <a
              href={SMS_HREF}
              className="btn btn--ghost contact__text-cta"
              aria-label={`Text Emil at ${business.phoneDisplay}`}
            >
              <Icon name="communication" className="contact__text-icon" />
              <span>Text Emil</span>
            </a>
          </div>
        </div>

        <div className="contact__panel">
          {status === "success" ? (
            <div className="contact__success" role="status" aria-live="polite">
              <span className="contact__success-mark" aria-hidden="true">
                &#10003;
              </span>
              <h3 className="contact__success-title">Thank you — request received.</h3>
              <p className="contact__success-body">
                We&rsquo;ll be in touch shortly. Prefer to talk now?{" "}
                <a href={business.phoneHref} className="contact__success-link">
                  Call
                </a>{" "}
                or{" "}
                <a href={SMS_HREF} className="contact__success-link">
                  text
                </a>{" "}
                {business.phoneDisplay}.
              </p>
            </div>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit} noValidate>
              {errorMsg && (
                <p className="contact__error-banner" role="alert">
                  {errorMsg}
                </p>
              )}

              {/* Honeypot: hidden from users, catches bots. The field name is
                  deliberately non-semantic so browsers/password managers don't
                  autofill it for real visitors. */}
              <div className="contact__hp" aria-hidden="true">
                <label htmlFor="contact_website">Website</label>
                <input
                  id="contact_website"
                  name="contact_website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-invalid={fieldErrors.name ? true : undefined}
                    aria-describedby={describedBy("name")}
                  />
                  {fieldErrors.name && (
                    <span id="name-error" className="field__error">
                      {fieldErrors.name}
                    </span>
                  )}
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    aria-invalid={fieldErrors.phone ? true : undefined}
                    aria-describedby={describedBy("phone")}
                  />
                  {fieldErrors.phone && (
                    <span id="phone-error" className="field__error">
                      {fieldErrors.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-invalid={fieldErrors.email ? true : undefined}
                  aria-describedby={describedBy("email")}
                />
                {fieldErrors.email && (
                  <span id="email-error" className="field__error">
                    {fieldErrors.email}
                  </span>
                )}
              </div>

              <div className="field">
                <label htmlFor="projectType">
                  Project type <span className="field__optional">(optional)</span>
                </label>
                <select id="projectType" name="projectType" defaultValue="">
                  <option value="">Select a project type</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="details">Project details</label>
                <textarea
                  id="details"
                  name="details"
                  rows={4}
                  required
                  aria-invalid={fieldErrors.details ? true : undefined}
                  aria-describedby={describedBy("details")}
                />
                {fieldErrors.details && (
                  <span id="details-error" className="field__error">
                    {fieldErrors.details}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn--gold contact__submit"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Sending…" : "Request a Consultation"}
              </button>

              <p className="contact__form-note">
                We&rsquo;ll only use your details to respond to your inquiry.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

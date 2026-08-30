"use client"

import { useEffect, useRef, useState } from "react"
import Eyebrow from "@/components/ui/Eyebrow"
import { business, contact, projectTypes } from "@/lib/content"

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
      company: data.get("company"), // honeypot
      renderedAt: mountedAt.current,
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
        </div>

        <div className="contact__panel">
          {status === "success" ? (
            <div className="contact__success" role="status" aria-live="polite">
              <span className="contact__success-mark" aria-hidden="true">
                &#10003;
              </span>
              <h3 className="contact__success-title">Thank you — request received.</h3>
              <p className="contact__success-body">
                We&rsquo;ll be in touch shortly. Prefer to talk now? Call{" "}
                <a href={business.phoneHref} className="contact__success-link">
                  {business.phoneDisplay}
                </a>
                .
              </p>
            </div>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit} noValidate>
              {errorMsg && (
                <p className="contact__error-banner" role="alert">
                  {errorMsg}
                </p>
              )}

              {/* Honeypot: hidden from users, catches bots. */}
              <div className="contact__hp" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
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

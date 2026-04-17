"use client";

import { MailOutlined, PhoneOutlined, SendOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { SITE_TEXT } from "../../constants/siteText";

const { contact, contactPage, footer } = SITE_TEXT;

const ContactPage = () => {
  const recaptchaRef = useRef(null);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <section className="contact-page" aria-label={contactPage.ariaLabel}>
      <div
        className="contact-hero"
        style={{ backgroundImage: `url(${contactPage.heroImage})` }}
      >
        <div className="contact-hero-overlay" />
        <div className="container contact-hero-inner">
          <h1>{contactPage.heroTitle}</h1>
        </div>
      </div>

      <div className="contact-info-section">
        <div className="container contact-info-grid">
          <article className="contact-info-card">
            <PhoneOutlined className="contact-info-icon" aria-hidden="true" />
            <h2>{contactPage.phoneTitle}</h2>
            <p>{contactPage.phoneDescription}</p>
            <ul>
              <li>Landline: {footer.landline}</li>
              <li>Mobile: {footer.mobile}</li>
            </ul>
          </article>

          <article className="contact-info-card">
            <MailOutlined className="contact-info-icon" aria-hidden="true" />
            <h2>{contactPage.emailTitle}</h2>
            <p>{contactPage.emailDescription}</p>
            <ul className="contact-email-list">
              {footer.emails.map((email) => (
                <li key={email}>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              ))}
            </ul>
          </article>

          <article className="contact-info-card">
            <SendOutlined className="contact-info-icon" aria-hidden="true" />
            <h2>{contactPage.locationTitle}</h2>
            <p>
              <strong>Main Office:</strong>
            </p>
            <p>{contact.addressFull}, Philippines</p>
            <a
              href={contactPage.locationMapUrl}
              target="_blank"
              rel="noreferrer"
              className="contact-map-link"
            >
              {contactPage.locationMapLabel}
            </a>
          </article>
        </div>
      </div>

      <div className="contact-form-section">
        <div className="container contact-form-wrap">
          <header className="contact-form-header">
            <h2>{contactPage.formTitle}</h2>
            <p>{contactPage.formSubtitle}</p>
            <span aria-hidden="true" />
          </header>

          <form
            className="contact-form"
            onSubmit={async (event) => {
              event.preventDefault();
              setStatus({ type: "", message: "" });

              if (recaptchaSiteKey && !captchaToken) {
                setCaptchaError("Please verify that you are not a robot.");
                return;
              }

              setCaptchaError("");
              setIsSubmitting(true);

              const formData = new FormData(event.currentTarget);
              const payload = {
                name: formData.get("name"),
                email: formData.get("email"),
                subject: formData.get("subject"),
                message: formData.get("message"),
                recaptchaToken: captchaToken,
              };

              try {
                const response = await fetch("/api/contact", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
                });

                const result = await response.json();

                if (!response.ok) {
                  setStatus({
                    type: "error",
                    message: result.error || "Unable to submit the form.",
                  });
                  return;
                }

                setStatus({
                  type: "success",
                  message: result.message,
                });
                event.currentTarget.reset();
                recaptchaRef.current?.reset();
                setCaptchaToken("");
              } catch {
                setStatus({
                  type: "error",
                  message: "Unable to submit the form right now.",
                });
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <label>
              <span>{contactPage.fields.name}</span>
              <input type="text" name="name" required />
            </label>

            <label>
              <span>{contactPage.fields.email}</span>
              <input type="email" name="email" required />
            </label>

            <label>
              <span>{contactPage.fields.subject}</span>
              <input type="text" name="subject" />
            </label>

            <label>
              <span>{contactPage.fields.message}</span>
              <textarea name="message" rows={6} required />
            </label>

            <div className="contact-recaptcha-wrap">
              {recaptchaSiteKey ? (
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={recaptchaSiteKey}
                  onChange={(token) => {
                    setCaptchaToken(token || "");
                    if (token) {
                      setCaptchaError("");
                    }
                  }}
                />
              ) : (
                <p className="contact-recaptcha-missing">
                  Missing reCAPTCHA site key. Set{" "}
                  <strong>NEXT_PUBLIC_RECAPTCHA_SITE_KEY</strong> in your .env
                  file.
                </p>
              )}
            </div>

            {captchaError ? (
              <p className="contact-form-error" role="alert">
                {captchaError}
              </p>
            ) : null}

            {status.message ? (
              <p
                className={
                  status.type === "success"
                    ? "contact-form-success"
                    : "contact-form-error"
                }
                role="status"
              >
                {status.message}
              </p>
            ) : null}

            <button
              type="submit"
              className="contact-form-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "SENDING..." : contactPage.submitLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;

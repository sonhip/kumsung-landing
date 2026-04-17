import { MailOutlined, PhoneOutlined, SendOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { SITE_TEXT } from "../../constants/siteText";

const { contact, contactPage, footer } = SITE_TEXT;

const ContactPage = () => {
  const recaptchaRef = useRef(null);
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState("");

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
            onSubmit={(event) => {
              event.preventDefault();

              if (!captchaToken) {
                setCaptchaError("Please verify that you are not a robot.");
                return;
              }

              setCaptchaError("");
              event.currentTarget.reset();
              recaptchaRef.current?.reset();
              setCaptchaToken("");
            }}
          >
            <label>
              <span>{contactPage.fields.name}</span>
              <input type="text" name="name" />
            </label>

            <label>
              <span>{contactPage.fields.email}</span>
              <input type="email" name="email" />
            </label>

            <label>
              <span>{contactPage.fields.subject}</span>
              <input type="text" name="subject" />
            </label>

            <label>
              <span>{contactPage.fields.message}</span>
              <textarea name="message" rows={6} />
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
                  <strong>VITE_RECAPTCHA_SITE_KEY</strong> in your .env file.
                </p>
              )}
            </div>

            {captchaError ? (
              <p className="contact-form-error" role="alert">
                {captchaError}
              </p>
            ) : null}

            <button type="submit" className="contact-form-submit">
              {contactPage.submitLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;

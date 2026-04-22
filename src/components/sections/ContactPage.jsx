"use client";

import { MailOutlined, PhoneOutlined, SendOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const defaultContactPageContent = {
  ariaLabel: "Trang liên hệ",
  heroTitle: "",
  heroImage: "",
  phoneTitle: "Điện thoại",
  phoneDescription: "",
  emailTitle: "Email",
  emailDescription: "",
  locationTitle: "Địa chỉ",
  locationMapLabel: "Xem trên Google Maps",
  locationMapUrl: "https://maps.google.com",
  formTitle: "",
  formSubtitle: "",
  fields: {
    name: "Họ và tên",
    email: "Email",
    subject: "Chủ đề",
    message: "Nội dung",
  },
  submitLabel: "Gửi liên hệ",
};

const ContactPage = ({
  contact,
  contactPageContent = defaultContactPageContent,
}) => {
  const contactPage = contactPageContent;
  const resolvedMapUrl = contact?.googleMapUrl || contactPage.locationMapUrl;
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
              <li>Điện thoại: {contact.phone}</li>
              <li>Giờ làm việc: {contact.hours}</li>
            </ul>
          </article>

          <article className="contact-info-card">
            <MailOutlined className="contact-info-icon" aria-hidden="true" />
            <h2>{contactPage.emailTitle}</h2>
            <p>{contactPage.emailDescription}</p>
            <ul className="contact-email-list">
              <li>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
            </ul>
          </article>

          <article className="contact-info-card">
            <SendOutlined className="contact-info-icon" aria-hidden="true" />
            <h2>{contactPage.locationTitle}</h2>
            <p>
              <strong>Địa chỉ:</strong>
            </p>
            <p>{contact.addressFull}</p>
            <a
              href={resolvedMapUrl}
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
                setCaptchaError("Vui lòng xác nhận reCAPTCHA trước khi gửi.");
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
                    message: result.error || "Không thể gửi biểu mẫu.",
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
                  message: "Không thể gửi biểu mẫu vào lúc này.",
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
                  Chưa cấu hình khóa reCAPTCHA. Hãy thiết lập{" "}
                  <strong>NEXT_PUBLIC_RECAPTCHA_SITE_KEY</strong> trong file môi
                  trường.
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
              {isSubmitting ? "ĐANG GỬI..." : contactPage.submitLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;

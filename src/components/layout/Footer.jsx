"use client";

import {
  MailOutlined,
  MobileOutlined,
  PhoneOutlined,
  PushpinFilled,
} from "@ant-design/icons";
import { SITE_TEXT } from "../../constants/siteText";

const { company, footer } = SITE_TEXT;

const currentYear = new Date().getFullYear();

const copyrightYearRange =
  footer.copyrightStartYear && footer.copyrightStartYear < currentYear
    ? `${footer.copyrightStartYear}-${currentYear}`
    : `${currentYear}`;

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-contact-wrap">
        <h4>{footer.contactInfoTitle}</h4>

        <ul className="footer-office-list">
          {footer.officeLocations.map((office) => (
            <li key={office.label}>
              <PushpinFilled className="footer-icon" aria-hidden="true" />
              <p>
                <strong>{office.label}:</strong> {office.address}
              </p>
            </li>
          ))}
        </ul>

        <ul className="footer-contact-list">
          <li>
            <PhoneOutlined className="footer-icon" aria-hidden="true" />
            <span>{footer.landline}</span>
          </li>
          <li>
            <MobileOutlined className="footer-icon" aria-hidden="true" />
            <span>{footer.mobile}</span>
          </li>
          <li>
            <MailOutlined className="footer-icon" aria-hidden="true" />
            <span>{footer.emails.join(" | ")}</span>
          </li>
        </ul>
      </div>

      <div className="footer-bottom">
        Copyright © {copyrightYearRange} {company.name}, {footer.rightsText}
      </div>

      <button
        type="button"
        className="footer-scroll-top"
        aria-label="Scroll to top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      >
        ^
      </button>
    </footer>
  );
};

export default Footer;

"use client";

import {
  ClockCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  PushpinFilled,
} from "@ant-design/icons";
import { SITE_TEXT } from "../../constants/siteText";

const { footer } = SITE_TEXT;

const currentYear = new Date().getFullYear();

const copyrightYearRange =
  footer.copyrightStartYear && footer.copyrightStartYear < currentYear
    ? `${footer.copyrightStartYear}-${currentYear}`
    : `${currentYear}`;

const Footer = ({
  company = SITE_TEXT.company,
  contact = SITE_TEXT.contact,
}) => {
  return (
    <footer className="site-footer">
      <div className="container footer-contact-wrap">
        <h4>{footer.contactInfoTitle}</h4>

        <ul className="footer-office-list">
          {[{ label: "Khu vực hoạt động", address: contact.addressFull }].map(
            (office) => (
              <li key={office.label}>
                <PushpinFilled className="footer-icon" aria-hidden="true" />
                <p>
                  <strong>{office.label}:</strong> {office.address}
                </p>
              </li>
            ),
          )}
        </ul>

        <ul className="footer-contact-list">
          <li>
            <PhoneOutlined className="footer-icon" aria-hidden="true" />
            <span>{contact.phone}</span>
          </li>
          <li>
            <ClockCircleOutlined className="footer-icon" aria-hidden="true" />
            <span>{contact.hours}</span>
          </li>
          <li>
            <MailOutlined className="footer-icon" aria-hidden="true" />
            <span>{contact.email}</span>
          </li>
        </ul>
      </div>

      <div className="footer-bottom">
        Bản quyền © {copyrightYearRange} {company.name}. {footer.rightsText}
      </div>

      <button
        type="button"
        className="footer-scroll-top"
        aria-label="Cuộn lên đầu trang"
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

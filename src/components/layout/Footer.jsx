"use client";

import {
  ClockCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  PushpinFilled,
} from "@ant-design/icons";
const defaultFooterContent = {
  contactInfoTitle: "Thông Tin Liên Hệ",
  copyrightStartYear: new Date().getFullYear(),
  rightsText: "Bảo lưu mọi quyền.",
};

const Footer = ({ company, contact, footerContent = defaultFooterContent }) => {
  const currentYear = new Date().getFullYear();
  const copyrightYearRange =
    footerContent.copyrightStartYear &&
    footerContent.copyrightStartYear < currentYear
      ? `${footerContent.copyrightStartYear}-${currentYear}`
      : `${currentYear}`;

  return (
    <footer className="site-footer">
      <div className="container footer-contact-wrap">
        <h4>{footerContent.contactInfoTitle}</h4>

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
        Bản quyền © {copyrightYearRange} {company.name}.{" "}
        {footerContent.rightsText}
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

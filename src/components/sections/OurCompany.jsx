"use client";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRef } from "react";
import { SITE_TEXT } from "../../constants/siteText";

const { companyProfile } = SITE_TEXT;

const OurCompany = () => {
  const partnersRef = useRef(null);
  const scrollPartners = [
    ...companyProfile.partners,
    ...companyProfile.partners,
  ];

  const scrollByDirection = (direction) => {
    const container = partnersRef.current;
    if (!container) return;

    const firstCard = container.querySelector(".company-partner-card");
    const cardWidth = firstCard ? firstCard.clientWidth : 300;
    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;

    container.scrollBy({
      left: direction * (cardWidth + gap) * 2,
      behavior: "smooth",
    });
  };

  return (
    <section className="company-profile" aria-label={companyProfile.ariaLabel}>
      <div className="container company-profile-top">
        <div className="company-profile-title-wrap">
          <h2>{companyProfile.title}</h2>
          <span className="company-profile-underline" aria-hidden="true" />
        </div>
        <p>{companyProfile.description}</p>
      </div>

      <div className="company-partners-carousel">
        <button
          type="button"
          className="company-partners-nav company-partners-nav-prev"
          aria-label="Previous partner logos"
          onClick={() => scrollByDirection(-1)}
        >
          <LeftOutlined />
        </button>

        <div
          className="company-partners-grid"
          aria-label="Partner brands"
          ref={partnersRef}
        >
          {scrollPartners.map((partner, index) => (
            <article
              key={`${partner.name}-${index}`}
              className="company-partner-card"
            >
              <img src={partner.logo} alt={partner.name} loading="lazy" />
            </article>
          ))}
        </div>

        <button
          type="button"
          className="company-partners-nav company-partners-nav-next"
          aria-label="Next partner logos"
          onClick={() => scrollByDirection(1)}
        >
          <RightOutlined />
        </button>
      </div>
    </section>
  );
};

export default OurCompany;

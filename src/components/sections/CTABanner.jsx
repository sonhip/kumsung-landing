"use client";

import { Button } from "antd";
import Link from "next/link";

const defaultCtaContent = {
  ariaLabel: "Khối kêu gọi hành động",
  title: "",
  description: "",
  buttonLabel: "Liên hệ",
};

const CTABanner = ({ ctaContent = defaultCtaContent }) => {
  const cta = ctaContent;
  return (
    <section className="cta-banner" aria-label={cta.ariaLabel}>
      <div className="container cta-inner">
        <div>
          <h2>{cta.title}</h2>
          {cta.description ? <p>{cta.description}</p> : null}
        </div>
        <Link href="/contact">
          <Button
            type="primary"
            className="quote-btn cta-career-btn"
            size="large"
            aria-label={cta.buttonLabel}
          >
            {cta.buttonLabel}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTABanner;

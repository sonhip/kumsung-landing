import { Button } from "antd";
import { SITE_TEXT } from "../../constants/siteText";

const { cta, company } = SITE_TEXT;

const CTABanner = () => {
  return (
    <section className="cta-banner" aria-label={cta.ariaLabel}>
      <div className="container cta-inner">
        <div>
          <h2>{cta.title}</h2>
          <p>{cta.description}</p>
        </div>
        <Button
          type="primary"
          className="quote-btn"
          size="large"
          aria-label="Get a quote"
        >
          {company.quoteButton}
        </Button>
      </div>
    </section>
  );
};

export default CTABanner;

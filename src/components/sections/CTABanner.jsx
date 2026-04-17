import { Button } from "antd";
import { Link } from "react-router-dom";
import { SITE_TEXT } from "../../constants/siteText";

const { cta } = SITE_TEXT;

const CTABanner = () => {
  return (
    <section className="cta-banner" aria-label={cta.ariaLabel}>
      <div className="container cta-inner">
        <div>
          <h2>{cta.title}</h2>
          {cta.description ? <p>{cta.description}</p> : null}
        </div>
        <Link to="/contact">
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

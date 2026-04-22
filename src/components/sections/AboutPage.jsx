import AnimatedCounter from "../ui/AnimatedCounter";

const defaultAboutPageContent = {
  ariaLabel: "Trang giới thiệu",
  heroTitle: "",
  heroImage: "",
  companyTitle: "",
  companyName: "",
  description: "",
  milestonesTitle: "",
  milestonesHighlight: "",
  milestonesSubtitle: "",
  milestonesImage: "",
  milestones: [],
  teamTitle: "",
};

const AboutPage = ({ aboutPageContent = defaultAboutPageContent }) => {
  const aboutPage = aboutPageContent;
  return (
    <section className="about-page" aria-label={aboutPage.ariaLabel}>
      <div
        className="about-hero"
        style={{ backgroundImage: `url(${aboutPage.heroImage})` }}
      >
        <div className="about-hero-overlay" />
        <div className="container about-hero-inner">
          <h1>{aboutPage.heroTitle}</h1>
        </div>
      </div>

      <div className="about-company-section">
        <div className="container about-company-content">
          <h2>{aboutPage.companyTitle}</h2>
          <p className="about-company-name">{aboutPage.companyName}</p>
          <p className="about-company-description">{aboutPage.description}</p>
        </div>
      </div>

      <div
        className="about-milestones"
        style={{ backgroundImage: `url(${aboutPage.milestonesImage})` }}
      >
        <div className="about-milestones-overlay" />
        <div className="container about-milestones-content">
          <h2>
            {aboutPage.milestonesTitle}{" "}
            <span>{aboutPage.milestonesHighlight}</span>
          </h2>
          <p>{aboutPage.milestonesSubtitle}</p>

          <div className="about-milestones-grid">
            {aboutPage.milestones.map((item) => (
              <article key={item.label} className="about-milestone-item">
                <AnimatedCounter
                  end={item.value}
                  suffix={item.suffix}
                  label={item.label}
                />
              </article>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default AboutPage;

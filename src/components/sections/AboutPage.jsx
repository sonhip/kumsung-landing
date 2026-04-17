import { SITE_TEXT } from "../../constants/siteText";
import AnimatedCounter from "../ui/AnimatedCounter";

const { aboutPage } = SITE_TEXT;

const AboutPage = () => {
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

      <div className="about-team-section">
        <div className="container">
          <h2>{aboutPage.teamTitle}</h2>

          <div className="about-team-grid">
            {aboutPage.teamMembers.map((member) => (
              <article key={member.name} className="about-team-card">
                <img src={member.image} alt={member.name} loading="lazy" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;

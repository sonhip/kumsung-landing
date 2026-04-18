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

const AboutPage = ({ aboutPageContent = defaultAboutPageContent, teamMembers = [] }) => {
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

      <div className="about-team-section">
        <div className="container">
          <h2>{aboutPage.teamTitle || "Gặp gỡ chúng tôi"}</h2>

          <div className="about-team-grid">
            {teamMembers.length ? teamMembers.map((member) => (
              <article key={member.id} className="about-team-card">
                {member.imageUrl ? (
                  <img src={member.imageUrl} alt={member.fullName} loading="lazy" />
                ) : (
                  <div className="about-team-placeholder">TV</div>
                )}
                <div className="about-team-card-content">
                  <h3>{member.fullName}</h3>
                  {member.role ? <p className="about-team-role">{member.role}</p> : null}
                  {member.bio ? <p className="about-team-bio">{member.bio}</p> : null}
                  <div className="about-team-contact">
                    {member.email ? (
                      <a href={`mailto:${member.email}`}>{member.email}</a>
                    ) : null}
                    {member.phone ? <span>{member.phone}</span> : null}
                  </div>
                </div>
              </article>
            )) : (
              <div className="about-team-empty">Danh sách thành viên đang được cập nhật.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;

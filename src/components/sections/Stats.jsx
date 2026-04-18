import Link from "next/link";
import {
  CheckCircleOutlined,
  CustomerServiceOutlined,
  ShoppingOutlined,
  ToolOutlined,
} from "@ant-design/icons";
const defaultStatsContent = {
  ariaLabel: "Điểm mạnh của doanh nghiệp",
  highlights: [],
  serviceMark: "",
  services: [],
  contactCta: "Liên hệ",
};
const serviceIcons = [ShoppingOutlined, ToolOutlined, CustomerServiceOutlined];

const Stats = ({ statsContent = defaultStatsContent, highlights = [] }) => {
  const stats = statsContent;
  return (
    <section className="stats-section" aria-label={stats.ariaLabel}>
      <div className="stats-highlights">
        {highlights.map((item) => (
          <article key={item.title} className="highlight-card">
            <img src={item.image} alt={item.title} loading="lazy" />
            <div className="highlight-overlay" />
            <div className="highlight-content">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="stats-services-wrap">
        <div className="stats-service-mark" aria-hidden="true">
          {stats.serviceMark}
        </div>
        <div className="container stats-services-grid">
          {stats.services.map((item, index) => {
            const Icon = serviceIcons[index] ?? ShoppingOutlined;

            return (
              <article key={item.title} className="stats-service-item">
                <Icon className="stats-service-icon" aria-hidden="true" />
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <Link href="/contact" className="stats-service-link">
                  {stats.contactCta} <CheckCircleOutlined />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;

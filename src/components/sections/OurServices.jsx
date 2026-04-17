import { SITE_TEXT } from "../../constants/siteText";

const { services } = SITE_TEXT;

const OurServices = ({ tiles = services.tiles }) => {
  return (
    <section className="services-section" aria-label={services.ariaLabel}>
      <div className="services-heading">
        <div className="container">
          <h2>{services.title}</h2>
        </div>
      </div>

      <div className="services-grid">
        {tiles.map((tile, index) => {
          if (tile.type === "image") {
            return (
              <article
                key={`${tile.image}-${index}`}
                className="service-tile service-image"
              >
                <img src={tile.image} alt={tile.alt} loading="lazy" />
              </article>
            );
          }

          return (
            <article
              key={`${tile.title}-${index}`}
              className={`service-tile service-content ${tile.tone === "gold" ? "is-gold" : "is-dark"}`}
            >
              <img
                className="service-content-bg"
                src={tile.image}
                alt=""
                loading="lazy"
              />
              <div className="service-content-layer" />
              <div className="service-content-copy">
                <h3>{tile.title}</h3>
                <p>{tile.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default OurServices;

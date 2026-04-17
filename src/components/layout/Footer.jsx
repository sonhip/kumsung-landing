import { Link } from "react-router-dom";
import { SITE_TEXT } from "../../constants/siteText";

const { company, footer, contact } = SITE_TEXT;

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3 className="footer-brand">{company.name}</h3>
          <p>{footer.description}</p>
        </div>

        <div>
          <h4>{footer.quickLinksTitle}</h4>
          <ul>
            {footer.quickLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>{footer.productsTitle}</h4>
          <ul>
            {footer.productItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4>{footer.contactTitle}</h4>
          <ul>
            <li>{contact.phone}</li>
            <li>{contact.email}</li>
            <li>{contact.addressShort}</li>
            <li>{contact.hours}</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} {company.name} {footer.rightsText}
      </div>
    </footer>
  );
};

export default Footer;

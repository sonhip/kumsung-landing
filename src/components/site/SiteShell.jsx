import Footer from "../layout/Footer";
import Header from "../layout/Header";
import TopBar from "../layout/TopBar";

export default function SiteShell({
  children,
  brandLogo = null,
  siteSettings,
  siteContent,
}) {
  return (
    <div className="page-shell">
      <TopBar contact={siteSettings.contact} />
      <Header
        brandLogo={brandLogo}
        company={siteSettings.company}
        nav={siteContent.nav}
      />
      <main>{children}</main>
      <Footer
        company={siteSettings.company}
        contact={siteSettings.contact}
        footerContent={siteContent.footer}
      />
    </div>
  );
}

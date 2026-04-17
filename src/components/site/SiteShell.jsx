import Footer from "../layout/Footer";
import Header from "../layout/Header";
import TopBar from "../layout/TopBar";

export default function SiteShell({
  children,
  brandLogo = null,
  siteSettings,
}) {
  return (
    <div className="page-shell">
      <TopBar contact={siteSettings.contact} />
      <Header brandLogo={brandLogo} company={siteSettings.company} />
      <main>{children}</main>
      <Footer company={siteSettings.company} contact={siteSettings.contact} />
    </div>
  );
}

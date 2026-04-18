import ContactPage from "../../src/components/sections/ContactPage";
import SiteShell from "../../src/components/site/SiteShell";
import {
  getBrandLogo,
  getSiteContent,
  getSiteSettings,
} from "../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function Contact() {
  const [brandLogo, siteSettings, siteContent] = await Promise.all([
    getBrandLogo(),
    getSiteSettings(),
    getSiteContent(),
  ]);

  return (
    <SiteShell
      brandLogo={brandLogo}
      siteSettings={siteSettings}
      siteContent={siteContent}
    >
      <ContactPage
        contact={siteSettings.contact}
        contactPageContent={siteContent.contactPage}
      />
    </SiteShell>
  );
}

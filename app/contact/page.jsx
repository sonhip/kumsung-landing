import ContactPage from "../../src/components/sections/ContactPage";
import SiteShell from "../../src/components/site/SiteShell";
import { getBrandLogo, getSiteSettings } from "../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function Contact() {
  const [brandLogo, siteSettings] = await Promise.all([
    getBrandLogo(),
    getSiteSettings(),
  ]);

  return (
    <SiteShell brandLogo={brandLogo} siteSettings={siteSettings}>
      <ContactPage contact={siteSettings.contact} />
    </SiteShell>
  );
}

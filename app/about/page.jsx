import AboutPage from "../../src/components/sections/AboutPage";
import SiteShell from "../../src/components/site/SiteShell";
import {
  getBrandLogo,
  getSiteContent,
  getSiteSettings,
} from "../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function About() {
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
      <AboutPage aboutPageContent={siteContent.aboutPage} />
    </SiteShell>
  );
}

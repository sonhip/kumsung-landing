import AboutPage from "../../src/components/sections/AboutPage";
import SiteShell from "../../src/components/site/SiteShell";
import { getBrandLogo, getSiteSettings } from "../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function About() {
  const [brandLogo, siteSettings] = await Promise.all([
    getBrandLogo(),
    getSiteSettings(),
  ]);

  return (
    <SiteShell brandLogo={brandLogo} siteSettings={siteSettings}>
      <AboutPage />
    </SiteShell>
  );
}

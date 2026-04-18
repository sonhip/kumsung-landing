import AboutPage from "../../src/components/sections/AboutPage";
import SiteShell from "../../src/components/site/SiteShell";
import {
  getBrandLogo,
  getSiteContent,
  getSiteSettings,
  getPublicTeamMembers,
} from "../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function About() {
  const [brandLogo, siteSettings, siteContent, teamMembers] = await Promise.all([
    getBrandLogo(),
    getSiteSettings(),
    getSiteContent(),
    getPublicTeamMembers(),
  ]);

  return (
    <SiteShell
      brandLogo={brandLogo}
      siteSettings={siteSettings}
      siteContent={siteContent}
    >
      <AboutPage aboutPageContent={siteContent.aboutPage} teamMembers={teamMembers} />
    </SiteShell>
  );
}

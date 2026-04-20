import AboutPage from "../../src/components/sections/AboutPage";
import SiteShell from "../../src/components/site/SiteShell";
import {
  getBrandLogo,
  getSiteContent,
  getSiteSettings,
  getPublicTeamMembers,
} from "../../src/lib/cms";
import { buildPageMetadata } from "../../src/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const [siteSettings, siteContent] = await Promise.all([
    getSiteSettings(),
    getSiteContent(),
  ]);

  const companyName = siteSettings.company.shortName || "Tân Việt";
  const title = `Giới thiệu ${companyName}`;
  const description =
    siteContent.aboutPage?.description ||
    "Thông tin doanh nghiệp, năng lực và đội ngũ của Tân Việt.";
  const image =
    siteContent.aboutPage?.heroImage ||
    siteContent.aboutPage?.milestonesImage ||
    "/uploads/seed/hero-warehouse.jpg";

  return buildPageMetadata({
    title,
    description,
    path: "/about",
    images: [image],
    keywords: ["giới thiệu tân việt", "năng lực doanh nghiệp", "đội ngũ tân việt"],
  });
}

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

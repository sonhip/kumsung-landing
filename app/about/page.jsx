import AboutPage from "../../src/components/sections/AboutPage";
import SiteShell from "../../src/components/site/SiteShell";
import {
  getBrandLogo,
  getSiteContent,
  getSiteSettings,
} from "../../src/lib/cms";
import { buildPageMetadata, resolveSeoFallbackImage } from "../../src/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const [siteSettings, siteContent] = await Promise.all([
    getSiteSettings(),
    getSiteContent(),
  ]);

  const companyName = siteSettings.company.shortName || "Tân Việt";
  const fallbackImage = resolveSeoFallbackImage(siteSettings);
  const title = `Giới thiệu ${companyName}`;
  const description =
    siteContent.aboutPage?.description ||
    "Thông tin doanh nghiệp, năng lực và đội ngũ của Tân Việt.";
  const image =
    siteContent.aboutPage?.heroImage ||
    siteContent.aboutPage?.milestonesImage;

  return buildPageMetadata({
    title,
    description,
    path: "/about",
    images: [image],
    fallbackImage,
    keywords: ["giới thiệu tân việt", "năng lực doanh nghiệp", "đội ngũ tân việt"],
  });
}

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

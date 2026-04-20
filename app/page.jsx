import CTABanner from "../src/components/sections/CTABanner";
import Hero from "../src/components/sections/Hero";
import OurCompany from "../src/components/sections/OurCompany";
import OurServices from "../src/components/sections/OurServices";
import PreviousWorks from "../src/components/sections/PreviousWorks";
import Stats from "../src/components/sections/Stats";
import SiteShell from "../src/components/site/SiteShell";
import {
  getBrandLogo,
  getHomepageMedia,
  getSiteContent,
  getSiteSettings,
} from "../src/lib/cms";
import ScrollReveal from "../src/components/ui/ScrollReveal";
import { buildPageMetadata } from "../src/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const [siteSettings, siteContent] = await Promise.all([
    getSiteSettings(),
    getSiteContent(),
  ]);

  const companyName = siteSettings.company.shortName || "Tân Việt";
  const title = `${companyName} - Giải pháp điện lạnh`;
  const description =
    siteContent.hero?.subtitle ||
    "Đơn vị phân phối thiết bị điện lạnh, tư vấn giải pháp tối ưu cho doanh nghiệp và công trình tại Việt Nam.";
  const heroImage =
    siteContent.hero?.backgroundImages?.[0] ||
    "/uploads/seed/hero-warehouse.jpg";

  return buildPageMetadata({
    title,
    description,
    path: "/",
    images: [heroImage],
    keywords: [
      "thiết bị điện lạnh",
      "máy nén lạnh",
      "dàn nóng dàn lạnh",
      "tanvietref",
      "tân việt",
    ],
  });
}

export default async function HomePage() {
  const [brandLogo, homepageMedia, siteSettings, siteContent] =
    await Promise.all([
      getBrandLogo(),
      getHomepageMedia(),
      getSiteSettings(),
      getSiteContent(),
    ]);

  return (
    <SiteShell
      brandLogo={brandLogo}
      siteSettings={siteSettings}
      siteContent={siteContent}
    >
      <Hero
        heroContent={siteContent.hero}
        backgroundImages={
          homepageMedia.heroSlides.length
            ? homepageMedia.heroSlides
            : siteContent.hero.backgroundImages
        }
      />
      <ScrollReveal>
        <Stats
          statsContent={siteContent.stats}
          highlights={
            homepageMedia.statsHighlights.length
              ? homepageMedia.statsHighlights
              : siteContent.stats.highlights
          }
        />
      </ScrollReveal>
      <ScrollReveal>
        <PreviousWorks
          previousWorksContent={siteContent.previousWorks}
          items={
            homepageMedia.previousWorks.length
              ? homepageMedia.previousWorks
              : siteContent.previousWorks.items
          }
        />
      </ScrollReveal>
      <ScrollReveal>
        <OurServices
          servicesContent={siteContent.services}
          tiles={
            homepageMedia.serviceTiles.length
              ? homepageMedia.serviceTiles
              : siteContent.services.tiles
          }
        />
      </ScrollReveal>
      <ScrollReveal>
        <OurCompany
          companyProfileContent={siteContent.companyProfile}
          partners={
            homepageMedia.partnerLogos.length
              ? homepageMedia.partnerLogos
              : siteContent.companyProfile.partners
          }
        />
      </ScrollReveal>
      <ScrollReveal>
        <CTABanner ctaContent={siteContent.cta} />
      </ScrollReveal>
    </SiteShell>
  );
}

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

export const dynamic = "force-dynamic";

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

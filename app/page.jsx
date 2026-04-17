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
  getSiteSettings,
} from "../src/lib/cms";
import ScrollReveal from "../src/components/ui/ScrollReveal";
import { SITE_TEXT } from "../src/constants/siteText";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [brandLogo, homepageMedia, siteSettings] = await Promise.all([
    getBrandLogo(),
    getHomepageMedia(),
    getSiteSettings(),
  ]);

  return (
    <SiteShell brandLogo={brandLogo} siteSettings={siteSettings}>
      <Hero
        backgroundImages={
          homepageMedia.heroSlides.length
            ? homepageMedia.heroSlides
            : SITE_TEXT.hero.backgroundImages
        }
      />
      <ScrollReveal>
        <Stats
          highlights={
            homepageMedia.statsHighlights.length
              ? homepageMedia.statsHighlights
              : SITE_TEXT.stats.highlights
          }
        />
      </ScrollReveal>
      <ScrollReveal>
        <PreviousWorks
          items={
            homepageMedia.previousWorks.length
              ? homepageMedia.previousWorks
              : SITE_TEXT.previousWorks.items
          }
        />
      </ScrollReveal>
      <ScrollReveal>
        <OurServices
          tiles={
            homepageMedia.serviceTiles.length
              ? homepageMedia.serviceTiles
              : SITE_TEXT.services.tiles
          }
        />
      </ScrollReveal>
      <ScrollReveal>
        <OurCompany
          partners={
            homepageMedia.partnerLogos.length
              ? homepageMedia.partnerLogos
              : SITE_TEXT.companyProfile.partners
          }
        />
      </ScrollReveal>
      <ScrollReveal>
        <CTABanner />
      </ScrollReveal>
    </SiteShell>
  );
}

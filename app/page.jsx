import CTABanner from "../src/components/sections/CTABanner";
import Hero from "../src/components/sections/Hero";
import OurCompany from "../src/components/sections/OurCompany";
import OurServices from "../src/components/sections/OurServices";
import PreviousWorks from "../src/components/sections/PreviousWorks";
import Stats from "../src/components/sections/Stats";
import SiteShell from "../src/components/site/SiteShell";
import ScrollReveal from "../src/components/ui/ScrollReveal";

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <ScrollReveal>
        <Stats />
      </ScrollReveal>
      <ScrollReveal>
        <PreviousWorks />
      </ScrollReveal>
      <ScrollReveal>
        <OurServices />
      </ScrollReveal>
      <ScrollReveal>
        <OurCompany />
      </ScrollReveal>
      <ScrollReveal>
        <CTABanner />
      </ScrollReveal>
    </SiteShell>
  );
}

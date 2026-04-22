import ContactPage from "../../src/components/sections/ContactPage";
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
  const title = `Liên hệ ${companyName}`;
  const description =
    siteContent.contactPage?.formSubtitle ||
    "Liên hệ Tân Việt để nhận tư vấn giải pháp thiết bị điện lạnh phù hợp.";
  const image = siteContent.contactPage?.heroImage;

  return buildPageMetadata({
    title,
    description,
    path: "/contact",
    images: [image],
    fallbackImage,
    keywords: ["liên hệ tân việt", "tư vấn điện lạnh", "báo giá thiết bị điện lạnh"],
  });
}

export default async function Contact() {
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
      <ContactPage
        contact={siteSettings.contact}
        contactPageContent={siteContent.contactPage}
      />
    </SiteShell>
  );
}

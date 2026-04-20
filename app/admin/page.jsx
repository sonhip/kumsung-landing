import AdminDashboard from "../../src/components/admin/AdminDashboard";
import {
  getAdminMediaAssets,
  getAdminProducts,
  getSiteContent,
  getSiteSettings,
} from "../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [mediaAssets, products, siteSettings, siteContent] = await Promise.all([
    getAdminMediaAssets(),
    getAdminProducts(),
    getSiteSettings(),
    getSiteContent(),
  ]);

  const heroContent = {
    kicker: siteContent.hero?.kicker || "",
    headlineWordsText: Array.isArray(siteContent.hero?.headlineWords)
      ? siteContent.hero.headlineWords.join(" ")
      : "",
    subtitle: siteContent.hero?.subtitle || "",
    viewProductsButton: siteContent.hero?.viewProductsButton || "Xem sản phẩm",
    contactButton: siteContent.hero?.contactButton || "Liên hệ ngay",
  };

  const contactPageContent = {
    heroTitle: siteContent.contactPage?.heroTitle || "",
    heroImage: siteContent.contactPage?.heroImage || "",
    phoneTitle: siteContent.contactPage?.phoneTitle || "",
    phoneDescription: siteContent.contactPage?.phoneDescription || "",
    emailTitle: siteContent.contactPage?.emailTitle || "",
    emailDescription: siteContent.contactPage?.emailDescription || "",
    locationTitle: siteContent.contactPage?.locationTitle || "",
    locationMapLabel: siteContent.contactPage?.locationMapLabel || "",
    formTitle: siteContent.contactPage?.formTitle || "",
    formSubtitle: siteContent.contactPage?.formSubtitle || "",
    submitLabel: siteContent.contactPage?.submitLabel || "",
  };

  const aboutPageContent = {
    heroTitle: siteContent.aboutPage?.heroTitle || "",
    heroImage: siteContent.aboutPage?.heroImage || "",
    companyTitle: siteContent.aboutPage?.companyTitle || "",
    companyName: siteContent.aboutPage?.companyName || "",
    description: siteContent.aboutPage?.description || "",
    milestonesTitle: siteContent.aboutPage?.milestonesTitle || "",
    milestonesHighlight: siteContent.aboutPage?.milestonesHighlight || "",
    milestonesSubtitle: siteContent.aboutPage?.milestonesSubtitle || "",
    milestonesImage: siteContent.aboutPage?.milestonesImage || "",
    teamTitle: siteContent.aboutPage?.teamTitle || "",
  };

  return (
    <AdminDashboard
      mediaCount={mediaAssets.length}
      productCount={products.length}
      siteSettings={siteSettings}
      heroContent={heroContent}
      contactPageContent={contactPageContent}
      aboutPageContent={aboutPageContent}
    />
  );
}

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

  return (
    <AdminDashboard
      mediaCount={mediaAssets.length}
      productCount={products.length}
      siteSettings={siteSettings}
      heroContent={heroContent}
    />
  );
}

import AdminDashboard from "../../src/components/admin/AdminDashboard";
import {
  getAdminMediaAssets,
  getAdminProducts,
  getSiteSettings,
} from "../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [mediaAssets, products, siteSettings] = await Promise.all([
    getAdminMediaAssets(),
    getAdminProducts(),
    getSiteSettings(),
  ]);

  return (
    <AdminDashboard
      mediaCount={mediaAssets.length}
      productCount={products.length}
      siteSettings={siteSettings}
    />
  );
}

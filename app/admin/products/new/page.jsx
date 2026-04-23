import ProductEditor from "../../../../src/components/admin/ProductEditor";
import { getAdminMediaAssets, getSiteContent } from "../../../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [mediaLibrary, siteContent] = await Promise.all([
    getAdminMediaAssets(),
    getSiteContent(),
  ]);
  const categories = Array.isArray(siteContent.nav?.items)
    ? siteContent.nav.items
    : [];

  return (
    <ProductEditor
      mode="create"
      mediaLibrary={mediaLibrary}
      categories={categories}
    />
  );
}

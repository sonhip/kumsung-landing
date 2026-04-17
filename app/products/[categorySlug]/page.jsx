import ProductsPage from "../../../src/components/sections/ProductsPage";
import SiteShell from "../../../src/components/site/SiteShell";
import {
  getBrandLogo,
  getPublicProducts,
  getSiteSettings,
} from "../../../src/lib/cms";
import { productCatalog } from "../../../src/utils/productCatalog";

export const dynamic = "force-dynamic";

export default async function CategoryProductsPage({ params }) {
  const [brandLogo, cmsProducts, siteSettings] = await Promise.all([
    getBrandLogo(),
    getPublicProducts(),
    getSiteSettings(),
  ]);

  return (
    <SiteShell brandLogo={brandLogo} siteSettings={siteSettings}>
      <ProductsPage
        categorySlug={params.categorySlug}
        products={cmsProducts.length ? cmsProducts : productCatalog}
        companyInfo={siteSettings.company}
      />
    </SiteShell>
  );
}

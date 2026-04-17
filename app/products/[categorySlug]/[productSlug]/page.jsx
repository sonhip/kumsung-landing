import ProductDetailPage from "../../../../src/components/sections/ProductDetailPage";
import SiteShell from "../../../../src/components/site/SiteShell";
import {
  getBrandLogo,
  getPublicProductBySlugs,
  getRelatedProducts,
  getSiteSettings,
} from "../../../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }) {
  const [brandLogo, cmsProduct, siteSettings] = await Promise.all([
    getBrandLogo(),
    getPublicProductBySlugs(params.categorySlug, params.productSlug),
    getSiteSettings(),
  ]);

  const relatedProducts = cmsProduct ? await getRelatedProducts(cmsProduct) : [];

  return (
    <SiteShell brandLogo={brandLogo} siteSettings={siteSettings}>
      <ProductDetailPage
        categorySlug={params.categorySlug}
        productSlug={params.productSlug}
        product={cmsProduct}
        relatedProducts={cmsProduct ? relatedProducts : null}
        companyInfo={siteSettings.company}
      />
    </SiteShell>
  );
}

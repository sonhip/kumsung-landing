import ProductDetailPage from "../../../../src/components/sections/ProductDetailPage";
import SiteShell from "../../../../src/components/site/SiteShell";
import {
  getBrandLogo,
  getPublicProductBySlugs,
  getRelatedProducts,
  getSiteContent,
  getSiteSettings,
} from "../../../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }) {
  const [brandLogo, cmsProduct, siteSettings, siteContent] = await Promise.all([
    getBrandLogo(),
    getPublicProductBySlugs(params.categorySlug, params.productSlug),
    getSiteSettings(),
    getSiteContent(),
  ]);

  const relatedProducts = cmsProduct
    ? await getRelatedProducts(cmsProduct)
    : [];

  return (
    <SiteShell
      brandLogo={brandLogo}
      siteSettings={siteSettings}
      siteContent={siteContent}
    >
      <ProductDetailPage
        product={cmsProduct}
        relatedProducts={cmsProduct ? relatedProducts : null}
        companyInfo={siteSettings.company}
        productsText={siteContent.products}
      />
    </SiteShell>
  );
}

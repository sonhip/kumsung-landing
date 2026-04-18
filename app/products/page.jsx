import ProductsPage from "../../src/components/sections/ProductsPage";
import SiteShell from "../../src/components/site/SiteShell";
import {
  getBrandLogo,
  getPublicProducts,
  getSiteContent,
  getSiteSettings,
} from "../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function Products() {
  const [brandLogo, cmsProducts, siteSettings, siteContent] = await Promise.all(
    [getBrandLogo(), getPublicProducts(), getSiteSettings(), getSiteContent()],
  );

  return (
    <SiteShell
      brandLogo={brandLogo}
      siteSettings={siteSettings}
      siteContent={siteContent}
    >
      <ProductsPage
        products={cmsProducts}
        companyInfo={siteSettings.company}
        productsText={siteContent.products}
        nav={siteContent.nav}
        routes={siteContent.routes}
      />
    </SiteShell>
  );
}

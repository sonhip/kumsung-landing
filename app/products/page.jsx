import ProductsPage from "../../src/components/sections/ProductsPage";
import SiteShell from "../../src/components/site/SiteShell";
import {
  getBrandLogo,
  getPublicProducts,
  getSiteContent,
  getSiteSettings,
} from "../../src/lib/cms";
import { buildPageMetadata } from "../../src/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const [siteSettings, siteContent] = await Promise.all([
    getSiteSettings(),
    getSiteContent(),
  ]);

  const companyName = siteSettings.company.shortName || "Tân Việt";
  const title = `Danh mục sản phẩm | ${companyName}`;
  const description =
    siteContent.routes?.products?.description ||
    "Khám phá danh mục máy nén lạnh, dàn ngưng, dàn lạnh và phụ kiện điện lạnh do Tân Việt phân phối.";
  const image =
    siteContent.hero?.backgroundImages?.[0] || "/uploads/seed/product-other.jpg";

  return buildPageMetadata({
    title,
    description,
    path: "/products",
    images: [image],
    keywords: ["sản phẩm điện lạnh", "máy nén lạnh", "dàn ngưng", "phụ kiện điện lạnh"],
  });
}

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

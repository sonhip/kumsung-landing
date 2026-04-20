import ProductsPage from "../../../src/components/sections/ProductsPage";
import SiteShell from "../../../src/components/site/SiteShell";
import {
  getBrandLogo,
  getPublicProducts,
  getSiteContent,
  getSiteSettings,
} from "../../../src/lib/cms";
import { buildPageMetadata } from "../../../src/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const [siteSettings, cmsProducts] = await Promise.all([
    getSiteSettings(),
    getPublicProducts(),
  ]);

  const companyName = siteSettings.company.shortName || "Tân Việt";
  const categoryProducts = cmsProducts.filter(
    (item) => item.categorySlug === params.categorySlug,
  );
  const categoryName = categoryProducts[0]?.category || params.categorySlug;
  const title = `${categoryName} | ${companyName}`;
  const description = categoryProducts.length
    ? `Danh mục ${categoryName} do ${companyName} phân phối, cập nhật thông số và hình ảnh mới nhất.`
    : `Danh mục ${categoryName} tại ${companyName}.`;
  const image = categoryProducts[0]?.image || "/uploads/seed/product-other.jpg";

  return buildPageMetadata({
    title,
    description,
    path: `/products/${params.categorySlug}`,
    images: [image],
    keywords: [categoryName, "thiết bị điện lạnh", companyName],
  });
}

export default async function CategoryProductsPage({ params }) {
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
        categorySlug={params.categorySlug}
        products={cmsProducts}
        companyInfo={siteSettings.company}
        productsText={siteContent.products}
        nav={siteContent.nav}
        routes={siteContent.routes}
      />
    </SiteShell>
  );
}

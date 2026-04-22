import ProductsPage from "../../../src/components/sections/ProductsPage";
import SiteShell from "../../../src/components/site/SiteShell";
import {
  getBrandLogo,
  getPublicProducts,
  getSiteContent,
  getSiteSettings,
} from "../../../src/lib/cms";
import { buildPageMetadata, resolveSeoFallbackImage } from "../../../src/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { categorySlug } = await params;

  const [siteSettings, cmsProducts] = await Promise.all([
    getSiteSettings(),
    getPublicProducts(),
  ]);

  const companyName = siteSettings.company.shortName || "Tân Việt";
  const fallbackImage = resolveSeoFallbackImage(siteSettings);
  const categoryProducts = cmsProducts.filter(
    (item) => item.categorySlug === categorySlug,
  );
  const categoryName = categoryProducts[0]?.category || categorySlug;
  const title = `${categoryName} | ${companyName}`;
  const description = categoryProducts.length
    ? `Danh mục ${categoryName} do ${companyName} phân phối, cập nhật thông số và hình ảnh mới nhất.`
    : `Danh mục ${categoryName} tại ${companyName}.`;
  const image = categoryProducts[0]?.image;

  return buildPageMetadata({
    title,
    description,
    path: `/products/${categorySlug}`,
    images: [image],
    fallbackImage,
    keywords: [categoryName, "thiết bị điện lạnh", companyName],
  });
}

export default async function CategoryProductsPage({ params }) {
  const { categorySlug } = await params;

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
        categorySlug={categorySlug}
        products={cmsProducts}
        companyInfo={siteSettings.company}
        productsText={siteContent.products}
        nav={siteContent.nav}
        routes={siteContent.routes}
      />
    </SiteShell>
  );
}

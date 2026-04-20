import ProductDetailPage from "../../../../src/components/sections/ProductDetailPage";
import SiteShell from "../../../../src/components/site/SiteShell";
import {
  getBrandLogo,
  getPublicProductBySlugs,
  getRelatedProducts,
  getSiteContent,
  getSiteSettings,
} from "../../../../src/lib/cms";
import { buildPageMetadata } from "../../../../src/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const [siteSettings, product] = await Promise.all([
    getSiteSettings(),
    getPublicProductBySlugs(params.categorySlug, params.productSlug),
  ]);

  if (!product) {
    return buildPageMetadata({
      title: "Sản phẩm không tồn tại",
      description: "Không tìm thấy sản phẩm bạn yêu cầu.",
      path: `/products/${params.categorySlug}/${params.productSlug}`,
    });
  }

  const companyName = siteSettings.company.shortName || "Tân Việt";
  const title = `${product.model || product.title} | ${companyName}`;
  const description =
    product.description ||
    `Chi tiết sản phẩm ${product.model || product.title} do ${companyName} phân phối.`;

  return buildPageMetadata({
    title,
    description,
    path: `/products/${params.categorySlug}/${params.productSlug}`,
    images: [product.image],
    type: "article",
    keywords: [product.category, product.model || product.title, companyName],
  });
}

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

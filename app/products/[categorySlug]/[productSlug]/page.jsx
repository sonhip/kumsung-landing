import ProductDetailPage from "../../../../src/components/sections/ProductDetailPage";
import SiteShell from "../../../../src/components/site/SiteShell";

export default function ProductPage({ params }) {
  return (
    <SiteShell>
      <ProductDetailPage
        categorySlug={params.categorySlug}
        productSlug={params.productSlug}
      />
    </SiteShell>
  );
}

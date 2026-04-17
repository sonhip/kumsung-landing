import ProductsPage from "../../../src/components/sections/ProductsPage";
import SiteShell from "../../../src/components/site/SiteShell";

export default function CategoryProductsPage({ params }) {
  return (
    <SiteShell>
      <ProductsPage categorySlug={params.categorySlug} />
    </SiteShell>
  );
}

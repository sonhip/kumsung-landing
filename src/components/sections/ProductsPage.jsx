import {
  BuildOutlined,
  ToolOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../ui/ProductCard";
import { SITE_TEXT } from "../../constants/siteText";
import {
  findProductsByCategorySlug,
  productCatalog,
  toSlug,
} from "../../utils/productCatalog";

const { products: productsText, company, nav } = SITE_TEXT;

const productIcons = [
  BuildOutlined,
  ToolOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
];

const productsWithIcons = productCatalog.map((item, index) => ({
  ...item,
  icon:
    productIcons[
      nav.items.findIndex(
        (category) => toSlug(category) === item.categorySlug,
      ) % productIcons.length
    ] || BuildOutlined,
}));

const ProductsPage = () => {
  const { categorySlug } = useParams();

  const selectedCategory = categorySlug
    ? nav.items.find((item) => toSlug(item) === categorySlug)
    : null;

  const filteredProducts = categorySlug
    ? findProductsByCategorySlug(categorySlug).map((item) => ({
        ...item,
        icon:
          productsWithIcons.find(
            (product) => product.productSlug === item.productSlug,
          )?.icon || BuildOutlined,
      }))
    : productsWithIcons;

  return (
    <section
      className="products-page"
      aria-label={productsText.sectionAriaLabel}
    >
      <div className="container products-page-hero">
        <h1>{selectedCategory || productsText.title}</h1>
        <p>
          {productsText.description || SITE_TEXT.routes.products.description}
        </p>
      </div>

      <div className="container products-page-grid-wrap">
        {filteredProducts.length ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={`${product.categorySlug}-${product.productSlug}`}
                {...product}
                learnMoreLabel={productsText.learnMoreLabel}
                to={`/products/${product.categorySlug}/${product.productSlug}`}
              />
            ))}
          </div>
        ) : (
          <div className="products-empty">
            <h2>No products found</h2>
            <p>Selected product type does not have any item yet.</p>
            <Link to="/products" className="products-back-link">
              Back to all products
            </Link>
          </div>
        )}
      </div>

      <div className="container products-page-cta-wrap">
        <Link to="/contact" className="products-page-quote-btn">
          {company.quoteButton}
        </Link>
      </div>
    </section>
  );
};

export default ProductsPage;

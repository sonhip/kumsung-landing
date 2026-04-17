import { Link, useParams } from "react-router-dom";
import { SITE_TEXT } from "../../constants/siteText";
import { findProductBySlugs } from "../../utils/productCatalog";

const { company } = SITE_TEXT;

const ProductDetailPage = () => {
  const { categorySlug, productSlug } = useParams();
  const product = findProductBySlugs(categorySlug, productSlug);

  if (!product) {
    return (
      <section className="product-detail-page">
        <div className="container product-detail-not-found">
          <h1>Product not found</h1>
          <p>The selected product does not exist or has been removed.</p>
          <Link to="/products" className="products-back-link">
            Back to all products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      className="product-detail-page"
      aria-label={`${product.title} details`}
    >
      <div className="container product-detail-breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/products/${product.categorySlug}`}>{product.category}</Link>
        <span>/</span>
        <span>{product.model || product.title}</span>
      </div>

      <div className="container product-detail-main">
        <div className="product-detail-media">
          <img src={product.image} alt={product.title} loading="lazy" />
        </div>

        <div className="product-detail-info">
          <h1>{product.model || product.title}</h1>
          <p className="product-detail-subtitle">{product.description}</p>

          <h2>FEATURE</h2>
          <ul>
            {product.features?.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>

          <p className="product-detail-category">
            Category: <span>{product.category}</span>
          </p>

          <Link to="/contact" className="products-page-quote-btn">
            {company.quoteButton}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;

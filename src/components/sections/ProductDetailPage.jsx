import Link from "next/link";
import { SITE_TEXT } from "../../constants/siteText";
import { findProductBySlugs, productCatalog } from "../../utils/productCatalog";

const { company } = SITE_TEXT;

const ProductDetailPage = ({ categorySlug, productSlug }) => {
  const product = findProductBySlugs(categorySlug, productSlug);
  const relatedProducts = product
    ? productCatalog
        .filter(
          (item) =>
            item.categorySlug === product.categorySlug &&
            item.productSlug !== product.productSlug,
        )
        .slice(0, 3)
    : [];

  if (!product) {
    return (
      <section className="product-detail-page">
        <div className="container product-detail-not-found">
          <h1>Product not found</h1>
          <p>The selected product does not exist or has been removed.</p>
          <Link href="/products" className="products-back-link">
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
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href={`/products/${product.categorySlug}`}>{product.category}</Link>
        <span>/</span>
        <span>{product.model || product.title}</span>
      </div>

      <div className="container product-detail-main">
        <div className="product-detail-media">
          <img
            src={product.image}
            alt={product.title}
            className="product-detail-main-image"
          />
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

          <Link href="/contact" className="products-page-quote-btn">
            {company.quoteButton}
          </Link>
        </div>
      </div>

      <div className="container product-detail-description-block">
        <h2>Description</h2>
        <p>{product.description}</p>
      </div>

      {relatedProducts.length ? (
        <div className="container product-related-wrap">
          <h2>Related products</h2>
          <div className="product-related-grid">
            {relatedProducts.map((relatedItem) => (
              <Link
                key={relatedItem.productSlug}
                href={`/products/${relatedItem.categorySlug}/${relatedItem.productSlug}`}
                className="product-related-card"
              >
                <img
                  src={relatedItem.image}
                  alt={relatedItem.title}
                  loading="lazy"
                />
                <div className="product-related-content">
                  <h3>{relatedItem.model || relatedItem.title}</h3>
                  <p>{relatedItem.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ProductDetailPage;

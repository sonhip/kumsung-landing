import Link from "next/link";
import ProductPreviewImage from "../ui/ProductPreviewImage";
const defaultProductsText = {
  notFoundTitle: "Không tìm thấy sản phẩm",
  notFoundDescription:
    "Sản phẩm bạn chọn không tồn tại hoặc đã được cập nhật lại danh mục.",
  backToProducts: "Quay lại tất cả sản phẩm",
  breadcrumbsHome: "Trang chủ",
  featureTitle: "Đặc điểm nổi bật",
  categoryLabel: "Danh mục",
  descriptionTitle: "Mô tả",
  relatedTitle: "Sản phẩm liên quan",
};

const ProductDetailPage = ({
  product,
  relatedProducts = [],
  companyInfo,
  productsText = defaultProductsText,
}) => {
  const resolvedRelatedProducts = relatedProducts || [];

  if (!product) {
    return (
      <section className="product-detail-page">
        <div className="container product-detail-not-found">
          <h1>{productsText.notFoundTitle}</h1>
          <p>{productsText.notFoundDescription}</p>
          <Link href="/products" className="products-back-link">
            {productsText.backToProducts}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      className="product-detail-page"
      aria-label={`Chi tiết ${product.title}`}
    >
      <div className="container product-detail-breadcrumbs">
        <Link href="/">{productsText.breadcrumbsHome}</Link>
        <span>/</span>
        <Link href={`/products/${product.categorySlug}`}>
          {product.category}
        </Link>
        <span>/</span>
        <span>{product.model || product.title}</span>
      </div>

      <div className="container product-detail-main">
        <div className="product-detail-media">
          <ProductPreviewImage src={product.image} alt={product.title} />
        </div>

        <div className="product-detail-info">
          <h1>{product.model || product.title}</h1>
          <p className="product-detail-subtitle">{product.description}</p>

          {product.features?.length ? (
            <>
              <h2>{productsText.featureTitle}</h2>
              <ul>
                {product.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </>
          ) : null}

          <p className="product-detail-category">
            {productsText.categoryLabel}: <span>{product.category}</span>
          </p>

          <Link href="/contact" className="products-page-quote-btn">
            {companyInfo.quoteButton}
          </Link>
        </div>
      </div>

      <div className="container product-detail-description-block">
        <h2>{productsText.descriptionTitle}</h2>
        {product.contentHtml ? (
          <div dangerouslySetInnerHTML={{ __html: product.contentHtml }} />
        ) : (
          <p>{product.description}</p>
        )}
      </div>

      {resolvedRelatedProducts.length ? (
        <div className="container product-related-wrap">
          <h2>{productsText.relatedTitle}</h2>
          <div className="product-related-grid">
            {resolvedRelatedProducts.map((relatedItem) => (
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

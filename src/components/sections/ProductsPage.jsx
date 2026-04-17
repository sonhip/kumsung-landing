"use client";

import Link from "next/link";
import {
  BuildOutlined,
  ToolOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import ProductCard from "../ui/ProductCard";
import { SITE_TEXT } from "../../constants/siteText";
import {
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

const mapProductsWithIcons = (items) => items.map((item) => ({
  ...item,
  icon:
    productIcons[
      nav.items.findIndex(
        (category) => toSlug(category) === item.categorySlug,
      ) % productIcons.length
    ] || BuildOutlined,
}));

const ProductsPage = ({
  categorySlug = null,
  products = productCatalog,
  companyInfo = company,
}) => {
  const {
    emptyTitle,
    emptyDescription,
    backToProducts,
  } = productsText;
  const productsWithIcons = mapProductsWithIcons(products);
  const selectedCategory = categorySlug
    ? nav.items.find((item) => toSlug(item) === categorySlug)
    : null;

  const filteredProducts = categorySlug
    ? products.filter((item) => item.categorySlug === categorySlug).map((item) => ({
        ...item,
        icon:
          productsWithIcons.find(
            (product) => product.productSlug === item.productSlug && product.categorySlug === item.categorySlug,
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
            <h2>{emptyTitle}</h2>
            <p>{emptyDescription}</p>
            <Link href="/products" className="products-back-link">
              {backToProducts}
            </Link>
          </div>
        )}
      </div>

      <div className="container products-page-cta-wrap">
        <Link href="/contact" className="products-page-quote-btn">
          {companyInfo.quoteButton}
        </Link>
      </div>
    </section>
  );
};

export default ProductsPage;

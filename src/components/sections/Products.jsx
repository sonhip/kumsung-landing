import {
  BuildOutlined,
  ToolOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import ProductCard from "../ui/ProductCard";
import { SITE_TEXT } from "../../constants/siteText";
import { productCatalog, toSlug } from "../../utils/productCatalog";

const { products: productsText, nav } = SITE_TEXT;

const productIcons = [
  BuildOutlined,
  ToolOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
];

const featuredProducts = nav.items
  .map((category, categoryIndex) => {
    const found = productCatalog.find(
      (item) => item.categorySlug === toSlug(category),
    );

    if (!found) return null;

    return {
      ...found,
      icon: productIcons[categoryIndex % productIcons.length],
    };
  })
  .filter(Boolean);

const Products = () => {
  return (
    <section
      className="products-section"
      aria-label={productsText.sectionAriaLabel}
    >
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {productsText.title}
        </motion.h2>
        <motion.div
          className="section-underline"
          initial={{ width: 0 }}
          whileInView={{ width: 120 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        />

        <motion.div
          className="products-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {featuredProducts.map((product) => (
            <motion.div
              key={`${product.categorySlug}-${product.productSlug}`}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <ProductCard
                {...product}
                learnMoreLabel={productsText.learnMoreLabel}
                to={`/products/${product.categorySlug}/${product.productSlug}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Products;

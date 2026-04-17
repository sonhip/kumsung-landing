import { ArrowRightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const ProductCard = ({
  icon: Icon,
  title,
  description,
  learnMoreLabel,
  image,
}) => {
  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -10, transition: { duration: 0.25 } }}
    >
      {image && (
        <img src={image} alt={title} className="product-image" loading="lazy" />
      )}
      <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.2 }}>
        <Icon className="product-icon" aria-hidden="true" />
      </motion.div>
      <h3>{title}</h3>
      <p>{description}</p>
      <a
        href="#"
        className="learn-more"
        aria-label={`Learn more about ${title}`}
      >
        {learnMoreLabel} <ArrowRightOutlined />
      </a>
    </motion.article>
  );
};

export default ProductCard;

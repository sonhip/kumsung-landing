import { ArrowRightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ProductCard = ({
  icon: Icon,
  title,
  description,
  learnMoreLabel,
  image,
  to,
}) => {
  const content = (
    <>
      {image && (
        <img src={image} alt={title} className="product-image" loading="lazy" />
      )}
      <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.2 }}>
        <Icon className="product-icon" aria-hidden="true" />
      </motion.div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="learn-more" aria-label={`Learn more about ${title}`}>
        {learnMoreLabel} <ArrowRightOutlined />
      </span>
    </>
  );

  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -10, transition: { duration: 0.25 } }}
    >
      {to ? (
        <Link
          to={to}
          className="product-card-link"
          aria-label={`Open ${title}`}
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.article>
  );
};

export default ProductCard;

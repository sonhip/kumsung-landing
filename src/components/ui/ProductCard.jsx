"use client";

import { ArrowRightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";

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
      <span className="learn-more" aria-label={`Xem chi tiết ${title}`}>
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
          href={to}
          className="product-card-link"
          aria-label={`Mở ${title}`}
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

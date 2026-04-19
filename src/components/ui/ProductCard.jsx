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
      <div className="product-card-media">
        {image && (
          <img
            src={image}
            alt={title}
            className="product-image"
            loading="lazy"
          />
        )}
        <motion.span
          className="product-card-icon-badge"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="product-icon" aria-hidden="true" />
        </motion.span>
      </div>

      <div className="product-card-body">
        <h3 className="product-title">{title}</h3>
        <p className="product-description">{description}</p>
      </div>

      <div className="product-card-footer">
        <span className="learn-more" aria-label={`Xem chi tiết ${title}`}>
          {learnMoreLabel} <ArrowRightOutlined />
        </span>
      </div>
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

"use client";

import { Image } from "antd";

export default function ProductPreviewImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      className="product-detail-main-image"
      preview={{
        mask: "Xem ảnh",
      }}
    />
  );
}

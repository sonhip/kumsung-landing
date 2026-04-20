const DEFAULT_SITE_URL = "https://tanvietref.com.vn";

export const getSiteUrl = () => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configured) {
    return DEFAULT_SITE_URL;
  }

  return configured.replace(/\/$/, "");
};

export const toAbsoluteUrl = (path = "/") => {
  const baseUrl = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

export const buildPageMetadata = ({
  title,
  description,
  path = "/",
  images = [],
  type = "website",
  keywords = [],
}) => {
  const canonical = toAbsoluteUrl(path);
  const openGraphImages = images.length
    ? images.map((url) => ({ url }))
    : [{ url: toAbsoluteUrl("/uploads/seed/hero-warehouse.jpg") }];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      locale: "vi_VN",
      url: canonical,
      title,
      description,
      siteName: "Tân Việt",
      images: openGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: openGraphImages.map((image) => image.url),
    },
  };
};

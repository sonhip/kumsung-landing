const DEFAULT_SITE_URL = "https://tanvietref.com.vn";
const DEFAULT_OG_IMAGE = "/favicon.svg";

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

export const resolveSeoFallbackImage = (siteSettings) =>
  siteSettings?.branding?.logoUrl ||
  siteSettings?.branding?.faviconUrl ||
  DEFAULT_OG_IMAGE;

const resolveImageUrl = (value) => {
  const normalized = value?.trim();

  if (!normalized) {
    return null;
  }

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  return toAbsoluteUrl(normalized);
};

export const buildPageMetadata = ({
  title,
  description,
  path = "/",
  images = [],
  fallbackImage = DEFAULT_OG_IMAGE,
  type = "website",
  keywords = [],
}) => {
  const canonical = toAbsoluteUrl(path);
  const resolvedImages = images.map(resolveImageUrl).filter(Boolean);
  const openGraphImages = resolvedImages.length
    ? resolvedImages.map((url) => ({ url }))
    : [{ url: resolveImageUrl(fallbackImage) || toAbsoluteUrl(DEFAULT_OG_IMAGE) }];

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

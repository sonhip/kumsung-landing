import "antd/dist/reset.css";
import "../src/styles/global.css";
import "../src/styles/animations.css";
import Providers from "./providers";
import { getSiteContent, getSiteSettings } from "../src/lib/cms";
import { getSiteUrl, toAbsoluteUrl } from "../src/lib/seo";

export async function generateMetadata() {
  let faviconUrl = "/favicon.svg";
  let siteName = "Tân Việt";
  let defaultDescription =
    "Tân Việt chuyên phân phối thiết bị điện lạnh tiêu chuẩn Hàn Quốc, cung cấp giải pháp tối ưu cho công trình dân dụng và công nghiệp.";
  let defaultImage = "/uploads/seed/hero-warehouse.jpg";

  try {
    const [settings, content] = await Promise.all([
      getSiteSettings(),
      getSiteContent(),
    ]);

    if (settings?.branding?.faviconUrl) {
      faviconUrl = settings.branding.faviconUrl;
    }

    siteName = settings?.company?.shortName || siteName;
    defaultDescription = content?.routes?.products?.description || defaultDescription;
    defaultImage =
      content?.hero?.backgroundImages?.[0] ||
      content?.contactPage?.heroImage ||
      defaultImage;
  } catch {
    faviconUrl = "/favicon.svg";
  }

  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl);

  return {
    metadataBase,
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: defaultDescription,
    applicationName: siteName,
    referrer: "origin-when-cross-origin",
    category: "Industrial Equipment",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: "/",
      siteName,
      title: siteName,
      description: defaultDescription,
      images: [{ url: toAbsoluteUrl(defaultImage) }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: defaultDescription,
      images: [toAbsoluteUrl(defaultImage)],
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

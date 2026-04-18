import "antd/dist/reset.css";
import "../src/styles/global.css";
import "../src/styles/animations.css";
import Providers from "./providers";
import { getSiteSettings } from "../src/lib/cms";

export async function generateMetadata() {
  let faviconUrl = "/favicon.svg";

  try {
    const settings = await getSiteSettings();
    if (settings?.branding?.faviconUrl) {
      faviconUrl = settings.branding.faviconUrl;
    }
  } catch {
    faviconUrl = "/favicon.svg";
  }

  return {
    title: "Tân Việt",
    description:
      "Website giới thiệu doanh nghiệp và danh mục thiết bị điện lạnh của Tân Việt, xây dựng bằng Next.js và PostgreSQL.",
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
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

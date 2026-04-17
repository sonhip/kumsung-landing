import "antd/dist/reset.css";
import "../src/styles/global.css";
import "../src/styles/animations.css";
import Providers from "./providers";

export const metadata = {
  title: "Tân Việt",
  description:
    "Website giới thiệu doanh nghiệp và danh mục thiết bị điện lạnh của Tân Việt, xây dựng bằng Next.js và PostgreSQL.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

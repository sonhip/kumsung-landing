import "antd/dist/reset.css";
import "../src/styles/global.css";
import "../src/styles/animations.css";
import Providers from "./providers";

export const metadata = {
  title: "Kumsung Refrigeration",
  description:
    "Industrial refrigeration solutions, product catalog, and contact management built with Next.js and PostgreSQL.",
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

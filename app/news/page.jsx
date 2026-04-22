import NewsPage from "../../src/components/sections/NewsPage";
import SiteShell from "../../src/components/site/SiteShell";
import {
  getBrandLogo,
  getPublicNewsPosts,
  getSiteContent,
  getSiteSettings,
} from "../../src/lib/cms";
import { buildPageMetadata, resolveSeoFallbackImage } from "../../src/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const [siteSettings, siteContent, newsPosts] = await Promise.all([
    getSiteSettings(),
    getSiteContent(),
    getPublicNewsPosts(),
  ]);

  const companyName = siteSettings.company.shortName || "Tân Việt";
  const fallbackImage = resolveSeoFallbackImage(siteSettings);
  const title = `Tin tức | ${companyName}`;
  const description =
    siteContent.routes?.news?.description ||
    "Cập nhật tin tức, chia sẻ kinh nghiệm và thông tin sản phẩm từ Tân Việt.";
  const image = newsPosts[0]?.coverImage || siteContent.hero?.backgroundImages?.[0];

  return buildPageMetadata({
    title,
    description,
    path: "/news",
    images: [image],
    fallbackImage,
    keywords: ["tin tức điện lạnh", "tin tức tân việt", "kinh nghiệm điện lạnh"],
  });
}

export default async function NewsListPage() {
  const [brandLogo, posts, siteSettings, siteContent] = await Promise.all([
    getBrandLogo(),
    getPublicNewsPosts(),
    getSiteSettings(),
    getSiteContent(),
  ]);

  return (
    <SiteShell
      brandLogo={brandLogo}
      siteSettings={siteSettings}
      siteContent={siteContent}
    >
      <NewsPage posts={posts} routes={siteContent.routes} />
    </SiteShell>
  );
}

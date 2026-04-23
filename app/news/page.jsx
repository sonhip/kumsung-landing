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
const NEWS_PAGE_SIZE = 6;

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

export default async function NewsListPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const keyword = (resolvedSearchParams?.q || "").trim();
  const requestedPage = Number.parseInt(resolvedSearchParams?.page || "1", 10);
  const safeRequestedPage =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const [brandLogo, posts, siteSettings, siteContent] = await Promise.all([
    getBrandLogo(),
    getPublicNewsPosts(),
    getSiteSettings(),
    getSiteContent(),
  ]);
  const normalizedKeyword = keyword.toLowerCase();
  const filteredPosts = normalizedKeyword
    ? posts.filter((post) =>
        [post.title, post.excerpt, post.contentHtml]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedKeyword),
      )
    : posts;
  const totalItems = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / NEWS_PAGE_SIZE));
  const currentPage = Math.min(safeRequestedPage, totalPages);
  const start = (currentPage - 1) * NEWS_PAGE_SIZE;
  const paginatedPosts = filteredPosts.slice(start, start + NEWS_PAGE_SIZE);

  return (
    <SiteShell
      brandLogo={brandLogo}
      siteSettings={siteSettings}
      siteContent={siteContent}
    >
      <NewsPage
        posts={paginatedPosts}
        routes={siteContent.routes}
        keyword={keyword}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
      />
    </SiteShell>
  );
}

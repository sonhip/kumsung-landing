import NewsDetailPage from "../../../src/components/sections/NewsDetailPage";
import SiteShell from "../../../src/components/site/SiteShell";
import {
  getBrandLogo,
  getPublicNewsPostBySlug,
  getSiteContent,
  getSiteSettings,
} from "../../../src/lib/cms";
import { buildPageMetadata } from "../../../src/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const [siteSettings, post] = await Promise.all([
    getSiteSettings(),
    getPublicNewsPostBySlug(slug),
  ]);

  if (!post) {
    return buildPageMetadata({
      title: "Bài viết không tồn tại",
      description: "Không tìm thấy bài viết bạn yêu cầu.",
      path: `/news/${slug}`,
    });
  }

  const companyName = siteSettings.company.shortName || "Tân Việt";
  const title = `${post.title} | ${companyName}`;

  return buildPageMetadata({
    title,
    description: post.excerpt || `Bài viết mới từ ${companyName}.`,
    path: `/news/${post.slug}`,
    images: [post.coverImage || "/uploads/seed/hero-warehouse.jpg"],
    type: "article",
    keywords: ["tin tức", "điện lạnh", companyName, post.title],
  });
}

export default async function NewsPostPage({ params }) {
  const { slug } = await params;

  const [brandLogo, post, siteSettings, siteContent] = await Promise.all([
    getBrandLogo(),
    getPublicNewsPostBySlug(slug),
    getSiteSettings(),
    getSiteContent(),
  ]);

  return (
    <SiteShell
      brandLogo={brandLogo}
      siteSettings={siteSettings}
      siteContent={siteContent}
    >
      <NewsDetailPage post={post} />
    </SiteShell>
  );
}

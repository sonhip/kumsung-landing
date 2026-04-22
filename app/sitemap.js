import { getPublicNewsPosts, getPublicProducts } from "../src/lib/cms";
import { getSiteUrl, toAbsoluteUrl } from "../src/lib/seo";

export default async function sitemap() {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticPages = [
    {
      url: toAbsoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: toAbsoluteUrl("/products"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl("/news"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const [products, newsPosts] = await Promise.all([
    getPublicProducts(),
    getPublicNewsPosts(),
  ]);
  const categorySlugs = [...new Set(products.map((item) => item.categorySlug))];

  const categoryPages = categorySlugs.map((slug) => ({
    url: `${siteUrl}/products/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productPages = products.map((product) => ({
    url: `${siteUrl}/products/${product.categorySlug}/${product.productSlug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const newsPages = newsPosts.map((post) => ({
    url: `${siteUrl}/news/${post.slug}`,
    lastModified: post.updatedAt || now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...newsPages];
}

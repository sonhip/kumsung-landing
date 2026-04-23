import ProductCategoryManager from "../../../src/components/admin/ProductCategoryManager";
import { prisma } from "../../../src/lib/prisma";
import { toSlug } from "../../../src/utils/productCatalog";

export const dynamic = "force-dynamic";

export default async function AdminProductCategoriesPage() {
  const [content, products] = await Promise.all([
    prisma.siteContent.findUnique({
      where: { id: "default" },
      select: { nav: true },
    }),
    prisma.product.findMany({
      select: { category: true },
    }),
  ]);

  const categories = (Array.isArray(content?.nav?.items) ? content.nav.items : [])
    .map((item) => item?.trim())
    .filter(Boolean);

  const countMap = products.reduce((acc, item) => {
    const key = item.category?.trim();
    if (!key) return acc;
    acc.set(key, (acc.get(key) || 0) + 1);
    return acc;
  }, new Map());

  const initialItems = categories.map((name) => ({
    name,
    slug: toSlug(name),
    productCount: countMap.get(name) || 0,
  }));

  return <ProductCategoryManager initialItems={initialItems} />;
}

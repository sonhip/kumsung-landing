import { notFound } from "next/navigation";
import ProductEditor from "../../../../src/components/admin/ProductEditor";
import { getAdminMediaAssets, getSiteContent } from "../../../../src/lib/cms";
import { prisma } from "../../../../src/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }) {
  const [product, mediaLibrary, siteContent] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    }),
    getAdminMediaAssets(),
    getSiteContent(),
  ]);
  const categories = Array.isArray(siteContent.nav?.items)
    ? siteContent.nav.items
    : [];

  if (!product) {
    notFound();
  }

  return (
    <ProductEditor
      mode="edit"
      initialProduct={product}
      mediaLibrary={mediaLibrary}
      categories={categories}
    />
  );
}

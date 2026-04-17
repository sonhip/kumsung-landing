import { notFound } from "next/navigation";
import ProductEditor from "../../../../src/components/admin/ProductEditor";
import { getAdminMediaAssets } from "../../../../src/lib/cms";
import { prisma } from "../../../../src/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }) {
  const [product, mediaLibrary] = await Promise.all([
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
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductEditor
      mode="edit"
      initialProduct={product}
      mediaLibrary={mediaLibrary}
    />
  );
}

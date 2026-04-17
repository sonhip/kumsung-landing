import ProductList from "../../../src/components/admin/ProductList";
import { prisma } from "../../../src/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const initialProducts = await prisma.product.findMany({
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return <ProductList initialProducts={initialProducts} />;
}

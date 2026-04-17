import ProductEditor from "../../../../src/components/admin/ProductEditor";
import { getAdminMediaAssets } from "../../../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const mediaLibrary = await getAdminMediaAssets();

  return <ProductEditor mode="create" mediaLibrary={mediaLibrary} />;
}

import NewsEditor from "../../../../src/components/admin/NewsEditor";
import { getAdminMediaAssets } from "../../../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function AdminNewsCreatePage() {
  const mediaLibrary = await getAdminMediaAssets();

  return <NewsEditor mode="create" mediaLibrary={mediaLibrary} />;
}

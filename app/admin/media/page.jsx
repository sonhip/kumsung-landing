import MediaManager from "../../../src/components/admin/MediaManager";
import { getAdminMediaAssets } from "../../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const initialItems = await getAdminMediaAssets();

  return <MediaManager initialItems={initialItems} />;
}

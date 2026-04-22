import NewsList from "../../../src/components/admin/NewsList";
import { getAdminNewsPosts } from "../../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const initialItems = await getAdminNewsPosts();

  return <NewsList initialItems={initialItems} />;
}

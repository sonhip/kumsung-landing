import UserManager from "../../../src/components/admin/UserManager";
import { getAdminUsers } from "../../../src/lib/adminUsers";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const initialItems = await getAdminUsers();

  return <UserManager initialItems={initialItems} />;
}

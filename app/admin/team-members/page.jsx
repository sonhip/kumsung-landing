import TeamMemberManager from "../../../src/components/admin/TeamMemberManager";
import { getAdminTeamMembers } from "../../../src/lib/cms";

export const dynamic = "force-dynamic";

export default async function AdminTeamMembersPage() {
  const initialItems = await getAdminTeamMembers();

  return <TeamMemberManager initialItems={initialItems} />;
}

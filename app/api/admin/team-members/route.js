import { prisma } from "../../../../src/lib/prisma";

const parseBoolean = (value) => value === true || value === "true";

const validateTeamMemberPayload = (payload) => {
  if (!payload.fullName?.trim()) {
    return { error: "Vui lòng nhập họ và tên thành viên." };
  }

  return {
    data: {
      fullName: payload.fullName.trim(),
      role: payload.role?.trim() || null,
      email: payload.email?.trim() || null,
      phone: payload.phone?.trim() || null,
      imageUrl: payload.imageUrl?.trim() || null,
      bio: payload.bio?.trim() || null,
      sortOrder: Number(payload.sortOrder || 0),
      isActive:
        payload.isActive === undefined ? true : parseBoolean(payload.isActive),
    },
  };
};

export async function GET() {
  const members = await prisma.teamMember.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return Response.json(members);
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const validation = validateTeamMemberPayload(payload);

    if (validation.error) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const member = await prisma.teamMember.create({
      data: validation.data,
    });

    return Response.json(member);
  } catch (error) {
    console.error("Failed to create team member", error);
    return Response.json(
      { error: "Không thể tạo thành viên." },
      { status: 500 },
    );
  }
}

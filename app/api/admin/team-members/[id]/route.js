import { prisma } from "../../../../../src/lib/prisma";
import { deleteUploadIfUnused } from "../../../../../src/lib/uploadStorage";

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

export async function GET(_request, { params }) {
  const member = await prisma.teamMember.findUnique({
    where: { id: params.id },
  });

  if (!member) {
    return Response.json(
      { error: "Không tìm thấy thành viên." },
      { status: 404 },
    );
  }

  return Response.json(member);
}

export async function PATCH(request, { params }) {
  try {
    const payload = await request.json();
    const validation = validateTeamMemberPayload(payload);

    if (validation.error) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const existingMember = await prisma.teamMember.findUnique({
      where: { id: params.id },
    });

    if (!existingMember) {
      return Response.json(
        { error: "Không tìm thấy thành viên." },
        { status: 404 },
      );
    }

    const member = await prisma.teamMember.update({
      where: { id: params.id },
      data: validation.data,
    });

    if (existingMember.imageUrl && existingMember.imageUrl !== member.imageUrl) {
      await deleteUploadIfUnused(existingMember.imageUrl);
    }

    return Response.json(member);
  } catch (error) {
    console.error("Failed to update team member", error);
    return Response.json(
      { error: "Không thể cập nhật thành viên." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const existingMember = await prisma.teamMember.findUnique({
      where: { id: params.id },
    });

    if (!existingMember) {
      return Response.json(
        { error: "Không tìm thấy thành viên." },
        { status: 404 },
      );
    }

    await prisma.teamMember.delete({
      where: { id: params.id },
    });

    if (existingMember.imageUrl) {
      await deleteUploadIfUnused(existingMember.imageUrl);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete team member", error);
    return Response.json(
      { error: "Không thể xóa thành viên." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import {
  deleteAdminUser,
  findAdminUserById,
  updateAdminUser,
} from "../../../../../src/lib/adminUsers";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeUpdatePayload = (payload = {}, currentUser) => {
  const username = payload.username?.trim();
  const email = payload.email?.trim().toLowerCase();
  const recoveryEmail = payload.recoveryEmail?.trim().toLowerCase() || null;
  const password = payload.password || "";
  const isActive = payload.isActive === undefined ? true : Boolean(payload.isActive);

  if (!username || username.length < 3) {
    return { error: "Tên đăng nhập cần tối thiểu 3 ký tự." };
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    return { error: "Email đăng nhập không hợp lệ." };
  }

  if (recoveryEmail && !EMAIL_PATTERN.test(recoveryEmail)) {
    return { error: "Email reset password không hợp lệ." };
  }

  if (password && password.length < 8) {
    return { error: "Mật khẩu mới cần tối thiểu 8 ký tự." };
  }

  return {
    data: {
      username,
      email,
      recoveryEmail,
      password,
      role: "admin",
      isActive: currentUser.isRoot ? true : isActive,
    },
  };
};

export async function PATCH(request, { params }) {
  try {
    const currentUser = await findAdminUserById(params.id);

    if (!currentUser) {
      return NextResponse.json({ error: "Không tìm thấy user." }, { status: 404 });
    }

    const payload = await request.json();
    const validation = normalizeUpdatePayload(payload, currentUser);

    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const user = await updateAdminUser(params.id, validation.data);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to update admin user", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Tên đăng nhập hoặc email đã tồn tại." },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Không thể cập nhật user." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const currentUser = await findAdminUserById(params.id);

    if (!currentUser) {
      return NextResponse.json({ error: "Không tìm thấy user." }, { status: 404 });
    }

    if (currentUser.isRoot) {
      return NextResponse.json(
        { error: "Không thể xoá tài khoản admin gốc." },
        { status: 400 },
      );
    }

    await deleteAdminUser(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete admin user", error);
    return NextResponse.json({ error: "Không thể xoá user." }, { status: 500 });
  }
}

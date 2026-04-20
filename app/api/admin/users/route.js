import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import {
  createAdminUser,
  getAdminUsers,
} from "../../../../src/lib/adminUsers";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeCreatePayload = (payload = {}) => {
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

  if (!password || password.length < 8) {
    return { error: "Mật khẩu cần tối thiểu 8 ký tự." };
  }

  return {
    data: {
      username,
      email,
      recoveryEmail,
      password,
      isActive,
    },
  };
};

export async function GET() {
  try {
    const users = await getAdminUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch admin users", error);
    return NextResponse.json({ error: "Không thể tải danh sách user." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const validation = normalizeCreatePayload(payload);

    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const user = await createAdminUser(validation.data);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to create admin user", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Tên đăng nhập hoặc email đã tồn tại." },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Không thể tạo user." }, { status: 500 });
  }
}

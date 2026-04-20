import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import {
  createAdminSessionCookie,
} from "../../../../src/lib/auth";
import { validateAdminLogin } from "../../../../src/lib/adminUsers";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const user = await validateAdminLogin(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Sai email hoặc mật khẩu." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      message: "Đăng nhập thành công.",
    });

    response.cookies.set(createAdminSessionCookie(user.id));

    return response;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2021"
    ) {
      return NextResponse.json(
        {
          error:
            "Database chưa được cập nhật schema mới. Hãy chạy `npm run db:push` và `npm run db:seed`.",
        },
        { status: 500 },
      );
    }

    console.error("Failed to login admin user", error);

    return NextResponse.json(
      { error: "Không thể xử lý đăng nhập." },
      { status: 500 },
    );
  }
}

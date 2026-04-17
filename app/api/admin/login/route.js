import { NextResponse } from "next/server";
import {
  adminSessionCookie,
  isValidAdminCredentials,
} from "../../../../src/lib/auth";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!isValidAdminCredentials(username, password)) {
      return NextResponse.json(
        { error: "Sai tên đăng nhập hoặc mật khẩu." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      message: "Đăng nhập thành công.",
    });

    response.cookies.set(adminSessionCookie);

    return response;
  } catch {
    return NextResponse.json(
      { error: "Không thể xử lý đăng nhập." },
      { status: 400 },
    );
  }
}

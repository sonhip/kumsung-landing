import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "../../../../src/lib/auth";

export async function POST() {
  const response = NextResponse.json({ message: "Đã đăng xuất." });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    path: "/",
    maxAge: 0,
  });
  return response;
}

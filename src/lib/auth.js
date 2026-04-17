export const ADMIN_SESSION_COOKIE = "tv_admin_session";

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin",
};

export const isValidAdminCredentials = (username, password) =>
  username === ADMIN_CREDENTIALS.username &&
  password === ADMIN_CREDENTIALS.password;

export const hasAdminSession = (cookieStore) =>
  cookieStore?.get?.(ADMIN_SESSION_COOKIE)?.value === "authenticated";

export const adminSessionCookie = {
  name: ADMIN_SESSION_COOKIE,
  value: "authenticated",
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 8,
};

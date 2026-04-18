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

const resolveCookieSecureFlag = () => {
  if (process.env.ADMIN_COOKIE_SECURE === "true") {
    return true;
  }

  if (process.env.ADMIN_COOKIE_SECURE === "false") {
    return false;
  }

  return process.env.NODE_ENV === "production";
};

export const adminSessionCookie = {
  name: ADMIN_SESSION_COOKIE,
  value: "authenticated",
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: resolveCookieSecureFlag(),
  maxAge: 60 * 60 * 8,
};

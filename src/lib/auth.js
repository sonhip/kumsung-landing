export const ADMIN_SESSION_COOKIE = "tv_admin_session";
const AUTHENTICATED_PREFIX = "authenticated:";

export const hasAdminSession = (cookieStore) =>
  cookieStore?.get?.(ADMIN_SESSION_COOKIE)?.value?.startsWith(
    AUTHENTICATED_PREFIX,
  );

const resolveCookieSecureFlag = () => {
  if (process.env.ADMIN_COOKIE_SECURE === "true") {
    return true;
  }

  if (process.env.ADMIN_COOKIE_SECURE === "false") {
    return false;
  }

  return process.env.NODE_ENV === "production";
};

export const createAdminSessionCookie = (userId) => ({
  name: ADMIN_SESSION_COOKIE,
  value: `${AUTHENTICATED_PREFIX}${userId}`,
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: resolveCookieSecureFlag(),
  maxAge: 60 * 60 * 8,
});

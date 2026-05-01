/** ログイン UI・OAuth/メールコールバック（認証済みなら /admin へ寄せる用途）。 */
export const PUBLIC_AUTH_PATHS = new Set(["/login", "/signup", "/confirm-sign-up"]);

export function isPublicAuthPath(pathname: string): boolean {
  return PUBLIC_AUTH_PATHS.has(pathname) || pathname.startsWith("/auth/");
}

/** 管理画面。未認証時は proxy で /login へ。 */
export function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

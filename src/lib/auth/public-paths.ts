/** ログイン不要で通すパス（認証 UI・OAuth/メールコールバック）。ルート保護の判定は proxy のみで使う想定。 */
export const PUBLIC_AUTH_PATHS = new Set(["/login", "/signup", "/confirm-sign-up"]);

export function isPublicAuthPath(pathname: string): boolean {
  return PUBLIC_AUTH_PATHS.has(pathname) || pathname.startsWith("/auth/");
}

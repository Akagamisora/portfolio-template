import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

/** ADMIN_EMAIL または ADMIN_EMAILS（カンマ区切り）が未設定なら、ログイン済みユーザーはすべて管理画面可 */
function parseAdminEmailAllowlist(): string[] | null {
  const combined = process.env.ADMIN_EMAILS?.trim() || process.env.ADMIN_EMAIL?.trim();
  if (!combined) return null;
  const list = combined
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.length > 0 ? list : null;
}

function isEmailAllowedForAdmin(email: string | undefined): boolean {
  const allowlist = parseAdminEmailAllowlist();
  if (!allowlist) return true;
  if (!email) return false;
  return allowlist.includes(email.toLowerCase());
}

export async function getSessionUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** 管理画面用: 未ログインは /login、許可リスト不一致は / */
export async function requireAdminUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  if (!isEmailAllowedForAdmin(user.email)) {
    redirect("/");
  }
  return user;
}

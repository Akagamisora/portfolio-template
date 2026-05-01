"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

async function authCallbackUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) {
    return `${envUrl.replace(/\/$/, "")}/auth/callback`;
  }
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}/auth/callback`;
}

export async function signUpAction(email: string, password: string) {
  const supabase = await createClient();
  const emailRedirectTo = await authCallbackUrl();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
  });
  if (error) {
    throw new Error(error.message);
  }
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }
  redirect(`/confirm-sign-up?email=${encodeURIComponent(email)}`);
}

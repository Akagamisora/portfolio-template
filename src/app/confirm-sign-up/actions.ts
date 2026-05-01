"use server";

import { createClient } from "@/utils/supabase/server";

export async function confirmSignUpAction(email: string, token: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function resendSignUpCodeAction(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });
  if (error) {
    throw new Error(error.message);
  }
}

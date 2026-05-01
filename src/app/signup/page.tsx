"use client";

import { useCallback, useState, useTransition } from "react";
import { unstable_rethrow, useRouter } from "next/navigation";
import { signUpAction } from "@/app/signup/actions";
import { SignUpForm } from "@/components/features/auth/sign-up-form";

export default function SignUpPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleErrorClear = useCallback(() => setError(""), []);
  const handleSwitchToSignIn = useCallback(() => router.push("/login"), [router]);

  const handleSubmit = (email: string, password: string) => {
    setError("");
    startTransition(async () => {
      try {
        await signUpAction(email, password);
      } catch (e: unknown) {
        unstable_rethrow(e);
        const message = e instanceof Error ? e.message : "サインアップに失敗しました";
        setError(message);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignUpForm
          onSubmit={handleSubmit}
          loading={isPending}
          error={error}
          onErrorClear={handleErrorClear}
          onSwitchToSignIn={handleSwitchToSignIn}
        />
      </div>
    </div>
  );
}

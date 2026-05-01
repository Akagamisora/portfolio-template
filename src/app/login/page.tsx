"use client";

import { useCallback, useState, useTransition } from "react";
import { unstable_rethrow, useRouter } from "next/navigation";
import { signInAction } from "@/app/login/actions";
import { SignInForm } from "@/components/features/auth/sign-in-form";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleErrorClear = useCallback(() => setError(""), []);
  const handleSwitchToSignUp = useCallback(() => router.push("/signup"), [router]);

  const handleSubmit = (email: string, password: string) => {
    setError("");
    startTransition(async () => {
      try {
        await signInAction(email, password);
      } catch (e: unknown) {
        unstable_rethrow(e);
        const message = e instanceof Error ? e.message : "サインインに失敗しました";
        setError(message);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignInForm
          onSubmit={handleSubmit}
          loading={isPending}
          error={error}
          onErrorClear={handleErrorClear}
          onSwitchToSignUp={handleSwitchToSignUp}
        />
      </div>
    </div>
  );
}

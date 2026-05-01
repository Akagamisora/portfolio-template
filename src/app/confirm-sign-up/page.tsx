"use client";

import { Suspense, useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { confirmSignUpAction, resendSignUpCodeAction } from "@/app/confirm-sign-up/actions";
import { ConfirmSignUpForm } from "@/components/features/auth/confirm-sign-up-form";

export default function ConfirmSignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="text-muted-foreground">読み込み中...</div>
        </div>
      }
    >
      <ConfirmSignUpPageInner />
    </Suspense>
  );
}

function ConfirmSignUpPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const handleSubmit = useCallback(
    async (emailAddress: string, code: string) => {
      await confirmSignUpAction(emailAddress, code);
      router.push("/login");
      router.refresh();
    },
    [router],
  );

  const handleResend = useCallback(async () => {
    await resendSignUpCodeAction(email);
  }, [email]);

  const handleBackToSignUp = useCallback(() => router.push("/signup"), [router]);
  const handleSwitchToLogin = useCallback(() => router.push("/login"), [router]);

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <p className="text-destructive">メールアドレスが指定されていません。</p>
          <Link href="/signup" className="mt-4 inline-block text-primary underline">
            サインアップに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ConfirmSignUpPageContent
      email={email}
      onSubmit={handleSubmit}
      onResend={handleResend}
      onBackToSignUp={handleBackToSignUp}
      onSwitchToLogin={handleSwitchToLogin}
    />
  );
}

interface ConfirmSignUpPageContentProps {
  email: string;
  onSubmit: (email: string, code: string) => void | Promise<void>;
  onResend: () => Promise<void>;
  onBackToSignUp: () => void;
  onSwitchToLogin: () => void;
}

function ConfirmSignUpPageContent({
  email,
  onSubmit,
  onResend,
  onBackToSignUp,
  onSwitchToLogin,
}: ConfirmSignUpPageContentProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleErrorClear = useCallback(() => setError(""), []);

  const handleSubmit = (emailAddress: string, code: string) => {
    setError("");
    startTransition(async () => {
      try {
        await onSubmit(emailAddress, code);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "認証に失敗しました";
        setError(message);
      }
    });
  };

  const handleResend = async () => {
    setError("");
    try {
      await onResend();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "コードの再送に失敗しました";
      setError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ConfirmSignUpForm
          email={email}
          onSubmit={handleSubmit}
          onResendCode={handleResend}
          loading={isPending}
          error={error}
          onErrorClear={handleErrorClear}
          onBackToSignUp={onBackToSignUp}
          onSwitchToLogin={onSwitchToLogin}
        />
      </div>
    </div>
  );
}

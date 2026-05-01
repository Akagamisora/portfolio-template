"use client";

import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react";

/**
 * 認証コード入力フォームのプロパティ
 */
export interface ConfirmSignUpFormProps {
  /** 認証対象のメールアドレス */
  email: string;
  /** 認証処理のコールバック */
  onSubmit: (email: string, code: string) => void | Promise<void>;
  /** 認証コード再送信のコールバック */
  onResendCode?: () => Promise<void>;
  /** サインアップ画面に戻るコールバック */
  onBackToSignUp?: () => void;
  /** ログイン画面への切り替えコールバック */
  onSwitchToLogin?: () => void;
  /** ローディング状態 */
  loading?: boolean;
  /** エラーメッセージ */
  error?: string;
  /** エラークリアのコールバック */
  onErrorClear?: () => void;
  /** カードタイトル */
  title?: string;
  /** カード説明文 */
  description?: string;
  /** 認証コードの桁数 */
  codeLength?: number;
  /** ヘルプテキスト */
  helpText?: string;
}

/**
 * 認証コード入力フォームコンポーネント
 * メールに送信された認証コードを入力してアカウントを有効化
 *
 * @example
 * ```tsx
 * <ConfirmSignUpForm
 *   email="user@example.com"
 *   onSubmit={async (email, code) => {
 *     await confirmSignUp(email, code);
 *   }}
 *   onResendCode={async () => {
 *     await resendCode(email);
 *   }}
 *   loading={isLoading}
 *   error={errorMessage}
 *   onErrorClear={() => setErrorMessage("")}
 *   onBackToSignUp={() => setView("signup")}
 * />
 * ```
 */
export function ConfirmSignUpForm({
  email,
  onSubmit,
  onResendCode,
  onBackToSignUp,
  onSwitchToLogin,
  loading = false,
  error,
  onErrorClear,
  title = "メール認証",
  description = "認証コードを入力してください",
  codeLength = 6,
  helpText,
}: ConfirmSignUpFormProps) {
  const [code, setCode] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isResending, setIsResending] = useState(false);
  const codeId = useId();

  /**
   * 認証コード入力の変更を処理
   */
  const handleCodeChange = (value: string) => {
    setCode(value);

    // エラーがある場合はクリア
    if (error && onErrorClear) {
      onErrorClear();
    }
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  /**
   * フォーム送信を処理
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    const errors: string[] = [];

    if (!code) {
      errors.push("認証コードを入力してください");
    }

    if (code.length !== codeLength) {
      errors.push(`認証コードは${codeLength}桁である必要があります`);
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    await onSubmit(email, code);
  };

  /**
   * 認証コード再送信を処理
   */
  const handleResendCode = async () => {
    if (!onResendCode) return;

    try {
      setIsResending(true);
      setCode("");
      setValidationErrors([]);
      await onResendCode();
    } catch (err) {
      console.error("Resend code error:", err);
    } finally {
      setIsResending(false);
    }
  };

  const isLoading = loading || isResending;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
          <CheckCircle className="h-6 w-6" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* メールアドレス表示 */}
        <div className="text-center p-4 bg-muted rounded-lg">
          <Mail className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{email}</span> に認証コードを送信しました
          </p>
          {helpText ? <p className="text-xs text-muted-foreground mt-1">{helpText}</p> : null}
        </div>

        {/* エラーメッセージ */}
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {/* バリデーションエラー */}
        {validationErrors.length > 0 ? (
          <Alert variant="destructive">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        ) : null}

        {/* 認証コード入力フォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 認証コード入力 */}
          <div className="space-y-2">
            <Label htmlFor={codeId} className="text-center block">
              認証コード
            </Label>
            <div className="flex justify-center">
              <InputOTP
                id={codeId}
                maxLength={codeLength}
                value={code}
                onChange={handleCodeChange}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  {Array.from({ length: codeLength }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {codeLength}桁の数字を入力してください
            </p>
          </div>

          {/* 認証ボタン */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || code.length !== codeLength}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                認証中...
              </>
            ) : (
              "認証する"
            )}
          </Button>
        </form>

        {/* 再送信ボタン */}
        {onResendCode ? (
          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              disabled={isLoading}
              className="w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  再送信中...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  認証コードを再送信
                </>
              )}
            </Button>
          </div>
        ) : null}

        {/* 戻るボタン */}
        {onBackToSignUp ? (
          <div className="text-center">
            <Button type="button" variant="ghost" onClick={onBackToSignUp} disabled={isLoading}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              サインアップに戻る
            </Button>
          </div>
        ) : null}

        {/* ログインへのリンク */}
        {onSwitchToLogin ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              すでにアカウントをお持ちの方は{" "}
              <Button
                type="button"
                variant="link"
                onClick={onSwitchToLogin}
                disabled={isLoading}
                className="p-0 h-auto font-normal"
              >
                ログイン
              </Button>
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

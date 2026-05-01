"use client";

import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

/**
 * サインインフォームのプロパティ
 */
export interface SignInFormProps {
  /** サインイン処理のコールバック */
  onSubmit: (email: string, password: string) => void | Promise<void>;
  /** ローディング状態 */
  loading?: boolean;
  /** エラーメッセージ */
  error?: string;
  /** エラークリアのコールバック */
  onErrorClear?: () => void;
  /** サインアップ画面への切り替えコールバック */
  onSwitchToSignUp?: () => void;
  /** カードタイトル */
  title?: string;
  /** カード説明文 */
  description?: string;
}

/**
 * サインインフォームコンポーネント
 * メールアドレスとパスワードでサインイン
 *
 * @example
 * ```tsx
 * <SignInForm
 *   onSubmit={async (email, password) => {
 *     await signIn(email, password);
 *   }}
 *   loading={isLoading}
 *   error={errorMessage}
 *   onErrorClear={() => setErrorMessage("")}
 *   onSwitchToSignUp={() => setView("signup")}
 * />
 * ```
 */
export function SignInForm({
  onSubmit,
  loading = false,
  error,
  onErrorClear,
  onSwitchToSignUp,
  title = "サインイン",
  description = "メールアドレスとパスワードでサインイン",
}: SignInFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const emailId = useId();
  const passwordId = useId();

  /**
   * フォーム入力の変更を処理
   */
  const handleInputChange =
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // エラーがある場合はクリア
      if (error && onErrorClear) {
        onErrorClear();
      }
    };

  /**
   * フォーム送信を処理
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    await onSubmit(formData.email, formData.password);
  };

  /**
   * パスワード表示の切り替え
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* エラーメッセージ */}
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {/* サインインフォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* メールアドレス入力 */}
          <div className="space-y-2">
            <Label htmlFor={emailId}>メールアドレス</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id={emailId}
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange("email")}
                className="pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* パスワード入力 */}
          <div className="space-y-2">
            <Label htmlFor={passwordId}>パスワード</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                placeholder="パスワードを入力"
                value={formData.password}
                onChange={handleInputChange("password")}
                className="pl-10 pr-10"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                disabled={loading}
                aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* サインインボタン */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                サインイン中...
              </>
            ) : (
              "サインイン"
            )}
          </Button>
        </form>

        {/* サインアップへのリンク */}
        {onSwitchToSignUp ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              アカウントをお持ちでない方は{" "}
              <Button
                type="button"
                variant="link"
                onClick={onSwitchToSignUp}
                disabled={loading}
                className="p-0 h-auto font-normal"
              >
                アカウントを作成
              </Button>
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";

/**
 * パスワードバリデーションルール
 */
export interface PasswordValidationRules {
  /** 最小文字数 */
  minLength?: number;
  /** 小文字必須 */
  requireLowercase?: boolean;
  /** 大文字必須 */
  requireUppercase?: boolean;
  /** 数字必須 */
  requireNumber?: boolean;
  /** 特殊文字必須 */
  requireSpecialChar?: boolean;
}

/**
 * サインアップフォームのプロパティ
 */
export interface SignUpFormProps {
  /** サインアップ処理のコールバック */
  onSubmit: (email: string, password: string) => void | Promise<void>;
  /** ローディング状態 */
  loading?: boolean;
  /** エラーメッセージ */
  error?: string;
  /** エラークリアのコールバック */
  onErrorClear?: () => void;
  /** サインイン画面への切り替えコールバック */
  onSwitchToSignIn?: () => void;
  /** カードタイトル */
  title?: string;
  /** カード説明文 */
  description?: string;
  /** パスワードバリデーションルール */
  passwordRules?: PasswordValidationRules;
}

const LOWERCASE_RE = /[a-z]/;
const UPPERCASE_RE = /[A-Z]/;
const DIGIT_RE = /\d/;
const SPECIAL_CHAR_RE = /[!@#$%^&*(),.?":{}|<>]/;

const defaultPasswordRules: PasswordValidationRules = {
  minLength: 8,
  requireLowercase: true,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: false,
};

/**
 * サインアップフォームコンポーネント
 * メールアドレスとパスワードでサインアップ
 *
 * @example
 * ```tsx
 * <SignUpForm
 *   onSubmit={async (email, password) => {
 *     await signUp(email, password);
 *   }}
 *   loading={isLoading}
 *   error={errorMessage}
 *   onErrorClear={() => setErrorMessage("")}
 *   onSwitchToSignIn={() => setView("signin")}
 * />
 * ```
 */
export function SignUpForm({
  onSubmit,
  loading = false,
  error,
  onErrorClear,
  onSwitchToSignIn,
  title = "サインアップ",
  description = "新しいアカウントを作成",
  passwordRules = defaultPasswordRules,
}: SignUpFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

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
      if (validationErrors.length > 0) {
        setValidationErrors([]);
      }
    };

  /**
   * パスワードの強度をチェック
   */
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    const rules = passwordRules;

    if (rules.minLength && password.length < rules.minLength) {
      errors.push(`パスワードは${rules.minLength}文字以上である必要があります`);
    }

    if (rules.requireLowercase && !LOWERCASE_RE.test(password)) {
      errors.push("パスワードには小文字が含まれている必要があります");
    }

    if (rules.requireUppercase && !UPPERCASE_RE.test(password)) {
      errors.push("パスワードには大文字が含まれている必要があります");
    }

    if (rules.requireNumber && !DIGIT_RE.test(password)) {
      errors.push("パスワードには数字が含まれている必要があります");
    }

    if (rules.requireSpecialChar && !SPECIAL_CHAR_RE.test(password)) {
      errors.push("パスワードには特殊文字が含まれている必要があります");
    }

    return errors;
  };

  /**
   * フォーム送信を処理
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    const errors: string[] = [];

    if (!formData.email) {
      errors.push("メールアドレスを入力してください");
    }

    if (!formData.password) {
      errors.push("パスワードを入力してください");
    }

    if (!formData.confirmPassword) {
      errors.push("パスワード確認を入力してください");
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push("パスワードが一致しません");
    }

    const passwordErrors = validatePassword(formData.password);
    errors.push(...passwordErrors);

    if (errors.length > 0) {
      setValidationErrors(errors);
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

  /**
   * パスワード確認表示の切り替え
   */
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  /**
   * パスワード要件のヘルプテキストを生成
   */
  const getPasswordHelpText = (): string => {
    const parts: string[] = [];
    const rules = passwordRules;

    if (rules.minLength) {
      parts.push(`${rules.minLength}文字以上`);
    }

    if (rules.requireUppercase || rules.requireLowercase) {
      const cases: string[] = [];
      if (rules.requireUppercase) cases.push("大文字");
      if (rules.requireLowercase) cases.push("小文字");
      parts.push(cases.join("・"));
    }

    if (rules.requireNumber) {
      parts.push("数字");
    }

    if (rules.requireSpecialChar) {
      parts.push("特殊文字");
    }

    return parts.length > 0 ? `${parts.join("、")}を含む必要があります` : "";
  };

  const passwordHelpText = getPasswordHelpText();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="inline-flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            {title}
          </span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
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

        {/* サインアップフォーム */}
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
            {passwordHelpText ? (
              <p className="text-xs text-muted-foreground">{passwordHelpText}</p>
            ) : null}
          </div>

          {/* パスワード確認入力 */}
          <div className="space-y-2">
            <Label htmlFor={confirmPasswordId}>パスワード確認</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id={confirmPasswordId}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="パスワードを再入力"
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                className="pl-10 pr-10"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                disabled={loading}
                aria-label={showConfirmPassword ? "パスワードを隠す" : "パスワードを表示"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* サインアップボタン */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !formData.email || !formData.password || !formData.confirmPassword}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                サインアップ中...
              </>
            ) : (
              "サインアップ"
            )}
          </Button>
        </form>

        {/* ログインへのリンク */}
        {onSwitchToSignIn ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              すでにアカウントをお持ちの方は{" "}
              <Button
                type="button"
                variant="link"
                onClick={onSwitchToSignIn}
                disabled={loading}
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

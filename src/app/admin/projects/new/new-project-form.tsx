"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createProjectAction } from "../actions";

export function NewProjectForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      setError("");
      startTransition(async () => {
        try {
          await createProjectAction(new FormData(form));
          router.refresh();
        } catch (err) {
          unstable_rethrow(err);
          setError(err instanceof Error ? err.message : "作成に失敗しました");
        }
      });
    },
    [router],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>プロジェクトを追加</CardTitle>
        <CardDescription>スラッグは URL に使われます（公開後も変更可能）。</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="slug">スラッグ</Label>
            <Input
              id="slug"
              name="slug"
              required
              placeholder="my-app"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
            />
            <p className="text-xs text-muted-foreground">英小文字・数字・ハイフンのみ</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">タイトル</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="summary">概要</Label>
            <Textarea id="summary" name="summary" required rows={3} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="body">本文（Markdown 可）</Label>
            <Textarea id="body" name="body" rows={8} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="thumbnailUrl">サムネイル URL</Label>
            <Input id="thumbnailUrl" name="thumbnailUrl" type="url" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="demoUrl">デモ URL</Label>
            <Input id="demoUrl" name="demoUrl" type="url" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="repoUrl">リポジトリ URL</Label>
            <Input id="repoUrl" name="repoUrl" type="url" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">タグ（カンマ区切り）</Label>
            <Input id="tags" name="tags" placeholder="Next.js, TypeScript" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sortOrder">並び順（小さいほど上）</Label>
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="published">公開状態</Label>
            <select
              id="published"
              name="published"
              className="border-input bg-background h-9 w-full max-w-xs rounded-md border px-3 text-sm shadow-xs outline-none"
              defaultValue="false"
            >
              <option value="false">下書き</option>
              <option value="true">公開</option>
            </select>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" disabled={isPending}>
            {isPending ? "作成中…" : "作成"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

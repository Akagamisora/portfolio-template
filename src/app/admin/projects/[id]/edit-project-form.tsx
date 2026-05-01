"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import type { Project } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteProjectAction, updateProjectAction } from "../actions";

export function EditProjectForm({ project }: { project: Project }) {
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
          await updateProjectAction(project.id, new FormData(form));
          router.refresh();
        } catch (err) {
          unstable_rethrow(err);
          setError(err instanceof Error ? err.message : "保存に失敗しました");
        }
      });
    },
    [project.id, router],
  );

  const handleDelete = useCallback(() => {
    if (!window.confirm("このプロジェクトを削除しますか？取り消せません。")) return;
    setError("");
    startTransition(async () => {
      try {
        await deleteProjectAction(project.id);
        router.push("/admin/projects");
        router.refresh();
      } catch (err) {
        unstable_rethrow(err);
        setError(err instanceof Error ? err.message : "削除に失敗しました");
      }
    });
  }, [project.id, router]);

  const tagsStr = project.tags.join(", ");

  return (
    <Card>
      <CardHeader>
        <CardTitle>プロジェクトを編集</CardTitle>
        <CardDescription>
          保存すると公開サイトに反映されます（公開設定に応じて表示）。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="slug">スラッグ</Label>
            <Input
              id="slug"
              name="slug"
              required
              defaultValue={project.slug}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">タイトル</Label>
            <Input id="title" name="title" required defaultValue={project.title} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="summary">概要</Label>
            <Textarea
              id="summary"
              name="summary"
              required
              rows={3}
              defaultValue={project.summary}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="body">本文（Markdown 可）</Label>
            <Textarea id="body" name="body" rows={8} defaultValue={project.body ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="thumbnailUrl">サムネイル URL</Label>
            <Input
              id="thumbnailUrl"
              name="thumbnailUrl"
              type="url"
              defaultValue={project.thumbnailUrl ?? ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="demoUrl">デモ URL</Label>
            <Input id="demoUrl" name="demoUrl" type="url" defaultValue={project.demoUrl ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="repoUrl">リポジトリ URL</Label>
            <Input id="repoUrl" name="repoUrl" type="url" defaultValue={project.repoUrl ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">タグ（カンマ区切り）</Label>
            <Input id="tags" name="tags" defaultValue={tagsStr} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sortOrder">並び順</Label>
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue={project.sortOrder} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="published">公開状態</Label>
            <select
              id="published"
              name="published"
              className="border-input bg-background h-9 w-full max-w-xs rounded-md border px-3 text-sm shadow-xs outline-none"
              defaultValue={project.published ? "true" : "false"}
            >
              <option value="false">下書き</option>
              <option value="true">公開</option>
            </select>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "保存中…" : "保存"}
            </Button>
            <Button type="button" variant="destructive" disabled={isPending} onClick={handleDelete}>
              削除
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

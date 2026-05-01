"use client";

import { useCallback, useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertSiteProfileAction } from "./actions";

export interface SiteProfileFormValues {
  displayName: string;
  title: string;
  bio: string;
  avatarUrl: string;
  githubUrl: string;
  twitterUrl: string;
  emailPublic: string;
}

export function SiteProfileForm({ initial }: { initial: SiteProfileFormValues }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setError("");
    startTransition(async () => {
      try {
        const fd = new FormData(form);
        await upsertSiteProfileAction(fd);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        unstable_rethrow(err);
        setError(err instanceof Error ? err.message : "保存に失敗しました");
      }
    });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>サイトプロフィール</CardTitle>
        <CardDescription>トップページなどに表示される情報です。</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="displayName">表示名</Label>
            <Input id="displayName" name="displayName" defaultValue={initial.displayName} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">肩書き・キャッチ</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initial.title}
              placeholder="例: フルスタックエンジニア"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">自己紹介</Label>
            <Textarea id="bio" name="bio" rows={6} defaultValue={initial.bio} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="avatarUrl">アバター画像 URL</Label>
            <Input id="avatarUrl" name="avatarUrl" type="url" defaultValue={initial.avatarUrl} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input id="githubUrl" name="githubUrl" type="url" defaultValue={initial.githubUrl} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="twitterUrl">X (Twitter) URL</Label>
            <Input id="twitterUrl" name="twitterUrl" type="url" defaultValue={initial.twitterUrl} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emailPublic">公開メールアドレス</Label>
            <Input
              id="emailPublic"
              name="emailPublic"
              type="email"
              defaultValue={initial.emailPublic}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {saved ? (
            <p className="text-sm text-green-600 dark:text-green-400">保存しました</p>
          ) : null}
          <Button type="submit" disabled={isPending}>
            {isPending ? "保存中…" : "保存"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

function isChunkLoadError(error: Error): boolean {
  return (
    error.name === "ChunkLoadError" ||
    error.message.includes("Loading chunk") ||
    error.message.includes("Failed to fetch dynamically imported module") ||
    error.message.includes("Importing a module script failed")
  );
}

const MAX_CHUNK_RELOAD = 3;
const CHUNK_RELOAD_KEY = "chunk-reload-count";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (isChunkLoadError(error)) {
      const count = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) ?? "0");
      if (count < MAX_CHUNK_RELOAD) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, String(count + 1));
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <div
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center gap-4 font-sans"
    >
      <h2 className="text-xl font-semibold">エラーが発生しました</h2>
      <p className="text-sm text-muted-foreground">
        問題が解決しない場合は、ページを再読み込みしてください。
      </p>
      <Button variant="outline" onClick={reset}>
        もう一度試す
      </Button>
    </div>
  );
}

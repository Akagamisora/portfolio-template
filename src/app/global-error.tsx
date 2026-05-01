"use client";

import { type CSSProperties, useEffect } from "react";

function isChunkLoadError(error: Error): boolean {
  return (
    error.name === "ChunkLoadError" ||
    error.message.includes("Loading chunk") ||
    error.message.includes("Failed to fetch dynamically imported module") ||
    error.message.includes("Importing a module script failed")
  );
}

const containerStyle: CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  fontFamily: "system-ui, sans-serif",
};

const headingStyle: CSSProperties = { fontSize: "20px", fontWeight: 600 };

const descriptionStyle: CSSProperties = { color: "#666", fontSize: "14px" };

const buttonStyle: CSSProperties = {
  padding: "8px 24px",
  borderRadius: "6px",
  border: "1px solid #e5e5e5",
  background: "#fff",
  cursor: "pointer",
  fontSize: "14px",
};

const MAX_CHUNK_RELOAD = 3;
const CHUNK_RELOAD_KEY = "chunk-reload-count";

export default function GlobalError({
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
    <html lang="ja">
      <body>
        <div role="alert" style={containerStyle}>
          <h2 style={headingStyle}>予期しないエラーが発生しました</h2>
          <p style={descriptionStyle}>問題が解決しない場合は、ページを再読み込みしてください。</p>
          <button onClick={reset} style={buttonStyle}>
            もう一度試す
          </button>
        </div>
      </body>
    </html>
  );
}

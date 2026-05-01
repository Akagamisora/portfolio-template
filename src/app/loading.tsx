export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <div role="status" aria-live="polite" className="text-muted-foreground">
        読み込み中...
      </div>
    </div>
  );
}

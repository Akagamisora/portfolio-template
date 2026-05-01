import Link from "next/link";
import { NewProjectForm } from "./new-project-form";

export default function AdminNewProjectPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            プロジェクトを追加
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            作品の情報を入力して保存します。
          </p>
        </div>
        <Link
          href="/admin/projects"
          className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          一覧に戻る
        </Link>
      </div>
      <NewProjectForm />
    </div>
  );
}

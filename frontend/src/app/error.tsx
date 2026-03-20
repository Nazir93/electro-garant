"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="text-center max-w-md">
        <h1 className="font-heading text-4xl mb-4">Произошла ошибка</h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Что-то пошло не так. Попробуйте обновить страницу.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 text-xs uppercase tracking-[0.12em] rounded-full border transition-all duration-300 hover:bg-[rgba(201,168,76,0.1)]"
            style={{ borderColor: "rgba(201,168,76,0.4)", color: "var(--text)" }}
          >
            Попробовать снова
          </button>
          <Link
            href="/"
            className="px-6 py-3 text-xs uppercase tracking-[0.12em] rounded-full transition-all duration-300"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

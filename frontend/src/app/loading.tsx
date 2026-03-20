export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{
            borderColor: "var(--border)",
            borderTopColor: "var(--accent)",
          }}
        />
        <span
          className="text-xs uppercase tracking-[0.15em]"
          style={{ color: "var(--text-muted)" }}
        >
          Загрузка
        </span>
      </div>
    </div>
  );
}

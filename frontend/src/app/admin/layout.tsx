import { AdminShell } from "@/components/admin/admin-shell";
import { SessionProvider } from "@/components/admin/session-provider";

export const metadata = {
  title: "Админ-панель | Гарант Монтаж",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}

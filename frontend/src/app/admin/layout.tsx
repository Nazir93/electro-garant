import { SessionProvider } from "@/components/admin/session-provider";
import { AdminSidebar } from "@/components/admin/sidebar";

export const metadata = {
  title: "Админ-панель | Гарант Монтаж",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#0A0A0A] text-white/90">
        <AdminSidebar />
        <div className="lg:pl-[240px] transition-all duration-300">
          <main className="min-h-screen p-4 sm:p-6 lg:p-8 pt-14 lg:pt-8">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}

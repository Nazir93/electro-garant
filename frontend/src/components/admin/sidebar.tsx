"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Briefcase,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Globe,
  FolderOpen,
  Star,
  HelpCircle,
  UserCircle,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Заявки", icon: Inbox },
  { href: "/admin/projects", label: "Портфолио", icon: FolderOpen },
  { href: "/admin/posts", label: "Новости", icon: FileText },
  { href: "/admin/services", label: "Услуги", icon: Briefcase },
  { href: "/admin/reviews", label: "Отзывы", icon: Star },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/team", label: "Команда", icon: UserCircle },
  { href: "/admin/partners", label: "Партнёры", icon: Users },
  { href: "/admin/seo", label: "SEO", icon: Globe },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-[60] p-2 rounded-lg bg-[#111111] text-white/70 hover:text-white"
      >
        <Menu size={20} />
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[69] bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-[70] flex flex-col
          bg-[#111111] border-r border-white/[0.08]
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[68px]" : "w-[240px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.08]">
          {!collapsed && (
            <Link href="/admin" className="text-sm font-bold tracking-wide text-white">
              ГАРАНТ<span className="text-[#C9A84C]">МОНТАЖ</span>
            </Link>
          )}
          <button
            onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }}
            className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronLeft size={16} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium
                  transition-all duration-150
                  ${isActive
                    ? "bg-[#C9A84C]/10 text-[#C9A84C]"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.06]"
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-white/[0.08]">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all duration-150"
            title={collapsed ? "Выйти" : undefined}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Выйти</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

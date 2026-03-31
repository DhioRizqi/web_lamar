"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Briefcase, LayoutDashboard, CalendarDays, BarChart3, Bell, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  CalendarDays: <CalendarDays className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Bell: <Bell className="w-5 h-5" />,
};

export function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen max-h-screen border-r border-app bg-surface p-4 sticky top-0">
      <div className="flex items-center gap-2 px-2 py-4 mb-6">
        <div className="relative w-10 h-10 shrink-0 overflow-visible">
          <Image
            src="/logo_lamar.png"
            alt="Applyo Logo"
            fill
            sizes="40px"
            className="object-contain scale-[1.7]"
            priority
          />
        </div>
        <span className="font-bold text-xl tracking-tight text-main">Applyo</span>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-sage text-white"
                  : "text-secondary hover:bg-sage-bg hover:text-sage"
              )}
            >
              {iconMap[item.icon]}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="px-3 pb-3 text-xs text-hint leading-relaxed">
          <p>Dibuat oleh : Dhio Rizqi</p>
          <p>Version 1.1</p>
        </div>
        <div className="pt-4 border-t border-app">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-secondary hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}

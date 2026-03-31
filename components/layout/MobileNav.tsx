"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, LayoutDashboard, Briefcase, CalendarDays, BarChart3, Bell } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  CalendarDays: <CalendarDays className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Bell: <Bell className="w-5 h-5" />,
};

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger 
        render={
          <Button variant="ghost" size="icon" className="lg:hidden text-secondary hover:text-sage -ml-2">
            <Menu className="w-6 h-6" />
          </Button>
        }
      />
      <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-surface border-r-app p-0 flex flex-col">
          <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
        <div className="flex items-center gap-2 px-6 py-6 border-b border-app">
          <div className="relative w-10 h-10 shrink-0 overflow-visible">
            <Image
              src="/logo_lamar.png"
              alt="Applyo Logo"
              fill
              sizes="40px"
              className="object-contain scale-[1.7]"
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-main">Applyo</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
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
        <div className="p-4">
          <div className="px-1 pb-3 text-xs text-hint leading-relaxed">
            <p>Dibuat oleh : Dhio Rizqi</p>
            <p>Version 1.1</p>
          </div>
          <div className="pt-4 border-t border-app">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

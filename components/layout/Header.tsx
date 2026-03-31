"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { MobileNav } from "./MobileNav";
import Image from "next/image";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-app bg-surface/80 backdrop-blur-md px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="lg:hidden flex items-center gap-2">
          <MobileNav />
          <div className="relative w-10 h-10 shrink-0 overflow-visible">
            <Image
              src="/logo_lamar.png"
              alt="Applyo Logo"
              fill
              sizes="40px"
              className="object-contain scale-[1.7]"
            />
          </div>
          <span className="font-bold text-lg text-main">Applyo</span>
        </div>
        
        {/* Page Title would go here normally, or handled per page layout */}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-secondary hover:text-sage"
          suppressHydrationWarning
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
}

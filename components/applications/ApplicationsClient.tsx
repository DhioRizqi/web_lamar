"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddApplicationModal } from "@/components/applications/AddApplicationModal";
import { ApplicationsBoard } from "@/components/applications/ApplicationsBoard";
import { Application } from "@/types";
import { cn } from "@/lib/utils";

interface ApplicationsClientProps {
  initialApplications: Application[];
}

export function ApplicationsClient({ initialApplications }: ApplicationsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return initialApplications;

    return initialApplications.filter((app) => {
      const company = app.company?.toLowerCase() ?? "";
      const position = app.position?.toLowerCase() ?? "";
      return company.includes(query) || position.includes(query);
    });
  }, [initialApplications, searchQuery]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-main">Lamaran Pekerjaan</h1>
          <p className="text-secondary mt-1">Kelola dan pantau semua lamaranmu di sini.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-xl h-10 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Lamaran
        </Button>
      </div>

      <div className="flex items-center justify-between border-b border-app pb-4">
        <div className="flex items-center gap-2 bg-surface p-1 rounded-xl w-full max-w-sm border border-app focus-within:ring-1 focus-within:ring-ring">
           <input 
             type="text" 
             placeholder="Cari perusahaan atau posisi..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-transparent border-none focus:outline-none text-sm px-3 py-1.5 text-main placeholder:text-hint"
           />
        </div>
        <div className="flex gap-2 bg-surface p-1 rounded-xl border border-app">
           <button 
             onClick={() => setViewMode("list")}
             className={cn(
               "px-4 py-1.5 text-sm font-medium rounded-lg transition-colors",
               viewMode === "list" ? "bg-main text-primary shadow-sm" : "text-secondary hover:text-main"
             )}
           >
             List
           </button>
           <button 
             onClick={() => setViewMode("kanban")}
             className={cn(
               "px-4 py-1.5 text-sm font-medium rounded-lg transition-colors",
               viewMode === "kanban" ? "bg-main text-primary shadow-sm" : "text-secondary hover:text-main"
             )}
           >
             Kanban
           </button>
        </div>
      </div>

      <ApplicationsBoard applications={filteredApplications} viewMode={viewMode} />

      <AddApplicationModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}

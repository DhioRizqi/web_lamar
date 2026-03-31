"use client";

import dynamic from "next/dynamic";
import { Application } from "@/types";
import { ApplicationsList } from "./ApplicationsList";

const KanbanBoard = dynamic(
  () => import("./KanbanBoard").then((mod) => mod.KanbanBoard),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center border border-app rounded-2xl w-full text-secondary">
        Memuat papan kanban...
      </div>
    ),
  }
);

interface ApplicationsBoardProps {
  applications: Application[];
  viewMode: "list" | "kanban";
}

export function ApplicationsBoard({ applications, viewMode }: ApplicationsBoardProps) {
  if (applications.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-app rounded-2xl w-full">
        <div className="text-center text-secondary">
          <p>Belum ada lamaran. Klik Tambah Lamaran untuk memulai!</p>
        </div>
      </div>
    );
  }

  if (viewMode === "kanban") {
    return <KanbanBoard applications={applications} />;
  }

  return <ApplicationsList applications={applications} />;
}

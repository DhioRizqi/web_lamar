"use client";

import { Application } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { STATUS_CLASS_MAP, APPLICATION_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Building2, Link as LinkIcon, Calendar, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EditApplicationModal } from "./EditApplicationModal";

export function ApplicationsList({ applications }: { applications: Application[] }) {
  const [mounted, setMounted] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  useEffect(() => setMounted(true), []);
  return (
    <div className="flex flex-col gap-3 w-full animate-in fade-in">
      {applications.map((app) => {
        const statusObj = APPLICATION_STATUSES.find((s) => s.value === app.status);
        
        return (
          <div 
            key={app.id} 
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-surface border border-app hover:border-sage/50 transition-all gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-main border border-app flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-main leading-tight">{app.position}</h3>
                <p className="text-secondary font-medium">{app.company}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-hint">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {mounted ? new Date(app.apply_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    }) : "..."}
                  </span>
                  {app.job_url && (
                    <a href={app.job_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-sage transition-colors">
                      <LinkIcon className="w-3.5 h-3.5" />
                      Link Lowongan
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t border-app sm:border-0 mt-2 sm:mt-0">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 px-2 border-app text-secondary hover:text-main"
                onClick={() => setEditingApp(app)}
              >
                <Pencil className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>
              <span
                className={cn(
                  "px-3 py-1.5 text-sm font-semibold rounded-lg flex items-center gap-2",
                  STATUS_CLASS_MAP[app.status]
                )}
              >
                <span>{statusObj?.emoji}</span>
                {statusObj?.label}
              </span>
              <span className="text-xs text-hint">
                Diperbarui {mounted ? formatDistanceToNow(new Date(app.updated_at), { addSuffix: true, locale: id }) : "..."}
              </span>
            </div>
          </div>
        );
      })}
      {editingApp ? (
        <EditApplicationModal
          open={Boolean(editingApp)}
          onOpenChange={(open) => {
            if (!open) setEditingApp(null);
          }}
          application={editingApp}
        />
      ) : null}
    </div>
  );
}

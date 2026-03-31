"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Application } from "@/types";
import { STATUS_CLASS_MAP, APPLICATION_STATUSES } from "@/lib/constants";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ArrowRight, Building2 } from "lucide-react";
import { useState, useEffect } from "react";

export function RecentApplications({ applications }: { applications: Application[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Lamaran Terbaru</CardTitle>
        <Link href="/applications">
          <Button variant="ghost" className="text-sm text-sage hover:text-sage-hover hover:bg-sage-bg">
            Lihat Semua <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-8 text-secondary">
            Belum ada lamaran. Tambahkan lamaran pertamamu!
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            {applications.map((app) => {
              const statusObj = APPLICATION_STATUSES.find((s) => s.value === app.status);
              return (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface border border-transparent hover:border-app transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-app flex items-center justify-center border border-app">
                      <Building2 className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-main">{app.position}</h4>
                      <p className="text-sm text-secondary">{app.company}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={cn(
                        "px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5",
                        STATUS_CLASS_MAP[app.status]
                      )}
                    >
                      <span>{statusObj?.emoji}</span>
                      {statusObj?.label}
                    </span>
                    <span className="text-xs text-hint">
                      {mounted ? formatDistanceToNow(new Date(app.created_at), { addSuffix: true, locale: id }) : "..."}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Application } from "@/types";
import { format } from "date-fns";
import { APPLICATION_STATUSES, STATUS_CLASS_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Building2, CalendarDays, Sparkles, BriefcaseBusiness } from "lucide-react";

interface ApplicationCalendarProps {
  applications: Application[];
}

export function ApplicationCalendar({ applications }: ApplicationCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const appsOnSelectedDate = applications.filter((app) => {
    if (!date) return false;
    return format(new Date(app.apply_date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
  });
  const datesWithApplications = [...new Set(applications.map((app) => format(new Date(app.apply_date), "yyyy-MM-dd")))]
    .map((day) => new Date(`${day}T00:00:00`));
  const interviewAndOfferCount = applications.filter(
    (app) => app.status === "interview" || app.status === "offer"
  ).length;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6 xl:gap-8 items-start">
      <div className="xl:sticky xl:top-6">
        <div className="rounded-2xl border border-app bg-main/60 p-3 sm:p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            modifiers={{
              hasApplications: datesWithApplications,
            }}
            modifiersClassNames={{
              hasApplications: "after:absolute after:bottom-1.5 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-sage",
            }}
            className="w-full rounded-xl border border-app bg-surface p-3"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-app bg-surface p-4">
            <p className="text-xs text-hint">Aktivitas di tanggal terpilih</p>
            <div className="mt-2 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-sage" />
              <p className="text-2xl font-bold text-main">{appsOnSelectedDate.length}</p>
            </div>
          </div>
          <div className="rounded-xl border border-app bg-surface p-4">
            <p className="text-xs text-hint">Total lamaran</p>
            <div className="mt-2 flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4 text-sage" />
              <p className="text-2xl font-bold text-main">{applications.length}</p>
            </div>
          </div>
          <div className="rounded-xl border border-app bg-surface p-4">
            <p className="text-xs text-hint">Interview + Offer</p>
            <div className="mt-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sage" />
              <p className="text-2xl font-bold text-main">{interviewAndOfferCount}</p>
            </div>
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-main">
          Aktivitas pada {date ? date.toLocaleDateString("id-ID", { dateStyle: "full" }) : "..."}
        </h3>
        <div className="space-y-3 sm:space-y-4 min-h-[320px]">
          {appsOnSelectedDate.length === 0 ? (
            <div className="p-6 rounded-xl bg-surface border border-app text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-main border border-app">
                <CalendarDays className="h-4 w-4 text-hint" />
              </div>
              <p className="text-sm font-medium text-main">Belum ada aktivitas</p>
              <p className="mt-1 text-sm text-secondary">Coba pilih tanggal lain atau tambah lamaran baru.</p>
            </div>
          ) : (
            appsOnSelectedDate.map((app) => {
              const statusObj = APPLICATION_STATUSES.find((s) => s.value === app.status);
              return (
                <div
                  key={app.id}
                  className="p-4 sm:p-5 rounded-xl bg-surface border border-app flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-main flex items-center justify-center border border-app">
                      <Building2 className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-main truncate">{app.position}</h4>
                      <p className="text-sm text-secondary truncate">{app.company}</p>
                      {app.notes ? (
                        <p className="mt-1 text-xs text-hint line-clamp-2">{app.notes}</p>
                      ) : null}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "self-start sm:self-center px-2.5 py-1 text-xs font-semibold rounded-lg inline-flex items-center gap-1 whitespace-nowrap",
                      STATUS_CLASS_MAP[app.status]
                    )}
                  >
                    <span>{statusObj?.emoji}</span>
                    {statusObj?.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

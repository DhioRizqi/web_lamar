import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Application } from "@/types";
import { ApplicationCalendar } from "@/components/calendar/ApplicationCalendar";

export const metadata: Metadata = {
  title: "Kalender - Applyo",
  description: "Lihat jadwal aktivitas lamaran kerjamu",
};

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let applications: Application[] = [];

  if (user) {
    const { data } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("apply_date", { ascending: false });

    if (data) {
      applications = data as Application[];
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-main">Kalender</h1>
          <p className="text-secondary mt-1">Lihat jadwal aktivitas lamaran kerjamu.</p>
        </div>
      </div>

      <div className="glass-card p-4 sm:p-6 lg:p-8 min-h-[560px]">
        <ApplicationCalendar applications={applications} />
      </div>
    </div>
  );
}

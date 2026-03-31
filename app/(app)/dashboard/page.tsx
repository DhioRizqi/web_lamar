import { Metadata } from "next";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentApplications } from "@/components/dashboard/RecentApplications";
import { Briefcase, Send, CheckCircle, XCircle } from "lucide-react";
import { Application } from "@/types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard - Applyo",
  description: "Ringkasan lamaran kerjamu",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let total = 0;
  let inProcess = 0;
  let offers = 0;
  let rejected = 0;
  let recentApps: Application[] = [];

  if (user) {
    const [
      { count: totalCount },
      { count: processCount },
      { count: offersCount },
      { count: rejectedCount }
    ] = await Promise.all([
      supabase.from("applications").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("applications").select("*", { count: "exact", head: true }).eq("user_id", user.id).in("status", ["review", "interview"]),
      supabase.from("applications").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "offer"),
      supabase.from("applications").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "rejected"),
    ]);

    total = totalCount || 0;
    inProcess = processCount || 0;
    offers = offersCount || 0;
    rejected = rejectedCount || 0;

    const { data } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (data) {
      recentApps = data as Application[];
    }
  }

  // Get first name from Google metadata
  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || "";
  const firstName = fullName ? fullName.split(" ")[0] : "Kamu";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-main">Halo, {firstName}! 👋</h1>
        <p className="text-secondary mt-1">Berikut adalah ringkasan progres lamaran kerjamu.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Lamaran"
          value={total}
          icon={Briefcase}
          colorClass="bg-sage-bg text-sage"
        />
        <StatsCard
          title="Sedang Proses"
          value={inProcess}
          icon={Send}
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
        />
        <StatsCard
          title="Dapat Offer"
          value={offers}
          icon={CheckCircle}
          colorClass="bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"
        />
        <StatsCard
          title="Ditolak"
          value={rejected}
          icon={XCircle}
          colorClass="bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <div className="h-full min-h-[400px] glass-card flex items-center justify-center text-secondary border-dashed">
            Belum Ada Data
          </div>
        </div>
        <div className="lg:col-span-3">
          <RecentApplications applications={recentApps} />
        </div>
      </div>
    </div>
  );
}

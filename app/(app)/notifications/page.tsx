import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Application } from "@/types";
import { Bell, Briefcase } from "lucide-react";
import { differenceInDays } from "date-fns";

export const metadata: Metadata = {
  title: "Notifikasi - Applyo",
  description: "Pengingat lamaran kerjamu",
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let notifications: { id: string; company: string; position: string; days: number; userFirstName: string }[] = [];

  if (user) {
    const { data: apps } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "applied");

    if (apps) {
      const today = new Date();
      const firstName = user.user_metadata?.full_name?.split(" ")[0] || "Kerabat";

      apps.forEach((app: Application) => {
        const applyDate = new Date(app.apply_date);
        const diffDays = differenceInDays(today, applyDate);

        // Munculkan notifikasi jika sudah lewat 3 hari, 6 hari, dst (kelipatan 3)
        // Atau jika diffDays >= 3 secara umum. Kita ambil yg diffDays >= 3 aja supaya aman
        if (diffDays >= 3) {
          notifications.push({
            id: app.id,
            company: app.company,
            position: app.position,
            days: diffDays,
            userFirstName: firstName,
          });
        }
      });
      
      // Urutkan dari yang paling lama
      notifications.sort((a, b) => b.days - a.days);
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-main">Notifikasi</h1>
          <p className="text-secondary mt-1">Pengingat agar tidak terlewat kabar dari perusahaan.</p>
        </div>
      </div>

      <div className="glass-card flex flex-col divide-y divide-app">
        {notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-surface border border-app rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-hint" />
             </div>
             <p className="text-secondary font-medium">Belum ada notifikasi baru saat ini.</p>
             <p className="text-sm text-hint mt-1">Notifikasi akan muncul 3 hari setelah lamaran dikirim.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="p-6 flex items-start gap-4 hover:bg-surface/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-sage/20 border border-sage/50 flex flex-shrink-0 items-center justify-center text-sage">
                <Bell className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-main text-lg mb-1">
                  Pengingat Lamaran di {notif.company}
                </h3>
                <p className="text-secondary leading-relaxed">
                  Hai <span className="font-semibold">{notif.userFirstName}</span>, jangan lupa cek aplikasi/email tempat kamu melamar sebagai <span className="font-medium">{notif.position}</span> di <span className="font-medium">{notif.company}</span> ya. Lamaran ini sudah {notif.days} hari sejak dikirim.
                </p>
              </div>
              <div className="text-xs font-semibold text-hint bg-surface px-3 py-1.5 rounded-full border border-app">
                {notif.days} Hari Lalu
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

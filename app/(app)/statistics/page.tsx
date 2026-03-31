import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistik - Applyo",
  description: "Analisis performa lamaran kerjamu",
};

export default function StatisticsPage() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-main">Statistik & Analisis</h1>
        <p className="text-secondary mt-1">Evaluasi tingkat kesuksesan proses pencarian kerjamu.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-card p-6 h-[400px] flex items-center justify-center text-secondary">
          Belum Ada Data
        </div>
        <div className="glass-card p-6 h-[400px] flex items-center justify-center text-secondary">
          Belum Ada Data
        </div>
      </div>
    </div>
  );
}

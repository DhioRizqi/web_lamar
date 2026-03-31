"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Listen for auth state changes (fires when session is established)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace("/dashboard");
      }
    });

    // Also check immediately in case auth already happened
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F6F1]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#7DA87B]/30 border-t-[#7DA87B] rounded-full animate-spin" />
        <p className="text-[#7DA87B] font-semibold">Memproses login...</p>
      </div>
    </div>
  );
}

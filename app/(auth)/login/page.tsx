"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          window.location.href = "/dashboard";
          return;
        }
        setIsCheckingSession(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = "/dashboard";
      } else {
        setIsCheckingSession(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F6F1]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#7DA87B]/30 border-t-[#7DA87B] rounded-full animate-spin" />
          <p className="text-[#7DA87B] font-semibold text-lg">Memproses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full font-sans antialiased relative overflow-hidden bg-[#F8F6F1]">
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <svg className="absolute left-0 top-0 h-full w-full lg:w-[70%] text-[#EAE6DA]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="topo" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 0 30 Q 15 0 30 30 T 60 30" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <path d="M 0 45 Q 15 15 30 45 T 60 45" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <path d="M 0 60 Q 15 30 30 60 T 60 60" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <path d="M 0 15 Q 15 -15 30 15 T 60 15" fill="none" stroke="currentColor" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo)" />
        </svg>
        
        <div className="absolute left-[5%] md:left-[10%] top-[15%] w-5 h-5 rounded-full bg-[#B29986] opacity-70"></div>
        <div className="absolute left-[85%] md:left-[40%] top-[10%] w-3 h-3 rounded-full bg-[#8BA78D] opacity-70"></div>
        <div className="absolute left-[20%] top-[40%] w-6 h-6 border-[3px] border-[#8BA78D] rounded-full opacity-60"></div>
        <div className="absolute left-[30%] md:left-[55%] top-[50%] w-2 h-2 rounded-full bg-[#B29986] opacity-80"></div>
        <div className="absolute left-[15%] md:left-[30%] bottom-[30%] w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-[#8BA78D] opacity-60 rotate-12"></div>
        <div className="absolute left-[70%] md:left-[25%] bottom-[15%] w-8 h-8 border-b-[3px] border-r-[3px] border-[#B29986] rounded-br-[32px] opacity-60 rotate-45"></div>
        <div className="absolute left-[10%] bottom-[40%] w-3 h-3 rounded-md bg-[#DFD6C9] opacity-80 rotate-45"></div>
        
        <div className="absolute hidden lg:block right-[15%] top-[15%] w-[120px] h-[1px] bg-[#D1C8B9]"></div>
        <div className="absolute hidden lg:block right-[12%] top-[15%] w-[8px] h-[8px] border border-[#B29986] rounded-full -translate-y-[3px]"></div>
        <div className="absolute hidden lg:block right-[25%] bottom-[20%] w-[150px] h-[1px] bg-[#D1C8B9]"></div>
        <div className="absolute hidden lg:block right-[25%] bottom-[20%] w-[8px] h-[8px] bg-[#B29986] rounded-full -translate-y-[3px]"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen flex items-center justify-center lg:justify-end px-6 lg:px-0 lg:pr-[15%] pt-10 pb-10">
        <div className="w-full max-w-[440px] flex flex-col items-center lg:items-start text-center lg:text-left bg-transparent">
          
          <div className="flex flex-row items-center justify-center lg:justify-start gap-2 md:gap-4 mb-6">
            <div className="relative w-[120px] h-[120px] md:w-[160px] md:h-[160px] shrink-0 -ml-4">
              <Image 
                src="/logo_lamar.png" 
                alt="Applyo Logo" 
                fill
                sizes="(max-width: 768px) 120px, 160px"
                className="object-contain drop-shadow-sm scale-110"
                priority
              />
            </div>
            <h1 className="text-5xl md:text-[64px] font-extrabold tracking-tight text-[#7DA87B] leading-none">
              Applyo
            </h1>
          </div>
          
          <p className="text-lg md:text-[20px] font-medium text-[#1C1F1D]/80 mb-10 leading-[1.6]">
            Pantau semua lamaran kerjamu dengan mudah. Tidak ada lagi yang terlewat.
          </p>

          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-14 md:h-[60px] text-lg font-bold rounded-xl bg-[#719875] hover:bg-[#5C7F60] text-white shadow-sm flex items-center justify-center gap-3 transition-colors border-0"
          >
            {isLoading ? (
              <span className="w-6 h-6 md:w-7 md:h-7 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <div className="w-8 h-8 md:w-9 md:h-9 bg-white rounded-full flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
            )}
            <span className="font-semibold">{isLoading ? "Memproses..." : "Lanjutkan dengan Google"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

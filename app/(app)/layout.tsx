import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-main overflow-hidden">
      <Sidebar />
      <div className="relative flex-1 flex flex-col h-screen overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-45">
          <svg className="absolute left-0 top-0 h-full w-full lg:w-[75%] text-[#EAE6DA] dark:text-[#2A2D29]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="topo-app" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 0 30 Q 15 0 30 30 T 60 30" fill="none" stroke="currentColor" strokeWidth="0.8" />
                <path d="M 0 45 Q 15 15 30 45 T 60 45" fill="none" stroke="currentColor" strokeWidth="0.8" />
                <path d="M 0 60 Q 15 30 30 60 T 60 60" fill="none" stroke="currentColor" strokeWidth="0.8" />
                <path d="M 0 15 Q 15 -15 30 15 T 60 15" fill="none" stroke="currentColor" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#topo-app)" />
          </svg>
          <div className="absolute left-[8%] top-[14%] w-3 h-3 rounded-full bg-[#B29986] opacity-65" />
          <div className="absolute left-[32%] top-[18%] w-2 h-2 rounded-full bg-[#8BA78D] opacity-70" />
          <div className="absolute left-[18%] top-[42%] w-5 h-5 border-2 border-[#8BA78D] rounded-full opacity-55" />
          <div className="absolute left-[50%] top-[52%] w-2 h-2 rounded-full bg-[#B29986] opacity-70" />
          <div className="absolute left-[14%] bottom-[24%] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-[#8BA78D] opacity-45 rotate-12" />
          <div className="absolute left-[28%] bottom-[16%] w-7 h-7 border-b-2 border-r-2 border-[#B29986] rounded-br-[30px] opacity-45 rotate-45" />
        </div>
        <Header />
        <main className="relative z-10 flex-1 overflow-y-auto p-4 lg:p-8 no-scrollbar">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

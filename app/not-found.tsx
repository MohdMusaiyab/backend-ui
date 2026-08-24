import Link from "next/link";
import { IBM_Plex_Mono } from "next/font/google";
import { ArrowLeft, Terminal } from "lucide-react";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function NotFound() {
  return (
    <main className={`${mono.className} min-h-screen bg-[#121210] text-[#EDE7D8] flex flex-col justify-center items-center px-6 selection:bg-[#B4482F] selection:text-white`}>
      <div className="max-w-[600px] w-full text-center flex flex-col items-center">
        
        <Terminal size={48} className="text-[#B4482F] mb-8 animate-pulse" />
        
        <h1 className="text-[3.5rem] sm:text-[5rem] leading-[1] font-bold tracking-tight text-[#EDE7D8] mb-6">
          404 <span className="text-[#2A2A22] mx-2">|</span> FAULT
        </h1>
        
        <p className="text-[17px] sm:text-[19px] leading-[1.7] font-medium text-[#C9C2AE] mb-12 max-w-[45ch] mx-auto">
          The requested system resource or project architecture could not be located in this directory. 
          <span
            className="ml-2 inline-block motion-safe:animate-pulse text-[#B4482F] motion-reduce:opacity-100"
            aria-hidden="true"
          >
            _
          </span>
        </p>

        <Link 
          href="/" 
          className="group inline-flex items-center gap-3 px-6 py-3 border-2 border-[#2A2A22] hover:border-[#B4482F] text-[14px] uppercase tracking-[0.2em] font-bold text-[#8B6BC4] hover:text-[#EDE7D8] transition-all duration-300"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
          Return to Root Directory
        </Link>

        <div className="mt-24 border-t-2 border-[#2A2A22] pt-6 text-[12px] font-semibold text-[#7A7360] uppercase tracking-widest w-full flex justify-between">
           <span>Status: Offline</span>
           <span>Code: ERR_NOT_FOUND</span>
        </div>
      </div>
    </main>
  );
}

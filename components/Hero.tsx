import { IBM_Plex_Mono } from "next/font/google";
import { ArrowDown } from "lucide-react";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Hero() {
  return (
    <section
      className={`${mono.className} bg-[#121210] text-[#EDE7D8] px-6 py-24 sm:py-32 min-h-[80vh] flex flex-col justify-center`}
    >
      <div className="mx-auto max-w-[800px] w-full">
        {/* minimal header/nav */}
        <div className="flex justify-between items-center mb-20 sm:mb-32 text-[13px] font-semibold text-[#7A7360] tracking-widest uppercase">
           <span>M. Musaiyab</span>
           <div className="flex gap-6">
             <a href="#projects" className="hover:text-[#8B6BC4] transition-colors">Projects</a>
             <a href="https://github.com/MohdMusaiyab/backend" target="_blank" rel="noreferrer" className="hover:text-[#8B6BC4] transition-colors">Github</a>
           </div>
        </div>

        {/* title */}
        <h1 className="text-[4rem] leading-[1] font-bold tracking-tight sm:text-[6rem] mb-12">
          Backend
          <br />
          Practice
          <span
            className="ml-2 inline-block motion-safe:animate-pulse text-[#B4482F] motion-reduce:opacity-100"
            aria-hidden="true"
          >
            _
          </span>
        </h1>

        {/* intro */}
        <div className="max-w-[65ch]">
          <p className="text-[17px] sm:text-[19px] leading-[1.7] font-medium text-[#C9C2AE] mb-8">
            Hi, I&apos;m Mohd Musaiyab. I&apos;m a developer focusing on robust system architecture and scalable engineering.
            <br/><br/>
            This space serves as a dedicated showcase and documentation hub for my backend projects. It provides deeper insights into the system architectures, technical decisions, and the actual code behind the APIs, queues, and distributed systems I build.
          </p>
        </div>
        
        {/* action */}
        <div className="mt-12">
           <a href="#projects" className="inline-flex items-center gap-3 text-[14px] uppercase tracking-[0.2em] font-bold text-[#8B6BC4] hover:text-[#B4482F] transition-colors">
              Explore Projects <ArrowDown size={16} />
           </a>
        </div>
      </div>
    </section>
  );
}
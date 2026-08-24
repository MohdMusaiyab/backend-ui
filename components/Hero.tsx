"use client";

import { useState, useEffect } from "react";
import { IBM_Plex_Mono } from "next/font/google";
import { ArrowDown } from "lucide-react";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ROLES = ["backend developer", "full-stack developer"];
const MAX_LEN = Math.max(...ROLES.map((r) => r.length));

// pad shorter strings with non-breaking spaces so character
// columns stay aligned and there's no layout shift on switch
const pad = (str: string) => str.padEnd(MAX_LEN, "\u00A0");

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((current) => (current === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const role = pad(ROLES[roleIndex]);

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
            Mohd Musaiyab —{" "}
            <span
              className="inline-flex text-[#EDE7D8] font-bold overflow-hidden align-bottom"
              style={{ height: "1.4em" }}
              aria-live="polite"
            >
              {role.split("").map((char, i) => (
                <span
                  key={`${roleIndex}-${i}`}
                  className="inline-block motion-safe:animate-reel-char motion-reduce:opacity-100"
                  style={{
                    animationDelay: `${i * 25}ms`,
                    whiteSpace: "pre",
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
            <br />
            <br />
            A working log of systems built from scratch: APIs, concurrency, queues, real-time delivery. Documented as I go. No shortcuts, minimal AI.
          </p>
        </div>

        {/* action */}
        <div className="mt-12">
          <a href="#projects" className="inline-flex items-center gap-3 text-[14px] uppercase tracking-[0.2em] font-bold text-[#8B6BC4] hover:text-[#B4482F] transition-colors">
            Explore Projects <ArrowDown size={16} />
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes reel-char {
          0% {
            transform: translateY(60%) rotateX(60deg);
            opacity: 0;
          }
          60% {
            transform: translateY(-8%) rotateX(-10deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0) rotateX(0deg);
            opacity: 1;
          }
        }
        .animate-reel-char {
          animation: reel-char 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
          transform-origin: top center;
        }
      `}</style>
    </section>
  );
}
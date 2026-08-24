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

const pad = (str: string) => str.padEnd(MAX_LEN, "\u00A0");

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // modulo instead of a hardcoded 0/1 flip -- scales to any ROLES.length
      setRoleIndex((current) => (current + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const role = pad(ROLES[roleIndex]);

  return (
    <section
      className={`${mono.className} bg-[#121210] text-[#EDE7D8] px-6 py-24 sm:py-32 min-h-[80vh] flex flex-col justify-center`}
    >
      <div className="mx-auto max-w-[800px] w-full">
        <div className="flex justify-between items-center mb-20 sm:mb-32 text-[13px] font-semibold text-[#7A7360] tracking-widest uppercase">
          <span>M. Musaiyab</span>
          <div className="flex gap-6">
            <a
              href="#projects"
              className="hover:text-[#8B6BC4] transition-colors"
            >
              Projects
            </a>
            <a
              href="https://github.com/MohdMusaiyab/backend"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#8B6BC4] transition-colors"
            >
              Github
            </a>
          </div>
        </div>

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

        <div className="max-w-[65ch]">
          <p className="text-[17px] sm:text-[19px] leading-[1.7] font-medium text-[#C9C2AE] mb-8">
            Mohd Musaiyab —{" "}
            {/* inline-block (not flex) so this shares a normal baseline
                with the "Mohd Musaiyab —" text before it. perspective
                still lives here for the children's rotateX to render
                as real 3D, but nothing here forces a fixed line-height
                or height anymore -- that was the alignment bug. */}
            <span
              className="inline-block text-[#EDE7D8] font-bold align-baseline"
              style={{ perspective: "300px", lineHeight: "inherit" }}
              aria-live="polite"
            >
              {role.split("").map((char, i) => (
                <span
                  key={`${roleIndex}-${i}`}
                  className="inline-block animate-reel-char"
                  style={{
                    // flat, sequential, left-to-right -- letter 1 flips,
                    // then letter 2, then letter 3 ... a proper cascade
                    // instead of grouping/flying in from off-screen
                    animationDelay: `${i * 45}ms`,
                    whiteSpace: "pre",
                    transformOrigin: "center top",
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
            <br />
            <br />A working log of systems built from scratch: APIs,
            concurrency, queues, real-time delivery. Documented as I go. No
            shortcuts, minimal AI.
          </p>
        </div>

        <div className="mt-12">
          <a
            href="#projects"
            className="inline-flex items-center gap-3 text-[14px] uppercase tracking-[0.2em] font-bold text-[#8B6BC4] hover:text-[#B4482F] transition-colors"
          >
            Explore Projects <ArrowDown size={16} />
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes reel-char {
          0% {
            /* hinged flat, folded up and away -- like a split-flap
               board flap standing on end before it drops */
            transform: rotateX(85deg);
            opacity: 0.3;
          }
          100% {
            /* flap falls down around its top edge and lands flush --
               no translateY needed, the rotation itself reads as the
               letter "dropping" into place */
            transform: rotateX(0deg);
            opacity: 1;
          }
        }
        .animate-reel-char {
          animation: reel-char 260ms cubic-bezier(0.5, 0, 0.15, 1) both;
          backface-visibility: hidden;
        }
        /* real media query instead of a fake Tailwind variant --
           motion-safe:/motion-reduce: only work on classes Tailwind
           itself generates, never on custom classes like this one */
        @media (prefers-reduced-motion: reduce) {
          .animate-reel-char {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}

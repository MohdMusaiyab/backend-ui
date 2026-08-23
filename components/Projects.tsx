"use client";

import React from "react";
import { IBM_Plex_Mono } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import projectsData from "../data/projects.json";
import Link from "next/link";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function Projects() {
  return (
    <section id="projects" className={`${mono.className} w-full bg-[#121210] text-[#EDE7D8] px-6 py-24 sm:py-32 border-t-2 border-[#2A2A22]`}>
      <div className="mx-auto max-w-[1000px]">
        <div className="mb-16">
          <h2 className="text-[2rem] sm:text-[3rem] font-bold tracking-tight mb-4 text-[#EDE7D8]">
            System Architectures
          </h2>
          <p className="text-[16px] text-[#C9C2AE] font-medium max-w-[60ch]">
            A technical gallery of backend implementations, exploring concurrent execution, distributed queues, and scalable patterns.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(320px,auto)]">
          {projectsData.map((project, index) => {
            const isWide = index === 0 || index === 3;
            
            return (
              <div 
                key={project.id} 
                className={`group relative flex flex-col justify-between p-8 border-2 border-[#2A2A22] bg-[#161614] hover:bg-[#1A1A18] transition-colors duration-300 ${isWide ? 'md:col-span-2' : 'md:col-span-1'}`}
              >
                {/* Decorative background grid pattern for wide items */}
                {isWide && (
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                )}

                <div className="relative z-10 flex justify-between items-start mb-12">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#2A2A22] text-[#8B6BC4] text-[10px] uppercase tracking-widest font-bold">
                      {project.category}
                    </span>
                  </div>
                  <Link href={`/projects/${project.id}`} className="text-[#7A7360] hover:text-[#B4482F] transition-colors">
                    <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>

                <div className="relative z-10">
                  <Link href={`/projects/${project.id}`}>
                    <h3 className="text-[24px] font-bold text-[#EDE7D8] mb-3 group-hover:text-[#8B6BC4] transition-colors cursor-pointer inline-block">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="text-[14px] leading-[1.6] text-[#C9C2AE] font-medium mb-8 max-w-[50ch]">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map(tech => (
                      <span key={tech} className="text-[10px] uppercase tracking-[0.15em] font-semibold text-[#7A7360] border border-[#2A2A22] px-2 py-1 bg-[#121210] hover:border-[#B4482F] hover:text-[#EDE7D8] hover:scale-105 transition-all duration-300 cursor-default">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

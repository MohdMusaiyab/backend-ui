"use client";

import React from "react";
import { motion } from "framer-motion";
import { projects } from "../data/projects";
import { FolderGit2 } from "lucide-react";

export function Projects() {
  return (
    <section id="projects" className="w-full px-6 md:px-12 max-w-7xl mx-auto z-10 py-24 border-t border-zinc-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-6">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-serif tracking-tight text-brand-ink mb-4"
          >
            System <span className="italic font-light text-zinc-400">Implementations</span>
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
             className="text-zinc-500 font-light max-w-lg"
          >
            Exploring concurrent execution, queues, and scalable patterns.
          </motion.p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col"
          >
            {/* Visual placeholder for the system diagram / architecture */}
            <div className="w-full aspect-[4/3] bg-brand-sand border border-zinc-200 mb-8 p-6 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 group-hover:border-brand-rust/30">
               {/* Minimal abstract representation of code/system */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_16px]"></div>
               <FolderGit2 size={32} className="text-zinc-300 mb-4 group-hover:scale-110 group-hover:text-brand-rust transition-all duration-500" />
               <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">Architecture Diagram</div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-rust">
                {project.category}
              </span>
              <div className="h-[1px] flex-1 bg-zinc-100"></div>
            </div>

            <h3 className="text-2xl font-serif text-brand-ink mb-3 group-hover:text-brand-rust transition-colors duration-300">
              {project.title}
            </h3>
            
            <p className="text-zinc-600 font-light text-sm leading-relaxed mb-6 flex-1">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-zinc-100">
              {project.techStack.map(tech => (
                <span key={tech} className="text-[10px] uppercase tracking-widest font-mono text-zinc-500">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full px-6 py-8 md:px-12 flex justify-between items-center z-10 relative max-w-7xl mx-auto"
    >
      <div className="font-serif italic text-2xl font-semibold tracking-tight text-brand-rust flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-brand-rust"></div>
        BackendGallery
      </div>
      <nav className="flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-zinc-500">
        <a href="#projects" className="hover:text-brand-ink transition-colors duration-300">Systems</a>
        <a href="https://github.com/MohdMusaiyab/backend" target="_blank" rel="noreferrer" className="hover:text-brand-ink transition-colors duration-300">Repository</a>
      </nav>
    </motion.header>
  );
}

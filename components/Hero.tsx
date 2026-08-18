"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";

const display = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

type Service = {
  name: string;
  stack: string;
  bars: number[]; // 0–1, static so there's no hydration mismatch
};

const SERVICES: Service[] = [
  {
    name: "REST API",
    stack: "Go · PostgreSQL",
    bars: [0.9, 1, 1, 0.95, 1, 1, 0.4, 1, 1, 1, 0.9, 1, 1, 1, 0.85, 1, 1, 1, 1, 0.95, 1, 1, 1, 1],
  },
  {
    name: "Booking Engine",
    stack: "Node.js · Postgres",
    bars: [1, 1, 0.9, 1, 1, 1, 1, 0.6, 1, 1, 1, 0.95, 1, 1, 1, 1, 0.9, 1, 1, 1, 0.8, 1, 1, 1],
  },
  {
    name: "Worker Pool",
    stack: "Go · Redis",
    bars: [1, 0.85, 1, 1, 1, 0.7, 1, 1, 1, 1, 1, 0.9, 1, 1, 0.95, 1, 1, 1, 1, 1, 0.75, 1, 1, 1],
  },
  {
    name: "Cache Layer",
    stack: "Redis",
    bars: [1, 1, 1, 0.95, 1, 1, 1, 1, 0.9, 1, 1, 1, 0.6, 1, 1, 1, 1, 0.95, 1, 1, 1, 1, 0.9, 1],
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i, ease: [0.16, 1, 0.3, 1] },
  }),
};

function StatusDot({ size = 8 }: { size?: number }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {!shouldReduceMotion && (
        <motion.span
          className="absolute inline-flex rounded-full bg-emerald-500"
          style={{ width: size, height: size }}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: [0.5, 0], scale: [1, 2.6] }}
          transition={{ duration: 1.6, repeat: 2, repeatDelay: 0.4, ease: "easeOut" }}
        />
      )}
      <span
        className="relative inline-flex rounded-full bg-emerald-500"
        style={{ width: size, height: size }}
      />
    </span>
  );
}

function Sparkline({ bars, delay }: { bars: number[]; delay: number }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="flex items-end gap-[3px] h-10">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={shouldReduceMotion ? undefined : { scaleY: 0 }}
          animate={shouldReduceMotion ? undefined : { scaleY: 1 }}
          transition={{
            duration: 0.4,
            delay: shouldReduceMotion ? 0 : delay + i * 0.012,
            ease: "easeOut",
          }}
          style={{ height: `${h * 100}%`, transformOrigin: "bottom" }}
          className={`w-[3px] rounded-[1px] ${
            h < 0.7 ? "bg-emerald-300" : "bg-emerald-500"
          }`}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full bg-white px-6 md:px-12">
      {/* faint dot-grid, dashboard texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(#00000014 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to bottom, black, transparent 70%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto pt-20 pb-24">
        {/* status bar */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className={`${mono.className} flex items-center justify-between border-b border-gray-200 pb-4 mb-14 text-[11px] uppercase tracking-[0.14em] text-gray-400`}
        >
          <span className="flex items-center gap-2">
            <StatusDot />
            <span className="text-gray-600">portfolio</span> / status
          </span>
          <span>4 services · 0 incidents</span>
        </motion.div>

        {/* headline */}
        <motion.h1
          custom={0.1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className={`${display.className} text-6xl sm:text-7xl md:text-[6rem] font-semibold tracking-tight leading-[0.95] text-gray-900`}
        >
          All systems
          <br />
          <span className="text-emerald-600">operational.</span>
        </motion.h1>

        <motion.p
          custom={0.22}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-7 max-w-lg text-lg text-gray-500 font-light leading-relaxed"
        >
          Backend engineer. Four services shipped independently, built to hold
          up under real concurrency — not just pass a demo.
        </motion.p>

        <motion.button
          custom={0.32}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          onClick={scrollToProjects}
          className={`${mono.className} group mt-10 inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.14em] text-gray-900 w-fit`}
        >
          <span className="border-b border-gray-900 pb-0.5">view the work log</span>
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </motion.button>

        {/* service grid */}
        <motion.div
          custom={0.42}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200"
        >
          {SERVICES.map((s, i) => (
            <div key={s.name} className="bg-white p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span
                  className={`${display.className} text-sm font-medium text-gray-900`}
                >
                  {s.name}
                </span>
                <StatusDot size={6} />
              </div>
              <Sparkline bars={s.bars} delay={0.6 + i * 0.08} />
              <span className={`${mono.className} text-[10px] uppercase tracking-wide text-gray-400`}>
                {s.stack}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
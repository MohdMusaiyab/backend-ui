import React from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Projects } from "../components/Projects";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative bg-white overflow-hidden">
      {/* Super subtle grid background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <Header />
      <Hero />
      <Projects />

      {/* Decorative vertical lines for structure */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] bg-zinc-100 z-0 hidden md:block pointer-events-none"></div>
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] bg-zinc-100 z-0 hidden md:block pointer-events-none"></div>
    </main>
  );
}

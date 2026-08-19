import React from "react";
import Hero from "@/components/Hero";
import { Projects } from "../components/Projects";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative bg-[#121210] overflow-hidden">
      {/* Background for the rest of the page can be updated later, setting to dark for now to avoid harsh clash with hero */}
      <Hero />
      <Projects />
    </main>
  );
}

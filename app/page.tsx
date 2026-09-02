import React from "react";
import Hero from "@/components/Hero";
import { Projects } from "../components/Projects";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative bg-[#121210] overflow-hidden">
      <Hero />
      <Projects />
      <Footer />
    </main>
  );
}

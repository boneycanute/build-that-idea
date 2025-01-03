"use client";

import React from "react";
import { motion } from "framer-motion";
import Particles from "@/components/ui/particles";

const Page = () => {
  // Animation variants for text elements
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <main className="h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-black text-white">
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={"#C53AAE"}
        refresh
      />
      {/* Left section - Typography */}
      <motion.section
        className="w-full lg:w-3/5 h-full flex items-center justify-center p-8"
        initial="hidden"
        animate="visible"
        variants={textVariants}
      >
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 --font-neue-montreal">
            That idea.
            <span className="block mt-2" style={{ color: "#C53AAE" }}>
              Yeah, THAT idea.
            </span>
          </h1>
          <p className="text-xl md:text-2xl opacity-80">
            The one you can't stop thinking about.
          </p>
        </div>
      </motion.section>

      {/* Right section - SVG Animations */}
      <section className="w-full lg:w-2/5 h-full flex items-center justify-center p-8  border-white/10">
        <div className="w-full max-w-md aspect-square bg-white/5 rounded-lg flex items-center justify-center">
          <p className="text-white/50">SVG Animations will appear here</p>
        </div>
      </section>
    </main>
  );
};

export default Page;

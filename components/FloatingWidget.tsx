"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideChevronRight, X, Check } from "lucide-react";

export default function FloatingWidget() {
  const [mounted, setMounted] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const spring = {
    type: "spring",
    stiffness: 400,
    damping: 60,
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {(isWidgetOpen || isInfoOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white/10 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
            onClick={() => {
              setIsWidgetOpen(false);
              setIsInfoOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Widget Container */}
      <AnimatePresence mode="wait">
        {!isWidgetOpen && !isInfoOpen ? (
          // Closed State
          <motion.div
            layout
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: spring,
            }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-8 mx-auto left-0 right-0 bg-black/70 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg w-[280px]"
            style={{ zIndex: 9999 }}
          >
            <motion.div layout className="p-6 flex flex-col items-center">
              {/* Top Controls */}
              <div className="flex justify-between w-full mb-4">
                <button
                  onClick={() => setIsInfoOpen(true)}
                  className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/60 text-sm hover:bg-white/10 transition-colors"
                >
                  i
                </button>
                <div
                  className="w-10 h-6 bg-white/10 rounded-full relative cursor-pointer"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                >
                  <motion.div
                    layout
                    transition={spring}
                    className={`absolute w-5 h-5 rounded-full top-0.5 bg-white ${
                      isDarkMode ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </div>
              </div>

              <motion.h2 layout className="text-xl font-medium text-white mb-4">
                BuildThatApp
              </motion.h2>

              <motion.button
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsWidgetOpen(true)}
                className="w-full bg-white text-black rounded-xl py-3 px-4 flex items-center justify-between group hover:bg-gray-100 transition-colors"
              >
                <span>Join the waiting list</span>
                <LucideChevronRight
                  className="group-hover:translate-x-1 transition-transform duration-300"
                  size={18}
                />
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          // Open State Container - Using mx-auto approach for consistent centering
          <motion.div
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: spring,
            }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed top-1/2 mx-auto left-0 right-0 -mt-[180px] w-fit"
            style={{ zIndex: 9999 }}
          >
            {/* Header */}
            <motion.div
              layout
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, ...spring }}
              className="bg-black text-white rounded-full px-4 py-2 mb-4 mx-auto flex items-center justify-between gap-4 w-fit"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsWidgetOpen(false);
                  setIsInfoOpen(false);
                }}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={18} strokeWidth={3} className="text-white/60" />
              </motion.button>
              <span className="text-white">Join waiting list</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <Check size={18} strokeWidth={3} className="text-green-400" />
              </motion.button>
            </motion.div>

            {/* Content */}
            <motion.div
              layout
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, ...spring }}
              className="bg-zinc-900 rounded-3xl p-6 shadow-lg w-[280px] mx-auto"
            >
              {isInfoOpen ? (
                <motion.div layout className="space-y-4 text-center">
                  <div className="text-xs text-white/60">0.0.1</div>
                  <div className="text-xl font-medium text-white">
                    BuildThatApp
                  </div>
                  <p className="text-white/80">
                    Build your next big idea
                    <br />
                    with our step-by-step guide
                  </p>
                  <div className="bg-white/10 text-white rounded-full px-4 py-2 text-sm">
                    http://buildthatapp.com
                  </div>
                </motion.div>
              ) : (
                <motion.div layout className="space-y-3">
                  <input
                    type="text"
                    placeholder="Type your name..."
                    className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/20 transition-shadow"
                  />
                  <input
                    type="email"
                    placeholder="Type your email..."
                    className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/20 transition-shadow"
                  />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

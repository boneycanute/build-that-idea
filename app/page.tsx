"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ChevronRight, X, Check } from "lucide-react";

const LoadingCat = () => (
  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="relative w-16 h-[51px]">
      <Image
        src="/loadcat.gif"
        alt="Loading..."
        fill
        className="object-contain"
        priority
      />
    </div>
  </div>
);

export default function Home() {
  const [isBuffering, setIsBuffering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [widgetWidth, setWidgetWidth] = useState<number>(0);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const videoUrl =
    "https://wnrltivdaalwykzlblpr.supabase.co/storage/v1/object/sign/typography/BTI.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0eXBvZ3JhcGh5L0JUSS5tcDQiLCJpYXQiOjE3MzYyNTEzMDEsImV4cCI6MzE3MDk2MjUxMzAxfQ.TIh2tU1ZIarkFhmYaAAowyeLevBvBBPtneFTN0kog4o&t=2025-01-07T12%3A01%3A38.008Z";

  const spring = {
    type: "spring",
    stiffness: 400,
    damping: 60,
  };

  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsBuffering(true);
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling video:", error);
    } finally {
      setIsBuffering(false);
    }
  };

  useEffect(() => {
    const updateWidth = () => {
      if (videoRef.current) {
        const rect = videoRef.current.getBoundingClientRect();
        setWidgetWidth(rect.width);
        setIsVideoReady(true);
      }
    };

    const resizeObserver = new ResizeObserver(updateWidth);
    if (videoRef.current) {
      resizeObserver.observe(videoRef.current);
      videoRef.current.addEventListener("loadeddata", updateWidth);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadeddata", updateWidth);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black">
      <main className="w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        <div ref={containerRef} className="flex flex-col items-center gap-8">
          {/* Video Container */}
          <div className="relative group">
            <video
              ref={videoRef}
              className="h-[70vh] w-auto rounded-2xl shadow-2xl"
              playsInline
              loop
              preload="auto"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>

            <button
              onClick={togglePlayPause}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       bg-black/50 hover:bg-black/70 transition-all duration-300 
                       w-16 h-16 rounded-full flex items-center justify-center
                       backdrop-blur-sm hover:scale-105
                       ${
                         isPlaying
                           ? "opacity-0 group-hover:opacity-100"
                           : "opacity-100"
                       }`}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </button>
          </div>

          {/* Closed Widget State */}
          {!isWidgetOpen && !isInfoOpen && isVideoReady && (
            <motion.div
              layout
              style={{ width: `${widgetWidth}px` }}
              className="backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg overflow-hidden bg-black/70"
            >
              <motion.div layout className="p-6 flex flex-col items-center">
                <div className="flex items-center justify-center mb-4 relative w-full">
                  <button
                    onClick={() => setIsInfoOpen(true)}
                    className="absolute left-0 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/60 text-sm hover:bg-white/10 transition-colors"
                  >
                    i
                  </button>
                  <motion.h2
                    layout
                    className="text-xl font-medium text-white mx-auto"
                  >
                    Build That Idea
                  </motion.h2>
                </div>

                <motion.button
                  layout
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsWidgetOpen(true)}
                  className="w-full bg-white text-black rounded-xl py-3 px-4 flex items-center justify-between group hover:bg-gray-100 transition-colors"
                >
                  <span>Join the waiting list</span>
                  <ChevronRight
                    className="group-hover:translate-x-1 transition-transform duration-300"
                    size={18}
                  />
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {isBuffering && <LoadingCat />}
        </div>
      </main>

      {/* Modal Portal */}
      <AnimatePresence>
        {(isWidgetOpen || isInfoOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setIsWidgetOpen(false);
                setIsInfoOpen(false);
              }}
            />

            <motion.div
              layout
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={spring}
              className="relative w-[280px] max-w-[90vw] m-4"
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
                <span className="text-white">
                  {isInfoOpen ? "About" : "Join waiting list"}
                </span>
                {!isInfoOpen && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Check
                      size={18}
                      strokeWidth={3}
                      className="text-green-400"
                    />
                  </motion.button>
                )}
              </motion.div>

              {/* Modal Content */}
              <motion.div
                layout
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, ...spring }}
                className="bg-zinc-900 rounded-3xl p-6 shadow-lg w-full"
              >
                {isInfoOpen ? (
                  <motion.div layout className="space-y-4 text-center">
                    <div className="text-xs text-white/60">0.0.1</div>
                    <div className="text-xl font-medium text-white">
                      BuildThatIdea
                    </div>
                    <p className="text-white/80">
                      Build your next big idea
                      <br />
                      with our AI Companion
                    </p>
                    <div className="bg-white/10 text-white rounded-full px-4 py-2 text-sm">
                      http://buildthatidea.com
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
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

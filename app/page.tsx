"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Play, Pause, ChevronRight, X, Check } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  // Video and UI States
  const [isBuffering, setIsBuffering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [widgetWidth, setWidgetWidth] = useState<number>(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [isChevronRotated, setIsChevronRotated] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    idea: "",
  });

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Constants
  const videoUrl =
    "https://iihjwfaismtsxlakbniw.supabase.co/storage/v1/object/sign/buildThatIdea/BTI.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJidWlsZFRoYXRJZGVhL0JUSS5tcDQiLCJpYXQiOjE3MzYzMjAzNDYsImV4cCI6MzMyNzIzMjAzNDZ9.Y4S6yNU3w-wSvsxA4eR_gqhiWg5HMqltzcyOnHBrghM&t=2025-01-08T07%3A12%3A22.946Z";

  const smoothTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 1,
  };

  // Handlers
  const calculateVideoWidth = () => {
    const videoHeight = window.innerHeight * 0.7;
    const aspectRatio = 9 / 16;
    return videoHeight * aspectRatio;
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setIsWidgetOpen(false);
    setIsInfoOpen(false);
    setIsChevronRotated(false);
    setTimeout(() => {
      setIsModalClosing(false);
    }, 300);
  };

  const handleOpenModal = () => {
    setIsChevronRotated(true);
    setTimeout(() => {
      setIsWidgetOpen(true);
    }, 250);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || data.error, {
          description: "Please try again with a different email",
        });
        return;
      }

      toast.success(data.message, {
        description: "We'll keep you updated with the latest news",
      });

      // Clear form and close modal
      setFormData({ name: "", email: "", idea: "" });
      handleCloseModal();
    } catch (error) {
      toast.error("Something went wrong!", {
        description: "Please try again later",
      });
    }
  };

  // Effects
  useEffect(() => {
    setWidgetWidth(calculateVideoWidth());
    setIsVideoReady(true);

    const handleResize = () => {
      setWidgetWidth(calculateVideoWidth());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black">
      <DotPattern
        width={32}
        height={32}
        cx={2}
        cy={2}
        cr={1.5}
        className={cn(
          "opacity-40",
          "fill-white",
          "[mask-image:radial-gradient(1200px_circle_at_center,white,transparent)]"
        )}
      />

      <main className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        <LayoutGroup>
          <motion.div
            ref={containerRef}
            className="flex flex-col items-center"
            layout="position"
            transition={smoothTransition}
          >
            <motion.div
              className="relative group"
              layout="position"
              transition={smoothTransition}
            >
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
            </motion.div>

            <AnimatePresence mode="wait">
              {!isWidgetOpen &&
              !isInfoOpen &&
              isVideoReady &&
              !isModalClosing ? (
                <motion.div
                  key="closed-widget"
                  layout="position"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={smoothTransition}
                  style={{ width: `${widgetWidth}px` }}
                  className="backdrop-blur-lg border border-black/20 rounded-2xl shadow-lg overflow-hidden bg-white mt-8"
                >
                  <motion.div
                    layout="position"
                    className="p-6 flex flex-col items-center"
                  >
                    <div className="flex items-center justify-center mb-4 relative w-full">
                      <button
                        onClick={() => setIsInfoOpen(true)}
                        className="absolute left-0 w-6 h-6 rounded-full border border-black flex items-center justify-center text-black text-sm hover:bg-black/10 transition-colors"
                      >
                        i
                      </button>
                      <motion.h2
                        layout="position"
                        className="text-xl font-medium text-black mx-auto"
                      >
                        Build That Idea
                      </motion.h2>
                    </div>

                    <motion.button
                      layout="position"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleOpenModal}
                      className="w-full bg-black text-white rounded-xl py-3 px-4 flex items-center justify-between group transition-colors"
                    >
                      <span>Join the waiting list</span>
                      <motion.div
                        animate={{ rotate: isChevronRotated ? -90 : 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
                      >
                        <ChevronRight
                          className="transition-transform duration-300"
                          size={18}
                        />
                      </motion.div>
                    </motion.button>
                  </motion.div>
                </motion.div>
              ) : isWidgetOpen || isInfoOpen ? (
                <motion.div
                  key="modal"
                  className="fixed inset-0 z-50 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={handleCloseModal}
                  />

                  <motion.div
                    layout="position"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={smoothTransition}
                    className="relative w-[280px] max-w-[90vw] m-4"
                  >
                    <motion.div
                      layout="position"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, ...smoothTransition }}
                      className="bg-white text-black rounded-full px-4 py-2 mb-4 mx-auto flex items-center justify-between gap-4 w-fit"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCloseModal}
                        className="p-1 hover:bg-black/10 rounded-full transition-colors"
                      >
                        <X
                          size={18}
                          strokeWidth={3}
                          className="text-black/60"
                        />
                      </motion.button>
                      <span className="text-black">
                        {isInfoOpen ? "About" : "Join waiting list"}
                      </span>
                      {!isInfoOpen && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 hover:bg-black/10 rounded-full transition-colors"
                          onClick={handleSubmit}
                        >
                          <Check
                            size={18}
                            strokeWidth={3}
                            className="text-green-600"
                          />
                        </motion.button>
                      )}
                    </motion.div>

                    <motion.div
                      layout="position"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, ...smoothTransition }}
                      className="bg-white rounded-3xl p-6 shadow-lg w-full"
                    >
                      {isInfoOpen ? (
                        <motion.div
                          layout="position"
                          className="space-y-4 text-center"
                        >
                          <div className="text-xs text-black/60">0.0.1</div>
                          <div className="text-xl font-medium text-black">
                            BuildThatIdea
                          </div>
                          <p className="text-black/80">
                            Build your next big idea
                            <br />
                            with our AI Companion
                          </p>
                          <div className="bg-black/10 text-black rounded-full px-4 py-2 text-sm">
                            http://buildthatidea.com
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div layout="position" className="space-y-3">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Type your name..."
                            required
                            className="w-full p-4 rounded-xl bg-black/10 text-black placeholder-black/40 outline-none focus:ring-2 focus:ring-black/20 transition-shadow"
                          />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Type your email..."
                            required
                            className="w-full p-4 rounded-xl bg-black/10 text-black placeholder-black/40 outline-none focus:ring-2 focus:ring-black/20 transition-shadow"
                          />
                          <input
                            type="text"
                            name="idea"
                            value={formData.idea}
                            onChange={handleInputChange}
                            placeholder="What's your Idea..."
                            required
                            className="w-full p-4 rounded-xl bg-black/10 text-black placeholder-black/40 outline-none focus:ring-2 focus:ring-black/20 transition-shadow"
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {isBuffering && <LoadingCat />}
          </motion.div>
        </LayoutGroup>
      </main>
    </div>
  );
}

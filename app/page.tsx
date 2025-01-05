"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ClientParticles from "@/components/ClientParticles";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

const LoadingCat = () => (
  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="relative w-16 h-[51px]">
      <Image
        src="/loadcat.gif"
        alt="Loading..."
        fill
        className="object-contain"
      />
    </div>
  </div>
);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  useEffect(() => {
    async function getGifUrl() {
      try {
        const { data, error: downloadError } = await supabase.storage
          .from("typography")
          .download("looped render.gif");

        if (downloadError) throw new Error(downloadError.message);

        const url = URL.createObjectURL(data);
        setGifUrl(url);
      } catch (error) {
        console.error("Error loading animation:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getGifUrl();

    return () => {
      if (gifUrl && gifUrl.startsWith("blob:")) {
        URL.revokeObjectURL(gifUrl);
      }
    };
  }, []);

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-black">
      <ClientParticles />

      {isLoading && <LoadingCat />}

      {gifUrl && (
        <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 md:p-8 mb-32">
          <motion.div
            className="w-full max-w-[1280px] relative"
            style={{
              aspectRatio: "16/9",
              overflow: "hidden",
            }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 },
            }}
          >
            <div className="absolute inset-0 -top-[15%]">
              {" "}
              {/* Adjust -top-[15%] value as needed */}
              <Image
                src={gifUrl}
                alt="Typography Animation"
                fill
                priority
                className="object-cover rounded-2xl shadow-2xl"
                sizes="(max-width: 768px) 80vw, (max-width: 1280px) 90vw"
                onLoadingComplete={() => setIsLoading(false)}
                onError={(e) => {
                  console.error("Image loading error:", e);
                  setIsLoading(false);
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}

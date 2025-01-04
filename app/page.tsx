"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  EnhancedTypingAnimation,
  AnimationStep,
} from "@/components/EnhancedTypingAnimation";
import ClientParticles from "@/components/ClientParticles";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

// Define all animation steps with precise configuration
const ANIMATION_STEPS: AnimationStep[] = [
  {
    id: 1,
    text: "An Idea",
    position: "center",
    scaleUp: true,
    typewriterEffect: true,
    initialPosition: "center",
    delay: 500,
  },
  {
    id: 2,
    text: "Every great idea starts as a spark",
    position: "left",
    typewriterEffect: true,
    moveToPosition: "left",
    highlightWords: ["spark"],
    delay: 300,
  },
  {
    id: 3,
    text: "That spark becomes a vision",
    position: "left",
    typewriterEffect: true,
    retainFromPrevious: true,
    retainWords: 1,
    highlightWords: ["spark", "vision"],
  },
  {
    id: 4,
    text: "The one you can't stop thinking about",
    position: "left",
    typewriterEffect: true,
    highlightWords: ["one"],
    retainFromPrevious: false,
  },
  {
    id: 5,
    text: "The one that keeps you up at night",
    position: "left",
    typewriterEffect: true,
    retainFromPrevious: true,
    retainWords: 2,
    highlightWords: ["one"],
  },
  {
    id: 6,
    text: "It's time to stop thinking",
    position: "left",
    typewriterEffect: true,
    delay: 200,
  },
  {
    id: 7,
    text: "And start building",
    position: "left",
    typewriterEffect: true,
    highlightWords: ["building"],
  },
  {
    id: 8,
    text: "Start Here Start Now",
    position: "center",
    typewriterEffect: true,
    moveToPosition: "center",
    fadeOut: true,
    delay: 500,
    scaleUp: true,
    highlightWords: ["Now"],
  },
];

export default function Page() {
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle component mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle step completion
  const handleStepComplete = useCallback(() => {
    if (!document.hidden) {
      setIsAnimating(true);
      // Add a small delay before starting the next animation
      setTimeout(() => {
        setCurrentStep((prev) =>
          prev === ANIMATION_STEPS.length ? 1 : prev + 1
        );
        setIsAnimating(false);
      }, 200);
    }
  }, []);

  // SVG placeholder based on current step
  const renderSvgPlaceholder = (step: number) => {
    const messages = {
      1: "Lightbulb animation",
      2: "Spark animation",
      3: "Vision board animation",
      4: "Thought bubble animation",
      5: "Night sky animation",
      6: "Clock animation",
      7: "Building blocks animation",
      8: "Arrow animation",
    };

    return messages[step as keyof typeof messages] || "Loading...";
  };

  // Don't render anything until mounted
  if (!isMounted) {
    return null;
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans">
      {/* Particle background */}
      <ClientParticles />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-screen flex flex-col lg:flex-row items-center justify-center px-4 md:px-8">
        {/* Text section */}
        <section className="w-full lg:w-3/5 h-full flex items-center justify-center py-8 lg:py-0">
          <div className="w-full max-w-2xl px-4">
            <EnhancedTypingAnimation
              currentStep={currentStep}
              steps={ANIMATION_STEPS}
              onStepComplete={handleStepComplete}
              typingSpeed={50}
              eraseSpeed={30}
              className={cn(
                "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
                "font-bold leading-tight md:leading-relaxed tracking-tight",
                "break-words hyphens-auto",
                isAnimating ? "opacity-90" : "opacity-100"
              )}
              startOnView={false}
            />
          </div>
        </section>

        {/* SVG Animation section */}
        <section className="w-full lg:w-2/5 h-full flex items-center justify-center py-8 lg:py-0">
          <div
            className={cn(
              "w-full max-w-md aspect-square rounded-lg",
              "backdrop-blur-sm bg-white/5",
              "border border-white/10",
              "flex items-center justify-center",
              "transition-all duration-500 ease-in-out",
              "p-4 mx-4"
            )}
          >
            <p className="text-white/50 text-center">
              {renderSvgPlaceholder(currentStep)}
              <span className="block mt-2 text-sm opacity-50">
                Step {currentStep} of {ANIMATION_STEPS.length}
              </span>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

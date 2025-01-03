"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  EnhancedTypingAnimation,
  AnimationStep,
} from "@/components/EnhancedTypingAnimation";
import Particles from "@/components/ui/particles";

const ANIMATION_STEPS: AnimationStep[] = [
  {
    id: 1,
    text: "That Idea",
    highlightWords: ["Idea"],
    typingSpeed: 30, // Quick first step
  },
  {
    id: 2,
    text: "Yeah, THAT Idea",
    highlightWords: ["THAT", "Idea"],
    typingSpeed: 60, // Emphasize with slower typing
  },
  {
    id: 3,
    text: "The one you can't stop thinking about",
    typingSpeed: 25, // Fast typing for longer text
  },
  {
    id: 4,
    text: "The one you talk about with your friends, saying, 'What if?'",
    highlightWords: ["What if?"],
    retainFromPrevious: true,
    retainWords: 2, // Retains "The one"
    typingSpeed: 45, // Slower for emphasis on "What if?"
  },
  {
    id: 5,
    text: "The one that pops up while you're driving, showering, or just daydreaming",
    retainFromPrevious: true,
    retainWords: 2, // Retains "The one"
    typingSpeed: 20, // Quick typing for familiar phrase
  },
  {
    id: 6,
    text: "It's time to stop thinking and start doing",
    highlightWords: ["doing"],
    typingSpeed: 70, // Dramatic pause with slow typing
  },
  {
    id: 7,
    text: "Make THAT idea real",
    highlightWords: ["THAT", "idea"],
    typingSpeed: 40, // Punchy and quick
  },
  {
    id: 8,
    text: "The world's waiting—and it starts with you",
    highlightWords: ["you"],
    typingSpeed: 55, // Final message with dramatic timing
  },
];

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  const handleStepComplete = useCallback(() => {
    if (!document.hidden) {
      setCurrentStep((prev) =>
        prev === ANIMATION_STEPS.length ? 1 : prev + 1
      );
    }
  }, []);

  // Animation timing configurations
  const defaultTimings = {
    typingSpeed: 40, // Base typing speed
    displayDuration: 2500, // How long text stays visible
    exitDelay: 800, // Delay before exit animation
    highlightDelay: 300, // Wait before starting highlight
    highlightDuration: 600, // Time to transition color
  };

  // Get step-specific timings
  const getCurrentStepProps = () => {
    const step = ANIMATION_STEPS[currentStep - 1];
    return {
      typingSpeed: step.typingSpeed || defaultTimings.typingSpeed,
    };
  };

  const { typingSpeed } = getCurrentStepProps();

  return (
    <main className="h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-black text-white">
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={"#C53AAE"}
        size={1.5}
        refresh
      />

      <section className="w-full lg:w-3/5 h-full flex items-center justify-center p-8 relative z-10">
        <div className="max-w-2xl">
          <EnhancedTypingAnimation
            currentStep={currentStep}
            steps={ANIMATION_STEPS}
            onStepComplete={handleStepComplete}
            typingSpeed={typingSpeed}
            displayDuration={defaultTimings.displayDuration}
            exitDelay={defaultTimings.exitDelay}
            highlightDelay={defaultTimings.highlightDelay}
            highlightDuration={defaultTimings.highlightDuration}
            initialDelay={isFirstRender ? 1000 : 0}
            className="text-4xl md:text-6xl font-bold mb-6"
          />
        </div>
      </section>

      <section className="w-full lg:w-2/5 h-full flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md aspect-square bg-white/5 rounded-lg flex items-center justify-center">
          <p className="text-white/50">SVG Animations will appear here</p>
        </div>
      </section>
    </main>
  );
};

export default Page;

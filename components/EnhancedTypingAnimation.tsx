"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence, MotionProps } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export type AnimationStep = {
  id: number;
  text: string;
  position?: "center" | "left";
  highlightWords?: string[];
  retainFromPrevious?: boolean;
  retainWords?: number;
  scaleUp?: boolean;
  fadeOut?: boolean;
  delay?: number;
  typewriterEffect?: boolean;
  moveToPosition?: "left" | "center";
  initialPosition?: "left" | "center";
};

interface EnhancedTypingAnimationProps extends MotionProps {
  className?: string;
  typingSpeed?: number;
  eraseSpeed?: number;
  startDelay?: number;
  as?: React.ElementType;
  startOnView?: boolean;
  currentStep: number;
  onStepComplete?: () => void;
  steps: AnimationStep[];
}

export function EnhancedTypingAnimation({
  className,
  typingSpeed = 50,
  eraseSpeed = 30,
  startDelay = 0,
  as: Component = "div",
  startOnView = false,
  currentStep,
  onStepComplete,
  steps,
  ...props
}: EnhancedTypingAnimationProps) {
  const MotionComponent = motion(Component);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [started, setStarted] = useState(false);
  const [position, setPosition] = useState<"center" | "left">("center");
  const elementRef = useRef<HTMLElement | null>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  // Function to get retained text from previous step
  const getRetainedText = (step: AnimationStep) => {
    if (step.retainWords && step.retainFromPrevious) {
      const prevStepText = steps[step.id - 2]?.text || "";
      const words = prevStepText.split(" ");
      return words.slice(0, step.retainWords).join(" ") + " ";
    }
    return "";
  };

  // Clear all timeouts
  const clearTimeouts = () => {
    if (typingRef.current) {
      clearTimeout(typingRef.current);
    }
  };

  // Handle text animation
  const animateText = async (step: AnimationStep) => {
    // Set initial position
    if (step.initialPosition) {
      setPosition(step.initialPosition);
    }

    // Handle retained text
    const retainedText = getRetainedText(step);
    let startText = retainedText;

    // Erase phase if needed
    if (
      displayedText &&
      (!retainedText || !displayedText.startsWith(retainedText))
    ) {
      setIsErasing(true);
      for (
        let i = displayedText.length;
        i >= (retainedText ? retainedText.length : 0);
        i--
      ) {
        await new Promise((resolve) => {
          typingRef.current = setTimeout(resolve, eraseSpeed);
        });
        setDisplayedText((prev) => prev.slice(0, -1));
      }
      setIsErasing(false);
    }

    // Delay before typing if specified
    if (step.delay) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
    }

    // Scale up animation if needed
    if (step.scaleUp) {
      // Handle with Framer Motion in the render
    }

    // Position transition if needed
    if (step.moveToPosition) {
      setPosition(step.moveToPosition);
    }

    // Typing phase
    setIsTyping(true);
    const targetText = step.text;
    for (let i = startText.length; i <= targetText.length; i++) {
      if (step.typewriterEffect) {
        await new Promise((resolve) => {
          typingRef.current = setTimeout(resolve, typingSpeed);
        });
      }
      setDisplayedText(targetText.slice(0, i));
    }
    setIsTyping(false);

    // Fade out if specified
    if (step.fadeOut) {
      await new Promise((resolve) => {
        typingRef.current = setTimeout(resolve, 1000);
      });
      setDisplayedText("");
    }

    // Complete step
    const completionDelay = step.fadeOut ? 0 : 1000;
    typingRef.current = setTimeout(() => {
      onStepComplete?.();
    }, completionDelay);
  };

  // Reset and handle step changes
  useEffect(() => {
    const currentStepData = steps[currentStep - 1];
    if (!currentStepData) return;

    if (currentStepData.retainFromPrevious && currentStepData.retainWords) {
      setIsErasing(true);
    } else if (!currentStepData.retainFromPrevious) {
      setDisplayedText("");
      setIsErasing(false);
    }

    setStarted(true);
  }, [currentStep, steps]);

  // Handle animation start
  useEffect(() => {
    if (!started) return;

    const currentStepData = steps[currentStep - 1];
    if (!currentStepData) return;

    clearTimeouts();
    animateText(currentStepData);

    return () => clearTimeouts();
  }, [started, currentStep, steps, typingSpeed, eraseSpeed]);

  // Handle intersection observer for startOnView
  useEffect(() => {
    if (!startOnView) {
      const startTimeout = setTimeout(() => {
        setStarted(true);
      }, startDelay);
      return () => clearTimeout(startTimeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setStarted(true);
          }, startDelay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [startDelay, startOnView]);

  // Render text with highlights
  const renderText = () => {
    if (!displayedText) return null;

    const currentStepData = steps[currentStep - 1];
    if (!currentStepData.highlightWords?.length) return displayedText;

    return displayedText.split(" ").map((word, index, array) => {
      const isHighlighted = currentStepData.highlightWords?.includes(word);
      return (
        <React.Fragment key={index}>
          <span
            className={cn(
              isHighlighted ? "text-[#C53AAE]" : "text-inherit",
              "inline-block"
            )}
          >
            {word}
          </span>
          {index < array.length - 1 ? " " : ""}
        </React.Fragment>
      );
    });
  };

  return (
    <AnimatePresence mode="wait">
      <MotionComponent
        ref={elementRef}
        className={cn(
          "transition-all duration-500 ease-in-out",
          position === "center" ? "text-center" : "text-left",
          className
        )}
        initial={false}
        animate={{
          x: position === "center" ? 0 : -50,
          scale: steps[currentStep - 1]?.scaleUp ? [1, 1.1, 1] : 1,
          opacity: 1,
        }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        {...props}
      >
        {renderText()}
      </MotionComponent>
    </AnimatePresence>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { motion, MotionProps, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type AnimationStep = {
  id: number;
  text: string;
  highlightWords?: string[];
  retainFromPrevious?: boolean;
  retainWords?: number;
  typingSpeed?: number; // Optional typing speed per step
};

interface EnhancedTypingAnimationProps extends MotionProps {
  className?: string;
  typingSpeed?: number;
  initialDelay?: number;
  displayDuration?: number;
  exitDelay?: number;
  highlightDelay?: number; // Delay before starting highlight animation
  highlightDuration?: number; // Duration of the highlight animation
  as?: React.ElementType;
  startOnView?: boolean;
  currentStep: number;
  onStepComplete?: () => void;
  steps: AnimationStep[];
}

export function EnhancedTypingAnimation({
  className,
  typingSpeed = 50,
  initialDelay = 0,
  displayDuration = 2000,
  exitDelay = 1000,
  highlightDelay = 500, // Default delay before highlight
  highlightDuration = 800, // Default duration for highlight animation
  as: Component = "div",
  startOnView = false,
  currentStep,
  onStepComplete,
  steps,
  ...props
}: EnhancedTypingAnimationProps) {
  const MotionComponent = motion(Component);
  const [displayedText, setDisplayedText] = useState("");
  const [isErasing, setIsErasing] = useState(false);
  const [started, setStarted] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const displayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stepCompleteRef = useRef(false);

  const cleanupTimeouts = () => {
    if (typingRef.current) {
      clearInterval(typingRef.current);
      typingRef.current = null;
    }
    if (displayTimeoutRef.current) {
      clearTimeout(displayTimeoutRef.current);
      displayTimeoutRef.current = null;
    }
  };

  const getRetainedText = (step: AnimationStep) => {
    if (step.retainWords && step.retainFromPrevious && step.id > 1) {
      const prevStepText = steps[step.id - 2].text;
      const words = prevStepText.split(" ");
      return words.slice(0, step.retainWords).join(" ") + " ";
    }
    return "";
  };

  // Reset state when step changes
  useEffect(() => {
    cleanupTimeouts();
    setDisplayedText("");
    setIsErasing(false);
    setShowHighlight(false);
    stepCompleteRef.current = false;
    setStarted(true);
  }, [currentStep]);

  // Main animation effect
  useEffect(() => {
    if (!started) return;

    const currentStepData = steps[currentStep - 1];
    if (!currentStepData) return;

    cleanupTimeouts();

    // Get step-specific typing speed or use default
    const currentTypingSpeed = currentStepData.typingSpeed || typingSpeed;

    // Type the text
    const typeText = () => {
      const targetText = currentStepData.text;
      let currentIndex = 0;

      typingRef.current = setInterval(() => {
        if (currentIndex < targetText.length) {
          setDisplayedText(targetText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingRef.current!);

          // Start highlight animation after delay
          setTimeout(() => {
            setShowHighlight(true);
          }, highlightDelay);

          // Schedule erase after display duration
          displayTimeoutRef.current = setTimeout(
            eraseText,
            displayDuration + highlightDelay + highlightDuration
          );
        }
      }, currentTypingSpeed);
    };

    // Erase the text
    const eraseText = () => {
      setShowHighlight(false); // Remove highlight before erasing
      let currentText = currentStepData.text;

      typingRef.current = setInterval(() => {
        if (currentText.length > 0) {
          currentText = currentText.slice(0, -1);
          setDisplayedText(currentText);
        } else {
          clearInterval(typingRef.current!);
          if (!stepCompleteRef.current) {
            stepCompleteRef.current = true;
            onStepComplete?.();
          }
        }
      }, currentTypingSpeed);
    };

    // Start typing after initial delay
    const initialTimer = setTimeout(() => {
      typeText();
    }, initialDelay);

    return () => {
      clearTimeout(initialTimer);
      cleanupTimeouts();
    };
  }, [
    started,
    currentStep,
    steps,
    typingSpeed,
    displayDuration,
    initialDelay,
    highlightDelay,
    highlightDuration,
    onStepComplete,
  ]);

  const renderText = () => {
    if (!displayedText) return null;

    const currentStepData = steps[currentStep - 1];
    if (!currentStepData.highlightWords?.length) {
      return displayedText;
    }

    return displayedText.split(/(?<=\s)|(?=\s)/).map((part, index) => {
      const isWord = part.trim().length > 0;
      if (!isWord) return part;

      const isHighlighted = currentStepData.highlightWords?.includes(
        part.trim()
      );

      return isHighlighted ? (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ color: "rgb(255, 255, 255)" }}
          animate={{
            color: showHighlight ? "rgb(197, 58, 174)" : "rgb(255, 255, 255)",
            transition: {
              duration: highlightDuration / 1000,
              ease: "easeInOut",
            },
          }}
        >
          {part}
        </motion.span>
      ) : (
        <span key={index} className="inline-block text-inherit">
          {part}
        </span>
      );
    });
  };

  return (
    <MotionComponent
      ref={elementRef}
      className={cn(
        "text-4xl font-bold leading-[5rem] tracking-[-0.02em]",
        className
      )}
      {...props}
    >
      {renderText()}
    </MotionComponent>
  );
}

"use client";

import { useEffect, useState } from "react";

interface ScrollProgressProps {
  className?: string;
  barClassName?: string;
  height?: string;
}

export function ScrollProgress({
  className,
  barClassName,
  height = "h-2", // Made slightly taller for better glass effect visibility
}: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;

      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 ${height}
       
        z-50
        ${className}
      `}
    >
      <div
        className={`
          h-full
          glass-card
          backdrop-blur-sm
          transition-all duration-150 ease-out
          ${barClassName}
        `}
        style={{
          width: `${scrollProgress}%`,
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)", // Adds glow effect to progress bar
        }}
      />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
};

const sizeMap = {
  sm: "h-10 w-[4.5rem] text-lg",
  md: "h-14 w-[6rem] text-2xl",
  lg: "h-20 w-[8.5rem] text-4xl",
};

export function Logo({ className, size = "md", animate = false }: LogoProps) {
  const inner = (
    <span
      className={cn(
        "flex items-center justify-center rounded-[1.75rem] border-[3px] border-white/95 bg-transparent font-black tracking-tight text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15)]",
        sizeMap[size],
        className
      )}
    >
      WO
    </span>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          {inner}
        </motion.div>
      </motion.div>
    );
  }

  return inner;
}

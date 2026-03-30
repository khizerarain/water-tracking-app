"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 22 }}
      className={cn(
        "rounded-3xl border border-white/15 bg-white/[0.08] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

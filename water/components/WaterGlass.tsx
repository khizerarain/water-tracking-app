"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function WaterGlass({ pct }: { pct: number }) {
  const p = Math.min(100, Math.max(0, pct));
  return (
    <div className="relative mx-auto h-44 w-28 overflow-hidden rounded-b-[2.5rem] rounded-t-3xl border-2 border-white/40 bg-white/5 shadow-inner shadow-black/40">
      <motion.div
        className={cn("absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 via-sky-500 to-cyan-300")}
        initial={{ height: 0 }}
        animate={{ height: `${p}%` }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 to-transparent opacity-40" />
      <div className="absolute bottom-2 left-0 right-0 text-center text-[11px] font-semibold text-white/90 drop-shadow">
        {Math.round(p)}%
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

type Bar = { label: string; water: number; steps: number; iso: string };

export function WeekChart({
  bars,
  goalMl,
  goalSteps,
  className,
}: {
  bars: Bar[];
  goalMl: number;
  goalSteps: number;
  className?: string;
}) {
  const maxWater = useMemo(
    () => Math.max(...bars.map((b) => b.water), goalMl, 1),
    [bars, goalMl]
  );
  const maxSteps = useMemo(
    () => Math.max(...bars.map((b) => b.steps), goalSteps, 1),
    [bars, goalSteps]
  );

  return (
    <div className={cn("w-full", className)}>
      <div className="flex h-44 items-end justify-between gap-2 px-1">
        {bars.map((b, i) => {
          const hWater = (b.water / maxWater) * 100;
          const stepPos = (b.steps / maxSteps) * 100;
          const isToday = i === bars.length - 1;
          return (
            <div key={b.iso} className="relative flex flex-1 flex-col items-center gap-2">
              <div className="relative flex h-36 w-full items-end justify-center">
                <motion.div
                  className={cn(
                    "relative z-[1] w-[78%] max-w-[44px] rounded-t-2xl bg-gradient-to-t from-blue-600 to-sky-400 shadow-lg shadow-blue-900/40",
                    isToday && "from-indigo-500 to-cyan-300"
                  )}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(10, hWater)}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 16, delay: i * 0.06 }}
                />
                <motion.div
                  className="absolute bottom-0 left-1/2 z-[2] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.95)]"
                  initial={{ opacity: 0, bottom: "0%" }}
                  animate={{
                    opacity: 1,
                    bottom: `${Math.max(6, Math.min(92, stepPos * 0.88))}%`,
                  }}
                  transition={{ delay: 0.18 + i * 0.05, type: "spring", stiffness: 200, damping: 20 }}
                />
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium",
                  isToday ? "text-cyan-200" : "text-white/45"
                )}
              >
                {b.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-center gap-6 text-[11px] text-white/55">
        <span className="flex items-center gap-2">
          <span className="h-2 w-4 rounded-sm bg-gradient-to-t from-blue-600 to-sky-400" />
          Water
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]" />
          Steps
        </span>
      </div>
    </div>
  );
}

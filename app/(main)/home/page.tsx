"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sun } from "lucide-react";
import { MainHeader } from "@/components/MainHeader";
import { SubscriptionUpsell } from "@/components/SubscriptionUpsell";
import { CircularDualProgress } from "@/components/CircularDualProgress";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { formatGreeting, mlToLiters, useWaterStore } from "@/lib/store";

const MOTIVATION = [
  "Let's stay hydrated!",
  "One more liter and you're golden!",
  "Small sips add up to big wins.",
  "Your steps and sips — perfectly in sync.",
];

export default function HomePage() {
  const userName = useWaterStore((s) => s.userName);
  const getTodayLog = useWaterStore((s) => s.getTodayLog);
  const goalWaterMl = useWaterStore((s) => s.goalWaterMl);
  const goalSteps = useWaterStore((s) => s.goalSteps);
  const goalGlasses = useWaterStore((s) => s.goalGlasses);
  const [i, setI] = useState(0);

  const log = getTodayLog();
  const waterPct = Math.min(100, (log.waterMl / goalWaterMl) * 100);
  const stepsPct = Math.min(100, (log.steps / goalSteps) * 100);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % MOTIVATION.length), 5200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-4">
      <MainHeader title="Water" mode="home" />
      <div>
        <p className="text-2xl font-bold tracking-tight">
          {formatGreeting()}, {userName}.
        </p>
        <div className="relative mt-1 h-7 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={MOTIVATION[i]}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="absolute left-0 top-0 text-sm text-cyan-200/85"
            >
              {MOTIVATION[i]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <SubscriptionUpsell />

      <GlassCard>
        <p className="text-sm font-semibold text-white/80">Today&apos;s Hydration Goal</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-lg font-bold tabular-nums">
          <span>{mlToLiters(goalWaterMl, 1)} L</span>
          <span className="text-white/35">•</span>
          <span>{goalGlasses} glasses</span>
          <span className="text-white/35">•</span>
          <span>{goalSteps.toLocaleString()} steps</span>
        </div>
        <div className="mt-6 flex justify-center">
          <CircularDualProgress waterPct={waterPct} stepsPct={stepsPct} />
        </div>
      </GlassCard>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="overflow-hidden rounded-3xl bg-linear-to-br from-amber-300 via-orange-400 to-rose-500 p-5 text-slate-900 shadow-2xl"
      >
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-lg font-bold leading-snug">Drink during your peak energy hour</p>
            <p className="mt-2 text-sm font-medium text-slate-900/80">
              Near Downtown Studio — hydration peaks around 2–4 PM.
            </p>
            <Link href="/water">
              <Button variant="dark" size="sm" className="mt-4 rounded-2xl bg-slate-900 text-white hover:bg-slate-800">
                Continue
              </Button>
            </Link>
          </div>
          <div className="flex w-24 flex-col items-center justify-center">
            <Sun className="h-14 w-14 text-amber-950/80" strokeWidth={1.25} />
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-900/70">Peak</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Dumbbell, Settings } from "lucide-react";
import { MainHeader } from "@/components/MainHeader";
import { GlassCard } from "@/components/GlassCard";
import { CircularDualProgress } from "@/components/CircularDualProgress";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { useWaterStore } from "@/lib/store";

export default function ProgressPage() {
  const getTodayLog = useWaterStore((s) => s.getTodayLog);
  const goalWaterMl = useWaterStore((s) => s.goalWaterMl);
  const goalSteps = useWaterStore((s) => s.goalSteps);
  const activityLevel = useWaterStore((s) => s.activityLevel);
  const getActivitiesForToday = useWaterStore((s) => s.getActivitiesForToday);

  const log = getTodayLog();
  const waterPct = Math.min(100, (log.waterMl / goalWaterMl) * 100);
  const stepsPct = Math.min(100, (log.steps / goalSteps) * 100);
  const todayActivities = getActivitiesForToday();

  return (
    <div className="flex flex-col gap-6 pb-6">
      <MainHeader title="Progress" />
      <GlassCard>
        <p className="text-center text-sm font-medium text-white/60">Today&apos;s sync</p>
        <div className="mt-4 flex justify-center">
          <CircularDualProgress waterPct={waterPct} stepsPct={stepsPct} />
        </div>
      </GlassCard>
      <GlassCard>
        <p className="text-sm font-semibold text-white/80">Snapshot</p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/45">Water</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              <AnimatedNumber value={log.waterMl} format={(n) => `${(n / 1000).toFixed(2)} L`} />
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/45">Steps</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              <AnimatedNumber value={log.steps} />
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/45">Glasses</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{log.glasses}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/45">Activity</p>
            <p className="mt-1 text-xl font-semibold capitalize text-cyan-100">{activityLevel}</p>
          </div>
        </div>
      </GlassCard>

      {/* Today's Activities */}
      {todayActivities.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Today's Activities
          </h3>
          <div className="space-y-2">
            {todayActivities.map((activity) => (
              <GlassCard key={activity.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white capitalize">{activity.name}</p>
                  <p className="text-xs text-gray-400">
                    {activity.duration} mins
                    {activity.calories && ` • ${activity.calories} cal`}
                  </p>
                </div>
                <Dumbbell className="h-5 w-5 text-cyan-300" />
              </GlassCard>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Link
          href="/activity"
          className="flex-1 rounded-2xl bg-linear-to-r from-purple-500 to-pink-500 px-4 py-3 text-center font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/50"
        >
          + Add Activity
        </Link>
        <Link
          href="/settings"
          className="rounded-2xl bg-white/10 px-4 py-3 font-semibold text-white transition-all hover:bg-white/20"
        >
          <Settings className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}

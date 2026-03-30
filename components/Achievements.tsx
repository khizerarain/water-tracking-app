"use client";

import { motion } from "framer-motion";
import { Trophy, Zap, Flame, Target } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { useWaterStore } from "@/lib/store";

const achievements = [
  { id: 1, name: "First Sip", desc: "Log your first glass of water", icon: "💧", unlocked: true },
  { id: 2, name: "Week Strong", desc: "Maintain a 7-day streak", icon: "🔥" },
  { id: 3, name: "Hydration Master", desc: "Reach 30-day streak", icon: "👑" },
  { id: 4, name: "Step It Up", desc: "Hit 10,000 steps", icon: "🚀" },
  { id: 5, name: "Balance Seeker", desc: "Meet both water and step goals on same day", icon: "⚖️" },
  { id: 6, name: "Consistency King", desc: "100-day streak", icon: "👸" },
];

export function Achievements() {
  const store = useWaterStore();
  const streak = store.getStreak();
  const todayLog = store.getTodayLog();
  const goalMet = store.getIsGoalMetToday();

  // Determine unlocked achievements
  const unlockedIds = [1]; // First sip is always unlocked
  if (streak >= 7) unlockedIds.push(2);
  if (streak >= 30) unlockedIds.push(3);
  if (todayLog.steps >= store.goalSteps) unlockedIds.push(4);
  if (goalMet.water && goalMet.steps) unlockedIds.push(5);
  if (streak >= 100) unlockedIds.push(6);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Current Streak
              </p>
              <p className="mt-2 text-3xl font-black text-cyan-300">{streak}</p>
              <p className="mt-1 text-xs text-gray-400">days 🔥</p>
            </div>
            <Flame className="h-8 w-8 text-orange-400/60" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Achievements
              </p>
              <p className="mt-2 text-3xl font-black text-purple-300">{unlockedIds.length}</p>
              <p className="mt-1 text-xs text-gray-400">unlocked</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-400/60" />
          </div>
        </GlassCard>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
          Achievements
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map((achievement) => {
            const unlocked = unlockedIds.includes(achievement.id);
            return (
              <motion.div
                key={achievement.id}
                whileHover={unlocked ? { scale: 1.05 } : {}}
                className={`rounded-2xl border p-3 transition-all ${
                  unlocked
                    ? "border-yellow-500/30 bg-yellow-500/10"
                    : "border-white/10 bg-white/5 opacity-40"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl">{achievement.icon}</div>
                  <p className="mt-1 text-xs font-semibold text-white leading-tight">
                    {achievement.name}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

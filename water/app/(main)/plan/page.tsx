"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Lightbulb, Target, TrendingUp } from "lucide-react";
import { MainHeader } from "@/components/MainHeader";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useWaterStore } from "@/lib/store";

const tips = [
  "💡 Drink a glass of water when you wake up — it jumpstarts your metabolism!",
  "🌡️ Drink more when it's hot or after exercise — your body needs it.",
  "⏰ Set phone reminders every 2 hours to stay on track.",
  "🍵 Tea and coffee count toward hydration, but water is best.",
  "📱 Track consistently — small habits compound into big results.",
  "🎯 Start with small goals and gradually increase them.",
];

export default function PlanPage() {
  const goalWaterMl = useWaterStore((s) => s.goalWaterMl);
  const goalSteps = useWaterStore((s) => s.goalSteps);
  const goalGlasses = useWaterStore((s) => s.goalGlasses);
  const activityLevel = useWaterStore((s) => s.activityLevel);
  const setGoals = useWaterStore((s) => s.setGoals);

  const [w, setW] = useState(String(goalWaterMl / 1000));
  const [s, setS] = useState(String(goalSteps));
  const [g, setG] = useState(String(goalGlasses));
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    setW(String(goalWaterMl / 1000));
    setS(String(goalSteps));
    setG(String(goalGlasses));
  }, [goalWaterMl, goalSteps, goalGlasses]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % tips.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  function save() {
    const liters = Number(w);
    const steps = Number(s);
    const glasses = Number(g);
    if (![liters, steps, glasses].every((x) => Number.isFinite(x) && x > 0)) {
      toast.error("Enter valid positive numbers");
      return;
    }
    setGoals({
      goalWaterMl: Math.round(liters * 1000),
      goalSteps: Math.round(steps),
      goalGlasses: Math.round(glasses),
    });
    toast.success("Goals updated! 🎯");
  }

  // Recommendations based on activity level
  const recommendations: Record<string, { water: number; steps: number; desc: string }> = {
    beginner: { water: 2.0, steps: 5000, desc: "Ease into a healthy routine" },
    intermediate: { water: 2.5, steps: 8000, desc: "Build sustainable habits" },
    advanced: { water: 3.0, steps: 12000, desc: "Push your limits" },
    athletic: { water: 3.5, steps: 15000, desc: "Champion-level hydration" },
  };

  const rec = recommendations[activityLevel] || recommendations.intermediate;

  return (
    <div className="flex flex-col gap-6 pb-6">
      <MainHeader title="Plan" />

      {/* Daily Targets */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-semibold">Daily targets</p>
              <p className="mt-1 text-sm text-white/60">
                Tune what &quot;done&quot; looks like for you.
              </p>
            </div>
            <Target className="h-6 w-6 text-cyan-300" />
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="water">Water (liters)</Label>
              <input
                id="water"
                type="number"
                step="0.1"
                value={w}
                onChange={(e) => setW(e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none placeholder-gray-500 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="steps">Steps</Label>
              <input
                id="steps"
                type="number"
                step="500"
                value={s}
                onChange={(e) => setS(e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none placeholder-gray-500 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="glasses">Glasses (8 oz equivalent)</Label>
              <input
                id="glasses"
                type="number"
                value={g}
                onChange={(e) => setG(e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none placeholder-gray-500 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>
          </div>

          <Button className="mt-6 w-full" onClick={save}>
            Save goals
          </Button>
        </GlassCard>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-300">
          Recommendations
        </h3>

        <GlassCard className="border border-cyan-500/30 bg-linear-to-br from-cyan-500/10 to-blue-500/10">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 shrink-0 text-cyan-300" />
            <div className="flex-1">
              <p className="font-semibold text-white capitalize">{activityLevel} Level</p>
              <p className="mt-1 text-sm text-gray-300">{rec.desc}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white/5 p-2">
                  <p className="text-xs text-gray-400">Water</p>
                  <p className="text-lg font-bold text-cyan-300">{rec.water}L</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <p className="text-xs text-gray-400">Steps</p>
                  <p className="text-lg font-bold text-cyan-300">{rec.steps.toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setW(String(rec.water));
                  setS(String(rec.steps));
                  toast.message("Preset goals loaded");
                }}
                className="mt-2 w-full rounded-lg bg-cyan-500/20 px-2 py-2 text-xs font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/30"
              >
                Use This Preset
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Daily Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-300">
          Daily Tip
        </h3>

        <motion.div
          key={tipIndex}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="flex gap-3 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 backdrop-blur"
        >
          <Lightbulb className="h-5 w-5 shrink-0 text-yellow-400" />
          <p className="text-sm text-yellow-100">{tips[tipIndex]}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

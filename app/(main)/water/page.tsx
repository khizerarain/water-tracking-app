"use client";

import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MainHeader } from "@/components/MainHeader";
import { WeekChart } from "@/components/WeekChart";
import { GlassCard } from "@/components/GlassCard";
import { WaterGlass } from "@/components/WaterGlass";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Button } from "@/components/ui/button";
import { useWaterStore } from "@/lib/store";

export default function WaterPage() {
  const dailyLogs = useWaterStore((s) => s.dailyLogs);
  const getTodayLog = useWaterStore((s) => s.getTodayLog);
  const goalWaterMl = useWaterStore((s) => s.goalWaterMl);
  const goalSteps = useWaterStore((s) => s.goalSteps);
  const addWater = useWaterStore((s) => s.addWater);
  const setCustomWater = useWaterStore((s) => s.setCustomWater);
  const resetToday = useWaterStore((s) => s.resetToday);
  const getWeekBars = useWaterStore((s) => s.getWeekBars);

  const log = getTodayLog();
  const bars = useMemo(() => getWeekBars(), [getWeekBars, dailyLogs]);

  const ahead = log.waterMl - goalWaterMl;
  const headline =
    ahead >= 0
      ? `${ahead.toLocaleString()} ml ahead`
      : `${Math.abs(ahead).toLocaleString()} ml to go`;

  const [custom, setCustom] = useState("");

  function onAdd(ml: number) {
    addWater(ml);
    toast.success(`Added ${ml} ml`);
  }

  function onCustom() {
    const n = Number(custom);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Enter a valid amount in ml");
      return;
    }
    setCustomWater(log.waterMl + n);
    setCustom("");
    toast.success(`Logged ${n} ml`);
  }

  function onClear() {
    resetToday();
    toast.message("Today’s water log cleared");
  }

  const fillPct = Math.min(100, (log.waterMl / goalWaterMl) * 100);
  const remaining = Math.max(0, goalWaterMl - log.waterMl);

  return (
    <div className="flex flex-col gap-5 pb-6">
      <MainHeader
        title="Water"
        right={
          <motion.button
            type="button"
            aria-label="Clear today"
            whileTap={{ scale: 0.92 }}
            onClick={onClear}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80 backdrop-blur-md hover:bg-white/10"
          >
            <Trash2 className="h-5 w-5" />
          </motion.button>
        }
      />

      <p className="px-1 text-2xl font-black tracking-tight text-white">{headline}</p>

      <WeekChart bars={bars} goalMl={goalWaterMl} goalSteps={goalSteps} />

      <GlassCard>
        <div className="flex flex-col items-center gap-2 text-center">
          <AnimatedNumber
            value={log.waterMl}
            format={(n) => `${Math.round(n).toLocaleString()} ml`}
            className="text-5xl font-black tracking-tight text-white"
          />
          <p className="text-sm font-medium text-cyan-200/80">Water</p>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/45">Remaining</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-white">
              <AnimatedNumber value={remaining} format={(n) => `${(n / 1000).toFixed(2)} L`} />
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/45">Steps</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-white">
              <AnimatedNumber value={log.steps} />
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/45">Glasses</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-white">{log.glasses}</p>
          </div>
        </div>
      </GlassCard>

      <div className="flex justify-center">
        <WaterGlass pct={fillPct} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[250, 500, 1000].map((ml) => (
          <Button key={ml} variant="glass" className="h-14 text-base font-semibold" onClick={() => onAdd(ml)}>
            +{ml} ml
          </Button>
        ))}
      </div>

      <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-md">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          inputMode="numeric"
          placeholder="Custom ml"
          className="h-12 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-cyan-400/40"
        />
        <Button className="h-12 px-6" onClick={onCustom}>
          Add
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MainHeader } from "@/components/MainHeader";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { SyncHealthModal } from "@/components/SyncHealthModal";
import { useWaterStore } from "@/lib/store";

export default function StepsPage() {
  const [open, setOpen] = useState(false);
  const getTodayLog = useWaterStore((s) => s.getTodayLog);
  const goalSteps = useWaterStore((s) => s.goalSteps);
  const addSteps = useWaterStore((s) => s.addSteps);

  const log = getTodayLog();
  const pct = Math.min(100, (log.steps / goalSteps) * 100);

  function add(n: number) {
    addSteps(n);
    toast.success(`Added ${n.toLocaleString()} steps`);
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      <MainHeader title="Steps" />
      <GlassCard>
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Today</p>
        <p className="mt-2 text-center text-5xl font-black tabular-nums tracking-tight">
          <AnimatedNumber value={log.steps} />
        </p>
        <p className="mt-2 text-center text-sm text-cyan-200/80">
          Goal {goalSteps.toLocaleString()} · {Math.round(pct)}%
        </p>
      </GlassCard>

      <div className="grid grid-cols-3 gap-3">
        {[500, 1500, 3000].map((n) => (
          <Button key={n} variant="glass" className="h-14 text-base font-semibold" onClick={() => add(n)}>
            +{n.toLocaleString()}
          </Button>
        ))}
      </div>

      <Button variant="outline" className="h-14 w-full border-cyan-400/30 text-cyan-100" onClick={() => setOpen(true)}>
        Sync with Apple Health / Google Fit
      </Button>

      <SyncHealthModal open={open} onOpenChange={setOpen} />
    </div>
  );
}

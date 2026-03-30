"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { GradientBackground } from "@/components/GradientBackground";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWaterStore, type ActivityLevel } from "@/lib/store";

const levels: { id: ActivityLevel; label: string }[] = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "athletic", label: "Athletic" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const activityLevel = useWaterStore((s) => s.activityLevel);
  const onboardingComplete = useWaterStore((s) => s.onboardingComplete);
  const setActivityLevel = useWaterStore((s) => s.setActivityLevel);
  const completeOnboarding = useWaterStore((s) => s.completeOnboarding);

  useEffect(() => {
    if (onboardingComplete) router.replace("/home");
  }, [onboardingComplete, router]);

  function onNext() {
    completeOnboarding();
    router.push("/home");
  }

  return (
    <GradientBackground variant="onboarding">
      <div className="flex min-h-dvh flex-col px-6 pb-10 pt-safe">
        <div className="mb-8 flex items-center pt-2">
          <Link href="/" aria-label="Back" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white backdrop-blur-md">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        <motion.h1
          className="text-center text-3xl font-bold tracking-tight text-white"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Current activity level?
        </motion.h1>
        <p className="mt-2 text-center text-sm text-white/55">We&apos;ll tune reminders around your day.</p>

        <div className="mt-10 grid grid-cols-2 gap-4">
          {levels.map(({ id, label }, i) => {
            const selected = activityLevel === id;
            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => setActivityLevel(id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex min-h-26 items-center justify-center rounded-3xl border px-4 text-lg font-semibold shadow-lg transition-colors",
                  selected
                    ? "border-white/30 bg-white text-slate-900 shadow-white/10"
                    : "border-white/10 bg-white/5 text-white backdrop-blur-md hover:bg-white/10"
                )}
              >
                {label}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-auto pt-10">
          <Button size="pill" className="w-full py-6 text-lg font-bold shadow-[0_0_40px_rgba(103,232,249,0.25)]" onClick={onNext}>
            Next
          </Button>
        </div>
      </div>
    </GradientBackground>
  );
}

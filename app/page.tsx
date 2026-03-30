"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { GradientBackground } from "@/components/GradientBackground";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useWaterStore } from "@/lib/store";
import { useMounted } from "@/hooks/useMounted";

export default function SplashPage() {
  const onboardingComplete = useWaterStore((s) => s.onboardingComplete);
  const mounted = useMounted();
  const nextHref = mounted && onboardingComplete ? "/home" : "/onboarding";

  return (
    <GradientBackground>
      <div className="flex min-h-dvh flex-col px-6 pt-safe">
        <div className="flex flex-1 flex-col items-center justify-center pb-16">
          <Logo size="lg" animate />
          <motion.p
            className="mt-8 text-center text-2xl font-semibold tracking-tight text-cyan-200/90"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            Water Only Water
          </motion.p>
          <motion.div
            className="mt-10 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.35em] text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span>Powered by</span>
            <Droplets className="h-4 w-4 text-cyan-300/80" />
          </motion.div>
          <motion.div
            className="mt-12 w-full max-w-xs"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
          >
            <Link href={nextHref} className="block w-full">
              <Button size="lg" className="w-full text-base font-semibold shadow-xl shadow-cyan-500/20">
                Get started
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.footer
          className="pb-safe flex flex-col items-center gap-4 border-t border-white/10 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-lg">
              <img src="/icon.svg" alt="" width={44} height={44} className="h-full w-full object-cover" />
            </div>
            <div className="text-left leading-tight">
              <p className="text-sm font-semibold text-white">Water</p>
              <p className="text-[11px] text-white/45">Simple. Hydrated. Moving.</p>
            </div>
          </div>
          <p className="text-[11px] text-white/35">
            curated by{" "}
            <a
              href="https://mobbin.com"
              target="_blank"
              rel="noreferrer"
              className="text-white/55 underline decoration-white/20 underline-offset-2 hover:text-cyan-200"
            >
              Mobbin
            </a>
          </p>
        </motion.footer>
      </div>
    </GradientBackground>
  );
}

"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useWaterStore } from "@/lib/store";

export function SubscriptionUpsell() {
  const subscriptionActive = useWaterStore((s) => s.subscriptionActive);

  if (subscriptionActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 22 }}
      className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />
      <div className="flex gap-4">
        <div className="relative">
          <Logo size="sm" />
          <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-cyan-300" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-[15px] font-semibold leading-snug text-white">
            Start your journey today! First week&apos;s on us. After that? Just $19.99 a year. Yep, less than your
            monthly coffee habit.
          </p>
          <Link href="/subscribe">
            <Button variant="default" size="sm" className="w-full max-w-50">
              Continue
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplets, Footprints, AudioWaveform, Zap, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const items = [
  { href: "/water", label: "Water", Icon: Droplets },
  { href: "/steps", label: "Steps", Icon: Footprints },
  { href: "/nutrition", label: "Nutrition", Icon: UtensilsCrossed },
  { href: "/progress", label: "Progress", Icon: Zap },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
      <div className="mb-4 flex w-full max-w-md items-center justify-around rounded-4xl border border-white/10 bg-black/25 px-2 py-3 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex min-w-[4.25rem] flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-medium transition-colors",
                active ? "text-cyan-300" : "text-white/55 hover:text-white/80"
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-2xl bg-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon className="h-6 w-6" strokeWidth={active ? 2.25 : 1.75} />
                <span>{label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";

export function MainHeader({
  title,
  mode = "sub",
  right,
}: {
  title: string;
  mode?: "home" | "sub";
  right?: React.ReactNode;
}) {
  return (
    <header className="flex items-center justify-between px-1 pb-4 pt-2">
      <div className="flex w-11 justify-start">
        {mode === "home" ? (
          <Logo size="sm" />
        ) : (
          <Link href="/home" aria-label="Back to dashboard">
            <motion.span
              whileTap={{ scale: 0.92 }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white backdrop-blur-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.span>
          </Link>
        )}
      </div>
      <h1 className="flex-1 text-center text-lg font-semibold tracking-tight text-white">{title}</h1>
      <div className="flex w-11 justify-end">{right}</div>
    </header>
  );
}

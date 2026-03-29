"use client";

import { useId } from "react";
import { motion } from "framer-motion";

export function CircularDualProgress({
  waterPct,
  stepsPct,
  size = 168,
}: {
  waterPct: number;
  stepsPct: number;
  size?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const stroke = 11;
  const strokeIn = 8;
  const outerR = size / 2 - stroke / 2 - 6;
  const innerR = outerR - 18;
  const cOut = 2 * Math.PI * outerR;
  const cIn = 2 * Math.PI * innerR;
  const wOff = cOut * (1 - Math.min(1, waterPct / 100));
  const sOff = cIn * (1 - Math.min(1, stepsPct / 100));
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <motion.circle
          cx={cx}
          cy={cy}
          r={outerR}
          fill="none"
          stroke={`url(#waterGrad-${uid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={cOut}
          initial={{ strokeDashoffset: cOut }}
          animate={{ strokeDashoffset: wOff }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeIn} />
        <motion.circle
          cx={cx}
          cy={cy}
          r={innerR}
          fill="none"
          stroke={`url(#stepGrad-${uid})`}
          strokeWidth={strokeIn}
          strokeLinecap="round"
          strokeDasharray={cIn}
          initial={{ strokeDashoffset: cIn }}
          animate={{ strokeDashoffset: sOff }}
          transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
        />
        <defs>
          <linearGradient id={`waterGrad-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id={`stepGrad-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Sync</p>
        <p className="text-3xl font-black tabular-nums tracking-tight text-white">{Math.round(waterPct)}%</p>
        <p className="text-xs font-medium text-cyan-200/90">Steps {Math.round(stepsPct)}%</p>
      </div>
    </div>
  );
}

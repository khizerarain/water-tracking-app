"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";

type AnimatedNumberProps = {
  value: number;
  format?: (n: number) => string;
  className?: string;
};

export function AnimatedNumber({
  value,
  format = (n) => Math.round(n).toLocaleString(),
  className,
}: AnimatedNumberProps) {
  const mv = useMotionValue(0);
  const [text, setText] = useState(format(0));

  useMotionValueEvent(mv, "change", (v) => {
    setText(format(v));
  });

  useEffect(() => {
    const c = animate(mv, value, { duration: 0.85, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [value, mv]);

  return <span className={className}>{text}</span>;
}

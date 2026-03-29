"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { useWaterStore } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const theme = useWaterStore((s) => s.theme);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
  }, [theme, mounted]);

  return (
    <>
      {children}
      <Toaster
        richColors
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "backdrop-blur-xl border border-white/10 bg-slate-900/90 text-white",
          },
        }}
      />
    </>
  );
}

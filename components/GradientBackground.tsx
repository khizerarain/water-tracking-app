import { cn } from "@/lib/utils";

export function GradientBackground({
  variant = "main",
  className,
  children,
}: {
  variant?: "main" | "onboarding";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative min-h-dvh w-full overflow-hidden text-white",
        variant === "main" &&
          "bg-gradient-to-br from-[#1E3A8A] via-[#312E81] to-[#4F46E5]",
        variant === "onboarding" &&
          "bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#312e81]",
        className
      )}
    >
      {variant === "onboarding" && (
        <>
          <div className="pointer-events-none absolute -left-20 top-24 h-56 w-56 rounded-3xl bg-blue-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-40 h-48 w-48 rounded-3xl bg-indigo-500/25 blur-3xl" />
          <div className="pointer-events-none absolute left-1/3 top-1/2 h-32 w-32 rounded-2xl bg-cyan-400/15 blur-2xl" />
        </>
      )}
      {children}
    </div>
  );
}

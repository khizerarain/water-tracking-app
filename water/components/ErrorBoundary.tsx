"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { GradientBackground } from "./GradientBackground";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Error Boundary caught:", error);
  }, [error]);

  return (
    <GradientBackground>
      <div className="flex min-h-dvh items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-500/20 p-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <h1 className="mb-3 text-center text-2xl font-bold text-white">
            Oops, something went wrong
          </h1>

          <p className="mb-2 text-center text-sm text-gray-300">
            We encountered an unexpected error. Don't worry, we'll help you get back on track.
          </p>

          <div className="mb-6 rounded-lg bg-red-500/10 p-3">
            <p className="text-xs text-red-200 font-mono">
              {error.message || "Unknown error"}
            </p>
          </div>

          <button
            onClick={reset}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan-500/50"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <button
            onClick={() => window.location.href = "/"}
            className="mt-3 w-full rounded-2xl border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/5"
          >
            Go Home
          </button>
        </div>
      </div>
    </GradientBackground>
  );
}

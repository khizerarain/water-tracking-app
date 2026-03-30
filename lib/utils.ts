import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Validation functions
export function validateWaterAmount(ml: number): { valid: boolean; error?: string } {
  if (!Number.isFinite(ml) || ml <= 0) {
    return { valid: false, error: "Water amount must be a positive number" };
  }
  if (ml > 10000) {
    return { valid: false, error: "Daily water intake cannot exceed 10 liters" };
  }
  return { valid: true };
}

export function validateStepCount(steps: number): { valid: boolean; error?: string } {
  if (!Number.isFinite(steps) || steps < 0) {
    return { valid: false, error: "Steps must be a non-negative number" };
  }
  if (steps > 500000) {
    return { valid: false, error: "Step count seems unrealistic" };
  }
  return { valid: true };
}

export function validateActivityDuration(minutes: number): { valid: boolean; error?: string } {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return { valid: false, error: "Duration must be a positive number" };
  }
  if (minutes > 480) {
    return { valid: false, error: "Duration cannot exceed 8 hours" };
  }
  return { valid: true };
}

export function validateUserName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length === 0) {
    return { valid: false, error: "Name cannot be empty" };
  }
  if (trimmed.length > 50) {
    return { valid: false, error: "Name is too long (max 50 characters)" };
  }
  return { valid: true };
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    valid: re.test(email),
    error: re.test(email) ? undefined : "Invalid email address",
  };
}

// Format functions
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// Calculation functions
export function calculateWaterPercentage(current: number, goal: number): number {
  return Math.min(100, (current / goal) * 100);
}

export function calculateCaloriesBurned(
  activityType: string,
  duration: number,
  weight?: number
): number {
  // Rough estimates for calorie burn per minute (for ~70kg person)
  const calsPerMin: Record<string, number> = {
    walk: 4,
    run: 12,
    workout: 8,
    sport: 10,
    other: 5,
  };

  const baseRate = calsPerMin[activityType] || 5;
  const weightMultiplier = weight ? weight / 70 : 1;

  return Math.round(duration * baseRate * weightMultiplier);
}

export function estimateStepsFromDuration(
  activityType: string,
  duration: number
): number {
  // Rough estimates for steps per minute based on activity
  const stepsPerMin: Record<string, number> = {
    walk: 100,
    run: 140,
    sport: 120,
    workout: 0, // Workouts don't count as steps
    other: 50,
  };

  return duration * (stepsPerMin[activityType] || 0);
}

// Data manipulation
export function getLastNDays(n: number): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    dates.push(d);
  }
  return dates.reverse();
}

export function calculateStreak(
  logs: Record<string, { waterMl: number; steps: number }>,
  goalWater: number,
  goalSteps: number
): number {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const log = logs[iso];

    if (!log || log.waterMl < goalWater * 0.8 || log.steps < goalSteps * 0.8) {
      break;
    }
    streak++;
  }

  return streak;
}

// Browser utilities
export function downloadJSON(data: unknown, filename: string) {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false);
}


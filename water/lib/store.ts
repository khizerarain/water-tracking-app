import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ActivityLevel = "beginner" | "intermediate" | "advanced" | "athletic";
export type Theme = "light" | "dark";

export interface DayLog {
  waterMl: number;
  steps: number;
  glasses: number;
  activities?: Activity[];
}

export interface Activity {
  id: string;
  type: "workout" | "walk" | "run" | "sport" | "other";
  name: string;
  duration: number; // minutes
  calories?: number;
  timestamp: string; // ISO
}

export interface NotificationSettings {
  enabled: boolean;
  frequency: "hourly" | "every2h" | "every4h" | "daily";
  quietHours: boolean;
  quietStart: string; // "HH:MM"
  quietEnd: string;
}

const defaultDayLog = (): DayLog => ({
  waterMl: 0,
  steps: 0,
  glasses: 0,
});

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface WaterState {
  // User profile
  userName: string;
  activityLevel: ActivityLevel;
  onboardingComplete: boolean;
  
  // Goals
  goalWaterMl: number;
  goalSteps: number;
  goalGlasses: number;
  
  // Tracking
  dailyLogs: Record<string, DayLog>;
  
  // Settings
  theme: Theme;
  notificationSettings: NotificationSettings;
  subscriptionActive: boolean;
  subscriptionStartDate?: string;
  
  // Actions - Profile
  setUserName: (name: string) => void;
  setActivityLevel: (l: ActivityLevel) => void;
  completeOnboarding: () => void;
  
  // Actions - Goals
  setGoals: (g: Partial<Pick<WaterState, "goalWaterMl" | "goalSteps" | "goalGlasses">>) => void;
  
  // Actions - Tracking
  addWater: (ml: number) => void;
  addSteps: (n: number) => void;
  setCustomWater: (ml: number) => void;
  addActivity: (activity: Omit<Activity, "id" | "timestamp">) => void;
  resetToday: () => void;
  
  // Actions - Settings
  setTheme: (theme: Theme) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  activateSubscription: () => void;
  
  // Getters
  getTodayLog: () => DayLog;
  getWeekBars: () => { label: string; water: number; steps: number; iso: string }[];
  getActivitiesForToday: () => Activity[];
  getStreak: () => number;
  getIsGoalMetToday: () => { water: boolean; steps: boolean };
}

function last7Days(): { iso: string; label: string }[] {
  const short = ["S", "M", "T", "W", "T", "F", "S"];
  const out: { iso: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    out.push({ iso, label: short[d.getDay()] });
  }
  return out;
}

export const useWaterStore = create<WaterState>()(
  persist(
    (set, get) => ({
      // Profile defaults
      userName: "Khizar",
      activityLevel: "intermediate",
      onboardingComplete: false,
      
      // Goals
      goalWaterMl: 2500,
      goalSteps: 8000,
      goalGlasses: 8,
      
      // Tracking
      dailyLogs: {},
      
      // Settings
      theme: "dark",
      notificationSettings: {
        enabled: true,
        frequency: "every4h",
        quietHours: true,
        quietStart: "22:00",
        quietEnd: "08:00",
      },
      subscriptionActive: false,

      // Profile actions
      setUserName: (userName) => set({ userName }),
      setActivityLevel: (activityLevel) => set({ activityLevel }),
      completeOnboarding: () => set({ onboardingComplete: true }),

      // Goals actions
      setGoals: (g) => set((s) => ({ ...s, ...g })),

      // Tracking actions
      getTodayLog: () => {
        const key = todayKey();
        const logs = get().dailyLogs;
        return logs[key] ?? defaultDayLog();
      },

      addWater: (ml) => {
        const key = todayKey();
        set((s) => {
          const cur = s.dailyLogs[key] ?? defaultDayLog();
          const nextWater = cur.waterMl + ml;
          const glasses = Math.floor(nextWater / 250);
          return {
            dailyLogs: {
              ...s.dailyLogs,
              [key]: {
                ...cur,
                waterMl: nextWater,
                glasses,
              },
            },
          };
        });
      },

      setCustomWater: (ml) => {
        const key = todayKey();
        set((s) => {
          const cur = s.dailyLogs[key] ?? defaultDayLog();
          const glasses = Math.floor(ml / 250);
          return {
            dailyLogs: {
              ...s.dailyLogs,
              [key]: {
                ...cur,
                waterMl: ml,
                glasses,
              },
            },
          };
        });
      },

      addSteps: (n) => {
        const key = todayKey();
        set((s) => {
          const cur = s.dailyLogs[key] ?? defaultDayLog();
          return {
            dailyLogs: {
              ...s.dailyLogs,
              [key]: { ...cur, steps: cur.steps + n },
            },
          };
        });
      },

      addActivity: (activity) => {
        const key = todayKey();
        const id = Math.random().toString(36).slice(2, 9);
        const timestamp = new Date().toISOString();
        set((s) => {
          const cur = s.dailyLogs[key] ?? defaultDayLog();
          return {
            dailyLogs: {
              ...s.dailyLogs,
              [key]: {
                ...cur,
                activities: [...(cur.activities || []), { ...activity, id, timestamp }],
              },
            },
          };
        });
      },

      resetToday: () => {
        const key = todayKey();
        set((s) => ({
          dailyLogs: {
            ...s.dailyLogs,
            [key]: defaultDayLog(),
          },
        }));
      },

      getWeekBars: () => {
        const { dailyLogs } = get();
        return last7Days().map(({ iso, label }) => {
          const log = dailyLogs[iso] ?? defaultDayLog();
          return {
            iso,
            label,
            water: log.waterMl,
            steps: log.steps,
          };
        });
      },

      getActivitiesForToday: () => {
        const log = get().getTodayLog();
        return log.activities || [];
      },

      getStreak: () => {
        const { dailyLogs, goalWaterMl, goalSteps } = get();
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 365; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const iso = d.toISOString().slice(0, 10);
          const log = dailyLogs[iso];
          
          if (!log || log.waterMl < goalWaterMl * 0.8 || log.steps < goalSteps * 0.8) {
            break;
          }
          streak++;
        }
        return streak;
      },

      getIsGoalMetToday: () => {
        const log = get().getTodayLog();
        return {
          water: log.waterMl >= get().goalWaterMl,
          steps: log.steps >= get().goalSteps,
        };
      },

      // Settings actions
      setTheme: (theme) => set({ theme }),
      updateNotificationSettings: (settings) =>
        set((s) => ({
          notificationSettings: { ...s.notificationSettings, ...settings },
        })),
      activateSubscription: () =>
        set({
          subscriptionActive: true,
          subscriptionStartDate: new Date().toISOString(),
        }),
    }),
    {
      name: "water-app-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        userName: s.userName,
        activityLevel: s.activityLevel,
        onboardingComplete: s.onboardingComplete,
        goalWaterMl: s.goalWaterMl,
        goalSteps: s.goalSteps,
        goalGlasses: s.goalGlasses,
        dailyLogs: s.dailyLogs,
        theme: s.theme,
        notificationSettings: s.notificationSettings,
        subscriptionActive: s.subscriptionActive,
        subscriptionStartDate: s.subscriptionStartDate,
      }),
    }
  )
);

export function mlToLiters(ml: number, digits = 1): string {
  return (ml / 1000).toFixed(digits);
}

export function formatGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

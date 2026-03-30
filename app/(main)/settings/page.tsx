"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Moon, Sun, Bell, Download, Trash2, Sparkles, LogOut } from "lucide-react";
import Link from "next/link";
import { useWaterStore, type ActivityLevel } from "@/lib/store";
import { GlassCard } from "@/components/GlassCard";
import { Achievements } from "@/components/Achievements";
import { toast } from "sonner";

export default function SettingsPage() {
  const store = useWaterStore();
  const [editMode, setEditMode] = useState(false);
  const [tempName, setTempName] = useState(store.userName);

  const handleNameUpdate = () => {
    store.setUserName(tempName);
    setEditMode(false);
    toast.success("Name updated!");
  };

  const handleExportData = () => {
    const data = {
      profile: {
        name: store.userName,
        activityLevel: store.activityLevel,
      },
      goals: {
        waterMl: store.goalWaterMl,
        steps: store.goalSteps,
        glasses: store.goalGlasses,
      },
      logs: store.dailyLogs,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `water-data-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Data exported!");
  };

  const handleResetData = () => {
    if (
      window.confirm(
        "Are you sure? This will delete all your tracking data. This cannot be undone."
      )
    ) {
      store.dailyLogs = {};
      store.resetToday();
      toast.success("All data reset!");
    }
  };

  const activityLevels: ActivityLevel[] = ["beginner", "intermediate", "advanced", "athletic"];

  return (
    <div className="min-h-dvh bg-linear-to-br from-[#1E3A8A] via-[#312E81] to-[#4F46E5] p-4">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <Link
            href="/"
            className="rounded-full bg-white/10 p-2 backdrop-blur-xl transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <div className="w-10" />
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Profile
          </h2>

          <GlassCard>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Your Name
                </label>
                {editMode ? (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-white placeholder-gray-500 border border-white/20 focus:border-cyan-400 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleNameUpdate}
                      className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-cyan-600"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="mt-2 w-full rounded-lg bg-white/5 px-3 py-2 text-left text-white transition-colors hover:bg-white/10"
                  >
                    {store.userName}
                  </button>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Activity Level
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {activityLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => store.setActivityLevel(level)}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize transition-all ${
                        store.activityLevel === level
                          ? "bg-cyan-500 text-white"
                          : "bg-white/5 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Daily Streak
                </label>
                <div className="mt-2 text-2xl font-bold text-cyan-300">
                  {store.getStreak()} days 🔥
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <Achievements />
        </motion.div>

        {/* Goals Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Goals
          </h2>

          <GlassCard>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Daily Water Goal (ml)
                </label>
                <input
                  type="number"
                  value={store.goalWaterMl}
                  onChange={(e) =>
                    store.setGoals({ goalWaterMl: parseInt(e.target.value) || 0 })
                  }
                  className="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-white border border-white/20 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Daily Steps Goal
                </label>
                <input
                  type="number"
                  value={store.goalSteps}
                  onChange={(e) => store.setGoals({ goalSteps: parseInt(e.target.value) || 0 })}
                  className="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-white border border-white/20 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Daily Glasses Goal
                </label>
                <input
                  type="number"
                  value={store.goalGlasses}
                  onChange={(e) =>
                    store.setGoals({ goalGlasses: parseInt(e.target.value) || 0 })
                  }
                  className="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-white border border-white/20 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Notifications
          </h2>

          <GlassCard>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-cyan-300" />
                  <label className="text-sm font-semibold text-white">Enable Reminders</label>
                </div>
                <button
                  onClick={() =>
                    store.updateNotificationSettings({
                      enabled: !store.notificationSettings.enabled,
                    })
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    store.notificationSettings.enabled ? "bg-cyan-500" : "bg-white/20"
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white"
                    animate={{
                      x: store.notificationSettings.enabled ? 20 : 2,
                    }}
                  />
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Frequency
                </label>
                <select
                  value={store.notificationSettings.frequency}
                  onChange={(e) =>
                    store.updateNotificationSettings({
                      frequency: e.target.value as any,
                    })
                  }
                  className="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-white border border-white/20 focus:border-cyan-400 focus:outline-none capitalize"
                >
                  <option value="hourly">Every hour</option>
                  <option value="every2h">Every 2 hours</option>
                  <option value="every4h">Every 4 hours</option>
                  <option value="daily">Once daily</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white">Quiet Hours</label>
                <button
                  onClick={() =>
                    store.updateNotificationSettings({
                      quietHours: !store.notificationSettings.quietHours,
                    })
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    store.notificationSettings.quietHours ? "bg-cyan-500" : "bg-white/20"
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white"
                    animate={{
                      x: store.notificationSettings.quietHours ? 20 : 2,
                    }}
                  />
                </button>
              </div>

              {store.notificationSettings.quietHours && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={store.notificationSettings.quietStart}
                      onChange={(e) =>
                        store.updateNotificationSettings({
                          quietStart: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white border border-white/20 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={store.notificationSettings.quietEnd}
                      onChange={(e) =>
                        store.updateNotificationSettings({
                          quietEnd: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white border border-white/20 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Theme Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Appearance
          </h2>

          <GlassCard>
            <div className="flex gap-2">
              <button
                onClick={() => store.setTheme("dark")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 transition-all ${
                  store.theme === "dark"
                    ? "bg-cyan-500 text-white"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                <Moon className="h-4 w-4" />
                Dark
              </button>
              <button
                onClick={() => store.setTheme("light")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 transition-all ${
                  store.theme === "light"
                    ? "bg-cyan-500 text-white"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                <Sun className="h-4 w-4" />
                Light
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Subscription Section */}
        {!store.subscriptionActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-300">
              Subscription
            </h2>

            <GlassCard className="border border-cyan-500/30 bg-linear-to-br from-cyan-500/10 to-blue-500/10">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                  <span className="text-sm font-semibold text-white">Premium Features</span>
                </div>
                <p className="text-xs text-gray-300">
                  First week free, then $19.99/year. Less than your monthly coffee! 👌
                </p>
                <button
                  onClick={() => store.activateSubscription()}
                  className="w-full rounded-lg bg-linear-to-r from-cyan-400 to-blue-500 px-4 py-2 font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan-500/50"
                >
                  Start Free Trial
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {store.subscriptionActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-300">
              Subscription
            </h2>

            <GlassCard className="border border-cyan-500/30 bg-linear-to-br from-cyan-500/10 to-blue-500/10">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Premium Active ✨</span>
                  <span className="rounded-full bg-green-500/30 px-2 py-1 text-xs font-semibold text-green-200">
                    Active
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  Started on{" "}
                  {store.subscriptionStartDate
                    ? new Date(store.subscriptionStartDate).toLocaleDateString()
                    : "today"}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Data Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Data
          </h2>

          <div className="space-y-2">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-3 font-semibold text-white transition-all hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              Export Data
            </button>

            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 font-semibold text-red-300 transition-all hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
              Reset All Data
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-gray-400"
        >
          <p>Water v1.0.0</p>
          <p className="mt-1">Simple. Hydrated. Moving.</p>
        </motion.div>

        <div className="h-20" />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Dumbbell, Calendar } from "lucide-react";
import Link from "next/link";
import { useWaterStore, type Activity } from "@/lib/store";
import { GlassCard } from "@/components/GlassCard";
import { toast } from "sonner";

const activityTypes = [
  { type: "workout", label: "💪 Workout", color: "from-purple-500 to-pink-500" },
  { type: "walk", label: "🚶 Walk", color: "from-green-500 to-teal-500" },
  { type: "run", label: "🏃 Run", color: "from-orange-500 to-red-500" },
  { type: "sport", label: "⚽ Sport", color: "from-blue-500 to-cyan-500" },
  { type: "other", label: "🎯 Other", color: "from-gray-600 to-gray-700" },
] as const;

export default function ActivityPage() {
  const store = useWaterStore();
  const [selectedType, setSelectedType] = useState<Activity["type"] | null>(null);
  const [duration, setDuration] = useState("30");
  const [calories, setCalories] = useState("");
  const [activityName, setActivityName] = useState("");

  const handleAddActivity = () => {
    if (!selectedType || !duration) {
      toast.error("Please fill in all required fields");
      return;
    }

    const durationNum = parseInt(duration);
    if (durationNum <= 0 || durationNum > 480) {
      toast.error("Duration must be between 1 and 480 minutes");
      return;
    }

    const log = store.getTodayLog();
    const estimatedSteps = Math.round(durationNum * 100);

    store.addActivity({
      type: selectedType,
      name: activityName || selectedType,
      duration: durationNum,
      calories: calories ? parseInt(calories) : undefined,
    });

    // Auto-add estimated steps based on activity duration
    if (selectedType !== "workout") {
      store.addSteps(estimatedSteps);
    }

    setSelectedType(null);
    setDuration("30");
    setCalories("");
    setActivityName("");

    toast.success("Activity logged! Great work! 🎉");
  };

  const todayActivities = store.getActivitiesForToday();

  return (
    <div className="min-h-dvh bg-linear-to-br from-[#1E3A8A] via-[#312E81] to-[#4F46E5] p-4">
      <div className="mx-auto max-w-md pb-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <Link
            href="/progress"
            className="rounded-full bg-white/10 p-2 backdrop-blur-xl transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Log Activity</h1>
          <div className="w-10" />
        </motion.div>

        {/* Today's Activities */}
        {todayActivities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-300">
              Today's Activities
            </h2>

            <div className="space-y-2">
              {todayActivities.map((activity) => (
                <GlassCard key={activity.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white capitalize">{activity.name}</p>
                    <p className="text-xs text-gray-400">
                      {activity.duration} mins
                      {activity.calories && ` • ${activity.calories} cal`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-cyan-300">{activity.duration}</p>
                    <p className="text-xs text-gray-400">mins</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* Activity Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Activity Type
          </h2>

          <div className="grid grid-cols-2 gap-2">
            {activityTypes.map((activity) => (
              <motion.button
                key={activity.type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(activity.type as Activity["type"])}
                className={`rounded-xl px-3 py-3 font-semibold transition-all ${
                  selectedType === activity.type
                    ? `bg-linear-to-br ${activity.color} text-white shadow-lg`
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {activity.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Activity Details */}
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-300">
              Activity Details
            </h2>

            <GlassCard>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Activity Name (optional)
                  </label>
                  <input
                    type="text"
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    placeholder={selectedType}
                    className="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-gray-500 border border-white/20 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                    max="480"
                    className="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-white border border-white/20 focus:border-cyan-400 focus:outline-none"
                  />
                  <div className="mt-2 flex gap-1">
                    {[15, 30, 45, 60].map((min) => (
                      <button
                        key={min}
                        onClick={() => setDuration(min.toString())}
                        className="flex-1 rounded-lg bg-white/5 px-2 py-1 text-xs font-semibold text-gray-300 transition-colors hover:bg-white/10"
                      >
                        {min}m
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Calories (optional)
                  </label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    min="0"
                    className="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-white border border-white/20 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleAddActivity}
                  className="w-full rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 px-4 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan-500/50"
                >
                  Add Activity
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-white/5 p-4 backdrop-blur"
        >
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-cyan-300">
            <Dumbbell className="h-4 w-4" />
            💡 Pro Tip
          </h3>
          <p className="text-sm text-gray-300">
            Activities like walking and running automatically add estimated steps. Workouts need manual step entry!
          </p>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainHeader } from "@/components/MainHeader";
import { GlassCard } from "@/components/GlassCard";
import { FoodSearch } from "@/components/FoodSearch";
import { getDailyLog, addFoodEntry, deleteFoodEntry } from "@/lib/actions";
import { Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface FoodEntry {
  id: string;
  foodDatabase: {
    name: string;
    category: string;
  };
  quantity: number;
  waterMl: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: Date;
}

interface DailyLog {
  id: string;
  foodEntries: FoodEntry[];
  waterMl: number;
}

export default function NutritionPage() {
  const router = useRouter();
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const log = await getDailyLog();
      setDailyLog(log as any);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load nutrition data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFood = async (food: any, quantity: number) => {
    setIsSaving(true);
    try {
      await addFoodEntry(food.id, quantity);
      await loadData();
      toast.success(`Added ${food.name} to today's meals`);
    } catch (error) {
      console.error("Error adding food:", error);
      toast.error("Failed to add food entry");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFood = async (foodEntryId: string) => {
    try {
      await deleteFoodEntry(foodEntryId);
      await loadData();
      toast.success("Food entry deleted");
    } catch (error) {
      console.error("Error deleting food:", error);
      toast.error("Failed to delete food entry");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  const totalWater = dailyLog?.waterMl || 0;
  const totalCalories = dailyLog?.foodEntries.reduce((sum, e) => sum + e.calories, 0) || 0;
  const totalProtein = dailyLog?.foodEntries.reduce((sum, e) => sum + e.protein, 0) || 0;
  const totalCarbs = dailyLog?.foodEntries.reduce((sum, e) => sum + e.carbs, 0) || 0;
  const totalFat = dailyLog?.foodEntries.reduce((sum, e) => sum + e.fat, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-24">
      <MainHeader title="Nutrition" />

      <div className="max-w-2xl mx-auto px-4 space-y-6 pt-6">
        {/* Daily Total */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-400">Water from Food</div>
                <div className="text-3xl font-bold text-cyan-400">{totalWater}ml</div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Total Calories</div>
                <div className="text-3xl font-bold text-white">{totalCalories}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Protein</div>
                <div className="text-2xl font-bold text-white">{totalProtein.toFixed(1)}g</div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Carbs</div>
                <div className="text-2xl font-bold text-white">{totalCarbs.toFixed(1)}g</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-sm text-slate-400">Fat</div>
              <div className="text-2xl font-bold text-white">{totalFat.toFixed(1)}g</div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Food Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Add Food</h2>
            <FoodSearch onSelect={handleAddFood} isLoading={isSaving} />
          </GlassCard>
        </motion.div>

        {/* Food Entries */}
        {dailyLog?.foodEntries && dailyLog.foodEntries.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Today's Meals</h2>
              <div className="space-y-3">
                {dailyLog.foodEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex justify-between items-start bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{entry.foodDatabase.name}</h3>
                      <p className="text-sm text-slate-400">
                        {entry.quantity}g • {Math.round(entry.calories)} cal
                      </p>
                      <div className="text-xs text-slate-500 mt-2 grid grid-cols-2 gap-2">
                        <span>{Math.round(entry.waterMl)}ml water</span>
                        <span>{entry.protein.toFixed(1)}g protein</span>
                        <span>{entry.carbs.toFixed(1)}g carbs</span>
                        <span>{entry.fat.toFixed(1)}g fat</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteFood(entry.id)}
                      className="ml-4 p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300"
                      title="Delete entry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <GlassCard className="p-8 text-center">
              <AlertCircle className="mx-auto mb-3 text-slate-400" size={32} />
              <p className="text-slate-400">No food entries yet. Add your first meal!</p>
            </GlassCard>
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <GlassCard className="bg-blue-500/10 border-blue-500/20 p-4">
            <p className="text-sm text-slate-300">
              💡 <span className="font-medium">Pro Tip:</span> Water content in foods contributes to your daily hydration goal. Track meals to see how much water you're getting from food!
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

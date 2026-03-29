"use client";

import { useState, useCallback } from "react";
import { searchFood } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";

interface FoodItem {
  id: string;
  name: string;
  waterPer100g: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  category: string;
}

interface FoodSearchProps {
  onSelect: (food: FoodItem, quantity: number) => Promise<void>;
  isLoading?: boolean;
}

export function FoodSearch({ onSelect, isLoading = false }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(100);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = useCallback(
    async (value: string) => {
      setQuery(value);
      if (value.length < 1) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const foods = await searchFood(value);
        setResults(foods);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Failed to search foods");
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setQuery(food.name);
    setShowResults(false);
    setResults([]);
  };

  const handleAddFood = async () => {
    if (!selectedFood) {
      toast.error("Please select a food item");
      return;
    }

    if (quantity < 1) {
      toast.error("Quantity must be at least 1g");
      return;
    }

    try {
      await onSelect(selectedFood, quantity);
      setSelectedFood(null);
      setQuery("");
      setQuantity(100);
    } catch (error) {
      console.error("Error adding food:", error);
      toast.error("Failed to add food entry");
    }
  };

  const calculateNutrition = () => {
    if (!selectedFood) return null;
    return {
      water: Math.round((selectedFood.waterPer100g * quantity) / 100),
      calories: Math.round((selectedFood.caloriesPer100g * quantity) / 100),
      protein: ((selectedFood.proteinPer100g * quantity) / 100).toFixed(1),
      carbs: ((selectedFood.carbsPer100g * quantity) / 100).toFixed(1),
      fat: ((selectedFood.fatPer100g * quantity) / 100).toFixed(1),
    };
  };

  const nutrition = calculateNutrition();

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={18} />
        </div>
        <Input
          type="text"
          placeholder="Search foods..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder-slate-500 focus:bg-white/10"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-500 border-t-transparent" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-16 left-0 right-0 z-50 bg-slate-900/95 border border-white/10 rounded-lg shadow-xl max-h-64 overflow-y-auto">
          {results.map((food) => (
            <button
              key={food.id}
              onClick={() => handleSelectFood(food)}
              className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
            >
              <div className="font-medium text-white text-sm">{food.name}</div>
              <div className="text-xs text-slate-400">
                {Math.round(food.caloriesPer100g)} cal · {Math.round(food.waterPer100g)}% water
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Food Details */}
      {selectedFood && (
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-white">{selectedFood.name}</h3>
            <p className="text-xs text-slate-400">{selectedFood.category}</p>
          </div>

          {/* Quantity Input */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-300 w-20">Quantity</label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
              className="flex-1 bg-white/5 border-white/10 text-white placeholder-slate-500"
            />
            <span className="text-sm text-slate-400">g</span>
          </div>

          {/* Nutrition Summary */}
          {nutrition && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded p-3">
                <div className="text-xs text-slate-400">Water</div>
                <div className="text-lg font-bold text-cyan-400">{nutrition.water}ml</div>
              </div>
              <div className="bg-white/5 rounded p-3">
                <div className="text-xs text-slate-400">Calories</div>
                <div className="text-lg font-bold text-white">{nutrition.calories}</div>
              </div>
              <div className="bg-white/5 rounded p-3">
                <div className="text-xs text-slate-400">Protein</div>
                <div className="text-lg font-bold text-white">{nutrition.protein}g</div>
              </div>
              <div className="bg-white/5 rounded p-3">
                <div className="text-xs text-slate-400">Carbs</div>
                <div className="text-lg font-bold text-white">{nutrition.carbs}g</div>
              </div>
              <div className="col-span-2 bg-white/5 rounded p-3">
                <div className="text-xs text-slate-400">Fat</div>
                <div className="text-lg font-bold text-white">{nutrition.fat}g</div>
              </div>
            </div>
          )}

          {/* Add Button */}
          <Button
            onClick={handleAddFood}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold gap-2"
          >
            <Plus size={18} />
            {isLoading ? "Adding..." : "Add to Today"}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {showResults && results.length === 0 && query.length > 0 && !isSearching && (
        <div className="text-center py-4">
          <p className="text-slate-400 text-sm">No foods found</p>
        </div>
      )}
    </div>
  );
}

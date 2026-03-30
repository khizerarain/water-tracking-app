"use server";

// Server actions will work with Clerk + Prisma when properly configured
// For now, falling back to Zustand localStorage for development

export async function getDailyLog(date: Date = new Date()) {
  try {
    // This will work when Clerk + Neon + Prisma are configured
    // For now, return empty object
    return {
      id: "temp",
      userId: "temp",
      date,
      waterMl: 0,
      steps: 0,
      waterEntries: [],
      foodEntries: [],
    };
  } catch (error) {
    console.warn("Database not available:", error);
    return null;
  }
}

export async function addWaterEntry(amountMl: number) {
  try {
    // Will work when database is configured
    return { id: "temp", amountMl, timestamp: new Date() };
  } catch (error) {
    console.warn("Cannot add water entry:", error);
    throw error;
  }
}

export async function addFoodEntry(foodDatabaseId: string, quantity: number) {
  try {
    // Will work when database is configured
    return { id: "temp", foodDatabaseId, quantity };
  } catch (error) {
    console.warn("Cannot add food entry:", error);
    throw error;
  }
}

export async function addSteps(amount: number) {
  try {
    return { id: "temp", steps: amount };
  } catch (error) {
    console.warn("Cannot add steps:", error);
    throw error;
  }
}

export async function searchFood(query: string) {
  try {
    // Will work when database is configured
    return [];
  } catch (error) {
    console.warn("Cannot search food:", error);
    return [];
  }
}

export async function getFoodsByCategory(category: string) {
  try {
    return [];
  } catch (error) {
    console.warn("Cannot get foods:", error);
    return [];
  }
}

export async function deleteFoodEntry(foodEntryId: string) {
  try {
    return true;
  } catch (error) {
    console.warn("Cannot delete food entry:", error);
    throw error;
  }
}

export async function deleteWaterEntry(waterEntryId: string) {
  try {
    return true;
  } catch (error) {
    console.warn("Cannot delete water entry:", error);
    throw error;
  }
}

export async function getUser() {
  try {
    return null;
  } catch (error) {
    console.warn("Cannot get user:", error);
    return null;
  }
}

export async function syncUserFromClerk(
  clerkId: string,
  email: string,
  name?: string
) {
  try {
    return { clerkId, email, name };
  } catch (error) {
    console.warn("Cannot sync user:", error);
    throw error;
  }
}

# Water App - Server Actions & API Reference

This document details all server-side data operations available in the Water app.

## Overview

All data operations are handled through **Server Actions** in `lib/actions.ts`. They:
- Require Clerk authentication (automatic user context)
- Run securely on the server
- Include proper error handling and validation
- Automatically revalidate cached data
- Type-safe with TypeScript

## Authentication Context

All functions automatically get the authenticated user's `userId` from Clerk:

```typescript
const { userId } = await auth();
if (!userId) throw new Error("Unauthorized");
```

If user is not authenticated, functions throw an error caught by the client.

## Server Actions

### getDailyLog(date?: Date)

Gets or creates a daily log for the specified date (defaults to today).

**Parameters:**
- `date?`: Date object - Defaults to today at 00:00:00

**Returns:**
```typescript
{
  id: string;
  userId: string;
  date: Date;
  waterMl: number;
  steps: number;
  waterEntries: WaterEntry[];
  foodEntries: FoodEntry[];
}
```

**Usage:**
```typescript
const log = await getDailyLog();
const yesterdayLog = await getDailyLog(new Date(Date.now() - 86400000));
```

**Notes:**
- Creates daily log if it doesn't exist
- Includes all water and food entries for the day
- Sorted by timestamp (most recent first)

---

### addWaterEntry(amountMl: number)

Adds a water entry and updates the daily log total.

**Parameters:**
- `amountMl`: number - Amount of water in milliliters (required, > 0)

**Returns:**
```typescript
{
  id: string;
  dailyLogId: string;
  amountMl: number;
  timestamp: Date;
}
```

**Usage:**
```typescript
// Add 250ml of water
const entry = await addWaterEntry(250);

// Add 1 glass (237ml)
await addWaterEntry(237);

// Add 1 liter (1000ml)
await addWaterEntry(1000);
```

**Side Effects:**
- Creates WaterEntry record
- Updates DailyLog.waterMl with new total
- Revalidates `/water` and `/` pages

**Errors:**
- Throws if user not authenticated
- Throws if amountMl ≤ 0

---

### addFoodEntry(foodDatabaseId: string, quantity: number)

Logs a food item with quantity and calculates nutrition.

**Parameters:**
- `foodDatabaseId`: string - ID from FoodDatabase (UUID)
- `quantity`: number - Quantity in grams

**Returns:**
```typescript
{
  id: string;
  dailyLogId: string;
  foodDatabaseId: string;
  quantity: number;
  waterMl: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: Date;
}
```

**Usage:**
```typescript
// Log 150g of chicken
await addFoodEntry("uuid-of-chicken", 150);

// Log 100g of apple
await addFoodEntry("uuid-of-apple", 100);

// Log 250ml of orange juice (250g)
await addFoodEntry("uuid-of-oj", 250);
```

**Calculation:**
Values are calculated from FoodDatabase nutritional data per 100g:
```
waterMl = (foodItem.waterPer100g * quantity) / 100
calories = (foodItem.caloriesPer100g * quantity) / 100
protein = (foodItem.proteinPer100g * quantity) / 100
carbs = (foodItem.carbsPer100g * quantity) / 100
fat = (foodItem.fatPer100g * quantity) / 100
```

**Side Effects:**
- Creates FoodEntry record
- Updates DailyLog aggregates (waterMl, totals)
- Revalidates `/nutrition` and `/` pages

**Errors:**
- Throws if user not authenticated
- Throws if food not found
- Throws if quantity < 1

---

### addSteps(amount: number)

Adds steps to today's daily log.

**Parameters:**
- `amount`: number - Number of steps to add

**Returns:**
```typescript
{
  id: string;
  userId: string;
  date: Date;
  waterMl: number;
  steps: number;
  // ... other fields
}
```

**Usage:**
```typescript
// Add 1000 steps
await addSteps(1000);

// Add steps from activity tracker
const stepsFromDevice = 5432;
await addSteps(stepsFromDevice);
```

**Side Effects:**
- Updates DailyLog.steps (adds to existing total)
- Revalidates `/steps` and `/` pages

**Notes:**
- Only updates today's log
- For historical dates, use manual database updates

---

### searchFood(query: string)

Searches the food database by name.

**Parameters:**
- `query`: string - Search query (minimum 1 character)

**Returns:**
```typescript
FoodDatabase[]  // Array of up to 10 matching foods
```

**Usage:**
```typescript
// Search for apple
const results = await searchFood("apple");

// Search for chicken
const chicken = await searchFood("chicken");

// Empty query returns empty array
await searchFood("");  // Returns []
```

**Response Example:**
```typescript
[
  {
    id: "uuid-1",
    name: "Apple",
    category: "Fruits",
    waterPer100g: 86,
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    carbsPer100g: 13.8,
    fatPer100g: 0.2,
  },
  // ... more results
]
```

**Notes:**
- Case-insensitive search
- Partial matches included (e.g., "chick" finds "Chicken")
- Limited to 10 results for performance
- No authentication required (public food database)

---

### getFoodsByCategory(category: string)

Gets all foods in a specific category.

**Parameters:**
- `category`: string - Food category name

**Returns:**
```typescript
FoodDatabase[]  // Array of up to 20 foods in category
```

**Available Categories:**
- "Fruits"
- "Vegetables"
- "Proteins"
- "Dairy"
- "Grains"
- "Nuts"
- "Beverages"

**Usage:**
```typescript
// Get all fruits
const fruits = await getFoodsByCategory("Fruits");

// Get all vegetables
const veggies = await getFoodsByCategory("Vegetables");
```

**Returns Maximum 20 items per category.**

---

### deleteFoodEntry(foodEntryId: string)

Removes a food entry and recalculates daily totals.

**Parameters:**
- `foodEntryId`: string - UUID of the FoodEntry to delete

**Returns:**
```typescript
true  // On success
```

**Usage:**
```typescript
// Delete a food entry
await deleteFoodEntry("uuid-of-food-entry");
```

**Side Effects:**
- Deletes FoodEntry record
- Recalculates DailyLog totals
- Revalidates `/nutrition` and `/` pages

**Errors:**
- Throws if user not authenticated
- Throws if entry not found
- Throws if user doesn't own the entry

**Security:**
- Verifies entry belongs to authenticated user before deletion
- Prevents cross-user data access

---

### deleteWaterEntry(waterEntryId: string)

Removes a water entry and recalculates daily total.

**Parameters:**
- `waterEntryId`: string - UUID of the WaterEntry to delete

**Returns:**
```typescript
true  // On success
```

**Usage:**
```typescript
// Delete a water entry
await deleteWaterEntry("uuid-of-water-entry");
```

**Side Effects:**
- Deletes WaterEntry record
- Recalculates DailyLog.waterMl
- Revalidates `/water` and `/` pages

**Errors:**
- Throws if user not authenticated
- Throws if entry not found
- Throws if user doesn't own the entry

**Security:**
- Verifies entry belongs to authenticated user before deletion

---

### getUser()

Gets the authenticated user's profile.

**Parameters:**
- None

**Returns:**
```typescript
{
  id: string;
  clerkId: string;  // Clerk user ID
  email: string;
  name?: string;
  activityLevel?: string;
  dailyWaterGoal?: number;
  dailyStepsGoal?: number;
  createdAt: Date;
  updatedAt: Date;
} | null  // Returns null if not authenticated
```

**Usage:**
```typescript
const user = await getUser();
if (user) {
  console.log(`Welcome, ${user.name}`);
}
```

**Notes:**
- Returns null if user not authenticated
- Safe to call from components

---

### syncUserFromClerk(clerkId: string, email: string, name?: string)

Syncs user from Clerk authentication into database.

**Parameters:**
- `clerkId`: string - Clerk user ID
- `email`: string - User email
- `name?`: string - User name (optional)

**Returns:**
```typescript
{
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  // ... other fields
}
```

**Usage:**
```typescript
// Called automatically in Clerk middleware
await syncUserFromClerk("clerk_123", "user@example.com", "John Doe");
```

**Notes:**
- Uses Prisma `upsert` (creates or updates)
- Called automatically when user signs in
- Usually don't need to call manually

---

## Error Handling

All server actions throw errors that should be caught client-side:

```typescript
try {
  await addWaterEntry(250);
} catch (error) {
  console.error("Error:", error);
  toast.error("Failed to add water");
}
```

Common errors:
- "Unauthorized" - User not authenticated
- "Table does not exist" - Database not set up
- "Food not found" - Invalid foodDatabaseId

---

## Caching & Revalidation

Actions automatically revalidate specific paths:

| Action | Revalidates |
|--------|------------|
| addWaterEntry | `/water`, `/` |
| deleteWaterEntry | `/water`, `/` |
| addFoodEntry | `/nutrition`, `/` |
| deleteFoodEntry | `/nutrition`, `/` |
| addSteps | `/steps`, `/` |

This ensures UI stays in sync with database without manual refresh.

---

## Performance Considerations

- **Food Search**: Limited to 10 results for quick response
- **getDailyLog**: Includes all entries (can be optimized with pagination)
- **Aggregations**: Calculated on-the-fly (consider caching for performance)

---

## Type Definitions

Import types from Prisma:

```typescript
import { Prisma } from "@prisma/client";

type User = Prisma.UserGetPayload<{}>;
type DailyLog = Prisma.DailyLogGetPayload<{ include: { waterEntries: true; foodEntries: true } }>;
```

---

## Code Examples

### Complete flow: Log water intake

```typescript
"use client";
import { addWaterEntry, getDailyLog } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function QuickWater() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddWater = async (amount: number) => {
    setIsLoading(true);
    try {
      await addWaterEntry(amount);
      const log = await getDailyLog();
      toast.success(`${log.waterMl}ml logged today`);
    } catch (error) {
      toast.error("Failed to add water");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button onClick={() => handleAddWater(250)}>250ml</Button>
      <Button onClick={() => handleAddWater(500)}>500ml</Button>
      <Button onClick={() => handleAddWater(1000)}>1L</Button>
    </div>
  );
}
```

### Complete flow: Search and log food

```typescript
"use client";
import { searchFood, addFoodEntry } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function FoodLogger() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (value: string) => {
    setQuery(value);
    const foods = await searchFood(value);
    setResults(foods);
  };

  const handleSelectFood = async (foodId: string) => {
    await addFoodEntry(foodId, 100);  // Log 100g
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search foods..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="space-y-2">
        {results.map((food) => (
          <Button
            key={food.id}
            onClick={() => handleSelectFood(food.id)}
            variant="outline"
          >
            {food.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
```

---

## Best Practices

1. **Always handle errors** - Wrap server actions in try-catch
2. **Provide feedback** - Show toast messages on success/error
3. **Validate inputs** - Check quantities > 0 before sending
4. **Use revalidation** - Don't manually refetch data after mutations
5. **Security first** - Never pass unvalidated user input to food ID
6. **Cache wisely** - Use getDailyLog once per component tree

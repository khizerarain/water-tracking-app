import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const foodDatabase = [
  // Fruits (high water content)
  { name: "Apple", waterPer100g: 86, caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatPer100g: 0.2, category: "Fruit" },
  { name: "Banana", waterPer100g: 75, caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3, category: "Fruit" },
  { name: "Orange", waterPer100g: 87, caloriesPer100g: 47, proteinPer100g: 0.9, carbsPer100g: 12, fatPer100g: 0.1, category: "Fruit" },
  { name: "Strawberry", waterPer100g: 91, caloriesPer100g: 32, proteinPer100g: 0.8, carbsPer100g: 8, fatPer100g: 0.3, category: "Fruit" },
  { name: "Watermelon", waterPer100g: 92, caloriesPer100g: 30, proteinPer100g: 0.6, carbsPer100g: 8, fatPer100g: 0.2, category: "Fruit" },
  { name: "Grapes", waterPer100g: 81, caloriesPer100g: 67, proteinPer100g: 0.7, carbsPer100g: 17, fatPer100g: 0.2, category: "Fruit" },
  { name: "Blueberry", waterPer100g: 84, caloriesPer100g: 57, proteinPer100g: 0.7, carbsPer100g: 14, fatPer100g: 0.3, category: "Fruit" },
  { name: "Mango", waterPer100g: 83, caloriesPer100g: 60, proteinPer100g: 0.8, carbsPer100g: 15, fatPer100g: 0.3, category: "Fruit" },

  // Vegetables (high water content)
  { name: "Cucumber", waterPer100g: 96, caloriesPer100g: 15, proteinPer100g: 0.7, carbsPer100g: 3.6, fatPer100g: 0.1, category: "Vegetable" },
  { name: "Lettuce (Iceberg)", waterPer100g: 96, caloriesPer100g: 14, proteinPer100g: 0.9, carbsPer100g: 2.9, fatPer100g: 0.1, category: "Vegetable" },
  { name: "Tomato", waterPer100g: 95, caloriesPer100g: 18, proteinPer100g: 0.9, carbsPer100g: 3.9, fatPer100g: 0.2, category: "Vegetable" },
  { name: "Celery", waterPer100g: 95, caloriesPer100g: 16, proteinPer100g: 0.7, carbsPer100g: 3.7, fatPer100g: 0.1, category: "Vegetable" },
  { name: "Spinach", waterPer100g: 91, caloriesPer100g: 23, proteinPer100g: 2.7, carbsPer100g: 3.6, fatPer100g: 0.4, category: "Vegetable" },
  { name: "Broccoli", waterPer100g: 89, caloriesPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 7, fatPer100g: 0.4, category: "Vegetable" },
  { name: "Carrot", waterPer100g: 88, caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 10, fatPer100g: 0.2, category: "Vegetable" },
  { name: "Bell Pepper", waterPer100g: 92, caloriesPer100g: 31, proteinPer100g: 1, carbsPer100g: 6, fatPer100g: 0.3, category: "Vegetable" },
  { name: "Zucchini", waterPer100g: 95, caloriesPer100g: 21, proteinPer100g: 1.4, carbsPer100g: 3.5, fatPer100g: 0.4, category: "Vegetable" },

  // Proteins
  { name: "Chicken Breast", waterPer100g: 74, caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, category: "Protein" },
  { name: "Salmon", waterPer100g: 70, caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13, category: "Protein" },
  { name: "Egg (whole)", waterPer100g: 76, caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11, category: "Protein" },
  { name: "Tofu", waterPer100g: 85, caloriesPer100g: 76, proteinPer100g: 8, carbsPer100g: 1.9, fatPer100g: 4.8, category: "Protein" },
  { name: "Beef (lean)", waterPer100g: 60, caloriesPer100g: 250, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 15, category: "Protein" },

  // Dairy
  { name: "Yogurt (plain)", waterPer100g: 88, caloriesPer100g: 59, proteinPer100g: 3.5, carbsPer100g: 4.7, fatPer100g: 0.4, category: "Dairy" },
  { name: "Milk (2%)", waterPer100g: 89, caloriesPer100g: 49, proteinPer100g: 3.3, carbsPer100g: 4.8, fatPer100g: 1.7, category: "Dairy" },
  { name: "Cheese (cheddar)", waterPer100g: 37, caloriesPer100g: 403, proteinPer100g: 23, carbsPer100g: 3.3, fatPer100g: 33, category: "Dairy" },

  // Grains & Carbs
  { name: "Rice (cooked)", waterPer100g: 68, caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3, category: "Grain" },
  { name: "Bread (white)", waterPer100g: 37, caloriesPer100g: 265, proteinPer100g: 9, carbsPer100g: 49, fatPer100g: 3.3, category: "Grain" },
  { name: "Pasta (cooked)", waterPer100g: 62, caloriesPer100g: 131, proteinPer100g: 5, carbsPer100g: 25, fatPer100g: 1.1, category: "Grain" },
  { name: "Oats (dry)", waterPer100g: 8, caloriesPer100g: 389, proteinPer100g: 17, carbsPer100g: 66, fatPer100g: 7, category: "Grain" },

  // Nuts & Seeds
  { name: "Almonds", waterPer100g: 4, caloriesPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50, category: "Nuts" },
  { name: "Peanut Butter", waterPer100g: 1, caloriesPer100g: 588, proteinPer100g: 26, carbsPer100g: 20, fatPer100g: 50, category: "Nuts" },

  // Beverages
  { name: "Orange Juice", waterPer100g: 88, caloriesPer100g: 45, proteinPer100g: 0.7, carbsPer100g: 11, fatPer100g: 0.2, category: "Beverage" },
  { name: "Coffee (black)", waterPer100g: 99, caloriesPer100g: 1, proteinPer100g: 0.1, carbsPer100g: 0, fatPer100g: 0, category: "Beverage" },
  { name: "Green Tea", waterPer100g: 99, caloriesPer100g: 2, proteinPer100g: 0.3, carbsPer100g: 0, fatPer100g: 0, category: "Beverage" },

  // Other
  { name: "Avocado", waterPer100g: 73, caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 9, fatPer100g: 15, category: "Fruit" },
  { name: "Sweet Potato", waterPer100g: 77, caloriesPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatPer100g: 0.1, category: "Vegetable" },
];

async function main() {
  console.log("🌱 Seeding FoodDatabase...");

  for (const food of foodDatabase) {
    await prisma.foodDatabase.upsert({
      where: { name: food.name },
      update: {},
      create: food,
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

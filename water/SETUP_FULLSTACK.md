# Full-Stack Water App - Setup Guide

This guide walks you through setting up the Water app with Neon PostgreSQL, Clerk authentication, and Prisma ORM.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (for version control)

## Step 1: Environment Setup

### 1.1 Create `.env.local` file

Copy the template and fill in your credentials:

```bash
cp .env.example .env.local
```

### 1.2 Get Neon Database URL

1. Go to [neon.tech](https://neon.tech)
2. Sign up or log in with GitHub
3. Create a new project
4. Copy the connection string (looks like: `postgresql://user:password@host/dbname`)
5. Paste into `.env.local` as `DATABASE_URL`

### 1.3 Get Clerk Authentication Keys

1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Set application name to "Water App"
4. Choose "Email, Phone Number, Social Connections"
5. In Settings > API Keys, copy:
   - Publishable Key → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Secret Key → `CLERK_SECRET_KEY`
6. In Settings > URLs, add:
   - Allowed redirect URLs: `http://localhost:3000`, `http://localhost:3000/sign-in`, `http://localhost:3000/sign-up`
   - (Replace with your production domain when deploying)

### 1.4 Set App URL

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 2: Install Dependencies

```bash
npm install
```

This installs:
- @prisma/client - Database ORM
- @clerk/nextjs - Authentication
- ts-node - TypeScript execution for scripts
- All other required dependencies

## Step 3: Initialize Database

### 3.1 Generate Prisma Client

```bash
npx prisma generate
```

### 3.2 Push Schema to Database

This creates tables in your Neon database:

```bash
npm run db:push
```

You'll see a prompt asking to create the dev database. Type `y` to confirm.

### 3.3 Seed Food Database

Populates the food database with 40 nutritional entries:

```bash
npm run db:seed
```

Expected output:
```
Seeding food database...
✓ Created 40 food entries
```

## Step 4: Verify Setup

### 4.1 Open Prisma Studio

Visual database explorer:

```bash
npm run db:studio
```

This opens `localhost:5555` where you can:
- View all database records
- Create/edit/delete entries
- Test data relationships

### 4.2 Check Environment Variables

Verify all variables are set:

```bash
npm run check:env  # (if available)
```

## Step 5: Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 5.1 Test Authentication

1. Navigate to the app
2. Click "Sign Up" or "Sign In" in top-right
3. Clerk authentication modal will appear
4. Sign up with email or social account
5. You'll be redirected to the app pre-logged-in

### 5.2 Test Features

- **Water Tracking**: Click "Water" tab → add water entries
- **Steps**: Click "Steps" tab → log daily steps
- **Nutrition**: Click "Nutrition" tab → search and log foods
- **Progress**: View analytics and charts

## Database Schema

The app uses 5 interconnected models:

### User
- Synced with Clerk authentication
- Stores activity level, goals, preferences

### DailyLog
- One per user per day
- Aggregates water, food, steps for the day
- Unique constraint: (userId, date)

### WaterEntry
- Individual water log entries
- Tracks timestamp and amount (ml)

### FoodEntry
- Individual food meals
- References FoodDatabase
- Calculates water, calories, macros from quantity

### FoodDatabase
- 40 pre-seeded food items
- Contains: water%, calories, protein, carbs, fat per 100g
- Organized by category (fruits, vegetables, proteins, dairy, grains, nuts, beverages)

## Troubleshooting

### Error: "DATABASE_URL is not set"

**Solution**: Check `.env.local` exists and has `DATABASE_URL` set with valid Neon connection string.

### Error: "Authentication failed"

**Solution**:
1. Verify Clerk keys in `.env.local`
2. Check Clerk project settings for correct URLs
3. Restart dev server: `npm run dev`

### Error: "Table does not exist"

**Solution**: Run migrations again:
```bash
npm run db:push
```

### Database connection timeout

**Solution**:
1. Verify Neon project is active (not paused)
2. Check internet connection
3. Verify DATABASE_URL is correct
4. Try creating new Neon database

### Food database not seeded

**Solution**:
```bash
npm run db:seed
```

If still empty, check for errors in seed output and verify database connection.

## Development Workflow

1. Make changes to `prisma/schema.prisma`
2. Run `npm run db:push` to apply changes
3. Server Actions in `lib/actions.ts` handle data mutations
4. Components use `"use client"` for client-side interactivity
5. Database queries happen server-side for security

## Deployment

### Before deploying to production:

1. **Update Neon project**: Use production database URL in `.env`
2. **Set Clerk URLs**: Add your production domain to allowed redirects
3. **Environment variables**: Add all `.env.local` variables to deployment platform
4. **Run migrations**: `npm run db:push` on production database
5. **Seed data**: `npm run db:seed` if needed (only run once)

### Vercel deployment:

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Vercel automatically runs build and deploys
4. Database migrations run in GitHub Actions (optional, set up pre-deploy)

## API Reference

### Server Actions (lib/actions.ts)

All marked with `"use server"` and require Clerk authentication.

#### getDailyLog(date?: Date)
Gets or creates daily log with all entries.

#### addWaterEntry(amountMl: number)
Adds water entry and updates daily total.

#### addFoodEntry(foodDatabaseId: string, quantity: number)
Logs food with quantity in grams.

#### addSteps(amount: number)
Adds steps to daily total.

#### searchFood(query: string)
Searches food database by name (max 10 results).

#### deleteFoodEntry(foodEntryId: string)
Removes food entry and recalculates totals.

#### deleteWaterEntry(waterEntryId: string)
Removes water entry and recalculates totals.

## Food Database Contents

40 foods organized by category:

- **Fruits (8)**: Apple, Banana, Watermelon, Orange, Strawberry, Blueberry, Grape, Avocado
- **Vegetables (9)**: Cucumber, Lettuce, Carrot, Broccoli, Spinach, Bell Pepper, Tomato, Zucchini, Sweet Potato
- **Proteins (5)**: Chicken Breast, Salmon, Egg, Tofu, Beef
- **Dairy (3)**: Yogurt (Greek), Milk, Cheese (Cheddar)
- **Grains (4)**: Rice, Bread (Whole Wheat), Pasta, Oats
- **Nuts/Seeds (2)**: Almonds, Peanut Butter
- **Beverages (3)**: Orange Juice, Coffee, Green Tea

Each entry includes water %, calories, protein, carbs, and fat per 100g.

## Next Steps

- Explore app features in development
- Test with real data before going live
- Customize nutrition goals in Settings
- Share feedback or report issues

## Support

For issues:
1. Check logs: `npm run dev` shows error details
2. Open Prisma Studio: `npm run db:studio` to inspect data
3. Check .env.local for typos or missing values
4. Restart dev server: Kill terminal and run `npm run dev` again

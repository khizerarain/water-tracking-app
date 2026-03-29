# 🚀 Quick Start Checklist - Phase 2 Full-Stack Setup

Complete these steps to get the Water app running with full-stack infrastructure.

## ✅ Pre-Setup (5 minutes)

- [ ] Create [Neon](https://neon.tech) account (free tier available)
- [ ] Create [Clerk](https://clerk.com) account (free tier available)
- [ ] Have Node.js 18+ installed on your computer

## ✅ Step 1: Environment Variables (10 minutes)

### 1.1 Create .env.local
```bash
cp .env.example .env.local
```

### 1.2 Get Neon Connection String
1. Go to https://neon.tech
2. Sign in / Create account
3. Create a new project (name: "water")
4. Wait for project initialization
5. Click "Connection string"
6. Copy the entire connection string
7. Paste into `.env.local`:
   ```
   DATABASE_URL=postgresql://user:password@host/dbname
   ```

### 1.3 Get Clerk Authentication Keys
1. Go to https://clerk.com
2. Sign in / Create account
3. Create a new application (name: "Water App")
4. Choose authentication methods: Email + Social
5. Go to **Settings > API Keys**
6. Copy **Publishable Key** → Paste in `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   ```
7. Copy **Secret Key** → Paste in `.env.local`:
   ```
   CLERK_SECRET_KEY=sk_test_xxxxx
   ```

### 1.4 Set App URL
Add this to `.env.local`:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 1.5 Add Redirect URLs in Clerk
1. In Clerk dashboard → Settings > URLs
2. Add to "Allowed redirect URLs":
   - `http://localhost:3000`
   - `http://localhost:3000/sign-in`
   - `http://localhost:3000/sign-up`
3. Save

**Your `.env.local` should now have 4 variables:**
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## ✅ Step 2: Install Dependencies (5 minutes)

```bash
npm install
```

This adds:
- `@clerk/nextjs` - Authentication
- `@prisma/client` - Database client
- `@prisma/cli` - Database tools
- `ts-node` - TypeScript execution

## ✅ Step 3: Initialize Database (10 minutes)

### 3.1 Create Database Tables
```bash
npm run db:push
```

You'll see:
```
✔ Database connection successful
Your database is now in sync with your schema
```

### 3.2 Populate Food Database
```bash
npm run db:seed
```

You'll see:
```
Seeding food database...
✓ Created 40 food entries
```

### 3.3 (Optional) View Database
```bash
npm run db:studio
```

Opens http://localhost:5555 - Visual database explorer

## ✅ Step 4: Start Development Server (2 minutes)

```bash
npm run dev
```

You should see:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## ✅ Step 5: Test the App (5 minutes)

1. **Open Browser**: http://localhost:3000
2. **See Clerk Modal**: In top-right corner, "Sign In" should appear
3. **Create Account**: 
   - Click "Sign Up"
   - Use email or social login (Google/GitHub)
   - You'll be redirected to the app
4. **Test Water Tab**:
   - Click "Water" in bottom nav
   - Add some water (250ml, 500ml, 1L buttons)
   - See data update
5. **Test Nutrition Tab**:
   - Click "Nutrition" in bottom nav
   - Type "Apple" in search
   - Select Apple
   - Set quantity to 150g
   - See nutrition preview
   - Click "Add to Today"
   - See food entry appear
6. **Test Data Persistence**:
   - Refresh page (Cmd+R / Ctrl+R)
   - Data should still be there
   - Try adding from another device (same account)

## ✅ Troubleshooting

### "MODULE_NOT_FOUND: @clerk/nextjs"
**Fix**: Run `npm install` again

### "DATABASE_URL is not set"
**Fix**: 
- Check `.env.local` exists in project root
- Verify DATABASE_URL line is there
- Verify it's not DATABASE_URL.example

### "Invalid connection string"
**Fix**: 
- Get fresh connection string from Neon
- Make sure you copied the entire string
- Check for spaces at beginning/end

### "Table does not exist"
**Fix**: Run `npm run db:push` again

### "Clerk modal not appearing"
**Fix**:
- Check CLERK keys are in `.env.local`
- Check keys don't have quotes around them
- Restart dev server: Stop and run `npm run dev` again

### "No foods in database"
**Fix**: Run `npm run db:seed`

### "Sign in doesn't work"
**Fix**:
- Check Clerk credentials in `.env.local`
- Go to Clerk dashboard → Settings > URLs
- Verify localhost:3000 is in Allowed redirects
- Restart dev server

## 📚 Documentation to Review

After setup works, read these to understand the architecture:

1. **[SETUP_FULLSTACK.md](SETUP_FULLSTACK.md)** - Complete setup guide with troubleshooting
2. **[API_REFERENCE.md](API_REFERENCE.md)** - All Server Actions with examples
3. **[PHASE2_INTEGRATION_SUMMARY.md](PHASE2_INTEGRATION_SUMMARY.md)** - Architecture overview
4. **[README_FULLSTACK.md](README_FULLSTACK.md)** - Full project documentation

## 💡 Key Concepts

### How Data Flows:
1. User clicks button in React component
2. Component calls Server Action from `lib/actions.ts`
3. Server Action checks Clerk authentication
4. Prisma queries database for current user's data
5. Data is created/updated in database
6. Page automatically revalidates (cache refresh)
7. Component re-renders with new data

### User Data Privacy:
- Every Server Action checks `userId` from Clerk
- All queries filtered by `userId`
- Users can only see their own data
- No data leaks between accounts

### Food Database:
- 40 pre-seeded foods (never changes)
- Contains nutrition info per 100g
- Server Actions search this database
- Calculations based on quantity user enters

## ✨ What You Now Have

✅ **Authentication**: Users sign up/in with email or social  
✅ **Database**: Persistent PostgreSQL with Neon  
✅ **Water Tracking**: Logged to database (survives refresh)  
✅ **Nutrition Tracking**: 40 foods with full macros  
✅ **Type Safety**: TypeScript throughout  
✅ **Secure**: Server-side validation, user-filtered queries  
✅ **Production Ready**: Deployable to Vercel/any Node host  

## 🎯 Next Adventure Ideas

Once everything is working:
- Add charts showing weekly nutrition trends
- Create meal quick-buttons for favorite foods
- Add goal tracking and notifications
- Sync data across multiple devices
- Export nutrition reports
- Create meal planning recommendations

## 🙋 Need Help?

1. Check relevant doc file (see Documentation above)
2. Read troubleshooting in SETUP_FULLSTACK.md
3. Review code examples in API_REFERENCE.md
4. Check your .env.local for typos/missing values
5. Make sure all npm packages installed (npm install)

---

**You're ready to go!** Run `npm install` first, then follow the steps above. Should take about 30-45 minutes total.

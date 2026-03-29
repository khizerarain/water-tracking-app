// Prisma client stub - will be available when Neon + DATABASE_URL configured
// For development without database, this is stubbed out

let prisma: any = null;

try {
  try {
    const { PrismaClient } = require("@prisma/client");
    const globalForPrisma = global as unknown as { prisma: any };
    
    prisma = globalForPrisma.prisma || new PrismaClient({ log: ["query"] });
    
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
  } catch (e) {
    // Prisma not fully initialized - that's okay for dev
    console.warn("Prisma initialization skipped - database features disabled");
    prisma = null;
  }
} catch (error) {
  // Complete failure is okay 
}

export { prisma };

// Application initialization - runs once on startup
// Validates environment, database connection, and logs configuration

import { validateEnvironment, logEnvironmentSummary } from "./validate-env";
import { prisma } from "./db";

let initialized = false;

export async function initializeApp(): Promise<boolean> {
  if (initialized) {
    return true;
  }

  console.log("[v0] ========================================");
  console.log("[v0] Initializing Application");
  console.log("[v0] ========================================");

  // Validate environment variables
  const envValidation = validateEnvironment();
  logEnvironmentSummary();

  if (!envValidation.valid) {
    console.warn("[v0] ⚠ Environment validation issues found");
    console.warn("[v0] Warnings:");
    envValidation.errors.forEach((error) => console.warn("[v0]   - " + error));
    // Don't return false - allow app to run in development without database
  }

  // Test database connection (non-fatal if it fails)
  try {
    console.log("[v0] Testing database connection...");
    await prisma.$queryRaw`SELECT 1`;
    console.log("[v0] ✓ Database connection successful");
  } catch (error) {
    console.warn("[v0] ⚠ Database connection failed:", error instanceof Error ? error.message : 'Unknown error');
    console.warn("[v0] App will run with limited functionality");
  }

  initialized = true;
  console.log("[v0] ✓ Application initialized");
  console.log("[v0] ========================================");

  return true;
}

// Export initialization status
export function isInitialized(): boolean {
  return initialized;
}

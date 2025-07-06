import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../shared/schema";

// Create SQLite database
const sqlite = new Database("bloodsource.db");

// Create drizzle database instance
export const db = drizzle(sqlite, { schema });

// Export the sqlite instance for potential manual queries
export { sqlite }; 
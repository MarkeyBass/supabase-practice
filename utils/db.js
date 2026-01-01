import pg from "pg";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const { Pool } = pg;

// ES modules don't have __dirname, so we recreate it:
// import.meta.url gives file URL → fileURLToPath converts to path → dirname gets directory
// Note: path.resolve() returns current working directory (where you run the command),
//       not the file's directory, so it breaks if run from different folders
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let pool = null;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 54322,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "blog_db",
    });
  }
  return pool;
}

export async function initDb() {
  try {
    const pool = getPool();
    
    // Read and execute schema SQL
    const schemaPath = join(__dirname, "../database/schema.sql");
    const schemaSQL = readFileSync(schemaPath, "utf-8");

    
    // Split by semicolons and execute each statement
    const statements = schemaSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));
    
    for (const statement of statements) {
      if (statement.length > 0) {
        try {
          await pool.query(statement);
        } catch (error) {
          // Ignore errors for IF NOT EXISTS, ON CONFLICT, etc.
          if (!error.message.includes("already exists") && 
              !error.message.includes("duplicate key")) {
            console.warn("Schema execution warning:", error.message);
          }
        }
      }
    }
    
    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error.message);
    throw error;
  }
}


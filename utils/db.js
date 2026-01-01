import pg from "pg";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
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
let supabase = null;

// PostgreSQL connection pool (for raw SQL queries)
export function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 54322,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "postgres",
    });
  }
  return pool;
}

// Supabase client (for Supabase query language)
export function getSupabaseClient() {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file");
    }
    
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

export async function initDb() {
  const dbName = process.env.DB_NAME || "postgres";
  
  try {
    // Step 1: Create database if it doesn't exist (skip if using default 'postgres')
    if (dbName !== "postgres") {
      const adminPool = new Pool({
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 54322,
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: "postgres", // Connect to default database first
      });

      const result = await adminPool.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [dbName]
      );

      if (result.rows.length === 0) {
        console.log(`Creating database '${dbName}'...`);
        await adminPool.query(`CREATE DATABASE "${dbName}"`);
        console.log(`Database '${dbName}' created!`);
      } else {
        console.log(`Database '${dbName}' already exists.`);
      }

      await adminPool.end();
      
      // Small delay to ensure database is ready
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Reset pool to connect to new database
      if (pool) {
        await pool.end();
        pool = null;
      }
    }

    // Step 2: Connect to target database and create tables
    const dbPool = getPool();
    
    // Read and execute schema SQL
    const schemaPath = join(__dirname, "../database/schema.sql");
    const schemaSQL = readFileSync(schemaPath, "utf-8");
    
    // Remove comments and split by semicolon, but keep multi-line statements together
    const cleanedSQL = schemaSQL
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');
    
    // Split by semicolon, but be smarter about it
    const statements = cleanedSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      if (statement.length > 0) {
        try {
          await dbPool.query(statement + ';');
        } catch (error) {
          // Ignore "already exists", "duplicate key", and "does not exist" errors for policies/RLS
          const isIgnorableError = 
            error.message.includes("already exists") || 
            error.message.includes("duplicate key") ||
            error.message.includes("does not exist");
          
          if (!isIgnorableError) {
            console.error("Schema execution error:", error.message);
            console.error("Failed statement:", statement.substring(0, 100) + "...");
            throw error;
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


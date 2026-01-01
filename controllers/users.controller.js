import { getPool } from "../utils/db.js";

// ============================================
// EXERCISE 1: Basic SELECT with WHERE
// ============================================
// Convert this raw SQL query to Supabase query language
// SQL: SELECT id, name, email, age FROM users WHERE status = 'active' ORDER BY name ASC;
export const getActiveUsers = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.query(
      "SELECT id, name, email, age FROM users WHERE status = $1 ORDER BY name ASC",
      ["active"]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
      message: "Active users retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching active users:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// ============================================
// EXERCISE 2: Single Record by ID
// ============================================
// Convert this raw SQL query to Supabase query language
// SQL: SELECT * FROM users WHERE id = $1;
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Invalid user ID",
      });
    }

    const pool = getPool();
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
      message: "User retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// ============================================
// EXERCISE 3: INSERT with RETURNING
// ============================================
// Convert this raw SQL query to Supabase query language
// SQL: INSERT INTO users (email, name, age, status) VALUES ($1, $2, $3, $4) RETURNING *;
export const createUser = async (req, res) => {
  try {
    const { email, name, age, status } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Email and name are required",
      });
    }

    const pool = getPool();
    const result = await pool.query(
      "INSERT INTO users (email, name, age, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, name, age || null, status || "active"]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    
    // Handle unique constraint violation
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        data: null,
        message: "User with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};


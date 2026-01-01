import { getPool } from "../utils/db.js";

// ============================================
// EXERCISE 6: Range Filters (BETWEEN)
// ============================================
// Convert this raw SQL query to Supabase query language
// SQL: SELECT id, name, email, age FROM users WHERE age >= $1 AND age <= $2 ORDER BY age DESC;
export const getUsersByAgeRange = async (req, res) => {
  try {
    const { minAge, maxAge } = req.query;
    
    const min = minAge ? parseInt(minAge) : 0;
    const max = maxAge ? parseInt(maxAge) : 100;

    if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > max) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Invalid age range parameters",
      });
    }

    const pool = getPool();
    const result = await pool.query(
      "SELECT id, name, email, age FROM users WHERE age >= $1 AND age <= $2 ORDER BY age DESC",
      [min, max]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
      message: `Users aged between ${min} and ${max} retrieved successfully`,
    });
  } catch (error) {
    console.error("Error fetching users by age range:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// ============================================
// EXERCISE 7: Text Search (LIKE/ILIKE)
// ============================================
// Convert this raw SQL query to Supabase query language
// SQL: SELECT id, title, content, views FROM posts WHERE title ILIKE $1 OR content ILIKE $1 ORDER BY views DESC LIMIT 10;
export const searchPosts = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search || search.trim().length === 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Search query is required",
      });
    }

    const searchPattern = `%${search.trim()}%`;
    const pool = getPool();
    const result = await pool.query(
      "SELECT id, title, content, views FROM posts WHERE title ILIKE $1 OR content ILIKE $1 ORDER BY views DESC LIMIT 10",
      [searchPattern]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
      message: `Found ${result.rows.length} posts matching "${search}"`,
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};


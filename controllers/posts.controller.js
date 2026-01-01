import { getPool } from "../utils/db.js";

// ============================================
// EXERCISE 4: UPDATE with WHERE and Dynamic Fields
// ============================================
// Convert this raw SQL query to Supabase query language
// SQL: UPDATE posts SET title = $1, content = $2, published = $3, updated_at = NOW() WHERE id = $4 RETURNING *;
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Invalid post ID",
      });
    }

    // Build dynamic UPDATE query based on provided fields
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (content !== undefined) {
      updates.push(`content = $${paramIndex++}`);
      values.push(content);
    }
    if (published !== undefined) {
      updates.push(`published = $${paramIndex++}`);
      values.push(published);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "No fields to update",
      });
    }

    // Always update updated_at
    updates.push(`updated_at = NOW()`);
    values.push(postId);

    const query = `UPDATE posts SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`;

    const pool = getPool();
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
      message: "Post updated successfully",
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// ============================================
// EXERCISE 5: DELETE with WHERE
// ============================================
// Convert this raw SQL query to Supabase query language
// SQL: DELETE FROM posts WHERE id = $1;
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Invalid post ID",
      });
    }

    const pool = getPool();
    
    // First check if post exists
    const checkResult = await pool.query("SELECT id FROM posts WHERE id = $1", [postId]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Post not found",
      });
    }

    // Delete the post
    await pool.query("DELETE FROM posts WHERE id = $1", [postId]);

    res.status(200).json({
      success: true,
      data: null,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};


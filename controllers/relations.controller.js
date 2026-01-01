import { getPool } from "../utils/db.js";

// ============================================
// EXERCISE 8: JOIN Query (Single JOIN)
// ============================================
// Convert this raw SQL query to Supabase query language
// SQL: SELECT p.id, p.title, p.content, p.views, p.created_at, u.name as author_name, u.email as author_email
//      FROM posts p
//      INNER JOIN users u ON p.user_id = u.id
//      WHERE p.published = true
//      ORDER BY p.created_at DESC;
export const getPostsWithAuthor = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.views, 
        p.created_at, 
        u.name as author_name, 
        u.email as author_email
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.published = true
      ORDER BY p.created_at DESC`
    );

    res.status(200).json({
      success: true,
      data: result.rows,
      message: "Published posts with authors retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching posts with authors:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// ============================================
// EXERCISE 9: Multiple JOINs with Conditions
// ============================================
// Convert this raw SQL query to Supabase query language
// SQL: SELECT u.id, u.name, u.email, 
//           json_agg(json_build_object('id', p.id, 'title', p.title, 'views', p.views)) as posts,
//           json_agg(json_build_object('id', c.id, 'content', c.content, 'post_id', c.post_id)) as comments
//      FROM users u
//      LEFT JOIN posts p ON u.id = p.user_id
//      LEFT JOIN comments c ON u.id = c.user_id
//      WHERE u.id = $1
//      GROUP BY u.id, u.name, u.email;
export const getUserWithPostsAndComments = async (req, res) => {
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
    const result = await pool.query(
      `SELECT 
        u.id, 
        u.name, 
        u.email,
        u.age,
        u.status,
        u.created_at,
        COALESCE(json_agg(DISTINCT jsonb_build_object(
          'id', p.id, 
          'title', p.title, 
          'views', p.views,
          'published', p.published
        )) FILTER (WHERE p.id IS NOT NULL), '[]') as posts,
        COALESCE(json_agg(DISTINCT jsonb_build_object(
          'id', c.id, 
          'content', c.content, 
          'post_id', c.post_id,
          'created_at', c.created_at
        )) FILTER (WHERE c.id IS NOT NULL), '[]') as comments
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      LEFT JOIN comments c ON u.id = c.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.name, u.email, u.age, u.status, u.created_at`,
      [userId]
    );

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
      message: "User with posts and comments retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching user with posts and comments:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// ============================================
// EXERCISE 10: Complex Nested Query
// ============================================
// Convert this raw SQL query to Supabase query language
// SQL: SELECT 
//        p.id, p.title, p.content, p.views, p.created_at,
//        json_build_object('id', u.id, 'name', u.name, 'email', u.email) as author,
//        json_agg(json_build_object(
//          'id', c.id,
//          'content', c.content,
//          'created_at', c.created_at,
//          'author', json_build_object('id', cu.id, 'name', cu.name)
//        )) as comments
//      FROM posts p
//      INNER JOIN users u ON p.user_id = u.id
//      LEFT JOIN comments c ON p.id = c.post_id
//      LEFT JOIN users cu ON c.user_id = cu.id
//      WHERE p.id = $1
//      GROUP BY p.id, p.title, p.content, p.views, p.created_at, u.id, u.name, u.email;
export const getPostWithAllDetails = async (req, res) => {
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
    const result = await pool.query(
      `SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.views, 
        p.published,
        p.created_at,
        json_build_object(
          'id', u.id, 
          'name', u.name, 
          'email', u.email
        ) as author,
        COALESCE(json_agg(
          json_build_object(
            'id', c.id,
            'content', c.content,
            'created_at', c.created_at,
            'author', json_build_object('id', cu.id, 'name', cu.name)
          )
        ) FILTER (WHERE c.id IS NOT NULL), '[]') as comments
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN users cu ON c.user_id = cu.id
      WHERE p.id = $1
      GROUP BY p.id, p.title, p.content, p.views, p.published, p.created_at, u.id, u.name, u.email`,
      [postId]
    );

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
      message: "Post with all details retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching post with all details:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};


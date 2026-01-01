import express from "express";
import dotenv from "dotenv";
import { initDb } from "./utils/db.js";

// Import routes
import usersRoutes from "./routes/users.js";
import postsRoutes from "./routes/posts.js";
import searchRoutes from "./routes/search.js";
import relationsRoutes from "./routes/relations.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ================== ROUTES ===================

app.get("/", async (req, res) => {
  res.json({
    message: "Welcome to Supabase Practice API",
    version: "1.0.0",
    description: "Convert raw PostgreSQL queries to Supabase query language",
    exercises: {
      "1-3": "/users - Basic SELECT, single record, INSERT",
      "4-5": "/posts - UPDATE, DELETE",
      "6-7": "/search - Range filters, text search",
      "8-10": "/relations - JOINs and complex nested queries",
    },
  });
});

app.use("/users", usersRoutes);
app.use("/posts", postsRoutes);
app.use("/search", searchRoutes);
app.use("/relations", relationsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    data: null,
    message: err.message || "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, async () => {
  try {
    await initDb();
    console.log(`Server is running on port ${PORT}...`);
    console.log(`Visit http://localhost:${PORT} for API information`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
});


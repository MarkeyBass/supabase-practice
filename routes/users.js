import express from "express";
import {
  getActiveUsers,
  getUserById,
  createUser,
} from "../controllers/users.controller.js";

const router = express.Router();

// Exercise 1: GET /users/active - Get all active users
router.get("/active", getActiveUsers);

// Exercise 2: GET /users/:id - Get user by ID
router.get("/:id", getUserById);

// Exercise 3: POST /users - Create a new user
router.post("/", createUser);

export default router;


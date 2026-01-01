import express from "express";
import {
  getUsersByAgeRange,
  searchPosts,
} from "../controllers/search.controller.js";

const router = express.Router();

// Exercise 6: GET /search/users/age?minAge=18&maxAge=65 - Get users by age range
router.get("/users/age", getUsersByAgeRange);

// Exercise 7: GET /search/posts?search=nodejs - Search posts by title/content
router.get("/posts", searchPosts);

export default router;


import express from "express";
import {
  getPostsWithAuthor,
  getUserWithPostsAndComments,
  getPostWithAllDetails,
} from "../controllers/relations.controller.js";

const router = express.Router();

// Exercise 8: GET /relations/posts - Get published posts with author information
router.get("/posts", getPostsWithAuthor);

// Exercise 9: GET /relations/users/:id - Get user with all posts and comments
router.get("/users/:id", getUserWithPostsAndComments);

// Exercise 10: GET /relations/posts/:id - Get post with author and all comments (nested)
router.get("/posts/:id", getPostWithAllDetails);

export default router;


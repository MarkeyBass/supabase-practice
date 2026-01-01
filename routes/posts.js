import express from "express";
import { updatePost, deletePost } from "../controllers/posts.controller.js";

const router = express.Router();

// Exercise 4: PUT /posts/:id - Update a post
router.put("/:id", updatePost);

// Exercise 5: DELETE /posts/:id - Delete a post
router.delete("/:id", deletePost);

export default router;


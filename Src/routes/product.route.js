import express from "express";
import { createPost, getAllPosts, getPostById, deletePost, updatePost } from "../controllers/product.controllers.js";
import { upload } from "../middlewere/multer.middlewere.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the post
 *         description:
 *           type: string
 *           description: Description of the post
 *         price:
 *           type: number
 *           description: Price of the product
 *         images:
 *           type: string
 *           description: URL of the product image (optional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the post was created
 *         autorId:
 *           type: string
 *           description: ID of the user who created the post
 */

/**
 * @swagger
 * /api/product/create:
 *   post:
 *     summary: Create a new post with an image
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad Request
 */
router.post("/create", upload.single("image"), createPost);

/**
 * @swagger
 * /api/product/all:
 *   get:
 *     summary: Get all posts
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Post'
 */
router.get("/all", getAllPosts);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get a post by its ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post found
 *         content:
 *           application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
router.get("/:id", getPostById);

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete a post by its ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
router.delete("/:id", deletePost);

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Edit a post by its ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Post not found
 */
router.put("/:id", updatePost);

export default router;

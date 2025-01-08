import express from "express";
import { createUser, getAllUsers, logInUser, logoutUser, refreshToken } from "../controllers/user.controllers.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user
 *         email:
 *           type: string
 *           description: Email address of the user (unique)
 *         password:
 *           type: string
 *           description: User's password
 *         role:
 *           type: string
 *           description: Role of the user (e.g., admin, user)
 *         posts:
 *           type: array
 *           items:
 *             type: string
 *             description: List of post IDs created by the user
 *         orders:
 *           type: array
 *           items:
 *             type: string
 *             description: List of order IDs related to the user
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad Request
 */
router.post("/register", createUser);

/**
 * @swagger
 * /api/user/all:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/User'
 */
router.get("/all", getAllUsers);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", logInUser);

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Logout the user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post("/logout", logoutUser);

/**
 * @swagger
 * /api/user/refresh:
 *   post:
 *     summary: Refresh the user's token
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully refreshed token
 */
router.post("/refresh", refreshToken);

export default router;

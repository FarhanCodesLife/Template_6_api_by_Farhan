// import express from "express";
// import { orderPost, allOrders } from "../controllers/order.controllers.js";

// const router = express.Router();

// /**
//  * @swagger
//  * /api/order/create:
//  *   post:
//  *     summary: Create a new order
//  *     tags: [Order]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - autorId
//  *               - products
//  *             properties:
//  *               autorId:
//  *                 type: string
//  *                 description: The ID of the user who placed the order
//  *               products:
//  *                 type: array
//  *                 description: List of products in the order
//  *                 items:
//  *                   type: object
//  *                   properties:
//  *                     productId:
//  *                       type: string
//  *                       description: The ID of the product
//  *                     quantity:
//  *                       type: number
//  *                       description: The quantity of the product
//  *     responses:
//  *       201:
//  *         description: Order created successfully
//  *         content:
//  *           application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               message:
//  *                 type: string
//  *                 description: Success message
//  *               order:
//  *                 $ref: '#/components/schemas/Order'
//  *       400:
//  *         description: Invalid input
//  *       404:
//  *         description: User or product not found
//  *       500:
//  *         description: Internal Server Error
//  */
// router.post("/create", orderPost);

// /**
//  * @swagger
//  * /api/order/all:
//  *   get:
//  *     summary: Get all orders
//  *     tags: [Order]
//  *     responses:
//  *       200:
//  *         description: A list of all orders
//  *         content:
//  *           application/json:
//  *           schema:
//  *             type: array
//  *             items:
//  *               $ref: '#/components/schemas/Order'
//  *       404:
//  *         description: No orders found
//  *       500:
//  *         description: Internal Server Error
//  */
// router.get("/userOrders", allOrders);

// export default router;

// Import dependencies
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import connectDB from "./Src/db/index.js";
import userRouter from "./Src/routes/user.route.js";
import productRouter from "./Src/routes/product.route.js";
import { bulkInsertProducts } from "./utils/bulkproductsadd.js";
import { arrayofProducts } from "./utils/arrayofProducts.js";

// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON payloads

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Service is running" });
});

// Base Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API for managing users and products",
      contact: {
        name: "Muhammad Farhan",
        email: "farhansmit0318@gmail.com",
        phone: "03182127256",
      },
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:3000", // Dynamic base URL
      },
    ],
  },
  apis: ["./Src/routes/*.js"], // Path to API documentation
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    details: err.message,
  });
});

// Local Server for Development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000; // Use port from env or default 3000
  app.listen(PORT, async () => {
    try {
      await connectDB(); // Connect to MongoDB
      console.log(`Server is running at http://localhost:${PORT}`);
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
    }
  });
}

// Export the handler for Vercel
export default async (req, res) => {
  try {
    // Ensure MongoDB is connected for each request
    await connectDB();

    // Use Express to handle the request
    app(req, res);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

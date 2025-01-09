// Import dependencies
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import connectDB from "./Src/db/index.js";
import userRouter from "./Src/routes/user.route.js";
import productRouter from "./Src/routes/product.route.js";

// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // Use specific origin for security
app.use(helmet()); // Security hardening
app.use(cookieParser());
app.use(express.json());

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
                url: process.env.BASE_URL || `http://localhost:${port}`, // Dynamic base URL
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

// Connect to MongoDB and start the server
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

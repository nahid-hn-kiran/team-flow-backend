import express from "express";
import { indexRoutes } from "./app/routes/index.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { notFound } from "./app/middleware/notFound.js";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { envVars } from "./app/config/env.js";
const app = express();
// Enable URL-encoded form data parsing
app.use(cors({
    origin: [
        envVars.google.FRONTEND_URL,
        envVars.BETTER_AUTH_URL,
        "http://localhost:3000",
        "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
// Better Auth
app.use("/api/auth", toNodeHandler(auth));
// All routes
app.use("/api/v1", indexRoutes);
// Basic route
app.get("/", (req, res) => {
    res.send("Hello, TypeScript + Express!");
});
// Not Found Handler
app.use(notFound);
// Global Error Handler
app.use(globalErrorHandler);
export default app;

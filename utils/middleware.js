import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

// import all endpoint file path
import authRoutes from "../routes/auth.js";
import userRoutes from "../routes/user.js";

export const configureMiddleware = (app) => {
    app.use(cookieParser());
    // CORS configuration
    const corsOptions = {
        origin: process.env.DOMAINS,
        credentials: true, // Enable credentials (cookies, authorization headers, etc.)
    };
    app.use(cors(corsOptions));
    app.use(helmet());
    app.use(express.json());

    // App endpoints paths
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    // ADD REST OF THE APP PATHS HERE



    // error handler
    app.use((err, req, res, next) => {
        console.error(err.stack); // Log the error
        const status = err.status || 500;
        const message = err.message || "Something went wrong!";
        return res.status(status).json({
            success: false,
            status,
            message,
        });
    });


};
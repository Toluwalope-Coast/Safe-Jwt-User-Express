// server.js
import express from "express";
import dotenv from "dotenv";
import { envChecker } from "./utils/utility.js";
import { configureMiddleware } from "./utils/middleware.js";
import { databaseConnection } from "./utils/dbConn.js";

const app = express();
dotenv.config();

// Check if Environment Variable is Available
try {
  envChecker();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

// Middleware
configureMiddleware(app);

// Connecting to MongoDB
databaseConnection();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

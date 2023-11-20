import express from "express";
import { googleAuth, signIn, signOut, signUp } from "../controllers/auth.js";
import { isTokenBlacklisted } from "../middlewares/tokenBlacklisting.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Sign-in Route
router.post("/signin", signIn);

// Sign-Up Route
router.post("/signup", signUp);

// Google Authentication Route
router.post("/google", googleAuth);

// Sign-Out Route
router.delete("/signout", isTokenBlacklisted, verifyToken, signOut);

export default router;

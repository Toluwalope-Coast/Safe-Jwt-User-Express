import express from "express";
import { verifyToken } from "./../middlewares/verifyToken.js";
import {
  getSingleUser,
  searchSingleUser,
  searchUsersByPattern,
  getAllUsersAdmin,
  updateUserAdmin,
  deleteUserAdmin,
  updateUser,
  deleteUser,
  recoverPassword,
  resetPassword,
} from "../controllers/user.js";
import { getUserById } from "../middlewares/user.js";
import { isTokenBlacklisted } from "../middlewares/tokenBlacklisting.js";

const router = express.Router();

// Get a single user
router.get("/", isTokenBlacklisted, verifyToken, getUserById, getSingleUser);

// Search for users based on multiple properties By Admin only
router.get("/search", isTokenBlacklisted, verifyToken, getUserById, searchUsersByPattern);

// Search for a single user using email (Only Admins)
router.get("/admin/:email", isTokenBlacklisted, verifyToken, getUserById, searchSingleUser);

// Get all users By Admin only with pagination
router.get("/admin/all", isTokenBlacklisted, verifyToken, getUserById, getAllUsersAdmin);

// Update User By Admin only
router.put("/admin", isTokenBlacklisted, verifyToken, getUserById, updateUserAdmin);

// Delete a user By Admin only
router.delete("/admin/:email", isTokenBlacklisted, verifyToken, getUserById, deleteUserAdmin);

// Update User
router.put("/", isTokenBlacklisted, verifyToken, getUserById, updateUser);

// Delete a user
router.delete("/", isTokenBlacklisted, verifyToken, getUserById, deleteUser);

// Reset user password
router.post("/reset", resetPassword);

// Recover user password
router.get("/recover/:email", recoverPassword);

export default router;

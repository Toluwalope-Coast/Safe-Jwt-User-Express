import User from "../models/User.js";
import { createError } from "../error.js";

export const getUserById = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) return next(createError(404, "User not found!"));

        req.user = user; // Attach the user to req.user
        next();
    } catch (err) {
        next(err);
    }
};

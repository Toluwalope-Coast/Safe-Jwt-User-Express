import { createError } from "../error.js";
import Blacklist from "../models/Blacklist.js"

// Middleware to check if a token is blacklisted
export const isTokenBlacklisted = async (req, res, next) => {
    const token = req.cookies.access_token;

    try {
        const blacklistedToken = await Blacklist.findOne({ token });
        if (blacklistedToken) return next(createError(403, "Token is invalid!"));
        next();
    } catch (error) {
        // Handle other errors or log them for debugging
        console.error(err);
        next(err);
    }
};

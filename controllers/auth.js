import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";
import User from "../models/User.js";
import Blacklist from "../models/Blacklist.js";

// User Sign Up
export const signUp = async (req, res, next) => {
  try {

    const userPassword = req.body.password;
    if (!userPassword) return res.status(400).json({ error: 'Password is required' });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userPassword, salt);

    const user = new User({ ...req.body, password: hash });

    const newUser = await user.save();

    // Destructure the user object to exclude sensitive fields
    const { password, resetPasswordToken, resetPasswordTokenExpiry, lastSignedOut, ...userDetails } = newUser._doc;

    // Generate token for the user
    const token = jwt.sign({ id: userDetails._id }, process.env.JWT);

    // Set the token as an httpOnly cookie in the response, with the 'secure' flag
    res.cookie("access_token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }).status(200).json({ message: "User has been created", newUser: userDetails });
  } catch (err) {

    // MongoDB duplicate key error (e.g., duplicate email)
    if (err.code === 11000) return res.status(400).json({ error: 'Email already exists' });

    // Handle other errors or log them for debugging
    console.error(err);
    next(err);
  }
};

// Sign-in
export const signIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(createError(404, "User not found!"));

    // If a user does not have a password but is signing in with Google
    if (!user.password && user.fromGoogle) return next(createError(403, "Sign in with Google is required."));

    // If password is not provided but required for regular sign-in
    if (!req.body.password) return next(createError(400, "Password is required for sign-in."))

    // Comparing passwords in a constant time manner to mitigate timing attacks
    if (!(await bcrypt.compare(req.body.password, user.password))) return next(createError(400, "Wrong Credentials!"));

    const token = jwt.sign({ id: user._id }, process.env.JWT);

    // Destructure the user object to exclude sensitive fields
    const { password, resetPasswordToken, resetPasswordTokenExpiry, lastSignedOut, ...userDetails } = user._doc;

    res.cookie("access_token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
      .status(200)
      .json({ message: "User has been signed in", userDetails });
  } catch (err) {
    next(err);
  }
};

// Google Authentication
export const googleAuth = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      // User found, generate token and send response
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res.cookie("access_token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
        .status(200).json({ userDetails: user._doc });
    } else {
      // User not found, create a new user
      const newUser = new User({ ...req.body, fromGoogle: true });

      try {
        // Save the new user
        const savedUser = await newUser.save();
        // Generate token for the new user and send response
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
        res.cookie("access_token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
          .status(200).json({ userDetails: savedUser._doc });
      } catch (error) {
        // Handle specific errors during user creation
        console.error(error);
        res.status(400).json({ error: 'Error creating user' });
      }
    }
  } catch (err) {
    // Handle any unexpected errors
    next(err);
  }
};

// Sign out
export const signOut = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) return next(createError(404, "User not found for sign-out"));

    // Perform additional logic here for proper sign-out, like updating a "last signed out" timestamp in the user document, etc.

    // Update the lastSignedOut property with the current timestamp for the user
    await User.findByIdAndDelete(user._id, { lastSignedOut: new Date() });

    // Blacklist the token
    await Blacklist.create({ token: req.cookies.access_token }); // Assuming req.token holds the token information

    // Clear the existing token on the client side by removing the cookie
    res.clearCookie("access_token", { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
      .status(200).json({ message: "User is logged out successfully" });

    // Log the successful sign-out
    console.log(`User ${user.email} has been successfully signed out.`);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

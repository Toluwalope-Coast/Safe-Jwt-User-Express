import bcrypt from "bcrypt";
import { createError } from "../error.js";
import {
  generateResetPasswordToken,
} from "../utils/utility.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";


// get a single user
export const getSingleUser = async (req, res, next) => {

  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createError(400, "Validation error", errors.array()));

    // Get the user from the user middleware
    const user = req.user

    if (!user) return next(createError(404, "User not found!")); // Check if the user do not exist

    // To check if the user is eligible to carry out the action
    const { password, resetPasswordToken, resetPasswordTokenExpiry, lastSignedOut, ...others } = user._doc;
    res.status(200).json({ message: "successful", data: others });

  } catch (err) {
    next(err);
  }
};

// search for single user By Admin only
export const searchSingleUser = async (req, res, next) => {
  console.log("it is in the search single user")
  try {

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createError(400, "Validation error", errors.array()));

    // Get the user from the user middleware
    const adminUser = req.user

    // To check if the user is eligible to carry out the action
    if (adminUser.role != "admin") return next(createError(403, "You're  not eligible for this action"));

    // Get the requested user using the email from the parameters
    const email = req.params.email
    const requestedUser = await User.findOne({ email });

    // To check if the user is eligible to carry out the action
    if (!requestedUser) return next(createError(404, "User not found")); // Check if the user do not exist

    const { password, resetPasswordToken, resetPasswordTokenExpiry, lastSignedOut, ...userDetails } = requestedUser._doc;
    res.status(200).json({ message: "successful", data: userDetails });

  } catch (err) {
    next(err);
  }
};

// search for users based on multiple properties By (Admin only) with pagination
export const searchUsersByPattern = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createError(400, "Validation error", errors.array()));

    // Get the user from the user middleware
    const adminUser = req.user;

    // To check if the user is eligible to carry out the action
    if (adminUser.role !== "admin") return next(createError(403, "You're not eligible for this action"));
    // Get the search criteria and pagination parameters from the request query
    const { page = 1, pageSize = 10, ...searchCriteria } = req.query;

    // Ensure that search criteria are provided
    if (Object.keys(searchCriteria).length === 0) return next(createError(400, "Search criteria are required for user search."));

    // Build a filter object based on the provided search criteria
    const filter = {};
    for (const key in searchCriteria) {
      if (Object.prototype.hasOwnProperty.call(searchCriteria, key)) {
        filter[key] = { $regex: new RegExp(searchCriteria[key], 'i') };
      }
    }

    // Calculate the skip value to skip the correct number of users based on the page
    const skip = (page - 1) * pageSize;

    // Use the filter to perform the search with pagination
    const users = await User.find(filter)
      .skip(skip)
      .limit(Number(pageSize));

    // Exclude sensitive information from the response
    const sanitizedUsers = users.map(({ password, resetPasswordToken, resetPasswordTokenExpiry, lastSignedOut, ...rest }) => rest._doc);

    // Get the total number of users
    const totalUsers = await User.countDocuments(filter);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalUsers / pageSize);

    // Include pagination information in response headers
    res.setHeader('X-Total-Users', totalUsers);
    res.setHeader('X-Total-Pages', totalPages);

    res.status(200).json({ message: "Successful", data: sanitizedUsers });
  } catch (err) {
    next(err);
  }
};


// get all users By Admin only with pagination
export const getAllUsersAdmin = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createError(400, "Validation error", errors.array()));

    // Get the user from the user middleware
    const user = req.user;

    if (user.role === "admin") {
      // Pagination parameters
      const page = parseInt(req.query.page) || 1; // default to page 1
      const pageSize = parseInt(req.query.pageSize) || 10; // default to 10 users per page

      // Calculate the skip value to skip the correct number of users based on the page
      const skip = (page - 1) * pageSize;

      // Query users with pagination and exclude sensitive properties
      const users = await User.find()
        .sort({ views: -1 })
        .skip(skip)
        .limit(pageSize)
        .exec();

      const sanitizedUsers = users.map(({ password, resetPasswordToken, resetPasswordTokenExpiry, lastSignedOut, ...rest }) => rest._doc);

      // Get the total number of users
      const totalUsers = await User.countDocuments();

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalUsers / pageSize);

      // Include pagination information in response headers
      res.setHeader('X-Total-Users', totalUsers);
      res.setHeader('X-Total-Pages', totalPages);

      res.status(200).json({ message: "Successful", data: sanitizedUsers });
    } else {
      return next(createError(403, "You're not eligible for this action"));
    }
  } catch (err) {
    next(err);
  }
};

// update a user By Admin only
export const updateUserAdmin = async (req, res, next) => {
  try {

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createError(400, "Validation error", errors.array()));

    // Get the user from the user middleware
    const adminUser = req.user

    // Get the requested user using the email from the body
    const email = req.body.email
    const user = await User.findOne({ email });

    if (!user) return next(createError(404, "User not found!")); // Check if the user do not exist

    // To check if the user is eligible to carry out the action
    if (adminUser.role === "admin") {
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $set: req.body },
        { new: true }
      );
      if (!updatedUser) return next(createError(500, "Failed to update user"));

      const { password, resetPasswordTokenExpiry, resetPasswordToken, ...others } = updatedUser._doc;
      res.status(200).json({ message: "successful", data: others });
    } else {
      return next(createError(403, "You're not eligible for this action"));
    }
  } catch (err) {
    next(err);
  }
};

// update a user
export const updateUser = async (req, res, next) => {
  try {

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createError(400, "Validation error", errors.array()));

    // Get the user from the user middleware
    const user = req.user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) return next(createError(500, "Failed to update user"));// Check if the user do not exist

    // Exclude resetPasswordToken and resetPasswordTokenExpiry properties using destructuring
    const { password, resetPasswordToken, resetPasswordTokenExpiry, lastSignedOut, ...updatedUserWithoutSensitiveInfo } = updatedUser._doc;

    res.status(200).json({ message: "successful", data: updatedUserWithoutSensitiveInfo });
  } catch (err) {
    next(err);
  }
}

// delete a user By Admin only
export const deleteUserAdmin = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createError(400, "Validation error", errors.array()));

    // Get the user from the user middleware
    const adminUser = req.user

    // Get the requested user using the email from the body
    const email = req.params.email
    const user = await User.findOne({ email });

    if (!user) return next(createError(404, "User not found!")); // Check if the user do not exist

    // To check if the user is eligible to carry out the action
    if (adminUser.role === "admin") {
      const deletedUser = await User.findByIdAndDelete(user._id);
      if (!deletedUser) return next(createError(500, "Failed to delete user"));

      // Exclude resetPasswordToken and resetPasswordTokenExpiry properties using destructuring
      const { resetPasswordToken, resetPasswordTokenExpiry, lastSignedOut, ...deletedUserWithoutSensitiveInfo } = deletedUser._doc;
      res.status(200).json({ message: "successful", data: deletedUserWithoutSensitiveInfo });
    } else {
      return next(createError(403, "You're not eligible for this action"));
    }

  } catch (err) {
    next(err);
  }
};

// delete a user
export const deleteUser = async (req, res, next) => {

  // Get the user from the user middleware
  const user = req.user

  try {

    // Check if the user has the right to perform this action

    const deletedUser = await User.findByIdAndDelete(user._id);


    if (!deletedUser) return next(createError(500, "Failed to delete user"));

    // Exclude resetPasswordToken and resetPasswordTokenExpiry properties using destructuring
    const { password, resetPasswordToken, resetPasswordTokenExpiry, lastSignedOut, ...deletedUserWithoutSensitiveInfo } = deletedUser._doc;

    res.status(200).json({ message: "Successful", data: deletedUserWithoutSensitiveInfo });

  } catch (err) {
    next(err);
  }
};

// Recover user password
export const recoverPassword = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createError(400, "Validation error", errors.array()));

    const email = req.params.email;

    const resetToken = await generateResetPasswordToken(email); // Generate a reset token using the user email

    // Handle the case where the email is not associated with any user
    if (!resetToken) return next(createError(404, "Email is not registered for password recovery."));

    // temporarily Output the the token as well as the email as the response otherwise would use node mailer  
    res.status(200).json({ message: "successful", data: `email=${email}&token=${resetToken}` });
  } catch (err) {
    next(err);
  }
};

// Reset user password
export const resetPassword = async (req, res, next) => {
  const { email, token, newPassword } = req.body;

  try {
    const user = await User.findOne({ email }); // Get a user with this email

    // Authenticate the email and token
    if (!user || user.resetPasswordTokenExpiry == null || user.resetPasswordToken !== token) return next(createError(404, "User not found or invalid reset token"));

    const currentExpiryTime = Date.now();

    // Check if Token has expired
    if (user.resetPasswordTokenExpiry < currentExpiryTime) return next(createError(401, "Expired Token"))

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    // Update the user password in the model
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          resetPasswordToken: null,
          resetPasswordTokenExpiry: null,
          password: hash,
        },
      },
      { new: true }
    );

    if (!updatedUser) return next(createError(500, "Failed to update user password"));

    const { password, resetPasswordTokenExpiry, resetPasswordToken, lastSignedOut, ...updatedUserWithoutSensitiveInfo } = updatedUser._doc;
    res.status(200).json({ message: "successful", data: updatedUserWithoutSensitiveInfo });
  } catch (err) {
    next(err);
  }
};

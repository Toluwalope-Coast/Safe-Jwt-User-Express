import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    gender: {
      type: String,
      required: true,
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: "user",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiry: {
      type: String,
    },
    lastSignedOut: { type: Date }, // Timestamp for last sign-out
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
import CryptoJS from "crypto-js";
import { createError } from "../error.js";
import User from "../models/User.js";

// To Check if the environment variables are provided

export const envChecker = () => {
    if (!process.env.DB_CONNECTION || !process.env.PORT || !process.env.JWT || !process.env.NODE_ENV
        || !process.env.DOMAINS || !process.env.NODEMAILER_SERVICES
        || !process.env.NODEMAILER_HOST || !process.env.NODEMAILER_PORT || !process.env.NODEMAILER_USER
        || !process.env.NODEMAILER_PASS || !process.env.NODEMAILER_SUBJECT || !process.env.RESET_PASSWORD_TOKEN_EXPIRY
    ) {
        throw createError(400, "Missing environment variables. Please check your configuration.");
    }
};

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
// Generate a password reset token and save it in the user's document

const resetPasswordTokenExpiry = process.env.RESET_PASSWORD_TOKEN_EXPIRY

export const generateResetPasswordToken = async (email) => {
    const user = await User.findOne({ email });

    if (!user) throw CreateError(404, "User not found for password reset.");

    const randomBytes = CryptoJS.lib.WordArray.random(32); // 256 bits
    const token = CryptoJS.SHA256(randomBytes).toString(CryptoJS.enc.Hex);
    const tokenExpiry = Date.now() + resetPasswordTokenExpiry;

    user.resetPasswordToken = token;
    user.resetPasswordTokenExpiry = tokenExpiry;

    await user.save();

    return token;
};



/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
// Send a password reset link to the user's email
// export const sendPasswordResetEmail = (email, resetToken, res) => {

//     // Nodemailer Transporter Configuration
//     const transporter = nodemailer.createTransport({
//         service: process.env.NODEMAILER_SERVICE,
//         host: process.env.NODEMAILER_HOST,
//         port: process.env.NODEMAILER_PORT,
//         secure: false,
//         auth: {
//             user: process.env.NODEMAILER_USER,
//             pass: process.env.NODEMAILER_PASS,
//         },
//     });

//     //   Checking the connection to the service
//     transporter.verify((error, success) => {
//         if (error) {
//             console.log(`Error verifying transporter: ${error}`);
//         } else {
//             console.log("Server is ready to take our message");
//         }
//     });

//     // The mail content and Address Details
//     const mailOptions = {
//         from: process.env.NODEMAILER_USER,
//         to: email,
//         subject: process.env.NODEMAILER_SUBJECT,
//         text:
//             "You are receiving this email because you (or someone else) has requested a password reset for your account.\n\n" +
//             "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
//             `https://my-frontend-domain/reset-password?email=${email}&token=${resetToken}\n\n` +
//             "If you did not request this, please ignore this email, and your password will remain unchanged.\n",
//     };

//     // Transporter sending email
//     transporter.sendMail(mailOptions, (error) => {
//         if (error) {
//             console.error(`Error sending password reset email: ${error}`);
//             res.status(500).json({ message: "Error sending a password reset email" });
//         } else {
//             // Success case
//             res.status(200).json({ message: "Password reset email sent successfully" });
//         }
//     });

// };

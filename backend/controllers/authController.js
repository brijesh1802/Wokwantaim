const Candidate = require("../models/candidate.model");
const Employer = require("../models/employer.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/emailService");

const findUserByEmail = async (email) => {
    let user = await Candidate.findOne({ email });
    if (!user) {
        user = await Employer.findOne({ email });
    }
    return user;
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required!" });

        const user = await findUserByEmail(email);
        if (!user) return res.status(400).json({ message: "User not found!" });

        // Generate token
        const resetToken = crypto.randomBytes(20).toString("hex");

        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        // Send reset email
        const resetURL = `${process.env.VERCEL_URL}/reset-password/${resetToken}`;
        const subject = "🔐 Password Reset Request"

        const body = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px; text-align: center;">
          <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; 
                      box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: left;">
            <h2 style="color: #333; text-align: center;">Reset Your Password 🔄</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password. Click the button below to set up a new one:
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetURL}" 
                style="display: inline-block; padding: 14px 24px; background: #007bff; color: #ffffff; 
                font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 6px;">
                🔄 Reset My Password
              </a>
            </div>
            <p style="color: #777; font-size: 14px; text-align: center;">
              If you didn’t request this, you can safely ignore this email. Your account remains secure.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #777; font-size: 14px; text-align: center;">
              Need help? <a href="mailto:support@yourcompany.com" style="color: #007bff; text-decoration: none;">Contact Support</a>
            </p>
            <p style="color: #777; font-size: 14px; text-align: center;">
              Best Regards, <br> 
              <strong>The Support Team 🛠️</strong>
            </p>
          </div>
        </div>
        `

        await sendEmail(email, subject, body);


        res.json({ message: "Password reset link sent to email!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        let user = await Candidate.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            user = await Employer.findOne({
                resetToken: token,
                resetTokenExpiry: { $gt: Date.now() },
            });
        }

        if (!user) return res.status(400).json({ message: "Invalid or expired token!" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password has been reset successfully!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { requestPasswordReset, resetPassword };
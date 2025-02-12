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
        const body =  `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color:#333; text-align: center;">Forgot Your Password? 🤔</h2>
                <p style="font-size:16px;color:#555;">
                  No worries! We received a request to reset your password. Click the button below to proceed:
                </p>
                <div style="text-align: center; margin: 20px 0;">
                  <a href="${resetURL}" 
                     style="display:inline-block; padding:12px 20px; font-size:16px;
                     color:#fff; background-color:#007bff; border-radius:5px; text-decoration:none;">
                     🔄 Reset My Password
                  </a>
                </div>
                <p style="font-size:14px;color:#777;">
                  If you did not request this, please ignore this email. Your account is safe.  
                </p>
                <p style="font-size:14px;color:#777;">
                  Need help? Contact our support team.  
                </p>
                <p style="font-size:14px;color:#777;">
                  Best Regards, <br> 
                  <strong>The Support Team 🛠️</strong>
                </p>
              </div>`

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
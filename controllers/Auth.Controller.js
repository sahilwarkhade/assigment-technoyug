const User = require("../models/User.model");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { emailHtml } = require("../templates/verifyEmailTemplate");
const { generateTokens } = require("../utils/generateTokens");

// @desc    Register a new user
// @access  Public
const signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const user = new User({
      fullName,
      email,
      password,
    });

    const verificationToken = user.generateVerificationToken();

    await user.save();

    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/verify-email?token=${verificationToken}`;

    await sendEmail({
      email: user?.email,
      subject: "Account Verification",
      html: emailHtml(user?.fullName, verificationUrl),
    });

    res.status(201).json({
      message:
        "Registration successful! Please check your email to complete verification.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @access  Public
const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify user email
// @access  Public
const verifyEmail = async (req, res, next) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ message: "Verification token is required" });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token." });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a new access token using a refresh token
// @access  Public
const refreshToken = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const { accessToken } = generateTokens(user._id);
    res.json({ accessToken });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

// @desc    Logout user
// @access  Private (needs refresh token)
const logoutUser = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Refresh token is required " });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (user) {
      user.refreshTokens = [];
      await user.save();
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(200).json({ message: "Logged out successfully" });
  }
};

module.exports = {
  signupUser,
  loginUser,
  verifyEmail,
  refreshToken,
  logoutUser,
};

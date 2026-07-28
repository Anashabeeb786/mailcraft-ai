/**
 * routes/auth.js — Authentication Routes
 *
 * POST /api/auth/signup  → Create a new account
 * POST /api/auth/login   → Login to an existing account
 */

const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const { validateSignup, validateLogin } = require("../middleware/validate");

// Apply specific rate limiting to auth endpoints to slow down brute-force attacks
const rateLimit = require("express-rate-limit");
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // Max 20 auth attempts per IP per window
  message: { error: "Too many login attempts. Please try again in 15 minutes." },
});

router.post("/signup", authLimiter, validateSignup, signup);
router.post("/login", authLimiter, validateLogin, login);

module.exports = router;

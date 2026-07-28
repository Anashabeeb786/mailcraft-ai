/**
 * routes/email.js — Email Generation Route
 *
 * POST /api/email/generate  → Generate an AI email (protected)
 */

const express = require("express");
const router = express.Router();
const { generate } = require("../controllers/emailController");
const { authenticateToken } = require("../middleware/auth");
const { validateEmailGenerate } = require("../middleware/validate");

// Apply a stricter rate limit to AI generation endpoint (expensive API call)
const rateLimit = require("express-rate-limit");
const generateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10,             // Max 10 AI generations per minute per IP
  message: { error: "Generation rate limit reached. Please wait a moment." },
});

// Route: authenticateToken → validateEmailGenerate → generate
// Each step runs only if the previous one passed (calls next())
router.post("/generate", generateLimiter, authenticateToken, validateEmailGenerate, generate);

module.exports = router;

/**
 * routes/history.js — Email History Routes
 *
 * GET    /api/history       → Get user's email history (protected)
 * DELETE /api/history/:id   → Delete a specific email (protected)
 */

const express = require("express");
const router = express.Router();
const { getHistory, deleteEmail } = require("../controllers/historyController");
const { authenticateToken } = require("../middleware/auth");

// All history routes require a valid JWT
router.get("/", authenticateToken, getHistory);
router.delete("/:id", authenticateToken, deleteEmail);

module.exports = router;

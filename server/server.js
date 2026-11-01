/**
 * server.js — MailCraft AI Express Application Entry Point
 *
 * Bootstraps the Express server with:
 *  - Security middleware (helmet, CORS, rate limiting)
 *  - JSON body parsing
 *  - Route mounting
 *  - SQLite database initialization
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { initDB } = require("./models/db");

// --- Route Imports ---
const authRoutes = require("./routes/auth");
const emailRoutes = require("./routes/email");
const historyRoutes = require("./routes/history");

const app = express();

app.set("trust proxy", 1);

const PORT = process.env.PORT || 3001;
// ─────────────────────────────────────────────
//  Security Middleware
// ─────────────────────────────────────────────

// Sets secure HTTP headers (XSS protection, no sniff, etc.)
app.use(helmet());

// Allow requests from the Vite dev server (and production origin)
const allowedOrigins = [
  "http://localhost:5173",
  "https://mailcraft-ai-omega.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Global rate limiter: max 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});
app.use(globalLimiter);

// Parse incoming JSON bodies
app.use(express.json());

// ─────────────────────────────────────────────
//  Routes
// ─────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/history", historyRoutes);

// Health check endpoint — useful for deployment checks
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Global error handler — catches any unhandled errors from controllers
app.use((err, req, res, next) => {
  console.error("[Server Error]", err.message);
  res.status(err.status || 500).json({
    error: err.message || "An unexpected server error occurred.",
  });
});

// ─────────────────────────────────────────────
//  Start
// ─────────────────────────────────────────────

// Initialize the SQLite database (creates tables if they don't exist)
// then start listening for requests
initDB();
app.listen(PORT, () => {
  console.log(`\n🚀 MailCraft AI server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}\n`);
});

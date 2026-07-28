/**
 * controllers/authController.js — Authentication Business Logic
 *
 * Handles user registration and login.
 * Passwords are hashed with bcrypt before storage (never stored in plaintext).
 * On successful auth, a signed JWT is returned to the client.
 *
 * JWT Payload: { id, email, name }
 * JWT Expiry:  7 days (sufficient for a demo; adjust for production)
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../models/db");

// Number of bcrypt salt rounds — 10 is the industry-standard balance of
// security vs. performance (each +1 roughly doubles hashing time)
const SALT_ROUNDS = 10;

/**
 * signup
 * POST /api/auth/signup
 * Body: { name, email, password }
 *
 * Creates a new user. Returns a JWT on success.
 */
async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const db = getDB();

    // Check if a user with this email already exists
    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email.toLowerCase().trim());

    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    // Hash the password — bcrypt auto-generates and embeds the salt
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert the new user into the database
    const result = db
      .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
      .run(name.trim(), email.toLowerCase().trim(), passwordHash);

    // Sign a JWT with the user's ID, email, and name as the payload
    const token = jwt.sign(
      { id: result.lastInsertRowid, email: email.toLowerCase().trim(), name: name.trim() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: { id: result.lastInsertRowid, name: name.trim(), email: email.toLowerCase().trim() },
    });
  } catch (err) {
    next(err); // Pass to the global error handler in server.js
  }
}

/**
 * login
 * POST /api/auth/login
 * Body: { email, password }
 *
 * Verifies credentials. Returns a JWT on success.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const db = getDB();

    // Fetch user by email (case-insensitive)
    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email.toLowerCase().trim());

    // Use a generic error message to prevent email enumeration attacks
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare the provided password against the stored bcrypt hash
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Issue a fresh JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Logged in successfully.",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login };

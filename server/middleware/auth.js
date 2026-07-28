/**
 * middleware/auth.js — JWT Authentication Middleware
 *
 * Extracts and verifies the JWT from the Authorization header.
 * On success: attaches `req.user = { id, email, name }` and calls next().
 * On failure: returns 401 Unauthorized.
 *
 * Usage: apply to any route that requires a logged-in user.
 *   router.get('/protected', authenticateToken, handler)
 */

const jwt = require("jsonwebtoken");

/**
 * authenticateToken
 * Middleware function that validates the Bearer JWT token.
 */
function authenticateToken(req, res, next) {
  // The Authorization header should be: "Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token using the server's secret key
    // jwt.verify throws an error if the token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user payload to the request object
    // Controllers can then access req.user.id to scope queries
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }
    return res.status(403).json({ error: "Invalid token." });
  }
}

module.exports = { authenticateToken };

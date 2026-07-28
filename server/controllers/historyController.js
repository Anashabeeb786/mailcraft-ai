/**
 * controllers/historyController.js — Email History Business Logic
 *
 * Provides CRUD operations for a user's email history.
 * All queries are scoped to req.user.id to prevent cross-user data access.
 */

const { getDB } = require("../models/db");

/**
 * getHistory
 * GET /api/history  (Protected)
 *
 * Returns the authenticated user's email history, newest first.
 * Paginates via ?page and ?limit query parameters.
 */
function getHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const db = getDB();

    // Optional pagination: ?page=1&limit=10 (defaults to first 20)
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    // Fetch the user's emails, newest first
    const emails = db
      .prepare(
        `SELECT id, purpose, recipient_name, recipient_context, tone, subject, body, created_at
         FROM emails
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`
      )
      .all(userId, limit, offset);

    // Get total count for pagination metadata
    const { total } = db
      .prepare("SELECT COUNT(*) as total FROM emails WHERE user_id = ?")
      .get(userId);

    res.json({
      emails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * deleteEmail
 * DELETE /api/history/:id  (Protected)
 *
 * Deletes a specific email. Verifies ownership before deletion
 * to prevent one user from deleting another's emails.
 */
function deleteEmail(req, res, next) {
  try {
    const userId = req.user.id;
    const emailId = parseInt(req.params.id);
    const db = getDB();

    if (isNaN(emailId)) {
      return res.status(400).json({ error: "Invalid email ID." });
    }

    // Confirm the email belongs to this user before deleting
    const email = db
      .prepare("SELECT id FROM emails WHERE id = ? AND user_id = ?")
      .get(emailId, userId);

    if (!email) {
      return res.status(404).json({ error: "Email not found or you don't have permission to delete it." });
    }

    db.prepare("DELETE FROM emails WHERE id = ?").run(emailId);

    res.json({ message: "Email deleted successfully.", id: emailId });
  } catch (err) {
    next(err);
  }
}

module.exports = { getHistory, deleteEmail };

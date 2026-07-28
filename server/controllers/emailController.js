/**
 * controllers/emailController.js — Email Generation Business Logic
 *
 * Handles the email generation request:
 *  1. Extracts validated inputs from req.body (already validated by middleware)
 *  2. Calls the NVIDIA NIM service to generate the email
 *  3. Saves the result to the database for history
 *  4. Returns the generated email to the client
 */

const { generateEmail } = require("../services/nvidiaService");
const { getDB } = require("../models/db");

/**
 * generate
 * POST /api/email/generate  (Protected — requires valid JWT)
 * Body: { purpose, recipientName, recipientContext, tone, extraContext? }
 *
 * Returns: { id, subject, body, createdAt }
 */
async function generate(req, res, next) {
  try {
    const { purpose, recipientName, recipientContext, tone, extraContext = "" } = req.body;
    const userId = req.user.id; // Injected by authenticateToken middleware

    // Call the AI service — this is where the NVIDIA API call happens
    const { subject, body } = await generateEmail({
      purpose: purpose.trim(),
      recipientName: recipientName.trim(),
      recipientContext: recipientContext.trim(),
      tone,
      extraContext: extraContext.trim(),
    });

    // Persist the generated email to the database for history access
    const db = getDB();
    const result = db
      .prepare(
        `INSERT INTO emails 
          (user_id, purpose, recipient_name, recipient_context, tone, extra_context, subject, body)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        userId,
        purpose.trim(),
        recipientName.trim(),
        recipientContext.trim(),
        tone,
        extraContext.trim(),
        subject,
        body
      );

    res.status(201).json({
      id: result.lastInsertRowid,
      subject,
      body,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    // If the error came from the AI service, surface it directly
    // Otherwise pass to the global error handler
    if (
      err.message.includes("AI returned") ||
      err.message.includes("empty response") ||
      err.message.includes("unexpected format")
    ) {
      return res.status(502).json({ error: err.message });
    }

    // Handle NVIDIA API-specific errors (auth, quota, etc.)
    if (err.status === 401) {
      return res.status(502).json({ error: "Invalid NVIDIA API key. Check your .env file." });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: "AI rate limit reached. Please wait a moment and try again." });
    }

    next(err);
  }
}

module.exports = { generate };

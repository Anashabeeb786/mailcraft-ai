/**
 * middleware/validate.js — Input Validation Middleware
 *
 * Provides validation helper factories for route-specific validation.
 * Each validator reads req.body, checks fields, and either:
 *  - calls next() if valid
 *  - returns 422 Unprocessable Entity with a descriptive error message
 *
 * Keeping validation in middleware keeps controllers clean and focused
 * on business logic only.
 */

/**
 * validateSignup
 * Checks: name (non-empty), email (valid format), password (min 6 chars)
 */
function validateSignup(req, res, next) {
  const { name, email, password } = req.body;
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }
  if (name && name.trim().length > 100) {
    errors.name = "Name must be under 100 characters.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (password && password.length > 128) {
    errors.password = "Password must be under 128 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ error: "Validation failed.", fields: errors });
  }

  next();
}

/**
 * validateLogin
 * Checks: email (present), password (present)
 */
function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = {};

  if (!email) errors.email = "Email is required.";
  if (!password) errors.password = "Password is required.";

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ error: "Validation failed.", fields: errors });
  }

  next();
}

/**
 * validateEmailGenerate
 * Checks all fields needed to generate an email via the AI.
 */
function validateEmailGenerate(req, res, next) {
  const { purpose, recipientName, recipientContext, tone } = req.body;
  const errors = {};

  const VALID_TONES = ["Formal", "Friendly", "Persuasive", "Apologetic", "Urgent", "Casual"];

  if (!purpose || purpose.trim().length < 2) {
    errors.purpose = "Purpose is required (min 2 characters).";
  }
  if (purpose && purpose.trim().length > 200) {
    errors.purpose = "Purpose must be under 200 characters.";
  }

  if (!recipientName || recipientName.trim().length < 1) {
    errors.recipientName = "Recipient name is required.";
  }
  if (recipientName && recipientName.trim().length > 100) {
    errors.recipientName = "Recipient name must be under 100 characters.";
  }

  if (!recipientContext || recipientContext.trim().length < 1) {
    errors.recipientContext = "Recipient context/relationship is required.";
  }
  if (recipientContext && recipientContext.trim().length > 200) {
    errors.recipientContext = "Recipient context must be under 200 characters.";
  }

  if (!tone || !VALID_TONES.includes(tone)) {
    errors.tone = `Tone must be one of: ${VALID_TONES.join(", ")}.`;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ error: "Validation failed.", fields: errors });
  }

  next();
}

module.exports = { validateSignup, validateLogin, validateEmailGenerate };

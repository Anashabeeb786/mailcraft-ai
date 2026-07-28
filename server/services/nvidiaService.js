/**
 * services/nvidiaService.js — NVIDIA NIM AI Integration
 *
 * ── Prompt Engineering Strategy ──────────────────────────────────────────────
 *
 * System Role:
 *   The model is instructed to act as an expert email writer and return
 *   ONLY a JSON object. This suppresses conversational prose.
 *
 * User Message:
 *   Structured key-value pairs for purpose, recipient, tone, context.
 *   Explicit field names improve LLM attention vs. free-form descriptions.
 *
 * Reliability:
 *   LLMs occasionally wrap output in prose, code fences, or add preamble.
 *   We use a 5-strategy extraction pipeline to handle every known edge case,
 *   plus an automatic retry on the first parse failure with a stricter prompt.
 *
 * Temperature: 0.6 — lower than before for more reliable JSON formatting.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

const MODEL = "meta/llama-3.1-8b-instruct";

// ─────────────────────────────────────────────────────────────────────────────
//  extractJSON — Multi-strategy JSON extraction
//
//  Handles every known edge case from LLaMA 3.1 8B outputs:
//   1. Pure JSON                  → { "subject": "...", "body": "..." }
//   2. Markdown fences            → ```json\n{...}\n```
//   3. Prose before JSON          → "Here is your email:\n{...}"
//   4. Escaped body newlines      → body contains literal \n strings
//   5. Single-quoted JSON         → {'subject': '...', 'body': '...'}
// ─────────────────────────────────────────────────────────────────────────────
function extractJSON(raw) {
  let text = raw.trim();

  // ── Strategy 1: Strip markdown code fences (```json...``` or ```...```) ──
  // Handles the most common deviation where the model wraps in fences.
  text = text
    .replace(/^```(?:json)?\s*/im, "")
    .replace(/```\s*$/im, "")
    .trim();

  // ── Strategy 2: Direct JSON.parse after fence removal ────────────────────
  try {
    const parsed = JSON.parse(text);
    if (parsed && parsed.subject && parsed.body) return parsed;
  } catch (_) { /* fall through */ }

  // ── Strategy 3: Find the first { ... } block in the text ─────────────────
  // Handles "Here is your email:\n{...}" style outputs.
  // Uses a greedy match from the first '{' to the last '}' in the string.
  const firstBrace = text.indexOf("{");
  const lastBrace  = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const jsonSlice = text.slice(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(jsonSlice);
      if (parsed && parsed.subject && parsed.body) return parsed;
    } catch (_) { /* fall through */ }
  }

  // ── Strategy 4: Regex extraction of subject + body values ────────────────
  // Handles cases where the JSON is malformed but the values are still there.
  // Matches: "subject": "...", (with or without trailing comma)
  const subjectMatch = raw.match(/"subject"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  const bodyMatch    = raw.match(/"body"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
  if (subjectMatch && bodyMatch) {
    return {
      subject: subjectMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"'),
      body:    bodyMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"'),
    };
  }

  // ── Strategy 5: Fix single-quoted JSON (invalid but LLMs sometimes do it) ─
  try {
    const singleToDouble = text.replace(/'/g, '"');
    const parsed = JSON.parse(singleToDouble);
    if (parsed && parsed.subject && parsed.body) return parsed;
  } catch (_) { /* fall through */ }

  // All strategies exhausted
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
//  buildMessages — Construct the prompt messages for the API call
//
//  On retries we use a stricter, minimal system prompt to force JSON output.
// ─────────────────────────────────────────────────────────────────────────────
function buildMessages({ purpose, recipientName, recipientContext, tone, extraContext }, isRetry = false) {
  if (isRetry) {
    // Stripped-down, ultra-direct prompt for retry attempts.
    // Reduces the chance the model adds explanatory text around the JSON.
    return [
      {
        role: "system",
        content: `Output ONLY this exact JSON structure with no other text whatsoever:\n{"subject":"<email subject here>","body":"<full email body here>"}`,
      },
      {
        role: "user",
        content: `Write a ${tone.toLowerCase()} professional email.\nPurpose: ${purpose}\nTo: ${recipientName} (${recipientContext})\n${extraContext ? `Notes: ${extraContext}` : ""}`,
      },
    ];
  }

  // Standard prompt for first attempt
  const systemPrompt = `You are an expert professional email writer.

Your task: generate a complete, ready-to-send professional email based on the specifications below.

STRICT OUTPUT RULES — follow exactly:
1. Output ONLY a valid JSON object. Zero markdown, zero explanation, zero preamble.
2. The JSON must have exactly two keys: "subject" (string) and "body" (string).
3. "subject": concise and descriptive, max 10 words.
4. "body": complete email with greeting, paragraphs, closing, and signature line "Best regards,\\n[Your Name]".
5. Do NOT use placeholder brackets in the body except for the signature.
6. Match the ${tone} tone precisely — it determines vocabulary, formality, and sentence structure.
7. Escape newlines inside the JSON body as \\n.

Your entire response must be this format and nothing else:
{"subject": "...", "body": "..."}`;

  const userMessage = `Email Purpose: ${purpose}
Recipient Name: ${recipientName}
Recipient Role/Relationship: ${recipientContext}
Tone: ${tone}${extraContext ? `\nAdditional Notes: ${extraContext}` : ""}

Respond with ONLY the JSON object.`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user",   content: userMessage },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
//  callModel — Single API call with error handling
// ─────────────────────────────────────────────────────────────────────────────
async function callModel(messages, temperature = 0.6) {
  const response = await client.chat.completions.create({
    model: MODEL,
    messages,
    temperature,
    max_tokens: 1024,
    top_p: 0.9,
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
}

// ─────────────────────────────────────────────────────────────────────────────
//  generateEmail — Main exported function
//
//  Flow:
//   1. Call model with standard prompt
//   2. Try to extract JSON using 5-strategy extractor
//   3. If extraction fails → retry ONCE with a stricter prompt
//   4. If retry also fails → throw user-friendly error
// ─────────────────────────────────────────────────────────────────────────────
async function generateEmail({ purpose, recipientName, recipientContext, tone, extraContext }) {
  const params = { purpose, recipientName, recipientContext, tone, extraContext };

  // ── Attempt 1: Standard prompt ────────────────────────────────────────────
  const rawFirst = await callModel(buildMessages(params, false), 0.6);

  if (!rawFirst) {
    throw new Error("The AI returned an empty response. Please try again.");
  }

  const parsedFirst = extractJSON(rawFirst);
  if (parsedFirst) {
    console.log("[nvidiaService] ✅ Parsed on first attempt");
    return { subject: parsedFirst.subject.trim(), body: parsedFirst.body.trim() };
  }

  // Log what came back so we can debug future edge cases
  console.warn("[nvidiaService] ⚠️ First attempt parse failed. Raw output:", rawFirst.slice(0, 300));

  // ── Attempt 2: Retry with stricter minimal prompt ─────────────────────────
  console.log("[nvidiaService] 🔄 Retrying with strict prompt...");
  const rawRetry = await callModel(buildMessages(params, true), 0.3);

  if (!rawRetry) {
    throw new Error("The AI returned an empty response. Please try again.");
  }

  const parsedRetry = extractJSON(rawRetry);
  if (parsedRetry) {
    console.log("[nvidiaService] ✅ Parsed on retry attempt");
    return { subject: parsedRetry.subject.trim(), body: parsedRetry.body.trim() };
  }

  console.error("[nvidiaService] ❌ Both attempts failed. Retry raw:", rawRetry.slice(0, 300));
  throw new Error(
    "The AI had trouble formatting the response. Please try again — this is usually resolved on the next attempt."
  );
}

module.exports = { generateEmail };

/**
 * حمودة (Hamoda) — AI helper for the Hamoda Charity platform.
 *
 * Responsibilities:
 *   1. Classify an incoming HelpRequest into the correct `helpType`
 *      (medical / education / food / housing / financial / other).
 *   2. Estimate urgency (low / medium / high / critical).
 *   3. Generate a short Arabic summary for the admin dashboard.
 *
 * Design notes:
 *   - Uses the official `openai` npm package.
 *   - Falls back to a heuristic classifier when OPENAI_API_KEY is missing
 *     so the rest of the app keeps working without an API key.
 *   - All calls are wrapped in try/catch and never throw — callers can
 *     fire-and-forget without crashing the request pipeline.
 */

const logger = require("./logger");

const HELP_TYPES = ["medical", "education", "food", "housing", "financial", "other"];
const URGENCY_LEVELS = ["low", "medium", "high", "critical"];

const MODEL = process.env.HAMODA_MODEL || "gpt-4o-mini";
const HAMODA_NAME = "حمودة";

// Lazily create the OpenAI client so the module loads even if the
// `openai` package isn't installed yet.
let _client = null;
function getClient() {
  if (_client) return _client;
  if (!process.env.OPENAI_API_KEY) return null;
  try {
    // eslint-disable-next-line global-require
    const OpenAI = require("openai");
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return _client;
  } catch (err) {
    logger.warn(
      `${HAMODA_NAME}: openai package not installed — run \`npm i openai\` in /backend`,
      { error: err.message }
    );
    return null;
  }
}

/**
 * Very small keyword-based fallback so the app still tags requests when
 * the OpenAI key is missing. Intentionally simple — it just suggests the
 * declared type with low confidence.
 */
function heuristicAnalyze(request) {
  const text = `${request.description || ""}`.toLowerCase();

  const buckets = {
    medical:   ["طبي", "علاج", "مستشفى", "دواء", "مرض", "doctor", "medic", "hospital"],
    education: ["تعليم", "مدرسة", "جامعة", "رسوم", "قسط", "school", "tuition"],
    food:      ["غذاء", "طعام", "أكل", "طرد غذائي", "food", "meal"],
    housing:   ["سكن", "إيجار", "بيت", "منزل", "rent", "house"],
    financial: ["مال", "دين", "قرض", "راتب", "loan", "debt", "salary"],
  };

  let best = request.helpType || "other";
  let bestScore = 0;
  for (const [type, keywords] of Object.entries(buckets)) {
    const score = keywords.reduce((n, kw) => n + (text.includes(kw) ? 1 : 0), 0);
    if (score > bestScore) {
      best = type;
      bestScore = score;
    }
  }

  return {
    suggestedHelpType: best,
    urgency: "medium",
    confidence: bestScore ? Math.min(0.5, 0.15 * bestScore) : 0.1,
    summary: (request.description || "").trim().slice(0, 180),
    model: "heuristic-fallback",
  };
}

function buildSystemPrompt() {
  return [
    `أنت "${HAMODA_NAME}"، مساعد ذكي لمنصة "حمودة" الخيرية.`,
    "مهمتك تحليل طلبات المساعدة وتصنيفها وتلخيصها للمشرفين.",
    "أعد دائماً ردًا بصيغة JSON صالحة فقط، بدون أي نص إضافي.",
    "حقول JSON المطلوبة:",
    `  - suggestedHelpType: واحدة من [${HELP_TYPES.join(", ")}]`,
    `  - urgency: واحدة من [${URGENCY_LEVELS.join(", ")}]`,
    "  - confidence: رقم بين 0 و 1",
    "  - summary: ملخص عربي مختصر للإدارة (سطرين كحد أقصى)",
  ].join("\n");
}

function buildUserPrompt(request) {
  return [
    "طلب مساعدة جديد:",
    `- الاسم: ${request.fullName || "غير محدد"}`,
    `- المدينة: ${request.city || "غير محدد"}`,
    `- نوع الطلب المعلن: ${request.helpType || "غير محدد"}`,
    `- الوصف: ${request.description || ""}`,
  ].join("\n");
}

function safeParseJson(content) {
  if (!content) return null;
  // Strip ```json fences if the model added them.
  const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    logger.warn(`${HAMODA_NAME}: failed to parse model JSON`, { content: cleaned.slice(0, 200) });
    return null;
  }
}

/**
 * Analyze a help request and return a structured result. Never throws.
 *
 * @param {object} request - plain HelpRequest object (id, fullName, ...)
 * @returns {Promise<{
 *   suggestedHelpType: string,
 *   urgency: string,
 *   confidence: number,
 *   summary: string,
 *   model: string,
 * }>}
 */
async function analyzeHelpRequest(request) {
  const client = getClient();
  if (!client) {
    return heuristicAnalyze(request);
  }

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserPrompt(request) },
      ],
    });

    const raw = completion?.choices?.[0]?.message?.content;
    const parsed = safeParseJson(raw);
    if (!parsed) return heuristicAnalyze(request);

    // Normalize / validate.
    const suggestedHelpType = HELP_TYPES.includes(parsed.suggestedHelpType)
      ? parsed.suggestedHelpType
      : (request.helpType || "other");

    const urgency = URGENCY_LEVELS.includes(parsed.urgency) ? parsed.urgency : "medium";

    let confidence = Number(parsed.confidence);
    if (!Number.isFinite(confidence)) confidence = 0.5;
    confidence = Math.min(1, Math.max(0, confidence));

    const summary = String(parsed.summary || "").trim().slice(0, 500);

    return { suggestedHelpType, urgency, confidence, summary, model: MODEL };
  } catch (err) {
    logger.error(`${HAMODA_NAME}: OpenAI call failed`, { error: err.message });
    return heuristicAnalyze(request);
  }
}

/**
 * Convenience: analyze a Mongoose HelpRequest document, save the AI
 * fields back onto it, and return the updated document. Errors are
 * swallowed (logged only) so this is safe to fire-and-forget.
 */
async function analyzeAndSave(helpRequestDoc) {
  if (!helpRequestDoc) return null;
  try {
    const result = await analyzeHelpRequest({
      fullName: helpRequestDoc.fullName,
      city: helpRequestDoc.city,
      helpType: helpRequestDoc.helpType,
      description: helpRequestDoc.description,
    });

    helpRequestDoc.aiSuggestedHelpType = result.suggestedHelpType;
    helpRequestDoc.aiUrgency           = result.urgency;
    helpRequestDoc.aiConfidence        = result.confidence;
    helpRequestDoc.aiSummary           = result.summary;
    helpRequestDoc.aiModel             = result.model;
    helpRequestDoc.aiClassifiedAt      = new Date();

    await helpRequestDoc.save();
    logger.info(`${HAMODA_NAME}: analyzed help request`, {
      id: String(helpRequestDoc._id),
      suggested: result.suggestedHelpType,
      urgency: result.urgency,
      model: result.model,
    });
    return helpRequestDoc;
  } catch (err) {
    logger.warn(`${HAMODA_NAME}: analyzeAndSave failed`, { error: err.message });
    return null;
  }
}

module.exports = {
  name: HAMODA_NAME,
  HELP_TYPES,
  URGENCY_LEVELS,
  analyzeHelpRequest,
  analyzeAndSave,
  isEnabled: () => Boolean(getClient()),
};

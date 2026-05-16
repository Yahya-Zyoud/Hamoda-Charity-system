const sanitizeHtml = require("sanitize-html");

const STRICT_OPTS = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: "discard",
};

function cleanString(value) {
  if (typeof value !== "string") return value;
  return sanitizeHtml(value, STRICT_OPTS).trim();
}

function cleanObject(input) {
  if (input == null || typeof input !== "object") return cleanString(input);
  if (Array.isArray(input)) return input.map(cleanObject);
  const out = {};
  for (const [k, v] of Object.entries(input)) {
    if (typeof k === "string" && k.startsWith("$")) continue;
    out[k] = cleanObject(v);
  }
  return out;
}

module.exports = { cleanString, cleanObject };

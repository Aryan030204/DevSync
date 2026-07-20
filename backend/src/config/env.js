const path = require("path");
require("dotenv").config();

function normalizeOrigin(origin) {
  return String(origin || "").trim().replace(/\/+$/, "");
}

function parseAllowedOrigins() {
  const origins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

  if (origins.length > 0) {
    return origins;
  }

  return ["http://localhost:5173"];
}

function matchesWildcardOrigin(origin, pattern) {
  if (!pattern.includes("*")) {
    return false;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  const normalizedPattern = normalizeOrigin(pattern);

  const escapedPattern = normalizedPattern.replace(
    /[.+?^${}()|[\]\\]/g,
    "\\$&"
  );
  const wildcardRegex = new RegExp(`^${escapedPattern.replace(/\\\*/g, ".*")}$`);

  return wildcardRegex.test(normalizedOrigin);
}

const allowedOrigins = parseAllowedOrigins();

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);

  return allowedOrigins.some(
    (allowedOrigin) =>
      normalizedOrigin === allowedOrigin ||
      matchesWildcardOrigin(normalizedOrigin, allowedOrigin)
  );
}

function shouldServeFrontend() {
  return process.env.SERVE_FRONTEND === "true";
}

function getFrontendDistPath() {
  return path.resolve(process.cwd(), "frontend", "dist");
}

module.exports = {
  allowedOrigins,
  frontendDistPath: getFrontendDistPath(),
  isAllowedOrigin,
  isProduction: process.env.NODE_ENV === "production",
  normalizeOrigin,
  shouldServeFrontend,
};

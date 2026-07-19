const path = require("path");
require("dotenv").config();

function parseAllowedOrigins() {
  const origins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length > 0) {
    return origins;
  }

  return ["http://localhost:5173"];
}

function shouldServeFrontend() {
  return process.env.SERVE_FRONTEND === "true";
}

function getFrontendDistPath() {
  return path.resolve(process.cwd(), "frontend", "dist");
}

module.exports = {
  allowedOrigins: parseAllowedOrigins(),
  frontendDistPath: getFrontendDistPath(),
  isProduction: process.env.NODE_ENV === "production",
  shouldServeFrontend,
};

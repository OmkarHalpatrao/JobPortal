const { doubleCsrf } = require("csrf-csrf");

const {
  doubleCsrfProtection,
  generateCsrfToken
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || "default_local_development_secret_only",
  cookieName: "x-csrf-token",
  cookieOptions: {
    sameSite: "strict",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getSessionIdentifier: (req) => "stateless-jwt-session",
  getTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

module.exports = {
  doubleCsrfProtection,
  generateCsrfToken
};

const crypto = require("crypto");

const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET || "cryptocode_admin_super_secret_key_2026";

function generateAdminToken(username = "ccAdmin") {
  const payload = {
    role: "ADMIN",
    username,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", ADMIN_SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

function verifyAdminToken(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const expectedSig = crypto.createHmac("sha256", ADMIN_SECRET).update(data).digest("base64url");
    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (payload.role !== "ADMIN") return null;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch (err) {
    return null;
  }
}

function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization || req.headers["x-admin-token"];
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (authHeader) {
    token = authHeader;
  }

  const adminPayload = verifyAdminToken(token);
  if (!adminPayload) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Admin authorization required"
    });
  }

  req.admin = adminPayload;
  next();
}

module.exports = {
  generateAdminToken,
  verifyAdminToken,
  verifyAdmin
};

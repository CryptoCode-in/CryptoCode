const crypto = require("crypto");
const supabaseAdmin = require("../config/supabaseAdmin");

const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET || "cryptocode_admin_super_secret_key_2026";
const USER_SECRET = process.env.USER_JWT_SECRET || ADMIN_SECRET;

function normalizeCollege(college) {
  if (!college) return "OTHER";
  const str = String(college).trim().toUpperCase();
  if (str === "GPN" || str.includes("POLYTECHNIC")) {
    return "GPN";
  }
  return "OTHER";
}

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

function generateUserToken(profile) {
  const payload = {
    id: profile.id,
    user_id: profile.user_id,
    email: profile.email,
    role: profile.role,
    college: normalizeCollege(profile.college),
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", USER_SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

function verifyUserToken(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const expectedSig = crypto.createHmac("sha256", USER_SECRET).update(data).digest("base64url");
    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
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
  req.user = {
    id: 0,
    role: "ADMIN",
    isAdmin: true,
    college: "ALL"
  };
  next();
}

/**
 * Resolves authenticated user from:
 * 1. Admin HMAC token
 * 2. Internal User HMAC token
 * 3. Supabase Auth JWT
 * 4. Header fallback (x-user-id / x-teacher-id / teacher_id query param) verified against DB
 */
async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers["x-auth-token"] || req.headers["x-access-token"];
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1].trim();
    } else if (authHeader) {
      token = authHeader.trim();
    }

    if (token) {
      // 1. Check if Admin token
      const adminPayload = verifyAdminToken(token);
      if (adminPayload) {
        req.user = {
          id: 0,
          role: "ADMIN",
          isAdmin: true,
          college: "ALL"
        };
        return next();
      }

      // 2. Check if internal HMAC user token
      const userPayload = verifyUserToken(token);
      if (userPayload && userPayload.id) {
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id, user_id, name, email, role, college")
          .eq("id", userPayload.id)
          .maybeSingle();

        if (profile) {
          req.user = {
            ...profile,
            college: normalizeCollege(profile.college),
            isAdmin: false
          };
          return next();
        }
      }

      // 3. Check if Supabase JWT
      try {
        const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (!authError && authData?.user?.id) {
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("id, user_id, name, email, role, college")
            .eq("user_id", authData.user.id)
            .maybeSingle();

          if (profile) {
            req.user = {
              ...profile,
              college: normalizeCollege(profile.college),
              isAdmin: false
            };
            return next();
          }
        }
      } catch (e) {
        // Token could not be parsed by Supabase
      }
    }

    // 4. Header or query param fallback: check DB for user existence
    const headerUserId = req.headers["x-user-id"] || req.headers["x-teacher-id"] || req.query.teacher_id;
    if (headerUserId) {
      const isNum = !isNaN(Number(headerUserId));
      let query = supabaseAdmin
        .from("profiles")
        .select("id, user_id, name, email, role, college");

      if (isNum) {
        query = query.eq("id", Number(headerUserId));
      } else {
        query = query.eq("user_id", headerUserId);
      }

      const { data: profile } = await query.maybeSingle();
      if (profile) {
        req.user = {
          ...profile,
          college: normalizeCollege(profile.college),
          isAdmin: false
        };
        return next();
      }
    }

    req.user = null;
    return next();
  } catch (error) {
    console.error("authenticateUser error:", error);
    req.user = null;
    return next();
  }
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }
  next();
}

function requireTeacher(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  if (req.user.isAdmin || req.user.role?.toUpperCase() === "ADMIN") {
    return next();
  }

  if (req.user.role?.toLowerCase() !== "teacher") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Teacher access required."
    });
  }

  next();
}

module.exports = {
  normalizeCollege,
  generateAdminToken,
  verifyAdminToken,
  verifyAdmin,
  generateUserToken,
  verifyUserToken,
  authenticateUser,
  requireAuth,
  requireTeacher
};

const supabase = require("../config/supabase");
const supabaseAdmin = require("../config/supabaseAdmin");
const { createLoginNotification } = require("./notificationController");
const { validatePassword } = require("../utils/passwordValidator");
const { normalizeCollege, generateUserToken } = require("../middleware/authMiddleware");

const signup = async(req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            roll_no,
            year,
            branch,
            college,
            secretKey,
            semester,
            department,
            subjects
        } = req.body;

        // Never log passwords or secret keys in console or logs
        console.log("SIGNUP REQUEST (safe):", {
            name,
            email,
            role,
            college,
            hasSecretKey: Boolean(secretKey)
        });

        if (!name || !email || !password || !role || !college) {
            return res.status(400).json({
                success: false,
                message: "All required fields (Name, Email, Password, Role, College) must be filled"
            });
        }

        const normalizedRole = String(role).trim().toLowerCase();
        if (normalizedRole !== "student" && normalizedRole !== "teacher") {
            return res.status(400).json({
                success: false,
                message: "Role must be either student or teacher"
            });
        }

        // Validate College selection
        const rawCollege = String(college).trim();
        let normalizedCollege;
        if (rawCollege.toUpperCase() === "GPN" || rawCollege.toLowerCase().includes("polytechnic")) {
            normalizedCollege = "GPN";
        } else if (rawCollege.toUpperCase() === "OTHER" || rawCollege.toLowerCase() === "other") {
            normalizedCollege = "OTHER";
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid college selected. College must be GPN or OTHER."
            });
        }

        // Validate Secret Keys strictly on backend
        const GPN_STUDENT_SECRET_KEY = process.env.GPN_STUDENT_SECRET_KEY ? process.env.GPN_STUDENT_SECRET_KEY.trim() : "GPN-ST-CC-0605";
        const GPN_TEACHER_SECRET_KEY = process.env.GPN_TEACHER_SECRET_KEY ? process.env.GPN_TEACHER_SECRET_KEY.trim() : "GPN-TE-CC-0605";
        const OTHER_TEACHER_SECRET_KEY = process.env.OTHER_TEACHER_SECRET_KEY ? process.env.OTHER_TEACHER_SECRET_KEY.trim() : "GPN-OT-CC-0605";

        if (normalizedRole === "student") {
            if (normalizedCollege === "GPN") {
                if (!secretKey || String(secretKey).trim() !== GPN_STUDENT_SECRET_KEY) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid or missing GPN Student Secret Key."
                    });
                }
            }
            // For student + OTHER: no secret key required. If user provided a key, ignore it; college stays OTHER.
        } else if (normalizedRole === "teacher") {
            if (normalizedCollege === "GPN") {
                if (!secretKey || String(secretKey).trim() !== GPN_TEACHER_SECRET_KEY) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid or missing GPN Teacher Secret Key."
                    });
                }
            } else if (normalizedCollege === "OTHER") {
                if (!secretKey || String(secretKey).trim() !== OTHER_TEACHER_SECRET_KEY) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid or missing Other College Teacher Secret Key."
                    });
                }
            }
        }

        const pwCheck = validatePassword(password);
        if (!pwCheck.isValid) {
            return res.status(400).json({
                success: false,
                message: `Password does not meet requirements: ${pwCheck.errors.join(", ")}`
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Pre-check 1: Check if email already exists in profiles
        const { data: existingProfile } = await supabaseAdmin
            .from("profiles")
            .select("id, email")
            .eq("email", cleanEmail)
            .maybeSingle();

        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: "An account with this email address already exists. Please log in."
            });
        }

        // Pre-check 2: If student, check if roll_no is already taken
        if (normalizedRole === "student" && roll_no) {
            const cleanRoll = String(roll_no).trim();
            const { data: existingRoll } = await supabaseAdmin
                .from("profiles")
                .select("id, name, college")
                .eq("roll_no", cleanRoll)
                .maybeSingle();

            if (existingRoll) {
                return res.status(400).json({
                    success: false,
                    message: `Roll number '${cleanRoll}' is already registered. Please check your roll number or use your assigned roll number.`
                });
            }
        }

        // Pre-signup orphan cleanup: remove any stuck auth user for this email with no profile (enables safe retry)
        try {
            const { data: authList } = await supabaseAdmin.auth.admin.listUsers();
            const staleUser = authList?.users?.find(u => u.email && u.email.toLowerCase() === cleanEmail);
            if (staleUser) {
                console.log("Removing orphan auth user before fresh signup retry:", staleUser.id);
                await supabaseAdmin.auth.admin.deleteUser(staleUser.id);
            }
        } catch (cleanupErr) {
            console.warn("Pre-signup orphan cleanup warning:", cleanupErr.message);
        }

        // 1. Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
        });

        if (authError) {
            return res.status(400).json({
                success: false,
                message: authError.message,
            });
        }

        const userId = authData.user.id;

        // 2. Insert user details into profiles table
        // Note: secretKey is NEVER stored in the profile
        const { data, error } = await supabaseAdmin
            .from("profiles")
            .insert([{
                user_id: userId,
                name: name.trim(),
                email: cleanEmail,
                role: normalizedRole,
                roll_no: normalizedRole === "student" ? (roll_no ? String(roll_no).trim() : null) : null,
                year: normalizedRole === "student" ? (year ? String(year).trim() : null) : null,
                branch: normalizedRole === "student" ? (branch ? String(branch).trim() : null) : null,
                college: normalizedCollege,
                semester: normalizedRole === "student" ? (semester ? String(semester).trim() : null) : null,
                department: normalizedRole === "teacher" ? (department ? String(department).trim() : null) : null,
                subjects: normalizedRole === "teacher" ? (subjects || []) : []
            }])
            .select();

        if (error) {
            console.error("PROFILE CREATION ERROR:", error);
            // Clean up auth user on profile creation failure
            try {
                await supabaseAdmin.auth.admin.deleteUser(userId);
            } catch (delErr) {
                console.warn("Could not delete orphan auth user:", delErr.message);
            }

            let clientMessage = "Profile creation failed. Please check your details and try again.";
            if (error.code === "23505") {
                if (error.details?.includes("roll_no") || error.message?.includes("unique_roll_no")) {
                    clientMessage = `Roll number '${roll_no}' is already registered. Please use your assigned roll number.`;
                } else if (error.details?.includes("email") || error.message?.includes("profiles_email_key")) {
                    clientMessage = "An account with this email already exists. Please log in.";
                } else {
                    clientMessage = "An account with these details already exists.";
                }
            } else if (error.message) {
                clientMessage = error.message;
            }

            return res.status(400).json({
                success: false,
                message: clientMessage,
                error
            });
        }

        const userProfile = Array.isArray(data) ? data[0] : data;
        const token = generateUserToken(userProfile);

        // 3. Success response
        return res.status(201).json({
            success: true,
            user: data,
            token,
            session: authData.session
        });
    } catch (signupErr) {
        console.error("Signup Exception:", signupErr);
        return res.status(500).json({
            success: false,
            message: "An error occurred during registration"
        });
    }
};

const login = async(req, res) => {

    const { email, password, role } = req.body;
    const rawSecretKey = req.body?.secretKey ?? req.headers["x-secret-key"] ?? req.headers["secret-key"] ?? req.query?.secretKey;

    if (!email || !password || !role) {
        return res.status(400).json({
            message: "Email, Password and Role are required"
        });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("id, name, email, role, roll_no, year, semester, branch, college, department, subjects, user_id")
        .eq("user_id", data.user.id)
        .single();

    if (profileError || !profile) {
        return res.status(403).json({
            success: false,
            message: "User profile not found"
        });
    }

    if (profile.role !== role) {
        return res.status(403).json({
            success: false,
            message: `You are registered as ${profile.role}. Please select ${profile.role} login.`
        });
    }

    const safeCollege = normalizeCollege(profile.college);

    // Backend Secret Key validation:
    // If a secretKey is provided in the payload/headers or REQUIRE_LOGIN_SECRET_KEY is configured,
    // validate it strictly against the user's registered role and college cohort.
    const GPN_STUDENT_SECRET_KEY = process.env.GPN_STUDENT_SECRET_KEY || "GPN-ST-CC-0605";
    const GPN_TEACHER_SECRET_KEY = process.env.GPN_TEACHER_SECRET_KEY || "GPN-TE-CC-0605";
    const OTHER_TEACHER_SECRET_KEY = process.env.OTHER_TEACHER_SECRET_KEY ? process.env.OTHER_TEACHER_SECRET_KEY.trim() : "";
    const requireLoginSecretKey = process.env.REQUIRE_LOGIN_SECRET_KEY === "true";

    const secretKeyProvided = rawSecretKey !== undefined && rawSecretKey !== null;

    if (requireLoginSecretKey || secretKeyProvided) {
        const providedKey = rawSecretKey ? String(rawSecretKey).trim() : "";

        if (profile.role === "student") {
            if (safeCollege === "GPN") {
                if (!providedKey || providedKey !== GPN_STUDENT_SECRET_KEY) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid secret key"
                    });
                }
            } else if (safeCollege === "OTHER") {
                // Students from OTHER colleges do not use secret keys.
                // Any attempt to submit a secret key or spoof GPN credentials is rejected.
                if (providedKey) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid secret key"
                    });
                }
            }
        } else if (profile.role === "teacher") {
            if (safeCollege === "GPN") {
                if (!providedKey || providedKey !== GPN_TEACHER_SECRET_KEY) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid secret key"
                    });
                }
            } else if (safeCollege === "OTHER") {
                if (!OTHER_TEACHER_SECRET_KEY || !providedKey || providedKey !== OTHER_TEACHER_SECRET_KEY) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid secret key"
                    });
                }
            }
        }
    }

    const token = generateUserToken({ ...profile, college: safeCollege });

    // Capture and create successful login notification
    try {
        await createLoginNotification({
            userId: data.user.id,
            userName: profile.name,
            role: profile.role,
            timestamp: new Date()
        });
    } catch (notifErr) {
        console.error("Failed to create login notification:", notifErr);
    }

    res.status(200).json({
        success: true,
        user: {
            id: data.user.id,
            profile_id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            roll_no: profile.roll_no,
            year: profile.year,
            semester: profile.semester,
            branch: profile.branch,
            college: safeCollege,
            department: profile.department,
            subjects: profile.subjects
        },
        token,
        session: data.session
    });

};
const updateProfile = async (req, res) => {
    try {
        const {
            user_id,
            id,
            name,
            email,
            roll_no,
            year,
            semester,
            branch,
            college,
            department,
            subjects
        } = req.body;

        if (!user_id && !id) {
            return res.status(400).json({
                success: false,
                message: "user_id is required"
            });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (roll_no !== undefined) updateData.roll_no = roll_no;
        if (year !== undefined) updateData.year = year;
        if (semester !== undefined) updateData.semester = semester;
        if (branch !== undefined) updateData.branch = branch;
        // Role and college cannot be modified via updateProfile
        delete updateData.role;
        delete updateData.college;
        if (department !== undefined) updateData.department = department;
        if (subjects !== undefined) updateData.subjects = subjects;

        let query = supabaseAdmin.from("profiles").update(updateData);
        if (user_id) {
            query = query.eq("user_id", user_id);
        } else {
            query = query.eq("id", id);
        }

        const { data: profile, error } = await query.select().single();

        if (error) {
            console.error("Update profile error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to update profile"
            });
        }

        return res.status(200).json({
            success: true,
            user: profile
        });

    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email address is required."
            });
        }

        const trimmedEmail = email.trim().toLowerCase();

        // Use the anon Supabase client — resetPasswordForEmail does not require admin
        const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
            redirectTo: "http://localhost:5173/reset-password"
        });

        if (error) {
            console.error("Supabase forgot-password error:", error);
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to send reset email."
            });
        }

        // Always respond with success to prevent email enumeration
        return res.status(200).json({
            success: true,
            message: "If this email is registered, a password reset link has been sent."
        });
    } catch (err) {
        console.error("Forgot password error:", err);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred."
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token_hash, newPassword } = req.body;

        if (!token_hash) {
            return res.status(400).json({ success: false, message: "Reset token is missing." });
        }
        if (!newPassword) {
            return res.status(400).json({ success: false, message: "New password is required." });
        }
        const pwCheck = validatePassword(newPassword);
        if (!pwCheck.isValid) {
            return res.status(400).json({
                success: false,
                message: `New password does not meet requirements: ${pwCheck.errors.join(", ")}`
            });
        }

        // Exchange the token_hash for a session (verifies the reset link is valid)
        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash,
            type: "recovery"
        });

        if (verifyError || !verifyData?.user) {
            console.error("Reset token verification error:", verifyError);
            return res.status(400).json({
                success: false,
                message: verifyError?.message || "Invalid or expired reset link. Please request a new one."
            });
        }

        // Update the password using the admin client
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            verifyData.user.id,
            { password: newPassword }
        );

        if (updateError) {
            console.error("Reset password update error:", updateError);
            return res.status(500).json({ success: false, message: updateError.message || "Failed to update password." });
        }

        return res.status(200).json({ success: true, message: "Password updated successfully. You can now log in." });
    } catch (err) {
        console.error("Reset password error:", err);
        return res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
};

const changePassword = async (req, res) => {
    try {
        let { email, user_id, currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required"
            });
        }

        const pwCheck = validatePassword(newPassword);
        if (!pwCheck.isValid) {
            return res.status(400).json({
                success: false,
                message: `New password does not meet requirements: ${pwCheck.errors.join(", ")}`
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password cannot be the same as your current password"
            });
        }

        // If email not provided directly, look it up by user_id
        if (!email && user_id) {
            const { data: prof } = await supabaseAdmin
                .from("profiles")
                .select("email")
                .eq("user_id", user_id)
                .maybeSingle();

            if (prof && prof.email) {
                email = prof.email;
            }
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "User account email could not be resolved"
            });
        }

        // 1. Verify current password by signing in with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password: currentPassword
        });

        if (authError || !authData?.user) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // 2. Update password in Supabase Auth using Admin Client
        const targetUserId = authData.user.id;
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            targetUserId,
            { password: newPassword }
        );

        if (updateError) {
            console.error("Supabase password update error:", updateError);
            return res.status(500).json({
                success: false,
                message: updateError.message || "Failed to update password"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (err) {
        console.error("Change password error:", err);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred while updating password"
        });
    }
};

module.exports = {
    signup,
    login,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword
};

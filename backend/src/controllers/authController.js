const supabase = require("../config/supabase");
const supabaseAdmin = require("../config/supabaseAdmin");
const signup = async(req, res) => {

    const {
        name,
        email,
        password,
        role,
        roll_no,
        year,
        branch,
        college,
        semester,
        department,
        subjects
    } = req.body;
    console.log("SIGNUP BODY:", req.body);

    if (!name || !email || !password || !role) {
        return res.status(400).json({
            message: "All required fields must be filled"
        });
    }

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } =
    await supabase.auth.signUp({
        email,
        password,
    });

    console.log("Signup Request:", email);
    console.log("Auth Error:", authError);

    if (authError) {
        return res.status(400).json({
            success: false,
            message: authError.message,
        });
    }

    console.log("AUTH DATA:", authData);

    const userId = authData.user.id;

    // 2. Insert user details into profiles table
    const { data, error } = await supabase
        .from("profiles")
        .insert([{
            user_id: userId,
            name,
            email,
            role,
            roll_no,
            year,
            branch,
            college,
            semester,
            department,
            subjects
        }])
        .select();

    console.log("PROFILE ERROR:", error);
    console.log("PROFILE DATA:", data);

    if (error) {
        return res.status(500).json({
            success: false,
            message: "Profile creation failed",
            error
        });
    }

    // 3. Success response
    res.status(201).json({
        success: true,
        user: data
    });
};



const login = async(req, res) => {

    const { email, password, role } = req.body;

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

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name, email, role, roll_no, year, semester, branch, college, department, subjects")
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

    res.status(200).json({
        success: true,
        user: {
    id: data.user.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    roll_no: profile.roll_no,
    year: profile.year,
    semester: profile.semester,
    branch: profile.branch,
    college: profile.college,
    department: profile.department,
    subjects: profile.subjects
},
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
        if (college !== undefined) updateData.college = college;
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

const changePassword = async (req, res) => {
    try {
        let { email, user_id, currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters long"
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
    changePassword
};
const supabase = require("../config/supabase");

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
        semester
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
            semester
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
        .select("name, email, role")
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
            role: profile.role
        },
        session: data.session
    });

};

module.exports = { signup, login };
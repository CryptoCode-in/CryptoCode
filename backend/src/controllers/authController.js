const supabase = require("../config/supabase");

const signup = async(req, res) => {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
        return res.status(400).json({ message: "All fields required" });
    }

    const { data, error } = await supabase
        .from("profiles")
        .insert([{ name, email, role }])
        .select();

    if (error) return res.status(500).json({ error });

    res.status(201).json({ success: true, user: data });
};



const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password required"
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

    res.status(200).json({
        success: true,
        user: data.user,
        session: data.session
    });
};

module.exports = { signup,login };
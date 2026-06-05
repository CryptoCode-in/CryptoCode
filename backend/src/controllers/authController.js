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

module.exports = { signup };
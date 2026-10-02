const supabase = require("../config/supabase");

const getStudents = async(req, res) => {
    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "student");

        console.log("STUDENTS DATA:", data);
        console.log("STUDENTS ERROR:", error);

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        return res.status(200).json({
            success: true,
            students: data
        });

    } catch (error) {
        console.error("Get Students Exception:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const registerStudent = async(req, res) => {
    try {
        const {
            name,
            email,
            password,
            roll_no,
            year,
            branch,
            college,
            semester,
            department
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // 1. Create auth user in Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) {
            return res.status(400).json({
                success: false,
                message: authError.message
            });
        }

        const userId = authData?.user?.id || null;

        // 2. Insert into profiles with role student
        const { data, error } = await supabase
            .from("profiles")
            .insert([{
                user_id: userId,
                name,
                email,
                role: "student",
                roll_no,
                year,
                branch,
                college,
                semester,
                department
            }])
            .select();

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to create student profile",
                error
            });
        }

        return res.status(201).json({
            success: true,
            message: "Student registered successfully by Admin",
            user: data
        });
    } catch (error) {
        console.error("Register student error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getStudents, registerStudent };
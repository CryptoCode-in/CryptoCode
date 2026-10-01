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

module.exports = { getStudents };
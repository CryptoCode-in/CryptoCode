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
const getStudentById = async(req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("profiles")
            .select("id, name, email, roll_no, year, semester, branch, college")
            .eq("id", id)
            .eq("role", "student")
            .single();

        console.log("STUDENT PROFILE DATA:", data);
        console.log("STUDENT PROFILE ERROR:", error);

        if (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(200).json({
            success: true,
            student: {
                ...data,
                rollNo: data.roll_no || "N/A",
                year: data.year || "N/A",
                semester: data.semester || "N/A",
                branch: data.branch || "N/A",
                college: data.college || "N/A",
                subject: "N/A",
                joinedOn: "N/A",
                problemsSolved: 0,
                assignmentsCompleted: 0,
                avgScore: 0,
                acceptanceRate: 0,
                lastActive: "N/A"
            }
        });

    } catch (error) {
        console.error("Get Student Profile Exception:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getStudents,
    getStudentById
};
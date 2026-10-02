const supabase = require("../config/supabase");

const getStudents = async (req, res) => {
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


const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("GET STUDENT BY ID:", id);

        const { data, error } = await supabase
            .from("profiles")
            .select(
                "id, name, email, roll_no, year, semester, branch, college"
            )
            .eq("id", id)
            .eq("role", "student")
            .single();

        console.log("STUDENT PROFILE DATA:", data);
        console.log("STUDENT PROFILE ERROR:", error);

        if (error || !data) {
            return res.status(404).json({
                success: false,
                message: error?.message || "Student not found"
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


const registerStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            roll_no,
            year,
            semester,
            branch,
            college
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const {
            data: authData,
            error: authError
        } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });

        if (authError) {
            console.error("AUTH CREATE ERROR:", authError);

            return res.status(400).json({
                success: false,
                message: authError.message
            });
        }

        const userId = authData.user.id;

        const {
            data: profileData,
            error: profileError
        } = await supabase
            .from("profiles")
            .insert([
                {
                    id: userId,
                    name,
                    email,
                    role: "student",
                    roll_no: roll_no || null,
                    year: year || null,
                    semester: semester || null,
                    branch: branch || null,
                    college: college || null
                }
            ])
            .select()
            .single();

        if (profileError) {
            console.error("PROFILE CREATE ERROR:", profileError);

            return res.status(400).json({
                success: false,
                message: profileError.message
            });
        }

        return res.status(201).json({
            success: true,
            message: "Student registered successfully",
            student: profileData
        });

    } catch (error) {
        console.error("Register Student Exception:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getStudents,
    getStudentById,
    registerStudent
};
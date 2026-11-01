const supabase = require("../config/supabase");
const supabaseAdmin = require("../config/supabaseAdmin");
const { validatePassword } = require("../utils/passwordValidator");
const { normalizeCollege } = require("../middleware/authMiddleware");

const getStudents = async (req, res) => {
    try {
        const isAdmin = Boolean(req.user?.isAdmin || req.user?.role?.toUpperCase() === "ADMIN");
        const teacherCollege = req.user?.college ? normalizeCollege(req.user.college) : "OTHER";

        let allStudents = [];
        let from = 0;
        const PAGE_SIZE = 1000;

        // Paginate in case there are more than 1000 students
        while (true) {
            let query = supabaseAdmin
                .from("profiles")
                .select("*")
                .eq("role", "student");

            // College isolation: GPN teachers only see GPN students; Other teachers only see Other students
            if (!isAdmin) {
                query = query.eq("college", teacherCollege);
            }

            const { data, error } = await query.range(from, from + PAGE_SIZE - 1);

            if (error) {
                console.error("STUDENTS FETCH ERROR:", error);
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }

            if (!data || data.length === 0) break;

            allStudents = allStudents.concat(data);

            if (data.length < PAGE_SIZE) break; // last page
            from += PAGE_SIZE;
        }

        // Apply in-memory search if requested (e.g. Test 15: GPN teacher searches for students)
        const searchQuery = (req.query.search || req.query.q || "").trim().toLowerCase();
        if (searchQuery) {
            allStudents = allStudents.filter(s => {
                const name = (s.name || "").toLowerCase();
                const email = (s.email || "").toLowerCase();
                const roll = (s.roll_no || "").toLowerCase();
                const branch = (s.branch || "").toLowerCase();
                return name.includes(searchQuery) || email.includes(searchQuery) || roll.includes(searchQuery) || branch.includes(searchQuery);
            });
        }

        return res.status(200).json({
            success: true,
            students: allStudents,
            total: allStudents.length
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
        const isAdmin = Boolean(req.user?.isAdmin || req.user?.role?.toUpperCase() === "ADMIN");
        const teacherCollege = req.user?.college ? normalizeCollege(req.user.college) : "OTHER";

        const isNumeric = /^\d+$/.test(String(id).trim());
        let query = supabaseAdmin
            .from("profiles")
            .select("id, user_id, name, email, roll_no, year, semester, branch, college, department, subjects")
            .eq("role", "student");

        if (isNumeric) {
            query = query.eq("id", Number(id));
        } else {
            query = query.eq("user_id", String(id).trim());
        }

        const { data: studentData, error: profileError } = await query.maybeSingle();

        if (profileError || !studentData) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Access Control: Verify student's college matches teacher's college
        const studentCollege = normalizeCollege(studentData.college);
        if (!isAdmin && studentCollege !== teacherCollege) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Student belongs to another college."
            });
        }

        // Fetch all submissions for this student to compute real metrics
        const { data: submissions, error: submissionsError } = await supabaseAdmin
            .from("submissions")
            .select("id, status, submitted_at, language, filename")
            .eq("student_id", studentData.id)
            .order("submitted_at", { ascending: false });

        if (submissionsError) {
            console.error("Error fetching submissions for student metrics:", submissionsError);
        }

        const allSubs = submissions || [];
        const totalSubmissions = allSubs.length;

        // Problems Solved: submissions with accepted/saved/submitted/passed/success status
        const acceptedStatuses = ["accepted", "saved", "submitted", "passed", "success"];
        const problemsSolved = allSubs.filter(s => {
            const st = String(s.status || "").toLowerCase().trim();
            return acceptedStatuses.includes(st);
        }).length;

        // Assignments: total number of submissions
        const assignmentsCompleted = totalSubmissions;

        // Average Score: 100 for accepted/saved/passed/success, 0 otherwise
        let totalScore = 0;
        let scoredCount = 0;
        allSubs.forEach(s => {
            const st = String(s.status || "").toLowerCase().trim();
            totalScore += acceptedStatuses.includes(st) ? 100 : 0;
            scoredCount++;
        });
        const avgScore = scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0;

        // Acceptance Rate: percentage of accepted submissions out of total
        const acceptanceRate = totalSubmissions > 0
            ? Math.round((problemsSolved / totalSubmissions) * 100)
            : 0;

        // Last Active: date of the most recent submission
        const lastActive = allSubs.length > 0 && allSubs[0].submitted_at
            ? new Date(allSubs[0].submitted_at).toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })
            : "N/A";

        // Joined On: derive from earliest submission date if available, else fallback to "N/A"
        let joinedOn = "N/A";
        if (allSubs.length > 0) {
            const earliest = allSubs[allSubs.length - 1];
            if (earliest && earliest.submitted_at) {
                joinedOn = new Date(earliest.submitted_at).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                });
            }
        }

        return res.status(200).json({
            success: true,
            student: {
                id: studentData.id,
                name: studentData.name,
                email: studentData.email,
                rollNo: studentData.roll_no || "N/A",
                year: studentData.year || "N/A",
                semester: studentData.semester || "N/A",
                branch: studentData.branch || "N/A",
                college: studentData.college || "N/A",
                department: studentData.department || "N/A",
                subject: studentData.subjects || "N/A",
                joinedOn,
                // Real computed metrics
                problemsSolved,
                assignmentsCompleted,
                avgScore,
                acceptanceRate,
                lastActive,
                totalSubmissions
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


const getStudentAnalytics = async (req, res) => {
    try {
        const { id } = req.params;
        const isAdmin = Boolean(req.user?.isAdmin || req.user?.role?.toUpperCase() === "ADMIN");
        const teacherCollege = req.user?.college ? normalizeCollege(req.user.college) : "OTHER";

        if (!id) {
            return res.status(400).json({ success: false, message: "Student ID is required" });
        }

        // Verify the student exists and fetch college
        const { data: student, error: studentError } = await supabaseAdmin
            .from("profiles")
            .select("id, college")
            .eq("id", id)
            .eq("role", "student")
            .single();

        if (studentError || !student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Access Control: Verify student's college matches teacher's college
        const studentCollege = normalizeCollege(student.college);
        if (!isAdmin && studentCollege !== teacherCollege) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Student belongs to another college."
            });
        }

        // Fetch all submissions for this student
        const { data: submissions, error: subError } = await supabaseAdmin
            .from("submissions")
            .select("id, status, submitted_at, language")
            .eq("student_id", id)
            .order("submitted_at", { ascending: true });

        if (subError) {
            console.error("Error fetching submissions for student analytics:", subError);
            return res.status(500).json({ success: false, message: "Failed to fetch student submissions" });
        }

        const allSubs = submissions || [];

        // ── 1. Submission Trend (current calendar week Mon-Sun) ──────────────
        const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        // Compute the Monday of the current week (local time)
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        const diffToMonday = (dayOfWeek + 6) % 7; // days since Monday
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - diffToMonday);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);

        const weeklyTrendMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

        allSubs.forEach(sub => {
            const dt = new Date(sub.submitted_at);
            if (isNaN(dt.getTime())) return;
            if (dt >= weekStart && dt < weekEnd) {
                const dayIdx = (dt.getDay() + 6) % 7; // Mon=0 … Sun=6
                weeklyTrendMap[dayNames[dayIdx]]++;
            }
        });

        const weeklyTrend = dayNames.map(d => ({
            name: d,
            submissions: weeklyTrendMap[d]
        }));

        // ── 2. Language Usage ────────────────────────────────────────────────
        const langCounts = { C: 0, "C++": 0, Java: 0, Python: 0 };
        allSubs.forEach(sub => {
            const l = String(sub.language || "").toLowerCase().trim();
            if (l === "c") langCounts["C"]++;
            else if (l === "cpp" || l === "c++") langCounts["C++"]++;
            else if (l === "java") langCounts["Java"]++;
            else if (l === "python") langCounts["Python"]++;
        });

        const langColors = { "C": "#06b6d4", "C++": "#8b5cf6", "Java": "#f59e0b", "Python": "#2563eb" };
        const totalLang = Object.values(langCounts).reduce((a, b) => a + b, 0);

        const languageUsage = Object.entries(langCounts)
            .filter(([, count]) => count > 0)
            .map(([name, count]) => ({
                name,
                value: count,
                percentage: totalLang > 0 ? Math.round((count / totalLang) * 100) : 0,
                color: langColors[name]
            }));

        // Include all 4 languages even if zero (for consistent chart display)
        if (languageUsage.length === 0) {
            Object.entries(langColors).forEach(([name, color]) => {
                languageUsage.push({ name, value: 0, percentage: 0, color });
            });
        }

        // ── 3. Submission Status Distribution ───────────────────────────────
        const statusCounts = {};
        allSubs.forEach(sub => {
            const st = sub.status
                ? sub.status.charAt(0).toUpperCase() + sub.status.slice(1).toLowerCase()
                : "Unknown";
            statusCounts[st] = (statusCounts[st] || 0) + 1;
        });

        const statusColorMap = {
            Accepted:  "#34d399",
            Saved:     "#8b5cf6",
            Submitted: "#3b82f6",
            Passed:    "#34d399",
            Success:   "#34d399",
            Rejected:  "#f87171",
            Pending:   "#fbbf24",
            Failed:    "#f87171",
            Error:     "#f87171",
            Unknown:   "#6b7280"
        };

        const totalStatus = Object.values(statusCounts).reduce((a, b) => a + b, 0);
        const submissionStatus = Object.entries(statusCounts).map(([name, count]) => ({
            name,
            value: count,
            percentage: totalStatus > 0 ? Math.round((count / totalStatus) * 100) : 0,
            color: statusColorMap[name] || "#6b7280"
        }));

        return res.status(200).json({
            success: true,
            analytics: {
                weeklyTrend,
                languageUsage,
                submissionStatus,
                totalSubmissions: allSubs.length
            }
        });

    } catch (error) {
        console.error("Get Student Analytics Exception:", error);
        return res.status(500).json({ success: false, message: error.message });
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

        const pwCheck = validatePassword(password);
        if (!pwCheck.isValid) {
            return res.status(400).json({
                success: false,
                message: `Password does not meet requirements: ${pwCheck.errors.join(", ")}`
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
        const safeCollege = college ? normalizeCollege(college) : "OTHER";

        const {
            data: profileData,
            error: profileError
        } = await supabaseAdmin
            .from("profiles")
            .insert([
                {
                    user_id: userId,
                    name,
                    email,
                    role: "student",
                    roll_no: roll_no || null,
                    year: year || null,
                    semester: semester || null,
                    branch: branch || null,
                    college: safeCollege
                }
            ])
            .select()
            .single();

        if (profileError) {
            console.error("PROFILE CREATE ERROR:", profileError);
            try {
                await supabaseAdmin.auth.admin.deleteUser(userId);
            } catch (e) {}

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
    getStudentAnalytics,
    registerStudent
};

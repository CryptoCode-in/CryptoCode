const supabaseAdmin = require("../config/supabaseAdmin");
const saveSubmission = async (req, res) => {
    try {
        const {
    user_id,
    source_code,
    language,
    status,
    filename
} = req.body;

       if (!user_id || !source_code || !language || !filename) {
            return res.status(400).json({
                success: false,
                message: "user_id, source_code, language and filename are required"
            });
        }

        // Find profile using Supabase Auth user UUID
        const { data: profile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("user_id", user_id)
            .single();

        console.log("PROFILE LOOKUP:", {
            user_id,
            profile,
            profileError
        });

        if (profileError || !profile) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        // Save submission using profiles.id
        const { data: submission, error: submissionError } = await supabaseAdmin
            .from("submissions")
           .insert([{
    student_id: profile.id,
    source_code,
    language,
    filename,
    status: status || "saved"
}])
            .select()
            .single();

        if (submissionError) {
            console.error("Submission insert error:", submissionError);

            return res.status(500).json({
                success: false,
                message: "Failed to save submission"
            });
        }

        return res.status(201).json({
            success: true,
            submission: submission
        });

    } catch (error) {
        console.error("Save submission error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
const updateSubmission = async (req, res) => {
    try {
        const { id } = req.params;
const {
    source_code,
    language,
    status,
    filename
} = req.body;

        if (!id || !source_code || !language || !filename) {
            return res.status(400).json({
                success: false,
                message: "id, source_code, language and filename are required"
            });
        }

        const { data: submission, error: submissionError } =
            await supabaseAdmin
                .from("submissions")
                .update({
    source_code,
    language,
    filename,
    status: status || "saved"
})
                .eq("id", id)
                .select()
                .single();

        if (submissionError) {
            console.error("Submission update error:", submissionError);

            return res.status(500).json({
                success: false,
                message: "Failed to update submission"
            });
        }

        return res.status(200).json({
            success: true,
            submission: submission
        });

    } catch (error) {
        console.error("Update submission error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
const getSubmissions = async (req, res) => {
    try {
        const { user_id, student_id } = req.query;

        let query = supabaseAdmin
            .from("submissions")
            .select(`
                id,
                student_id,
                source_code,
                language,
                status,
                submitted_at,
                filename,
                profiles:student_id (
                    id,
                    name,
                    email,
                    roll_no,
                    user_id,
                    branch,
                    year
                )
            `)
            .order("submitted_at", { ascending: false });

        if (student_id) {
            query = query.eq("student_id", student_id);
        } else if (user_id) {
            // Find profile using Supabase Auth user UUID or numeric profile id
            const { data: profile } = await supabaseAdmin
                .from("profiles")
                .select("id, role")
                .eq("user_id", user_id)
                .maybeSingle();

            if (profile && profile.role === "student") {
                query = query.eq("student_id", profile.id);
            } else if (!profile) {
                // If not found by user_id UUID, check if user_id is the numeric profile id
                const { data: pById } = await supabaseAdmin
                    .from("profiles")
                    .select("id, role")
                    .eq("id", user_id)
                    .maybeSingle();

                if (pById && pById.role === "student") {
                    query = query.eq("student_id", pById.id);
                } else if (!pById) {
                    return res.status(404).json({
                        success: false,
                        message: "Student profile not found"
                    });
                }
            }
            // If profile role is teacher or admin, return all submissions
        }

        const { data: submissions, error: submissionsError } = await query;

        if (submissionsError) {
            console.error("Get submissions error:", submissionsError);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch submissions"
            });
        }

        return res.status(200).json({
            success: true,
            submissions: submissions || []
        });

    } catch (error) {
        console.error("Get submissions error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: submission, error: submissionError } = await supabaseAdmin
            .from("submissions")
            .select(`
                id,
                student_id,
                source_code,
                language,
                status,
                submitted_at,
                filename,
                profiles:student_id (
                    id,
                    name,
                    email,
                    roll_no,
                    user_id,
                    branch,
                    year
                )
            `)
            .eq("id", id)
            .maybeSingle();

        if (submissionError) {
            console.error("Get submission by ID error:", submissionError);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch submission"
            });
        }

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found"
            });
        }

        return res.status(200).json({
            success: true,
            submission
        });
    } catch (error) {
        console.error("Get submission by ID error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getSubmissionAnalytics = async (req, res) => {
    try {
        const { teacher_id } = req.query;

        // Fetch submissions from database
        const { data: submissions, error: subError } = await supabaseAdmin
            .from("submissions")
            .select("id, student_id, language, status, submitted_at")
            .order("submitted_at", { ascending: true });

        if (subError) {
            console.error("Error fetching submissions for analytics:", subError);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch submissions for analytics"
            });
        }

        const allSubmissions = submissions || [];

        const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // 1. Weekly Submission Trend (Mon - Sun counts)
        const weeklyTrendMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

        // 2. Weekly Activity Grid (Mon - Sun x 6 time blocks: hr0, hr4, hr8, hr12, hr16, hr20)
        const activityGridMap = {};
        dayNames.forEach((d) => {
            activityGridMap[d] = {
                day: d,
                hr0: 0,
                hr4: 0,
                hr8: 0,
                hr12: 0,
                hr16: 0,
                hr20: 0
            };
        });

        // 3. Language Usage (C, C++, Java, Python)
        const langCounts = { c: 0, cpp: 0, java: 0, python: 0 };

        // Successful submission helper: accepts 'accepted', 'saved', 'submitted', 'passed', etc.
        const isSuccessful = (status) => {
            if (!status) return true;
            const st = String(status).toLowerCase().trim();
            return (
                st === "accepted" ||
                st === "saved" ||
                st === "submitted" ||
                st === "passed" ||
                st === "success"
            );
        };

        allSubmissions.forEach((sub) => {
            const dt = new Date(sub.submitted_at);
            const isValidDate = !isNaN(dt.getTime());

            if (isValidDate) {
                // Day of week: Sunday (0) -> 6, Monday (1) -> 0, etc.
                const dayIdx = (dt.getDay() + 6) % 7;
                const dayName = dayNames[dayIdx];
                if (weeklyTrendMap[dayName] !== undefined) {
                    weeklyTrendMap[dayName]++;
                }

                // 4-hour segments: hr0 (0-4), hr4 (4-8), hr8 (8-12), hr12 (12-16), hr16 (16-20), hr20 (20-24)
                const hr = dt.getHours();
                const bucket =
                    hr < 4 ? "hr0" :
                    hr < 8 ? "hr4" :
                    hr < 12 ? "hr8" :
                    hr < 16 ? "hr12" :
                    hr < 20 ? "hr16" : "hr20";

                if (activityGridMap[dayName]) {
                    activityGridMap[dayName][bucket]++;
                }
            }

            // Language normalization
            const l = (sub.language || "").toLowerCase().trim();
            if (l === "c") {
                langCounts.c++;
            } else if (l === "cpp" || l === "c++") {
                langCounts.cpp++;
            } else if (l === "java") {
                langCounts.java++;
            } else if (l === "python") {
                langCounts.python++;
            }
        });

        // Format 1: Weekly Submission Trend
        const weeklyTrend = dayNames.map((d) => ({
            name: d,
            submissions: weeklyTrendMap[d] || 0
        }));

        // Format 2: Weekly Activity Segment
        const weeklyActivityGrid = dayNames.map((d) => activityGridMap[d]);

        // Format 3: Language Usage Breakdown
        const languageUsage = [
            { name: "C", value: langCounts.c, color: "#06b6d4" },
            { name: "C++", value: langCounts.cpp, color: "#8b5cf6" },
            { name: "Java", value: langCounts.java, color: "#f59e0b" },
            { name: "Python", value: langCounts.python, color: "#3b82f6" }
        ];

        // Format 4: Problems Solved Over Time (trailing 6 calendar months ending with current month)
        const now = new Date();
        const problemsSolvedOverTime = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const mName = monthNames[d.getMonth()];
            const yr = d.getFullYear();
            const mo = d.getMonth();

            let solvedCount = 0;
            allSubmissions.forEach((sub) => {
                if (!isSuccessful(sub.status)) return;
                const dt = new Date(sub.submitted_at);
                if (isNaN(dt.getTime())) return;
                if (dt.getFullYear() === yr && dt.getMonth() === mo) {
                    solvedCount++;
                }
            });

            problemsSolvedOverTime.push({
                name: mName,
                solved: solvedCount
            });
        }

        return res.status(200).json({
            success: true,
            analytics: {
                problemsSolvedOverTime,
                weeklyActivityGrid,
                languageUsage,
                weeklyTrend,
                totalSubmissions: allSubmissions.length
            }
        });
    } catch (error) {
        console.error("Get analytics error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error calculating analytics"
        });
    }
};

module.exports = {
    saveSubmission,
    updateSubmission,
    getSubmissions,
    getSubmissionById,
    getSubmissionAnalytics
};
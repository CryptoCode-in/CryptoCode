const supabaseAdmin = require("../config/supabaseAdmin");
const { normalizeCollege } = require("../middleware/authMiddleware");
const fs = require("fs");
const path = require("path");

const LOCAL_OUTPUT_DIR = path.join(__dirname, "../../data/outputs");
try {
    if (!fs.existsSync(LOCAL_OUTPUT_DIR)) {
        fs.mkdirSync(LOCAL_OUTPUT_DIR, { recursive: true });
    }
} catch (e) {
    console.warn("Could not create local output dir:", e.message);
}

const saveExecutionOutput = async (submissionId, outputText) => {
    if (!submissionId || outputText === undefined || outputText === null) return;
    const str = String(outputText);
    try {
        const localPath = path.join(LOCAL_OUTPUT_DIR, `${submissionId}.txt`);
        fs.writeFileSync(localPath, str, "utf8");
    } catch (e) {
        console.warn("Local output write warning:", e.message);
    }
    try {
        const filename = `${submissionId}.txt`;
        await supabaseAdmin.storage
            .from("submission_outputs")
            .upload(filename, Buffer.from(str, "utf8"), {
                contentType: "text/plain",
                upsert: true
            });
    } catch (err) {
        console.warn("Supabase storage upload warning:", err.message);
    }
};

const getExecutionOutput = async (submissionId) => {
    if (!submissionId) return null;
    try {
        const localPath = path.join(LOCAL_OUTPUT_DIR, `${submissionId}.txt`);
        if (fs.existsSync(localPath)) {
            return fs.readFileSync(localPath, "utf8");
        }
    } catch (e) {}
    try {
        const filename = `${submissionId}.txt`;
        const { data, error } = await supabaseAdmin.storage
            .from("submission_outputs")
            .download(filename);
        if (!error && data) {
            const text = await data.text();
            try {
                const localPath = path.join(LOCAL_OUTPUT_DIR, `${submissionId}.txt`);
                fs.writeFileSync(localPath, text, "utf8");
            } catch (e) {}
            return text;
        }
    } catch (err) {}
    return null;
};
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

        // Check if a file with the same filename already exists for this student
        const { data: existingSub } = await supabaseAdmin
            .from("submissions")
            .select("id, filename")
            .eq("student_id", profile.id)
            .ilike("filename", filename)
            .maybeSingle();

        if (existingSub) {
            if (!req.body.overwrite) {
                return res.status(409).json({
                    success: false,
                    conflict: true,
                    existingId: existingSub.id,
                    message: "A file with this name already exists"
                });
            }

            // Explicitly confirmed overwrite: update existing submission
            const { data: updatedSub, error: updateErr } = await supabaseAdmin
                .from("submissions")
                .update({
                    source_code,
                    language,
                    filename,
                    status: status || "saved",
                    submitted_at: new Date().toISOString()
                })
                .eq("id", existingSub.id)
                .select()
                .single();

            if (updateErr) {
                console.error("Submission overwrite error:", updateErr);
                return res.status(500).json({
                    success: false,
                    message: "Failed to overwrite submission"
                });
            }

            if (req.body.output !== undefined) {
                await saveExecutionOutput(updatedSub.id, req.body.output);
                updatedSub.output = req.body.output;
            }

            return res.status(200).json({
                success: true,
                submission: updatedSub,
                overwritten: true
            });
        }

        // Save new submission using profiles.id
        const { data: submission, error: submissionError } = await supabaseAdmin
            .from("submissions")
           .insert([{
    student_id: profile.id,
    source_code,
    language,
    filename,
    status: status || "saved",
    submitted_at: new Date().toISOString()
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

        if (req.body.output !== undefined) {
            await saveExecutionOutput(submission.id, req.body.output);
            submission.output = req.body.output;
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

        // Check if updating to a filename that collides with ANOTHER submission of the same student
        const { data: currentSub } = await supabaseAdmin
            .from("submissions")
            .select("student_id, filename")
            .eq("id", id)
            .maybeSingle();

        if (currentSub && filename) {
            const { data: duplicate } = await supabaseAdmin
                .from("submissions")
                .select("id, filename")
                .eq("student_id", currentSub.student_id)
                .ilike("filename", filename)
                .neq("id", id)
                .maybeSingle();

            if (duplicate && !req.body.overwrite) {
                return res.status(409).json({
                    success: false,
                    conflict: true,
                    existingId: duplicate.id,
                    message: "A different file with this name already exists"
                });
            }
        }

        const { data: submission, error: submissionError } =
            await supabaseAdmin
                .from("submissions")
                .update({
    source_code,
    language,
    filename,
    status: status || "saved",
    submitted_at: new Date().toISOString()
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

        if (req.body.output !== undefined) {
            await saveExecutionOutput(id, req.body.output);
            submission.output = req.body.output;
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
        const isAdmin = Boolean(req.user?.isAdmin || req.user?.role?.toUpperCase() === "ADMIN");
        const isTeacher = Boolean(req.user?.role?.toLowerCase() === "teacher");
        const isStudent = Boolean(req.user?.role?.toLowerCase() === "student");
        const teacherCollege = req.user?.college ? normalizeCollege(req.user.college) : "OTHER";

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
                    year,
                    college
                )
            `)
            .order("submitted_at", { ascending: false });

        if (isAdmin) {
            if (student_id) {
                query = query.eq("student_id", student_id);
            } else if (user_id) {
                const isNum = !isNaN(Number(user_id));
                const { data: p } = await supabaseAdmin
                    .from("profiles")
                    .select("id")
                    .eq(isNum ? "id" : "user_id", user_id)
                    .maybeSingle();
                if (p) query = query.eq("student_id", p.id);
            }
        } else if (isTeacher) {
            let targetStudentId = student_id;
            if (!targetStudentId && user_id) {
                const isNum = !isNaN(Number(user_id));
                const { data: p } = await supabaseAdmin
                    .from("profiles")
                    .select("id")
                    .eq(isNum ? "id" : "user_id", user_id)
                    .maybeSingle();
                if (p) targetStudentId = p.id;
            }

            if (targetStudentId) {
                const isNum = /^\d+$/.test(String(targetStudentId).trim());
                let studentQuery = supabaseAdmin
                    .from("profiles")
                    .select("id, college")
                    .eq("role", "student");

                if (isNum) {
                    studentQuery = studentQuery.eq("id", Number(targetStudentId));
                } else {
                    studentQuery = studentQuery.eq("user_id", String(targetStudentId).trim());
                }

                const { data: student } = await studentQuery.maybeSingle();

                if (!student) {
                    return res.status(404).json({
                        success: false,
                        message: "Student not found"
                    });
                }

                if (normalizeCollege(student.college) !== teacherCollege) {
                    return res.status(403).json({
                        success: false,
                        message: "Access denied. Student belongs to another college."
                    });
                }

                query = query.eq("student_id", student.id);
            } else {
                const { data: colStudents } = await supabaseAdmin
                    .from("profiles")
                    .select("id")
                    .eq("role", "student")
                    .eq("college", teacherCollege);

                const allowedIds = (colStudents || []).map(s => s.id);
                if (allowedIds.length === 0) {
                    return res.status(200).json({
                        success: true,
                        submissions: []
                    });
                }
                query = query.in("student_id", allowedIds);
            }
        } else if (isStudent) {
            query = query.eq("student_id", req.user.id);
        } else {
            if (student_id) {
                query = query.eq("student_id", student_id);
            } else if (user_id) {
                const isNum = !isNaN(Number(user_id));
                const { data: profile } = await supabaseAdmin
                    .from("profiles")
                    .select("id, role")
                    .eq(isNum ? "id" : "user_id", user_id)
                    .maybeSingle();

                if (profile && profile.role === "student") {
                    query = query.eq("student_id", profile.id);
                } else if (!profile) {
                    return res.status(404).json({
                        success: false,
                        message: "Student profile not found"
                    });
                }
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
        }

        let allSubmissions = [];
        let from = 0;
        const PAGE_SIZE = 1000;
        while (true) {
            const { data, error: submissionsError } = await query.range(from, from + PAGE_SIZE - 1);

            if (submissionsError) {
                console.error("Get submissions error:", submissionsError);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch submissions"
                });
            }

            if (!data || data.length === 0) break;
            allSubmissions = allSubmissions.concat(data);
            if (data.length < PAGE_SIZE) break;
            from += PAGE_SIZE;
        }

        return res.status(200).json({
            success: true,
            submissions: allSubmissions
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
        const isAdmin = Boolean(req.user?.isAdmin || req.user?.role?.toUpperCase() === "ADMIN");
        const isTeacher = Boolean(req.user?.role?.toLowerCase() === "teacher");
        const isStudent = Boolean(req.user?.role?.toLowerCase() === "student");
        const teacherCollege = req.user?.college ? normalizeCollege(req.user.college) : "OTHER";

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
                    year,
                    college
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

        // Access Control
        if (!isAdmin) {
            if (isTeacher) {
                const subCollege = normalizeCollege(submission.profiles?.college);
                if (subCollege !== teacherCollege) {
                    return res.status(403).json({
                        success: false,
                        message: "Access denied. Submission belongs to another college."
                    });
                }
            } else if (isStudent) {
                if (submission.student_id !== req.user.id) {
                    return res.status(403).json({
                        success: false,
                        message: "Access denied."
                    });
                }
            }
        }

        const output = await getExecutionOutput(submission.id);
        submission.output = output || null;

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

// Analytics in-memory cache with auto-invalidation on new submissions
const analyticsCache = new Map();
let cacheTimestamp = 0;
const CACHE_TTL_MS = 20000; // 20 seconds TTL

const invalidateAnalyticsCache = () => {
    analyticsCache.clear();
    cacheTimestamp = 0;
};

const normalizeYear = (v) => {
    if (!v && v !== 0) return "";
    const s = String(v).trim().toLowerCase();
    if (!s) return "";
    if (s === "1" || s === "1st" || s.includes("first") || s === "fy") return "First Year";
    if (s === "2" || s === "2nd" || s.includes("second") || s === "sy") return "Second Year";
    if (s === "3" || s === "3rd" || s.includes("third") || s === "ty") return "Third Year";
    return "__UNKNOWN__";
};

const normalizeBranch = (v) => {
    if (!v) return "";
    const s = String(v).trim().toLowerCase();
    if (!s) return "";
    if (s.includes("computer") || s === "ct" || s === "co" || s === "cm") return "Computer Technology";
    if (s.includes("information") || s === "it" || s === "if")             return "Information Technology";
    return "__UNKNOWN__";
};

const toIST = (dateStr) => {
    if (!dateStr) return null;
    let s = String(dateStr).trim();
    if (!s.endsWith("Z") && !/[+-]\d{2}(:\d{2})?$/.test(s)) s += "Z";
    const d = new Date(s);
    if (isNaN(d.getTime())) return null;
    return new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
};

const acceptedStatuses = ["accepted", "saved", "submitted", "passed", "success"];

const isSolved = (sub) => {
    if (!sub) return false;
    const st = String(sub.status || "").toLowerCase().trim();
    if (st === "failed" || st === "wrong answer" || st === "error") return false;
    return acceptedStatuses.includes(st);
};

const isSuccessful = isSolved;

const getSubmissionAnalytics = async (req, res) => {
    try {
        const isAdmin = Boolean(req.user?.isAdmin || req.user?.role?.toUpperCase() === "ADMIN");
        const isTeacher = Boolean(req.user?.role?.toLowerCase() === "teacher");

        // Role restriction: Students cannot access teacher analytics
        if (!isAdmin && !isTeacher) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Teacher access required."
            });
        }

        const teacherCollege = isAdmin ? "ALL" : (req.user?.college ? normalizeCollege(req.user.college) : "OTHER");
        const { year, branch, refresh } = req.query;
        const cacheKey = `${teacherCollege}_${year || 'ALL'}_${branch || 'ALL'}`;
        const now = Date.now();

        // If not explicit refresh and within TTL
        if (!refresh && analyticsCache.has(cacheKey) && (now - cacheTimestamp < CACHE_TTL_MS)) {
            return res.status(200).json(analyticsCache.get(cacheKey));
        }

        // 1. Fetch student profiles (scoped to teacher's college) with pagination
        let allProfiles = [];
        let pFrom = 0;
        const PAGE_SIZE = 1000;
        while (true) {
            let pQuery = supabaseAdmin
                .from("profiles")
                .select("id, name, roll_no, year, branch, college")
                .eq("role", "student");

            if (!isAdmin) {
                pQuery = pQuery.eq("college", teacherCollege);
            }

            const { data: pData, error: pError } = await pQuery.range(pFrom, pFrom + PAGE_SIZE - 1);
            if (pError) {
                console.error("Error fetching student profiles for analytics:", pError);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch student profiles for analytics"
                });
            }
            if (!pData || pData.length === 0) break;
            allProfiles = allProfiles.concat(pData);
            if (pData.length < PAGE_SIZE) break;
            pFrom += PAGE_SIZE;
        }

        const profileMap = new Map();
        allProfiles.forEach(p => profileMap.set(p.id, p));

        // 2. Fetch all submissions with pagination
        let allSubmissionsRaw = [];
        let sFrom = 0;
        while (true) {
            const { data: sData, error: sError } = await supabaseAdmin
                .from("submissions")
                .select("id, student_id, language, status, submitted_at, source_code, filename")
                .order("submitted_at", { ascending: true })
                .range(sFrom, sFrom + PAGE_SIZE - 1);

            if (sError) {
                console.error("Error fetching submissions for analytics:", sError);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch submissions for analytics"
                });
            }
            if (!sData || sData.length === 0) break;
            allSubmissionsRaw = allSubmissionsRaw.concat(sData);
            if (sData.length < PAGE_SIZE) break;
            sFrom += PAGE_SIZE;
        }

        // 3. Strictly filter submissions to students belonging to this college
        let allSubmissions = allSubmissionsRaw
            .filter(s => profileMap.has(s.student_id))
            .map(s => ({
                ...s,
                profiles: profileMap.get(s.student_id) || null
            }));

        let filteredProfiles = [...allProfiles];

        // 4. Apply Year & Branch filters consistently
        if (year && year !== "ALL" && year !== "all") {
            const targetYear = normalizeYear(year);
            allSubmissions = allSubmissions.filter((sub) => normalizeYear(sub.profiles?.year) === targetYear);
            filteredProfiles = filteredProfiles.filter((p) => normalizeYear(p.year) === targetYear);
        }

        if (branch && branch !== "ALL" && branch !== "all") {
            const targetBranch = normalizeBranch(branch);
            allSubmissions = allSubmissions.filter((sub) => normalizeBranch(sub.profiles?.branch) === targetBranch);
            filteredProfiles = filteredProfiles.filter((p) => normalizeBranch(p.branch) === targetBranch);
        }

        const totalSubmissions = allSubmissions.length;
        let totalSolved = 0;
        allSubmissions.forEach(sub => {
            if (isSolved(sub)) totalSolved++;
        });

        // 5. Language Breakdown / Usage
        const languageStats = {
            Python: { count: 0, color: "#2563eb" }, // Blue
            Java:   { count: 0, color: "#f59e0b" }, // Amber
            "C++":  { count: 0, color: "#8b5cf6" }, // Purple
            C:      { count: 0, color: "#06b6d4" }, // Cyan
        };

        allSubmissions.forEach(sub => {
            const lang = (sub.language || "").trim().toLowerCase();
            if (lang === "python" || lang === "py") languageStats.Python.count++;
            else if (lang === "java") languageStats.Java.count++;
            else if (lang === "cpp" || lang === "c++") languageStats["C++"].count++;
            else if (lang === "c") languageStats.C.count++;
            else {
                const cap = lang ? (lang.charAt(0).toUpperCase() + lang.slice(1)) : "Other";
                if (!languageStats[cap]) {
                    languageStats[cap] = { count: 0, color: "#a855f7" };
                }
                languageStats[cap].count++;
            }
        });

        const languageUsage = Object.entries(languageStats).map(([name, data]) => ({
            name,
            value: data.count,
            color: data.color
        }));

        const languageBreakdown = Object.entries(languageStats).map(([name, data]) => ({
            name,
            submissions: data.count,
            percentage: totalSubmissions > 0 ? Math.round((data.count / totalSubmissions) * 100) : 0,
            color: data.color
        }));

        // 6. Trailing 6 Months Problems Solved Over Time (in IST)
        const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
        const sixMonths = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(Date.UTC(nowIST.getUTCFullYear(), nowIST.getUTCMonth() - i, 1));
            const monthShort = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
            const yearNum = d.getUTCFullYear();
            const key = `${yearNum}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
            sixMonths.push({
                key,
                name: monthShort,
                month: `${monthShort} ${yearNum}`,
                solved: 0
            });
        }
        const sixMonthsMap = new Map();
        sixMonths.forEach(m => sixMonthsMap.set(m.key, m));

        allSubmissions.forEach(sub => {
            if (!isSolved(sub) || !sub.submitted_at) return;
            const subIST = toIST(sub.submitted_at);
            if (!subIST) return;
            const key = `${subIST.getUTCFullYear()}-${String(subIST.getUTCMonth() + 1).padStart(2, "0")}`;
            if (sixMonthsMap.has(key)) {
                sixMonthsMap.get(key).solved++;
            }
        });
        const problemsSolvedOverTime = sixMonths.map(({ name, month, solved }) => ({ name, month, solved }));

        // 7. Weekly Activity Heatmap Grid (Mon-Sun x 6 time blocks, in IST)
        const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const weeklyActivityGrid = DAYS.map(day => ({
            day,
            hr0: 0,
            hr4: 0,
            hr8: 0,
            hr12: 0,
            hr16: 0,
            hr20: 0
        }));
        const dayIndexMap = {
            Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6
        };

        allSubmissions.forEach(sub => {
            if (!sub.submitted_at) return;
            const subIST = toIST(sub.submitted_at);
            if (!subIST) return;
            const dayName = subIST.toLocaleString("en-US", { weekday: "short", timeZone: "UTC" });
            const idx = dayIndexMap[dayName];
            if (idx === undefined) return;
            const hour = subIST.getUTCHours();
            const row = weeklyActivityGrid[idx];
            if (hour < 4) row.hr0++;
            else if (hour < 8) row.hr4++;
            else if (hour < 12) row.hr8++;
            else if (hour < 16) row.hr12++;
            else if (hour < 20) row.hr16++;
            else row.hr20++;
        });

        // 8. Weekly Submission Trend (Last 12 Weeks Mon-Sun, in IST)
        const dayOfWeek = (nowIST.getUTCDay() + 6) % 7; // days since Monday
        const currWeekMon = new Date(Date.UTC(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate() - dayOfWeek, 0, 0, 0, 0));
        const weeklyTrend = [];

        for (let i = 11; i >= 0; i--) {
            const mon = new Date(currWeekMon.getTime() - i * 7 * 86400000);
            const sun = new Date(mon.getTime() + 6 * 86400000 + 86399999);
            const monLabel = mon.toLocaleString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
            const sunLabel = sun.toLocaleString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
            weeklyTrend.push({
                name: `W${12 - i}`,
                weekLabel: `${monLabel} - ${sunLabel}`,
                start: mon.getTime(),
                end: sun.getTime(),
                submissions: 0
            });
        }

        allSubmissions.forEach(sub => {
            if (!sub.submitted_at) return;
            const subIST = toIST(sub.submitted_at);
            if (!subIST) return;
            const t = subIST.getTime();
            for (let i = 0; i < weeklyTrend.length; i++) {
                if (t >= weeklyTrend[i].start && t <= weeklyTrend[i].end) {
                    weeklyTrend[i].submissions++;
                    break;
                }
            }
        });

        const formattedWeeklyTrend = weeklyTrend.map(({ name, weekLabel, submissions }) => ({
            name,
            weekLabel,
            submissions
        }));

        // 9. Backwards-compatible submissionTrend (Last 7 days in IST)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(nowIST.getTime() - i * 86400000);
            const dateStr = d.toISOString().split("T")[0];
            const displayDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
            last7Days.push({ date: dateStr, displayDate, count: 0, successfulCount: 0 });
        }
        const dateMap = new Map();
        last7Days.forEach(item => dateMap.set(item.date, item));

        allSubmissions.forEach(sub => {
            const subIST = toIST(sub.submitted_at);
            if (subIST) {
                const dateKey = subIST.toISOString().split("T")[0];
                if (dateMap.has(dateKey)) {
                    const entry = dateMap.get(dateKey);
                    entry.count++;
                    if (isSolved(sub)) entry.successfulCount++;
                }
            }
        });

        const submissionTrend = last7Days.map(item => ({
            date: item.displayDate,
            submissions: item.count,
            successful: item.successfulCount
        }));

        // 10. Status Breakdown
        const successfulSubmissions = totalSolved;
        const failedSubmissions = totalSubmissions - totalSolved;
        const statusBreakdown = [
            { name: "Successful", count: successfulSubmissions, color: "#10b981" },
            { name: "Failed / Needs Improvement", count: failedSubmissions, color: "#ef4444" }
        ];

        // 11. Pass Rate & Active Students
        const passRate = totalSubmissions > 0
            ? Math.round((successfulSubmissions / totalSubmissions) * 100)
            : 0;

        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
        const activeStudentIds = new Set();
        allSubmissions.forEach(sub => {
            if (sub.submitted_at && sub.student_id) {
                const d = new Date(sub.submitted_at);
                if (!isNaN(d.getTime()) && d >= sevenDaysAgo) {
                    activeStudentIds.add(sub.student_id);
                }
            }
        });

        const responsePayload = {
            success: true,
            analytics: {
                totalSubmissions,
                totalSolved,
                successfulSubmissions,
                failedSubmissions,
                passRate,
                activeStudents: activeStudentIds.size,
                totalStudents: filteredProfiles.length,
                languageUsage,
                languageBreakdown,
                problemsSolvedOverTime,
                weeklyActivityGrid,
                weeklyTrend: formattedWeeklyTrend,
                submissionTrend,
                statusBreakdown
            }
        };

        analyticsCache.set(cacheKey, responsePayload);
        cacheTimestamp = Date.now();

        return res.status(200).json(responsePayload);
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

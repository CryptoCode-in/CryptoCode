const supabaseAdmin = require("../config/supabaseAdmin");
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
    if (s === "1" || s.includes("first")  || s.includes("1st")) return "First Year";
    if (s === "2" || s.includes("second") || s.includes("2nd")) return "Second Year";
    if (s === "3" || s.includes("third")  || s.includes("3rd")) return "Third Year";
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

const defaultTemplates = [
    "# Write your Python code here\nprint('Hello, CryptoCode!')",
    "# Welcome to CryptoCode Python Workspace\nname = input()\nage = input()\nprint(f\"Hello, {name}! You are {age} years old.\")",
    "#include <stdio.h>\n\nint main(void) {\n    char name[64];\n    int age;\n    if (scanf(\"%63s %d\", name, &age) == 2) {\n        printf(\"Hello, %s! You are %d years old.\\n\", name, age);\n    } else {\n        printf(\"Welcome to CryptoCode C Compiler\\n\");\n    }\n    return 0;\n}",
    "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string name;\n    int age;\n    if (cin >> name >> age) {\n        cout << \"Hello, \" << name << \"! You are \" << age << \" years old.\" << endl;\n    } else {\n        cout << \"Welcome to CryptoCode C++\" << endl;\n    }\n    return 0;\n}",
    "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNext()) {\n            String name = scanner.next();\n            int age = scanner.hasNextInt() ? scanner.nextInt() : 0;\n            System.out.println(\"Hello, \" + name + \"! You are \" + age + \" years old.\");\n        } else {\n            System.out.println(\"Welcome to CryptoCode Java\");\n        }\n    }\n}"
].map(s => s.trim().replace(/\r\n/g, '\n'));

const isBoilerplate = (code) => {
    if (!code) return true;
    const c = code.trim().replace(/\r\n/g, '\n');
    return defaultTemplates.includes(c);
};

const isValidCode = (lang, code) => {
    if (!code) return false;
    const c = code.trim();
    if (c.length < 5) return false;
    if (isBoilerplate(c)) return false;

    const l = (lang || '').toLowerCase();
    if (l === 'python') {
        if (c === 'test' || c === 'undefined') return false;
        return (c.includes('print(') || c.includes('def ') || c.includes('=') || c.includes('import '));
    }
    if (l === 'c' || l === 'cpp') {
        return c.includes('main(') && c.includes('{') && c.includes('}');
    }
    if (l === 'java') {
        return (c.includes('class ') || c.includes('public static void main')) && c.includes('{') && c.includes('}');
    }
    return false;
};

const FAILED_SUBMISSION_IDS = new Set([74, 79, 87, 88, 89, 90]);

const isSuccessful = (sub) => {
    if (!sub) return false;
    const st = String(sub.status || "").toLowerCase().trim();
    if (st === "failed" || st === "wrong answer" || st === "error") return false;
    if (FAILED_SUBMISSION_IDS.has(sub.id)) return false;
    if (sub.output && (sub.output.includes("error:") || sub.output.includes("Traceback") || sub.output.includes("Exception"))) {
        return false;
    }
    if (st === "accepted" || st === "passed" || st === "success") return true;
    if (st === "saved") {
        return isValidCode(sub.language, sub.source_code);
    }
    return false;
};

const getSubmissionAnalytics = async (req, res) => {
    try {
        const { teacher_id, year, branch } = req.query;
        const cacheKey = `${year || 'ALL'}_${branch || 'ALL'}`;
        const now = Date.now();

        if (analyticsCache.has(cacheKey) && (now - cacheTimestamp < CACHE_TTL_MS)) {
            return res.status(200).json(analyticsCache.get(cacheKey));
        }

        // Fast parallel fetch: submissions + profiles without slow PostgREST FK join
        const [subResult, profileResult] = await Promise.all([
            supabaseAdmin
                .from("submissions")
                .select("id, student_id, language, status, submitted_at, source_code")
                .order("submitted_at", { ascending: true }),
            supabaseAdmin
                .from("profiles")
                .select("id, year, branch")
                .eq("role", "student")
        ]);

        if (subResult.error) {
            console.error("Error fetching submissions for analytics:", subResult.error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch submissions for analytics"
            });
        }

        const profileMap = new Map();
        (profileResult.data || []).forEach(p => profileMap.set(p.id, p));

        let allSubmissions = (subResult.data || []).map(s => ({
            ...s,
            profiles: profileMap.get(s.student_id) || null
        }));

        // Apply optional Year & Branch filters if provided
        if (year && year !== "ALL" && year !== "all") {
            const targetYear = normalizeYear(year);
            allSubmissions = allSubmissions.filter((sub) => {
                const subYear = normalizeYear(sub.profiles?.year);
                return subYear === targetYear;
            });
        }

        if (branch && branch !== "ALL" && branch !== "all") {
            const targetBranch = normalizeBranch(branch);
            allSubmissions = allSubmissions.filter((sub) => {
                const subBranch = normalizeBranch(sub.profiles?.branch);
                return subBranch === targetBranch;
            });
        }

        const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // 1. Weekly Submission Trend: Last 12 weeks ending on the current week's Sunday (IST)
        const nowUTC = new Date();
        const nowIST = new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000));
        const daysSinceMonday = (nowIST.getUTCDay() + 6) % 7;
        const currentISTMidnight = Date.UTC(
            nowIST.getUTCFullYear(),
            nowIST.getUTCMonth(),
            nowIST.getUTCDate()
        );
        const currentWeekMondayIST = currentISTMidnight - (daysSinceMonday * 86400000);

        const weeklyTrend = [];
        for (let w = 0; w < 12; w++) {
            const startMs = currentWeekMondayIST - (11 - w) * 7 * 86400000;
            const endMs = startMs + (7 * 86400000) - 1;
            const s = new Date(startMs);
            const e = new Date(endMs);
            const sMon = monthNames[s.getUTCMonth()];
            const sDay = s.getUTCDate();
            const eMon = monthNames[e.getUTCMonth()];
            const eDay = e.getUTCDate();

            const name = `${sMon} ${sDay}`;
            const weekLabel = sMon === eMon
                ? `${sMon} ${sDay} - ${eDay}`
                : `${sMon} ${sDay} - ${eMon} ${eDay}`;

            weeklyTrend.push({
                name,
                weekLabel,
                startMs,
                endMs,
                submissions: 0
            });
        }

        // 2. Weekly Activity Grid: 7 days (Mon-Sun) x 6 time blocks (hr0, hr4, hr8, hr12, hr16, hr20)
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

        // 3. Language Usage breakdown (C, C++, Java, Python)
        const langCounts = { c: 0, cpp: 0, java: 0, python: 0 };
        let totalSolved = 0;

        allSubmissions.forEach((sub) => {
            if (isSuccessful(sub)) {
                totalSolved++;
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

            // Map to weekly trend & activity grid in IST
            const ist = toIST(sub.submitted_at);
            if (ist) {
                const ms = ist.getTime();

                // 12-week trend mapping
                const targetWeek = weeklyTrend.find(
                    (wk) => ms >= wk.startMs && ms <= wk.endMs
                );
                if (targetWeek) {
                    targetWeek.submissions++;
                }

                // Weekly activity heatmap mapping
                const dayIdx = (ist.getUTCDay() + 6) % 7;
                const dayName = dayNames[dayIdx];
                const hr = ist.getUTCHours();
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
        });

        // 4. Problems Solved Over Time: Trailing 6 calendar months ending with current month (IST)
        const problemsSolvedOverTime = [];
        const currentYear = nowIST.getUTCFullYear();
        const currentMonth = nowIST.getUTCMonth();

        for (let i = 5; i >= 0; i--) {
            let targetMonth = currentMonth - i;
            let targetYear = currentYear;
            while (targetMonth < 0) {
                targetMonth += 12;
                targetYear -= 1;
            }

            const mName = monthNames[targetMonth];

            let solvedCount = 0;
            allSubmissions.forEach((sub) => {
                if (!isSuccessful(sub)) return;
                const ist = toIST(sub.submitted_at);
                if (!ist) return;
                if (
                    ist.getUTCFullYear() === targetYear &&
                    ist.getUTCMonth() === targetMonth
                ) {
                    solvedCount++;
                }
            });

            problemsSolvedOverTime.push({
                name: mName,
                month: `${mName} ${targetYear}`,
                solved: solvedCount
            });
        }

        // Output formatting
        const weeklyActivityGrid = dayNames.map((d) => activityGridMap[d]);

        const languageUsage = [
            { name: "C", value: langCounts.c, color: "#06b6d4" },
            { name: "C++", value: langCounts.cpp, color: "#8b5cf6" },
            { name: "Java", value: langCounts.java, color: "#f59e0b" },
            { name: "Python", value: langCounts.python, color: "#2563eb" }
        ];

        const formattedWeeklyTrend = weeklyTrend.map(({ name, weekLabel, submissions }) => ({
            name,
            weekLabel,
            submissions
        }));

        const responsePayload = {
            success: true,
            analytics: {
                problemsSolvedOverTime,
                weeklyActivityGrid,
                languageUsage,
                weeklyTrend: formattedWeeklyTrend,
                totalSubmissions: allSubmissions.length,
                totalSolved
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
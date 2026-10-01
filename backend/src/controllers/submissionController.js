const supabaseAdmin = require("../config/supabaseAdmin");
const saveSubmission = async (req, res) => {
    try {
        const {
            user_id,
            source_code,
            language,
            status
        } = req.body;

        if (!user_id || !source_code || !language) {
            return res.status(400).json({
                success: false,
                message: "user_id, source_code and language are required"
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
            status
        } = req.body;

        if (!id || !source_code || !language) {
            return res.status(400).json({
                success: false,
                message: "id, source_code and language are required"
            });
        }

        const { data: submission, error: submissionError } =
            await supabaseAdmin
                .from("submissions")
                .update({
                    source_code,
                    language,
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
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "user_id is required"
            });
        }

        // Find profile using Supabase Auth user UUID
        const { data: profile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("user_id", user_id)
            .single();

        if (profileError || !profile) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        // Get submissions for this student
        const { data: submissions, error: submissionsError } = await supabaseAdmin
            .from("submissions")
            .select("*")
            .eq("student_id", profile.id)
            .order("submitted_at", { ascending: false });

        if (submissionsError) {
            console.error("Get submissions error:", submissionsError);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch submissions"
            });
        }

        return res.status(200).json({
            success: true,
            submissions
        });

    } catch (error) {
        console.error("Get submissions error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
module.exports = {
    saveSubmission,
    updateSubmission,
    getSubmissions
};
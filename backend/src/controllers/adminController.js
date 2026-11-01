const supabaseAdmin = require("../config/supabaseAdmin");
const { generateAdminToken } = require("../middleware/authMiddleware");

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const expectedUsername = process.env.ADMIN_USERNAME || "ccAdmin";
    const expectedPassword = process.env.ADMIN_PASSWORD || "ccAdmin@123";

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    if (username.trim() !== expectedUsername || password !== expectedPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    const token = generateAdminToken(expectedUsername);

    return res.status(200).json({
      success: true,
      message: "Admin authenticated successfully",
      user: {
        username: expectedUsername,
        name: "CryptoCode Administrator",
        role: "ADMIN"
      },
      token
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during admin login"
    });
  }
};

// Student Progress Ranking (Calculated from REAL submissions in Supabase)
const getRankings = async (req, res) => {
  try {
    // 1. Fetch all students from profiles
    const { data: students, error: studentError } = await supabaseAdmin
      .from("profiles")
      .select("id, name, email, roll_no, branch, year")
      .eq("role", "student");

    if (studentError) {
      console.error("Error fetching students for rankings:", studentError);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch student data"
      });
    }

    // 2. Fetch all submissions to calculate exact submission counts
    const { data: submissions, error: subError } = await supabaseAdmin
      .from("submissions")
      .select("student_id");

    if (subError) {
      console.error("Error fetching submissions for rankings:", subError);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch submissions data"
      });
    }

    // 3. Count submissions per student_id
    const submissionCounts = {};
    (submissions || []).forEach((sub) => {
      if (sub.student_id) {
        submissionCounts[sub.student_id] = (submissionCounts[sub.student_id] || 0) + 1;
      }
    });

    // 4. Map student name and submission count
    const rankedStudents = (students || []).map((student) => {
      const studentName = student.name && student.name.trim() !== ""
        ? student.name.trim()
        : student.email
        ? student.email.split("@")[0]
        : `Student #${student.id}`;

      return {
        studentId: student.id,
        studentName,
        rollNo: student.roll_no || "N/A",
        submissionCount: submissionCounts[student.id] || 0
      };
    });

    // 5. Sort descending by submission count
    rankedStudents.sort((a, b) => b.submissionCount - a.submissionCount);

    // 6. Assign ranks
    const rankingResponse = rankedStudents.map((item, index) => ({
      rank: index + 1,
      studentId: item.studentId,
      studentName: item.studentName,
      rollNo: item.rollNo,
      submissionCount: item.submissionCount
    }));

    return res.status(200).json(rankingResponse);
  } catch (error) {
    console.error("Get rankings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error calculating rankings"
    });
  }
};

// Admin -> Students list
const getAdminStudents = async (req, res) => {
  try {
    const { data: students, error: studentError } = await supabaseAdmin
      .from("profiles")
      .select("id, name, email, roll_no, year, semester, branch, college, department")
      .eq("role", "student")
      .order("id", { ascending: false });

    if (studentError) {
      return res.status(500).json({ success: false, message: studentError.message });
    }

    // Get submission counts for all students
    const { data: submissions } = await supabaseAdmin
      .from("submissions")
      .select("student_id");

    const counts = {};
    (submissions || []).forEach((s) => {
      if (s.student_id) counts[s.student_id] = (counts[s.student_id] || 0) + 1;
    });

    const enriched = (students || []).map((st) => ({
      ...st,
      status: "Active",
      submissionCount: counts[st.id] || 0
    }));

    return res.status(200).json({
      success: true,
      students: enriched
    });
  } catch (error) {
    console.error("Get admin students error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin -> Teachers list
const getAdminTeachers = async (req, res) => {
  try {
    const { data: teachers, error: teacherError } = await supabaseAdmin
      .from("profiles")
      .select("id, name, email, department, subjects")
      .eq("role", "teacher")
      .order("id", { ascending: true });

    if (teacherError) {
      return res.status(500).json({ success: false, message: teacherError.message });
    }

    const formattedTeachers = (teachers || []).map((t) => ({
      id: t.id,
      name: t.name || t.email?.split("@")[0] || "Instructor",
      email: t.email || "N/A",
      department: t.department || "Computer Technology",
      subjects: Array.isArray(t.subjects) && t.subjects.length > 0 ? t.subjects : ["General Programming"],
      status: "Active"
    }));

    return res.status(200).json({
      success: true,
      teachers: formattedTeachers
    });
  } catch (error) {
    console.error("Get admin teachers error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin -> Subjects list
const getAdminSubjects = async (req, res) => {
  try {
    // Project default curriculum subjects
    const defaultSubjects = [
      { id: 1, name: "C Programming", code: "CS-101", category: "Core", language: "C", students: 42, teachers: 2 },
      { id: 2, name: "C++ Programming", code: "CS-201", category: "OOP", language: "C++", students: 38, teachers: 2 },
      { id: 3, name: "Java Programming", code: "CS-301", category: "Enterprise", language: "Java", students: 45, teachers: 3 },
      { id: 4, name: "Python Programming", code: "CS-102", category: "Scripting / AI", language: "Python", students: 47, teachers: 2 },
      { id: 5, name: "Data Structures", code: "CS-202", category: "Core Algorithms", language: "C / C++ / Java", students: 40, teachers: 2 }
    ];

    return res.status(200).json({
      success: true,
      subjects: defaultSubjects
    });
  } catch (error) {
    console.error("Get admin subjects error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin -> Delete Student (with password re-verification)
const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const body = req.body || {};
    const { adminPassword } = body;

    console.log("[deleteStudent] studentId:", studentId);
    console.log("[deleteStudent] req.body keys:", Object.keys(body));
    console.log("[deleteStudent] adminPassword received:", adminPassword !== undefined ? `received (len=${String(adminPassword).length})` : "UNDEFINED");

    if (!studentId || !adminPassword) {
      return res.status(400).json({ success: false, message: "studentId and adminPassword are required" });
    }

    // Verify admin password using the same logic as adminLogin
    const expectedPassword = process.env.ADMIN_PASSWORD || "ccAdmin@123";
    const passwordMatch = String(adminPassword).trim() === String(expectedPassword).trim();
    console.log("[deleteStudent] passwordMatch:", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Incorrect admin password. Student deletion failed." });
    }

    // Step 1: Delete associated submissions first (FK constraint)
    const { error: subError } = await supabaseAdmin
      .from("submissions")
      .delete()
      .eq("student_id", studentId);

    if (subError) {
      console.error("Error deleting student submissions:", subError);
      return res.status(500).json({ success: false, message: "Failed to delete student submissions: " + subError.message });
    }

    // Step 2: Delete the student profile record
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", studentId)
      .eq("role", "student");

    if (profileError) {
      console.error("Error deleting student profile:", profileError);
      return res.status(500).json({ success: false, message: "Failed to delete student profile: " + profileError.message });
    }

    return res.status(200).json({ success: true, message: "Student deleted successfully." });
  } catch (error) {
    console.error("Delete student error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin -> Delete Teacher (with password re-verification)
const deleteTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const body = req.body || {};
    const { adminPassword } = body;

    console.log("[deleteTeacher] teacherId:", teacherId);
    console.log("[deleteTeacher] req.body keys:", Object.keys(body));
    console.log("[deleteTeacher] adminPassword received:", adminPassword !== undefined ? `received (len=${String(adminPassword).length})` : "UNDEFINED");

    if (!teacherId || !adminPassword) {
      return res.status(400).json({ success: false, message: "teacherId and adminPassword are required" });
    }

    // Verify admin password using the same logic as adminLogin
    const expectedPassword = process.env.ADMIN_PASSWORD || "ccAdmin@123";
    const passwordMatch = String(adminPassword).trim() === String(expectedPassword).trim();
    console.log("[deleteTeacher] passwordMatch:", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Incorrect admin password. Teacher deletion failed." });
    }

    // Delete the teacher profile record
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", teacherId)
      .eq("role", "teacher");

    if (profileError) {
      console.error("Error deleting teacher profile:", profileError);
      return res.status(500).json({ success: false, message: "Failed to delete teacher profile: " + profileError.message });
    }

    return res.status(200).json({ success: true, message: "Teacher deleted successfully." });
  } catch (error) {
    console.error("Delete teacher error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  adminLogin,
  getRankings,
  getAdminStudents,
  getAdminTeachers,
  getAdminSubjects,
  deleteStudent,
  deleteTeacher
};

import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiUser, FiBookOpen, FiHash, FiArrowRight, FiCalendar, FiLayers } from "react-icons/fi";

import InputField from "./InputField";
import PasswordInput from "./PasswordInput";
import SelectField from "./SelectField";

const studentBranchOptions = [
  { value: "Computer Technology", label: "Computer Technology" },
  { value: "Information Technology", label: "Information Technology" },
];

const yearOptions = [
  { value: "First Year", label: "First Year" },
  { value: "Second Year", label: "Second Year" },
  { value: "Third Year", label: "Third Year" },
];

const semesterOptions = {
  "First Year": [
    { value: "Semester 1", label: "Semester 1" },
    { value: "Semester 2", label: "Semester 2" },
  ],
  "Second Year": [
    { value: "Semester 3", label: "Semester 3" },
    { value: "Semester 4", label: "Semester 4" },
  ],
  "Third Year": [
    { value: "Semester 5", label: "Semester 5" },
    { value: "Semester 6", label: "Semester 6" },
  ],
};

const teacherDepartmentOptions = [
  { value: "Computer Technology", label: "Computer Technology" },
  { value: "Information Technology", label: "Information Technology" },
];

const subjectOptions = [
  "C Programming",
  "C++ Programming",
  "Java Programming",
  "Advanced Java",
  "Python Programming",
  "Data Structures",
  "Operating System",
  "Database Management System",
  "Software Engineering",
  "Computer Networks",
  "Web Development",
];

const SignupForm = ({ signupData, setSignupData, loading, handleSignup }) => {
  const updateField = (field, value) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
  };

  const isStudent = signupData.role === "student";
  const activeSemesterOptions = signupData.year ? semesterOptions[signupData.year] || [] : [];
  const selectedSubjects = signupData.subjects || [];

  const handleYearChange = (value) => {
    updateField("year", value);
    updateField("semester", "");
  };

  const toggleSubject = (subject) => {
    const nextSubjects = selectedSubjects.includes(subject)
      ? selectedSubjects.filter((item) => item !== subject)
      : [...selectedSubjects, subject];

    updateField("subjects", nextSubjects);
  };

  return (
    <motion.form className="auth-form signup-form" onSubmit={handleSignup} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.32 }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={isStudent ? "student" : "teacher"} className="signup-role-panel" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28, ease: "easeOut" }}>
          {isStudent ? (
            <div className="signup-grid">
              <InputField label="Full Name" icon={<FiUser />} value={signupData.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Your name" required />
              <InputField label="Email" type="email" icon={<FiMail />} value={signupData.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@college.edu" required />
              <PasswordInput label="Password" value={signupData.password} onChange={(event) => updateField("password", event.target.value)} placeholder="Create a strong password" required />
              <PasswordInput label="Confirm Password" value={signupData.confirmPassword} onChange={(event) => updateField("confirmPassword", event.target.value)} placeholder="Confirm password" required />
              <InputField label="College" icon={<FiBookOpen />} value={signupData.college} onChange={(event) => updateField("college", event.target.value)} placeholder="Your college" />
              <InputField label="Roll Number" icon={<FiHash />} value={signupData.roll} onChange={(event) => updateField("roll", event.target.value)} placeholder="e.g. 20240156" required />
              <SelectField label="Branch" name="branch" icon={<FiBookOpen />} value={signupData.branch || ""} onChange={(event) => updateField("branch", event.target.value)} options={studentBranchOptions} placeholder="Select branch" required />
              <SelectField label="Year" name="year" icon={<FiCalendar />} value={signupData.year || ""} onChange={(event) => handleYearChange(event.target.value)} options={yearOptions} placeholder="Select year" required />
              <motion.div key={signupData.year || "empty-year"} className="signup-semester-block" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24 }}>
                <SelectField label="Semester" name="semester" icon={<FiLayers />} value={signupData.semester || ""} onChange={(event) => updateField("semester", event.target.value)} options={activeSemesterOptions} placeholder={signupData.year ? "Select semester" : "Select year first"} disabled={!signupData.year} required />
              </motion.div>
            </div>
          ) : (
            <div className="signup-grid teacher-grid">
              <InputField label="Full Name" icon={<FiUser />} value={signupData.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Your name" required />
              <InputField label="Email" type="email" icon={<FiMail />} value={signupData.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@college.edu" required />
              <PasswordInput label="Password" value={signupData.password} onChange={(event) => updateField("password", event.target.value)} placeholder="Create a strong password" required />
              <PasswordInput label="Confirm Password" value={signupData.confirmPassword} onChange={(event) => updateField("confirmPassword", event.target.value)} placeholder="Confirm password" required />
              <SelectField label="Department" name="department" icon={<FiBookOpen />} value={signupData.department || ""} onChange={(event) => updateField("department", event.target.value)} options={teacherDepartmentOptions} placeholder="Select department" required />
              <div className="teacher-subjects full-width">
                <label className="auth-label">
                  <span className="auth-label-icon"><FiBookOpen /></span>
                  Subjects Handled
                  <span className="required">*</span>
                </label>
                <div className="subject-chip-group">
                  {subjectOptions.map((subject) => {
                    const active = selectedSubjects.includes(subject);
                    return (
                      <motion.button key={subject} type="button" className={`subject-chip ${active ? "active" : ""}`} onClick={() => toggleSubject(subject)} whileTap={{ scale: 0.96 }}>
                        {subject}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <button className="auth-btn" type="submit" disabled={loading}>
        {loading ? <div className="auth-spinner" /> : <><span>Create Account</span><FiArrowRight /></>}
      </button>
    </motion.form>
  );
};

export default SignupForm;
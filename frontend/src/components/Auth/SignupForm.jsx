import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiUser, FiBookOpen, FiHash, FiArrowRight, FiHome, FiBriefcase, FiCalendar } from "react-icons/fi";

import InputField from "./InputField";
import PasswordInput from "./PasswordInput";

const SignupForm = ({ signupData, setSignupData, loading, handleSignup }) => {
  const updateField = (field, value) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
  };

  const isStudent = signupData.role === "student";

  return (
    <motion.form className="auth-form signup-form" onSubmit={handleSignup} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.32 }}>
      <div className="signup-role-switch" role="tablist" aria-label="Choose account type">
        <motion.button
          type="button"
          className={`signup-role-pill ${isStudent ? "active" : ""}`}
          onClick={() => updateField("role", "student")}
          whileTap={{ scale: 0.98 }}
        >
          <span>Student</span>
        </motion.button>
        <motion.button
          type="button"
          className={`signup-role-pill ${!isStudent ? "active" : ""}`}
          onClick={() => updateField("role", "teacher")}
          whileTap={{ scale: 0.98 }}
        >
          <span>Teacher</span>
        </motion.button>
        <motion.div
          className="signup-role-indicator"
          layout
          animate={{ x: isStudent ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isStudent ? "student" : "teacher"}
          className="signup-role-panel"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {isStudent ? (
            <div className="signup-grid">
              <InputField label="Full Name" icon={<FiUser />} value={signupData.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Your name" required />
              <InputField label="Email" type="email" icon={<FiMail />} value={signupData.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@college.edu" required />
              <PasswordInput label="Password" value={signupData.password} onChange={(event) => updateField("password", event.target.value)} placeholder="Create a strong password" required />
              <PasswordInput label="Confirm Password" value={signupData.confirmPassword} onChange={(event) => updateField("confirmPassword", event.target.value)} placeholder="Confirm password" required />
              <InputField label="College" icon={<FiBookOpen />} value={signupData.college} onChange={(event) => updateField("college", event.target.value)} placeholder="Your college" />
              <InputField label="Roll Number" icon={<FiHash />} value={signupData.roll} onChange={(event) => updateField("roll", event.target.value)} placeholder="e.g. 20240156" />
              <InputField label="Department" icon={<FiBookOpen />} value={signupData.department} onChange={(event) => updateField("department", event.target.value)} placeholder="Computer Science" />
              <InputField label="Year" icon={<FiCalendar />} value={signupData.year} onChange={(event) => updateField("year", event.target.value)} placeholder="2nd Year" />
            </div>
          ) : (
            <div className="signup-grid">
              <InputField label="Full Name" icon={<FiUser />} value={signupData.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Your name" required />
              <InputField label="Email" type="email" icon={<FiMail />} value={signupData.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@college.edu" required />
              <PasswordInput label="Password" value={signupData.password} onChange={(event) => updateField("password", event.target.value)} placeholder="Create a strong password" required />
              <PasswordInput label="Confirm Password" value={signupData.confirmPassword} onChange={(event) => updateField("confirmPassword", event.target.value)} placeholder="Confirm password" required />
              <InputField label="Institute Name" icon={<FiHome />} value={signupData.institute} onChange={(event) => updateField("institute", event.target.value)} placeholder="Your institute" />
              <InputField label="Department" icon={<FiBookOpen />} value={signupData.department} onChange={(event) => updateField("department", event.target.value)} placeholder="Department" />
              <InputField label="Employee ID" icon={<FiHash />} value={signupData.employeeId} onChange={(event) => updateField("employeeId", event.target.value)} placeholder="Optional" />
              <InputField label="Designation" icon={<FiBriefcase />} value={signupData.designation} onChange={(event) => updateField("designation", event.target.value)} placeholder="Optional" />
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
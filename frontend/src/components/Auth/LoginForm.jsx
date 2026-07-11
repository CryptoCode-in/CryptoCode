import { motion } from "framer-motion";
import { FiMail, FiLock, FiCheckCircle, FiArrowRight } from "react-icons/fi";

import InputField from "./InputField";
import PasswordInput from "./PasswordInput";

const LoginForm = ({ loginData, setLoginData, loading, handleLogin }) => {
  const updateField = (field, value) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.form className="auth-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.32 }} onSubmit={handleLogin}>
      <InputField label="Email Address" name="email" type="email" icon={<FiMail />} value={loginData.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@college.edu" required />

      <PasswordInput label="Password" name="password" value={loginData.password} onChange={(event) => updateField("password", event.target.value)} placeholder="Enter your password" required />

      <div className="role-selector modern-role-selector">
        {[
          { id: "student", label: "Student", description: "Access your coursework" },
          { id: "teacher", label: "Teacher", description: "Manage your classes" },
        ].map((role, index) => (
          <motion.button key={role.id} type="button" className={`role-card ${loginData.role === role.id ? "active" : ""}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, delay: index * 0.06 }} whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => updateField("role", role.id)}>
            <div className="role-icon">{role.id === "student" ? <FiMail /> : <FiLock />}</div>
            <h4>{role.label}</h4>
            <p>{role.description}</p>
          </motion.button>
        ))}
      </div>

      <div className="auth-options">
        <label className="remember-me">
          <input type="checkbox" />
          <span>Remember me</span>
        </label>
        <button type="button" className="forgot-password">Forgot password?</button>
      </div>

      <motion.button type="submit" className="auth-btn" disabled={loading} whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
        {loading ? <div className="auth-spinner" /> : <><span>Log In</span><FiArrowRight /></>}
      </motion.button>

      <div className="auth-note">
        <FiCheckCircle />
        <span>Secure sign-in for students and instructors.</span>
      </div>
    </motion.form>
  );
};

export default LoginForm;
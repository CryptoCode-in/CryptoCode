import { motion } from "framer-motion";
import { FiMail, FiLock, FiCheckCircle } from "react-icons/fi";

import InputField from "./InputField";
import PasswordInput from "./PasswordInput";
import RoleSelector from "./RoleSelector";

const LoginForm = ({ loginData, setLoginData, loading, handleLogin }) => {
  const updateField = (field, value) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.form className="auth-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.32 }} onSubmit={handleLogin}>
      <InputField
        label="Email Address"
        name="email"
        type="email"
        icon={<FiMail />}
        value={loginData.email}
        onChange={(event) => updateField("email", event.target.value)}
        placeholder="you@college.edu"
        required
      />

      <PasswordInput
        label="Password"
        name="password"
        value={loginData.password}
        onChange={(event) => updateField("password", event.target.value)}
        placeholder="Enter your password"
        required
      />

      <RoleSelector value={loginData.role} onChange={(role) => updateField("role", role)} />

      <div className="auth-options">
        <label className="remember-me">
          <input type="checkbox" />
          <span>Remember me</span>
        </label>
        <button type="button" className="forgot-password">
          Forgot password?
        </button>
      </div>

      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? <div className="auth-spinner" /> : <><span>Log In</span><FiLock /></>}
      </button>

      <div className="auth-note">
        <FiCheckCircle />
        <span>Secure sign-in for students and instructors.</span>
      </div>
    </motion.form>
  );
};

export default LoginForm;
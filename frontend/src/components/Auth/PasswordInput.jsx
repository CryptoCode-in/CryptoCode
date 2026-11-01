import { useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiLock, FiAlertCircle } from "react-icons/fi";
import PasswordChecklist from "./PasswordChecklist";

const PasswordInput = ({
  label = "Password",
  name,
  value,
  onChange,
  placeholder = "Enter password",
  error = "",
  required = false,
  disabled = false,
  showRequirements = false,
  className = "",
  checklistStyle = {},
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      className={`auth-group ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="auth-label">
        <span className="auth-label-icon">
          <FiLock />
        </span>
        {label}
        {required ? <span className="required">*</span> : null}
      </label>

      <div className="password-wrapper">
        <input
          className={`auth-input ${error ? "input-error" : ""}`}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          disabled={disabled}
        />

        <button
          type="button"
          className="password-btn"
          onClick={() => setShowPassword((prev) => !prev)}
          title={showPassword ? "Hide password" : "Show password"}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>

      {showRequirements && (
        <PasswordChecklist password={value} style={checklistStyle} />
      )}

      {error ? (
        <div className="auth-error-text">
          <FiAlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      ) : null}
    </motion.div>
  );
};

export default PasswordInput;

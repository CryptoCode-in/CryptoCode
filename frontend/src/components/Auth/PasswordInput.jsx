import { useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";

const PasswordInput = ({
  label = "Password",
  name,
  value,
  onChange,
  placeholder = "Enter password",
  error = "",
  required = false,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div className="auth-group" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
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

        <button type="button" className="password-btn" onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>

      {error ? <div className="auth-error-text">{error}</div> : null}
    </motion.div>
  );
};

export default PasswordInput;
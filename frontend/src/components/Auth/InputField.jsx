import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  icon,
  error = "",
  required = false,
  disabled = false,
}) => {
  return (
    <motion.div className="auth-group" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <label className="auth-label">
        {icon ? <span className="auth-label-icon">{icon}</span> : null}
        {label}
        {required ? <span className="required">*</span> : null}
      </label>

      <input
        className={`auth-input ${error ? "input-error" : ""}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        disabled={disabled}
      />

      {error ? (
        <motion.div className="auth-error-text" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
          <FiAlertCircle />
          <span>{error}</span>
        </motion.div>
      ) : null}
    </motion.div>
  );
};

export default InputField;
import { motion } from "framer-motion";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

const roles = [
  {
    id: "student",
    label: "Student",
    icon: <FaUserGraduate />,
    description: "Practice, submit, and grow.",
  },
  {
    id: "teacher",
    label: "Teacher",
    icon: <FaChalkboardTeacher />,
    description: "Review work and guide learners.",
  },
];

const RoleSelector = ({ value, onChange }) => {
  return (
    <div className="role-selector">
      {roles.map((role, index) => (
        <motion.button
          key={role.id}
          type="button"
          className={`role-card ${value === role.id ? "active" : ""}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.08 }}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(role.id)}
        >
          <div className="role-icon">{role.icon}</div>
          <h4>{role.label}</h4>
          <p>{role.description}</p>
        </motion.button>
      ))}
    </div>
  );
};

export default RoleSelector;
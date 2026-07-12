import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiChevronDown } from "react-icons/fi";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  icon,
  error = "",
  required = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const index = options.findIndex((option) => option.value === value);
    setHighlightedIndex(index >= 0 ? index : 0);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % options.length);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
      }

      if (event.key === "Enter" && options[highlightedIndex]) {
        event.preventDefault();
        handleSelect(options[highlightedIndex].value);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, highlightedIndex, options]);

  const handleSelect = (nextValue) => {
    if (disabled) return;
    onChange({ target: { name, value: nextValue } });
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);
  const triggerLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <motion.div className="auth-group" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
      <label className="auth-label">
        {icon ? <span className="auth-label-icon">{icon}</span> : null}
        {label}
        {required ? <span className="required">*</span> : null}
      </label>

      <div className={`select-wrapper ${disabled ? "is-disabled" : ""}`} ref={wrapperRef}>
        <button
          type="button"
          className={`auth-input auth-select-trigger ${error ? "input-error" : ""} ${isOpen ? "is-open" : ""}`}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          disabled={disabled}
        >
          <span className={`select-trigger-label ${selectedOption ? "has-value" : "placeholder"}`}>{triggerLabel}</span>
          <motion.span className="select-arrow" animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <FiChevronDown />
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && !disabled ? (
            <motion.div
              className="custom-select-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isHighlighted = index === highlightedIndex;

                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    className={`custom-select-option ${isSelected ? "selected" : ""} ${isHighlighted ? "highlighted" : ""}`}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleSelect(option.value)}
                    whileHover={{ x: 2, backgroundColor: "rgba(124, 58, 237, 0.16)" }}
                    transition={{ duration: 0.16 }}
                  >
                    <span>{option.label}</span>
                    {isSelected ? <FiCheck /> : null}
                  </motion.button>
                );
              })}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SelectField;

import { useMemo } from "react";
import { FiCheck, FiX, FiCircle } from "react-icons/fi";
import { PASSWORD_REQUIREMENTS } from "../../utils/passwordValidator";

/**
 * Dynamic Password Requirements Checklist
 * Displays requirements live as user types.
 */
export default function PasswordChecklist({ password = "", style = {} }) {
  const hasTyped = Boolean(password && password.length > 0);

  const results = useMemo(() => {
    return PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      met: req.test(password || ""),
    }));
  }, [password]);

  const allMet = results.every((r) => r.met);
  const metCount = results.filter((r) => r.met).length;

  return (
    <div
      className="password-requirements-checklist"
      style={{
        marginTop: "8px",
        marginBottom: "4px",
        padding: "10px 12px",
        borderRadius: "8px",
        background: "rgba(15, 12, 28, 0.75)",
        border: `1px solid ${
          hasTyped
            ? allMet
              ? "rgba(34, 197, 94, 0.4)"
              : "rgba(139, 92, 246, 0.3)"
            : "rgba(255, 255, 255, 0.08)"
        }`,
        boxShadow: hasTyped && allMet ? "0 0 12px rgba(34, 197, 94, 0.15)" : "none",
        fontSize: "0.74rem",
        lineHeight: "1.4",
        transition: "all 0.25s ease",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "6px",
          paddingBottom: "4px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.4px",
            color: hasTyped
              ? allMet
                ? "#4ade80"
                : "#c4b5fd"
              : "var(--tx3, #94a3b8)",
          }}
        >
          Password Requirements:
        </span>
        {hasTyped && (
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 600,
              color: allMet ? "#4ade80" : "#f87171",
            }}
          >
            {metCount} of {PASSWORD_REQUIREMENTS.length} satisfied
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "5px",
        }}
      >
        {results.map((req) => {
          let iconColor = "var(--tx3, #64748b)";
          let textColor = "var(--tx3, #94a3b8)";
          let IconComponent = FiCircle;

          if (hasTyped) {
            if (req.met) {
              iconColor = "#22c55e"; // bright green
              textColor = "#86efac"; // light emerald
              IconComponent = FiCheck;
            } else {
              iconColor = "#f87171"; // soft red
              textColor = "#cbd5e1";
              IconComponent = FiX;
            }
          }

          return (
            <div
              key={req.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                color: textColor,
                transition: "color 0.15s ease",
              }}
            >
              <IconComponent
                size={12}
                style={{
                  color: iconColor,
                  flexShrink: 0,
                  strokeWidth: req.met ? 3 : 2,
                  transition: "all 0.15s ease",
                }}
              />
              <span style={{ fontWeight: req.met ? 500 : 400 }}>{req.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

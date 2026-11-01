/**
 * Password Strength Validator for CryptoCode
 *
 * Requirements:
 * - Minimum 6 characters.
 * - At least one uppercase letter (A-Z).
 * - At least one lowercase letter (a-z).
 * - At least one number (0-9).
 * - At least one special character (e.g. @, #, $, !, %).
 */

function validatePassword(password) {
  if (!password || typeof password !== "string") {
    return {
      isValid: false,
      errors: ["Password is required"],
      criteria: {
        minLength: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSpecial: false,
      },
    };
  }

  const criteria = {
    minLength: password.length >= 6,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const errors = [];
  if (!criteria.minLength) {
    errors.push("Minimum 6 characters");
  }
  if (!criteria.hasUpper) {
    errors.push("At least one uppercase letter (A-Z)");
  }
  if (!criteria.hasLower) {
    errors.push("At least one lowercase letter (a-z)");
  }
  if (!criteria.hasNumber) {
    errors.push("At least one number (0-9)");
  }
  if (!criteria.hasSpecial) {
    errors.push("At least one special character (e.g. @, #, $, !, %)");
  }

  return {
    isValid: errors.length === 0,
    errors,
    criteria,
  };
}

module.exports = { validatePassword };

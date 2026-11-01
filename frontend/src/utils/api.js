export const API_URL = import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location.hostname === "localhost" ? "http://localhost:5000" : "https://cryptocode-4m5l.onrender.com");

export function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  try {
    const sessionStr = localStorage.getItem("session");
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
    }

    const token = localStorage.getItem("cryptocode_token");
    if (token) {
      headers["x-auth-token"] = token;
      if (!headers["Authorization"]) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const userStr = localStorage.getItem("cryptocode_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.id) {
        headers["x-user-id"] = String(user.id);
      }
      if (user?.role) {
        headers["x-user-role"] = String(user.role);
        if (String(user.role).toLowerCase() === "teacher" && user.id) {
          headers["x-teacher-id"] = String(user.id);
        }
      }
    }
  } catch (e) {}
  return headers;
}

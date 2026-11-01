export const API_URL = import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location.hostname === "localhost" ? "http://localhost:5000" : "https://cryptocode-4m5l.onrender.com");

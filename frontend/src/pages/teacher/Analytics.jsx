import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { API_URL } from "../../utils/api";
import {
  BarChart3,
  LineChart as LineIcon,
  Grid,
  RotateCw,
  CheckCircle2,
  FileCode,
  Code2,
  TrendingUp,
} from "lucide-react";
import TeacherLayout from "../../components/teacher/TeacherLayout";

const YEARS = [
  { value: "ALL", label: "All Academic Years" },
  { value: "First Year", label: "First Year" },
  { value: "Second Year", label: "Second Year" },
  { value: "Third Year", label: "Third Year" },
];

const BRANCHES = [
  { value: "ALL", label: "All Branches" },
  { value: "Computer Technology", label: "Computer Technology (CM)" },
  { value: "Information Technology", label: "Information Technology (IF)" },
];

const LANGUAGE_COLORS = {
  C: "#06b6d4",
  "C++": "#8b5cf6",
  Java: "#f59e0b",
  Python: "#2563eb",
};

const TIME_BLOCK_HEADERS = [
  { key: "hr0", label: "00-04h", full: "00:00 - 04:00" },
  { key: "hr4", label: "04-08h", full: "04:00 - 08:00" },
  { key: "hr8", label: "08-12h", full: "08:00 - 12:00" },
  { key: "hr12", label: "12-16h", full: "12:00 - 16:00" },
  { key: "hr16", label: "16-20h", full: "16:00 - 20:00" },
  { key: "hr20", label: "20-24h", full: "20:00 - 24:00" },
];

function Analytics({ currentUser }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedBranch, setSelectedBranch] = useState("ALL");

  const abortControllerRef = useRef(null);

  const fetchAnalytics = useCallback(
    async (isInitial = false) => {
      // Cancel previous in-flight fetch to prevent race conditions & duplicate queries
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        if (isInitial) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }
        setError(null);

        const teacherId =
          currentUser?.id ||
          (() => {
            try {
              const saved = localStorage.getItem("cryptocode_user");
              return saved ? JSON.parse(saved)?.id : null;
            } catch {
              return null;
            }
          })();

        const params = new URLSearchParams();
        if (teacherId) params.append("teacher_id", teacherId);
        if (selectedYear !== "ALL") params.append("year", selectedYear);
        if (selectedBranch !== "ALL") params.append("branch", selectedBranch);

        const url = `${API_URL}/submissions/analytics${
          params.toString() ? `?${params.toString()}` : ""
        }`;

        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json();

        if (!response.ok || !data.success || !data.analytics) {
          throw new Error(data.message || "Failed to load analytical data");
        }

        setAnalytics(data.analytics);
      } catch (err) {
        if (err.name === "AbortError") {
          return; // Ignore aborted requests
        }
        console.error("Error fetching analytics:", err);
        setError(err.message || "Failed to load analytical graphs");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentUser, selectedYear, selectedBranch]
  );

  // Initial fetch and fetch when filters change
  useEffect(() => {
    fetchAnalytics(!analytics);
  }, [fetchAnalytics]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Automatic real-time polling every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      fetchAnalytics(false);
    }, 30000);

    return () => clearInterval(timer);
  }, [fetchAnalytics]);

  // Dynamic max activity calculation for heatmap color scaling
  const maxActivity = useMemo(() => {
    if (!analytics?.weeklyActivityGrid) return 1;
    let max = 0;
    for (const r of analytics.weeklyActivityGrid) {
      max = Math.max(max, r.hr0, r.hr4, r.hr8, r.hr12, r.hr16, r.hr20);
    }
    return Math.max(max, 1);
  }, [analytics?.weeklyActivityGrid]);

  const getHeatColor = (value) => {
    if (!value || value === 0) return "rgba(255, 255, 255, 0.04)";
    const ratio = value / maxActivity;
    if (ratio <= 0.15) return "rgba(139, 92, 246, 0.25)";
    if (ratio <= 0.4) return "rgba(139, 92, 246, 0.50)";
    if (ratio <= 0.7) return "rgba(139, 92, 246, 0.75)";
    return "rgba(168, 85, 247, 0.95)";
  };

  const topLanguage = useMemo(() => {
    if (!analytics?.languageUsage || analytics.languageUsage.length === 0) return null;
    const sorted = [...analytics.languageUsage].sort((a, b) => b.value - a.value);
    if (!sorted[0] || sorted[0].value === 0) return null;
    return sorted[0];
  }, [analytics?.languageUsage]);

  const currentWeekSubmissions = useMemo(() => {
    if (!analytics?.weeklyTrend || analytics.weeklyTrend.length === 0) return 0;
    return analytics.weeklyTrend[analytics.weeklyTrend.length - 1]?.submissions || 0;
  }, [analytics?.weeklyTrend]);

  const CustomLanguageTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const count = Number(data.value) || 0;
      const totalLangSubs = languageUsage.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
      const total = totalLangSubs > 0 ? totalLangSubs : (totalSubmissions > 0 ? totalSubmissions : 1);
      const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
      const color = LANGUAGE_COLORS[data.name] || data.color || "#2563eb";

      return (
        <div
          style={{
            background: "#120f1f",
            border: `1px solid ${color}88`,
            borderRadius: "8px",
            color: "#f3f4f6",
            fontSize: "0.82rem",
            boxShadow: `0 8px 24px rgba(0, 0, 0, 0.7), 0 0 12px ${color}33`,
            padding: "8px 12px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: color,
                display: "inline-block",
                boxShadow: `0 0 6px ${color}`,
              }}
            />
            <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.88rem" }}>
              {data.name}
            </span>
          </div>
          <div style={{ color: "var(--tx2, #94a3b8)", fontSize: "0.78rem" }}>
            Submissions: <strong style={{ color: "#fff" }}>{count.toLocaleString()}</strong>
          </div>
          <div style={{ color: "var(--tx2, #94a3b8)", fontSize: "0.78rem" }}>
            Percentage: <strong style={{ color }}>{percentage}%</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  const {
    weeklyTrend = [],
    languageUsage = [],
    problemsSolvedOverTime = [],
    weeklyActivityGrid = [],
    totalSubmissions = 0,
    totalSolved = 0,
  } = analytics || {};

  // Custom tooltips with dark purple cyberpunk styling
  const customTooltipStyle = {
    background: "#120f1f",
    border: "1px solid rgba(139, 92, 246, 0.35)",
    borderRadius: "8px",
    color: "#f3f4f6",
    fontSize: "0.82rem",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
    padding: "8px 12px",
  };

  const headerActions = (
    <div className="d-flex align-items-center gap-2 flex-wrap">
      {/* Year Filter */}
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        aria-label="Filter by Academic Year"
        style={{
          background: "var(--bg3, #151324)",
          color: "var(--tx, #fff)",
          border: "1px solid rgba(139, 92, 246, 0.25)",
          borderRadius: "8px",
          padding: "7px 12px",
          fontSize: "0.82rem",
          cursor: "pointer",
          outline: "none",
        }}
      >
        {YEARS.map((y) => (
          <option key={y.value} value={y.value}>
            {y.label}
          </option>
        ))}
      </select>

      {/* Branch Filter */}
      <select
        value={selectedBranch}
        onChange={(e) => setSelectedBranch(e.target.value)}
        aria-label="Filter by Branch"
        style={{
          background: "var(--bg3, #151324)",
          color: "var(--tx, #fff)",
          border: "1px solid rgba(139, 92, 246, 0.25)",
          borderRadius: "8px",
          padding: "7px 12px",
          fontSize: "0.82rem",
          cursor: "pointer",
          outline: "none",
        }}
      >
        {BRANCHES.map((b) => (
          <option key={b.value} value={b.value}>
            {b.label}
          </option>
        ))}
      </select>

      {/* Refresh Button */}
      <button
        onClick={() => fetchAnalytics(false)}
        disabled={refreshing || loading}
        title="Refresh analytics data"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: refreshing ? "rgba(139, 92, 246, 0.25)" : "rgba(139, 92, 246, 0.12)",
          color: "var(--pur, #a855f7)",
          border: "1px solid rgba(139, 92, 246, 0.35)",
          borderRadius: "8px",
          padding: "7px 14px",
          fontSize: "0.82rem",
          fontWeight: 600,
          cursor: refreshing || loading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
        }}
      >
        <RotateCw
          size={14}
          style={{
            animation: refreshing ? "spin 1s linear infinite" : "none",
          }}
        />
        <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
      </button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (loading && !analytics) {
    return (
      <TeacherLayout
        title="Batch Analytics"
        description="In-depth reports on student code activity, compilers, correctness ratios, and score analytics."
        actions={headerActions}
      >
        <div
          style={{
            padding: "80px 20px",
            textAlign: "center",
            color: "var(--tx2, #94a3b8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
          }}
        >
          <RotateCw
            size={28}
            style={{
              color: "var(--pur, #a855f7)",
              animation: "spin 1s linear infinite",
            }}
          />
          <span style={{ fontSize: "0.95rem" }}>Loading real-time analytical graphs...</span>
        </div>
      </TeacherLayout>
    );
  }

  if (error && !analytics) {
    return (
      <TeacherLayout
        title="Batch Analytics"
        description="In-depth reports on student code activity, compilers, correctness ratios, and score analytics."
        actions={headerActions}
      >
        <div
          className="cyber-card"
          style={{
            padding: "60px 20px",
            textAlign: "center",
            color: "#f87171",
            maxWidth: "600px",
            margin: "40px auto",
          }}
        >
          <p style={{ margin: "0 0 16px 0", fontSize: "0.95rem" }}>{error}</p>
          <button
            onClick={() => fetchAnalytics(true)}
            style={{
              background: "var(--pur, #a855f7)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "8px 18px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Retry Loading
          </button>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout
      title="Batch Analytics"
      description="In-depth reports on student code activity, compilers, correctness ratios, and score analytics."
      actions={headerActions}
    >
      {/* 4 Summary Metric Cards */}
      <div className="row g-3 mb-4">
        {/* Total Submissions */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="cyber-card"
            style={{
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: "rgba(18, 16, 28, 0.8)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(139, 92, 246, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--pur, #a855f7)",
                flexShrink: 0,
              }}
            >
              <FileCode size={22} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--tx3, #94a3b8)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Total Submissions
              </div>
              <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginTop: "2px" }}>
                {totalSubmissions.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Problems Solved */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="cyber-card"
            style={{
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: "rgba(18, 16, 28, 0.8)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(34, 197, 94, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#22c55e",
                flexShrink: 0,
              }}
            >
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--tx3, #94a3b8)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Problems Solved
              </div>
              <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginTop: "2px" }}>
                {totalSolved.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Top Language */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="cyber-card"
            style={{
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: "rgba(18, 16, 28, 0.8)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(59, 130, 246, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3b82f6",
                flexShrink: 0,
              }}
            >
              <Code2 size={22} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--tx3, #94a3b8)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Top Language
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginTop: "2px" }}>
                {topLanguage ? `${topLanguage.name} (${topLanguage.value})` : "None"}
              </div>
            </div>
          </div>
        </div>

        {/* Current Week Submissions */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="cyber-card"
            style={{
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: "rgba(18, 16, 28, 0.8)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(245, 158, 11, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f59e0b",
                flexShrink: 0,
              }}
            >
              <TrendingUp size={22} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--tx3, #94a3b8)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                This Week (Mon-Sun)
              </div>
              <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginTop: "2px" }}>
                {currentWeekSubmissions.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics 2x2 Grid */}
      <div className="row g-4" style={{ opacity: refreshing ? 0.75 : 1, transition: "opacity 0.2s ease" }}>
        {/* Graph 1: Problems Solved Over Time */}
        <div className="col-12 col-lg-6">
          <div
            className="cyber-card"
            style={{
              padding: "24px",
              background: "rgba(18, 16, 28, 0.85)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              borderRadius: "14px",
              height: "100%",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5
                className="d-flex align-items-center gap-2 m-0"
                style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}
              >
                <LineIcon size={16} style={{ color: "var(--pur, #a855f7)" }} />
                <span>Problems Solved Over Time</span>
              </h5>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: "rgba(139, 92, 246, 0.12)",
                  color: "var(--pur, #a855f7)",
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                }}
              >
                Trailing 6 Months (IST)
              </span>
            </div>

            <div style={{ height: "260px", width: "100%", marginTop: "10px" }}>
              {totalSubmissions > 0 && problemsSolvedOverTime && problemsSolvedOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={problemsSolvedOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="anGradSolve" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="var(--tx3, #94a3b8)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                    />
                    <YAxis
                      stroke="var(--tx3, #94a3b8)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={customTooltipStyle}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.month || label}
                      formatter={(value) => [`${value} solved`, "Solved Problems"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="solved"
                      stroke="#a855f7"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#anGradSolve)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "var(--tx3, #94a3b8)",
                    fontSize: "0.85rem",
                  }}
                >
                  No solved problem history for the selected filter
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Graph 2: Weekly Activity Segment (Heatmap) */}
        <div className="col-12 col-lg-6">
          <div
            className="cyber-card"
            style={{
              padding: "24px",
              background: "rgba(18, 16, 28, 0.85)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              borderRadius: "14px",
              height: "100%",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5
                className="d-flex align-items-center gap-2 m-0"
                style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}
              >
                <Grid size={16} style={{ color: "var(--pur, #a855f7)" }} />
                <span>Weekly Activity Segment</span>
              </h5>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: "rgba(139, 92, 246, 0.12)",
                  color: "var(--pur, #a855f7)",
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                }}
              >
                Indian Standard Time (IST)
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
              {/* Header row for time slots */}
              <div className="d-flex align-items-center gap-2">
                <span style={{ width: "36px" }} />
                <div style={{ display: "flex", flex: 1, gap: "4px" }}>
                  {TIME_BLOCK_HEADERS.map((tb) => (
                    <div
                      key={tb.key}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontSize: "0.68rem",
                        color: "var(--tx3, #94a3b8)",
                        fontWeight: 600,
                      }}
                      title={tb.full}
                    >
                      {tb.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap Grid */}
              {weeklyActivityGrid && weeklyActivityGrid.length > 0 ? (
                <>
                  {weeklyActivityGrid.map((row, idx) => (
                    <div key={idx} className="d-flex align-items-center gap-2">
                      <span
                        style={{
                          width: "36px",
                          fontSize: "0.75rem",
                          color: "var(--tx3, #94a3b8)",
                          textAlign: "right",
                          fontWeight: 500,
                        }}
                      >
                        {row.day}
                      </span>
                      <div style={{ display: "flex", flex: 1, gap: "4px" }}>
                        {TIME_BLOCK_HEADERS.map((tb) => {
                          const count = row[tb.key] || 0;
                          return (
                            <div
                              key={tb.key}
                              style={{
                                flex: 1,
                                height: "24px",
                                borderRadius: "4px",
                                background: getHeatColor(count),
                                border:
                                  count > 0
                                    ? "1px solid rgba(168, 85, 247, 0.3)"
                                    : "1px solid rgba(255, 255, 255, 0.03)",
                                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                                cursor: "pointer",
                              }}
                              title={`${row.day}, ${tb.full}: ${count} submission${count === 1 ? "" : "s"}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Heatmap Intensity Legend */}
                  <div
                    className="d-flex align-items-center justify-content-end gap-2 mt-3"
                    style={{ fontSize: "0.7rem", color: "var(--tx3, #94a3b8)" }}
                  >
                    <span>Less</span>
                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "3px",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                      title="0 submissions"
                    />
                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "3px",
                        background: "rgba(139, 92, 246, 0.25)",
                      }}
                      title="Low activity"
                    />
                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "3px",
                        background: "rgba(139, 92, 246, 0.50)",
                      }}
                      title="Moderate activity"
                    />
                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "3px",
                        background: "rgba(139, 92, 246, 0.75)",
                      }}
                      title="Elevated activity"
                    />
                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "3px",
                        background: "rgba(168, 85, 247, 0.95)",
                      }}
                      title="High activity"
                    />
                    <span>More</span>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "180px",
                    color: "var(--tx3, #94a3b8)",
                    fontSize: "0.85rem",
                  }}
                >
                  No activity data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Graph 3: Language Usage Breakdown */}
        <div className="col-12 col-lg-6">
          <div
            className="cyber-card"
            style={{
              padding: "24px",
              background: "rgba(18, 16, 28, 0.85)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              borderRadius: "14px",
              height: "100%",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5
                className="d-flex align-items-center gap-2 m-0"
                style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}
              >
                <BarChart3 size={16} style={{ color: "var(--pur, #a855f7)" }} />
                <span>Language Usage Breakdown</span>
              </h5>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: "rgba(139, 92, 246, 0.12)",
                  color: "var(--pur, #a855f7)",
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                }}
              >
                Total: {languageUsage.reduce((acc, curr) => acc + curr.value, 0)}
              </span>
            </div>

            <div style={{ height: "260px", width: "100%", marginTop: "10px" }}>
              {totalSubmissions > 0 && languageUsage && languageUsage.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={languageUsage} margin={{ top: 25, right: 15, left: -20, bottom: 28 }}>
                    <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="var(--tx3, #94a3b8)"
                      fontSize={12}
                      fontWeight={600}
                      tickLine={false}
                      axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                      interval={0}
                      dy={8}
                    />
                    <YAxis
                      stroke="var(--tx3, #94a3b8)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={<CustomLanguageTooltip />}
                      cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                      position={{ y: 0 }}
                      wrapperStyle={{ pointerEvents: "none", zIndex: 100 }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {languageUsage.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={LANGUAGE_COLORS[entry.name] || entry.color || "#2563eb"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "var(--tx3, #94a3b8)",
                    fontSize: "0.85rem",
                  }}
                >
                  No language usage data for the selected filter
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Graph 4: Weekly Submission Trend */}
        <div className="col-12 col-lg-6">
          <div
            className="cyber-card"
            style={{
              padding: "24px",
              background: "rgba(18, 16, 28, 0.85)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              borderRadius: "14px",
              height: "100%",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5
                className="d-flex align-items-center gap-2 m-0"
                style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}
              >
                <LineIcon size={16} style={{ color: "#3b82f6" }} />
                <span>Weekly Submission Trend</span>
              </h5>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: "rgba(59, 130, 246, 0.12)",
                  color: "#60a5fa",
                  border: "1px solid rgba(59, 130, 246, 0.25)",
                }}
              >
                Last 12 Weeks (Mon - Sun)
              </span>
            </div>

            <div style={{ height: "260px", width: "100%", marginTop: "10px" }}>
              {weeklyTrend && weeklyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="anGradTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="var(--tx3, #94a3b8)"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      stroke="var(--tx3, #94a3b8)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={customTooltipStyle}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.weekLabel || label}
                      formatter={(value) => [`${value} submissions`, "Submissions"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="submissions"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#anGradTrend)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "var(--tx3, #94a3b8)",
                    fontSize: "0.85rem",
                  }}
                >
                  No weekly trend data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}

export default Analytics;

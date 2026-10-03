import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { BarChart3, LineChart as LineIcon, Grid } from "lucide-react";
import TeacherLayout from "../../components/teacher/TeacherLayout";

function Analytics({ currentUser }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const teacherId = currentUser?.id || (() => {
          try {
            const saved = localStorage.getItem("cryptocode_user");
            return saved ? JSON.parse(saved)?.id : null;
          } catch {
            return null;
          }
        })();

        const url = teacherId
          ? `http://localhost:5000/submissions/analytics?teacher_id=${encodeURIComponent(teacherId)}`
          : "http://localhost:5000/submissions/analytics";

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || !data.success || !data.analytics) {
          throw new Error(data.message || "Failed to load analytical data");
        }

        if (isMounted) {
          setAnalytics(data.analytics);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        if (isMounted) {
          setError(err.message || "Failed to load analytical graphs");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Git-like heatmap color coding for weekly activity
  const getHeatColor = (value) => {
    if (!value || value === 0) return "rgba(255,255,255,0.03)";
    if (value < 5) return "rgba(139, 92, 246, 0.15)";
    if (value < 10) return "rgba(139, 92, 246, 0.35)";
    if (value < 18) return "rgba(139, 92, 246, 0.6)";
    return "rgba(139, 92, 246, 0.9)"; // High activity
  };

  if (loading) {
    return (
      <TeacherLayout
        title="Batch Analytics"
        description="In-depth reports on student code activity, compilers, correctness ratios, and score analytics."
      >
        <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--tx2)" }}>
          Loading analytical graphs...
        </div>
      </TeacherLayout>
    );
  }

  if (error || !analytics) {
    return (
      <TeacherLayout
        title="Batch Analytics"
        description="In-depth reports on student code activity, compilers, correctness ratios, and score analytics."
      >
        <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--tx3)" }}>
          {error || "No analytics data available"}
        </div>
      </TeacherLayout>
    );
  }

  const {
    weeklyTrend = [],
    languageUsage = [],
    problemsSolvedOverTime = [],
    weeklyActivityGrid = [],
  } = analytics;

  return (
    <TeacherLayout
      title="Batch Analytics"
      description="In-depth reports on student code activity, compilers, correctness ratios, and score analytics."
    >
      {/* Analytics Grid: 2x2 layout */}
      <div className="row g-4">
        {/* Graph 1: Problems Solved Over Time */}
        <div className="col-12 col-md-6">
          <div className="cyber-card" style={{ padding: "24px" }}>
            <h5 className="mb-3 d-flex align-items-center gap-2" style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>
              <LineIcon size={14} style={{ color: "var(--pur)" }} />
              <span>Problems Solved Over Time</span>
            </h5>
            <div style={{ height: "240px", width: "100%" }}>
              {problemsSolvedOverTime && problemsSolvedOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={problemsSolvedOverTime}>
                    <defs>
                      <linearGradient id="anGradSolve" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--pur)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--pur)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="var(--tx3)" fontSize={10} tickLine={false} />
                    <YAxis stroke="var(--tx3)" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ background: "var(--bg3)", border: "1px solid var(--bd)", borderRadius: "8px", color: "var(--tx)" }} />
                    <Area type="monotone" dataKey="solved" stroke="var(--pur)" strokeWidth={2} fillOpacity={1} fill="url(#anGradSolve)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--tx3)", fontSize: "0.85rem" }}>
                  No solving history data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Graph 2: Weekly Activity Segment */}
        <div className="col-12 col-md-6">
          <div className="cyber-card" style={{ padding: "24px" }}>
            <h5 className="mb-3 d-flex align-items-center gap-2" style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>
              <Grid size={14} style={{ color: "var(--pur)" }} />
              <span>Weekly Activity Segment</span>
            </h5>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
              {weeklyActivityGrid && weeklyActivityGrid.length > 0 ? (
                <>
                  {weeklyActivityGrid.map((row, idx) => (
                    <div key={idx} className="d-flex align-items-center gap-2">
                      <span style={{ width: "36px", fontSize: "0.75rem", color: "var(--tx3)", textAlign: "right" }}>{row.day}</span>
                      <div style={{ display: "flex", flex: 1, gap: "4px" }}>
                        <div style={{ flex: 1, height: "22px", borderRadius: "4px", background: getHeatColor(row.hr0) }} title={`00:00 - 04:00: ${row.hr0} submissions`} />
                        <div style={{ flex: 1, height: "22px", borderRadius: "4px", background: getHeatColor(row.hr4) }} title={`04:00 - 08:00: ${row.hr4} submissions`} />
                        <div style={{ flex: 1, height: "22px", borderRadius: "4px", background: getHeatColor(row.hr8) }} title={`08:00 - 12:00: ${row.hr8} submissions`} />
                        <div style={{ flex: 1, height: "22px", borderRadius: "4px", background: getHeatColor(row.hr12) }} title={`12:00 - 16:00: ${row.hr12} submissions`} />
                        <div style={{ flex: 1, height: "22px", borderRadius: "4px", background: getHeatColor(row.hr16) }} title={`16:00 - 20:00: ${row.hr16} submissions`} />
                        <div style={{ flex: 1, height: "22px", borderRadius: "4px", background: getHeatColor(row.hr20) }} title={`20:00 - 24:00: ${row.hr20} submissions`} />
                      </div>
                    </div>
                  ))}
                  <div className="d-flex align-items-center justify-content-end gap-1.5 mt-2" style={{ fontSize: "0.68rem", color: "var(--tx3)" }}>
                    <span>Low</span>
                    <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "rgba(255,255,255,0.03)" }}></span>
                    <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "rgba(139, 92, 246, 0.25)" }}></span>
                    <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "rgba(139, 92, 246, 0.6)" }}></span>
                    <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "rgba(139, 92, 246, 0.9)" }}></span>
                    <span>High</span>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--tx3)", fontSize: "0.85rem" }}>
                  No activity data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Graph 3: Language Usage Breakdown */}
        <div className="col-12 col-md-6">
          <div className="cyber-card" style={{ padding: "24px" }}>
            <h5 className="mb-3 d-flex align-items-center gap-2" style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>
              <BarChart3 size={14} style={{ color: "var(--pur)" }} />
              <span>Language Usage Breakdown</span>
            </h5>
            <div style={{ height: "240px", width: "100%" }}>
              {languageUsage && languageUsage.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={languageUsage}>
                    <XAxis dataKey="name" stroke="var(--tx3)" fontSize={10} tickLine={false} />
                    <YAxis stroke="var(--tx3)" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ background: "var(--bg3)", border: "1px solid var(--bd)", borderRadius: "8px", color: "var(--tx)" }} />
                    <Bar dataKey="value" fill="var(--pur)" radius={[6, 6, 0, 0]} maxBarSize={45}>
                      {languageUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--tx3)", fontSize: "0.85rem" }}>
                  No language usage data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Graph 4: Weekly Submission Trend */}
        <div className="col-12 col-md-6">
          <div className="cyber-card" style={{ padding: "24px" }}>
            <h5 className="mb-3 d-flex align-items-center gap-2" style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>
              <LineIcon size={14} style={{ color: "var(--pur)" }} />
              <span>Weekly Submission Trend</span>
            </h5>
            <div style={{ height: "240px", width: "100%" }}>
              {weeklyTrend && weeklyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTrend}>
                    <defs>
                      <linearGradient id="anGradTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="var(--tx3)" fontSize={10} tickLine={false} />
                    <YAxis stroke="var(--tx3)" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ background: "var(--bg3)", border: "1px solid var(--bd)", borderRadius: "8px", color: "var(--tx)" }} />
                    <Area type="monotone" dataKey="submissions" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#anGradTrend)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--tx3)", fontSize: "0.85rem" }}>
                  No trend data available
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

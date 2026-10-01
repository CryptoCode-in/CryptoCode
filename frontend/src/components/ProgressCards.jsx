import { useState, useEffect, useRef } from "react";

function ProgressCards() {
  const [submissions, setSubmissions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [languageCounts, setLanguageCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(800);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const maxCount = Math.max(
    ...chartData.map((item) => item.count),
    1
  );

  const chartMax = Math.max(
    6,
    Math.ceil(maxCount / 3) * 3
  );

  // Measure chart container width so SVG chart spans 100% full width and stays responsive
  useEffect(() => {
    if (!chartContainerRef.current) return;
    const updateWidth = () => {
      if (chartContainerRef.current) {
        const width = chartContainerRef.current.clientWidth;
        if (width > 0) {
          setChartWidth(width);
        }
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(chartContainerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const currentUser = JSON.parse(
          localStorage.getItem("cryptocode_user")
        );

        if (!currentUser?.id) {
          setSubmissions([]);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/submissions?user_id=${currentUser.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to fetch submissions:", data);
          setError(data.message || "Failed to load progress data");
          setLoading(false);
          return;
        }

        console.log("PROGRESS SUBMISSIONS:", data.submissions);
        console.log(
          "SUBMISSION DATES:",
          (data.submissions || []).map((submission) => submission.submitted_at)
        );
        const monthlyCounts = {};

        (data.submissions || []).forEach((submission) => {
          const date = new Date(submission.submitted_at);
          const month = date.toLocaleString("en-US", {
            month: "short",
          });

          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        });
        const languageCountData = {};

        (data.submissions || []).forEach((submission) => {
          const language = submission.language;

          if (!language) return;

          languageCountData[language] =
            (languageCountData[language] || 0) + 1;
        });

        console.log("LANGUAGE COUNTS:", languageCountData);

        setLanguageCounts(languageCountData);
        console.log("MONTHLY COUNTS:", monthlyCounts);
        const monthOrder = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const monthlyData = monthOrder.map((month) => ({
          month,
          count: monthlyCounts[month] || 0,
        }));

        console.log("MONTHLY DATA:", monthlyData);
        const currentMonthIndex = new Date().getMonth();

        const latestChartData = Array.from({ length: 6 }, (_, i) => {
          const index = (currentMonthIndex - 5 + i + 12) % 12;
          return monthlyData[index];
        });

        console.log("CHART DATA:", latestChartData);

        setChartData(latestChartData);
        setSubmissions(data.submissions || []);
      } catch (err) {
        console.error("Progress fetch error:", err);
        setError("Network error fetching submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Language mapping with support for default curricula + any dynamic extra languages from backend
  const defaultLanguages = [
    { key: "c", lang: "C Programming", color: "#3b82f6" },
    { key: "cpp", lang: "C++ Programming", color: "#8b5cf6" },
    { key: "java", lang: "Java Programming", color: "#f59e0b" },
    { key: "python", lang: "Python Programming", color: "#10b981" }
  ];

  const extraKeys = Object.keys(languageCounts).filter(
    (key) => !defaultLanguages.some((item) => item.key.toLowerCase() === key.toLowerCase())
  );

  const extraLanguages = extraKeys.map((key, idx) => {
    const extraPalette = ["#ec4899", "#06b6d4", "#a855f7", "#14b8a6", "#f43f5e"];
    return {
      key,
      lang: key.charAt(0).toUpperCase() + key.slice(1) + " Programming",
      color: extraPalette[idx % extraPalette.length]
    };
  });

  const languageList = [...defaultLanguages, ...extraLanguages];

  const maxLanguageCount = Math.max(
    ...Object.values(languageCounts),
    1
  );

  // Dynamic layout calculations for full-width responsive chart
  const leftMargin = 50;
  const rightMargin = 30;
  const topMargin = 35;
  const baselineY = 215;
  const chartHeight = 180;
  const availableWidth = Math.max(chartWidth - leftMargin - rightMargin, 120);

  const pointCoords = chartData.map((item, idx) => {
    const divisor = Math.max(chartData.length - 1, 1);
    const x = leftMargin + (idx / divisor) * availableWidth;
    const y = baselineY - ((item.count / chartMax) * chartHeight);
    return { ...item, x, y };
  });

  const pointsPath = pointCoords.map((pt, idx) => `${idx === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(" ");
  const endX = leftMargin + availableWidth;
  const areaPath = pointCoords.length > 0
    ? `${pointsPath} L ${endX.toFixed(1)} ${baselineY} L ${leftMargin} ${baselineY} Z`
    : "";

  const gridLevels = [
    { y: topMargin, label: chartMax },
    { y: topMargin + chartHeight / 3, label: Math.round((chartMax * 2) / 3) },
    { y: topMargin + (chartHeight * 2) / 3, label: Math.round(chartMax / 3) },
    { y: baselineY, label: 0 }
  ];

  return (
    <div id="progress-section" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
      {/* Title Header */}
      <div>
        <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
          Learning Analytics
        </h4>
        <p style={{ fontSize: "0.8rem", color: "var(--tx3)", margin: "4px 0 0 0" }}>
          Detailed view of your academic performance and language metrics.
        </p>
      </div>

      {/* Error state alert if any */}
      {error && (
        <div 
          className="cyber-card p-3 d-flex align-items-center justify-content-between"
          style={{ borderColor: "rgba(239, 68, 68, 0.4)", background: "rgba(239, 68, 68, 0.05)" }}
        >
          <span style={{ color: "#ef4444", fontSize: "0.85rem" }}>{error}</span>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-sm btn-outline-danger"
            style={{ fontSize: "0.75rem" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Section 1: Progress Overview (Full-width card) */}
      <div className="cyber-card p-4" style={{ width: "100%" }}>
        <h5 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--tx)", margin: "0 0 20px 0" }}>
          Progress Overview
        </h5>

        <div ref={chartContainerRef} style={{ width: "100%", height: "260px", position: "relative" }}>
          <svg
            viewBox={`0 0 ${chartWidth} 260`}
            width="100%"
            height="100%"
            style={{ overflow: "visible", display: "block" }}
          >
            <defs>
              <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--pur)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--pur)" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {gridLevels.map((lvl, idx) => (
              <line
                key={`grid-${idx}`}
                x1={leftMargin}
                y1={lvl.y}
                x2={endX}
                y2={lvl.y}
                stroke="var(--bd)"
                strokeDasharray={idx === gridLevels.length - 1 ? undefined : "3 3"}
              />
            ))}

            {/* Y-axis Labels */}
            {gridLevels.map((lvl, idx) => (
              <text
                key={`ylabel-${idx}`}
                x={leftMargin - 12}
                y={lvl.y + 4}
                textAnchor="end"
                fill="var(--tx3)"
                fontSize="0.72rem"
              >
                {lvl.label}
              </text>
            ))}

            {/* Area Fill */}
            {areaPath && (
              <path
                d={areaPath}
                fill="url(#gradient-area)"
              />
            )}

            {/* Hover Vertical Guide */}
            {hoveredIdx !== null && pointCoords[hoveredIdx] && (
              <line
                x1={pointCoords[hoveredIdx].x}
                y1={topMargin}
                x2={pointCoords[hoveredIdx].x}
                y2={baselineY}
                stroke="var(--pur)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.6"
              />
            )}

            {/* Trend Line */}
            {pointsPath && (
              <path
                d={pointsPath}
                fill="none"
                stroke="var(--pur)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Points & Value Labels */}
            {pointCoords.map((pt, idx) => {
              const isHovered = hoveredIdx === idx;
              return (
                <g key={`pt-${idx}`}>
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="10"
                      fill="var(--pur)"
                      opacity="0.3"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6.5 : 5}
                    fill="var(--bg)"
                    stroke="var(--pur)"
                    strokeWidth="3"
                    style={{ transition: "r 0.15s ease" }}
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    fill={isHovered ? "var(--pur)" : "var(--tx)"}
                    fontSize="0.75rem"
                    fontWeight="600"
                  >
                    {pt.count}
                  </text>
                </g>
              );
            })}

            {/* X-axis Month Labels */}
            {pointCoords.map((pt, idx) => {
              const isHovered = hoveredIdx === idx;
              return (
                <text
                  key={`xlabel-${idx}`}
                  x={pt.x}
                  y="238"
                  textAnchor="middle"
                  fill={isHovered ? "var(--pur)" : "var(--tx2)"}
                  fontSize="0.75rem"
                  fontWeight="600"
                >
                  {pt.month}
                </text>
              );
            })}

            {/* Hover Hitboxes */}
            {pointCoords.map((pt, idx) => {
              const colWidth = availableWidth / Math.max(chartData.length, 1);
              return (
                <rect
                  key={`hover-col-${idx}`}
                  x={pt.x - colWidth / 2}
                  y={topMargin - 15}
                  width={colWidth}
                  height={chartHeight + 40}
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Section 2: Language Progress (Full-width card) */}
      <div className="cyber-card p-4" style={{ width: "100%" }}>
        <h5 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--tx)", margin: "0 0 20px 0" }}>
          Language Progress
        </h5>
        <div className="d-flex flex-column" style={{ gap: "20px" }}>
          {languageList.map((item, idx) => {
            const count = languageCounts[item.key] ?? languageCounts[item.key.toLowerCase()] ?? 0;
            const percentage = Math.round((count / maxLanguageCount) * 100);

            return (
              <div key={idx}>
                <div 
                  className="d-flex justify-content-between align-items-center mb-2" 
                  style={{ fontSize: "0.85rem" }}
                >
                  <span style={{ fontWeight: 600, color: "var(--tx)" }}>
                    {item.lang}
                  </span>
                  <span style={{ color: "var(--tx2)", fontWeight: 500 }}>
                    {count} {count === 1 ? "submission" : "submissions"}
                  </span>
                </div>
                <div 
                  style={{ 
                    height: "8px", 
                    background: "var(--bg3)", 
                    borderRadius: "4px", 
                    overflow: "hidden" 
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${percentage}%`,
                      background: item.color,
                      borderRadius: "4px",
                      transition: "width 1s ease"
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProgressCards;

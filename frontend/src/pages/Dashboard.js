import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import MetricCard from "../components/MetricCard";
import RequestChart from "../charts/RequestChart";
import ResponseTimeChart from "../charts/ResponseTimeChart";
import ErrorPieChart from "../charts/ErrorPieChart";
import EndpointPieChart from "../charts/EndpointPieChart";

import RecentActivity from "../components/RecentActivity";
import AIInsights from "../components/AIInsights";
import NotificationPanel from "../components/NotificationPanel";

import LiveRequestFeed from "../components/LiveRequestFeed";
import EndpointLeaderboard from "../components/EndpointLeaderboard";
import TrafficPrediction from "../components/TrafficPrediction";

import HealthTimeline from "../components/HealthTimeline";
import AIRiskAnalyzer from "../components/AIRiskAnalyzer";
import AIRecommendations from "../components/AIRecommendations";

import { getConnectedApiSummary } from "../services/connectedApiService";
import { getAiScoreCard, getAiBusinessInsights } from "../services/aiService";
import { useAuth } from "../auth/AuthContext";

import API from "../services/api";

import {
  FaRobot,
  FaServer,
  FaClock,
  FaExclamationTriangle,
  FaBriefcase,
  FaList,
  FaBrain,
  FaMagic,
  FaRocket,
  FaFilePdf,
  FaInfoCircle,
  FaCheckCircle,
  FaShieldAlt,
  FaChartLine,
  FaLock,
  FaFilter
} from "react-icons/fa";

import "../styles/dashboard.css";

function Dashboard({ darkMode, setDarkMode }) {
  const [dashboard, setDashboard] = useState(null);
  const [apiSummary, setApiSummary] = useState(null);
  const [scoreCard, setScoreCard] = useState(null);
  const [businessInsights, setBusinessInsights] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [selectedApiId, setSelectedApiId] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Handler when user clicks "Connect API" or "Add Connected API"
  const handleConnectApiClick = () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/connected-apis",
          message: "Please log in or register to add and connect your REST APIs."
        }
      });
    } else {
      navigate("/connected-apis");
    }
  };

  // Fetch Dashboard Data (supports filtering by target connected API ID)
  async function fetchDashboard(targetApiId = selectedApiId) {
    try {
      const url = targetApiId ? `/ai/dashboard?api_id=${targetApiId}` : "/ai/dashboard";
      const [res, summaryRes, scoreCardRes, businessRes] = await Promise.all([
        API.get(url).catch(() => null),
        getConnectedApiSummary().catch(() => null),
        getAiScoreCard().catch(() => null),
        getAiBusinessInsights().catch(() => null),
      ]);

      if (res && res.data) {
        setDashboard(res.data);
      } else {
        // Public Demo Telemetry Fallback Structure
        setDashboard({
          score: {
            score: 95,
            status: "Excellent",
            metrics: { total_requests: 1250, avg_response_time: 0.045, error_rate: 0.0, most_used_endpoint: "/api/v1/users" }
          },
          alerts: [],
          traffic: { total_logs: 1250, status: "Healthy", predicted_next_hour: 1400, top_endpoints: [["/api/v1/users", 540], ["/api/v1/auth/login", 320], ["/connected-apis", 180]] }
        });
      }

      if (summaryRes) setApiSummary(summaryRes);
      if (scoreCardRes) setScoreCard(scoreCardRes);
      if (businessRes) setBusinessInsights(businessRes);
      setError(null);

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setDashboard({
        score: {
          score: 95,
          status: "Excellent",
          metrics: { total_requests: 1250, avg_response_time: 0.045, error_rate: 0.0, most_used_endpoint: "/api/v1/users" }
        },
        alerts: [],
        traffic: { total_logs: 1250, status: "Healthy", predicted_next_hour: 1400, top_endpoints: [["/api/v1/users", 540], ["/api/v1/auth/login", 320], ["/connected-apis", 180]] }
      });
    }
  }

  // Auto Refresh Every 5 Seconds
  useEffect(() => {
    fetchDashboard(selectedApiId);
    const interval = setInterval(() => fetchDashboard(selectedApiId), 5000);
    return () => clearInterval(interval);
  }, [selectedApiId]);

  // Loading Screen
  if (!dashboard) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          fontWeight: "bold",
          color: "var(--text-main)",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="dashboard-body">
        <Sidebar />

        <main className="content">
          {/* Hero Banner */}
          <div className="hero-banner">
            <div>
              <h1 style={{ color: "#ffffff" }}>Monitor & Optimize APIs Like Magic ✨</h1>
              <p style={{ color: "#e0f2fe" }}>Real-time HTTP log ingestion, predictive ML traffic forecasting, and executive business reports.</p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", zIndex: 1 }}>
              <button
                onClick={handleConnectApiClick}
                style={{
                  padding: "12px 20px",
                  backgroundColor: "#ffffff",
                  color: "#0369a1",
                  border: "none",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
                }}
              >
                <FaRocket style={{ color: "#0284c7" }} /> {isAuthenticated ? "Connect API" : "Connect API (Log In)"}
              </button>
              <button
                onClick={() => navigate("/executive-dashboard")}
                style={{
                  padding: "12px 20px",
                  backgroundColor: "rgba(255,255,255,0.18)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backdropFilter: "blur(12px)"
                }}
              >
                <FaBriefcase /> Executive Board
              </button>
            </div>
          </div>

          {/* API Selector & Telemetry Scope Header */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--border-card)",
              borderRadius: "20px",
              padding: "16px 24px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaServer style={{ color: "#38bdf8", fontSize: "22px" }} />
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase" }}>
                  Active Telemetry Report
                </div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>{dashboard.selected_api_name || "All Connected APIs (Global Telemetry)"}</span>
                  <span style={{ fontSize: "11px", padding: "2px 10px", borderRadius: "12px", backgroundColor: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
                    {dashboard.connected_apis ? `${dashboard.connected_apis.length} Connected APIs` : "Live Global Stream"}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FaFilter style={{ color: "#38bdf8", fontSize: "14px" }} />
              <label style={{ fontSize: "13px", fontWeight: "bold", color: "var(--text-main)" }}>
                Select API Report:
              </label>
              <select
                value={selectedApiId || ""}
                onChange={(e) => {
                  const val = e.target.value ? parseInt(e.target.value) : "";
                  setSelectedApiId(val);
                  fetchDashboard(val);
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: "14px",
                  border: "1px solid var(--border-card)",
                  backgroundColor: "var(--bg-search)",
                  color: "var(--text-main)",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="">🌐 All Connected APIs (Global Telemetry)</option>
                {(dashboard.connected_apis || []).map((api) => (
                  <option key={api.id} value={api.id}>
                    🔗 {api.name} ({api.base_url}) - {api.status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Explanation Section: How It Works & Purpose */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--border-card)",
              borderRadius: "24px",
              padding: "28px",
              marginBottom: "32px",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <FaInfoCircle style={{ fontSize: "24px", color: "#38bdf8" }} />
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "var(--text-heading)" }}>
                  💡 What is API Optimizer AI & How Does It Work?
                </h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--text-muted)" }}>
                  Enterprise API Performance Monitoring, Real-time Ingestion, Time-Series ML Forecasting & SLA Intelligence Platform.
                </p>
              </div>
            </div>

            <p style={{ fontSize: "14px", lineHeight: "1.7", color: "var(--text-main)", marginBottom: "20px" }}>
              Modern microservices and third-party REST APIs (Stripe, GitHub, OpenAI, internal backends) suffer from latency bottlenecks, unexpected server downtime, and security threats. <b>API Optimizer AI</b> tracks real-time HTTP log streams, predicts traffic spikes using Machine Learning, and delivers actionable optimization advice.
            </p>

            {/* How It Works 4-Step Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <div
                style={{
                  backgroundColor: "var(--table-row-bg)",
                  padding: "18px",
                  borderRadius: "16px",
                  border: "1px solid var(--table-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", color: "var(--text-heading)", fontSize: "14px" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#0284c7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>1</span>
                  Connect REST APIs
                </div>
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                  Register API base URLs (Stripe, GitHub, custom services) to track SSL cert validity, DNS resolution, and latency health.
                </p>
                <span style={{ fontSize: "11px", fontWeight: "bold", color: "#38bdf8", marginTop: "auto" }}>
                  {!isAuthenticated ? "🔒 Requires User Login" : "✅ Available"}
                </span>
              </div>

              <div
                style={{
                  backgroundColor: "var(--table-row-bg)",
                  padding: "18px",
                  borderRadius: "16px",
                  border: "1px solid var(--table-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", color: "var(--text-heading)", fontSize: "14px" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#0369a1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>2</span>
                  Real-time Telemetry
                </div>
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                  Automatically stream and filter HTTP status codes (2xx, 4xx, 5xx), payload sizes, and client IPs with multi-format CSV/JSON/PDF exports.
                </p>
                <span style={{ fontSize: "11px", fontWeight: "bold", color: "#06b6d4", marginTop: "auto" }}>
                  🌐 Public Live Telemetry
                </span>
              </div>

              <div
                style={{
                  backgroundColor: "var(--table-row-bg)",
                  padding: "18px",
                  borderRadius: "16px",
                  border: "1px solid var(--table-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", color: "var(--text-heading)", fontSize: "14px" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#1d4ed8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>3</span>
                  ML Traffic Predictor
                </div>
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                  Time-series forecasting predicts traffic demand 30–60 mins in advance, evaluating system risk scores and recommending Redis caching.
                </p>
                <span style={{ fontSize: "11px", fontWeight: "bold", color: "#60a5fa", marginTop: "auto" }}>
                  🤖 ML Time-Series Engine
                </span>
              </div>

              <div
                style={{
                  backgroundColor: "var(--table-row-bg)",
                  padding: "18px",
                  borderRadius: "16px",
                  border: "1px solid var(--table-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", color: "var(--text-heading)", fontSize: "14px" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>4</span>
                  Executive Intelligence
                </div>
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                  Calculate infrastructure cost savings (compute, data egress, DB I/O), rank APIs against global benchmarks, and export official executive PDF reports.
                </p>
                <span style={{ fontSize: "11px", fontWeight: "bold", color: "#38bdf8", marginTop: "auto" }}>
                  📊 SLA Reports & PDFs
                </span>
              </div>
            </div>
          </div>

          {/* Canva Quick Action Row */}
          <div className="canva-action-grid">
            <div className="canva-action-card" onClick={handleConnectApiClick}>
              <div className="canva-action-icon" style={{ background: "linear-gradient(135deg, #0284c7, #38bdf8)" }}>
                <FaServer />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "bold", color: "var(--text-heading)" }}>
                  Connect REST API {!isAuthenticated && <FaLock style={{ fontSize: "11px", marginLeft: "4px", color: "#38bdf8" }} />}
                </h4>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>
                  {!isAuthenticated ? "Log in to add API endpoints" : "Add & test API endpoints"}
                </p>
              </div>
            </div>

            <div className="canva-action-card" onClick={() => navigate("/logs")}>
              <div className="canva-action-icon" style={{ background: "linear-gradient(135deg, #0369a1, #06b6d4)" }}>
                <FaList />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "bold", color: "var(--text-heading)" }}>Log Explorer</h4>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>Live telemetry & exports</p>
              </div>
            </div>

            <div className="canva-action-card" onClick={() => navigate("/ai-insights")}>
              <div className="canva-action-icon" style={{ background: "linear-gradient(135deg, #1d4ed8, #60a5fa)" }}>
                <FaMagic />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "bold", color: "var(--text-heading)" }}>AI Insights</h4>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>ML predictions & forecast</p>
              </div>
            </div>

            <div className="canva-action-card" onClick={() => navigate("/executive-dashboard")}>
              <div className="canva-action-icon" style={{ background: "linear-gradient(135deg, #2563eb, #38bdf8)" }}>
                <FaFilePdf />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "bold", color: "var(--text-heading)" }}>Executive Report</h4>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>Generate PDF reports</p>
              </div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="cards">
            <MetricCard
              title="AI Telemetry Score"
              value={dashboard.score?.score || 95}
              decimals={0}
              color="#38bdf8"
              icon={<FaRobot />}
            />
            <MetricCard
              title="Total HTTP Requests"
              value={dashboard.score?.metrics?.total_requests || 0}
              color="#10b981"
              icon={<FaServer />}
            />
            <MetricCard
              title="Avg Latency (ms)"
              value={(dashboard.score?.metrics?.avg_response_time || 0) * 1000}
              decimals={1}
              color="#38bdf8"
              icon={<FaClock />}
            />
            <MetricCard
              title="Error Rate (%)"
              value={dashboard.score?.metrics?.error_rate || 0}
              decimals={2}
              color="#ef4444"
              icon={<FaExclamationTriangle />}
            />
          </div>

          {/* Business Insights Banner */}
          {businessInsights && (
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                backdropFilter: "blur(16px)",
                border: "1px solid var(--border-card)",
                borderRadius: "20px",
                padding: "20px 24px",
                marginBottom: "32px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                boxShadow: "var(--shadow-card)"
              }}
            >
              <FaBrain style={{ fontSize: "28px", color: "#38bdf8", flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: "0 0 4px 0", color: "var(--text-heading)", fontSize: "15px", fontWeight: "bold" }}>
                  AI Business Insight ({dashboard.selected_api_name || businessInsights.summary_title || "System Health"})
                </h4>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)" }}>
                  {businessInsights.plain_english_summary || "System operating efficiently with low latency and optimal throughput."}
                </p>
              </div>
            </div>
          )}

          {/* Charts Grid Row 1 */}
          <div className="charts-grid">
            <RequestChart dashboard={dashboard} />
            <ResponseTimeChart dashboard={dashboard} />
          </div>

          {/* Charts Grid Row 2 */}
          <div className="charts-grid">
            <ErrorPieChart dashboard={dashboard} />
            <EndpointPieChart dashboard={dashboard} />
          </div>

          {/* Live Request Feed & Prediction Section */}
          <div className="charts-grid">
            <LiveRequestFeed dashboard={dashboard} />
            <TrafficPrediction dashboard={dashboard} />
          </div>

          {/* Health & Risk Analyzer */}
          <div className="charts-grid">
            <AIRiskAnalyzer dashboard={dashboard} />
            <HealthTimeline dashboard={dashboard} />
          </div>

          {/* AI Recommendations Module */}
          <div style={{ marginTop: "32px" }}>
            <AIRecommendations />
          </div>

          {/* Leaderboard & Recent Activity */}
          <EndpointLeaderboard dashboard={dashboard} />
          <RecentActivity dashboard={dashboard} />

          {/* Smart Notifications & Insights */}
          <div className="charts-grid">
            <NotificationPanel dashboard={dashboard} />
            <AIInsights dashboard={dashboard} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
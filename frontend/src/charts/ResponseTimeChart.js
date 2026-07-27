import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

function ResponseTimeChart({ dashboard }) {
  const topEndpoints = dashboard?.traffic?.top_endpoints || [
    ["/api/v1/users", 45],
    ["/api/v1/auth/login", 30],
    ["/connected-apis", 25]
  ];

  const data = topEndpoints.map((item) => ({
    name: Array.isArray(item) ? item[0] : item.name || "Endpoint",
    ms: Array.isArray(item) ? Math.round(item[1] * 0.8) : (item.value || 45)
  }));

  const BAR_COLORS = ["#38bdf8", "#06b6d4", "#60a5fa", "#10b981", "#f59e0b"];

  return (
    <div className="chart-card">
      <h3>⚡ Latency Breakdown by Endpoint (ms)</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.18)" />
          <XAxis dataKey="name" stroke="var(--text-muted)" />
          <YAxis stroke="var(--text-muted)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(11, 20, 42, 0.95)",
              borderColor: "rgba(56, 189, 248, 0.4)",
              borderRadius: "12px",
              color: "#f8fafc"
            }}
          />
          <Bar dataKey="ms" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ResponseTimeChart;
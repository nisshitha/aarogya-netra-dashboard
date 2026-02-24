import { useState } from "react";
import {
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Building2,
  Activity,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

// ── Types for API integration ──
interface ForecastPoint {
  date: string;
  predicted: number;
  actual?: number;
}

interface AnomalyStatus {
  department: string;
  anomaly_detected: boolean;
  persistence_days: number;
  severity_level: "low" | "medium" | "high" | "critical";
}

interface DepartmentRisk {
  department: string;
  risk_score: number;
  trend: "rising" | "stable" | "falling";
  top_cluster: string;
}

const timeRanges = ["Next 7 Days", "Next 14 Days", "Next 30 Days"];

const PredictiveAnalytics = () => {
  const [timeRange, setTimeRange] = useState("Next 7 Days");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  // Empty state — ready for API integration
  // Replace with: const { data: forecasts } = useQuery(...)
  const forecasts: ForecastPoint[] = [];
  const anomalies: AnomalyStatus[] = [];
  const departmentRisks: DepartmentRisk[] = [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Predictive Analytics</h1>
          <p className="text-sm text-muted-foreground">AI-powered forecasting and anomaly detection</p>
        </div>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
          >
            <Calendar className="h-4 w-4" />
            {timeRange}
          </Button>
          {showTimeDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowTimeDropdown(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-border bg-card p-1 shadow-clinical-lg">
                {timeRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setTimeRange(range);
                      setShowTimeDropdown(false);
                    }}
                    className={`flex w-full rounded-md px-3 py-2 text-sm transition-colors ${
                      timeRange === range
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Forecast Graph */}
      <div className="card-clinical p-6">
        <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Complaint Volume Forecast
        </h3>
        {forecasts.length === 0 ? (
          <div className="empty-state py-16">
            <TrendingUp className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium text-foreground">Forecast model awaiting data</p>
            <p className="text-sm max-w-md text-center text-muted-foreground">
              The ARIMA/Prophet forecasting model will generate 7-day complaint volume predictions per department once historical data is available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={forecasts}>
              <defs>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(190, 84%, 32%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(190, 84%, 32%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(204, 40%, 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(213, 30%, 45%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(213, 30%, 45%)" }} />
              <Tooltip />
              <Area type="monotone" dataKey="predicted" stroke="hsl(190, 84%, 32%)" fill="url(#forecastGradient)" strokeWidth={2} />
              <Line type="monotone" dataKey="actual" stroke="hsl(213, 30%, 45%)" strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Persistent Anomaly Detection */}
        <div className="card-clinical p-6">
          <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            Persistent Anomaly Detection
          </h3>
          {anomalies.length === 0 ? (
            <div className="empty-state py-12">
              <AlertTriangle className="mb-3 h-8 w-8 text-muted-foreground/40" />
              <p className="font-medium text-foreground">No anomalies detected</p>
              <p className="text-sm text-center text-muted-foreground">
                Rolling baseline analysis will flag departments with unusual complaint patterns exceeding 2σ
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {anomalies.map((a) => (
                <div key={a.department} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                  <div className={`h-3 w-3 rounded-full ${
                    a.severity_level === "critical" ? "bg-red-500" :
                    a.severity_level === "high" ? "bg-amber-500" :
                    a.severity_level === "medium" ? "bg-yellow-400" : "bg-emerald-400"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{a.department}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.anomaly_detected ? `${a.persistence_days} consecutive day${a.persistence_days > 1 ? "s" : ""}` : "Normal"}
                    </p>
                  </div>
                  {a.anomaly_detected && a.persistence_days >= 3 && (
                    <span className="badge-sla-breach">Persistent Alert</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department Risk Ranking */}
        <div className="card-clinical p-6">
          <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Department Risk Ranking
          </h3>
          {departmentRisks.length === 0 ? (
            <div className="empty-state py-12">
              <Activity className="mb-3 h-8 w-8 text-muted-foreground/40" />
              <p className="font-medium text-foreground">Risk ranking unavailable</p>
              <p className="text-sm text-center text-muted-foreground">
                Composite risk scores (sentiment × spike × frequency × SLA) will rank departments by priority
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {departmentRisks.map((d, i) => (
                <div key={d.department} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{d.department}</p>
                    <p className="text-xs text-muted-foreground">Top cluster: {d.top_cluster}</p>
                  </div>
                  <div className="w-20">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-muted-foreground">Risk</span>
                      <span className="font-medium text-foreground">{(d.risk_score * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={d.risk_score * 100} className="h-1.5" />
                  </div>
                  <span className={`text-xs ${
                    d.trend === "rising" ? "text-red-500" : d.trend === "falling" ? "text-emerald-500" : "text-muted-foreground"
                  }`}>
                    {d.trend === "rising" ? "↑" : d.trend === "falling" ? "↓" : "→"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;

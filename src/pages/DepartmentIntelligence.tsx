import { useState } from "react";
import {
  Building2,
  AlertTriangle,
  TrendingUp,
  Activity,
  ChevronRight,
  ShieldAlert,
  Clock,
  MessageSquare,
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  XCircle,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// ── Types for API integration ──
interface Cluster {
  id: string;
  summary: string;
  complaint_count: number;
  severity: "critical" | "high" | "medium" | "low";
  risk_score: number;
  spike_status: "normal" | "anomaly" | "persistent";
  sla_remaining_hours: number | null;
  status: "active" | "monitoring" | "resolved";
  resolved_at: string | null;
  feedback_loop?: {
    pre_avg: number;
    post_avg: number;
    delta: number;
    status: "improvement" | "stable" | "regression";
  };
  messages: ClusterMessage[];
}

interface ClusterMessage {
  id: string;
  text: string;
  source: string;
  timestamp: string;
  sentiment_score: number;
}

interface Department {
  id: string;
  name: string;
  active_clusters: number;
  risk_score: number;
  anomaly_detected: boolean;
  forecast_risk: boolean;
  total_feedback: number;
}

const severityConfig = {
  critical: { label: "Critical", class: "badge-sla-breach" },
  high: { label: "High", class: "badge-negative" },
  medium: { label: "Medium", class: "badge-neutral" },
  low: { label: "Low", class: "badge-positive" },
};

const spikeConfig = {
  normal: { label: "Normal", icon: CheckCircle2, color: "text-emerald-500" },
  anomaly: { label: "Spike Detected", icon: AlertTriangle, color: "text-amber-500" },
  persistent: { label: "Persistent Alert", icon: ShieldAlert, color: "text-red-500" },
};

const feedbackStatusConfig = {
  improvement: { label: "Improving", color: "text-emerald-600", bg: "bg-emerald-50" },
  stable: { label: "Stable", color: "text-amber-600", bg: "bg-amber-50" },
  regression: { label: "Regression", color: "text-red-600", bg: "bg-red-50" },
};

const DepartmentIntelligence = () => {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);

  // Empty state — ready for API integration
  // Replace with: const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: fetchDepartments })
  const departments: Department[] = [];
  // Replace with: const { data: clusters } = useQuery({ queryKey: ['clusters', selectedDept?.id], queryFn: () => fetchClusters(selectedDept!.id), enabled: !!selectedDept })
  const clusters: Cluster[] = [];

  if (selectedDept) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Back + Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedDept(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{selectedDept.name} — Cluster Intelligence</h1>
            <p className="text-sm text-muted-foreground">
              AI-grouped complaint patterns • {selectedDept.active_clusters} active clusters
            </p>
          </div>
        </div>

        {/* Cluster Cards */}
        {clusters.length === 0 ? (
          <div className="card-clinical p-8">
            <div className="empty-state py-16">
              <BarChart3 className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-medium text-foreground">No clusters detected</p>
              <p className="text-sm max-w-md text-center text-muted-foreground">
                When feedback arrives, the AI clustering engine will group similar complaints into actionable clusters
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {clusters.map((cluster) => {
              const sev = severityConfig[cluster.severity];
              const spike = spikeConfig[cluster.spike_status];
              const SpikeIcon = spike.icon;
              const isExpanded = expandedCluster === cluster.id;

              return (
                <div key={cluster.id} className="card-clinical overflow-hidden">
                  {/* Cluster Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">{cluster.summary}</h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={sev.class}>{sev.label}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" /> {cluster.complaint_count} complaints
                          </span>
                          <span className={`text-xs flex items-center gap-1 ${spike.color}`}>
                            <SpikeIcon className="h-3 w-3" /> {spike.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                        <p className="text-2xl font-bold text-foreground">{(cluster.risk_score * 100).toFixed(0)}%</p>
                      </div>
                    </div>

                    {/* Risk + SLA bars */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                        <Progress value={cluster.risk_score * 100} className="h-2" />
                      </div>
                      {cluster.sla_remaining_hours !== null && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">SLA Remaining</p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className={`text-sm font-medium ${cluster.sla_remaining_hours < 4 ? "text-red-500" : "text-foreground"}`}>
                              {cluster.sla_remaining_hours}h remaining
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Feedback Loop Visualization */}
                    {cluster.status === "monitoring" && cluster.feedback_loop && (
                      <div className={`rounded-lg p-4 ${feedbackStatusConfig[cluster.feedback_loop.status].bg}`}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-muted-foreground">Post-Resolution Monitoring</p>
                          <span className={`text-xs font-semibold ${feedbackStatusConfig[cluster.feedback_loop.status].color}`}>
                            {feedbackStatusConfig[cluster.feedback_loop.status].label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Pre: {cluster.feedback_loop.pre_avg.toFixed(1)}/day</span>
                              <span>Post: {cluster.feedback_loop.post_avg.toFixed(1)}/day</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                              <div className="bg-primary/60 h-full" style={{ width: "50%" }} />
                              <div
                                className={`h-full ${
                                  cluster.feedback_loop.delta < 0 ? "bg-emerald-400" : "bg-red-400"
                                }`}
                                style={{ width: "50%" }}
                              />
                            </div>
                          </div>
                          <p className={`text-lg font-bold ${feedbackStatusConfig[cluster.feedback_loop.status].color}`}>
                            {cluster.feedback_loop.delta > 0 ? "+" : ""}
                            {(cluster.feedback_loop.delta * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpandedCluster(isExpanded ? null : cluster.id)}
                      className="flex items-center gap-1 mt-4 text-sm text-primary hover:underline"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      {isExpanded ? "Hide" : "View"} grouped messages ({cluster.messages.length})
                    </button>
                  </div>

                  {/* Expanded Messages */}
                  {isExpanded && (
                    <div className="border-t border-border bg-secondary/30 divide-y divide-border">
                      {cluster.messages.map((msg) => (
                        <div key={msg.id} className="px-6 py-3 flex items-start gap-3">
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{msg.text}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground">{msg.source}</span>
                              <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                            </div>
                          </div>
                          <div className="w-16">
                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  msg.sentiment_score > 0.5 ? "bg-emerald-400" : msg.sentiment_score > 0 ? "bg-amber-400" : "bg-red-400"
                                }`}
                                style={{ width: `${Math.abs(msg.sentiment_score) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Department Intelligence</h1>
        <p className="text-sm text-muted-foreground">AI-powered complaint clustering and risk analysis by department</p>
      </div>

      {/* Department Grid */}
      {departments.length === 0 ? (
        <div className="card-clinical p-8">
          <div className="empty-state py-16">
            <Building2 className="mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="font-medium text-foreground">No department data available</p>
            <p className="text-sm max-w-md text-center text-muted-foreground">
              Department intelligence will activate once feedback data is connected. Each department will show active clusters, risk scores, anomaly indicators, and forecasts.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept)}
              className="card-clinical p-6 text-left hover:border-primary/40 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{dept.name}</h3>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              <div className="space-y-3">
                {/* Active Clusters */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Active Clusters</span>
                  <span className="text-sm font-semibold text-foreground">{dept.active_clusters}</span>
                </div>

                {/* Risk Score Meter */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Risk Score</span>
                    <span className="text-xs font-medium text-foreground">{(dept.risk_score * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={dept.risk_score * 100} className="h-1.5" />
                </div>

                {/* Indicators */}
                <div className="flex items-center gap-3 pt-1">
                  {dept.anomaly_detected && (
                    <span className="flex items-center gap-1 text-xs text-amber-500">
                      <AlertTriangle className="h-3 w-3" /> Anomaly
                    </span>
                  )}
                  {dept.forecast_risk && (
                    <span className="flex items-center gap-1 text-xs text-red-500">
                      <TrendingUp className="h-3 w-3" /> Forecast Risk
                    </span>
                  )}
                  {!dept.anomaly_detected && !dept.forecast_risk && (
                    <span className="flex items-center gap-1 text-xs text-emerald-500">
                      <Activity className="h-3 w-3" /> Normal
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentIntelligence;

import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  TrendingUp,
  Minus,
  MessageSquare,
  ArrowRight,
  Triangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeptData {
  id: string;
  name: string;
  totalFeedback: number;
  riskLevel: "High" | "Moderate" | "Low";
  spikeDetected: boolean;
  issues: number;
  slaBreaches: number;
  resolved: number;
}

const departments: DeptData[] = [
  { id: "emergency", name: "Emergency Room", totalFeedback: 0, riskLevel: "Low", spikeDetected: false, issues: 0, slaBreaches: 0, resolved: 0 },
  { id: "icu", name: "Intensive Care Unit", totalFeedback: 0, riskLevel: "Low", spikeDetected: false, issues: 0, slaBreaches: 0, resolved: 0 },
  { id: "opd", name: "OPD", totalFeedback: 0, riskLevel: "Low", spikeDetected: false, issues: 0, slaBreaches: 0, resolved: 0 },
  { id: "billing", name: "Billing", totalFeedback: 0, riskLevel: "Low", spikeDetected: false, issues: 0, slaBreaches: 0, resolved: 0 },
  { id: "pharmacy", name: "Pharmacy", totalFeedback: 0, riskLevel: "Low", spikeDetected: false, issues: 0, slaBreaches: 0, resolved: 0 },
  { id: "nursing", name: "Nursing", totalFeedback: 0, riskLevel: "Low", spikeDetected: false, issues: 0, slaBreaches: 0, resolved: 0 },
];

interface ClusterMessage {
  id: string;
  text: string;
  source: string;
  timestamp: string;
  sentimentScore: number;
}

interface Cluster {
  id: string;
  departmentId: string;
  summary: string;
  totalComplaints: number;
  severity: "low" | "medium" | "high" | "critical";
  riskScore: number;
  spikeStatus: boolean;
  slaRemaining: string;
  status: "active" | "monitoring" | "resolved";
  feedbackLoop?: {
    preAvg: number;
    postAvg: number;
    delta: number;
    trend: "improvement" | "stable" | "regression";
    daysMonitored: number;
  };
  messages: ClusterMessage[];
}

const clusters: Cluster[] = [];

const riskBadgeStyle = (level: string) => {
  if (level === "High") return "bg-red-100 text-red-600";
  if (level === "Moderate") return "bg-amber-100 text-amber-600";
  return "bg-emerald-100 text-emerald-600";
};

const severityBadge = (s: string) => {
  const map: Record<string, string> = {
    critical: "bg-red-500 text-white",
    high: "bg-red-400 text-white",
    medium: "bg-amber-400 text-white",
    low: "bg-emerald-500 text-white",
  };
  return map[s] || "bg-muted text-muted-foreground";
};

const trendIcon = (trend?: string) => {
  if (trend === "improvement") return <TrendingDown className="h-4 w-4 text-emerald-500" />;
  if (trend === "regression") return <TrendingUp className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-amber-500" />;
};

const trendLabel = (trend?: string) => {
  if (trend === "improvement") return "Improving";
  if (trend === "regression") return "Regression";
  return "Stable";
};

const trendColor = (trend?: string) => {
  if (trend === "improvement") return "text-emerald-600";
  if (trend === "regression") return "text-red-600";
  return "text-amber-600";
};

const CaseManagement = () => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);

  const totalIssues = departments.reduce((s, d) => s + d.issues, 0);
  const highRiskCount = departments.filter((d) => d.riskLevel === "High").length;
  const totalSLA = departments.reduce((s, d) => s + d.slaBreaches, 0);

  const deptClusters = clusters.filter((c) => c.departmentId === selectedDept);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Department Intelligence</h1>
        <p className="text-sm text-muted-foreground">
          Real-time overview of patient experience across all departments
        </p>
      </div>

      {!selectedDept ? (
        <>
          {/* Summary Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card-clinical p-5">
              <p className="text-sm text-muted-foreground mb-1">Total Active Issues</p>
              <p className="text-3xl font-bold text-foreground">{totalIssues}</p>
            </div>
            <div className="card-clinical p-5">
              <p className="text-sm text-muted-foreground mb-1">High Risk Departments</p>
              <p className="text-3xl font-bold text-red-500">{highRiskCount}</p>
            </div>
            <div className="card-clinical p-5">
              <p className="text-sm text-muted-foreground mb-1">SLA Breaches</p>
              <p className="text-3xl font-bold text-amber-500">{totalSLA}</p>
            </div>
          </div>

          {/* Department Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {departments.map((dept) => (
              <div key={dept.id} className="card-clinical p-5">
                {/* Top row: name + risk badge */}
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{dept.name}</h3>
                    <p className="text-sm text-muted-foreground">{dept.totalFeedback} total feedback</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskBadgeStyle(dept.riskLevel)}`}>
                    {dept.riskLevel}
                  </span>
                </div>

                {/* Spike indicator */}
                {dept.spikeDetected && (
                  <div className="mt-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      Unusual Pattern Detected
                    </span>
                  </div>
                )}

                {/* Metric boxes */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="rounded-lg border border-border bg-secondary/30 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Issues
                    </div>
                    <p className="text-xl font-bold text-foreground">{dept.issues}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Clock className="h-3.5 w-3.5" />
                      SLA
                    </div>
                    <p className="text-xl font-bold text-red-500">{dept.slaBreaches}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Triangle className="h-3.5 w-3.5" />
                      Resolved
                    </div>
                    <p className="text-xl font-bold text-emerald-500">{dept.resolved}</p>
                  </div>
                </div>

                {/* View Intelligence Board link */}
                <button
                  onClick={() => setSelectedDept(dept.id)}
                  className="mt-4 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-full justify-center"
                >
                  View Intelligence Board <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Cluster Intelligence Board */
        <div className="space-y-4">
          <Button variant="outline" size="sm" onClick={() => setSelectedDept(null)}>
            ← Back to Departments
          </Button>

          <h2 className="text-xl font-bold text-foreground">
            {departments.find((d) => d.id === selectedDept)?.name} — Cluster Board
          </h2>

          {deptClusters.length === 0 ? (
            <div className="card-clinical p-12 text-center">
              <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="font-medium text-foreground">No issue clusters detected</p>
              <p className="text-sm text-muted-foreground mt-1">
                Clusters will be generated automatically from incoming feedback
              </p>
            </div>
          ) : (
            deptClusters.map((cluster) => (
              <div key={cluster.id} className="card-clinical overflow-hidden">
                <button
                  onClick={() => setExpandedCluster(expandedCluster === cluster.id ? null : cluster.id)}
                  className="w-full p-5 text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${severityBadge(cluster.severity)}`}>
                          {cluster.severity.toUpperCase()}
                        </span>
                        {cluster.spikeStatus && (
                          <span className="rounded bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">⚡ Spike</span>
                        )}
                        {cluster.status === "monitoring" && (
                          <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">Monitoring</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground text-base">{cluster.summary}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {cluster.totalComplaints} complaints · Risk: {(cluster.riskScore * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> SLA
                        </div>
                        <p className="text-sm font-bold text-foreground">{cluster.slaRemaining}</p>
                      </div>
                      {expandedCluster === cluster.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>

                {expandedCluster === cluster.id && (
                  <div className="border-t border-border">
                    {cluster.feedbackLoop && (
                      <div className="p-5 border-b border-border bg-secondary/30">
                        <h4 className="text-sm font-semibold text-foreground mb-3">Feedback Loop Monitor</h4>
                        <div className="flex items-center gap-6">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>Pre-resolution avg</span>
                              <span>Post-resolution avg</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-8 rounded bg-red-500/20 flex items-center justify-center">
                                <span className="text-sm font-bold text-red-600">{cluster.feedbackLoop.preAvg.toFixed(1)}/day</span>
                              </div>
                              <span className="text-xs text-muted-foreground">→</span>
                              <div className="flex-1 h-8 rounded bg-emerald-500/20 flex items-center justify-center">
                                <span className="text-sm font-bold text-emerald-600">{cluster.feedbackLoop.postAvg.toFixed(1)}/day</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-center px-4">
                            <div className="flex items-center gap-1 mb-1">
                              {trendIcon(cluster.feedbackLoop.trend)}
                              <span className={`text-sm font-bold ${trendColor(cluster.feedbackLoop.trend)}`}>
                                {(cluster.feedbackLoop.delta * 100).toFixed(0)}%
                              </span>
                            </div>
                            <span className={`text-xs font-medium ${trendColor(cluster.feedbackLoop.trend)}`}>
                              {trendLabel(cluster.feedbackLoop.trend)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Day {cluster.feedbackLoop.daysMonitored}/14
                            <div className="h-1.5 w-20 rounded-full bg-secondary mt-1 overflow-hidden">
                              <div className="h-full rounded-full bg-primary" style={{ width: `${(cluster.feedbackLoop.daysMonitored / 14) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-5 space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Grouped Complaints ({cluster.messages.length})</h4>
                      {cluster.messages.map((msg) => (
                        <div key={msg.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/40">
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{msg.text}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span>{msg.source}</span>
                              <span>{msg.timestamp}</span>
                            </div>
                          </div>
                          <div className="w-20">
                            <div className="h-2 rounded-full bg-secondary overflow-hidden">
                              <div
                                className={`h-full rounded-full ${msg.sentimentScore > 0.5 ? "bg-emerald-500" : msg.sentimentScore > 0.3 ? "bg-amber-400" : "bg-red-500"}`}
                                style={{ width: `${msg.sentimentScore * 100}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-muted-foreground text-center mt-1">{(msg.sentimentScore * 100).toFixed(0)}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CaseManagement;

import { useState } from "react";
import {
  AlertTriangle,
  Activity,
  Clock,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  TrendingUp,
  Minus,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock department data (will be replaced by backend)
const departments = [
  { id: "opd", name: "OPD", clusters: 0, riskScore: 0, spikeDetected: false, slaBreaches: 0 },
  { id: "billing", name: "Billing", clusters: 0, riskScore: 0, spikeDetected: false, slaBreaches: 0 },
  { id: "pharmacy", name: "Pharmacy", clusters: 0, riskScore: 0, spikeDetected: false, slaBreaches: 0 },
  { id: "nursing", name: "Nursing", clusters: 0, riskScore: 0, spikeDetected: false, slaBreaches: 0 },
  { id: "facilities", name: "Facilities", clusters: 0, riskScore: 0, spikeDetected: false, slaBreaches: 0 },
];

// Mock clusters (empty — ready for backend)
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

const riskColor = (score: number) => {
  if (score >= 0.7) return "text-red-500";
  if (score >= 0.4) return "text-amber-500";
  return "text-emerald-500";
};

const riskBg = (score: number) => {
  if (score >= 0.7) return "bg-red-500/10 border-red-500/20";
  if (score >= 0.4) return "bg-amber-500/10 border-amber-500/20";
  return "bg-emerald-500/10 border-emerald-500/20";
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

  const deptClusters = clusters.filter((c) => c.departmentId === selectedDept);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Department Intelligence</h1>
        <p className="text-sm text-muted-foreground">
          Monitor department risk levels, issue clusters, and service recovery
        </p>
      </div>

      {/* Department Grid */}
      {!selectedDept ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className="card-clinical p-5 text-left transition-all hover:shadow-md hover:border-primary/30 group"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-lg">{dept.name}</h3>
                <div className={`rounded-full border px-3 py-1 text-xs font-medium ${riskBg(dept.riskScore)}`}>
                  <span className={riskColor(dept.riskScore)}>
                    {dept.riskScore >= 0.7 ? "High Risk" : dept.riskScore >= 0.4 ? "Medium Risk" : "Low Risk"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <MessageSquare className="h-4 w-4 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold text-foreground">{dept.clusters}</p>
                  <p className="text-[10px] text-muted-foreground">Clusters</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <Activity className={`h-4 w-4 mx-auto mb-1 ${dept.spikeDetected ? "text-red-500" : "text-muted-foreground"}`} />
                  <p className="text-lg font-bold text-foreground">{dept.spikeDetected ? "Yes" : "No"}</p>
                  <p className="text-[10px] text-muted-foreground">Spike</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <ShieldAlert className={`h-4 w-4 mx-auto mb-1 ${dept.slaBreaches > 0 ? "text-red-500" : "text-muted-foreground"}`} />
                  <p className="text-lg font-bold text-foreground">{dept.slaBreaches}</p>
                  <p className="text-[10px] text-muted-foreground">SLA Breach</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Risk Score</span>
                  <div className="h-2 w-24 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${dept.riskScore >= 0.7 ? "bg-red-500" : dept.riskScore >= 0.4 ? "bg-amber-400" : "bg-emerald-500"}`}
                      style={{ width: `${dept.riskScore * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Clusters →
                </span>
              </div>
            </button>
          ))}
        </div>
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
                {/* Cluster Header */}
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
                          <span className="rounded bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">
                            ⚡ Spike
                          </span>
                        )}
                        {cluster.status === "monitoring" && (
                          <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
                            Monitoring
                          </span>
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

                {/* Expanded Content */}
                {expandedCluster === cluster.id && (
                  <div className="border-t border-border">
                    {/* Feedback Loop Monitoring */}
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
                                <span className="text-sm font-bold text-red-600">
                                  {cluster.feedbackLoop.preAvg.toFixed(1)}/day
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">→</span>
                              <div className="flex-1 h-8 rounded bg-emerald-500/20 flex items-center justify-center">
                                <span className="text-sm font-bold text-emerald-600">
                                  {cluster.feedbackLoop.postAvg.toFixed(1)}/day
                                </span>
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
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${(cluster.feedbackLoop.daysMonitored / 14) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Messages */}
                    <div className="p-5 space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">
                        Grouped Complaints ({cluster.messages.length})
                      </h4>
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
                            <p className="text-[10px] text-muted-foreground text-center mt-1">
                              {(msg.sentimentScore * 100).toFixed(0)}%
                            </p>
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

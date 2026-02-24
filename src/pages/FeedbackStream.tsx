import { useState } from "react";
import {
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  RefreshCw,
  Activity,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ── Types for API integration ──
interface ClusterGroup {
  cluster_id: string;
  summary: string;
  sentiment: "positive" | "negative";
  complaint_count: number;
  messages: {
    id: string;
    text: string;
    source: string;
    timestamp: string;
    sentiment_score: number;
  }[];
}

const FeedbackStream = () => {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);

  // Empty state — ready for API integration
  // Replace with: const { data: clusters } = useQuery(...)
  const positiveClusters: ClusterGroup[] = [];
  const negativeClusters: ClusterGroup[] = [];

  const stats = [
    { label: "Total", value: "0", icon: MessageSquare, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { label: "Positive", value: "0", icon: TrendingUp, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
    { label: "Negative", value: "0", icon: TrendingDown, iconBg: "bg-red-50", iconColor: "text-red-500" },
    { label: "Neutral", value: "0", icon: Minus, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
  ];

  const renderClusterColumn = (title: string, icon: React.ReactNode, clusters: ClusterGroup[], emptyMsg: string) => (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      {clusters.length === 0 ? (
        <div className="card-clinical p-6">
          <div className="empty-state py-12">
            <MessageSquare className="mb-3 h-8 w-8 text-muted-foreground/40" />
            <p className="font-medium text-foreground">No clusters yet</p>
            <p className="text-sm text-center text-muted-foreground">{emptyMsg}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {clusters.map((cluster) => {
            const isExpanded = expandedCluster === cluster.cluster_id;
            return (
              <div key={cluster.cluster_id} className="card-clinical overflow-hidden">
                <button
                  onClick={() => setExpandedCluster(isExpanded ? null : cluster.cluster_id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{cluster.summary}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {cluster.complaint_count} messages
                      </p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t border-border bg-secondary/30 divide-y divide-border">
                    {cluster.messages.map((msg) => (
                      <div key={msg.id} className="px-4 py-3">
                        <p className="text-sm text-foreground">{msg.text}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">{msg.source}</span>
                          <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                          <div className="flex-1" />
                          <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${msg.sentiment_score > 0 ? "bg-emerald-400" : "bg-red-400"}`}
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feedback Stream</h1>
          <p className="text-sm text-muted-foreground">Clustered feedback view — grouped by AI pattern analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-primary text-primary">
            <Activity className="h-4 w-4" /> Live
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card-clinical p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search feedback messages..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
            <option value="all">All Sources</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
          </select>
          <select value={sentimentFilter} onChange={(e) => setSentimentFilter(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
            <option value="all">All Depts</option>
            <option value="opd">OPD</option>
            <option value="billing">Billing</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="nursing">Nursing</option>
            <option value="facilities">Facilities</option>
          </select>
        </div>
      </div>

      {/* Split View: Positive | Negative */}
      <div className="grid gap-6 lg:grid-cols-2">
        {renderClusterColumn(
          "Positive Clusters",
          <ThumbsUp className="h-5 w-5 text-emerald-500" />,
          positiveClusters,
          "Positive feedback clusters will appear here when grouped by the AI engine"
        )}
        {renderClusterColumn(
          "Negative Clusters",
          <ThumbsDown className="h-5 w-5 text-red-500" />,
          negativeClusters,
          "Negative feedback clusters will appear here when grouped by the AI engine"
        )}
      </div>
    </div>
  );
};

export default FeedbackStream;

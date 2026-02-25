import { useState } from "react";
import { MessageSquare, AlertTriangle, FolderOpen, Clock, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const emptyBarData = [
  { dept: "OPD", total: 0, resolved: 0 },
  { dept: "Billing", total: 0, resolved: 0 },
  { dept: "Pharmacy", total: 0, resolved: 0 },
  { dept: "Nursing", total: 0, resolved: 0 },
  { dept: "Facilities", total: 0, resolved: 0 },
];

const emptyLineData = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), positive: 0, negative: 0 };
});

const emptyDailyNegative = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), count: 0 };
});

const timeRanges = ["Last 24 Hours", "Last 7 Days", "Last 30 Days"];

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const stats = [
    { label: "Total Feedback", value: "0", icon: MessageSquare, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { label: "Negative %", value: "—", icon: AlertTriangle, iconBg: "bg-red-50", iconColor: "text-red-500" },
    { label: "Active Cases", value: "0", icon: FolderOpen, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
    { label: "SLA Breaches", value: "0", icon: Clock, iconBg: "bg-purple-50", iconColor: "text-purple-500" },
  ];

  const handleExport = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("AAROGYA NETRA - Analytics Report", 20, 20);

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`Period: ${timeRange}`, 20, 36);

    doc.setFontSize(14);
    doc.text("Summary", 20, 50);

    doc.setFontSize(11);
    const summaryData = [
      `Total Feedback: ${stats[0].value}`,
      `Negative %: ${stats[1].value}`,
      `Active Cases: ${stats[2].value}`,
      `SLA Breaches: ${stats[3].value}`,
    ];
    summaryData.forEach((line, i) => {
      doc.text(line, 20, 60 + i * 8);
    });

    doc.setFontSize(10);
    doc.text("No additional data available for the selected period.", 20, 100);

    doc.save(`aarogya-netra-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">Comprehensive feedback insights and trends</p>
        </div>
        <div className="flex items-center gap-3">
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
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">— vs last period</p>
          </div>
        ))}
      </div>

      {/* Row 1: Sentiment Distribution + Department Issues */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Donut Chart */}
        <div className="card-clinical p-6">
          <h3 className="mb-4 font-semibold text-foreground">Sentiment Distribution</h3>
          <div className="flex items-center justify-center gap-8">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={[{ name: "No Data", value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  fill="hsl(204, 40%, 90%)"
                  dataKey="value"
                  stroke="none"
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">Positive</p>
                  <p className="text-xs text-muted-foreground">—</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div>
                  <p className="text-sm font-medium text-foreground">Neutral</p>
                  <p className="text-xs text-muted-foreground">—</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">Negative</p>
                  <p className="text-xs text-muted-foreground">—</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Issues Bar */}
        <div className="card-clinical p-6">
          <h3 className="mb-4 font-semibold text-foreground">Department-wise Issues</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={emptyBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(204, 40%, 90%)" />
              <XAxis dataKey="dept" tick={{ fontSize: 12, fill: "hsl(213, 30%, 45%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(213, 30%, 45%)" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Total Issues" fill="hsl(210, 80%, 55%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" name="Resolved" fill="hsl(152, 69%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Sentiment Trend + Daily Negative */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-clinical p-6">
          <h3 className="mb-4 font-semibold text-foreground">Sentiment Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={emptyLineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(204, 40%, 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(213, 30%, 45%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(213, 30%, 45%)" }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="positive" name="Positive %" stroke="hsl(152, 69%, 45%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="negative" name="Negative %" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card-clinical p-6">
          <h3 className="mb-4 font-semibold text-foreground">Daily Negative Feedback</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={emptyDailyNegative}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(204, 40%, 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(213, 30%, 45%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(213, 30%, 45%)" }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" name="Negative Count" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Issue Categories */}
      <div className="card-clinical p-6">
        <h3 className="mb-4 font-semibold text-foreground">Top Issue Categories</h3>
        <div className="empty-state py-12">
          <p className="text-sm text-muted-foreground">No issue categories available yet</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

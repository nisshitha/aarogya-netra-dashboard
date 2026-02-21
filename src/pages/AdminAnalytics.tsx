import { MessageSquare, TrendingDown, FolderOpen, AlertTriangle } from "lucide-react";
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

const SENTIMENT_COLORS = ["hsl(152, 69%, 40%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)"];

const emptyPieData = [
  { name: "Positive", value: 0 },
  { name: "Neutral", value: 0 },
  { name: "Negative", value: 0 },
];

const emptyBarData = [
  { dept: "OPD", issues: 0 },
  { dept: "Billing", issues: 0 },
  { dept: "Pharmacy", issues: 0 },
  { dept: "Nursing", issues: 0 },
  { dept: "Facilities", issues: 0 },
];

const emptyLineData = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), negative: 0 };
});

const AdminAnalytics = () => {
  const stats = [
    { label: "Total Feedback", value: "0", icon: MessageSquare, color: "text-info" },
    { label: "Negative %", value: "—", icon: TrendingDown, color: "text-destructive" },
    { label: "Active Cases", value: "0", icon: FolderOpen, color: "text-warning" },
    { label: "SLA Breaches", value: "0", icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Analytics</h1>
        <p className="text-sm text-muted-foreground">Sentiment trends, department performance, and SLA insights.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">Waiting for incoming data</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pie */}
        <div className="card-clinical p-6">
          <h3 className="mb-4 font-semibold text-foreground">Sentiment Distribution</h3>
          <div className="flex items-center justify-center" style={{ height: 240 }}>
            <div className="text-center">
              <ResponsiveContainer width={200} height={200}>
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
              <p className="text-sm text-muted-foreground -mt-4">No data available</p>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-4 text-xs">
            {emptyPieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SENTIMENT_COLORS[i] }} />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar */}
        <div className="card-clinical p-6">
          <h3 className="mb-4 font-semibold text-foreground">Department-wise Issues</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={emptyBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(204, 40%, 90%)" />
              <XAxis dataKey="dept" tick={{ fontSize: 12, fill: "hsl(213, 30%, 45%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(213, 30%, 45%)" }} />
              <Tooltip />
              <Bar dataKey="issues" fill="hsl(174, 84%, 32%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line */}
        <div className="card-clinical p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-foreground">Daily Negative Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={emptyLineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(204, 40%, 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(213, 30%, 45%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(213, 30%, 45%)" }} />
              <Tooltip />
              <Line type="monotone" dataKey="negative" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

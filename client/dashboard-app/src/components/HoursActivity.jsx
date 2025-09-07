import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import "../styles/HoursActivityCard.css";

const data = [
  { day: "Mo", hours: 4 },
  { day: "Tu", hours: 3 },
  { day: "We", hours: 5 },
  { day: "Th", hours: 8 },
  { day: "Fr", hours: 3 },
  { day: "Su", hours: 4 },
  { day: "Sa", hours: 1 },
];

export default function HoursActivityCard() {
  return (
    <div className="hours-activity-card">
      {/* Header */}
      <div className="card-header">
        <h3 className="card-title-activity">Hours Activity</h3>
        <div className="card-stats">
          <TrendingUp size={16} className="card-icon-status" />
          <span className="card-percentage">+12%</span>
          <span className="card-subtext">Compare to last week</span>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} domain={[0, 10]} />
            <Tooltip cursor={{ fill: "rgba(0, 227, 113, 0.05)" }} />
            <Bar dataKey="hours" fill="#69ddc8" radius={[20, 20, 20, 20]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

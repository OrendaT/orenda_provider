import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, LabelList } from "recharts";
import { motion } from "framer-motion";
import orendaLogo from "@/assets/orenda-logo-purple.png";
import zocdocLogo from "@/assets/zocdoc-logo.png";

const data = [
  { month: "January", rate: 46 },
  { month: "February", rate: 63 },
  { month: "Month-to-Date", rate: 67 },
];

const CustomLabel = (props: any) => {
  const { x, y, value } = props;
  return (
    <text x={x} y={y - 14} fill="hsl(var(--foreground))" textAnchor="middle" fontSize={15} fontWeight={700}>
      {value}%
    </text>
  );
};

export default function ZocdocConversionChart() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-lg p-6 sm:p-10"
      >
        {/* Logos */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <img src={orendaLogo} alt="Orenda logo" className="h-8 sm:h-10 object-contain" />
          <span className="text-muted-foreground text-xl font-light">×</span>
          <img src={zocdocLogo} alt="Zocdoc logo" className="h-6 sm:h-8 object-contain" />
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-foreground text-center mt-4 mb-1">
          Zocdoc Conversion Rate
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
          Appointment completion rate trending upward — now <span className="font-semibold text-foreground">20 points above</span> the 12-month average of 47%.
        </p>

        {/* Chart */}
        <div className="w-full h-[320px] sm:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 30, right: 30, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <YAxis
                domain={[30, 80]}
                tickFormatter={(v: number) => `${v}%`}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Conversion Rate"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <ReferenceLine
                y={47}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="6 4"
                strokeWidth={1.5}
                label={{
                  value: "12-Mo Avg: 47%",
                  position: "right",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--card))", strokeWidth: 3 }}
                activeDot={{ r: 8 }}
              >
                <LabelList content={<CustomLabel />} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Footer insight */}
        <div className="mt-6 bg-accent/40 rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Over the past 12 months, average conversion sat at <span className="font-semibold text-foreground">47%</span>. 
            Since January, we've seen a <span className="font-semibold text-foreground">consistent upward trend</span> — 
            now at <span className="font-semibold text-foreground">67% month-to-date</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

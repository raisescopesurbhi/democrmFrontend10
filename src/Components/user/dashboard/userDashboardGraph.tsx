/* ========================= DailyPerformanceTrends.tsx (RESPONSIVE) ========================= */
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  LineChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* ===================== Helpers ===================== */
const getLastNDays = (n: number) => {
  const days: string[] = [];
  // ✅ use real today by default (kept your logic easy to swap)
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split("T")[0]);
  }
  return days;
};

const generatePerformanceData = (days: any) => {
  return days
    .map((day: any) => ({
      date: day,
      deposit: Math.floor(Math.random() * 5000) + 1000,
      withdrawal: Math.floor(Math.random() * 3000) + 500,
      transfer: Math.floor(Math.random() * 2000) + 300,
      total: 0,
    }))
    .map((item: any) => ({
      ...item,
      total: item.deposit + item.withdrawal + item.transfer,
    }));
};

const CustomTooltip = ({
  active,
  payload,
  label,
  type,
}: {
  active: any;
  payload: any;
  label: any;
  type: any;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-sm border border-orange-500/30 p-3 rounded-lg shadow-xl">
        <p className="text-orange-400 font-semibold mb-2">{label}</p>

        {type === "performance" && (
          <>
            <p className="text-green-400">Deposit: ${payload[0]?.payload.deposit}</p>
            <p className="text-blue-400">Withdrawal: ${payload[0]?.payload.withdrawal}</p>
            <p className="text-purple-400">Transfer: ${payload[0]?.payload.transfer}</p>
          </>
        )}
      </div>
    );
  }
  return null;
};

/* ===================== Component ===================== */
const DailyPerformanceTrends = () => {
  const [chartType, setChartType] = useState<"all" | "line" | "area">("all");
  const [days, setDays] = useState(7);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const data = useMemo(() => generatePerformanceData(getLastNDays(days)), [days]);

  const renderChart = () => {
    const commonProps = { data, margin: { top: 5, right: 14, left: 0, bottom: 5 } };

    if (chartType === "area") {
      return (
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            tick={{ fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} width={40} />
          <Tooltip content={(props: any) => <CustomTooltip {...props} type="performance" />} />
          <Area type="monotone" dataKey="total" stroke="#f97316" strokeWidth={3} fill="url(#colorTotal)" />
        </AreaChart>
      );
    }

    return (
      <LineChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="date"
          stroke="#9ca3af"
          tick={{ fontSize: 11 }}
          interval="preserveStartEnd"
        />
        <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} width={40} />
        <Tooltip content={(props: any) => <CustomTooltip {...props} type="performance" />} />
        <Line type="natural" dataKey="total" stroke="url(#lineGradient)" strokeWidth={3} dot={{ fill: "#f97316", r: 3 }} />
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </LineChart>
    );
  };

  const Btn = ({
    active,
    children,
    onClick,
  }: {
    active?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        rounded-lg font-medium transition-all
        px-3 py-2 text-[12px]
        sm:px-4 sm:text-[13px]
        ${active ? "bg-gradient-to-r from-white/10 to-pink-400/80 text-white" : "bg-gradient-to-r from-white/10 to-pink-400/60 text-white"}
      `}
    >
      {children}
    </motion.button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        bg-gradient-to-br from-darkblue-800 to-darkblue-800
        rounded-2xl shadow-2xl
        p-4 sm:p-6
      "
    >
      {/* ✅ Responsive header: stacks on mobile */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h2 className="text-[18px] sm:text-2xl font-bold bg-gradient-to-r from-pink-400 via-green-500 to-purple-600 bg-clip-text text-transparent">
          Daily Performance Trends
        </h2>

        {/* ✅ Wrap buttons nicely on small screens */}
        <div className="flex flex-wrap items-center gap-2">
          <Btn active={chartType === "all"} onClick={() => setChartType("all")}>
            All
          </Btn>
          <Btn active={chartType === "line"} onClick={() => setChartType("line")}>
            Line
          </Btn>
          <Btn active={chartType === "area"} onClick={() => setChartType("area")}>
            Area
          </Btn>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="
                px-3 py-2 sm:px-4
                rounded-lg font-medium
                bg-gradient-to-r from-pink-500 to-purple-500 text-white
                flex items-center gap-2
                text-[12px] sm:text-[13px]
              "
            >
              <Filter size={16} />
              {days}d
            </motion.button>

            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 bg-green-600 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-10 min-w-[140px]"
              >
                {[7, 30, 90].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDays(d);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full px-5 py-2 text-left hover:bg-gradient-to-r hover:from-white/10 hover:to-blue-500/50 text-white transition-all text-[13px]"
                  >
                    {d} days
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Responsive chart height */}
      <ResponsiveContainer width="100%" height={280}>
        {renderChart()}
      </ResponsiveContainer>
    </motion.div>
  );
};

export default DailyPerformanceTrends;

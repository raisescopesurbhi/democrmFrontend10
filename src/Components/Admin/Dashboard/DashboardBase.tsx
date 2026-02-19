import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import { backendApi } from "../../../utils/apiClients";

// const THEME = {
//   bg0: "#0a0118",
//   bg1: "#1a0b2e",
//   bg2: "#16213e",
//   text: "#ffffff",
//   textMuted: "rgba(255,255,255,0.65)",
//   borderSoft: "rgba(255,255,255,0.15)",
//   gold: "#ffd700",
//   purple: "#a855f7",
//   pink: "#ec4899",
//   blue: "#3b82f6",
//   green: "#10b981",
//   orange: "#f97316",
//   red: "#ef4444",
//   teal: "#14b8a6",
// };
   const THEME = {
  bg0: "#0a0118",
  bg1: "#1a0b2e",
  bg2: "#16213e",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.65)",
  borderSoft: "rgba(255,255,255,0.15)",
  gold: "#ffd700",
  purple: "#a855f7",
  pink: "#ec4899",
  blue: "#3b82f6",
  // darkBlue: "#0b3a66",
  //    // ✅ added (deep dark blue)
  darkBlue: "#050B1E",   // super deep navy

  green: "#10b981",
  orange: "#f97316",
  red: "#ef4444",
  teal: "#14b8a6",
};

const AuroraBackdrop = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
    <div
      className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: "1s" }}
    ></div>
    <div
      className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: "2s" }}
    ></div>
  </div>
);

const formatNumber = (n) => (n || n === 0 ? Number(n).toLocaleString() : "-");

const AnimatedCounter = ({ value = 0, duration = 700, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start;
    let raf = 0;
    const total = Number(value || 0);

    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      setCount(Math.floor(total * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const CircularMetricCard = ({ icon, title, value, color, delay = 0 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`relative group transition-all duration-500 ${
        visible ? "scale-100 opacity-100" : "scale-0 opacity-0"
      }`}
    >
      {/* glow */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle, ${color}45, transparent 70%)` }}
      />
      {/* animated ring */}
      <div
        className="absolute -inset-2 rounded-full opacity-45 blur-[2px] animate-spin"
        style={{
          background: `conic-gradient(from 0deg, ${color}00, ${color}aa, ${color}00)`,
          animationDuration: "3.5s",
        }}
      />
      {/* circle */}
      <div
        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center cursor-pointer
                   transition-all duration-300 ease-out group-hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${color}20, ${color}06)`,
          border: `2px solid ${color}55`,
          boxShadow: `0 0 18px ${color}45, inset 0 0 18px ${color}14`,
        }}
      >
        <div
          className="mb-1 text-lg sm:text-xl"
          style={{ filter: `drop-shadow(0 0 10px ${color})` }}
        >
          {icon}
        </div>
        <div className="text-lg sm:text-xl font-bold" style={{ color: THEME.text }}>
          {value}
        </div>
        <div className="text-[10px] sm:text-[11px] text-center px-2 mt-1" style={{ color: THEME.textMuted }}>
          {title}
        </div>
      </div>
    </div>
  );
};

const CircularProgressRing = ({ percentage, color, size = 120, title, value }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const r = Math.max(20, size / 2 - 18);
  const strokeW = 10;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-700 ${
        animated ? "scale-100 rotate-0" : "scale-0 -rotate-180"
      }`}
      style={{ width: size, height: size }}
    >
      {/* glow */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-50 hover:opacity-80 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle, ${color}45, transparent 70%)` }}
      />
      {/* animated ring */}
      <div
        className="absolute -inset-2 rounded-full opacity-45 blur-[2px] animate-spin"
        style={{
          background: `conic-gradient(from 0deg, ${color}00, ${color}aa, ${color}00)`,
          animationDuration: "4s",
        }}
      />
      <div
        className="relative rounded-full transition-transform duration-300 hover:scale-105"
        style={{ boxShadow: `0 0 18px ${color}45, inset 0 0 14px ${color}12` }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${color}20`} strokeWidth={strokeW} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
            strokeDasharray={circumference}
            strokeDashoffset={animated ? offset : circumference}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 10px ${color})`,
              transition: "stroke-dashoffset 1.5s ease-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold" style={{ color }}>
            {percentage}%
          </div>
          <div className="text-[10px] mt-1" style={{ color: THEME.textMuted }}>
            {title}
          </div>
          <div className="text-[11px] font-semibold mt-1" style={{ color: THEME.text }}>
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};

const PieChart = ({ data }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  const slices = data.map((item) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const startX = 150 + 90 * Math.cos((startAngle * Math.PI) / 180);
    const startY = 150 + 90 * Math.sin((startAngle * Math.PI) / 180);
    const endX = 150 + 90 * Math.cos((endAngle * Math.PI) / 180);
    const endY = 150 + 90 * Math.sin((endAngle * Math.PI) / 180);

    const largeArc = angle > 180 ? 1 : 0;
    const pathData = [`M 150 150`, `L ${startX} ${startY}`, `A 90 90 0 ${largeArc} 1 ${endX} ${endY}`, `Z`].join(
      " "
    );
    currentAngle = endAngle;

    const midAngle = startAngle + angle / 2;
    const labelX = 150 + 62 * Math.cos((midAngle * Math.PI) / 180);
    const labelY = 150 + 62 * Math.sin((midAngle * Math.PI) / 180);

    return {
      pathData,
      color: item.color,
      labelX,
      labelY,
      percentage: percentage.toFixed(1),
      name: item.name,
    };
  });

  return (
    <div className="relative">
      <div className="max-w-[280px] mx-auto">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <circle cx="150" cy="150" r="56" fill={THEME.bg2} />
          {slices.map((slice, index) => (
            <g key={index}>
              <path
                d={slice.pathData}
                fill={slice.color}
                opacity={animated ? 0.8 : 0}
                className="transition-opacity duration-1000 hover:opacity-100 cursor-pointer"
                style={{
                  filter: `drop-shadow(0 0 8px ${slice.color}50)`,
                  transitionDelay: `${index * 100}ms`,
                }}
              />
              {animated && Number(slice.percentage) > 5 && (
                <text
                  x={slice.labelX}
                  y={slice.labelY}
                  fill={THEME.text}
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {slice.percentage}%
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-3 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: item.color }}></div>
            <span style={{ color: THEME.textMuted }} className="text-xs">
              {item.name}:{" "}
              <span style={{ color: THEME.text }} className="font-semibold">
                {formatNumber(item.value)}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RadialBars = ({ data }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const maxValue = Math.max(1, ...data.map((d) => d.value || 0));

  return (
    <div className="relative">
      <div className="max-w-[320px] mx-auto">
        <svg viewBox="0 0 300 200" className="w-full">
          {data.map((item, index) => {
            const percentage = ((item.value || 0) / maxValue) * 100;
            const radius = 70 - index * 16;
            const circumference = 2 * Math.PI * radius * 0.75;
            const offset = circumference - (percentage / 100) * circumference;

            return (
              <g key={index}>
                <path
                  d={`M ${150 - radius} 150 A ${radius} ${radius} 0 0 1 ${150 + radius} 150`}
                  fill="none"
                  stroke={`${item.fill}30`}
                  strokeWidth="14"
                />
                <path
                  d={`M ${150 - radius} 150 A ${radius} ${radius} 0 0 1 ${150 + radius} 150`}
                  fill="none"
                  stroke={item.fill}
                  strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={animated ? offset : circumference}
                  strokeLinecap="round"
                  style={{
                    filter: `drop-shadow(0 0 6px ${item.fill})`,
                    transition: "stroke-dashoffset 1.5s ease-out",
                    transitionDelay: `${index * 200}ms`,
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>  

      <div className="mt-3 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: item.fill }}></div>
              <span style={{ color: THEME.textMuted }} className="text-xs">
                {item.name}
              </span>
            </div>
            <span style={{ color: THEME.text }} className="text-xs font-semibold">
              {formatNumber(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
);

const SmallMoneyCard = ({ icon, title, color, value }) => {
  return (
    <div
      className="relative rounded-xl p-4 transition-all duration-300 hover:scale-[1.03]"
      style={{
        background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,
        border: `1px solid ${color}55`,
        boxShadow: `0 0 18px ${color}30, 0 8px 28px rgba(0,0,0,0.35)`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-transform duration-300 hover:scale-110"
          style={{
            background: `${color}20`,
            border: `1px solid ${color}55`,
            boxShadow: `0 0 14px ${color}35, inset 0 0 12px ${color}15`,
          }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold" style={{ color: THEME.textMuted }}>
            {title}
          </div>
          <div className="text-xl font-bold truncate" style={{ color }}>
            <AnimatedCounter value={value} prefix="$" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardBase() {
  const [userReport, setUserReport] = useState(null);
  const [depositReport, setDepositReport] = useState(null);
  const [withdrawalReport, setWithdrawalReport] = useState(null);
  const [ibWithdrawalReport, setIbWithdrawalReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ✅ Same as your 1st code
  const token = useMemo(() => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("admin_password_ref");
    }
    return null;
  }, []);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const axiosConfig = useMemo(
    () => ({
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "x-api-key": API_KEY,
      },
    }),
    [token, API_KEY]
  );

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setErr("");

      const [userRes, depRes, wdrRes, ibRes] = await Promise.allSettled([
        backendApi.get(`/admin/user-report`, axiosConfig),
        backendApi.get(`/admin/deposit-report`, axiosConfig),
        backendApi.get(`/admin/withdrawal-report`, axiosConfig),
        backendApi.get(`/admin/ib-withdrawal-report`, axiosConfig),
      ]);

      if (userRes.status === "fulfilled") setUserReport(userRes.value?.data?.data || {});
      if (depRes.status === "fulfilled") setDepositReport(depRes.value?.data?.data || {});
      if (wdrRes.status === "fulfilled") setWithdrawalReport(wdrRes.value?.data?.data || {});
      if (ibRes.status === "fulfilled") setIbWithdrawalReport(ibRes.value?.data?.data || {});
    } catch (e) {
      console.error(e);
      setErr("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [API_URL, axiosConfig]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const totalUsers = userReport?.totalUsers ?? 0;
  const kycVerified = userReport?.kycVerified ?? 0;
  const kycUnverified = userReport?.kycUnverified ?? 0;
  const emailVerified = userReport?.emailVerified ?? 0;
  const emailUnverified = userReport?.emailUnverified ?? 0;
  const totalIbUsers = userReport?.totalIbUsers ?? 0;
  const totalReferralUsers = userReport?.totalReferralUsers ?? 0;

  const totalDeposits = Number(depositReport?.totalAmount ?? depositReport?.approved ?? 0);
  const totalWithdrawals = Number(withdrawalReport?.totalAmount ?? withdrawalReport?.approved ?? 0);

  const kycPercentage = totalUsers > 0 ? Math.round((kycVerified / totalUsers) * 100) : 0;
  const emailPercentage = totalUsers > 0 ? Math.round((emailVerified / totalUsers) * 100) : 0;

  const userDistributionData = [
    { name: "KYC Verified", value: kycVerified, color: THEME.blue },
    { name: "KYC Unverified", value: kycUnverified, color: THEME.purple },
    { name: "Email Verified", value: emailVerified, color: THEME.blue },
    { name: "Email Unverified", value: emailUnverified, color: THEME.orange },
  ].filter((item) => item.value > 0);

  const radialData = [
    { name: "Total Users", value: totalUsers, fill: THEME.blue },
    { name: "IB Users", value: totalIbUsers, fill: THEME.red },
    { name: "Referrals", value: totalReferralUsers, fill: THEME.teal
     },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.bg0 }}>
        <div className="animate-spin">
          <RefreshIcon />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: THEME.bg0 }}>
      <AuroraBackdrop />
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{
              background: `linear-gradient(135deg, ${THEME.gold}, ${THEME.purple})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Analytics Dashboard
          </h1>
          <p style={{ color: THEME.textMuted }} className="text-sm">
            Real-time insights and metrics
          </p>
          {err ? (
            <div className="mt-3 text-sm" style={{ color: THEME.orange }}>
              {err}
            </div>
          ) : null}
        </div>

        {/* circles (reduced size) */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <CircularMetricCard
            icon="👥"
            title="Total Users"
            value={<AnimatedCounter value={totalUsers} />}
            color={THEME.pink}
            delay={0}
          />
          <CircularMetricCard
            icon="✅"
            title="KYC Verified"
            value={<AnimatedCounter value={kycVerified} />}
            color={THEME.green}
            delay={1}
          />
          <CircularMetricCard
            icon="📧"
            title="Email Verified"
            value={<AnimatedCounter value={emailVerified} />}
            color={THEME.blue}
            delay={2}
          />
          <CircularMetricCard
            icon="🏆"
            title="IB Users"
            value={<AnimatedCounter value={totalIbUsers} />}
            color={THEME.orange}
            delay={3}
          />
          <CircularMetricCard
            icon="📈"
            title="Referrals"
            value={<AnimatedCounter value={totalReferralUsers} />}
            color={THEME.teal}
            delay={4}
          />
        </div>

        {/* rings (reduced size) */}
        <div className="flex flex-wrap justify-center gap-10 mb-10">
          <CircularProgressRing
            percentage={kycPercentage}
            color={THEME.green}
            title="KYC Completion"
            value={`${formatNumber(kycVerified)} / ${formatNumber(totalUsers)}`}
          />
          <CircularProgressRing
            percentage={emailPercentage}
            color={THEME.blue}    
            title="Email Verification"
            value={`${formatNumber(emailVerified)} / ${formatNumber(totalUsers)}`}
          />
        </div>

        {/* 4 horizontal money cards (reduced size) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 max-w-6xl mx-auto">
          <SmallMoneyCard icon="💵" title="Total Deposits" color={THEME.green} value={totalDeposits} />
          <SmallMoneyCard icon="👛" title="Total Withdrawals" color={THEME.red} value={totalWithdrawals} />
          <SmallMoneyCard icon="💵" title="Total Deposits" color={THEME.green} value={totalDeposits} />
          <SmallMoneyCard icon="👛" title="Total Withdrawals" color={THEME.red} value={totalWithdrawals} />
        </div>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 max-w-6xl mx-auto">
          <SmallMoneyCard icon="💵" title="Total Deposits" color={THEME.green} value={totalDeposits} />
          <SmallMoneyCard icon="👛" title="Total Withdrawals" color={THEME.red} value={totalWithdrawals} />
          <SmallMoneyCard icon="💵" title="Total Deposits" color={THEME.green} value={totalDeposits} />
          <SmallMoneyCard icon="👛" title="Total Withdrawals" color={THEME.red} value={totalWithdrawals} />
        </div> */}

        {/* charts cards (reduced size) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {userDistributionData.length > 0 && (
            <div
              className="p-4 rounded-3xl"
              style={{
                background: `linear-gradient(135deg, ${THEME.darkBlue}, ${THEME.bg2})`,
                border: `1px solid ${THEME.borderSoft}`,
                boxShadow: `0 8px 28px rgba(0,0,0,0.3)`,
              }}
            >
              <h3 className="text-base font-semibold mb-4 text-center" style={{ color: THEME.text }}>
                User Distribution
              </h3>
              <PieChart data={userDistributionData} />
            </div>
          )}

          <div
            className="p-4 rounded-3xl"
            style={{
              background: `linear-gradient(135deg, ${THEME.darkBlue}, ${THEME.bg2})`,
              border: `1px solid ${THEME.borderSoft}`,
              boxShadow: `0 8px 28px rgba(0,0,0,0.3)`,
            }}
          >
            <h3 className="text-base font-semibold mb-4 text-center" style={{ color: THEME.text }}>
              User Categories
            </h3>
            <RadialBars data={radialData} />
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${THEME.purple}, ${THEME.pink})`,
              color: THEME.text,
              boxShadow: `0 4px 20px ${THEME.purple}40`,
            }}
          >
            <RefreshIcon /> Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}

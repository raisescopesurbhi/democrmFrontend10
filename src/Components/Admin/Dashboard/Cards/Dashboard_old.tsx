import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import {
  Users as UsersIcon,
  UserCheck,
  UserX,
  MailCheck,
  MailX,
  Wallet,
  Banknote,
  CreditCard,
  ArrowDownRight,
  TrendingUp,
  Info as InfoIcon,
  RefreshCw,
} from "lucide-react";

/* ===================== THEME SHELL (Cyber Emerald) ===================== */
const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

const outerWrap =
  "relative min-h-screen overflow-hidden bg-black text-white";

const GradientBorder = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cx(
      "rounded-[28px] p-[1px]",
      "bg-gradient-to-br from-emerald-500/25 via-transparent to-cyan-500/15",
      className
    )}
  >
    {children}
  </div>
);

const Glass = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cx(
      "rounded-3xl border border-emerald-500/12 bg-black/45 backdrop-blur-2xl",
      "shadow-[0_0_70px_rgba(34,197,94,0.10)]",
      className
    )}
  >
    {children}
  </div>
);

const Chip = ({
  children,
  tone = "emerald",
}: {
  children: React.ReactNode;
  tone?: "emerald" | "cyan" | "rose";
}) => {
  const tones: Record<string, string> = {
    emerald: "bg-emerald-500/12 text-emerald-200 border-emerald-400/25",
    cyan: "bg-cyan-500/12 text-cyan-200 border-cyan-400/25",
    rose: "bg-rose-500/12 text-rose-200 border-rose-400/25",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold border",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
};

/* ===================== Ambient visuals (no flicker) ===================== */
const FloatingParticles = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        dur: Math.random() * 3 + 2,
        delay: Math.random() * 2,
        size: Math.random() > 0.7 ? 2 : 1,
        opacity: Math.random() * 0.7 + 0.15,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-emerald-400"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -120, opacity: [0, 1, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </div>
  );
};

const AnimatedGrid = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(34,197,94,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.18) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(120% 80% at 50% -10%, black 55%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(120% 80% at 50% -10%, black 55%, transparent 80%)",
      }}
    />
    <motion.div
      className="absolute inset-0 opacity-20"
      animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
      transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      style={{
        background:
          "repeating-linear-gradient(90deg, rgba(59,130,246,0.08) 0 2px, transparent 2px 8px)",
      }}
    />
  </div>
);

/* ===================== Helpers ===================== */
const monthsNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatNumber = (n: any) =>
  n || n === 0 ? Number(n).toLocaleString() : "-";

const formatMoney = (n: any) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

const normalizeMonthly = (row: any) => {
  if (row == null) return 0;
  if (typeof row === "number") return row;
  return Number(row.total ?? row.amount ?? row.value ?? row.approved ?? 0);
};

const pctChange = (arr: any[]) => {
  if (!Array.isArray(arr) || arr.length < 2) return 0;
  const prev = Number(arr[arr.length - 2]) || 0;
  const last = Number(arr[arr.length - 1]) || 0;
  if (prev === 0) return 0;
  return ((last - prev) / Math.abs(prev)) * 100;
};

const safeDiv = (num: number, den: number) => (den ? (num / den) * 100 : 0);

const InfoNote = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
    <InfoIcon className="w-4 h-4 mt-0.5 text-emerald-300" />
    <div>{children}</div>
  </div>
);

/* ===================== Tiny components ===================== */
const AnimatedCounter = ({ value = 0, duration = 700 }: { value?: any; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start: number | undefined;
    let raf = 0;
    const total = Number(value || 0);

    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      setCount(Math.floor(total * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span className="font-extrabold tabular-nums">{count.toLocaleString()}</span>;
};

const KPI = ({
  title,
  value,
  icon: Icon,
  isMoney = false,
  accent = "from-emerald-500 to-cyan-500",
}: any) => (
  <GradientBorder className="hover:opacity-100 transition">
    <Glass className="p-4 hover:border-emerald-400/20 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className={cx("p-2 rounded-xl bg-gradient-to-br", accent)}>
          <Icon className="w-5 h-5 text-black" />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-white/50">
          Live
        </span>
      </div>

      <div className="text-white/60 text-xs">{title}</div>

      <div className="text-2xl text-white mt-1">
        {isMoney ? (
          <span className="font-extrabold">{formatMoney(value)}</span>
        ) : (
          <AnimatedCounter value={Number(value || 0)} />
        )}
      </div>
    </Glass>
  </GradientBorder>
);

const Section = ({
  title,
  subtitle,
  right,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <GradientBorder className={className}>
    <Glass className="overflow-hidden">
      <div className="flex items-start justify-between px-5 sm:px-6 py-4 border-b border-emerald-500/10 bg-black/35">
        <div>
          <h3 className="text-white font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-white/45 mt-0.5">{subtitle}</p>}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </Glass>
  </GradientBorder>
);

/* ================================ MAIN ================================ */
export default function DashboardBase() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const [userReport, setUserReport] = useState<any>(null);
  const [depositReport, setDepositReport] = useState<any>(null);
  const [withdrawalReport, setWithdrawalReport] = useState<any>(null);
  const [ibWithdrawalReport, setIbWithdrawalReport] = useState<any>(null);

  const [depWdrMonthly, setDepWdrMonthly] = useState<any>(null);
  const [depWdrTotals, setDepWdrTotals] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const token = useMemo(() => localStorage.getItem("admin_password_ref"), []);
  const axiosConfig = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}`, "x-api-key": API_KEY } }),
    [token, API_KEY]
  );

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setErr("");

      const depWdrReq = axios
        .get(`${API_URL}/api/analytics/deposits-vs-withdrawals?months=12`, axiosConfig)
        .then((r) => r?.data?.data)
        .catch(() => null);

      const [userRes, depRes, wdrRes, ibRes, depWdrRes] = await Promise.allSettled([
        axios.get(`${API_URL}/api/auth/user-report`, axiosConfig),
        axios.get(`${API_URL}/api/auth/deposit-report`, axiosConfig),
        axios.get(`${API_URL}/api/auth/withdrawal-report`, axiosConfig),
        axios.get(`${API_URL}/api/auth/ib-withdrawal-report`, axiosConfig),
        depWdrReq,
      ]);

      if (userRes.status === "fulfilled") setUserReport(userRes.value?.data?.data || {});
      if (depRes.status === "fulfilled") setDepositReport(depRes.value?.data?.data || {});
      if (wdrRes.status === "fulfilled") setWithdrawalReport(wdrRes.value?.data?.data || {});
      if (ibRes.status === "fulfilled") setIbWithdrawalReport(ibRes.value?.data?.data || {});
      if (depWdrRes.status === "fulfilled" && depWdrRes.value) {
        setDepWdrMonthly(Array.isArray(depWdrRes.value.months) ? depWdrRes.value.months : null);
        setDepWdrTotals(depWdrRes.value.totals || null);
      }
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

  /* --------------------- Derived metrics -------------------- */
  const totalUsers = userReport?.totalUsers ?? 0;
  const kycVerified = userReport?.kycVerified ?? 0;
  const kycUnverified = userReport?.kycUnverified ?? 0;
  const emailVerified = userReport?.emailVerified ?? 0;
  const emailUnverified = userReport?.emailUnverified ?? 0;
  const totalIbUsers = userReport?.totalIbUsers ?? 0;
  const totalReferralUsers = userReport?.totalReferralUsers ?? 0;

  const depMonthlyRaw = depositReport?.monthly || depositReport?.months || null;
  const wdrMonthlyRaw = withdrawalReport?.monthly || withdrawalReport?.months || null;

  const monthlyDeposits = Array.isArray(depMonthlyRaw) ? depMonthlyRaw.map(normalizeMonthly) : null;
  const monthlyWithdrawals = Array.isArray(wdrMonthlyRaw) ? wdrMonthlyRaw.map(normalizeMonthly) : null;

  const totalDeposits =
    (monthlyDeposits?.reduce((s: number, v: number) => s + (Number(v) || 0), 0) || 0) ||
    Number(depositReport?.totalAmount ?? depositReport?.approved ?? 0);

  const totalWithdrawals =
    (monthlyWithdrawals?.reduce((s: number, v: number) => s + (Number(v) || 0), 0) || 0) ||
    Number(withdrawalReport?.totalAmount ?? withdrawalReport?.approved ?? 0);

  const chartTotalDeposits = depWdrTotals?.deposits ?? totalDeposits;
  const chartTotalWithdrawals = depWdrTotals?.withdrawals ?? totalWithdrawals;

  const depPending = depositReport?.pending ?? 0;
  const depRejected = depositReport?.rejected ?? 0;

  const wdrApproved = withdrawalReport?.approved ?? withdrawalReport?.totalAmount ?? 0;
  const wdrPending = withdrawalReport?.pending ?? 0;
  const wdrRejected = withdrawalReport?.rejected ?? 0;
  const wdrTotal = withdrawalReport?.total ?? 0;

  const ibApproved = ibWithdrawalReport?.approved ?? 0;
  const ibPending = ibWithdrawalReport?.pending ?? 0;
  const ibRejected = ibWithdrawalReport?.rejected ?? 0;
  const ibTodayApproved = ibWithdrawalReport?.todayApproved ?? 0;
  const ibLastWeekApproved = ibWithdrawalReport?.lastWeekApproved ?? 0;
  const ibLastMonthApproved = ibWithdrawalReport?.lastMonthApproved ?? 0;
  const ibTotal = ibWithdrawalReport?.total ?? 0;

  const labelFromMonth = (m: any, i: number) => {
    if (!m) return `M${i + 1}`;
    if (m.label) return m.label;
    if (m.month && typeof m.month === "string") {
      const d = new Date(`${m.month}-01T00:00:00Z`);
      const idx = Number.isNaN(d.getTime()) ? null : d.getUTCMonth();
      return idx != null ? monthsNames[idx] : `M${i + 1}`;
    }
    if (typeof m.monthIndex === "number") {
      return monthsNames[Math.max(0, Math.min(11, m.monthIndex - 1))];
    }
    return `M${i + 1}`;
  };

  const monthlyDepVsWdr = useMemo(() => {
    if (Array.isArray(depWdrMonthly) && depWdrMonthly.length) {
      return depWdrMonthly.map((m: any, i: number) => ({
        name: labelFromMonth(m, i),
        deposits: Number(m.deposits || 0),
        withdrawals: Number(m.withdrawals || 0),
      }));
    }

    if (
      Array.isArray(depMonthlyRaw) &&
      Array.isArray(wdrMonthlyRaw) &&
      depMonthlyRaw.length &&
      wdrMonthlyRaw.length
    ) {
      const len = Math.min(depMonthlyRaw.length, wdrMonthlyRaw.length, 12);
      return Array.from({ length: len }, (_, i) => ({
        name: monthsNames[i] ?? `M${i + 1}`,
        deposits: normalizeMonthly(depMonthlyRaw[i]),
        withdrawals: normalizeMonthly(wdrMonthlyRaw[i]),
      }));
    }

    return null;
  }, [depWdrMonthly, depMonthlyRaw, wdrMonthlyRaw]);

  const depChange = pctChange(monthlyDepVsWdr?.map((d: any) => d.deposits) || []);
  const wdrChange = pctChange(monthlyDepVsWdr?.map((d: any) => d.withdrawals) || []);

  const userBarData = [
    { title: "Total Users", value: totalUsers },
    { title: "KYC Verified", value: kycVerified },
    { title: "KYC Unverified", value: kycUnverified },
    { title: "Email Verified", value: emailVerified },
    { title: "Email Unverified", value: emailUnverified },
    { title: "IB Users", value: totalIbUsers },
    { title: "Referrals", value: totalReferralUsers },
  ];

  const ibBarData = [
    { name: "Approved", value: Number(ibApproved || 0) },
    { name: "Pending", value: Number(ibPending || 0) },
    { name: "Rejected", value: Number(ibRejected || 0) },
  ];

  const mt5Radial = [
    {
      name: "KYC",
      pct: Number(safeDiv(kycVerified, totalUsers).toFixed(1)),
      fill: "#10b981",
    },
    {
      name: "Email",
      pct: Number(safeDiv(emailVerified, totalUsers).toFixed(1)),
      fill: "#3b82f6",
    },
    {
      name: "IB",
      pct: Number(safeDiv(totalIbUsers, totalUsers).toFixed(1)),
      fill: "#f59e0b",
    },
  ];

  const tickerItems = [
    { symbol: "DEPOSITS", price: chartTotalDeposits, change24h: depChange || 0 },
    { symbol: "WITHDRAWALS", price: chartTotalWithdrawals, change24h: wdrChange || 0 },
    { symbol: "USERS", price: totalUsers, change24h: 0 },
    { symbol: "IB APPROVED", price: ibApproved, change24h: 0 },
  ];

  return (
    <motion.div
      className={outerWrap}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black via-emerald-950/30 to-black pointer-events-none" />
      <AnimatedGrid />
      <FloatingParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 pb-4 backdrop-blur-md bg-gradient-to-b from-black/80 via-black/55 to-transparent border-b border-emerald-500/10">
          <GradientBorder>
            <Glass className="p-4 sm:p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-[11px] text-emerald-200/55 font-semibold tracking-wider">
                    Admin / Analytics
                  </div>

                  <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                    <span className="bg-gradient-to-r from-emerald-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                      Dashboard
                    </span>
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Chip>Live Overview</Chip>
                    {err ? (
                      <Chip tone="rose">{err}</Chip>
                    ) : (
                      <Chip tone="emerald">All systems normal</Chip>
                    )}
                  </div>
                </div>

                <button
                  onClick={fetchAll}
                  disabled={loading}
                  className={cx(
                    "inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl",
                    "border border-emerald-500/12 bg-white/5 text-white/85",
                    "hover:bg-white/10 transition",
                    loading && "opacity-60 cursor-not-allowed"
                  )}
                >
                  <RefreshCw className={cx("w-4 h-4", loading && "animate-spin")} />
                  {loading ? "Refreshing…" : "Refresh"}
                </button>
              </div>
            </Glass>
          </GradientBorder>
        </div>

        {/* Ticker */}
        {/* <div className="mt-5">
          <GradientBorder>
            <Glass className="relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, rgba(34,197,94,0.15) 0 2px, transparent 2px 8px)",
                }}
              />
              <div className="whitespace-nowrap animate-[marquee_24s_linear_infinite] py-3">
                {[...tickerItems, ...tickerItems].map((c, i) => {
                  const up = c.change24h >= 0;
                  return (
                    <span key={c.symbol + i} className="inline-flex items-center mx-5 gap-2 text-sm">
                      <span className="font-mono text-white/70">{c.symbol}</span>
                      <span className="font-semibold">{formatNumber(c.price)}</span>
                      <span
                        className={cx(
                          "px-2 py-0.5 rounded-full text-xs border",
                          up
                            ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/25"
                            : "bg-rose-500/15 text-rose-200 border-rose-400/25"
                        )}
                      >
                        {up ? "▲" : "▼"} {Math.abs(c.change24h).toFixed(2)}%
                      </span>
                    </span>
                  );
                })}
              </div>
              <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
            </Glass>
          </GradientBorder>
        </div> */}

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <KPI title="Total Users" value={totalUsers} icon={UsersIcon} accent="from-emerald-400 to-teal-500" />
          <KPI title="KYC Verified" value={kycVerified} icon={UserCheck} accent="from-cyan-400 to-sky-500" />
          <KPI title="Total Deposits" value={totalDeposits} icon={CreditCard} isMoney accent="from-blue-400 to-indigo-500" />
          <KPI title="Total Withdrawals" value={totalWithdrawals} icon={ArrowDownRight} isMoney accent="from-amber-400 to-orange-500" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          {/* User Information */}
          <Section title="User Information" subtitle="Quick user health snapshot">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Total Users", value: totalUsers, icon: <UsersIcon size={20} /> },
                { title: "KYC Verified", value: kycVerified, icon: <UserCheck size={20} /> },
                { title: "KYC Unverified", value: kycUnverified, icon: <UserX size={20} /> },
                { title: "Email Verified", value: emailVerified, icon: <MailCheck size={20} /> },
                { title: "Email Unverified", value: emailUnverified, icon: <MailX size={20} /> },
                { title: "IB Users", value: totalIbUsers, icon: <Wallet size={20} /> },
                { title: "Referrals", value: totalReferralUsers, icon: <Banknote size={20} /> },
              ].map((c, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 border border-white/10 bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/80">{c.title}</div>
                    <div className="text-emerald-300">{c.icon}</div>
                  </div>
                  <div className="mt-1 text-xl font-black">{formatNumber(c.value)}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* User Report Overview */}
          <Section title="User Report Overview" subtitle="Distribution (counts)">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userBarData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="title" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#0b1220",
                      border: "1px solid rgba(34,197,94,0.35)",
                      borderRadius: 12,
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="value" fill="#06b6d4" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          {/* Deposit & Withdraw Report */}
          {/* <Section
            title="Deposit & Withdraw Report"
            subtitle="Totals, pending, and rejected"
          >
            <div className="grid grid-cols-2 gap-3">
              {[
                { t: "Deposits (Total)", v: totalDeposits, money: true },
                { t: "Deposits Pending", v: depPending, money: true },
                { t: "Deposits Rejected", v: depRejected, money: true },
                { t: "Withdrawals (Total)", v: totalWithdrawals, money: true },
                { t: "Withdraw Approved", v: wdrApproved, money: true },
                { t: "Withdraw Pending", v: wdrPending, money: true },
                { t: "Withdraw Rejected", v: wdrRejected, money: true },
              ].map((x, i) => (
                <div key={i} className="rounded-2xl p-3 border border-white/10 bg-white/5">
                  <div className="text-[12px] text-white/60">{x.t}</div>
                  <div className="text-lg font-black">
                    {x.money ? formatMoney(x.v) : formatNumber(x.v)}
                  </div>
                </div>
              ))}
            </div>
          </Section> */}

          {/* Deposits vs Withdrawals */}
          {/* <Section
            title="Deposits vs Withdrawals"
            subtitle="Monthly series (preferred), totals fallback"
            right={
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-xl bg-blue-500/10 border border-blue-400/25">
                  <span className="text-white/60 mr-1">Deposits:</span>
                  <span className="font-black text-blue-300">{formatMoney(chartTotalDeposits)}</span>
                </span>
                <span className="px-2 py-1 rounded-xl bg-rose-500/10 border border-rose-400/25">
                  <span className="text-white/60 mr-1">Withdrawals:</span>
                  <span className="font-black text-rose-300">{formatMoney(chartTotalWithdrawals)}</span>
                </span>
              </div>
            }
          >
            {Array.isArray(monthlyDepVsWdr) && monthlyDepVsWdr.length > 1 ? (
              <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyDepVsWdr} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaDeposits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="areaWithdrawals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                    <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(val: any, name: any) => [
                        formatMoney(val),
                        name === "deposits" ? "Deposits" : "Withdrawals",
                      ]}
                      contentStyle={{
                        background: "#0b1220",
                        border: "1px solid rgba(34,197,94,0.35)",
                        borderRadius: 12,
                        color: "#fff",
                      }}
                    />
                    <Legend formatter={(v: any) => (v === "deposits" ? "Deposits" : "Withdrawals")} />
                    <Area type="monotone" dataKey="deposits" stroke="#3b82f6" strokeWidth={2} fill="url(#areaDeposits)" />
                    <Area type="monotone" dataKey="withdrawals" stroke="#ef4444" strokeWidth={2} fill="url(#areaWithdrawals)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ name: "Totals", Deposits: chartTotalDeposits, Withdrawals: chartTotalWithdrawals }]}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                    <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#0b1220",
                        border: "1px solid rgba(34,197,94,0.35)",
                        borderRadius: 12,
                        color: "#fff",
                      }}
                      formatter={(val: any, key: any) => [formatMoney(val), key]}
                    />
                    <Legend />
                    <Bar dataKey="Deposits" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="Withdrawals" fill="#ef4444" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                {!monthlyDepVsWdr && (
                  <div className="mt-3">
                    <InfoNote>
                      Showing totals because the unified endpoint{" "}
                      <code className="mx-1 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                        GET /api/analytics/deposits-vs-withdrawals?months=12
                      </code>{" "}
                      didn’t return a monthly array. Return:
                      <code className="ml-2 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                        data.months = [&#123; month:"YYYY-MM", label:"Jan", deposits:Number, withdrawals:Number &#125;]
                      </code>
                      {" "}and optional{" "}
                      <code className="bg-black/40 px-2 py-0.5 rounded border border-white/10">
                        data.totals
                      </code>.
                    </InfoNote>
                  </div>
                )}
              </div>
            )}
          </Section> */}

          {/* IB Withdrawal Report */}
          {/* <Section title="IB Withdrawal Report" subtitle="Counts breakdown + recency">
            <div className="grid grid-cols-2 gap-3">
              {[
                { t: "Approved", v: ibApproved },
                { t: "Pending", v: ibPending },
                { t: "Rejected", v: ibRejected },
                { t: "Today Approved", v: ibTodayApproved },
                { t: "Last Week Approved", v: ibLastWeekApproved },
                { t: "Last Month Approved", v: ibLastMonthApproved },
                { t: "Total", v: ibTotal },
              ].map((x, i) => (
                <div key={i} className="rounded-2xl p-3 border border-white/10 bg-white/5">
                  <div className="text-[12px] text-white/60">{x.t}</div>
                  <div className="text-lg font-black">{formatNumber(x.v)}</div>
                </div>
              ))}
            </div>
          </Section> */}

          {/* IB Status Bar */}
          {/* <Section title="IB Withdrawal (Status)" subtitle="Approved / Pending / Rejected">
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ibBarData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ibBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.95} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.25} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#0b1220",
                      border: "1px solid rgba(139,92,246,0.45)",
                      borderRadius: 12,
                      color: "#fff",
                    }}
                    formatter={(v: any) => [formatNumber(v), "Count"]}
                  />
                  <Bar dataKey="value" fill="url(#ibBar)" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section> */}

          {/* MT5 Radial
          <Section title="MT5 Accounts Report" subtitle="% of total users" right={<Chip tone="cyan">% of total</Chip>}>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="35%"
                  outerRadius="95%"
                  startAngle={90}
                  endAngle={-270}
                  barCategoryGap="15%"
                  data={mt5Radial}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="pct" cornerRadius={10} />
                  <Legend
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                    wrapperStyle={{ color: "#fff" }}
                    formatter={(value: any, entry: any) => (
                      <span style={{ color: "#d1d5db" }}>
                        {value}:{" "}
                        <b style={{ color: entry?.payload?.fill }}>{entry?.payload?.pct}%</b>
                      </span>
                    )}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </Section> */}

          {/* Withdrawal Summary */}
          {/* <Section title="Withdrawal Summary" subtitle="Total / Approved / Pending / Rejected">
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {[
                { t: "Total", v: wdrTotal },
                { t: "Approved", v: wdrApproved },
                { t: "Pending", v: wdrPending },
                { t: "Rejected", v: wdrRejected },
              ].map((x, i) => (
                <li key={i} className="rounded-2xl p-3 border border-white/10 bg-white/5">
                  <div className="text-white/60">{x.t}</div>
                  <div className="text-lg font-black">{formatNumber(x.v)}</div>
                </li>
              ))}
            </ul>
          </Section> */}
        </div>

        {/* Loading overlay */}
        {/* <motion.div
          initial={false}
          animate={{
            opacity: loading ? 1 : 0,
            pointerEvents: loading ? "auto" : "none",
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm"
        >
          <div className="rounded-2xl border border-emerald-500/15 bg-black/60 px-6 py-4 text-white shadow-xl flex items-center gap-3">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
            Loading dashboard…
          </div>
        </motion.div> */}
      </div>
    </motion.div>
  );
}

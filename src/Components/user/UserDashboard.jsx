import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import UserDashboardBalanceCards from "./dashboard/UserDashboardCards";
import DailyPerformanceTrends from "./dashboard/userDashboardGraph";
import RecentTransactions from "./dashboard/userDashboardTransactions";
import TradeHistory from "./dashboard/userDashboardTrade";
import AccountList from "./dashboard/userDashboardAccounts";

import UseUserHook from "../../hooks/user/UseUserHook";
import { FloatingParticles } from "../../utils/FloatingParticles";
import { AnimatedGrid } from "../../utils/AnimatedGrid";

import { backendApi } from "../../utils/apiClients";

/* ===================== Helpers ===================== */
const cx = (...c) => c.filter(Boolean).join(" ");

const formatMoney = (n, max = 2) =>
  Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: max });

/* ===== Theme (used only for the header strip KPIs/button) ===== */
const THEME = {
  borderSoft: "rgba(255,255,255,0.10)",
  text: "rgba(255,255,255,0.94)",
  textMuted: "rgba(255,255,255,0.62)",
  gold: "#f4da9c",
  caramel: "#b37042",
};

/* ===================== NEW THEME WRAPPERS (UI ONLY) ===================== */

const AuroraBackdrop = () => {
  const blobs = useMemo(
    () => [
      {
        className: "h-[42rem] w-[42rem] -top-40 -left-40",
        bg: "radial-gradient(circle at 30% 30%, rgba(34,197,94,0.75), transparent 60%)",
        dur: 12,
      },
      {
        className: "h-[46rem] w-[46rem] -bottom-44 -right-44",
        bg: "radial-gradient(circle at 70% 60%, rgba(59,130,246,0.75), transparent 62%)",
        dur: 14,
      },
      {
        className:
          "h-[40rem] w-[40rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        bg: "radial-gradient(circle at 50% 50%, rgba(236,72,153,0.68), transparent 64%)",
        dur: 18,
      },
      {
        className: "h-[30rem] w-[30rem] top-10 right-20",
        bg: "radial-gradient(circle at 45% 45%, rgba(251,191,36,0.62), transparent 65%)",
        dur: 16,
      },
    ],
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#02030a]" />

      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={cx("absolute rounded-full blur-3xl opacity-30", b.className)}
          style={{ background: b.bg }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.22, 0.42, 0.22],
            x: [0, i % 2 === 0 ? 18 : -18, 0],
            y: [0, i % 2 === 0 ? -14 : 14, 0],
          }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.12) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(120% 90% at 50% 10%, black 55%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 10%, black 55%, transparent 85%)",
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(236,72,153,0.22) 0px, rgba(236,72,153,0.22) 1px, transparent 1px, transparent 26px)",
        }}
        animate={{ x: [0, 120, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 85% at 50% 18%, transparent 35%, rgba(0,0,0,0.88) 82%)",
        }}
      />
    </div>
  );
};

const GlassPanel = ({ className = "", children }) => (
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
    className={cx(
      "relative rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl overflow-hidden",
      "shadow-[0_30px_140px_rgba(0,0,0,0.55)]",
      className
    )}
  >
    <motion.div
      className="absolute -inset-[2px] opacity-55"
      style={{
        background:
          "conic-gradient(from 90deg, rgba(34,197,94,0.45), rgba(59,130,246,0.45), rgba(236,72,153,0.42), rgba(251,191,36,0.38), rgba(34,197,94,0.45))",
      }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
    />
    <div className="absolute inset-[1px] rounded-[27px] bg-[#050712]/85" />

    <motion.div
      className="absolute inset-0 opacity-[0.08]"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)",
      }}
      animate={{ x: ["-120%", "120%"] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    />

    <div className="relative">{children}</div>
  </motion.div>
);

const Pill = ({ children, tone = "gray" }) => {
  const tones = {
    gray: "border-white/10 bg-white/5 text-white/70",
    green: "border-green-300/25 bg-green-500/12 text-green-100",
    blue: "border-blue-300/25 bg-blue-500/12 text-blue-100",
    pink: "border-pink-300/25 bg-pink-500/12 text-pink-100",
    amber: "border-amber-300/25 bg-amber-500/12 text-amber-100",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-black tracking-wide",
        tones[tone] || tones.gray
      )}
    >
      {children}
    </span>
  );
};

/* ===================== Main Component ===================== */

export default function UserDashboard() {
  const { getUpdateLoggedUser } = UseUserHook();

  const loggedUser = useSelector((store) => store.user.loggedUser);
  const { accountsStats } = useSelector((store) => store.user);
  const totalFinalPnL = useSelector((store) => store.user.totalFinalPnL);

  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);

  const navigate = useNavigate();

  const equity = Number(accountsStats?.totalEquity || 0);
  const accountsCount = loggedUser?.accounts?.length || 0;
  const todayProfit = Number(totalFinalPnL || 0);

  // Keep your existing dashboard refresh (unchanged) 
  useEffect(() => {
    const run = async () => {
      try {
        await getUpdateLoggedUser();
      } catch (e) {
        console.error("Dashboard init:", e);
      }
    };

    run();
    const id = setInterval(run, 3000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch deposits/withdrawals (header shows real values)
  useEffect(() => {
    let alive = true;

    const fetchTotalDeposits = async () => {
      try {
        if (!loggedUser?._id) return;
        const res = await backendApi.get(`/client/deposit/${loggedUser._id}`);
        const sum = (res.data?.data || []).reduce(
          (total, current) => total + Number(current?.deposit || 0),
          0
        );
        if (alive) setTotalDeposits(sum);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTotalWithdrawals = async () => {
      try {
        if (!loggedUser?._id) return;
        const res = await backendApi.get(`/client/withdrawals/${loggedUser._id}`);
        const sum = (res.data?.data || []).reduce(
          (total, current) => total + Number(current?.amount || 0),
          0
        );
        if (alive) setTotalWithdrawals(sum);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTotalDeposits();
    fetchTotalWithdrawals();

    return () => {
      alive = false;
    };
  }, [loggedUser?._id]);

  const headerMetrics = useMemo(
    () => [
      { label: "Balance", value: `${formatMoney(equity)} USD` },
      { label: "Today's Profit", value: `${formatMoney(todayProfit)} USD` },
      { label: "Deposits", value: `${formatMoney(totalDeposits)}` },
      { label: "Withdrawals", value: `${formatMoney(totalWithdrawals)}` },
      { label: "Accounts", value: `${accountsCount}` },
    ],
    [equity, todayProfit, totalDeposits, totalWithdrawals, accountsCount]
  );

  const Metric = ({ label, value }) => (
    <div className="min-w-0">
      <p
        className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide"
        style={{ color: THEME.textMuted }}
      >
        {label}
      </p>
      <p
        className="mt-0.5 text-[12px] sm:text-[13px] font-extrabold leading-none break-words"
        style={{ color: THEME.text }}
      >
        {value}
      </p>
    </div>
  );

  const openAccountHandler = () => navigate("/user/new-challenge");

  return (
    <motion.div
      className="relative min-h-0   overflow-hidden text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Backdrop layers */}
      <AuroraBackdrop />
      <FloatingParticles />
      <AnimatedGrid />

      {/* Content */}
       <div className="relative z-10 w-full px-3 sm:px-5 lg:px-6"> 
        <div className="mx-auto w-full max-w-7xl space-y-5">
          {/* ===== HEADER (fully responsive) ===== */}
          <div
            className="rounded-2xl px-4 py-4 sm:px-6 sm:py-5 ml-10 mt-5"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${THEME.borderSoft}`,
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ml-10 ">
              {/* LEFT */}
              <div className="min-w-0 ">
                <h2
                  className="text-[14px] sm:text-[15px] font-extrabold leading-tight"
                  style={{ color: THEME.text }}
                >
                  Hi, Welcome back!
                </h2>
                <p
                  className="text-[12px] sm:text-[13px] font-semibold"
                  style={{ color: THEME.textMuted }}
                >
                  Trading Dashboard,
                </p>
              </div>

              {/* RIGHT */}
              <div className="w-full lg:w-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap items-end gap-x-6 gap-y-3">
                  {headerMetrics.map((m) => (
                    <Metric key={m.label} label={m.label} value={m.value} />
                  ))}

                  <button
                    className={cx(
                      "col-span-2 sm:col-span-1 lg:ml-2",
                      "rounded-lg px-5 py-2 text-[12px] font-extrabold",
                      "w-full sm:w-auto"
                    )}
                    style={{
                      background: `linear-gradient(90deg, ${THEME.gold}, ${THEME.caramel})`,
                      color: "#0b0b10",
                      boxShadow: "0 10px 30px rgba(244,218,156,0.12)",
                    }}
                    onClick={openAccountHandler}
                  >
                    Open Account
                  </button>
                </div>
              </div>
            </div>
            </div> 

          {/* ===== MAIN PANEL ===== */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="min-h-screen pb-0"

          >
            <GlassPanel className="p-5 ml-10 mt-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-[12px] font-black tracking-wide text-white/55">
                  BALANCE OVERVIEW
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="green">PORTFOLIO</Pill>
                  <Pill tone="blue">STATS</Pill>
                </div>
              </div>

              {/* Existing components (unchanged) */}
              <div className="">
                <UserDashboardBalanceCards />
                <DailyPerformanceTrends />
                <RecentTransactions />
                <TradeHistory />
                <AccountList />
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

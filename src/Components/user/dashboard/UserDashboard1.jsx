import { useEffect, useMemo } from "react";
import UserDashboardBalanceCards from "./dashboard/UserDashboardCards";
import UseUserHook from "../../hooks/user/UseUserHook";
import UserDashboardTransaction from "./dashboard/UserDashboardTransaction";
import UserDashboardTradeHistory from "./dashboard/UserDashboardTradeHistory";
import { motion } from "framer-motion";
import { FloatingParticles } from "../../utils/FloatingParticles";
import { AnimatedGrid } from "../../utils/AnimatedGrid";  

/* ===================== Helpers ===================== */
const cx = (...c) => c.filter(Boolean).join(" ");

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
        className: "h-[40rem] w-[40rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
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
      {/* base */}
      <div className="absolute inset-0 bg-[#02030a]" />

      {/* animated aurora blobs */}
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

      {/* neon grid lines */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.12) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(120% 90% at 50% 10%, black 55%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(120% 90% at 50% 10%, black 55%, transparent 85%)",
        }}
      />

      {/* diagonal shimmer */}
      <motion.div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(236,72,153,0.22) 0px, rgba(236,72,153,0.22) 1px, transparent 1px, transparent 26px)",
        }}
        animate={{ x: [0, 120, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* vignette */}
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
    {/* animated neon border */}
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
    {/* soft shimmer */}
    <motion.div
      className="absolute inset-0 opacity-[0.08]"
      style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)",
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

/* ===================== Ticker (same logic, upgraded visuals) ===================== */
const Ticker = ({ items }) => (
  <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-r from-white/[0.04] via-white/[0.03] to-white/[0.04] backdrop-blur-2xl">
    <motion.div
      className="absolute -inset-[2px] opacity-45"
      style={{
        background:
          "conic-gradient(from 120deg, rgba(34,197,94,0.38), rgba(59,130,246,0.38), rgba(236,72,153,0.36), rgba(251,191,36,0.30), rgba(34,197,94,0.38))",
      }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
    />
    <div className="absolute inset-[1px] rounded-3xl bg-[#060817]/80" />

    <div
      className="absolute inset-0 pointer-events-none opacity-10"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(34,197,94,0.16) 0 2px, transparent 2px 10px)",
      }}
    />

    <div className="relative whitespace-nowrap animate-[marquee_22s_linear_infinite] py-3">
      {items.map((c, i) => {
        const up = c.change24h >= 0;
        return (
          <span key={c.symbol + i} className="inline-flex items-center mx-4 gap-2 text-sm">
            <span className="font-mono text-white/80">{c.symbol}</span>
            <span className="font-semibold text-white/90">{c.price.toLocaleString()}</span>
            <span
              className={cx(
                "px-2 py-0.5 rounded-full text-xs font-black border",
                up
                  ? "border-emerald-300/25 bg-emerald-500/12 text-emerald-200"
                  : "border-rose-300/25 bg-rose-500/12 text-rose-200"
              )}
            >
              {up ? "▲" : "▼"} {Math.abs(c.change24h).toFixed(2)}%
            </span>
          </span>
        );
      })}
    </div>

    {/* keyframes */}
    <style>{`
      @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    `}</style>
  </div>
);

/* ===================== Main Component (APIs/workflow unchanged) ===================== */

export default function UserDashboard() {
  const { getUpdateLoggedUser } = UseUserHook();

  const trendingCoins = useMemo(
    () => [
      { symbol: "BTCUSDT", name: "Bitcoin", price: 61234.12, change24h: 2.14 },
      { symbol: "ETHUSDT", name: "Ethereum", price: 2431.78, change24h: -0.86 },
      { symbol: "SOLUSDT", name: "Solana", price: 162.45, change24h: 4.21 },
      { symbol: "XRPUSDT", name: "XRP", price: 0.62, change24h: 1.37 },
      { symbol: "DOGEUSDT", name: "Dogecoin", price: 0.146, change24h: -2.05 },
      { symbol: "ADAUSDT", name: "Cardano", price: 0.48, change24h: 0.72 },
      { symbol: "ARBUSDT", name: "Arbitrum", price: 1.24, change24h: -1.23 },
    ],
    []
  );

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
  }, []);

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AuroraBackdrop />
      <FloatingParticles />
      <AnimatedGrid />

      <div className="relative z-10 px-4 md:px-6 py-6 md:py-8 pb-12">
        {/* New Layout: HERO + 2x2 GRID */}
        <div className="max-w-7xl mx-auto space-y-5">
          {/* HERO STRIP */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 170, damping: 18 }}
          >
            <GlassPanel className="p-5 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Pill tone="green">LIVE</Pill>
                    <Pill tone="blue">REALTIME</Pill>
                    <Pill tone="pink">DASHBOARD</Pill>
                    <Pill tone="amber">VIBRANT</Pill>
                  </div>

                  <motion.h1
                    className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(34,197,94,1) 0%, rgba(59,130,246,1) 35%, rgba(236,72,153,1) 70%, rgba(251,191,36,1) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      backgroundSize: "200% 200%",
                    }}
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 7.5, repeat: Infinity, ease: "linear" }}
                  >
                    Crypto-style User Dashboard
                  </motion.h1>

                  <p className="mt-2 text-white/65 max-w-2xl">
                    Vibrant gradients, neon glass, and motion — without touching your APIs/workflow.
                  </p>
                </div>

                <div className="w-full lg:w-[520px]">
                  <Ticker items={[...trendingCoins, ...trendingCoins]} />
                </div>
              </div>
            </GlassPanel>
          </motion.div>

          {/* GRID: Balance (wide) + Right Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Balance Cards */}
            <motion.div
              className="lg:col-span-8"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              <GlassPanel className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[12px] font-black tracking-wide text-white/55">BALANCE OVERVIEW</div>
                  <div className="flex items-center gap-2">
                    <Pill tone="green">PORTFOLIO</Pill>
                    <Pill tone="blue">STATS</Pill>
                  </div>
                </div>

                {/* existing component unchanged */}
                <UserDashboardBalanceCards />
              </GlassPanel>
            </motion.div>

            {/* Right Column */}
            <motion.div
              className="lg:col-span-4 space-y-5"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
            >
              <GlassPanel className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-black tracking-wide text-white/55">QUICK</div>
                    <div className="text-lg font-black text-white/90">Activity</div>
                  </div>
                  <Pill tone="pink">LIVE</Pill>
                </div>

                <motion.div
                  className="mt-4 h-24 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-pink-500/10"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </GlassPanel>

              <GlassPanel className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-black tracking-wide text-white/55">SYSTEM</div>
                    <div className="text-lg font-black text-white/90">Sync</div>
                  </div>
                  <Pill tone="green">ON</Pill>
                </div>

                <motion.div
                  className="mt-4 h-24 rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-pink-500/10 to-blue-500/10"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </GlassPanel>
            </motion.div>
          </div>

          {/* Bottom Row: Transactions + Trade History (unchanged components) */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-5"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
          >
            <GlassPanel className="lg:col-span-6 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[12px] font-black tracking-wide text-white/55">TRANSACTIONS</div>
                <Pill tone="blue">HISTORY</Pill>
              </div>
              <UserDashboardTransaction />
            </GlassPanel>

            <GlassPanel className="lg:col-span-6 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[12px] font-black tracking-wide text-white/55">TRADE</div>
                <Pill tone="green">LOGS</Pill>
              </div>
              <UserDashboardTradeHistory />
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

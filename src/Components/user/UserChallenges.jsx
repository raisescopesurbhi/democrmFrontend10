import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  Loader2,
  Sparkles,
  Wallet,
  TrendingUp,
  Gauge,
  CircleDollarSign,
  Search,
  ShieldCheck,
  ShieldAlert,  
  ArrowUpRight,
  ArrowDownRight,
  KeyRound,
  Zap,
  Activity,
  Target,
  Gem,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CFcalculateTimeSinceJoined, CFformatDate } from "../../utils/CustomFunctions";
import { useGetInfoByAccounts } from "../../hooks/user/UseGetInfoByAccounts";

/* ===================== Helpers ===================== */
const cx = (...c) => c.filter(Boolean).join(" ");

/* =========================================================================
   ✅ THEME: "NEON REACTOR / CIRCUIT RAVE"
   - APIs/workflow unchanged
   - ✅ LEFT NOT SCROLLABLE
   - ✅ RIGHT ACCOUNTS LIST SCROLLABLE + visible scrollbar area (proper height constraints)
   - ✅ CUSTOM SCROLLBAR ADDED (works even without tailwind-scrollbar plugin)
   ======================================================================= */

// const ScrollbarStyles = () => (
//   <style>{`
//     /* Custom scrollbar (WebKit) */
//     .accounts-scroll::-webkit-scrollbar {
//       width: 10px;
//     }
//     .accounts-scroll::-webkit-scrollbar-track {
//       background: rgba(255,254,255,0.06);
//       border-radius: 999px;
//     }
//     .accounts-scroll::-webkit-scrollbar-thumb {
//       background: rgba(255,255,255,0.20);
//       border-radius: 999px;
//       border: 2px solid rgba(0,0,0,0);
//       background-clip: padding-box;
//     }
//     .accounts-scroll:hover::-webkit-scrollbar-thumb {
//       background: rgba(255,255,255,0.30);
//       border: 2px solid rgba(0,0,0,0);
//       background-clip: padding-box;
//     }

//     /* Firefox */
//     .accounts-scroll {
//       scrollbar-width: thin;
//       scrollbar-color: rgba(255,254,255,0.25) rgba(255,255,255,0.06);
//     }
//   `}</style>
// );

const NeonReactorBackdrop = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        i,
        x: (i * 37) % 100,
        y: (i * 61) % 100,
        s: 1 + ((i * 11) % 3),
        d: 3 + ((i * 7) % 7),
        o: 0.18 + (((i * 9) % 45) / 100),
      })),
    []
  );   

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[#020307]" />

      <motion.div
        className="absolute -top-[28rem] -left-[28rem] h-[60rem] w-[60rem] rounded-full blur-3xl opacity-40"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(34,197,94,0.65), transparent 58%)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.22, 0.45, 0.22] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[30rem] -right-[30rem] h-[64rem] w-[64rem] rounded-full blur-3xl opacity-35"
        style={{
          background: "radial-gradient(circle at 70% 60%, rgba(59,130,246,0.62), transparent 60%)",
        }}
        animate={{ scale: [1.06, 0.95, 1.06], opacity: [0.18, 0.4, 0.18] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(236,72,153,0.55), transparent 62%)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -top-44 right-16 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-25"
        style={{
          background: "radial-gradient(circle at 45% 45%, rgba(16,185,129,0.55), transparent 64%)",
        }}
        animate={{ scale: [1, 1.09, 1], x: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "radial-gradient(120% 80% at 50% 0%, black 55%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(120% 80% at 50% 0%, black 55%, transparent 85%)",
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-[0.11]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(120deg, rgba(236,72,153,0.22) 0px, rgba(236,72,153,0.22) 1px, transparent 1px, transparent 22px)",
        }}
        animate={{ x: [0, 120, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute inset-0">
        {particles.map((p) => (
          <motion.span
            key={p.i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.s,
              height: p.s,
              opacity: p.o,
              filter: "drop-shadow(0 0 14px rgba(34,197,94,0.35))",
            }}
            animate={{ opacity: [p.o, p.o + 0.35, p.o], y: [0, -10, 0] }}
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <motion.div
        className="absolute inset-x-0 -top-48 h-48 opacity-[0.12]"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(34,197,94,0.85) 50%, transparent 100%)",
        }}
        animate={{ y: ["-10vh", "120vh"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(120% 85% at 50% 18%, transparent 35%, rgba(0,0,0,0.88) 82%)",
        }}
      />
    </div>
  );
};

const NeonFrame = ({ className = "", children }) => (
  <div
    className={cx(
      "relative rounded-[30px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl overflow-hidden",
      "shadow-[0_28px_140px_rgba(0,0,0,0.55)]",
      className
    )}
  >
    <motion.div
      className="absolute -inset-[2px] opacity-60"
      style={{
        background:
          "conic-gradient(from 90deg, rgba(34,197,94,0.45), rgba(59,130,246,0.45), rgba(236,72,153,0.42), rgba(16,185,129,0.40), rgba(34,197,94,0.45))",
      }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
    />
    <div className="absolute inset-[1px] rounded-[29px] bg-[#04050b]/80" />

    <motion.div
      className="absolute inset-0 opacity-[0.09]"
      style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
      }}
      animate={{ x: ["-120%", "120%"] }}
      transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
    />

    <div className="relative">{children}</div>
  </div>
);

const Pill = ({ children, tone = "gray" }) => {
  const tones = {
    gray: "border-white/10 bg-white/5 text-white/75",
    green: "border-green-300/25 bg-green-500/12 text-green-100",
    emerald: "border-emerald-300/25 bg-emerald-500/12 text-emerald-100",
    blue: "border-blue-300/25 bg-blue-500/12 text-blue-100",
    pink: "border-pink-300/25 bg-pink-500/12 text-pink-100",
  };
  return (
    <span className={cx("inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-black tracking-wide", tones[tone] || tones.gray)}>
      {children}
    </span>
  );
};

const VibrantCard = ({ className = "", children, full = false }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={cx(full ? "h-full flex flex-col min-h-0" : "h-auto")}
    >
      <NeonFrame className={cx(full ? "h-[100px] flex flex-col min-h-0 mt-7" : "", className)}>
        {children}
      </NeonFrame>
    </motion.div>
  );
};


const ColorfulBadge = ({ children, variant = "default", icon, animated = false }) => {
  const map = { default: "blue", success: "green", warning: "pink", info: "blue", pink: "pink" };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      animate={animated ? { scale: [1, 1.04, 1] } : {}}
      transition={animated ? { duration: 2, repeat: Infinity } : {}}
      className="inline-flex items-center gap-1.5"
    >
      <Pill tone={map[variant] || "gray"}>
        {icon ? (
          <motion.span
            className="text-sm"
            animate={animated ? { rotate: [0, 360] } : {}}
            transition={animated ? { duration: 3, repeat: Infinity, ease: "linear" } : {}}
          >
            {icon}
          </motion.span>
        ) : null}
        {children}
      </Pill>
    </motion.span>
  );
};

function PulseIcon({ children, className = "" }) {
  return (
    <motion.div className={cx("relative", className)} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
      {children}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%)" }}
        animate={{ scale: [1, 2], opacity: [0.6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
    </motion.div>
  );
}

/* ===================== Motion Variants ===================== */
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, when: "beforeChildren", staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 20 } },
};

const Money = ({ value }) =>
  typeof value === "number" ? <>{value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</> : <Loader2 className="inline animate-spin text-white/60" size={16} />;

/* ===================== Main Component ===================== */

const UserChallenges = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const siteConfig = useSelector((store) => store.user.siteConfig);
  const loggedUser = useSelector((store) => store.user.loggedUser);

  const accountIds = loggedUser?.accounts?.map((acc) => +acc.accountNumber) || [];
  useGetInfoByAccounts(accountIds, "accounts"); // ✅ unchanged
  const { accountsData } = useSelector((store) => store.user);
  const closeVaultController=()=>{
    setIsDialogOpen(false);
  }

  const handleMoreInfo = (value) => {
    setSelectedChallenge(value);
    setIsDialogOpen(true);
  };

  const stats = useMemo(() => {
    const list = (loggedUser?.accounts || []).map((acc) => {
      const info = accountsData?.find((i) => i.MT5Account === +acc.accountNumber);
      return { balance: info?.Balance ?? null, equity: info?.Equity ?? null, profit: info?.Profit ?? null };
    });

    const sum = (arr, key) => arr.reduce((s, x) => (typeof x[key] === "number" ? s + x[key] : s), 0);

    const totalBalance = sum(list, "balance");
    const totalEquity = sum(list, "equity");
    const totalPL = sum(list, "profit");

    return {
      accounts: (loggedUser?.accounts || []).length,
      totalBalance: isFinite(totalBalance) ? totalBalance : null,
      totalEquity: isFinite(totalEquity) ? totalEquity : null,
      totalPL: isFinite(totalPL) ? totalPL : null,
    };
  }, [loggedUser?.accounts, accountsData]);

  const accountTypes = useMemo(() => {
    const set = new Set((loggedUser?.accounts || []).map((a) => (a?.accountType || "").trim()).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [loggedUser?.accounts]);

  const filteredAccounts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (loggedUser?.accounts || [])
      .slice()
      .reverse()
      .filter((acc) => {
        const matchesQuery =
          !q ||
          String(acc?.accountNumber || "").toLowerCase().includes(q) ||
          String(acc?.platform || "").toLowerCase().includes(q) ||
          String(acc?.accountType || "").toLowerCase().includes(q);

        const matchesType = typeFilter === "all" || (acc?.accountType || "") === typeFilter;
        return matchesQuery && matchesType;
      });
  }, [loggedUser?.accounts, query, typeFilter]);

  const hasAccounts = Boolean(loggedUser?.accounts?.length);
  const isActiveAccount = Boolean(loggedUser?.accounts?.length);

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="relative  overflow-hidden text-white">

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <motion.div variants={itemVariants} className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <motion.div className="flex flex-wrap items-center gap-2 mb-3" initial={{ x: -20 }} animate={{ x: 0 }} transition={{ delay: 0.2 }}>
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                  <Zap className="text-yellow-400" size={24} />
                </motion.div>
                <ColorfulBadge variant="default" icon="✨" animated>
                  LIVE PORTFOLIO
                </ColorfulBadge>
                <ColorfulBadge variant="success" icon="🔒">
                  SECURE
                </ColorfulBadge>
                <ColorfulBadge variant="info" icon="⚡">
                  REALTIME
                </ColorfulBadge>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-4xl font-black tracking-tight mb-2"
                style={{
                  background: "linear-gradient(135deg, #22c55e 0%, #3b82f6 40%, #ec4899 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                MT5 Accounts Hub
              </motion.h1>

              <p className=" text-white/70 max-w-2xl ">
                <span className=" lg:text-lg font-bold bg-gradient-to-r from-green-300 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                  Advanced Portfolio Management
                </span><br/>


                  <span className=" lg:text-sm">
                   • Track, analyze, and secure your trading accounts in real-time
                </span>{" "}


              </p>
            </div>

            <VibrantCard className="px-6 py-6 mt-5">
              <div className="flex items-center gap-4">
                <PulseIcon>
                  <div className="h-16 w-16 rounded-2xl bg-white/5 grid place-items-center  border-white/10">
                    {isActiveAccount ? (
                      <ShieldCheck className="text-emerald-300" size={32} strokeWidth={2.5} />
                    ) : (
                      <ShieldAlert className="text-rose-300" size={32} strokeWidth={2.5} />
                    )}
                  </div>
                </PulseIcon>
                <div>
                  <div className={cx("text-lg font-black mb-1", isActiveAccount ? "text-emerald-300" : "text-rose-300")}>
                    {isActiveAccount ? "System Active" : "No Accounts"}
                  </div>
                  <div className="text-sm text-white/55">{isActiveAccount ? `${stats.accounts} accounts live` : "Create your first account"}</div>
                </div>
              </div>
            </VibrantCard>
          </div>
        </motion.div>

        {/* ✅ constrain the 2-column area height + prevent page scrolling INSIDE this block on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch  lg:overflow-hidden">
          {/* Left (NOT scrollable) */}
          <div className="lg:col-span-4 flex ">
            <motion.div variants={itemVariants} className="flex flex-col flex-1 min-h-0">
              <div className="">


                <VibrantCard className="p-6 sm:mt-5 md:mt-5 lg:mt-5 xl:mt-5">
                  <div className="flex items-center justify-between mb-6 mt-7">
                    <div className="flex items-center gap-3">
                      <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
                        <Activity className="text-pink-200" size={24} />
                      </motion.div>
                      <div>
                        <div className="font-black text-xl bg-gradient-to-r from-green-300 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                          Portfolio Stats
                        </div>
                        <div className="text-xs text-white/55">Live performance metrics</div>
                      </div>
                    </div>
                    <ColorfulBadge variant="pink" icon="📊" animated>
                      Live
                    </ColorfulBadge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <KpiCard icon={<Wallet />} label="Accounts"  value={stats.accounts} color="pink"  />
                    <KpiCard icon={<CircleDollarSign />} label="Balance" value={<Money value={stats.totalBalance} />} prefix="$" color="blue" />
                    <KpiCard icon={<Gauge />} label="Equity" value={<Money value={stats.totalEquity} />} prefix="$" color="green" />
                    <KpiCard
                      icon={<TrendingUp />}
                      label="P/L"
                      value={<Money value={stats.totalPL} />}
                      prefix={typeof stats.totalPL === "number" && stats.totalPL >= 0 ? "+" : ""}
                      color={typeof stats.totalPL === "number" && stats.totalPL >= 0 ? "green" : "red"}
                      showArrow={typeof stats.totalPL === "number"}
                      isPositive={typeof stats.totalPL === "number" ? stats.totalPL >= 0 : true}
                    />
                  </div>
                </VibrantCard>

              </div>
            </motion.div>
          </div>

          {/* Right (scrollable accounts list) */}
          <div className="lg:col-span-8 flex min-h-0">
            <motion.div variants={itemVariants} className="flex flex-col flex-1 ">
              <VibrantCard className="p-5 sm:p-6 flex flex-col flex-1 min-h-0 sm:mt-5 md:mt-6 xl:mt-8 sm:mb-2 md:mb-4 xl:mb-6 ">
                {/* Search & Filter (fixed, not scrolling) */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45" size={20} />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search accounts, type, platform..."
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-4 text-white placeholder:text-white/40 outline-none focus:border-green-300/25 focus:ring-4 focus:ring-green-400/10 transition-all"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {accountTypes.slice(0, 4).map((t) => (
                      <motion.button
                        key={t}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTypeFilter(t)}
                        className={cx(
                          "rounded-full px-4 py-2.5 text-xs font-black border transition-all",
                          typeFilter === t
                            ? "border-green-300/25 bg-green-500/12 text-green-100 shadow-[0_0_30px_rgba(34,197,94,0.16)]"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        )}
                      >
                             {t === "all" ? "🌐 All" : `📊 ${t}`}   

                        
                        

                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* ✅ 
                croll container (now with guaranteed visible scrollbar styling) */}
                <div className=" overflow-y-scroll h-80 overflow-x-hidden"> 
                  {/* sticky header inside the scroll */}
                  <div className="hidden lg:block sticky top-0 z-20 pb-3">
                    <div className="rounded-2xl border border-white/10 bg-[#04050b]/85 backdrop-blur-2xl px-4 py-3">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-3 text-xs font-black text-white/45 tracking-wider">ACCOUNT</div>
                        <div className="col-span-2 text-xs font-black text-white/45 tracking-wider">TYPE</div>
                        <div className="col-span-1 text-xs font-black text-white/45 tracking-wider">LEV</div>
                        <div className="col-span-2 text-xs font-black text-white/45 tracking-wider">BALANCE</div>
                        <div className="col-span-2 text-xs font-black text-white/45 tracking-wider">EQUITY</div>
                        <div className="col-span-2 text-xs font-black text-white/45 tracking-wider text-right">P/L</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 ">
                    {!hasAccounts ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center"
                      >
                        <Gem className="mx-auto text-white/45 mb-4" size={48} />
                        <div className="text-xl font-bold text-white/80 mb-2">No Accounts Yet</div>
                        <p className="text-sm text-white/55">Create your first trading account to get started</p>
                      </motion.div>
                    ) : filteredAccounts.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center"
                      >
                        <Search className="mx-auto text-white/45 mb-3" size={40} />
                        <div className="text-lg font-bold text-white/80">No matches found</div>
                        <p className="text-sm text-white/55 mt-1">Try adjusting your search or filters</p>
                      </motion.div>
                    ) : (
                      filteredAccounts.map((acc, idx) => {
                        const info = accountsData?.find((i) => i.MT5Account === +acc.accountNumber);
                        const profit = info?.Profit;
                        const profitPos = typeof profit === "number" ? profit >= 0 : true;

                        return (
                          <AccountCard
                            key={acc?.accountNumber || idx}
                            acc={acc}
                            info={info}
                            profit={profit}
                            profitPos={profitPos}
                            onMore={() => handleMoreInfo(acc)}
                            index={idx}
                            siteConfig={siteConfig}
                          />
                        );
                      })
                    )}
                  </div>
                </div>
              </VibrantCard>
            </motion.div>
          </div>


        </div>
      </div>

      {/* Modal */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AnimatePresence>
          {isDialogOpen && selectedChallenge && (
            <AlertDialogContent
              as={motion.div}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="max-w-lg mx-auto p-0 bg-transparent border-0 shadow-none"
            >
              <NeonFrame className="p-6 sm:p-8">
                <AlertDialogHeader className="relative">
                  <AlertDialogTitle className="text-2xl sm:text-3xl font-black mb-4 flex items-center gap-3">
                    <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                      <Sparkles className="text-yellow-400" size={28} />
                    </motion.div>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">Account Vault</span>
                  </AlertDialogTitle>

                  <AlertDialogDescription className="relative text-white/70 space-y-4">
                    <VibrantCard className="p-4">
                      <DetailLine label="Trade Platform" value={selectedChallenge?.platform} icon="🖥️" />
                      <DetailLine label="Server Name" value={siteConfig?.serverName} icon="🌐" />
                      <DetailLine label="Account Number" value={selectedChallenge?.accountNumber} icon="🔢" />
                      <DetailLine label="Leverage" value={`x${selectedChallenge?.leverage}`} icon="📊" />
                    </VibrantCard>

                    <VibrantCard className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <KeyRound className="text-pink-200" size={18} />
                        <div className="text-sm font-black text-white/85">Secure Credentials</div>
                      </div>

                      <DetailLine
                        label="Master Password"
                        value={
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-white bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                              {selectedChallenge?.masterPassword}
                            </span>
                            <Link to="/user/master-password" className="text-xs font-bold text-blue-200 hover:text-blue-100 underline">
                              Change →
                            </Link>
                          </div>
                        }
                        icon="🔐"
                      />
                      <div className="my-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <DetailLine
                        label="Investor Password"
                        value={
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-white bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                              {selectedChallenge?.investorPassword}
                            </span>
                            <Link to="/user/investor-password" className="text-xs font-bold text-blue-200 hover:text-blue-100 underline">
                              Change →
                            </Link>
                          </div>
                        }
                        icon="👁️"
                      />
                    </VibrantCard>
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {/* <AlertDialogFooter className="mt-6 relative">
                  <AlertDialogCancel className="w-full sm:w-auto border border-white/10 bg-white/5 hover:bg-white/10 text-white font-black px-6 py-3 rounded-2xl transition-all">
                    Close Vault
                  </AlertDialogCancel>
                </AlertDialogFooter> */}

                {/* <AlertDialogFooter className="mt-6 relative">
  <AlertDialogCancel asChild> */}
    <button onClick={closeVaultController}
      type="button"
      className="w-full sm:w-auto border border-white/10 bg-white/5 hover:bg-white/10 text-white font-black px-6 py-3 rounded-2xl transition-all"
    >
      Close Vault
    </button>
  {/* </AlertDialogCancel>
</AlertDialogFooter> */}

              </NeonFrame>
            </AlertDialogContent>
          )}
        </AnimatePresence>
      </AlertDialog>
    </motion.div>
  );
};

export default UserChallenges;

/* ===================== Subcomponents ===================== */

function KpiCard({ icon, label, value, prefix = "", showArrow = false, isPositive = true, delay = 0, color = "blue" }) {
  const palette = {
    blue: {
      wrap: "border-blue-300/25 bg-gradient-to-br from-blue-500/20 via-cyan-500/12 to-blue-600/20 shadow-[0_0_40px_rgba(59,130,246,0.18)]",
      iconWrap: "border-blue-300/25 bg-blue-500/18",
      icon: "text-cyan-100",
      badgeVariant: "info",
      shimmer: "rgba(59,130,246,0.18)",
    },
    green: {
      wrap: "border-emerald-300/25 bg-gradient-to-br from-emerald-500/20 via-green-500/12 to-teal-500/20 shadow-[0_0_40px_rgba(16,185,129,0.18)]",
      iconWrap: "border-emerald-300/25 bg-emerald-500/18",
      icon: "text-emerald-100",
      badgeVariant: "success",
      shimmer: "rgba(16,185,129,0.18)",
    },
    red: {
      wrap: "border-rose-300/25 bg-gradient-to-br from-rose-500/20 via-red-500/10 to-pink-500/18 shadow-[0_0_40px_rgba(244,63,94,0.18)]",
      iconWrap: "border-rose-300/25 bg-rose-500/18",
      icon: "text-rose-100",
      badgeVariant: "warning",
      shimmer: "rgba(244,63,94,0.18)",
    },
    pink: {
      wrap: "border-pink-300/25 bg-gradient-to-br from-pink-500/18 via-fuchsia-500/10 to-violet-500/18 shadow-[0_0_40px_rgba(236,72,153,0.18)]",
      iconWrap: "border-pink-300/25 bg-pink-500/16",
      icon: "text-pink-100",
      badgeVariant: "pink",
      shimmer: "rgba(236,72,153,0.18)",
    },
    violet: {
      wrap: "border-violet-300/25 bg-gradient-to-br from-violet-500/18 via-purple-500/10 to-fuchsia-500/18 shadow-[0_0_40px_rgba(124,58,237,0.16)]",
      iconWrap: "border-violet-300/25 bg-violet-500/16",
      icon: "text-violet-100",
      badgeVariant: "default",
      shimmer: "rgba(124,58,237,0.16)",
    },
    cyan: {
      wrap: "border-cyan-300/25 bg-gradient-to-br from-cyan-500/18 via-sky-500/10 to-blue-500/18 shadow-[0_0_40px_rgba(34,211,238,0.16)]",
      iconWrap: "border-cyan-300/25 bg-cyan-500/16",
      icon: "text-cyan-100",
      badgeVariant: "info",
      shimmer: "rgba(34,211,238,0.16)",
    },
    amber: {
      wrap: "border-amber-300/25 bg-gradient-to-br from-amber-500/18 via-orange-500/10 to-yellow-500/18 shadow-[0_0_40px_rgba(251,191,36,0.14)]",
      iconWrap: "border-amber-300/25 bg-amber-500/16",
      icon: "text-amber-100",
      badgeVariant: "warning",
      shimmer: "rgba(251,191,36,0.14)",
    },
  };

  const p = palette[color] || palette.blue;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.03, y: -3 }}
      className={cx("relative rounded-2xl border backdrop-blur-xl overflow-hidden p-4", p.wrap)}
    >
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(135deg, transparent 0%, ${p.shimmer} 50%, transparent 100%)`,
          backgroundSize: "200% 200%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={cx("h-10 w-10 rounded-xl grid place-items-center border", p.iconWrap)}>
            {React.cloneElement(icon, { size: 20, className: cx("drop-shadow", p.icon) })}
          </div>

          {showArrow && (
            <motion.div animate={{ y: isPositive ? [-2, -5, -2] : [2, 5, 2] }} transition={{ duration: 2, repeat: Infinity }}>
              {isPositive ? <ArrowUpRight className="text-emerald-200" size={20} /> : <ArrowDownRight className="text-rose-200" size={20} />}
            </motion.div>
          )}
        </div>

        <div className="text-xs font-black text-white/65 mb-1 tracking-wider">{label}</div>

        <div className="text-xl sm:text-2xl font-black text-white/95">
          {prefix}
          {value}
        </div>

        <div className="mt-2">
          <ColorfulBadge variant={p.badgeVariant}>{label}</ColorfulBadge> 
        </div>
      </div>
    </motion.div>
  );
}

function AccountCard({ acc, info, profit, profitPos, onMore, index, siteConfig }) {
  const gradients = [
    "from-green-500/10 to-blue-500/10",
    "from-blue-500/10 to-pink-500/10",
    "from-emerald-500/10 to-green-500/10",
    "from-pink-500/10 to-fuchsia-500/10",
    "from-cyan-500/10 to-blue-500/10",
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 150, damping: 20 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={cx(
        "relative rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden",
        "bg-gradient-to-br",
        gradient,
        "hover:bg-white/10 transition-all duration-300"
      )}
    >
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
          backgroundSize: "200% 200%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative p-4 sm:p-6">
        {/* Mobile */}
        <div className="lg:hidden space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="h-12 w-12 rounded-2xl bg-white/5 grid place-items-center border border-white/10">
                <Sparkles className="text-yellow-300" size={20} />
              </motion.div>
              <div>
                <div className="font-mono text-lg font-black text-white">{acc?.accountNumber}</div>
                <div className="text-xs text-white/55">{acc?.platform || "MT5"}</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.15, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
              onClick={onMore}
              className="h-10 w-10 rounded-xl bg-white/5 grid place-items-center border border-white/10 hover:bg-white/10 transition-all"
            >
              <Info className="text-blue-200" size={18} />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/55 mb-1">Type</div>
              <ColorfulBadge variant="default">{acc?.accountType || "Account"}</ColorfulBadge>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/55 mb-1">Leverage</div>
              <ColorfulBadge variant="info">x{acc?.leverage || "—"}</ColorfulBadge>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/55 mb-1">Balance</div>
              <div className="text-lg font-black text-white">
                $<Money value={info?.Balance} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/55 mb-1">Equity</div>
              <div className="text-lg font-black text-white">
                $<Money value={info?.Equity} />
              </div>
            </div>
            <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-white/55 mb-1">Profit/Loss</div>
                <div className={cx("text-xl font-black", profitPos ? "text-emerald-300" : "text-rose-300")}>
                  {typeof profit === "number" ? (
                    <>
                      {profitPos ? "+" : "-"}${Math.abs(profit).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </>
                  ) : (
                    <Loader2 className="inline animate-spin" size={20} />
                  )}
                </div>
              </div>
              <ColorfulBadge variant={profitPos ? "success" : "warning"}>{profitPos ? "📈 Profit" : "📉 Loss"}</ColorfulBadge>
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden lg:grid grid-cols-12 gap-4 items-center ">
          <div className="col-span-3 flex items-center gap-3">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="h-12 w-12 rounded-2xl bg-white/5 grid place-items-center border border-white/10 flex-shrink-0">
              <Sparkles className="text-yellow-300" size={20} />
            </motion.div>
            <div className="min-w-0">
              <div className="font-mono text-lg font-black text-white truncate">{acc?.accountNumber}</div>
              <div className="text-xs text-white/55 truncate">{acc?.platform || "MT5"}</div>
            </div>
          </div>

          <div className="col-span-2">
            <ColorfulBadge variant="default">{acc?.accountType || "Account"}</ColorfulBadge>
          </div>

          <div className="col-span-1">
            <ColorfulBadge variant="info">x{acc?.leverage || "—"}</ColorfulBadge>
          </div>

          <div className="col-span-2 font-bold text-white">
            <span className="text-white/45 text-sm mr-1">$</span>
            <Money value={info?.Balance} />
          </div>

          <div className="col-span-2 font-bold text-white">
            <span className="text-white/45 text-sm mr-1">$</span>
            <Money value={info?.Equity} />
          </div>

          <div className="col-span-2 flex items-center justify-end gap-3">
            <div className={cx("text-lg font-black", profitPos ? "text-emerald-300" : "text-rose-300")}>
              {typeof profit === "number" ? (
                <>
                  {profitPos ? "+" : "-"}${Math.abs(profit).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </>
              ) : (
                <Loader2 className="inline animate-spin" size={18} />
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.15, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
              onClick={onMore}
              className="h-10 w-10 rounded-xl bg-white/5 grid place-items-center border border-white/10 hover:bg-white/10 transition-all flex-shrink-0"
            >
              <Info className="text-blue-200" size={18} />
            </motion.button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/55">
          <div>Created: {CFformatDate(acc?.createdAt)}</div>
          <div>Age: {CFcalculateTimeSinceJoined(acc?.createdAt)}</div>
          <ColorfulBadge variant="success">{siteConfig?.serverName || "Server"}</ColorfulBadge>
        </div>
      </div>
    </motion.div>
  );
}

function DetailLine({ label, value, icon }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <span className="text-sm text-white/70">{label}</span>
      </div>
      <div className="text-sm font-bold text-white text-right">{value || "—"}</div>
    </div>
  );
}

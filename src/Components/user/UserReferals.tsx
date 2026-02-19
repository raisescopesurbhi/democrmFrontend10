// UserReferal.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Check,
  Users,
  ArrowRight,
  ChartBar,
  Wallet as WalletIcon,  
  Gift,
  Share2Icon,
  Shield,
  Link as LinkIcon,  
  TrendingUp,
  Zap,
  Award,
  DollarSign,
  Loader2,
  ArrowLeft,
  BadgeDollarSign,
  WalletCardsIcon,
  RefreshCw,
  Calendar,
  Clock,
  Info,
  ChevronDown,
  ChevronUp,
  BarChart3,Send
} from "lucide-react";
import { FaFacebookF, FaShareAlt, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
//import UseUserHook from "@/hooks/user/UseUserHook";
import UseUserHook from "../../hooks/user/UseUserHook"
import toast from "react-hot-toast";
import { CFgenerateRandomNumber } from "../../utils/CustomFunctions";
import { backendApi } from "../../utils/apiClients";

/* ----------------------------- Animation helpers ---------------------------- */
const fadeIn = {
  initial: { opacity: 0, y: 18, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -18, filter: "blur(8px)" },
  transition: { duration: 0.35 },
};

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.96, y: 10, filter: "blur(8px)" },
  animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.35, delay, ease: "easeOut" },
});

const stagger = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

/* --------------------------------- Utils --------------------------------- */
const money = (n: number | string = 0, d = 2) =>
  `$${Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })}`;

const statusChip = (s?: string) => {
  switch ((s || "").toLowerCase()) {
    case "pending":
      return "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30";
    case "approved":
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30";
    case "rejected":
      return "bg-rose-500/15 text-rose-300 border border-rose-500/30";
    default:
      return "bg-slate-700/30 text-slate-200 border border-slate-600/40";
  }
};

const formatDate = (iso?: string) => {
  if (!iso) return "--";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", { year: "numeric", day: "2-digit", month: "2-digit" }) +
    ", " +
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,   
    })
  );
};

const since = (iso?: string) => {
  if (!iso) return "--";
  const joinDate = new Date(iso);
  const today = new Date();
  const diff = Math.max(0, today.getTime() - joinDate.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  return parts.length ? `${parts.join(", ")} ago` : "less than a minute ago";
};

/* ------------------------ Neon Reactor UI (no ring) ------------------------ */
const NeonReactorBackdrop = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020307] via-[#04050b] to-[#020307]" />

      {/* neon blobs */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(52,211,153,.28), transparent 60%), radial-gradient(circle at 70% 60%, rgba(59,130,246,.22), transparent 55%)",
        }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.05 }}
        className="absolute -bottom-44 -right-44 h-[560px] w-[560px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(236,72,153,.22), transparent 60%), radial-gradient(circle at 70% 60%, rgba(16,185,129,.18), transparent 55%)",
        }}
      />

      {/* subtle grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,.18) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(circle at 50% 30%, black 30%, transparent 72%)",
        }}
      />

      {/* scan beam */}
      <motion.div
        aria-hidden
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 40, opacity: 0.55 }}
        transition={{ duration: 2.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="absolute left-0 right-0 top-0 h-24"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(59,130,246,.12), rgba(236,72,153,.10), transparent)",
        }}
      />

      {/* vignette */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(0,0,0,0) 0%, rgba(0,0,0,.35) 55%, rgba(0,0,0,.72) 100%)",
        }}
      />
    </div>
  );
};

const NeonFrame = ({
  children,
  className = "",
  tone = "emerald",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "emerald" | "blue" | "pink" | "violet";
}) => {
  const toneMap: Record<string, string> = {
    emerald: "from-emerald-400 via-cyan-400 to-fuchsia-400",
    blue: "from-sky-400 via-indigo-400 to-emerald-300",
    pink: "from-fuchsia-400 via-pink-400 to-yellow-300",
    violet: "from-indigo-400 via-fuchsia-400 to-emerald-400",
  };

  const ring = toneMap[tone] || toneMap.emerald;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-2xl p-[1.2px] ${className}`}
    >
      {/* conic border */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <motion.div
          aria-hidden
          className={`absolute -inset-[35%] bg-gradient-to-r ${ring} opacity-85`}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ filter: "blur(0px)" }}
        />
        <div className="absolute inset-[1px] rounded-2xl bg-[#060814]/80 backdrop-blur-xl border border-white/10" />
        {/* shimmer */}
        <motion.div
          aria-hidden
          className="absolute inset-[1px] rounded-2xl"
          initial={{ opacity: 0.0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background:
              "linear-gradient(120deg, transparent 0%, rgba(255,255,255,.06) 25%, transparent 50%)",
            maskImage: "radial-gradient(circle at 30% 20%, black 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative rounded-2xl p-6">{children}</div>
    </motion.div>
  );
};

const Pill = ({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active?: boolean;
  icon: any;
  label: string;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`group relative inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold transition-all ${
      active
        ? "text-white"
        : "text-slate-300 hover:text-white"
    }`}
  >
    {active && (
      <motion.div
        layoutId="tabBubble"
        className="absolute inset-0 rounded-xl"
        style={{
          background:
            "linear-gradient(90deg, rgba(16,185,129,.35), rgba(59,130,246,.32), rgba(236,72,153,.30))",
          boxShadow: "0 0 24px rgba(59,130,246,.18)",
        }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
      />
    )}
    <span className="relative z-10 grid place-items-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/15">
      <Icon className="w-4 h-4" />
    </span>
    <span className="relative z-10">{label}</span>
  </motion.button>
);

const MiniBar = ({
  icon: Icon,
  label,
  value,
  tone = "emerald",
}: {
  icon: any;
  label: string;
  value: string | number;
  tone?: "emerald" | "blue" | "pink" | "violet";
}) => {
  const toneMap: Record<string, string> = {
    emerald: "from-emerald-400/25 via-cyan-400/15 to-transparent",
    blue: "from-sky-400/25 via-indigo-400/15 to-transparent",
    pink: "from-fuchsia-400/25 via-pink-400/15 to-transparent",
    violet: "from-indigo-400/25 via-fuchsia-400/15 to-transparent",
  };
  const bg = toneMap[tone] || toneMap.emerald;

  return (
    <motion.div
      {...scaleIn(0)}
      className="relative rounded-2xl border border-white/10 bg-[#070a16]/60 backdrop-blur-xl overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${bg}`} />
      <div className="relative p-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
          <Icon className="w-5 h-5 text-slate-100" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-slate-400">{label}</div>
          <div className="text-lg font-bold text-slate-100 truncate">{value}</div>
        </div>
      </div>
    </motion.div>
  );
};

const BenefitBar = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) => (
  <motion.div
    whileHover={{ y: -2, scale: 1.01 }}
    transition={{ duration: 0.2 }}
    className="relative rounded-2xl border border-white/10 bg-[#070a16]/60 backdrop-blur-xl overflow-hidden"
  >
    <div
      className="absolute inset-0 opacity-70"
      style={{
        background:
          "linear-gradient(90deg, rgba(59,130,246,.14), rgba(236,72,153,.10), rgba(16,185,129,.10), transparent)",
      }}
    />
    <div className="relative p-4 flex items-start gap-3">
      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
        <Icon className="w-5 h-5 text-slate-100" />
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-100">{title}</div>
        <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
      </div>
    </div>
  </motion.div>
);

const ModernHeadingLeft = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div>
    <motion.h1
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-sky-300 to-fuchsia-300 text-transparent bg-clip-text"
    >
      {title}
    </motion.h1>
    <motion.p
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
      className="text-slate-400 mt-2"
    >
      {subtitle}
    </motion.p>
  </div>
);

const PrimaryButton = ({
  icon: Icon,
  children,
  onClick,
  disabled,
  type = "button",
}: {
  icon?: any;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) => (
  <motion.button
    type={type}
    whileHover={!disabled ? { scale: 1.02 } : undefined}
    whileTap={!disabled ? { scale: 0.98 } : undefined}
    onClick={onClick}
    disabled={disabled}
    className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-all ${
      disabled
        ? "bg-white/5 text-slate-400 border border-white/10 cursor-not-allowed"
        : "text-white"
    }`}
    style={
      disabled
        ? undefined
        : {
            background:
              "linear-gradient(90deg, rgba(16,185,129,.55), rgba(59,130,246,.55), rgba(236,72,153,.48))",
            boxShadow: "0 0 28px rgba(59,130,246,.18)",
          }
    }
  >
    {Icon && <Icon className="w-5 h-5" />}
    {children}
  </motion.button>
);

/* -------------------------------- Main Component -------------------------------- */
type TabKey = "overview" | "commission" | "withdraw" | "withdrawal-history" | "referrals-details";

const UserReferal = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const loggedUser = useSelector((store: any) => store.user.loggedUser);
  const siteConfig = useSelector((state: any) => state.user.siteConfig);

  const { getUpdateLoggedUser } = UseUserHook();
  const hasAnimatedRef = useRef(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const extractedUrl = currentUrl ? new URL(currentUrl).origin : "";

  const [commissionsData, setCommissionsData] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loadingWd, setLoadingWd] = useState(false);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    if (!hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      getUpdateLoggedUser();  
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loggedUser?.referralAccount) {
      fetchCommissions();
      fetchWithdrawals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser?.referralAccount]);

  /* --------------------------------- Data --------------------------------- */
  const fetchCommissions = async () => {
    if (!loggedUser?.referralAccount) return;
    try {
      const res = await backendApi.get(`/user-zone-ibs/${loggedUser?.referralAccount}`);
      setCommissionsData(res?.data?.data || []);
    } catch {
      // silent
    }
  };

  const fetchWithdrawals = async () => {
    if (!loggedUser?._id) return;
    setLoadingWd(true);
    try {
      const res = await backendApi.get(`/ib-withdrawals/${loggedUser._id}`);
      setWithdrawals((res.data?.data || []).reverse());
    } catch {
      // ignore
    } finally {
      setLoadingWd(false);
    }
  };

  const totalCommission = useMemo(() => {
    const direct = commissionsData.reduce((s, r) => s + Number(r?.commission || 0), 0);
    const perUser = commissionsData.reduce((s, r) => s + Number(r?.totalCommission || 0), 0);
    return direct > 0 ? direct : perUser;
  }, [commissionsData]);

  const approvedWithdrawalAmount = useMemo(
    () =>
      withdrawals
        .filter((w: any) => String(w?.status).toLowerCase() === "approved")
        .reduce((s, w) => s + Number(w?.amount || 0), 0),
    [withdrawals]
  );

  /* -------------------------------- Actions -------------------------------- */
  const generateHandler = async () => {
    const randomNumber = CFgenerateRandomNumber(7);
    const toastId = toast.loading("Generating..");
    try {
      await backendApi.put(`/update-user`, {
        id: loggedUser._id,
        referralAccount: randomNumber,
      });
      await getUpdateLoggedUser();
      toast.success("Affiliate account created", { id: toastId });
      setActiveTab("overview");
    } catch (error: any) {
      toast.error(`Please try again later. ${error?.response?.data?.code ?? ""}`, { id: toastId });
    }
  };

  /* ------------------------- Withdraw (tab view) ------------------------- */
  const WithdrawalsFormView = () => {
    const [selectedGateway, setSelectedGateway] = useState("Bank Transfer");
    const [apiLoader, setApiLoader] = useState(false);
    const [error, setError] = useState("");
    const [amount, setAmount] = useState("");
    const [selectWallet, setSelectWallet] = useState("usdtTrc20");
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const balance = Number(loggedUser?.ibBalance || 0).toFixed(4);

    const currentDateTime = new Date();
    const formattedDateTime =
      currentDateTime.toLocaleDateString("en-GB") +
      ", " +
      currentDateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

    const customContent = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Withdrawal Request Confirmation</title></head>
<body>
  <div>
    <h2>Commission Withdrawal Requested</h2>
    <p>Dear ${loggedUser?.firstName || ""} ${loggedUser?.lastName || ""},</p>
    <p>We received your commission withdrawal request.</p>
    <p><b>Username:</b> ${loggedUser?.email}</p>
    <p><b>Total Amount:</b> ${balance}</p>
    <p><b>Withdrawal Amount:</b> ${amount}</p>
    <p><b>Updated:</b> ${formattedDateTime}</p>
  </div>
</body></html>`;

    const withdrawalHandler = async (e: any) => {
      e.preventDefault();
      if (isWithdrawing) return;

      setApiLoader(true);
      setError("");
      setIsWithdrawing(true);

      try {
        const balNum = Number(balance);
        const amtNum = Number(amount);

        if (balNum <= 0) {
          setError(`You don't have sufficient balance for withdrawal.`); 
        } else if (Number.isNaN(amtNum) || amtNum <= 0) {
          setError(`Enter a valid withdrawal amount.`);
        } else if (amtNum > balNum) {
          setError(`Amount must be less than or equal to $${balance}`);
        } else {
          await backendApi.post(`/add-referral-withdrawal`, {
            referralId: loggedUser.referralAccount,
            method: selectedGateway === "Bank Transfer" ? selectedGateway : selectWallet,
            amount: amtNum,
            status: "pending",
            userId: loggedUser._id,
            managerIndex: import.meta.env.VITE_MANAGER_INDEX,
            totalBalance: balance,
            level: 1,
          });

          try {
            await backendApi.post(`/custom-mail`, {
              email: loggedUser.email,
              content: customContent,
              subject: "IB Withdrawal Requested",
            });
          } catch {
            // ignore mail failure
          }

          toast.success("Withdrawal Requested");
          setAmount("");
          fetchWithdrawals();
          getUpdateLoggedUser();
        }
      } catch (error) {
        toast.error("Something went wrong!!");
        // eslint-disable-next-line no-console
        console.log("error while withdraw", error);
      } finally {
        setApiLoader(false);
        setIsWithdrawing(false);
      }
    };

    return (
      <NeonFrame tone="blue" className="w-full">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
            <WalletIcon className="w-5 h-5 text-slate-100" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-100">Withdraw Commission</div>
            <div className="text-xs text-slate-400">Withdrawable: {money(balance, 4)}</div>
          </div>
        </div>

        <form onSubmit={withdrawalHandler} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Method</label>
              <select
                value={selectedGateway}
                onChange={(e) => setSelectedGateway(e.target.value)}
                className="block w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              >
                <option className="bg-slate-950" value="Bank Transfer">
                  Bank Transfer
                </option>
                <option className="bg-slate-950" value="Wallet Transfer">
                  Wallet Transfer
                </option>
              </select>
            </div>

            {selectedGateway === "Wallet Transfer" && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Choose Wallet</label>
                <select
                  value={selectWallet}
                  onChange={(e) => setSelectWallet(e.target.value)}
                  className="block w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                >
                  <option className="bg-slate-950" value="usdtTrc20">
                    USDT (Trc20)
                  </option>
                  <option className="bg-slate-950" value="usdtBep20">
                    USDT (Bep20)
                  </option>
                  <option className="bg-slate-950" value="binanceId">
                    Binance ID
                  </option>
                  <option className="bg-slate-950" value="btcAddress">
                    BTC Address
                  </option>
                </select>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
                <WalletCardsIcon className="w-5 h-5 text-slate-100" />
              </div>
              <div className="text-slate-200 font-semibold">Account details</div>
            </div>

            {selectedGateway === "Bank Transfer" ? (
              <div className="grid sm:grid-cols-2 gap-3 text-slate-300 text-sm">
                <p>
                  Bank Name:{" "}
                  <span className="font-semibold text-slate-100">{loggedUser?.bankDetails?.bankName}</span>
                </p>
                <p>
                  Holder Name:{" "}
                  <span className="font-semibold text-slate-100">{loggedUser?.bankDetails?.holderName}</span>
                </p>
                <p>
                  Account Number:{" "}
                  <span className="font-semibold text-slate-100">{loggedUser?.bankDetails?.accountNumber}</span>
                </p>
                <p>
                  IFSC Code:{" "}
                  <span className="font-semibold text-slate-100">{loggedUser?.bankDetails?.ifscCode}</span>
                </p>
                <p>
                  Swift Code:{" "}
                  <span className="font-semibold text-slate-100">{loggedUser?.bankDetails?.swiftCode}</span>
                </p>
                <p>
                  UPI ID: <span className="font-semibold text-slate-100">{loggedUser?.bankDetails?.upiId}</span>
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3 text-slate-300 text-sm">
                {selectWallet === "usdtTrc20" && (
                  <p>
                    USDT TRC20:{" "}
                    <span className="font-semibold text-slate-100">{loggedUser?.walletDetails?.tetherAddress}</span>
                  </p>
                )}
                {selectWallet === "usdtBep20" && (
                  <p>
                    USDT BEP20:{" "}
                    <span className="font-semibold text-slate-100">{loggedUser?.walletDetails?.ethAddress}</span>
                  </p>
                )}
                {selectWallet === "binanceId" && (
                  <p>
                    Binance ID:{" "}
                    <span className="font-semibold text-slate-100">{loggedUser?.walletDetails?.accountNumber}</span>
                  </p>
                )}
                {selectWallet === "btcAddress" && (
                  <p>
                    BTC Address:{" "}
                    <span className="font-semibold text-slate-100">{loggedUser?.walletDetails?.trxAddress}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BadgeDollarSign className="h-5 w-5 text-slate-300" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <PrimaryButton type="submit" disabled={isWithdrawing} icon={isWithdrawing ? Loader2 : Send}>
            {isWithdrawing ? "Processing..." : "Submit Withdrawal"}
          </PrimaryButton>

          {(apiLoader || isWithdrawing) && (
            <div className="text-center text-xs text-slate-400">Please wait…</div>
          )}

          {error && <div className="text-center text-sm text-rose-300 font-medium">{error}</div>}
        </form>
      </NeonFrame>
    );
  };

  /* ---------------------- Withdrawal History (tab view) ---------------------- */
  const WithdrawalsHistoryView = () => {
    const stats = useMemo(() => {
      const total = withdrawals.length;
      const pending = withdrawals.filter((x: any) => x.status === "pending");
      const approved = withdrawals.filter((x: any) => x.status === "approved");
      const rejected = withdrawals.filter((x: any) => x.status === "rejected");
      const sum = (arr: any[], key: "amount" | "totalBalance") =>
        arr.reduce((s, v) => s + Number(v?.[key] || 0), 0);

      const totalRequested = sum(withdrawals, "amount");
      const pendingAmount = sum(pending, "amount");
      const approvedAmount = sum(approved, "amount");
      const lastUpdated = withdrawals[0]?.updatedAt ? new Date(withdrawals[0].updatedAt) : null;

      return {
        total,
        pendingCount: pending.length,
        approvedCount: approved.length,
        rejectedCount: rejected.length,
        totalRequested,
        pendingAmount,
        approvedAmount,
        lastUpdated,
      };
    }, [withdrawals]);

    return (
      <NeonFrame tone="violet" className="w-full">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
              <RefreshCw className="w-5 h-5 text-slate-100" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-100">Withdrawl History</div>
              <div className="text-xs text-slate-400">
                Approved total: {money(stats.approvedAmount, 4)} • Pending: {money(stats.pendingAmount, 4)}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchWithdrawals}
            disabled={loadingWd}
            className="px-4 py-2.5 rounded-2xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loadingWd ? "animate-spin" : ""}`} />
            {loadingWd ? "Refreshing…" : "Refresh"}
          </motion.button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <MiniBar icon={DollarSign} label="Total Requests" value={stats.total} tone="blue" />
          <MiniBar icon={Clock} label="Pending" value={stats.pendingCount} tone="pink" />
          <MiniBar icon={Award} label="Approved" value={stats.approvedCount} tone="emerald" />
          <MiniBar
            icon={Calendar}
            label="Last Updated"
            value={stats.lastUpdated ? formatDate(stats.lastUpdated.toISOString()) : "--"}
            tone="violet"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-x-auto">
          <table className="w-full min-w-[760px] whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-3 text-left text-slate-300 font-medium">Total Amount</th>
                <th className="p-3 text-center text-slate-300 font-medium">Withdrawal Amount</th>
                <th className="p-3 text-center text-slate-300 font-medium">Method</th>
                <th className="p-3 text-center text-slate-300 font-medium">Updated At</th>
                <th className="p-3 text-center text-slate-300 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loadingWd ? (
                <tr>
                  <td colSpan={5} className="py-10">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-300" />
                    </div>
                  </td>
                </tr>
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    <div className="flex gap-2 mx-auto justify-center items-center text-slate-300">
                      <Info className="w-5 h-5 text-yellow-300" />
                      <p>No withdrawal history available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                withdrawals.map((v: any, idx: number) => (
                  <tr
                    key={v._id || idx}
                    className="border-b border-white/10 bg-black/10 hover:bg-black/20 transition-colors"
                  >
                    <td className="p-3 pl-6 text-slate-200">{money(v?.totalBalance || 0, 4)}</td>
                    <td className="p-3 text-center text-slate-200">{money(v?.amount || 0, 4)}</td>
                    <td className="p-3 text-center text-slate-300">{String(v?.method || "--")}</td>
                    <td className="p-3 text-center">
                      <div className="text-slate-200">{formatDate(v?.updatedAt)}</div>
                      <div className="text-xs text-slate-500">{since(v?.updatedAt)}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusChip(v?.status)}`}>
                        {String(v?.status || "--").toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {withdrawals.length > 0 && !loadingWd && (
          <div className="flex items-center justify-between px-2 sm:px-1 pt-4 text-xs text-slate-500">
            <div>
              Showing {withdrawals.length} record{withdrawals.length > 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Data updates as requests are processed
            </div>
          </div>
        )}
      </NeonFrame>
    );
  };

  /* ------------------------- IB Details (tab view) ------------------------- */
  const ReferralsDetailsView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedEmails, setExpandedEmails] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const refresh = async () => {
      setIsLoading(true);
      try {
        await fetchCommissions();
      } finally {
        setIsLoading(false);
      }
    };

    const toggleDropdown = (email: string) =>
      setExpandedEmails((prev) => ({ ...prev, [email]: !prev[email] }));

    const filteredData = useMemo(() => {
      const q = searchTerm.trim().toLowerCase();
      if (!q) return commissionsData;
      return commissionsData.filter(
        (item: any) =>
          (item.email || "").toLowerCase().includes(q) ||
          (item.name || "").toLowerCase().includes(q) ||
          (item.country || "").toLowerCase().includes(q) ||
          String(item.accountNumber || "").toLowerCase().includes(q)
      );
    }, [commissionsData, searchTerm]);

    const groupedData = useMemo(() => {
      return filteredData.reduce((acc: Record<string, any[]>, item: any) => {
        const key = item.email || "unknown";
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});
    }, [filteredData]);

    const emailKeys = useMemo(() => Object.keys(groupedData), [groupedData]);

    const paginatedEmails = useMemo(
      () => emailKeys.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
      [emailKeys, currentPage]
    );

    const totalPages = Math.max(1, Math.ceil(emailKeys.length / ITEMS_PER_PAGE));

    const stats = useMemo(() => {
      const totalUsers = commissionsData.length;
      const uniqueEmails = new Set(commissionsData.map((u: any) => u.email)).size;
      const totalComm = commissionsData.reduce((s: number, u: any) => s + (u.totalCommission || 0), 0);
      const totalVol = commissionsData.reduce((s: number, u: any) => s + (u.totalLot || 0), 0);
      const activeUsers = commissionsData.filter(
        (u: any) => (u.totalCommission || 0) > 0 || (u.totalLot || 0) > 0
      ).length;

      const avgCommission = totalUsers ? totalComm / totalUsers : 0;
      const avgVolume = totalUsers ? totalVol / totalUsers : 0;

      return {
        totalUsers,
        uniqueEmails,
        totalComm,
        totalVol,
        activeUsers,
        avgCommission,
        avgVolume,
      };
    }, [commissionsData]);

    return (
      <NeonFrame tone="pink" className="w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
              <BarChart3 className="w-5 h-5 text-slate-100" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-100">IB Details</div>
              <div className="text-xs text-slate-400">
                Users: {stats.totalUsers} • Unique: {stats.uniqueEmails} • Active: {stats.activeUsers}
              </div>
            </div>
          </div>

          <div className="flex items-stretch gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                placeholder="Search name, email, country or account…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/35"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={refresh}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-2xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Refreshing…" : "Refresh"}
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <MiniBar icon={Users} label="Total Users" value={stats.totalUsers} tone="blue" />
          <MiniBar icon={DollarSign} label="Total Commission" value={Number(stats.totalComm || 0).toFixed(4)} tone="emerald" />
          <MiniBar icon={ChartBar} label="Total Volume" value={Number(stats.totalVol || 0).toFixed(4)} tone="violet" />
          <MiniBar icon={TrendingUp} label="Avg/User" value={`${Number(stats.avgCommission || 0).toFixed(4)} / ${Number(stats.avgVolume || 0).toFixed(4)}`} tone="pink" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-3 text-left text-slate-300 font-medium">Name / Email</th>
                <th className="p-3 text-center text-slate-300 font-medium">Country</th>
                <th className="p-3 text-center text-slate-300 font-medium">AC No</th>
                <th className="p-3 text-center text-slate-300 font-medium">Level</th>
                <th className="p-3 text-center text-slate-300 font-medium">Total Volume</th>
                <th className="p-3 text-center text-slate-300 font-medium">Total Earned</th>
              </tr>
            </thead>

            <tbody>
              {paginatedEmails.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16">
                    <div className="flex items-center justify-center gap-2 text-slate-300">
                      <Info className="w-5 h-5 text-yellow-300" />
                      No data found
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedEmails.map((email) => {
                  const users = (groupedData as any)[email] as any[];
                  const isExpanded = !!expandedEmails[email];
                  const first = users[0];

                  return (
                    <FragmentRows
                      key={email}
                      email={email}
                      users={users}
                      first={first}
                      isExpanded={isExpanded}
                      toggle={() => toggleDropdown(email)}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-4 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-200 disabled:opacity-40 hover:bg-white/10 transition"
            >
              Prev
            </button>
            <span className="text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-200 disabled:opacity-40 hover:bg-white/10 transition"
            >
              Next
            </button>
          </div>
        )}
      </NeonFrame>
    );
  };

  /* ----------------------------- Main layout math ----------------------------- */
  const totalReferrals = loggedUser?.referredUsers?.length || 0;
  const activeTraders = commissionsData.length;
  const commissionRate = `${siteConfig?.commissionPercent ?? "10%"}`; 

  const referralLink =
    loggedUser?.referralAccount && `${extractedUrl}/user/signup/${loggedUser?.referralAccount}`;

  /* ----------------------------- Render ----------------------------- */
  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeonReactorBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        {/* TOP ROW: Left heading + Right horizontal bars */}
        
        {/* <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
          <div className="flex items-center justify-center mx-auto">
            <ModernHeadingLeft title="Affiliate & Referrals" subtitle="Earn Commissions" />
          </div> 

          <motion.div
            {...scaleIn(0.05)}
            className="w-full lg:w-auto"
          >
            <NeonFrame tone="blue" className="p-0">
              <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2">
                <Pill
                  active={activeTab === "overview"}
                  icon={ChartBar}
                  label="Overview"
                  onClick={() => setActiveTab("overview")}
                />
                <Pill
                  active={activeTab === "commission"}
                  icon={DollarSign}
                  label="Commission"
                  onClick={() => setActiveTab("commission")}
                />
                <Pill
                  active={activeTab === "withdraw"}
                  icon={WalletIcon}
                  label="Withdraw"
                  onClick={() => setActiveTab("withdraw")}
                />
                <Pill
                  active={activeTab === "withdrawal-history"}
                  icon={RefreshCw}
                  label="Withdrawl History"
                  onClick={() => setActiveTab("withdrawal-history")}
                />
                <Pill
                  active={activeTab === "referrals-details"}
                  icon={BarChart3}
                  label="IB Details"
                  onClick={() => setActiveTab("referrals-details")}
                />
              </div>
            </NeonFrame>
          </motion.div>
        </div> */}

        <div className="flex flex-col items-center gap-6">
  {/* Heading Center */}
  <div className="flex items-center justify-center w-full">
    <ModernHeadingLeft
      title="Affiliate & Referrals"
      subtitle="Earn Commissions"
      className="text-center"
    />
  </div>

  {/* Tabs Bar Below (Horizontal) */}
  <motion.div {...scaleIn(0.05)} className="w-full flex justify-center">
    <NeonFrame tone="blue" className="p-0 w-full max-w-4xl">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Pill
          active={activeTab === "overview"}
          icon={ChartBar}
          label="Overview"
          onClick={() => setActiveTab("overview")}
        />
        <Pill
          active={activeTab === "commission"}
          icon={DollarSign}
          label="Commission"
          onClick={() => setActiveTab("commission")}
        />
        <Pill
          active={activeTab === "withdraw"}
          icon={WalletIcon}
          label="Withdraw"
          onClick={() => setActiveTab("withdraw")}
        />
        <Pill
          active={activeTab === "withdrawal-history"}
          icon={RefreshCw}
          label="Withdrawal History"
          onClick={() => setActiveTab("withdrawal-history")}
        />
        <Pill
          active={activeTab === "referrals-details"}
          icon={BarChart3}
          label="IB Details"
          onClick={() => setActiveTab("referrals-details")}
        />
      </div>
    </NeonFrame>
  </motion.div>
</div>


        {/* BELOW: 3-column layout with required left stats + center + right benefits */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: four vertical bars */}
          <motion.div variants={stagger} initial="initial" animate="animate" className="lg:col-span-3 space-y-4">
            <MiniBar icon={DollarSign} label="Total Earned" value={money(totalCommission, 2)} tone="emerald" />
            <MiniBar icon={Users} label="Total Referrals" value={totalReferrals} tone="blue" />
            <MiniBar icon={TrendingUp} label="Active Traders" value={activeTraders} tone="violet" />
            <MiniBar icon={Award} label="Commission Rate" value={commissionRate} tone="pink" />
          </motion.div>

          {/* CENTER: Affiliate Program heading + icon + Start journey + generate (or referral link if already created) */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} {...fadeIn}>
                {activeTab === "overview" && (
                  <NeonFrame tone="emerald" className="w-full">
                    <motion.div {...scaleIn(0.02)} className="text-center">
                      <div className="text-xl md:text-2xl font-extrabold text-slate-100">
                        Affiliate Program
                      </div>

                      <div className="mt-5 flex justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 grid place-items-center">
                          <LinkIcon className="w-7 h-7 text-slate-100" />
                        </div>
                      </div>

                      {!loggedUser?.referralAccount ? (
                        <>
                          <div className="mt-6 text-lg md:text-xl font-bold text-slate-100">
                            Start Affiliate Journey
                          </div>
                          <div className="mt-5">
                            <PrimaryButton icon={Zap} onClick={generateHandler}>
                              Generate Affiliate Account
                            </PrimaryButton>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mt-6 text-lg md:text-xl font-bold text-slate-100">
                            Your Affiliate Link
                          </div>

                          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                            {referralLink ? (
                              <ReferralLinkInput referralLink={referralLink} />
                            ) : (
                              <div className="text-slate-400 text-sm">--</div>
                            )}
                          </div>

                          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setActiveTab("referrals-details")}
                              className="rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition font-semibold"
                            >
                              View IB Details
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setActiveTab("withdraw")}
                              className="rounded-2xl px-4 py-3 text-white font-semibold"
                              style={{
                                background:
                                  "linear-gradient(90deg, rgba(59,130,246,.55), rgba(236,72,153,.42), rgba(16,185,129,.42))",
                                boxShadow: "0 0 26px rgba(236,72,153,.14)",
                              }}
                            >
                              Withdraw Earnings
                            </motion.button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </NeonFrame>
                )}

                {activeTab === "commission" && (
                  <NeonFrame tone="emerald" className="w-full">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
                        <DollarSign className="w-5 h-5 text-slate-100" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-100">Commission</div>
                        <div className="text-xs text-slate-400">
                          Earned: {money(totalCommission, 4)} • Approved Withdrawals: {money(approvedWithdrawalAmount, 4)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <MiniBar icon={DollarSign} label="Total Commission" value={money(totalCommission, 4)} tone="emerald" />
                      <MiniBar icon={WalletIcon} label="Approved Withdrawals" value={money(approvedWithdrawalAmount, 4)} tone="blue" />
                      <MiniBar icon={TrendingUp} label="Withdrawable Balance" value={money(Number(loggedUser?.ibBalance || 0), 4)} tone="violet" />
                      <MiniBar icon={BarChart3} label="Active Traders" value={activeTraders} tone="pink" />
                    </div>
                  </NeonFrame>
                )}

                {activeTab === "withdraw" && <WithdrawalsFormView />}
                {activeTab === "withdrawal-history" && <WithdrawalsHistoryView />}
                {activeTab === "referrals-details" && <ReferralsDetailsView />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: three bars benefits */}
          <div className="lg:col-span-3 space-y-4">
            <BenefitBar icon={Gift} title="Unlimited Earning" desc="No cap on commissions" />
            <BenefitBar icon={Zap} title="Instant payouts" desc="Request withdrawals anytime" />
            <BenefitBar icon={Shield} title="Secure and safe" desc="Protected by bank-level security" />

            {/* (Optional) quick share below benefits, only if already created */}
            {loggedUser?.referralAccount && referralLink && (
              <NeonFrame tone="blue" className="p-0">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
                      <Share2Icon className="w-5 h-5 text-slate-100" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">Quick Share</div>
                      <div className="text-xs text-slate-400">Share your referral link</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Join me and earn with this broker — sign up here: ${referralLink}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    <FaWhatsapp size={20} />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    <FaFacebookF size={20} />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `Join me and earn with this broker — sign up here: ${referralLink}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    <FaXTwitter size={20} />
                  </a>
                  <ShareNativeButton referralLink={referralLink} />
                </div>
              </NeonFrame>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReferal;

/* ---------------------------- Helper components ---------------------------- */

const ShareNativeButton = ({ referralLink }: { referralLink: string }) => {
  const shareOnNative = () => {
    const shareText = `Join me and earn with this broker — sign up here: ${referralLink}`;
    if ((navigator as any).share) {
      (navigator as any)
        .share({
          title: "Referral Link",
          text: shareText,
          url: referralLink,
        })
        .catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
    }
  };

  return (
    <button
      onClick={shareOnNative}
      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
      title="Share"
    >
      <FaShareAlt size={20} />
    </button>
  );
};

const ReferralLinkInput = ({ referralLink }: { referralLink: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1800);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
      <div className="relative flex-1">
        <input
          type="text"
          readOnly
          value={referralLink}
          className="w-full pl-4 pr-28 py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/35 text-sm font-medium"
        />
        <button
          onClick={copyToClipboard}
          className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            isCopied
              ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30"
              : "bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10"
          }`}
        >
          {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
};

const FragmentRows = ({
  email,
  users,
  first,
  isExpanded,
  toggle,
}: {
  email: string;
  users: any[];
  first: any;
  isExpanded: boolean;
  toggle: () => void;  
}) => {
  const hasMore = users.length > 1;

  return (
    <>
      <tr className="border-b border-white/10 bg-black/10 hover:bg-black/20 transition-colors">
        <td className="pl-6 pr-3 py-3 cursor-pointer" onClick={toggle}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-slate-200">{first?.name || "-"}</p>
              <p className="truncate text-slate-400 text-sm">{email}</p>
            </div>
            {hasMore && (
              <span className="text-slate-400">{isExpanded ? <ChevronUp /> : <ChevronDown />}</span>
            )}
          </div>
        </td>
        <td className="p-3 text-center text-slate-300">{first?.country || "-"}</td>
        <td className="p-3 text-center text-slate-300">{first?.accountNumber}</td>
        <td className="p-3 text-center text-slate-300">{first?.level}</td>
        <td className="p-3 text-center text-slate-300">{Number(first?.totalLot || 0).toFixed(4)}</td>
        <td className="p-3 text-center text-slate-300">{Number(first?.totalCommission || 0).toFixed(4)}</td>
      </tr>

      {isExpanded &&
        users.slice(1).map((u: any) => (
          <tr
            key={u._id}
            className="border-b border-white/10 bg-black/5 hover:bg-black/15 transition-colors"
          >
            <td className="pl-12 pr-3 py-2">
              <p className="text-slate-200">{u.name}</p>
              <p className="text-slate-400 text-sm">{u.email}</p>
            </td>
            <td className="p-2 text-center text-slate-300">{u.country || "-"}</td>
            <td className="p-2 text-center text-slate-300">{u.accountNumber}</td>
            <td className="p-2 text-center text-slate-300">{u.level}</td>
            <td className="p-2 text-center text-slate-300">{Number(u.totalLot || 0).toFixed(4)}</td>
            <td className="p-2 text-center text-slate-300">{Number(u.totalCommission || 0).toFixed(4)}</td>
          </tr>
        ))}
    </>
  );
};

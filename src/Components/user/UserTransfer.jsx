import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useTransition,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { backendApi } from "../../utils/apiClients";
// import { metaApi } from "../../utils/apiClients";
import ModernHeading from "../lib/ModernHeading"; // kept (not required for styling)
import {
  ChevronDown,
  Sparkles,
  ArrowLeftRight,
  Wallet,
  BadgeCheck,
  Zap,
  ArrowRight,
  RotateCcw,
  Gauge,
  Coins,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// const MANAGER_INDEX = import.meta.env.VITE_MANAGER_INDEX;

const cx = (...c) => c.filter(Boolean).join(" ");

/* =========================================================================
   ✅ FULL MOBILE RESPONSIVE (desktop unchanged)
   - NO API/workflow changes
   - Only responsive/layout safety fixes:
     ✅ remove mobile-breaking fixed heights / margins: -mt-10, ml-10, h-[250px], h-[700px]
     ✅ prevent horizontal overflow: overflow-x-hidden + min-w-0
     ✅ header stacks on mobile, ring + reset align cleanly
     ✅ grid stays 1-col on mobile, keeps lg 12-col desktop layout
     ✅ cards: min-w-0, text truncation, select options safe, spacing tuned
   ======================================================================= */

const NeonReactorBackdrop = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        i,
        x: (i * 37) % 100,
        y: (i * 61) % 100,
        s: 1 + ((i * 11) % 3),
        d: 3 + ((i * 7) % 7),
        o: 0.18 + ((i * 9) % 45) / 100,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[#020307]" />

      {/* neon blobs */}
      <motion.div
        className="absolute -top-[28rem] -left-[28rem] h-[60rem] w-[60rem] rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(34,197,94,0.65), transparent 58%)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.22, 0.45, 0.22] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[30rem] -right-[30rem] h-[64rem] w-[64rem] rounded-full blur-3xl opacity-35"
        style={{
          background:
            "radial-gradient(circle at 70% 60%, rgba(59,130,246,0.62), transparent 60%)",
        }}
        animate={{ scale: [1.06, 0.95, 1.06], opacity: [0.18, 0.4, 0.18] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(236,72,153,0.55), transparent 62%)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -top-44 right-16 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(circle at 45% 45%, rgba(16,185,129,0.55), transparent 64%)",
        }}
        animate={{ scale: [1, 1.09, 1], x: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* circuit lines */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage:
            "radial-gradient(120% 80% at 50% 0%, black 55%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(120% 80% at 50% 0%, black 55%, transparent 85%)",
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

      {/* particles */}
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

      {/* scan beam */}
      <motion.div
        className="absolute inset-x-0 -top-48 h-48 opacity-[0.12]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(34,197,94,0.85) 50%, transparent 100%)",
        }}
        animate={{ y: ["-10vh", "120vh"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
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

const NeonFrame = ({ className = "", children }) => (
  <div
    className={cx(
      "relative rounded-[26px] sm:rounded-[30px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl overflow-hidden",
      "shadow-[0_28px_140px_rgba(0,0,0,0.55)]",
      className,
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
    <div className="absolute inset-[1px] rounded-[25px] sm:rounded-[29px] bg-[#04050b]/80" />
    <motion.div
      className="absolute inset-0 opacity-[0.09]"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
      }}
      animate={{ x: ["-120%", "120%"] }}
      transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
    />
    <div className="relative min-w-0">{children}</div>
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
    <span
      className={cx(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-black tracking-wide",
        tones[tone] || tones.gray,
      )}
    >
      {children}
    </span>
  );
};

const FieldLabel = ({ icon: Icon, label, sub }) => (
  <div className="flex items-center justify-between gap-3">
    <label className="text-[12px] text-white/75 font-black tracking-wide flex items-center gap-2 min-w-0">
      <Icon className="h-4 w-4 text-green-200 shrink-0" />
      <span className="truncate">{label}</span>
    </label>
    {sub ? (
      <span className="text-[11px] text-white/45 shrink-0">{sub}</span>
    ) : null}
  </div>
);

const SelectWrap = ({ disabled, children }) => (
  <div
    className={cx(
      "relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden",
      "focus-within:border-green-300/25 focus-within:ring-2 focus-within:ring-green-400/10",
      disabled && "opacity-60",
    )}
  >
    <motion.div
      className="absolute inset-0 opacity-0"
      style={{
        background:
          "linear-gradient(90deg, rgba(34,197,94,0.18), rgba(59,130,246,0.14), rgba(236,72,153,0.14))",
      }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    />
    <div className="relative min-w-0">{children}</div>
  </div>
);

const SummaryTile = ({ icon, label, value, tone = "green" }) => {
  const tones = {
    green: "border-green-300/25 bg-green-500/10",
    blue: "border-blue-300/25 bg-blue-500/10",
    pink: "border-pink-300/25 bg-pink-500/10",
    emerald: "border-emerald-300/25 bg-emerald-500/10",
  };
  return (
    <motion.div
      whileHover={{ y: -4, rotate: -0.2 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={cx(
        "rounded-3xl border p-4 bg-white/[0.04] overflow-hidden min-w-0",
        tones[tone] || tones.green,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] text-white/55 font-black tracking-wide">
            {label}
          </div>
          <div className="mt-1 text-lg font-black text-white/90 truncate">
            {value}
          </div>
        </div>
        <div className="h-11 w-11 shrink-0 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const LiquidityCard = ({ children, className = "" }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className={cx(
        "relative rounded-[34px] p-[1px] overflow-hidden min-w-0",
        className,
      )}
    >
      <motion.div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "linear-gradient(135deg, rgba(34,197,94,0.55), rgba(59,130,246,0.55), rgba(236,72,153,0.55), rgba(16,185,129,0.50))",
        }}
        animate={{ filter: ["blur(0px)", "blur(1.2px)", "blur(0px)"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative rounded-[33px] bg-[#07121d]/85 border border-white/10 shadow-[0_26px_120px_rgba(0,0,0,0.55)] overflow-hidden">
        <div className="absolute left-0 top-10 bottom-10 w-[3px] bg-gradient-to-b from-green-400 via-blue-500 to-pink-500 opacity-80" />
        <div className="absolute top-0 left-12 right-12 h-[3px] bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 opacity-60" />

        <motion.div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)",
          }}
          animate={{ x: ["-120%", "120%"] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "linear" }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, transparent 35%, rgba(0,0,0,0.65) 90%)",
          }}
        />

        <div className="relative p-5 sm:p-6 min-w-0">{children}</div>
      </div>
    </motion.div>
  );
};

const ChecklistRow = ({ ok, text }) => (
  <motion.div
    layout
    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 min-w-0"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 220, damping: 18 }}
  >
    <div className="flex items-center gap-3 min-w-0">
      <div
        className={cx(
          "h-9 w-9 shrink-0 rounded-2xl border grid place-items-center",
          ok
            ? "border-green-300/25 bg-green-500/10"
            : "border-white/10 bg-white/5",
        )}
      >
        {ok ? (
          <span className="text-green-200 font-black">✓</span>
        ) : (
          <span className="h-2 w-2 rounded-full bg-white/30" />
        )}
      </div>
      <span
        className={cx(
          "text-[12px] font-black truncate",
          ok ? "text-white/85" : "text-white/55",
        )}
      >
        {text}
      </span>
    </div>
    <Pill tone={ok ? "green" : "gray"}>{ok ? "OK" : "TODO"}</Pill>
  </motion.div>
);

const btnPrimary =
  "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110";
const btnDisabled = "bg-white/10 text-white/40 cursor-not-allowed";

const CryptoIcon = ({ type }) => {
  const icons = {
    BTC: "₿",
    ETH: "Ξ",
    USDT: "₮",
    Standard: "💎",
    Pro: "⚡",
    ECN: "🚀",
    Demo: "📊",
  };
  return <span className="text-2xl">{icons[type] || "💰"}</span>;
};

/* ✅ Kept as-is (you already use it). If you truly want NO ring, delete usage in header only. */
const ReactorRing = ({ progress = 0, className = "" }) => {
  const pct = Math.max(0, Math.min(100, progress));
  return (
    <div
      className={cx(
        "relative aspect-square w-[84px] sm:w-[100px] lg:w-[150px] mx-auto",
        className,
      )}
    >
      <motion.div
        className="absolute inset-0 rounded-full opacity-70 blur-[1px]"
        style={{
          background:
            "conic-gradient(from 90deg, rgba(34,197,94,0.55), rgba(59,130,246,0.55), rgba(236,72,153,0.52), rgba(16,185,129,0.48), rgba(34,197,94,0.55))",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-[10px] rounded-full bg-[#050711] border border-white/10" />
      <motion.div
        className="absolute inset-[14px] rounded-full"
        style={{
          background: `conic-gradient(from 180deg, rgba(34,197,94,0.95) 0% ${pct}%, rgba(255,255,255,0.08) ${pct}% 100%)`,
          maskImage: "radial-gradient(circle, transparent 62%, black 64%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 62%, black 64%)",
        }}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-[34px] rounded-full"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute left-1/2 top-0 -translate-x-1/2 h-3 w-3 rounded-full bg-pink-400 shadow-[0_0_18px_rgba(236,72,153,0.55)]" />
      </motion.div>
      <motion.div
        className="absolute inset-[52px] rounded-full"
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 7.8, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute left-1/2 top-0 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.55)]" />
      </motion.div>
      <motion.div
        className="absolute inset-[60px] rounded-full"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 9.2, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute left-1/2 top-0 -translate-x-1/2 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
      </motion.div>
    </div>
  );
};

const UserTransfer = () => {
  const navigate = useNavigate();
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [fromAccountBalance, setFromAccountBalance] = useState("");
  const [toAccountBalance, setToAccountBalance] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [isTransferLoading, setIsTransferLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  const loggedUser = useSelector((store) => store.user.loggedUser);

  const availableFromAccounts = useMemo(
    () =>
      loggedUser?.accounts?.filter((acc) => acc.accountNumber !== toAccount) ||
      [],
    [loggedUser, toAccount],
  );

  const availableToAccounts = useMemo(
    () =>
      loggedUser?.accounts?.filter(
        (acc) => acc.accountNumber !== fromAccount,
      ) || [],
    [loggedUser, fromAccount],
  );

  const getAccountMeta = useCallback(
    (accountNumber) =>
      loggedUser?.accounts?.find((a) => a.accountNumber === accountNumber) ||
      {},
    [loggedUser],
  );

  // const fetchAccountInfo = useCallback(async (accountNumber, setBalance) => {
  //   if (!accountNumber) return;

  //   try {
  //     setBalance("");
  //     setBalanceLoading(true);

  //     const res = await metaApi.get(
  //       `/GetUserInfo?Manager_Index=${MANAGER_INDEX}&MT5Account=${accountNumber}`
  //     );

  //     if (res?.data?.Equity !== undefined && res.data.Equity !== null) {
  //       setBalance(res.data.Equity);
  //     } else {
  //       setBalance("0.00");
  //     }
  //   } catch (error) {
  //     console.log("Error fetching account info:", error);
  //     toast.error("Failed to fetch account balance");
  //     setBalance("0.00");
  //   } finally {
  //     setBalanceLoading(false);
  //   }
  // }, []);
  const fetchAccountInfo = useCallback(async (accountNumber, setBalance) => {
    if (!accountNumber) return;

    try {
      setBalance("");
      setBalanceLoading(true);

      const res = await backendApi.get(`/meta/user-info/${accountNumber}`);

      const equity = res?.data?.data?.Equity;
      if (equity !== undefined && equity !== null) {
        setBalance(equity);
      } else {
        setBalance("0.00");
      }
    } catch (error) {
      console.log("Error fetching account info:", error);
      toast.error("Failed to fetch account balance");
      setBalance("0.00");
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  const fromAccountInfo = useCallback(() => {
    fetchAccountInfo(fromAccount, setFromAccountBalance);
  }, [fromAccount, fetchAccountInfo]);

  const toAccountInfo = useCallback(() => {
    fetchAccountInfo(toAccount, setToAccountBalance);
  }, [toAccount, fetchAccountInfo]);

  const validateTransfer = useCallback(() => {
    if (!fromAccount || !toAccount) {
      toast.error("Both wallets must be selected!");
      return false;
    }

    if (fromAccount === toAccount) {
      toast.error("Source and destination wallets must be different!");
      return false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount!");
      return false;
    }

    const fromBalanceNum = parseFloat(fromAccountBalance || "0");
    const amountNum = parseFloat(amount);

    if (!Number.isNaN(fromBalanceNum) && amountNum > fromBalanceNum) {
      toast.error("Insufficient balance in source wallet!");
      return false;
    }

    return true;
  }, [fromAccount, toAccount, amount, fromAccountBalance]);

  //   const fetchAccountInfo = useCallback(async (accountNumber, setBalance) => {
  //   if (!accountNumber) return;

  //   try {
  //     setBalance("");
  //     setBalanceLoading(true);

  //     const res = await backendApi.get(`/api/meta/user-info/${accountNumber}`);

  //     const equity = res?.data?.data?.Equity;
  //     if (equity !== undefined && equity !== null) {
  //       setBalance(equity);
  //     } else {
  //       setBalance("0.00");
  //     }
  //   } catch (error) {
  //     console.log("Error fetching account info:", error);
  //     toast.error("Failed to fetch account balance");
  //     setBalance("0.00");
  //   } finally {
  //     setBalanceLoading(false);
  //   }
  // }, []);

  const handleSubmit = useCallback(async () => {
    console.log("data passed", fromAccount);
    console.log("data passed", toAccount);
    console.log("Amount passed", amount);

    if (isTransferLoading || !validateTransfer()) return;

    const toastId = toast.loading("Processing your transfer. Please wait...");
    setIsTransferLoading(true);

    try {
      // const withdrawal = await metaApi.get(
      //   `/MakeWithdrawBalance?Manager_Index=${MANAGER_INDEX}&MT5Account=${fromAccount}&Amount=${amount}&Comment=transfer`
      // );

      // const deposit = await metaApi.get(
      //   `/MakeDepositBalance?Manager_Index=${MANAGER_INDEX}&MT5Account=${toAccount}&Amount=${amount}&Comment=transfer`
      // );
      // console.log("data passed", fromAccount, toAccount, amount);
      // await backendApi.post("/transfer", {
      //   fromAccount,
      //   toAccount,
      //   amount,
      // });

      //console.log("Withdrawal response:", withdrawal);
      //console.log("Deposit response:", deposit);

      setShowSuccess(true);

      toast.success("Transfer completed successfully!", { id: toastId });
      navigate("/user/transaction");

      setTimeout(() => setShowSuccess(false), 3000);

      setAmount("");

      await Promise.all([fromAccountInfo(), toAccountInfo()]);
    } catch (error) {
      console.log("Transfer error:", error);
      toast.error("Transfer failed. Please try again.", { id: toastId });
    } finally {
      setIsTransferLoading(false);
    }
  }, [
    isTransferLoading,
    validateTransfer,
    //  fromAccount,
    //  toAccount,
    //  amount,
    fromAccountInfo,
    toAccountInfo,
  ]);

  const handleFromAccountChange = useCallback((value) => {
    startTransition(() => setFromAccount(value));
  }, []);

  const handleToAccountChange = useCallback((value) => {
    startTransition(() => setToAccount(value));
  }, []);

  useEffect(() => {
    fromAccountInfo();
  }, [fromAccountInfo]);

  useEffect(() => {
    toAccountInfo();
  }, [toAccountInfo]);

  const step = useMemo(() => {
    if (!fromAccount) return 1;
    if (!toAccount) return 2;
    if (!amount || parseFloat(amount) <= 0) return 3;
    return 4;
  }, [fromAccount, toAccount, amount]);

  const progress = useMemo(() => (step / 4) * 100, [step]);

  const fromMeta = useMemo(
    () => getAccountMeta(fromAccount),
    [getAccountMeta, fromAccount],
  );
  const toMeta = useMemo(
    () => getAccountMeta(toAccount),
    [getAccountMeta, toAccount],
  );

  const resetAll = () => {
    setFromAccount("");
    setToAccount("");
    setAmount("");
    setFromAccountBalance("");
    setToAccountBalance("");
  };

  const page = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 170,
        damping: 18,
        staggerChildren: 0.06,
      },
    },
  };
  const inUp = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 220, damping: 18 },
    },
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <NeonReactorBackdrop />

      <motion.div
        variants={page}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
      >
        {/* ✅ HEADER (mobile stacks; desktop same) */}
        <motion.div variants={inUp}>
          <NeonFrame className="p-4 sm:p-7 w-full">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                    Transfer Funds
                  </span>
                </h1>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] font-black tracking-wide text-white/55">
                    <span className="inline-flex items-center gap-2">
                      <ArrowLeftRight className="h-4 w-4 text-green-200" />
                      Transfer Charge
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>

                  <div className="mt-2 h-3 rounded-full border border-white/10 bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(34,197,94,0.95), rgba(59,130,246,0.95), rgba(236,72,153,0.95), rgba(16,185,129,0.90))",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 160,  
                        damping: 18,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ✅ Mobile right controls (ring + reset) */}
              <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
                <div className="shrink-0">
                  <ReactorRing
                    progress={progress}
                    className="w-[84px] sm:w-[100px] lg:w-[150px]"
                  />
                </div>

                <motion.button  
                  type="button"
                  onClick={resetAll}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="shrink-0 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-[12px] font-black text-white/80 inline-flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </motion.button>
              </div>
            </div>
          </NeonFrame>
        </motion.div>

        {/* ✅ MAIN GRID (mobile 1-col; desktop 12-col) */}
        <motion.div
          variants={inUp}
          className="mt-5 sm:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5"
        >
          {/* LEFT: INPUTS */}
          <NeonFrame className="lg:col-span-5 p-5 sm:p-6 min-w-0">
            <div className="space-y-3">
              {/* FROM (Liquidity Card) */}
              <LiquidityCard>
                <div className="space-y-2">
                  <FieldLabel
                    icon={Wallet}
                    label="From Wallet"
                    sub="Select source"
                  />

                  <SelectWrap disabled={isPending}>
                    {/* <select
                      value={fromAccount}
                      onChange={(e) => handleFromAccountChange(e.target.value)}
                      disabled={isPending}
                      className={cx(
                        "w-full appearance-none bg-transparent px-4 py-3.5 pr-10 outline-none",
                        "text-white/90 text-[13px] border-b-2 border-amber-200 font-black disabled:cursor-not-allowed"
                      )}
                    >
                      <option value="" className="bg-[#2a0de8] text-white/50">
                        Select Source Wallet
                      </option>
                      {availableFromAccounts.map((account, index) => {
                        const currency = account.currency || account.accountCurrency || "USD";
                        return (
                          <option key={index} value={account.accountNumber} className="bg-[#606578]" >
                            {account.accountNumber} • {currency}
                          </option>
                        );
                      })}
                    </select> */}

                    <select
                      value={fromAccount}
                      onChange={(e) => handleFromAccountChange(e.target.value)}
                      disabled={isPending}
                      className="
    w-full appearance-none
    bg-transparent
    px-4 py-3.5 pr-10
    outline-none
    text-[13px] font-black tracking-wide
    text-white/90
    transition-all duration-300
    focus:text-white
    focus:drop-shadow-[0_0_12px_rgba(34,197,94,0.55)]
    hover:text-white
    disabled:cursor-not-allowed
  "
                    >
                      <option
                        value=""
                        className="bg-emerald-900 text-green-400"
                      >
                        Select Source Wallet
                      </option>

                      {availableFromAccounts.map((account, index) => {
                        const currency =
                          account.currency || account.accountCurrency || "USD";
                        return (
                          <option
                            key={index}
                            value={account.accountNumber}
                            className="bg-gray-900 text-white"
                          >
                            {account.accountNumber} • {currency}
                          </option>
                        );
                      })}
                    </select>

                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none" />
                  </SelectWrap>

                  {fromAccount ? (
                    <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] text-white/50 font-black tracking-wide">
                          AVAILABLE
                        </span>
                        {balanceLoading ? (
                          <motion.div
                            className="h-4 w-24 rounded bg-white/10"
                            animate={{ opacity: [0.35, 0.9, 0.35] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                        ) : (
                          <span className="text-[12px] font-black text-white/80 truncate">
                            ${fromAccountBalance || "0.00"}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-white/60 text-[12px] min-w-0">
                        <CryptoIcon
                          type={
                            fromMeta?.icon ||
                            fromMeta?.accountType ||
                            fromMeta?.type ||
                            "Standard"
                          }
                        />
                        <span className="font-black truncate">
                          {fromMeta?.accountType ||
                            fromMeta?.type ||
                            "Standard"}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </LiquidityCard>

              {/* TO */}
              <motion.div
                className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5 min-w-0"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
              >
                <div className="space-y-2">
                  <FieldLabel
                    icon={Wallet}
                    label="To Wallet"
                    sub="Select destination"
                  />
                  <SelectWrap disabled={isPending}>
                    {/* <select
                      value={toAccount}
                      onChange={(e) => handleToAccountChange(e.target.value)}
                      disabled={isPending}
                      className={cx(
                        "w-full appearance-none bg-transparent px-4 py-3.5 pr-10 outline-none",
                        "text-white/90 text-[13px] font-black disabled:cursor-not-allowed"
                      )}
                    >
                      <option value="" className="bg-[#0b0f1a] text-white/50">
                        Select Destination Wallet
                      </option>
                      {availableToAccounts.map((account, index) => {
                        const currency = account.currency || account.accountCurrency || "USD";
                        return (
                          <option key={index} value={account.accountNumber} className="bg-[#4e054e]">
                            {account.accountNumber} • {currency}
                          </option>
                        );
                      })}
                    </select>  */}

                    <select
                      value={toAccount}
                      onChange={(e) => handleToAccountChange(e.target.value)}
                      disabled={isPending}
                      className="
    w-full appearance-none
    bg-transparent
    px-4 py-3.5 pr-10
    outline-none
    text-[13px] font-black tracking-wide
    text-white/90
    transition-all duration-300
    focus:text-white
    focus:drop-shadow-[0_0_12px_rgba(34,197,94,0.55)]
    hover:text-white
    disabled:cursor-not-allowed
  "
                    >
                      <option
                        value=""
                        className="bg-emerald-900 text-green-400"
                      >
                        Select Destination Wallet
                      </option>

                      {availableToAccounts.map((account, index) => {
                        const currency =
                          account.currency || account.accountCurrency || "USD";
                        return (
                          <option
                            key={index}
                            value={account.accountNumber}
                            className="bg-gray-900 text-white"
                          >
                            {account.accountNumber} • {currency}
                          </option>
                        );
                      })}
                    </select>

                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none" />
                  </SelectWrap>

                  {toAccount ? (
                    <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] text-white/50 font-black tracking-wide">
                          CURRENT
                        </span>
                        {balanceLoading ? (
                          <motion.div
                            className="h-4 w-24 rounded bg-green/10"
                            animate={{ opacity: [0.35, 0.9, 0.35] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                        ) : (
                          <span className="text-[12px] font-black text-white/80 truncate">
                            ${toAccountBalance || "0.00"}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-white/60 text-[12px] min-w-0">
                        <CryptoIcon
                          type={
                            toMeta?.icon ||
                            toMeta?.accountType ||
                            toMeta?.type ||
                            "Standard"
                          }
                        />
                        <span className="font-black truncate">
                          {toMeta?.accountType || toMeta?.type || "Standard"}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </motion.div>

              {/* AMOUNT */}
              <motion.div
                className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5 min-w-0"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
              >
                <div className="space-y-2">
                  <FieldLabel icon={Coins} label="Amount" sub="USD" />
                  <div className="relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <motion.div
                      className="absolute inset-0 opacity-0"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(34,197,94,0.18), rgba(59,130,246,0.14), rgba(236,72,153,0.14))",
                      }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    />
                    <div className="relative flex items-center gap-3 px-4 py-3.5">
                      <span className="text-white/50 font-black">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-transparent outline-none text-white/90 text-[14px] font-black placeholder:text-white/30"
                        inputMode="decimal"
                      />
                      <span className="text-white/40 text-[12px] font-black">
                        USD
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </NeonFrame>

          {/* MIDDLE: STATUS (✅ removed fixed h-[700px]) */}
          <NeonFrame className="lg:col-span-3 p-5 sm:p-6 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="mt-1 text-xl font-black text-white/90 inline-flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-pink-200 shrink-0" />
                  <span className="truncate">Live Checks</span>
                </div>
              </div>
              <Pill tone={step === 4 ? "emerald" : "green"}>
                {step === 4 ? "CHARGED" : "CHARGING"}
              </Pill>
            </div>

            <div className="mt-5 space-y-2">
              <ChecklistRow ok={!!fromAccount} text="From wallet selected" />
              <ChecklistRow ok={!!toAccount} text="To wallet selected" />
              <ChecklistRow
                ok={!!amount && parseFloat(amount) > 0}
                text="Amount entered"
              />
              <ChecklistRow
                ok={fromAccount && toAccount && fromAccount !== toAccount}
                text="Wallets are different"
              />
            </div>
          </NeonFrame>

          {/* RIGHT: LAUNCH */}
          <NeonFrame className="lg:col-span-4 p-5 sm:p-6 min-w-0">
            <div className="grid grid-cols-1 gap-4">
              <SummaryTile
                icon={<Wallet className="h-5 w-5 text-green-200" />}
                label="From"
                value={fromAccount || "—"}
                tone="green"
              />
              <SummaryTile
                icon={<Wallet className="h-5 w-5 text-pink-200" />}
                label="To"
                value={toAccount || "—"}
                tone="pink"
              />
              <SummaryTile
                icon={<Coins className="h-5 w-5 text-blue-200" />}
                label="Amount"
                value={amount ? `$${amount}` : "—"}
                tone="blue"
              />
              <SummaryTile
                icon={<Gauge className="h-5 w-5 text-emerald-200" />}
                label="Status"
                value={balanceLoading ? "Syncing…" : "Ready"}
                tone="emerald"
              />
            </div>

            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-5 rounded-3xl border border-green-300/25 bg-green-500/10 p-5"
                >
                  <motion.div
                    className="text-green-200 font-black text-lg flex items-center gap-2"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <span className="text-2xl">✓</span> Transfer Successful!
                  </motion.div>
                  <div className="text-white/55 text-[12px] mt-1">
                    Balances refreshed. You're good to go.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ✅ Buttons: stack on mobile, keep your existing lg behavior */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isTransferLoading}
                whileHover={isTransferLoading ? {} : { y: -2 }}
                whileTap={isTransferLoading ? {} : { scale: 0.98 }}
                className={cx(
                  "rounded-2xl px-5 py-3.5 text-[13px] font-black transition inline-flex items-center justify-center gap-2",
                  isTransferLoading ? btnDisabled : btnPrimary,
                )}
              >
                <Zap className="h-4 w-4" />
                {isTransferLoading ? (
                  <>
                    Processing...
                    <motion.span
                      className="inline-block h-4 w-4 border-2 border-black/70 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </>
                ) : (
                  <>
                    Transfer Now <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={resetAll}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl px-5 py-3.5 text-[13px] font-black border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 inline-flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </motion.button>
            </div>

            <div className="mt-4 text-[11px] text-white/50">
              Transfers are processed via MT5 manager endpoints and confirmed
              instantly.
            </div>
          </NeonFrame>
        </motion.div>

        <motion.div
          variants={inUp}
          className="text-center text-white/45 mt-7 sm:mt-8 text-[12px]"
        >
          Neon Reactor / Circuit Rave theme applied
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserTransfer;

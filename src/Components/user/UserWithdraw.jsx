import { useEffect, useState, useCallback, useMemo } from "react";
import {
  BadgeDollarSign,
  Loader2,
  Wallet,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Shield,
  Zap,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { backendApi } from "../../utils/apiClients";
import ModernHeading from "../lib/ModernHeading";


/* =========================================================================
   ✅ FULLY MOBILE RESPONSIVE (desktop unchanged)
   - NO API/workflow changes
   - NO logic/flow changes
   - Only responsive/layout safety fixes:
     ✅ Remove fixed/invalid widths (w-5xl) + negative margins that break mobile (-mt-10, ml-10)
     ✅ Make hero wrap cleanly + prevent overflow (min-w-0, overflow-x-hidden)
     ✅ Sticky only on lg, spacing adjusts per breakpoint
     ✅ Inputs/buttons remain full width on mobile
     ✅ Add min-w-0 on columns/cards to avoid horizontal scroll
   ======================================================================= */

const cx = (...c) => c.filter(Boolean).join(" ");

/* ---------- Backdrop (same as UserNewChallenge) ---------- */
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
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

/* ---------- Frame (same as UserNewChallenge) ---------- */
const NeonFrame = ({ className = "", children }) => (
  <div
    className={cx(
      "relative rounded-[26px] sm:rounded-[30px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl overflow-hidden",
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
    <div className="absolute inset-[1px] rounded-[25px] sm:rounded-[29px] bg-[#04050b]/80" />
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

const btnPrimary = "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110";
const btnDisabled = "bg-white/10 text-white/40 cursor-not-allowed";

const page = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 170, damping: 18, staggerChildren: 0.06 },
  },
};
const inUp = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 18 } },
};

function money(n) {
  const num = Number(n ?? 0);
  return isFinite(num) ? num.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0";
}

const ModernWithdraw = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const siteConfig = useSelector((state) => state.user.siteConfig);

  const [selectedGateway, setSelectedGateway] = useState("");
  const [selectWallet, setSelectWallet] = useState("USDT(Trc20)");
  const [account, selectAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [apiLoader, setApiLoader] = useState(false);
  const [error, setError] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [accountBalance, setAccountBalance] = useState("");
  const [accountType, setAccountType] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false);

  const dollarRate = siteConfig?.dollarWithdrawalRate || 0;
  const inrUiEnabled = siteConfig?.inrUi !== false;

  const inrAmount = useMemo(() => {
    if (!amount || !dollarRate) return "0";
    return (parseFloat(amount) * Number(dollarRate)).toFixed(2);
  }, [amount, dollarRate]);

  useEffect(() => {
    const isValid = account && selectedGateway && amount && parseFloat(amount) > 0;
    setIsFormValid(isValid);
  }, [account, selectedGateway, amount]);

  // const fetchAccountInfo = useCallback(async () => {
  //   if (!account) return;
  //   setBalanceLoading(true);
  //   try {
  //     setAccountBalance("");
  //     const res = await metaApi.get(`/GetUserInfo?Manager_Index=${import.meta.env.VITE_MANAGER_INDEX}&MT5Account=${account}`);
  //     if (res.data?.Equity) setAccountBalance(res.data.Equity);
  //   } catch (err) {
  //     console.error("Error fetching account info", err);
  //   } finally {
  //     setBalanceLoading(false);
  //   }
  // }, [account]);

   const fetchAccountInfo = useCallback(async () => {
    if (!account) return;
    setBalanceLoading(true);
    try {
      setAccountBalance("");
      const res = await backendApi.get(`/meta/user-info/${account}`);
      if (res.data?.data?.Equity) setAccountBalance(res.data.data.Equity);
    } catch (err) {
      console.error("Error fetching account info", err);
    } finally {
      setBalanceLoading(false);
    }
  }, [account]);


  useEffect(() => {
    if (account) fetchAccountInfo();
  }, [account, fetchAccountInfo]);

  const numericBalance = accountBalance ? Number(accountBalance) : 0;

  const walletOptions = [
    { value: "USDT(Trc20)", label: "USDT (TRC-20)", icon: "₮" },
    { value: "USDT(Bep20)", label: "USDT (BEP-20)", icon: "₮" },
  ];

  const getWalletAddress = (walletType) => {
    const mapping = {
      "USDT(Trc20)": loggedUser?.walletDetails?.tetherAddress,
      "USDT(Bep20)": loggedUser?.walletDetails?.ethAddress,
    };
    return mapping[walletType] || "Not configured";
  };

  const withdrawalHandler = async (e) => {
    e.preventDefault();
    if (isWithdrawing) return;

    setError("");

    if (!account || !selectedGateway || !amount || parseFloat(amount) <= 0) {
      setError("Please fill all fields correctly.");
      return;
    }
    if (parseFloat(amount) > Number(accountBalance || 0)) {
      setError("Insufficient balance for withdrawal!");
      return;
    }
    if (!loggedUser?.email) {
      setError("User email not found. Please re-login.");
      return;
    }

    setIsWithdrawing(true);
    setCurrentStep(2);

    const toastId = toast.loading("Sending OTP...");

    try {
      const sendOtpRes = await backendApi.post("/client/send-otp", { email: loggedUser.email });
      if (sendOtpRes.data?.otp) {
        toast.success("OTP sent to your email", { id: toastId });
        setShowOtpInput(true);
        setCurrentStep(3);
      } else {
        toast.error("Failed to send OTP", { id: toastId });
        setCurrentStep(1);
      }
    } catch (err) {
      console.error("OTP error", err);
      toast.error("Error sending OTP", { id: toastId });
      setCurrentStep(1);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const verifyOtpHandler = async () => {
    if (!otp) return setError("OTP required");
    if (!loggedUser?.email) return setError("User email not found. Please re-login.");

    setError("");
    setApiLoader(true);
    setIsWithdrawing(true);

    const toastId = toast.loading("Verifying your request...");

    try {
      await backendApi.post("/client/verify-otp", { email: loggedUser.email, otp });

      if (parseFloat(amount) > Number(accountBalance || 0)) {
        setError("You don't have balance for withdrawal !!");
        toast.error("Insufficient balance for withdrawal", { id: toastId });
      } else {
        await backendApi.post(`/client/withdrawal`, {
          method: selectedGateway === "Bank Transfer" ? selectedGateway : selectWallet,
          accountType,
          amount,
          mt5Account: account,
          status: "pending",
          userId: loggedUser._id,
          lastBalance: accountBalance,
        });

        toast.success("Withdrawal Requested.", { id: toastId });
        setCurrentStep(4);
        setShowOtpInput(false);
        setOtp("");
        fetchAccountInfo();

        setTimeout(() => {
          setCurrentStep(1);
          setAmount("");
          selectAccount("");
          setSelectedGateway("");
          setSelectWallet("USDT(Trc20)");
        }, 3000);
      }
    } catch (error) {
      console.error("Error during withdrawal", error);
      toast.error(error?.response?.data?.message || "Withdrawal failed", { id: toastId });
    } finally {
      setApiLoader(false);
      setIsWithdrawing(false);
    }
  };

  const canRequest = isFormValid && !isWithdrawing;
  const canVerify = !!otp && !apiLoader;

  return (
    <motion.div variants={page} initial="hidden" animate="visible" className="relative min-h-screen overflow-x-hidden text-white">
      <NeonReactorBackdrop />

      {/* ✅ Mobile padding tightened, desktop same */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* ===== HERO (mobile-safe) ===== */}
        <motion.div variants={inUp} className="mb-6 sm:mb-7">
          <NeonFrame className="p-5 sm:p-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <ModernHeading text="Withdraw Funds" />
                  </div>
                </div>
              </div>

              {/* if you later re-enable INR card, it will wrap cleanly */}
              {inrUiEnabled ? <div className="shrink-0" /> : null}
            </div>
          </NeonFrame>
        </motion.div>

        {/* ===== MAIN GRID (mobile stacked, desktop unchanged) ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* LEFT: Wizard */}
          <div className="lg:col-span-7 min-w-0">
            <div className="space-y-5 sm:space-y-6 lg:sticky lg:top-6">
              {/* ✅ removed ml-10 and -mt-4 that break mobile; keep desktop spacing via lg: */}
              <NeonFrame className="min-w-0 p-5 sm:p-6 lg:-mt-4 lg:ml-10">
                {/* Step 1 */}
                {currentStep === 1 && (
                  <form onSubmit={withdrawalHandler} className="mt-0 space-y-6">
                    {/* Account */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[12px] text-white/75 font-black flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-200" />
                          Trading Account
                        </label>

                        {balanceLoading ? (
                          <span className="inline-flex items-center gap-2 text-[11px] text-white/50 font-black">
                            <Loader2 className="h-4 w-4 animate-spin" /> Fetching…
                          </span>
                        ) : numericBalance ? (
                          <Pill tone="emerald">${money(numericBalance)}</Pill>
                        ) : null}
                      </div>

                       {/* <select
                        value={account}
                        onChange={(e) => {
                          selectAccount(e.target.value);
                          const selectedAcc = loggedUser?.accounts?.find((acc) => String(acc.accountNumber) === String(e.target.value));
                          setAccountType(selectedAcc?.accountType || "");
                        }}
                        className={cx(
                          "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3",
                          "text-white/90 outline-none focus:border-green-300/25 focus:ring-2 focus:ring-green-400/10"
                        )}
                      >
                        <option value="" disabled>
                          Select Trading Account
                        </option>
                        {loggedUser?.accounts?.map((acc, index) => (
                          <option key={index} value={acc.accountNumber} className="bg-[#0b0d14]">
                            {acc.accountNumber} ({acc.accountType})
                          </option>
                        ))}
                      </select>  */}


                      <select
  value={account}
  onChange={(e) => {
    selectAccount(e.target.value);
    const selectedAcc = loggedUser?.accounts?.find(
      (acc) => String(acc.accountNumber) === String(e.target.value)
    );
    setAccountType(selectedAcc?.accountType || "");
  }}
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
  "
>
  <option
    value=""
    disabled
    className="bg-emerald-900 text-green-400"
  >
    Select Trading Account
  </option>

  {loggedUser?.accounts?.map((acc, index) => (
    <option
      key={index}
      value={acc.accountNumber}
      className="bg-gray-900 text-white"
    >
      {acc.accountNumber} ({acc.accountType})
    </option>
  ))}
</select>

                       


                    </div>

                    {/* Method */}
                    <div>
                      <label className="text-[12px] text-white/75 font-black flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-pink-200" />
                        Withdrawal Method
                      </label>

                      <button
                        type="button"
                        onClick={() => setSelectedGateway("Wallet Transfer")}
                        className={cx(
                          "w-full text-left rounded-3xl border p-4 transition",
                          selectedGateway === "Wallet Transfer"
                            ? "border-pink-300/25 bg-pink-500/12"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-[11px] text-white/55 font-black tracking-wide">CRYPTO WALLET</div>
                            <div className="mt-1 font-black text-white/90">Wallet Transfer</div>
                            <div className="text-[12px] text-white/55 mt-1">Send to USDT address (TRC-20 / BEP-20)</div>
                          </div>
                          <div className="shrink-0 h-10 w-10 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
                            <Wallet className="h-5 w-5 text-pink-200" />
                          </div>
                        </div>
                      </button>

                      {selectedGateway === "Wallet Transfer" && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {walletOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setSelectWallet(opt.value)}
                              className={cx(
                                "rounded-2xl border px-4 py-3 text-left transition",
                                selectWallet === opt.value
                                  ? "border-blue-300/25 bg-blue-500/12"
                                  : "border-white/10 bg-white/5 hover:bg-white/10"
                              )}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="text-[11px] text-white/55 font-black tracking-wide">WALLET</div>
                                  <div className="mt-1 font-black text-white/90">{opt.label}</div>
                                </div>
                                <div className="shrink-0 text-lg">{opt.icon}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Amount */}
                    <div>
                      <div className="flex items-center justify-between mb-2 gap-3">
                        <label className="text-[12px] text-white/75 font-black flex items-center gap-2">
                          <BadgeDollarSign className="h-4 w-4 text-emerald-200" />
                          Withdrawal Amount (USD)
                        </label>
                        {inrUiEnabled && amount ? <Pill tone="green">₹ {inrAmount}</Pill> : null}
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className={cx(
                            "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4",
                            "text-white/90 outline-none focus:border-emerald-300/25 focus:ring-2 focus:ring-emerald-400/10",
                            "text-lg font-black"
                          )}
                          placeholder="0.00"
                        />
                        {amount && numericBalance && parseFloat(amount) > numericBalance && (
                          <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-300" />
                        )}
                      </div>

                      {amount && numericBalance && parseFloat(amount) > numericBalance && (
                        <div className="mt-2 text-[12px] text-pink-200 flex items-center gap-2 font-black">
                          <AlertCircle className="h-4 w-4" />
                          Insufficient balance
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!canRequest}
                      className={cx(
                        "w-full rounded-2xl px-5 py-4 text-[14px] font-black transition inline-flex items-center justify-center gap-2",
                        canRequest ? btnPrimary : btnDisabled
                      )}
                    >
                      {isWithdrawing && <Loader2 className="h-4 w-4 animate-spin text-black/60" />}
                      Request Withdrawal <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                )}

                {/* Step 3: OTP Verify */}
                {currentStep === 3 && showOtpInput && (
                  <div className="mt-5">
                    <div className="text-center">
                      <div className="h-14 w-14 rounded-3xl border border-white/10 bg-white/5 grid place-items-center mx-auto">
                        <Shield className="h-7 w-7 text-blue-200" />
                      </div>
                      <div className="mt-3 text-2xl font-black">Verify Your Identity</div>
                      <p className="text-white/55 text-[12px] mt-1">Enter the OTP sent to your email</p>
                    </div>

                    <div className="mt-6 max-w-sm mx-auto space-y-4">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className={cx(
                          "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center",
                          "text-2xl font-mono tracking-[0.28em] sm:tracking-[0.35em]",
                          "text-white/90 outline-none focus:border-blue-300/25 focus:ring-2 focus:ring-blue-400/10"
                        )}
                        placeholder="000000"
                        maxLength={6}
                        inputMode="numeric"
                      />

                      <button
                        type="button"
                        onClick={verifyOtpHandler}
                        disabled={!canVerify}
                        className={cx(
                          "w-full rounded-2xl px-5 py-4 text-[14px] font-black transition inline-flex items-center justify-center gap-2",
                          canVerify ? btnPrimary : btnDisabled
                        )}
                      >
                        {apiLoader ? <Loader2 className="h-4 w-4 animate-spin text-black/60" /> : <CheckCircle2 className="h-4 w-4" />}
                        Verify & Withdraw
                      </button>

                      <div className="text-center text-[11px] text-white/45">
                        Didn’t get it? Check spam folder or request again.
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Success */}
                {currentStep === 4 && (
                  <div className="mt-6 text-center">
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 220, damping: 18 }}
                      className="mx-auto h-16 w-16 rounded-3xl border border-green-300/25 bg-green-500/12 grid place-items-center"
                    >
                      <CheckCircle2 className="h-8 w-8 text-green-200" />
                    </motion.div>
                    <div className="mt-4 text-2xl sm:text-3xl font-black text-green-200">Withdrawal Requested</div>
                    <p className="text-white/55 text-[12px] mt-2">
                      Amount: <span className="text-white/85 font-black">${amount}</span>{" "}
                      {inrUiEnabled ? <span className="text-white/40">(~ ₹ {inrAmount})</span> : null}
                    </p>
                    <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.05] p-5 max-w-md mx-auto">
                      <div className="text-[11px] text-white/55 font-black tracking-wide">PROCESSING</div>
                      <div className="mt-1 text-white/80 font-black">1–3 business days</div>
                      <div className="mt-2 text-[11px] text-white/45">You can track status from your withdrawals history page.</div>
                    </div>
                  </div>
                )}

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="mt-4 rounded-2xl border border-pink-300/20 bg-pink-500/10 p-4 flex items-start gap-3"
                    >
                      <AlertCircle className="h-5 w-5 text-pink-200 mt-0.5" />
                      <div className="min-w-0">
                        <div className="font-black text-pink-100 text-[12px]">Action needed</div>
                        <div className="text-[12px] text-pink-100/80 break-words">{error}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </NeonFrame>
            </div>
          </div>

          {/* RIGHT: Live Summary */}
          <div className="lg:col-span-5 min-w-0 space-y-5 sm:space-y-6">
            <NeonFrame className="p-5 sm:p-6 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="font-black tracking-wide text-white/90">Live Summary</div>
                <Pill tone={numericBalance ? "emerald" : "gray"}>Balance: ${money(numericBalance)}</Pill>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-w-0">
                  <div className="text-[11px] text-white/55 font-black tracking-wide">ACCOUNT</div>
                  <div className="mt-1 font-black text-white/90 truncate">{account || "—"}</div>
                  <div className="text-[11px] text-white/45 mt-1 truncate">{accountType || "—"}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-w-0">
                  <div className="text-[11px] text-white/55 font-black tracking-wide">METHOD</div>
                  <div className="mt-1 font-black text-white/90 truncate">{selectedGateway || "—"}</div>
                  <div className="text-[11px] text-white/45 mt-1 truncate">{selectedGateway ? selectWallet : "—"}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 col-span-1 sm:col-span-2 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] text-white/55 font-black tracking-wide">AMOUNT</div>
                    {inrUiEnabled && amount ? <Pill tone="green">₹ {inrAmount}</Pill> : null}
                  </div>
                  <div className="mt-1 text-2xl font-black text-white/90">${money(amount)}</div>
                  {numericBalance && amount && (
                    <div className="mt-2 text-[11px] text-white/45">
                      Remaining (est.):{" "}
                      <span className="text-white/75 font-black">${money(Math.max(0, numericBalance - Number(amount || 0)))}</span>
                    </div>
                  )}
                </div>
              </div>
            </NeonFrame>

            {selectedGateway === "Wallet Transfer" && (
              <NeonFrame className="p-5 sm:p-6 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-black tracking-wide text-white/90">Destination</div>
                  <Pill tone="blue">{selectWallet}</Pill>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 min-w-0">
                  <div className="text-[11px] text-white/55 font-black tracking-wide">WALLET ADDRESS</div>
                  <div className="mt-2 text-[12px] font-mono text-white/80 break-all">
                    {getWalletAddress(selectWallet)}
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-white/45">
                  Make sure your wallet address is correct in your profile before requesting withdrawal.
                </div>
              </NeonFrame>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernWithdraw;

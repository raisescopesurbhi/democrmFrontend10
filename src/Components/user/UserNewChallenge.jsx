import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Coins,
  Cpu,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Gauge,
  RotateCcw,
  CornerUpLeft,
  RadioTower,
  Orbit,
  Waves,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { setCreatingMt5, setIsBlur } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

import { backendApi } from "../../utils/apiClients";
import UserNewChallengeHook from "../../hooks/user/UseNewChallengeHook";
import UseUserHook from "../../hooks/user/UseUserHook";

/* =========================================================================
   💚💗💙 THEME: "NEON REACTOR / CIRCUIT RAVE"
   ✅ FULLY RESPONSIVE (mobile-first)
   ✅ APIs/workflow unchanged
   ======================================================================= */

const cx = (...c) => c.filter(Boolean).join(" ");

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
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(34,197,94,0.85) 50%, transparent 100%)",
        }}
        animate={{ y: ["-10vh", "120vh"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
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
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
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

const btnPrimary =
  "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110";
const btnDisabled = "bg-white/10 text-white/40 cursor-not-allowed";

const FieldLabel = ({ icon: Icon, label, sub }) => (
  <div className="flex items-center justify-between gap-3">
    <label className="text-[12px] text-white/75 font-black tracking-wide flex items-center gap-2">
      <Icon className="h-4 w-4 text-green-200" />
      {label}
    </label>
    {sub ? <span className="text-[11px] text-white/45 truncate">{sub}</span> : null}
  </div>
);

const SelectWrap = ({ disabled, children }) => (
  <div
    className={cx(
      "relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden",
      "focus-within:border-green-300/25 focus-within:ring-2 focus-within:ring-green-400/10",
      disabled && "opacity-60"
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
    <div className="relative">{children}</div>
  </div>
);

const ReactorRing = ({ progress = 0 }) => {
  const pct = Math.max(0, Math.min(100, progress));
  return (
    <div className="relative aspect-square w-full max-w-[320px] sm:max-w-[360px] mx-auto">
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
          WebkitMaskImage: "radial-gradient(circle, transparent 62%, black 64%)",
        }}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-[70px] rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-2xl"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
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
      className={cx("rounded-3xl border p-4 bg-white/[0.04] overflow-hidden", tones[tone] || tones.green)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] text-white/55 font-black tracking-wide">{label}</div>
          <div className="mt-1 text-lg font-black text-white/90 truncate">{value}</div>
        </div>
        <div className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const ChecklistRow = ({ ok, text }) => (
  <motion.div
    layout
    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 220, damping: 18 }}
  >
    <div className="flex items-center gap-3 min-w-0">
      <div
        className={cx(
          "h-9 w-9 rounded-2xl border grid place-items-center",
          ok ? "border-green-300/25 bg-green-500/10" : "border-white/10 bg-white/5"
        )}
      >
        {ok ? <CheckCircle2 className="h-4 w-4 text-green-200" /> : <span className="h-2 w-2 rounded-full bg-white/30" />}
      </div>
      <span className={cx("text-[12px] font-black truncate", ok ? "text-white/85" : "text-white/55")}>
        {text}
      </span>
    </div>
    <Pill tone={ok ? "green" : "gray"}>{ok ? "OK" : "TODO"}</Pill>
  </motion.div>
);

export default function UserNewChallenge() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedUser = useSelector((store) => store.user.loggedUser);
  const siteConfig = useSelector((state) => state.user.siteConfig);

  const { getPlatforms, getPaymentMethod } = UserNewChallengeHook();
  const { getUpdateLoggedUser } = UseUserHook();
  const platformData = useSelector((store) => store.user.platforms);

  const [accountConfigurations, setAccountConfigurations] = useState([]);
  const [creatingLoading, setCreatingLoading] = useState(false);

  const [formData, setFormData] = useState({
    accountType: "",
    apiGroup: "",
    platform: "",
    leverage: "",   
  });

  const filteredPlatformData = useMemo(
    () => (platformData || []).filter((p) => p?.status === "active"),
    [platformData]
  );

  const selectedConfig = useMemo(
    () => accountConfigurations?.find((v) => v.accountType === formData.accountType),
    [accountConfigurations, formData.accountType]
  );

  const step = useMemo(() => {
    if (!formData.accountType) return 1;
    if (!formData.leverage) return 2;
    if (!formData.platform) return 3;
    return 4;
  }, [formData.accountType, formData.leverage, formData.platform]);

  const progress = useMemo(() => (step / 4) * 100, [step]);

  const fetchAccountConfigurations = async () => {
    try {
      const res = await backendApi.get(`/client/get-account-types`);
      setAccountConfigurations(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (error) {
      console.log("Error fetching account types", error);
      toast.error("Failed to fetch account types");
    }
  };

  useEffect(() => {
    getPlatforms();
    getPaymentMethod();
    fetchAccountConfigurations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedConfig?.leverage?.length) {
      setFormData((prev) => ({
        ...prev,
        leverage: selectedConfig.leverage[0]?.value || "",
        apiGroup: selectedConfig.apiGroup || prev.apiGroup,
      }));
    }
  }, [selectedConfig?.leverage, selectedConfig?.apiGroup]);

  useEffect(() => {
    if (filteredPlatformData?.length === 1) {
      setFormData((prev) => ({ ...prev, platform: filteredPlatformData[0]?.name || "" }));
    }
  }, [filteredPlatformData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "accountType") {
      const cfg = accountConfigurations?.find((c) => c.accountType === value);
      setFormData((prev) => ({
        ...prev,
        accountType: value,
        apiGroup: cfg?.apiGroup || "",
        leverage: cfg?.leverage?.[0]?.value || "",
      }));
      return;     
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };  

  const createAccountHandler = async () => {
    if (!loggedUser?._id) return toast.error("Please sign in to create an account.");
    if (!formData.accountType) return toast.error("Select an account type.");
    if (!formData.leverage) return toast.error("Select leverage.");
    if (!formData.platform) return toast.error("Choose a platform.");   

    setCreatingLoading(true);
    dispatch(setCreatingMt5(true));  
    dispatch(setIsBlur(true));

    const toastID = toast.loading("Creating your account...");

    try {
      const response = await backendApi.post(`/client/create-mt5-account/${loggedUser._id}`, {
        leverage: formData.leverage,
        accountType: formData.accountType,
        groupName: formData.apiGroup,
        platform: formData.platform,
        siteConfig,
        VITE_MANAGER_INDEX: import.meta.env.VITE_MANAGER_INDEX,
        VITE_WEBSITE_NAME: import.meta.env.VITE_WEBSITE_NAME,
        VITE_EMAIL_WEBSITE: import.meta.env.VITE_EMAIL_WEBSITE,
      });

      if (response?.data?.message === "MT5 account created successfully") {
        toast.success("Account created successfully!", { id: toastID });
        await getUpdateLoggedUser();
        navigate("/user/challenges");
      } else {
        toast.error(response?.data?.message || "Failed to create account", { id: toastID });
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong while creating the account.", { id: toastID });
    } finally {
      dispatch(setCreatingMt5(false));
      setCreatingLoading(false);
      dispatch(setIsBlur(false));
    }
  };

  const resetAll = () => {
    setFormData({ accountType: "", apiGroup: "", platform: "", leverage: "" });
  };

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

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <NeonReactorBackdrop />

      {/* ✅ Creating overlay (responsive) */}
      <AnimatePresence>
        {creatingLoading && (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />

            <motion.div
              className="relative w-full max-w-[420px] px-2 sm:px-6"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 6 }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
            >
              <ReactorRing progress={100} />
              <div className="mt-6 text-center text-white/80 font-black tracking-wide">Creating your MT5 account...</div>
              <div className="mt-2 text-center text-white/50 text-[12px]">Please don’t close this window</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={page}
        initial="hidden"
        animate="visible"
        className={cx(
          "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10",
          creatingLoading && "blur-xl opacity-20 pointer-events-none select-none"
        )}
      >
        {/* ✅ Header fully responsive */}
        <motion.div variants={inUp}>
          <NeonFrame className="p-4 sm:p-5">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                    Open MT5 Account
                  </span>
                </h1>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] font-black tracking-wide text-white/55">
                    <span className="inline-flex items-center gap-2">
                      <Waves className="h-4 w-4 text-green-200" />
                      Reactor Charge
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
                      transition={{ type: "spring", stiffness: 160, damping: 18 }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill tone={step === 4 ? "emerald" : "blue"}>
                    <RadioTower className="h-3.5 w-3.5" />
                    STEP {step}/4
                  </Pill>
                  <Pill tone={formData.platform ? "pink" : "gray"}>{formData.platform || "Pick platform"}</Pill>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
                <motion.button
                  type="button"
                  onClick={resetAll}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-[12px] font-black text-white/80 inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => navigate("/user/challenges")}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-[12px] font-black text-white/80 inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <CornerUpLeft className="h-4 w-4" />
                  Back
                </motion.button>
              </div>
            </div>
          </NeonFrame>
        </motion.div>

        {/* ✅ MAIN responsive layout */}
        <motion.div variants={inUp} className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT: INPUTS */}
          <NeonFrame className="lg:col-span-4 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] text-white/55 font-black tracking-wide">INPUTS</div>
                <div className="mt-1 text-xl font-black text-white/90 truncate">Configure</div>
              </div>
              <Pill tone={step === 4 ? "emerald" : "blue"}>{step === 4 ? "READY" : "LIVE"}</Pill>
            </div>

            <div className="mt-4 space-y-3">
              <motion.div
                // className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
              >
                <div className="space-y-2">
                  <FieldLabel icon={Coins} label="Account Type" />
                  <SelectWrap>
                 {/* <select
  name="accountType"
  value={formData.accountType}
  onChange={handleInputChange}
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
  <option value="" disabled className="text-gray-400">
    Select Account Type
  </option>

  {accountConfigurations?.map((opt) => (
    <option
      key={opt.accountType}
      value={opt.accountType}
      className="text-black"
    >
      {opt.accountType}
    </option>
  ))}
</select>  */}

{/* <select
    name="accountType"
    value={formData.accountType}
    onChange={handleInputChange}
    className="
      relative z-10 w-full appearance-none
      rounded-xl
      bg-black/50 backdrop-blur-xl
      px-4 py-3.5 pr-10
      outline-none

      text-[13px] font-black tracking-wide
      text-transparent bg-clip-text
      bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300

      transition-all duration-300
      hover:drop-shadow-[0_0_14px_rgba(34,197,94,0.7)]
      focus:drop-shadow-[0_0_18px_rgba(34,197,94,0.9)]
    "
  >
    <option value="" disabled className="text-gray-400">
      Select Account Type
    </option>

    {accountConfigurations?.map((opt) => (
      <option
        key={opt.accountType}
        value={opt.accountType}
        className="text-black"
      >
        {opt.accountType}
      </option>
    ))}
  </select> */}


  <select
  name="accountType"
  value={formData.accountType}
  onChange={handleInputChange}
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
    className="bg-emerald-900 text-green-400">
    Select Account Type
  </option>

  {accountConfigurations?.map((opt) => (
    <option
      key={opt.accountType}
      value={opt.accountType}
      className="
        bg-gray-900
        text-white
      "
    >
      {opt.accountType}
    </option>
  ))}
</select>




                     <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none" /> 
                  </SelectWrap>
                </div>
              </motion.div>

              <motion.div
                 className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
              >
                <div className="space-y-2">
                  <FieldLabel icon={ShieldCheck} label="Leverage" sub={formData.apiGroup ? "Group synced" : "—"} />
                  <SelectWrap disabled={!selectedConfig?.leverage?.length}>
                     {/* <select
                      name="leverage"
                      value={formData.leverage}
                      onChange={handleInputChange}
                      disabled={!selectedConfig?.leverage?.length}
                      className={cx(
                         "w-full appearance-none bg-transparent px-4 py-3.5 pr-10",
                        "outline-none text-white/90 text-[13px]  font-black disabled:cursor-not-allowed"
                      )}
                    >
                      <option value="" disabled className="bg-[#0c2113]">
                        {selectedConfig?.leverage?.length ? "Select Leverage" : "Select account type first"}
                      </option>
                      {selectedConfig?.leverage?.map((l) => (
                        <option key={l.value} value={l.value} className="bg-[#0b0d14]">
                          {l.label}
                        </option>
                      ))}
                    </select>  */}

                    <select
  name="leverage"
  value={formData.leverage}
  onChange={handleInputChange}
  disabled={!selectedConfig?.leverage?.length}
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
    disabled
    className="bg-emerald-900 text-green-400"
  >
    {selectedConfig?.leverage?.length
      ? "Select Leverage"
      : "Select account type first"}
  </option>

  {selectedConfig?.leverage?.map((l) => (
    <option
      key={l.value}
      value={l.value}
      className="bg-gray-900 text-white"
    >
      {l.label}
    </option>
  ))}
</select>



                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none border-amber-200" />
                  </SelectWrap>

                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 ">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] text-white/50 font-black tracking-wide">Server Name</span>
                      <span className="text-[11px] font-mono text-white/75 truncate">{siteConfig?.serverName || "—"}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
              >
                <div className="text-[12px] text-white/75 font-black tracking-wide flex items-center gap-2 mb-3">
                  <Cpu className="h-4 w-4 text-blue-200" />
                  Choose Platform
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AnimatePresence initial={false}>
                    {filteredPlatformData?.map((plt, i) => {
                      const active = formData.platform === plt.name;
                      return (
                        <motion.button
                          key={plt.name}
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, platform: plt.name }))}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.03, type: "spring", stiffness: 220, damping: 18 }}
                          whileHover={{ y: -3, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cx(
                            "relative overflow-hidden rounded-2xl border p-4 text-left",
                            active
                              ? "border-green-300/25 bg-green-500/12 shadow-[0_0_34px_rgba(34,197,94,0.18)]"
                              : "border-white/10 bg-white/5 hover:bg-white/10"
                          )}
                        >
                          {active && (
                            <motion.div
                              className="absolute inset-0 opacity-80 p-2"
                              style={{
                                background:
                                  "linear-gradient(135deg, rgba(34,197,94,0.18), rgba(59,130,246,0.14), rgba(236,72,153,0.14))",
                              }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.25 }}
                            />
                          )}

                          <div className="relative flex items-center gap-3">
                            <motion.div
                              className="h-9 w-9 rounded-2xl border border-white/10 bg-white/5 grid place-items-center"
                              animate={active ? { rotate: [0, 7, -7, 0] } : {}}
                              transition={{ duration: 0.55 }}
                            >
                              <span className="text-xl">{plt.logo ?? "🧭"}</span>
                            </motion.div>

                            <div className="min-w-0">
                              <div className={cx("font-black truncate", active ? "text-green-100" : "text-white/85")}>
                                {plt.name}
                              </div>
                              <div className="text-[11px] text-white/50">Active</div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                </div>

                <div className="mt-4 space-y-2">
                  <ChecklistRow ok={!!formData.accountType} text="Account type selected" />
                  <ChecklistRow ok={!!formData.leverage} text="Leverage configured" />
                  <ChecklistRow ok={!!formData.platform} text="Platform chosen" />
                </div>
              </motion.div>
            </div>
          </NeonFrame>

          {/* MIDDLE: REACTOR */}
          <NeonFrame className="lg:col-span-4 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] text-white/55 font-black tracking-wide">REACTOR</div>
                <div className="mt-1 text-xl font-black text-white/90 inline-flex items-center gap-2">
                  <Orbit className="h-5 w-5 text-pink-200" />
                  Live Core
                </div>
              </div>
              <Pill tone={step === 4 ? "emerald" : "green"}>{step === 4 ? "CHARGED" : "CHARGING"}</Pill>
            </div>

            <div className="mt-5">
              <ReactorRing progress={progress} />

              <div className="mt-5 grid grid-cols-3 gap-2">
                <Pill tone={formData.accountType ? "green" : "gray"}>{formData.accountType || "Type"}</Pill>
                <Pill tone={formData.leverage ? "blue" : "gray"}>{formData.leverage || "Lev"}</Pill>
                <Pill tone={formData.platform ? "pink" : "gray"}>{formData.platform || "Platform"}</Pill>
              </div>
            </div>
          </NeonFrame>

          {/* RIGHT: LAUNCH */}
          <NeonFrame className="lg:col-span-4 p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] text-white/55 font-black tracking-wide">LAUNCH</div>
                <div className="mt-1 text-xl font-black text-white/90">Blueprint</div>
              </div>
              <Pill tone={step === 4 ? "emerald" : "gray"}>{step === 4 ? "UNLOCKED" : "LOCKED"}</Pill>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <SummaryTile
                icon={<Coins className="h-5 w-5 text-green-200" />}
                label="Account Type"
                value={formData.accountType || "—"}
                tone="green"
              />
              <SummaryTile
                icon={<ShieldCheck className="h-5 w-5 text-blue-200" />}
                label="Leverage"
                value={formData.leverage || "—"}
                tone="blue"
              />
              <SummaryTile
                icon={<Cpu className="h-5 w-5 text-pink-200" />}
                label="Platform"
                value={formData.platform || "—"}
                tone="pink"
              />
              <SummaryTile
                icon={<Gauge className="h-5 w-5 text-emerald-200" />}
                label="MT5 Group"
                value={formData.apiGroup || "—"}
                tone="emerald"
              />
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <motion.button
                type="button"
                onClick={createAccountHandler}
                disabled={creatingLoading || step !== 4}
                whileHover={creatingLoading || step !== 4 ? {} : { y: -2 }}
                whileTap={creatingLoading || step !== 4 ? {} : { scale: 0.98 }}
                className={cx(
                  "rounded-2xl px-5 py-3.5 text-[13px] font-black transition inline-flex items-center justify-center gap-2 w-full",
                  creatingLoading || step !== 4 ? btnDisabled : btnPrimary
                )}
              >
                <Zap className="h-4 w-4" />
                {creatingLoading ? "Creating..." : "Create Account"}
                <ArrowRight className="h-4 w-4" />
              </motion.button>

              <motion.button
                type="button"
                onClick={resetAll}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl px-5 py-3.5 text-[13px] font-black border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 inline-flex items-center justify-center gap-2 w-full"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </motion.button>
            </div>

            <div className="mt-4 text-[11px] text-white/50">
              Provisioning is fast. You’ll be redirected after success.
            </div>
          </NeonFrame>
        </motion.div>

        <motion.div variants={inUp} className="text-center text-white/45 mt-8 text-[12px]">
          Neon reactor theme · green/pink/blue/emerald on black ⚡
        </motion.div>
      </motion.div>
    </div>
  );
}

// ✅ FULL UPDATED RESPONSIVE CODE (mobile fixed, desktop kept)
// Changes made (NO API/workflow changes):
// - Removed mobile-breaking margins/widths: ml-10 => lg:ml-10, removed w-6xl, removed sm:ml-5
// - Right card padding p-10 => p-5 sm:p-6
// - xs:grid-cols-2 => sm:grid-cols-2 (default Tailwind)
// - Added min-w-0 to big grid cards to prevent overflow
// - Added overflow-x-hidden to root to avoid tiny horizontal scroll
// - Modal: overscroll-contain + slightly larger max-h for mobile

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

import UserNewChallengeHook from "../../../hooks/user/UseNewChallengeHook";
import { backendApi } from "../../../utils/apiClients";
import { AnimatedGrid } from "../../../utils/AnimatedGrid";

import {
  Sparkles,
  RadioTower,
  Waves,
  Coins,
  Cpu,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  UploadCloud,
  Hash,
  Image as ImageIcon,
  Building2,
  Info,
  X,
} from "lucide-react";

/* ===================== Tiny utils ===================== */
const cx = (...c) => c.filter(Boolean).join(" ");
function money(n) {
  const num = Number(n ?? 0);
  return isFinite(num) ? num.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0";
}

const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const toAssetUrl = (p) => {
  if (!p) return "";
  const raw = String(p).replace(/\\/g, "/");
  if (/^https?:\/\//i.test(raw)) return raw;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${API_BASE_URL}${path}`;
};

/* =========================================================================
   💚💗💙 THEME: "NEON REACTOR / CIRCUIT RAVE" (UNCHANGED)
   ====================================================================== */

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
        background: "linear-gradient(90deg, rgba(34,197,94,0.18), rgba(59,130,246,0.14), rgba(236,72,153,0.14))",
      }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    />
    <div className="relative">{children}</div>
  </div>
);

const FieldLabel = ({ icon: Icon, label, sub }) => (
  <div className="flex items-center justify-between">
    <label className="text-[12px] text-white/75 font-black tracking-wide flex items-center gap-2">
      <Icon className="h-4 w-4 text-green-200" />
      {label}
    </label>
    {sub ? <span className="text-[11px] text-white/45">{sub}</span> : null}
  </div>
);

const ReactorRing = ({ progress = 0, className = "" }) => {
  const pct = Math.max(0, Math.min(100, progress));
  return (
    <div className={cx("relative aspect-square w-[92px] sm:w-[120px] mx-auto", className)}>
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
        className="absolute inset-[58px] sm:inset-[70px] rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-2xl"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
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
      <div className={cx("h-9 w-9 rounded-2xl border grid place-items-center", ok ? "border-green-300/25 bg-green-500/10" : "border-white/10 bg-white/5")}>
        {ok ? <CheckCircle2 className="h-4 w-4 text-green-200" /> : <span className="h-2 w-2 rounded-full bg-white/30" />}
      </div>
      <span className={cx("text-[12px] font-black truncate", ok ? "text-white/85" : "text-white/55")}>{text}</span>
    </div>
    <Pill tone={ok ? "green" : "gray"}>{ok ? "OK" : "TODO"}</Pill>
  </motion.div>
);

const btnPrimary = "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110";
const btnDisabled = "bg-white/10 text-white/40 cursor-not-allowed";

const page = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 170, damping: 18, staggerChildren: 0.06 } },
};
const inUp = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 18 } },
};

export default function UserDeposit() {
  const navigate = useNavigate();
  const { getPaymentMethod } = UserNewChallengeHook();

  const loggedUser = useSelector((s) => s.user?.loggedUser);
  const siteConfig = useSelector((s) => s.user?.siteConfig);
  const paymentMethods = useSelector((s) => s.user?.paymentMethods);

  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    apiGroup: "",
    depositAmount: "",
    accountNumber: "",
    transactionId: "",
  });
  const [accountType, setAccountType] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [showMethodModal, setShowMethodModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const usd = Number(formData.depositAmount || 0);
  const inrRate = Number(siteConfig?.dollarDepositRate || 0);
  const inr = usd * inrRate;

  useEffect(() => {
    try {
      getPaymentMethod?.();
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showMethodModal) return;
    const onKey = (e:any) => e.key === "Escape" && setShowMethodModal(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showMethodModal]);

  // useEffect(() => {
  //   const fetchAccountInfo = async () => {
  //     if (!formData.accountNumber) return;
  //     try {
  //       setBalanceLoading(true);
  //       setAccountBalance("");
  //       const res = await backendApi.get(
  //         `/GetUserInfo?Manager_Index=${import.meta.env.VITE_MANAGER_INDEX}&MT5Account=${formData.accountNumber}`
  //       );
  //       if (res?.data?.data?.Equity) setAccountBalance(res.data.data.Equity);
  //     } catch {
  //     } finally {
  //       setBalanceLoading(false);
  //     }
  //   };
  //   fetchAccountInfo();
  // }, [formData.accountNumber]);

   useEffect(() => {
    const fetchAccountInfo = async () => {
      if (!formData.accountNumber) return;
      try {
        setBalanceLoading(true);
        setAccountBalance("");
        const res = await backendApi.get(
          `/meta/user-info/${formData.accountNumber}`
        );
        if (res?.data?.data?.Equity) setAccountBalance(res.data.data.Equity);
      } catch {
      } finally {
        setBalanceLoading(false);
      }
    };
    fetchAccountInfo();
  }, [formData.accountNumber]);


  const methodCards = useMemo(() => {
    const list = Array.isArray(paymentMethods) ? paymentMethods : [];
    const unique:any = [];
    const seen = new Set();

    list.forEach((m) => {
      const name = String(m?.name || "");
      if (m?.status !== "active") return;
      if (!name) return;
      if (seen.has(name.toLowerCase())) return;
      seen.add(name.toLowerCase());
      unique.push(m);
    });

    unique.sort((a:any, b:any) => {
      const A = String(a?.name || "").toLowerCase();
      const B = String(b?.name || "").toLowerCase();
      const rank = (x:any) => (x.includes("upi") ? 0 : x.includes("bank") ? 1 : 9);
      return rank(A) - rank(B);
    });

    return unique;
  }, [paymentMethods]);

  const selectedPaymentLower = (selectedPayment || "").toLowerCase();

  const selectedMethod = useMemo(() => {
    if (!selectedPayment) return null;
    const list = Array.isArray(paymentMethods) ? paymentMethods : [];
    return list.find((m) => String(m?.name || "") === String(selectedPayment)) || null;
  }, [selectedPayment, paymentMethods]);

  const selectedMethodImageUrl = useMemo(() => {
    const imgPath = selectedMethod?.image;
    return imgPath ? toAssetUrl(imgPath) : "";
  }, [selectedMethod]);

  const handleInputChange = (e:any) => {
    const { name, value, type, checked } = e.target;

    if (name === "accountNumber") {
      const selected = loggedUser?.accounts?.find((a) => String(a.accountNumber) === String(value));
      setAccountType(selected?.accountType || "");
      setFormData((prev) => ({
        ...prev,
        accountNumber: value,
        apiGroup: selected?.apiGroup || "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e:any) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);

    if (selectedFile && selectedFile.type?.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(String(reader.result));
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const togglePreview = () => setShowPreview((s) => !s);

  const handleSelectMethod = (m:any) => {
    setSelectedPayment(m?.name || "");
    setShowMethodModal(true);
  };

  const handleCryptoPayment = async (body:any) => {
    try {
      if (!loggedUser?._id || !loggedUser?.email || !formData.depositAmount || !formData.accountNumber) {
        toast.error("Enter all required details (account & amount).");
        return;
      }
      setCreatingLoading(true);

      const { data: resp } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/create-nowPayment-payment`,
        body
      );

      const invoiceUrl = resp?.invoice_url || resp?.invoice?.invoice_url;
      if (!invoiceUrl) throw new Error("Invoice URL not returned");

      toast.success("Redirecting to crypto payment page");
      window.location.href = invoiceUrl;
    } catch (err) {
      console.error(err);
      toast.error("Could not start crypto payment. Please try again.");
    } finally {
      setCreatingLoading(false);
    }
  };

  const submitHandler = async () => {
    if (creatingLoading || isSubmitting) return;

    if (!selectedPayment) return toast.error("Choose a payment method.");
    if (!agreeToTerms) return toast.error("Please agree to Terms & Conditions.");
    if (!formData.depositAmount || !formData.accountNumber) return toast.error("Enter amount and select account.");

    const toastID = toast.loading("Submitting...");

    try {
      setCreatingLoading(true);
      setIsSubmitting(true);

      const body = {
        userId: loggedUser._id,  
        mt5Account: formData.accountNumber,
        deposit: formData.depositAmount,
        status: "pending",
        accountType,
        method: selectedPayment,
        transactionId: formData.transactionId,
        lastBalance: accountBalance,
      };

      // if (selectedPaymentLower === "crypto") {
      //   toast.dismiss(toastID);
      //   await handleCryptoPayment(body);
      //   return;
      // }

      const fd = new FormData();
      Object.entries(body).forEach(([k, v]) => fd.append(k, String(v ?? "")));  
      if (file) fd.append("depositSS", file);

      await backendApi.post("/client/deposit", fd, { headers: { "Content-Type": "multipart/form-data" } });

      // toast.success("Deposit request submitted.", { id: toastID });
      // setShowMethodModal(false);
      // navigate("/user/transaction");
          toast.success("Deposit request submitted.", { id: toastID });

setTimeout(() => {
  setShowMethodModal(false);
  navigate("/user/transaction");
}, 1200);

    } catch (error) {
      console.error(error);
      toast.error("Submission failed. Please try again.", { id: toastID });
    } finally {
      setCreatingLoading(false);
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    !!agreeToTerms &&
    !!selectedPayment &&
    !!formData.depositAmount &&
    !!formData.accountNumber &&
    !creatingLoading &&
    !isSubmitting;

  const step = useMemo(() => {
    if (!formData.accountNumber) return 1;
    if (!formData.depositAmount) return 2;
    if (!selectedPayment) return 3;
    return 4;
  }, [formData.accountNumber, formData.depositAmount, selectedPayment]);

  const progress = useMemo(() => (step / 4) * 100, [step]);

  const isBank = String(selectedPayment || "").toLowerCase().includes("bank");

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <NeonReactorBackdrop />
      <AnimatedGrid />

      <motion.div
        variants={page}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
      >
        {/* TOP HEADER */}
        <motion.div variants={inUp}>
          <NeonFrame className="p-5 sm:p-6 w-full">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Pill tone="green">
                    <Sparkles className="h-3.5 w-3.5" />
                    FUNDING REACTOR
                  </Pill>
                  <Pill tone={step === 4 ? "emerald" : "blue"}>
                    <RadioTower className="h-3.5 w-3.5" />
                    STEP {step}/4
                  </Pill>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                    Deposit Funds
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
              </div>

              <div className="w-full lg:w-auto flex justify-center lg:justify-end">
                <ReactorRing progress={progress} />
              </div>
            </div>
          </NeonFrame>
        </motion.div>

        {/* MAIN GRID */}
        <motion.div variants={inUp} className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT */}
          <NeonFrame className="lg:col-span-7 min-w-0 p-5 sm:p-6 lg:ml-10">
            <div className="text-[11px] text-white/55 font-black tracking-wide">DEPOSIT SETUP</div>

            <div className="mt-5 space-y-5">
              {/* Trading Account */}
              <motion.div
                className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-black text-white/90">Trading Account</div>
                  <Pill tone={formData.accountNumber ? "green" : "gray"}>
                    <Coins className="h-3.5 w-3.5" />
                    {formData.accountNumber || "Select"}
                  </Pill>
                </div>

                <div className="mt-4 space-y-2">
                  <SelectWrap>
                    {/* <select
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className={cx(
                        "w-full appearance-none bg-transparent px-4 py-3.5 pr-10",
                        "outline-none text-white/90 text-[13px] font-black"
                      )}
                    >
                      <option value="" className="bg-[#0b0d14]">
                        Choose your account
                      </option>
                      {loggedUser?.accounts?.map((a, idx) => (
                        <option key={idx} value={a.accountNumber} className="bg-[#0b0d14]">
                          {a.accountNumber} ({a.accountType})
                        </option>
                      ))}
                    </select> */}

                     <select
  name="accountNumber"
  value={formData.accountNumber}
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
    className="bg-emerald-900 text-green-400"
  >
    Choose your account
  </option>

  {loggedUser?.accounts?.map((a:any, idx:any) => (
    <option
      key={idx}
      value={a.accountNumber}
      className="bg-gray-900 text-white"
    >
      {a.accountNumber} ({a.accountType})
    </option>
  ))}
</select>


                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none">▾</span>
                  </SelectWrap>

                  <AnimatePresence>
                    {!!formData.accountNumber && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-white/50 font-black tracking-wide">LIVE EQUITY</span>
                          <Pill tone="blue">{accountType || "Account"}</Pill>
                        </div>
                        <div className="mt-2 text-2xl font-black text-white/90">
                          {balanceLoading ? <span className="text-white/40">Loading…</span> : <>$ {money(accountBalance || 0)}</>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Deposit */}
              <motion.div
                className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-black text-white/90">Deposit</div>
                  <Pill tone={usd > 0 ? "blue" : "gray"}>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {usd > 0 ? `$${money(usd)}` : "Enter"}
                  </Pill>
                </div>

                <div className="mt-4 space-y-2">
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
                    <input
                      type="number"
                      name="depositAmount"
                      placeholder="Enter amount"
                      value={formData.depositAmount}
                      onChange={handleInputChange}
                      className={cx(
                        "relative w-full bg-transparent px-4 py-3.5",
                        "outline-none text-white/90 text-[13px] font-black"
                      )}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Final check */}
              <motion.div
                className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-[11px] text-white/55 font-black tracking-wide flex items-center gap-2">
                      <Info className="h-4 w-4 text-green-200" />
                      FINAL CHECK • BEFORE YOU LAUNCH
                    </div>
                    <div className="mt-2 text-[13px] font-black text-white/90 leading-snug">
                      You’re one step away from charging your account ⚡
                    </div>
                    <div className="mt-2 text-[12px] text-white/60 font-black">
                      Please confirm all details below — your request will be submitted instantly after you hit{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                        Submit Request
                      </span>
                      .
                    </div>
                  </div>

                  <Pill tone="blue">
                    <Zap className="h-3.5 w-3.5" />
                    READY
                  </Pill>
                </div>
              </motion.div>
            </div>
          </NeonFrame>

          {/* RIGHT */}
          <NeonFrame className="lg:col-span-5 min-w-0 p-5 sm:p-6">
            <div className="text-[11px] text-white/55 font-black tracking-wide">METHODS</div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {methodCards.map((m, idx) => {
                const active = selectedPayment === m.name;
                return (
                  <motion.button
                    key={`${m.name}-${idx}`}
                    type="button"
                    onClick={() => handleSelectMethod(m)}
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
                        className="absolute inset-0 opacity-80"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(34,197,94,0.18), rgba(59,130,246,0.14), rgba(236,72,153,0.14))",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25 }}
                      />
                    )}

                    <div className="relative">
                      <div className="text-[11px] text-white/55 font-black tracking-wide">METHOD</div>
                      <div className={cx("mt-1 font-black", active ? "text-green-100" : "text-white/85")}>{m.name}</div>
                      <div className="mt-3">
                        <Pill tone={active ? "green" : "gray"}>{active ? "Selected" : "Select"}</Pill>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-5">
              {selectedPayment ? (
                <ChecklistRow ok text={`Selected: ${selectedPayment} (details in popup)`} />
              ) : (
                <ChecklistRow ok={false} text="Select any payment method" />
              )}
            </div>
          </NeonFrame>
        </motion.div>

        {/* METHOD DETAILS MODAL */}
        <AnimatePresence>
          {showMethodModal && selectedPayment ? (
            <motion.div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(e) => e.target === e.currentTarget && setShowMethodModal(false)}
            >
              <motion.div
                className="w-full max-w-3xl max-h-[92vh] overflow-y-auto overscroll-contain"
                initial={{ opacity: 0, y: 14, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.985 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
              >
                <NeonFrame className="p-4 sm:p-6">
                  {/* header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Pill tone="pink">
                          <Info className="h-3.5 w-3.5" />
                          METHOD DETAILS
                        </Pill>
                        <Pill tone="green">{selectedPayment}</Pill>
                      </div>
                      <div className="mt-3 text-[12px] text-white/60 font-black">
                        Review payment details, upload proof, add transaction id, then submit.
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      onClick={() => setShowMethodModal(false)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-black text-white/80 hover:bg-white/10 inline-flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Close
                    </motion.button>
                  </div>

                  {/* body */}
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* left */}
                    <div className="md:col-span-5 space-y-4">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="text-[11px] text-white/55 font-black tracking-wide flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-green-200" />
                            METHOD IMAGE
                          </div>
                          <Pill tone={selectedMethodImageUrl ? "green" : "gray"}>
                            {selectedMethodImageUrl ? "Available" : "N/A"}
                          </Pill>
                        </div>

                        {selectedMethodImageUrl ? (
                          <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-2">
                            <img
                              src={selectedMethodImageUrl}
                              alt={selectedPayment}
                              className="w-full h-40 object-cover rounded-xl"
                              onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                          </div>
                        ) : (
                          <div className="mt-3 text-[12px] text-white/55 font-black">No image provided for this method.</div>
                        )}
                      </div>

                      <div className="p-1">
                        {isBank && selectedMethod?.bankTransfer ? (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-[12px] text-white/80 font-black">
                              <Building2 className="h-4 w-4 text-blue-200" />
                              Bank Transfer Info
                            </div>

                            <div className="space-y-2 text-[12px]">
                              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                                <span className="text-white/55 font-black">Bank</span>
                                <span className="text-white/85 font-black">{selectedMethod.bankTransfer.bankName || "-"}</span>
                              </div>
                              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                                <span className="text-white/55 font-black">A/C No.</span>
                                <span className="text-white/85 font-black">{selectedMethod.bankTransfer.accountNumber || "-"}</span>
                              </div>
                              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                                <span className="text-white/55 font-black">Holder</span>
                                <span className="text-white/85 font-black">{selectedMethod.bankTransfer.accountHolderName || "-"}</span>
                              </div>
                              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                                <span className="text-white/55 font-black">IFSC</span>
                                <span className="text-white/85 font-black">{selectedMethod.bankTransfer.ifscCode || "-"}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                            <div className="text-[11px] text-white/50 font-black tracking-wide">PAYMENT DETAILS</div>
                            <div className="mt-1 text-[12px] text-white/85 font-black break-words">
                              {selectedMethod?.details ? selectedMethod.details : "No details provided."}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* right */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                        <div className="text-[11px] text-white/55 font-black tracking-wide">UPLOAD & TRANSACTION</div>

                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <FieldLabel icon={UploadCloud} label="Upload Proof" sub="" />
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full text-[12px] font-black text-white/75 file:mr-3 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-[12px] file:font-black file:text-white/80 hover:file:bg-white/15"
                              />
                              {file ? (
                                <div className="mt-3 flex items-center gap-2">
                                  {previewUrl ? (
                                    <motion.button
                                      type="button"
                                      onClick={togglePreview}
                                      whileHover={{ y: -2 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-black text-white/80 hover:bg-white/10"
                                    >
                                      Preview
                                    </motion.button>
                                  ) : null}
                                  <motion.button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-black text-white/80 hover:bg-white/10"
                                  >
                                    Remove
                                  </motion.button>
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <FieldLabel icon={Hash} label="Transaction ID" sub="" />
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
                              <input
                                type="text"
                                name="transactionId"
                                placeholder="Enter transaction id"
                                value={formData.transactionId}
                                onChange={handleInputChange}
                                className={cx(
                                  "relative w-full bg-transparent px-4 py-3.5",
                                  "outline-none text-white/90 text-[13px] font-black"
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <motion.div
                        className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5"
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 240, damping: 18 }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-black text-white/90">Terms</div>
                          <Pill tone={agreeToTerms ? "emerald" : "gray"}>
                            <Cpu className="h-3.5 w-3.5" />
                            {agreeToTerms ? "Accepted" : "Pending"}
                          </Pill>
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={agreeToTerms}
                              onChange={(e) => setAgreeToTerms(e.target.checked)}
                              className="mt-1 w-5 h-5 text-green-500 bg-white/10 border-white/20 rounded focus:ring-green-500 focus:ring-2"
                            />
                            <span className="text-white/80 text-[13px] font-black">
                              I agree to the{" "}
                              <a
                                href={siteConfig?.tNcLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-200 hover:text-blue-100 underline"
                              >
                                Terms & Conditions
                              </a>
                              .
                            </span>
                          </label>
                        </div>
                      </motion.div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                          type="button"
                          onClick={() => setShowMethodModal(false)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-[13px] font-black text-white/85 hover:bg-white/10 transition"
                        >
                          Cancel
                        </motion.button>

                        <motion.button
                          type="button"
                          onClick={submitHandler}
                          disabled={!canSubmit}
                          whileHover={!canSubmit ? {} : { y: -2 }}
                          whileTap={!canSubmit ? {} : { scale: 0.98 }}
                          className={cx(
                            "flex-1 rounded-2xl px-5 py-3.5 text-[13px] font-black transition inline-flex items-center justify-center gap-2",
                            canSubmit ? btnPrimary : btnDisabled
                          )}
                        >
                          <Zap className="h-4 w-4" />
                          {creatingLoading || isSubmitting
                            ? "Submitting..."
                            : selectedPaymentLower === "crypto"
                            ? "Process Payment"
                            : "Submit Request"}
                          <ArrowRight className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </NeonFrame>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreview && previewUrl && (
            <motion.div
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(e) => e.target === e.currentTarget && setShowPreview(false)}
            >
              <motion.div
                className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0a0b10]/95 p-5"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
              >
                <div className="flex items-center justify-between">
                  <div className="font-black">Proof Preview</div>
                  <motion.button
                    onClick={togglePreview}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-black text-white/80 hover:bg-white/10"
                  >
                    Close
                  </motion.button>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-xl shadow-2xl" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crypto Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && paymentData && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0b10]/95 p-6"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
              >
                <div className="text-center">
                  <div className="text-3xl">✅</div>
                  <div className="mt-2 text-xl font-black">Payment Initiated</div>
                  <p className="text-[12px] text-white/60 mt-1">Use the details below to complete the payment.</p>
                </div>

                <motion.button
                  onClick={() => setShowPaymentModal(false)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-5 w-full rounded-2xl bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black px-5 py-4 text-[14px] font-black hover:brightness-110 transition"
                >
                  Continue
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

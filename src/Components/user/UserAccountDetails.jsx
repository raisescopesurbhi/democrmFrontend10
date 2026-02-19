import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, User, Wallet, Sparkles } from "lucide-react";
import ModernHeading from "../lib/ModernHeading";
import { FloatingParticles } from "../../utils/FloatingParticles";

import UserBankDetails from "./accountDetails/UserBankDetails";
import UserKycDetails from "./accountDetails/UserKycDetails";
import UserWalletDetails from "./accountDetails/UserWalletDetails";

/* =========================================================================    
   💚💗💙 THEME: "NEON REACTOR / CIRCUIT RAVE"
   - Keep theme/gradient/animations AS-IS
   - NO Reactor Rings
   - Layout updated exactly as requested
   - Old components NOT removed (still rendered per tab)
   ======================================================================= */

const cx = (...c) => c.filter(Boolean).join(" ");

/* ============================== THEME DECOR ============================== */

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
      {/* base */}
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

/* ========================== TOP RIGHT TABS =========================== */

const RightTabButton = ({ active, onClick, children, icon: Icon }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    className={cx(
      "relative px-4 py-2 rounded-full font-black transition-colors",
      "border border-white/10 bg-white/5 backdrop-blur-xl",
      active
        ? "text-black shadow-[0_0_34px_rgba(34,197,94,0.18)]"
        : "text-white/70 hover:text-white hover:bg-white/10"
    )}
  >
    <div className="relative z-10 flex items-center gap-2">
      <Icon className={cx("w-4 h-4", active ? "text-black" : "text-white/70")} />
      <span className="hidden sm:inline">{children}</span>
      <span className="sm:hidden">{children?.toString().split(" ")[0]}</span>
    </div>

    {active && (
      <motion.span
        layoutId="rightTabBubble"
        transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
        className="absolute inset-0 -z-0 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-pink-500"
      />
    )}
  </motion.button>
);

/* ========================== CONTENT ANIMS =========================== */

const contentVariants = {
  enter: (dir) => ({
    opacity: 0,
    x: dir > 0 ? 40 : -40,
    rotateX: 6,
    scale: 0.98,
  }),
  center: {
    opacity: 1,
    x: 0,
    rotateX: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 180, damping: 20, duration: 0.55 },
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir < 0 ? 40 : -40,
    rotateX: -6,
    scale: 0.98,
    transition: { duration: 0.35 },
  }),
};

/* ========================== SMALL UI =========================== */

const FieldBar = ({ text }) => (
  <motion.div
    whileHover={{ y: -2, rotate: -0.1 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[13px] font-black text-white/85"
  >
    {text}
  </motion.div>
);

const StatusBar = ({ text }) => (
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[12px] font-black text-white/80"
  >
    {text}
  </motion.div>
);

const btnPrimary =
  "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110";

/* ======================== MAIN COMPONENT ============================ */

const UserAccountDetails = () => {
  const tabs = useMemo(
    () => [
      { id: "personal", label: "Kyc Details", icon: User },
      { id: "account", label: "Bank Details", icon: CreditCard },
      { id: "wallet", label: "Wallet", icon: Wallet },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState("personal");
  const prevIndexRef = useRef(0);
  const currentIndex = tabs.findIndex((t) => t.id === activeTab);
  const direction = currentIndex - prevIndexRef.current;

  useEffect(() => {
    prevIndexRef.current = currentIndex;
  }, [currentIndex]);

  const leftFields = useMemo(() => {
   if (activeTab === "personal") {
     return [
     "Purpose",
        "Occupation",
     "Document Type",
       "Country of Issue",
     "Front Side",
   "Back Side",
   "Selfie with Document",
     ];
    }
    if (activeTab === "account") {
     return [
       "Name of Bank",
   "Name of Account Holder",
    "Account Number",
     "IFSC Code",
       "Swift Code",
     "UPI Id",
       "Comments",
     ];
    }
    return ["USDT(Trc 20)", "USDT(Bep 20)", "Binace Id", "BTC Address"];
  }, [activeTab]);

  const renderContent = () => {
    if (activeTab === "personal") return <UserKycDetails />;
    if (activeTab === "account") return <UserBankDetails />;
    return <UserWalletDetails />;
  };

  const renderOldComponent = () => {
    if (activeTab === "personal") return <UserKycDetails />;
    if (activeTab === "account") return <UserBankDetails />;
    return <UserWalletDetails />;
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden text-white">
      <NeonReactorBackdrop />
      <FloatingParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 pt-2 md:px-10">
        {/* TOP ROW: left bars | center title | right bars (NO outermost bar) */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left side three bars (horizontal) */}
          <div className="flex items-center gap-2 flex-wrap">
            <Pill tone="green">
              <Sparkles size={16} className="text-green-200" />
              Profile
            </Pill>
            <Pill tone="blue">Finance</Pill>
            <Pill tone="pink">Wallet</Pill>
          </div>

          {/* Center Account Details */}
          <motion.div
            initial={{ scale: 0.98, rotateX: 10, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-w-[220px] text-center"
          >
            <ModernHeading text="⚡ Account Details" />
          </motion.div>

          {/* Right side tabs (horizontal) */}
          <div className="flex items-center gap-2 flex-wrap">
            {tabs.map((t) => (
              <RightTabButton
                key={t.id}
                active={activeTab === t.id}
                onClick={() => setActiveTab(t.id)}
                icon={t.icon}
              >
                {t.label}
              </RightTabButton>
            ))}
          </div>
        </div>

        {/* MAIN: left big bar (fields + update + old component) | right status vertical */}

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDE: inside a bar */}
          <NeonFrame className="lg:col-span-8 p-5 sm:p-6">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeTab}
                custom={direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {leftFields.map((f) => (
                      <FieldBar key={f} text={f} />
                    ))}
                  </div> */}

                  {/* Update Details button centered below */}
                  {/* <div className="mt-6 flex justify-center">
                    <motion.button
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={cx(
                        "rounded-2xl px-6 py-3 text-[13px] font-black transition inline-flex items-center justify-center gap-2",
                        btnPrimary
                      )}
                    >
                      Update Details
                    </motion.button>
                  </div> */}

                  {/* OLD COMPONENTS (rendered, not removed) */}
                  <div className="mt-6">{renderContent()}</div>
                </div>  
              </motion.div>
            </AnimatePresence>
          </NeonFrame>
  
          {/* RIGHT SIDE: status bars vertical */}
          <NeonFrame className="lg:col-span-4 p-5 sm:p-6">
            <div className="space-y-3">
              <StatusBar text="Verified Kyc" />
              <StatusBar text="Secure Wallet" />
              <StatusBar text="Bank LInked" />
              <StatusBar text="Encrypted" />
            </div>
          </NeonFrame>
        </div>
      </div>
    </div>
  );
};

export default UserAccountDetails;

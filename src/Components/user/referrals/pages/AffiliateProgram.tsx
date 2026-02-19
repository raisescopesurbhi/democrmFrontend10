import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Handshake, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { backendApi } from "../../../../utils/apiClients";
import UseUserHook from "../../../../hooks/user/UseUserHook";

/* =========================================================================
   💚💗💙 THEME: "NEON REACTOR / CIRCUIT RAVE"
   - EXACT vibe from your UserNewChallenge
   - Layout you requested ONLY:
     Affiliate Program (center)
     icon (below)
     Start Affiliate Journey (below)
     button Generate Affiliate Account (below)
   - NO ReactorRing
   ======================================================================= */

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

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
          maskImage: "radial-gradient(120% 80% at 50% 0%, black 55%, transparent 85%)",
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

const NeonFrame = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cx(
      "relative rounded-[30px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl overflow-hidden",
      "shadow-[0_28px_140px_rgba(0,0,0,0.55)]",
      className
    )}
  >
    {/* animated neon border */}
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
    {/* shimmer */}
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

const btnPrimary =
  "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110";
const btnDisabled = "bg-white/10 text-white/40 cursor-not-allowed";

const CFgenerateRandomNumber = (len = 7) => {
  // 7-digit numeric string
  const min = Math.pow(10, len - 1);
  const max = Math.pow(10, len) - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
};

const asArray = (v: any) =>
  Array.isArray(v) ? v : Array.isArray(v?.data) ? v.data : Array.isArray(v?.result) ? v.result : [];

export default function UserAffiliateProgram() {
  const loggedUser = useSelector((store: any) => store.user.loggedUser);
   const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const extractedUrl = currentUrl ? new URL(currentUrl).origin : "";
  const referralLink =
    loggedUser?.referralAccount && `${extractedUrl}/user/signup/${loggedUser?.referralAccount}`
   


  
   
  const navigate = useNavigate();
  
  const { getUpdateLoggedUser } = UseUserHook();

  const [loading, setLoading] = useState(false);

  const [isCopied, setIsCopied] = useState(false);
  const [link, setLink] = useState("");
  const [commissions,setCommissions]=useState([]);
  const [withdrawals,setWithdrawals]=useState([]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1800);
  };


  const generateAffiliateAccount = async () => {
    if (loading) return;

    if (!loggedUser?._id) {
      toast.error("Please sign in to generate an affiliate account.");
      return;
    }

    if (loggedUser?.referralAccount) {
      toast.success("Affiliate account already active!");
      // Optional: navigate to your referral page
      // navigate("/user/referal");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Generating affiliate account...");

    try {
      const referralAccount = CFgenerateRandomNumber(7);

      await backendApi.put("/client/update-user", {
        id: loggedUser._id,
        referralAccount,
      });
     await getUpdateLoggedUser();
      toast.success("Affiliate account generated!", { id: toastId });  

      // Optional: route wherever you want after success
      // navigate("/user/referal");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate affiliate account.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const referralAccount = loggedUser?.referralAccount;
    const userId = loggedUser?._id;  

    if (!userId || !referralAccount) return;

    (async () => {
      setLoading(true);
      try {
        const [commRes] = await Promise.all([
          backendApi.get(`/client/user-zone-ibs/${referralAccount}`),
        ]);
        console.log({ commRes });

        const commList = asArray(commRes?.data ?? commRes);
        

        setCommissions(commList);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load commission data.");
        setCommissions([]);
        setWithdrawals([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [loggedUser?._id, loggedUser?.referralAccount]);


  const page = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 170, damping: 18, staggerChildren: 0.08 },
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

     

  // ✅ NEW: KPI stats (defaults shown)
  const stats = useMemo(() => {
    const referralCount = Array.isArray(loggedUser?.referrals) ? loggedUser.referrals.length : 0;
    return {
      totalEarned:
        loggedUser?.totalCommission ??
        loggedUser?.ibBalance ??
        loggedUser?.affiliateEarned??0,
      totalReferrals: commissions.length,
      activeTrades: loggedUser?.activeTrades ?? 0,
      commissionRate: loggedUser?.commissionRate ?? "—",
    };
  }, [loggedUser]);

  const StatBar = ({
    label,
    value,
    tone = "green",
  }: {
    label: string;
    value: React.ReactNode;
    tone?: "green" | "blue" | "pink" | "emerald";
  }) => {
    const tones: Record<string, string> = {
      green: "border-green-300/25 bg-green-500/10",
      blue: "border-blue-300/25 bg-blue-500/10",
      pink: "border-pink-300/25 bg-pink-500/10",
      emerald: "border-emerald-300/25 bg-emerald-500/10",
    };

    return (
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className={cx(
          "rounded-3xl border bg-white/[0.04] px-4 py-3.5 overflow-hidden",
          tones[tone] || tones.green
        )}
      >
        {/* details above bar */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] text-white/55 font-black tracking-wide">{label}</div>
            <div className="mt-1 text-base sm:text-lg font-black text-white/90 truncate">{value}</div>
          </div>
          <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5" />
        </div>

        {/* bar */}
        <div className="mt-3 h-2.5 rounded-full border border-white/10 bg-white/5 overflow-hidden">
          <motion.div
            className="h-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(34,197,94,0.95), rgba(59,130,246,0.95), rgba(236,72,153,0.95), rgba(16,185,129,0.90))",
            }}
            initial={{ width: "0%" }}
            animate={{ width: "72%" }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <NeonReactorBackdrop />

      <motion.div
        variants={page}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
      >
        {/* ✅ NEW: Center heading + subtitle + 4 horizontal bars */}
        <motion.div variants={inUp} className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
              Affiliate &amp; Referrals
            </span>
          </h1>
          <p className="text-white/65 mt-2 text-[13px] font-black tracking-wide">
            Earn commissions
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatBar label="Total Earned" value={stats.totalEarned} tone="green" />
            <StatBar label="Total Referrals" value={stats.totalReferrals} tone="blue" />
            <StatBar label="Active Trades" value={stats.activeTrades} tone="pink" />
            <StatBar label="Commission Rate" value={stats.commissionRate} tone="emerald" />
          </div>
        </motion.div>

        <motion.div variants={inUp}>
          <NeonFrame className="p-7 sm:p-10">
            {/* EXACT layout you requested */}
            <div className="flex flex-col items-center text-center">
              {/* Heading center */}
              <h1 className="text-3xl sm:text-4xl font-black leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                  Affiliate Program
                </span>
              </h1>

              {/* Icon below heading */}
              <div className="mt-6 relative">
                {/* glow plate */}
                <motion.div
                  className="absolute inset-0 rounded-3xl blur-2xl opacity-40"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(34,197,94,0.35), rgba(59,130,246,0.22), rgba(236,72,153,0.22))",
                  }}
                  animate={{ opacity: [0.25, 0.55, 0.25], scale: [0.98, 1.04, 0.98] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* icon card with animated conic edge (no reactor ring) */}
                <div className="relative">
                  <motion.div
                    className="absolute -inset-[2px] rounded-3xl opacity-60"
                    style={{
                      background:
                        "conic-gradient(from 90deg, rgba(34,197,94,0.45), rgba(59,130,246,0.45), rgba(236,72,153,0.42), rgba(16,185,129,0.40), rgba(34,197,94,0.45))",
                    }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-[#04050b]/70" />
                    <motion.div
                      className="absolute inset-0 opacity-[0.10]"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)",
                      }}
                      animate={{ x: ["-120%", "120%"] }}
                      transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
                    />

                    <motion.div
                      className="relative h-20 w-20 sm:h-24 sm:w-24 grid place-items-center"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
                        <Handshake className="h-7 w-7 sm:h-8 sm:w-8 text-green-200" />
                      </div>

                      {/* tiny spark */}
                      <motion.div
                        className="absolute -right-2 -top-2 h-8 w-8 rounded-2xl border border-white/10 bg-white/5 grid place-items-center"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Sparkles className="h-4 w-4 text-pink-200" />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Heading below icon */}
              <h2 className="mt-7 text-xl sm:text-2xl font-black text-white/90">
                Start Affiliate Journey
              </h2>

              {/* Button below heading */}
              <div className="mt-6 w-full max-w-sm">
                <motion.button
                  type="button"
                  onClick={generateAffiliateAccount}
                  disabled={loading || !!loggedUser?.referralAccount}
                  whileHover={loading || !!loggedUser?.referralAccount ? {} : { y: -2 }}
                  whileTap={loading || !!loggedUser?.referralAccount ? {} : { scale: 0.98 }}
                  className={cx(
                    "w-full rounded-2xl px-6 py-3.5 text-[13px] font-black transition inline-flex items-center justify-center gap-2",
                    loading || !!loggedUser?.referralAccount ? btnDisabled : btnPrimary
                  )}
                >
                  <Handshake className="h-4 w-4" />
                  {loggedUser?.referralAccount
                    ? "Affiliate Account Active"
                    : loading
                    ? "Generating..."
                    : "Generate Affiliate Account"}
                </motion.button>

      <div className="mt-4 flex items-center  gap-2">
        <input
          type="text"
          placeholder="Enter link"
          value={referralLink}
          // onChange={(e) => setLink(e.target.value)}
          className="w-full rounded-md bg-white/5 px-3 py-2 text-white outline-none ring-1 ring-white/10"
        />
        <button
          type="button"
          onClick={copyToClipboard}
          className="shrink-0 rounded-md bg-white/10 px-3 py-2 text-white/80 ring-1 ring-white/10 hover:bg-white/15"
        >
          Copy
        </button>
      </div>

                {/* Optional helper line (keeps theme) */}
                <div className="mt-3 text-[11px] text-white/50">
                  Generate your affiliate ID and start earning commissions.
                </div>



                {/* Optional: quick link if already active */}
                {!!loggedUser?.referralAccount && (
                  <motion.button
                    type="button"
                    onClick={() => navigate("/user/referal")}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-3 w-full rounded-2xl px-6 py-3.5 text-[13px] font-black border border-white/10 bg-white/5 hover:bg-white/10 text-white/80"
                  >
                    Go to Affiliate Dashboard
                  </motion.button>
                )}
              </div>
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

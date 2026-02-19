import React, { useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { RiUserSharedFill } from "react-icons/ri";
import {
  Eye,
  EyeOff,
  Loader2,
  Copy,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Mail,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import md5 from "md5";
// import backendApi from "../../../../backendApi";

import { backendApi } from "../../../utils/apiClients";

const cx = (...c) => c.filter(Boolean).join(" ");

/* =========================================================================
   THEME (same as UserNewChallenge): deep black + neon green/blue/pink + shimmer
   - No Reactor used
   - APIs/workflow unchanged
   ======================================================================= */

const NeonCircuitBackdrop = () => {
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
    {/* subtle shimmer */}
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

export default function SadminAdminInfo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showCredentials, setShowCredentials] = useState(false);
  const hideTimerRef = useRef(null);

  // UI-only: local password visibility (doesn't change workflow)
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await backendApi.get(`/s-admin/admin/user`); // ✅ unchanged
      setAdmin(data?.data);
    } catch (err) {
      console.error("Error fetching admin details:", err);
      setError("Error: Could not fetch admin details");
      toast.error("Failed to fetch");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetails();
    return () => clearTimeout(hideTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await backendApi.post(`/s-admin/admin/create-n-update`, { email, password }); // ✅ unchanged
      await fetchDetails();
      setEmail("");
      setPassword("");
      toast.success("Updated Successfully");
    } catch (err) {
      console.error(err);
      setError("Error: Could not create/update admin");
      toast.error("Failed to update");
    }
    setLoading(false);
  };

  const handleShowCredentials = () => {
    if (showCredentials) {
      clearTimeout(hideTimerRef.current);
      setShowCredentials(false);  
      return;
    }

    setShowCredentials(true);
    hideTimerRef.current = setTimeout(() => setShowCredentials(false), 30000);
  };

  const adminLoginHandler = () => {
    if (!admin) {
      toast.error("Admin not fetched yet! Please try again.");
      return;
    }
    const currentPasswordHash = md5(admin.password);
    localStorage.setItem("admin_password_ref", currentPasswordHash);
    window.open("/admin/dashboard", "_blank");
  };

  const copyText = async (txt) => {
    try {
      await navigator.clipboard.writeText(txt);
      toast.success("Copied!");
    } catch {
      toast.error("Copy failed");
    }
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
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 220, damping: 18 },
    },
  };

  return (
    <div className="relative min-h-[70vh] overflow-hidden text-white">
      <Toaster />
      <NeonCircuitBackdrop />

      <motion.div
        variants={page}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full"
      >
        {/* HERO */}
        <motion.div variants={inUp}>
          <NeonFrame className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Pill tone="green">
                    <Sparkles className="h-3.5 w-3.5" />
                    SECURITY CONSOLE
                  </Pill>
                  <Pill tone={admin ? "emerald" : "blue"}>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {admin ? "VAULT READY" : "FETCHING"}
                  </Pill>
                  <Pill tone={showCredentials ? "pink" : "gray"}>
                    {showCredentials ? "VISIBLE (30s)" : "HIDDEN"}
                  </Pill>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                    Admin Credential Vault
                  </span>
                </h1>
                <p className="text-white/70 mt-2 max-w-2xl">
                  Update admin credentials and reveal them temporarily when needed. Auto-hide is enforced.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  type="button"
                  onClick={fetchDetails}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className={cx(
                    "rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-[12px] font-black text-white/80 inline-flex items-center gap-2",
                    loading && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Refresh
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleShowCredentials}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!admin}
                  className={cx(
                    "rounded-2xl px-4 py-2 text-[12px] font-black inline-flex items-center gap-2 transition",
                    admin ? btnPrimary : btnDisabled
                  )}
                >
                  {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showCredentials ? "Hide" : "Reveal"}
                </motion.button>
              </div>
            </div>

            {/* subtle status strip */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] text-white/55 font-black tracking-wide">AUTO-HIDE</div>
                <div className="mt-1 text-white/90 font-black">30 seconds</div>
                <div className="text-[11px] text-white/45 mt-1">Reveal closes automatically.</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] text-white/55 font-black tracking-wide">ADMIN STATUS</div>
                <div className="mt-1 text-white/90 font-black">{admin ? "Loaded" : loading ? "Loading…" : "Not loaded"}</div>
                <div className="text-[11px] text-white/45 mt-1">Fetched from backend.</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] text-white/55 font-black tracking-wide">SAFE ACTION</div>
                <div className="mt-1 text-white/90 font-black">Copy buttons</div>
                <div className="text-[11px] text-white/45 mt-1">One-click copy to clipboard.</div>
              </div>
            </div>
          </NeonFrame>
        </motion.div>

        {/* MAIN GRID (completely different layout) */}
        <motion.div variants={inUp} className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* VAULT (wide) */}
          <NeonFrame className="lg:col-span-7 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
                  <ShieldCheck className="h-5 w-5 text-green-200" />
                </div>
                <div>
                  <div className="text-[11px] text-white/55 font-black tracking-wide">VAULT</div>
                  <div className="mt-1 text-xl font-black text-white/90">Stored Credentials</div>
                </div>
              </div>

              <Pill tone={showCredentials ? "pink" : "blue"}>
                {showCredentials ? "REVEALED" : "PROTECTED"}
              </Pill>
            </div>

            <div className="mt-5">
              {!admin ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="inline-flex items-center gap-2 text-white/70 text-sm font-black">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                    {loading ? "Loading from server…" : "No credentials found yet."}
                  </div>
                  {error ? (
                    <div className="mt-3 rounded-2xl border border-pink-300/20 bg-pink-500/10 px-4 py-3 text-pink-100 text-sm">
                      {error}
                    </div>
                  ) : null}
                </div>
              ) : (
                <>
                  <AnimatePresence initial={false}>
                    {showCredentials ? (
                      <motion.div
                        key="open"
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 220, damping: 18 }}
                        className="rounded-[28px] border border-white/10 bg-white/5 p-5 overflow-hidden relative"
                      >
                        {/* glow overlay */}
                        <div
                          className="absolute -inset-px opacity-25 blur-2xl pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(34,197,94,0.35), rgba(59,130,246,0.30), rgba(236,72,153,0.30))",
                          }}
                        />

                        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* email */}
                          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <Pill tone="green">
                                <Mail className="h-3.5 w-3.5" /> EMAIL
                              </Pill>
                              <motion.button
                                type="button"
                                onClick={() => copyText(admin.email)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="rounded-2xl px-3 py-2 text-[12px] font-black border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 inline-flex items-center gap-2"
                              >
                                <Copy className="h-4 w-4" />
                                Copy
                              </motion.button>
                            </div>
                            <div className="mt-3 text-sm font-black text-white/90 break-all">
                              {admin.email}
                            </div>
                            <div className="text-[11px] text-white/45 mt-2">
                              Use this to sign in as admin.
                            </div>
                          </div>

                          {/* password */}
                          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <Pill tone="pink">
                                <KeyRound className="h-3.5 w-3.5" /> PASSWORD
                              </Pill>
                              <motion.button
                                type="button"
                                onClick={() => copyText(admin.password)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="rounded-2xl px-3 py-2 text-[12px] font-black border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 inline-flex items-center gap-2"
                              >
                                <Copy className="h-4 w-4" />
                                Copy
                              </motion.button>
                            </div>
                            <div className="mt-3 text-sm font-black text-white/90 break-all">
                              {admin.password}
                            </div>
                            <div className="text-[11px] text-white/45 mt-2">
                              Auto-hides after 30 seconds.
                            </div>
                          </div>
                        </div>

                        <div className="relative mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center justify-between text-[11px] font-black tracking-wide text-white/55">
                            <span>Visibility window</span>
                            <span>30s</span>
                          </div>
                          <motion.div
                            className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden"
                            initial={{ opacity: 0.9 }}
                            animate={{ opacity: [0.7, 0.95, 0.7] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <motion.div
                              className="h-full"
                              style={{
                                background:
                                  "linear-gradient(90deg, rgba(34,197,94,0.95), rgba(59,130,246,0.95), rgba(236,72,153,0.95))",
                              }}
                              initial={{ width: "100%" }}
                              animate={{ width: "0%" }}
                              transition={{ duration: 30, ease: "linear" }}
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="closed"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ type: "spring", stiffness: 220, damping: 18 }}
                        className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-center"
                      >
                        <div className="inline-flex items-center gap-2 text-white/80 font-black">
                          <Eye className="h-5 w-5 text-blue-200" />
                          Credentials are protected
                        </div>
                        <div className="mt-2 text-white/55 text-sm">
                          Click <span className="font-black text-white/70">Reveal</span> to view for 30 seconds.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={adminLoginHandler}
                      className="rounded-2xl px-5 py-3.5 text-[13px] font-black transition inline-flex items-center justify-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white/85"
                    >
                      <RiUserSharedFill size={20} />
                      Login as Admin
                      <ExternalLink className="h-4 w-4 text-white/55" />
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleShowCredentials}
                      disabled={!admin}
                      className={cx(
                        "rounded-2xl px-5 py-3.5 text-[13px] font-black transition inline-flex items-center justify-center gap-2",
                        admin ? btnPrimary : btnDisabled
                      )}
                    >
                      {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {showCredentials ? "Hide Now" : "Reveal Now"}
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </NeonFrame>

          {/* UPDATE FORM (tall) */}
          <NeonFrame className="lg:col-span-5 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-white/55 font-black tracking-wide">UPDATE</div>
                <div className="mt-1 text-xl font-black text-white/90">Set New Credentials</div>
              </div>
              <Pill tone="green">
                <Sparkles className="h-3.5 w-3.5" />
                LIVE
              </Pill>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <label className="text-[12px] text-white/75 font-black tracking-wide flex items-center gap-2">
                  <Mail className="h-4 w-4 text-green-200" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  required
                  className={cx(
                    "mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3",
                    "outline-none text-white/90 text-[13px] font-black placeholder:text-white/35",
                    "focus:border-green-300/25 focus:ring-2 focus:ring-green-400/10"
                  )}
                />
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-[12px] text-white/75 font-black tracking-wide flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-pink-200" />
                    Password
                  </label>
                  <button  
                    type="button"
                    onClick={() => setShowPasswordInput((s) => !s)}
                    className="rounded-2xl px-3 py-2 text-[12px] font-black border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 inline-flex items-center gap-2"
                  >
                    {showPasswordInput ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showPasswordInput ? "Hide" : "Show"}
                  </button>
                </div>

                <input
                  type={showPasswordInput ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className={cx(
                    "mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3",
                    "outline-none text-white/90 text-[13px] font-black placeholder:text-white/35",
                    "focus:border-green-300/25 focus:ring-2 focus:ring-green-400/10"
                  )}
                />

                <div className="mt-2 text-[11px] text-white/45">
                  This will update the stored admin credentials on the server.
                </div>
              </div>

              {error ? (
                <div className="rounded-3xl border border-pink-300/20 bg-pink-500/10 px-4 py-3 text-pink-100 text-sm font-black">
                  {error}
                </div>
              ) : null}

              <motion.button
                whileHover={loading ? {} : { y: -2 }}
                whileTap={loading ? {} : { scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={cx(
                  "w-full rounded-2xl px-5 py-3.5 text-[13px] font-black transition inline-flex items-center justify-center gap-2",
                  loading ? btnDisabled : btnPrimary
                )}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                {loading ? "Saving…" : "Save Credentials"}
              </motion.button>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-[12px] text-white/60">
                <div className="font-black text-white/80 mb-1">Note</div>
                Reveal is temporary. Copy what you need and it auto-hides after 30 seconds.
              </div>
            </form>
          </NeonFrame>
        </motion.div>

        <motion.div variants={inUp} className="text-center text-white/45 mt-8 text-[12px]">
          Neon circuit theme · green/blue/pink on deep black
        </motion.div>
      </motion.div>
    </div>
  );
}

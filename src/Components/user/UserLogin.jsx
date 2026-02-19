import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  Lock,
  LogIn,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  RadioTower,
} from "lucide-react";

import { backendApi } from "../../utils/apiClients";
import { setLoggedUser } from "../../redux/user/userSlice";
import ModernHeading from "../lib/ModernHeading";

/* =========================================================================
   💚💗💙 THEME: "NEON REACTOR / CIRCUIT RAVE" (from UserNewChallenge)
   - DO NOT change theme/gradient/animations
   - ONLY layout updated
   - NO ReactorRing
   - APIs/workflow unchanged
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

const SelectWrap = ({ children }) => (
  <div
    className={cx(
      "relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden",
      "focus-within:border-green-300/25 focus-within:ring-2 focus-within:ring-green-400/10"
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

/* Animations (unchanged) */
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

const btnPrimary =
  "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110";
const btnDisabled = "bg-white/10 text-white/40 cursor-not-allowed";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");  
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const siteConfig = useSelector((state) => state.user.siteConfig);
  const baseHeight = siteConfig?.logoSize || 4;

  // ✅ API/workflow unchanged
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await backendApi.post(
        `/auth/client/login`,
        { email, password, remember }
      );

      if (!res?.data) {
        toast.error("Unexpected response from server.");
        return;
      }
      if (!res.data.status) {
        toast.error(res.data.message || "Login failed!");
        return;
      }

      toast.success(`Welcome 👋🏽 ${res.data.user.firstName}`);
      dispatch(setLoggedUser(res.data.user));
      setTimeout(() => navigate("/user/dashboard"), 3000);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed! Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ API/workflow unchanged
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsResetLoading(true);
    try {
      const res = await backendApi.post(`/auth/send-reset-link`, { email: resetEmail });
      if (!res?.data) {
        toast.error("Unexpected response from server.");
        return;
      }
      toast.success(res.data.message || "Reset link sent successfully!");
      setResetEmail("");
      setShowForgotPassword(false);
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Failed to send reset email!";
      toast.error(message);
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <Toaster position="top-right" />
      <NeonReactorBackdrop />

      {/* ========================= LAYOUT UPDATED =========================
          - Full-height flex like typical auth pages
          - Left promo shows on xl, right auth always centered
          - Theme/gradients/animations untouched
         ================================================================ */}
      <motion.div
        variants={page}
        initial="hidden"
        animate="visible"
        className="relative z-10 min-h-screen flex flex-col"
      >
        <div className="flex-1 flex items-stretch">
          {/* Left promo (xl only) */}
          {/* <div className="hidden xl:flex w-1/2 px-10 2xl:px-14 py-10 items-center">
            <motion.div variants={inUp} className="w-full">
              <NeonFrame className="p-7">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <Pill tone="green">
                        <Sparkles className="h-3.5 w-3.5" />
                        NEON REACTOR ACCESS
                      </Pill>
                      <Pill tone="blue">
                        <Shield className="h-3.5 w-3.5" />
                        Secure Session
                      </Pill>
                      <Pill tone="pink">Fast UX</Pill>
                    </div>

                    <h1 className="text-3xl 2xl:text-4xl font-black leading-tight">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                        Welcome Back
                      </span>
                    </h1>

                    <p className="text-white/70 mt-3 max-w-xl">
                      Encrypted access · session hardening · sleek dashboard experience.
                    </p>

                    <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center gap-3 text-white/80">
                        <Shield className="h-5 w-5 text-green-200" />
                        <span className="font-black">
                          2FA ready • Encrypted transit • Modern UX
                        </span>
                      </div>
                    </div>
                  </div>  

                  <motion.img
                    src={
                      siteConfig?.logo ||
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAeFBMVEX///8AAAC2trYaGhrY2NhfX19kZGSxsbGOjo78/Pzx8fHS0tIwMDBISEjFxcXj4+N2dnakpKRTU1Pg4OA7Ozvr6+s1NTWIiIjw8PCVlZXMzMxQUFBzc3O7u7vGxsapqakmJiYPDw8dHR2bm5t+fn5qamojIyNBQUGjxSU6AAAEw0lEQVR4nO2c2ZayOhBGiQM2iDjgbOPQavv+b3ioCiJI8OqnOVXr21ch9HJld6BSSQDPAw=="
                    }
                    alt="Logo"
                    className="object-contain"
                    style={{ height: `${baseHeight}rem` }}
                    whileHover={{ rotate: -3, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  />
                </div>
              </NeonFrame>
            </motion.div>
          </div> */}

          {/* Right auth (always) */}
          <div className="w-full xl:w-1/2 px-4 sm:px-6 lg:px-12 py-10 flex items-center justify-center">
            <motion.div variants={inUp} className="w-full max-w-md">
              <NeonFrame className="p-6 sm:p-7 mx-auto">
                {/* Compact header inside card (layout change only) */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Pill tone="green">
                        <Sparkles className="h-3.5 w-3.5" />
                        ACCESS
                      </Pill>
                      <Pill tone={showForgotPassword ? "pink" : "blue"}>
                        <RadioTower className="h-3.5 w-3.5" />
                        {showForgotPassword ? "RESET" : "LOGIN"}
                      </Pill>
                    </div>

                    <div className="mt-4">
                      <ModernHeading text={showForgotPassword ? "Forgot Password" : "Welcome Back"} />
                      <p className="text-white/70 mt-2 text-[12px]">
                        {showForgotPassword
                          ? "Enter your email and we’ll send a secure reset link."
                          : "Enter your credentials to access your account."}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    onClick={() => navigate("/")}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="shrink-0 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-[12px] font-black text-white/80 inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Home
                  </motion.button>
                </div>

                <div className="mt-6">
                  <AnimatePresence mode="wait">
                    {!showForgotPassword ? (
                      <motion.div
                        key="login"
                        variants={inUp}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                      >
                        <form onSubmit={handleLogin} className="space-y-4">
                          {/* Email */}
                          <div className="space-y-2">
                            <div className="text-[12px] text-white/75 font-black tracking-wide flex items-center gap-2">
                              <Mail className="h-4 w-4 text-green-200" />
                              Email
                            </div>
                            <SelectWrap>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
                                <input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="Email address"
                                  required
                                  className={cx(
                                    "w-full bg-transparent px-10 py-3.5 pr-4 outline-none",
                                    "text-white/90 text-[13px] font-black placeholder:text-white/35"
                                  )}
                                />
                              </div>
                            </SelectWrap>
                          </div>

                          {/* Password */}
                          <div className="space-y-2">
                            <div className="text-[12px] text-white/75 font-black tracking-wide flex items-center gap-2">
                              <Lock className="h-4 w-4 text-blue-200" />
                              Password
                            </div>
                            <SelectWrap>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
                                <input
                                  type={showPass ? "text" : "password"}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Password"
                                  required
                                  className={cx(
                                    "w-full bg-transparent px-10 py-3.5 pr-12 outline-none",
                                    "text-white/90 text-[13px] font-black placeholder:text-white/35"
                                  )}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPass((s) => !s)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                                  aria-label={showPass ? "Hide password" : "Show password"}
                                >
                                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                            </SelectWrap>
                          </div>

                          {/* remember + forgot */}
                          <div className="flex items-center justify-between text-sm">
                            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                className="accent-green-400"
                                checked={remember}
                                onChange={() => setRemember((v) => !v)}
                              />
                              <span className="text-white/80 font-black text-[12px]">
                                Remember me
                              </span>
                            </label>

                            <button
                              type="button"
                              onClick={() => setShowForgotPassword(true)}
                              className="text-green-200 hover:text-green-100 font-black text-[12px]"
                            >
                              Forgot password?
                            </button>
                          </div>

                          {/* submit */}
                          <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={isLoading ? {} : { y: -2 }}
                            whileTap={isLoading ? {} : { scale: 0.98 }}
                            className={cx(
                              "w-full rounded-2xl px-5 py-3.5 text-[13px] font-black transition",
                              "inline-flex items-center justify-center gap-2",
                              isLoading ? btnDisabled : btnPrimary
                            )}
                          >
                            <LogIn className="h-4 w-4" />
                            Sign in
                            {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
                          </motion.button>
                        </form>

                        <p className="mt-5 text-center text-[12px] text-white/65">
                          Don&apos;t have an account?{" "}
                          <Link
                            to="/user/signup"
                            className="font-black text-green-200 hover:text-green-100"
                          >
                            Sign up
                          </Link>
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="forgot"
                        variants={inUp}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                      >
                        <motion.button
                          type="button"
                          onClick={() => setShowForgotPassword(false)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="mb-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-[12px] font-black text-white/80 inline-flex items-center gap-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back to login
                        </motion.button>

                        <form onSubmit={handleForgotPassword} className="space-y-4">
                          <div className="space-y-2">
                            <div className="text-[12px] text-white/75 font-black tracking-wide flex items-center gap-2">
                              <Mail className="h-4 w-4 text-green-200" />
                              Email
                            </div>
                            <SelectWrap>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
                                <input
                                  type="email"
                                  value={resetEmail}
                                  onChange={(e) => setResetEmail(e.target.value)}
                                  placeholder="Email address"
                                  required
                                  className={cx(
                                    "w-full bg-transparent px-10 py-3.5 pr-4 outline-none",
                                    "text-white/90 text-[13px] font-black placeholder:text-white/35"
                                  )}
                                />
                              </div>
                            </SelectWrap>
                          </div>

                          <motion.button
                            type="submit"
                            disabled={isResetLoading}
                            whileHover={isResetLoading ? {} : { y: -2 }}
                            whileTap={isResetLoading ? {} : { scale: 0.98 }}
                            className={cx(
                              "w-full rounded-2xl px-5 py-3.5 text-[13px] font-black transition",
                              "inline-flex items-center justify-center gap-2",
                              isResetLoading ? btnDisabled : btnPrimary
                            )}
                          >
                            Send reset link
                            {isResetLoading && <Loader2 className="animate-spin h-4 w-4" />}
                          </motion.button>
                        </form>

                        <div className="mt-4 text-[11px] text-white/50">
                          We’ll email you a reset link if the address exists in our system.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </NeonFrame>

              <motion.div variants={inUp} className="text-center text-white/45 mt-6 text-[12px]">
                Neon reactor theme · green/pink/blue/emerald on black ⚡
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

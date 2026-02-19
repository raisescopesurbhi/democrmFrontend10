import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  Mail,
  Lock,
  User as UserIcon,
  Globe,
  Check,
  MapPin,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Phone,
  Gauge,
} from "lucide-react";
import { getData } from "country-list";
import { useSelector } from "react-redux";
import { backendApi } from "../../utils/apiClients";
import ModernHeading from "../lib/ModernHeading";

/* =========================================================================
   💚💗💙 THEME: "NEON REACTOR / CIRCUIT RAVE" (from UserNewChallenge)
   - NeonReactorBackdrop + NeonFrame (animated conic border + shimmer)
   - Pill tones + SelectWrap/FieldLabel style
   - NO ReactorRing
   - APIs/workflow unchanged
   - Clean layout (NO Core/Launch columns)
   ======================================================================= */

const cx = (...c) => c.filter(Boolean).join(" ");

/* --------------------------- Theme Primitives --------------------------- */
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

const FieldLabel = ({ icon: Icon, label, sub }) => (
  <div className="flex items-center justify-between">
    <label className="text-[12px] text-white/75 font-black tracking-wide flex items-center gap-2">
      <Icon className="h-4 w-4 text-green-200" />
      {label}
    </label>
    {sub ? <span className="text-[11px] text-white/45">{sub}</span> : null}
  </div>
);

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

/* --------------------------- Phone Input Skin --------------------------- */
const phoneInputCustomStyles = `
.PhoneInput { position: relative; width: 100%; }
.PhoneInputInput {
  background: transparent !important;
  border: 0 !important;
  color: rgba(255,255,255,0.9) !important;
  padding: 0.875rem 1rem 0.875rem 2.75rem !important;
  outline: none !important;
  font-weight: 800 !important;
  font-size: 13px !important;
}
.PhoneInputInput::placeholder { color: rgba(255,255,255,0.35) !important; }
.PhoneInputCountry {
  position: absolute;
  left: 0.75rem; top: 50%; transform: translateY(-50%);
  background: transparent !important;
  border: none !important;
  filter: drop-shadow(0 0 12px rgba(34,197,94,0.18));
}
.PhoneInputCountrySelect {
  background-color: #0b0d14 !important;
  color: #fff !important;
}
`;

/* --------------------------- Password strength helper (unchanged) --------------------------- */
function getPasswordStrength(pw = "") {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const clamp = Math.min(score, 4);
  const labels = ["Very weak", "Weak", "Good", "Strong", "Excellent"];
  const colors = ["bg-rose-500", "bg-amber-500", "bg-yellow-400", "bg-emerald-400", "bg-emerald-500"];
  return { score: clamp, label: labels[score], color: colors[clamp] };
}

/* --------------------------- Animations (match UserNewChallenge) --------------------------- */
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

const btnPrimary =
  "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110";
const btnDisabled = "bg-white/10 text-white/40 cursor-not-allowed";

export default function UserSignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    address: "",
    zipCode: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ----- handle optional :id safely (unchanged) -----
  const { id: routeId } = useParams();
  const inviteId =
    routeId && routeId !== "undefined" && routeId !== "null" && String(routeId).trim() !== ""
      ? routeId
      : null;

  const navigate = useNavigate();
  const siteConfig = useSelector((state) => state.user.siteConfig);
  const baseHeight = siteConfig?.logoSize || 4;
  const countriesArray = getData();

  const strength = getPasswordStrength(formData.password);

  // ✅ API/workflow unchanged
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      return setError({ type: "validation", message: "Passwords do not match." });
    }
    if (!formData.phone?.trim()) {
      return setError({ type: "validation", message: "Phone number is required." });
    }

    setSubmitting(true);
    const toastId = toast.loading("Creating account...");
    try {
      const path = inviteId ? `/auth/signup/${encodeURIComponent(inviteId)}` : `/auth/signup`;
      const res = await backendApi.post(path, formData);

      toast.success(`Verification link sent to ${formData.email}`, { id: toastId });

      // Send verification email (unchanged)
      await backendApi.post(`/auth/send-link`, {
        userId: res.data.user._id,
        email: res.data.user.email,
        password: formData.confirmPassword,
      });

      // Redirect (unchanged)
      navigate(`/user/verify/${res.data.user._id}/000`);
    } catch (err) {
      let message = "Signup failed";
      if (!err.response) message = "Network error: please check your internet connection.";
      else if (err.response.status >= 500) message = "Server error: please try again later.";
      else if (err.response.status === 401) message = "Unauthorized: invalid credentials.";
      else if (err.response.status === 403) message = "Forbidden: you do not have permission.";
      else if (err.response.data?.msg) message = err.response.data.msg;

      setError({ type: "http", message });
      toast.error(message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  // UI-only progress (does not affect workflow)
  const filledCount = [
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.phone,
    formData.country,
    formData.address,
    formData.state,
    formData.city,
    formData.zipCode,
    formData.password,
    formData.confirmPassword,
  ].filter((v) => String(v || "").trim()).length;

  const progress = Math.min(100, Math.round((filledCount / 11) * 100));

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <style>{phoneInputCustomStyles}</style>
      <Toaster position="top-right" />
      <NeonReactorBackdrop />

      <motion.div
        variants={page}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
      >
        {/* Header */}
        <motion.div variants={inUp}>
          <NeonFrame className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Pill tone="green">
                    <Sparkles className="h-3.5 w-3.5" />
                    NEON REACTOR SIGNUP
                  </Pill>
                  <Pill tone={inviteId ? "pink" : "blue"}>
                    <Shield className="h-3.5 w-3.5" />
                    {inviteId ? "INVITE" : "OPEN"}
                  </Pill>
                  <Pill tone="gray">Encrypted Session</Pill>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <motion.img
                    src={
                      siteConfig?.logo ||
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAeFBMVEX///8AAAC2trYaGhrY2NhfX19kZGSxsbGOjo78/Pzx8fHS0tIwMDBISEjFxcXj4+N2dnakpKRTU1Pg4OA7Ozvr6+s1NTWIiIjw8PCVlZXMzMxQUFBzc3O7u7vGxsapqakmJiYPDw8dHR2bm5t+fn5qamojIyNBQUGjxSU6AAAEw0lEQVR4nO2c2ZayOhBGiQM2iDjgbOPQavv+b3ioCiJI8OqnOVXr21ch9HJld6BSSQDPAw=="
                    }
                    alt="Logo"
                    className="object-contain"
                    style={{ height: `${baseHeight}rem` }}
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: -3, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  />

                  <div className="min-w-0">
                    <h1 className="text-3xl sm:text-4xl font-black leading-tight">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                        Create an Account
                      </span>
                    </h1>
                    <p className="text-white/70 mt-2 max-w-2xl">
                      It only takes a minute — we’ll email you a verification link.
                    </p>
                  </div>
                </div>

                {/* Progress (UI only) */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-[11px] font-black tracking-wide text-white/55">
                    <span className="inline-flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-green-200" />
                      Completion
                    </span>
                    <span>{progress}%</span>
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

              <div className="flex items-center gap-2">
                <Link
                  to="/user/login"
                  className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-[12px] font-black text-white/80 inline-flex items-center gap-2"
                >
                  Already have account? Login
                </Link>
              </div>
            </div>
          </NeonFrame>
        </motion.div>

        {/* Error banner (same behavior) */}
        <AnimatePresence>
          {error?.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-5 rounded-3xl border border-pink-300/25 bg-pink-500/10 px-5 py-4 text-pink-100"
            >
              <div className="text-[11px] font-black tracking-wide text-white/60">ERROR</div>
              <div className="mt-1 font-black">{error.message}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clean Form Card */}
        <motion.div variants={inUp} className="mt-6">
          <NeonFrame className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-[11px] text-white/55 font-black tracking-wide">SIGNUP FORM</div>
                <div className="mt-1 text-xl font-black text-white/90">
                  Fill your details to continue
                </div>
              </div>
              <Pill tone="gray">No ReactorRing</Pill>
            </div>

            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal */}
                <motion.div variants={inUp} className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <Pill tone="green">
                      <UserIcon className="h-3.5 w-3.5" />
                      Personal
                    </Pill>
                    <span className="text-[11px] font-black tracking-wide text-white/55">Required</span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FieldLabel icon={UserIcon} label="First Name" sub="Required" />
                      <SelectWrap>
                        <input
                          name="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))}
                          placeholder="First Name"
                          required
                          className={cx(
                            "w-full bg-transparent px-4 py-3.5 outline-none",
                            "text-white/90 text-[13px] font-black placeholder:text-white/35"
                          )}
                        />
                      </SelectWrap>
                    </div>

                    <div className="space-y-2">
                      <FieldLabel icon={UserIcon} label="Last Name" sub="Required" />
                      <SelectWrap>
                        <input
                          name="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))}
                          placeholder="Last Name"
                          required
                          className={cx(
                            "w-full bg-transparent px-4 py-3.5 outline-none",
                            "text-white/90 text-[13px] font-black placeholder:text-white/35"
                          )}
                        />
                      </SelectWrap>
                    </div>
                  </div>
                </motion.div>

                {/* Contact */}
                <motion.div variants={inUp} className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <Pill tone="blue">
                      <Mail className="h-3.5 w-3.5" />
                      Contact
                    </Pill>
                    <span className="text-[11px] font-black tracking-wide text-white/55">Required</span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FieldLabel icon={Mail} label="Email" sub="Required" />
                      <SelectWrap>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
                          <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))}
                            placeholder="Email"
                            required
                            className={cx(
                              "w-full bg-transparent px-10 py-3.5 pr-4 outline-none",
                              "text-white/90 text-[13px] font-black placeholder:text-white/35"
                            )}
                          />
                        </div>
                      </SelectWrap>
                    </div>

                    <div className="space-y-2">
                      <FieldLabel icon={Phone} label="Phone" sub="Required" />
                      <SelectWrap>
                        <PhoneInput
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={(phone) => setFormData((p) => ({ ...p, phone }))}
                          defaultCountry="IN"
                          international
                          required
                        />
                      </SelectWrap>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <FieldLabel icon={Globe} label="Country" sub="Required" />
                      <SelectWrap>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={(e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))}
                          required
                          className={cx(
                            "w-full appearance-none bg-transparent px-4 py-3.5 outline-none",
                            "text-white/90 text-[13px] font-black"
                          )}
                        >
                          <option value="" className="bg-[#0b0d14]">
                            Select Country
                          </option>
                          {countriesArray.map((c) => (
                            <option key={c.code} value={c.name} className="bg-[#0b0d14]">
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </SelectWrap>
                    </div>
                  </div>
                </motion.div>

                {/* Address */}
                <motion.div variants={inUp} className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <Pill tone="emerald">
                      <MapPin className="h-3.5 w-3.5" />
                      Address
                    </Pill>
                    <span className="text-[11px] font-black tracking-wide text-white/55">Required</span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <FieldLabel icon={MapPin} label="Address" sub="Required" />
                      <SelectWrap>
                        <input
                          name="address"
                          value={formData.address}
                          onChange={(e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))}
                          placeholder="Address"
                          required
                          className={cx(
                            "w-full bg-transparent px-4 py-3.5 outline-none",
                            "text-white/90 text-[13px] font-black placeholder:text-white/35"
                          )}
                        />
                      </SelectWrap>
                    </div>

                    <div className="space-y-2">
                      <FieldLabel icon={MapPin} label="State" sub="Required" />
                      <SelectWrap>
                        <input
                          name="state"
                          value={formData.state}
                          onChange={(e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))}
                          placeholder="State"
                          required
                          className={cx(
                            "w-full bg-transparent px-4 py-3.5 outline-none",
                            "text-white/90 text-[13px] font-black placeholder:text-white/35"
                          )}
                        />
                      </SelectWrap>
                    </div>

                    <div className="space-y-2">
                      <FieldLabel icon={MapPin} label="City" sub="Required" />
                      <SelectWrap>
                        <input
                          name="city"
                          value={formData.city}
                          onChange={(e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))}
                          placeholder="City"
                          required
                          className={cx(
                            "w-full bg-transparent px-4 py-3.5 outline-none",
                            "text-white/90 text-[13px] font-black placeholder:text-white/35"
                          )}
                        />
                      </SelectWrap>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <FieldLabel icon={MapPin} label="Zip Code" sub="Required" />
                      <SelectWrap>
                        <input
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))}
                          placeholder="Zip Code"
                          required
                          className={cx(
                            "w-full bg-transparent px-4 py-3.5 outline-none",
                            "text-white/90 text-[13px] font-black placeholder:text-white/35"
                          )}
                        />
                      </SelectWrap>
                    </div>
                  </div>
                </motion.div>

                {/* Security */}
                <motion.div variants={inUp} className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <Pill tone="pink">
                      <Lock className="h-3.5 w-3.5" />
                      Security
                    </Pill>
                    <span className="text-[11px] font-black tracking-wide text-white/55">Required</span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FieldLabel icon={Lock} label="Password" sub="Required" />
                      <SelectWrap>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
                          <input
                            type={showPass ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={(e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))}
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
                          >
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </SelectWrap>

                      {/* Strength meter (same logic / same motion style) */}
                      <div className="mt-2">
                        <div className="h-2.5 w-full rounded bg-white/10 overflow-hidden">
                          <motion.div
                            className={cx("h-full", strength.color)}
                            initial={{ width: 0 }}
                            animate={{ width: `${(strength.score / 4) * 100}%` }}
                            transition={{ type: "spring", stiffness: 120, damping: 18 }}
                          />
                        </div>
                        <div className="text-[11px] text-white/60 mt-1 font-black">{strength.label}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <FieldLabel icon={Lock} label="Confirm Password" sub="Required" />
                      <SelectWrap>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
                          <input
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))}
                            placeholder="Confirm Password"
                            required
                            className={cx(
                              "w-full bg-transparent px-10 py-3.5 pr-12 outline-none",
                              "text-white/90 text-[13px] font-black placeholder:text-white/35"
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                          >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </SelectWrap>
                    </div>

                    {/* Terms (unchanged behavior) */}
                    <div className="md:col-span-2 flex items-center gap-2">
                      <input type="checkbox" className="accent-green-400" required />
                      <span className="text-white/70 text-[12px] font-black">
                        I agree with the{" "}
                        <a
                          href={siteConfig?.tNcLink}
                          className="text-green-200 hover:text-green-100"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Terms &amp; Conditions
                        </a>
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={submitting ? {} : { y: -2 }}
                  whileTap={submitting ? {} : { scale: 0.98 }}
                  className={cx(
                    "w-full rounded-2xl px-5 py-3.5 text-[13px] font-black transition",
                    "inline-flex items-center justify-center gap-2",
                    submitting ? btnDisabled : btnPrimary
                  )}
                >
                  <Check className="h-4 w-4" />
                  Create Account
                  {submitting && (
                    <motion.span
                      className="inline-block w-4 h-4 rounded-full border-2 border-black/70 border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    />
                  )}
                </motion.button>

                <p className="text-center text-[12px] text-white/65">
                  Already have an account?{" "}
                  <Link to="/user/login" className="font-black text-green-200 hover:text-green-100">
                    Log in
                  </Link>
                </p>

                <div className="text-[11px] text-white/50 text-center">
                  After signup, you’ll be redirected to verification.
                </div>
              </form>
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

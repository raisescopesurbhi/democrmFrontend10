import { useState, useMemo } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  AlertCircle,  
  Shield,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import ModernHeading from "../lib/ModernHeading";
import { backendApi } from "../../utils/apiClients";
import UseUserHook from "../../hooks/user/UseUserHook";
import { FloatingParticles } from "../../utils/FloatingParticles";

/* =========================================================================
   💚💗💙 THEME: "NEON REACTOR / CIRCUIT RAVE" (same as above)
   - Neon green + hot pink + electric blue + emerald on deep black
   - Heavy animations + shimmer border + glow tiles
   - NO Reactor Rings added
   - No logic/workflow changes
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

const InputWrap = ({ children }) => (
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

/* ============================== COMPONENT ================================ */

const UserChnagePassword = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState("");

  const loggedUser = useSelector((store) => store.user.loggedUser);
  const navigate = useNavigate();
  const { getUpdateLoggedUser } = UseUserHook();

  const handleChange = (e) => {
    setPasswords((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((s) => ({ ...s, [field]: !s[field] }));
  };

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
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Updated - ${
        import.meta.env.VITE_WEBSITE_NAME || "Forex"
      }</title>
      <style>
        body, html { margin: 0; padding: 0; font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; padding: 5px; background-color: #ffffff; }
        .header { background-color: #19422df2; color: #ffffff; padding: 20px 15px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 22px; letter-spacing: 1px; }
        .content { padding: 10px 20px; }
        .cta-button { display: inline-block; padding: 12px 24px; background-color: #2d6a4f; color: #FFFFFF; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0; }
        .footer { background-color: #19422df2; color: #ffffff; text-align: center; padding: 5px 10px; font-size: 12px; border-radius: 0 0 10px 10px; }
        .footer-info { margin-top: 6px; }
        .footer-info a { color: #0ec097; text-decoration: none; }
        .withdrawal-details { background-color: #f8f8f8; border-left: 4px solid #2d6a4f; padding: 15px; margin: 20px 0; }
        .withdrawal-details p { margin: 5px 0; }
        .highlight { font-weight: bold; color: #0a2342; }
        .risk-warning { color: #C70039; padding: 5px; font-size: 12px; line-height: 1.4; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Account Password Updated</h1></div>
        <div class="content">
          <p>Dear ${loggedUser?.firstName + " " + loggedUser?.lastName},</p>
          <p>Your account password has been successfully updated.</p>
          <div class="withdrawal-details">
            <p>New password: <span class="highlight">${
              passwords.confirm
            }</span></p>
            <p>Updated Date: <span class="highlight">${formattedDateTime}</span></p>
          </div>
          <p>Thank you for choosing us.</p>
          <p>Best regards,<br/>The ${
            import.meta.env.VITE_WEBSITE_NAME || "Forex"
          } Team</p>
          <hr/>
          <div class="risk-warning">
            <strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks.
            <br/><br/>Our services are not for U.S. citizens or in jurisdictions where they violate local laws.
          </div>
        </div>
        <div class="footer">
          <div class="footer-info">
            <p>Website: <a href="https://${
              import.meta.env.VITE_EMAIL_WEBSITE
            }">${import.meta.env.VITE_EMAIL_WEBSITE}</a> | 
            E-mail: <a href="mailto:${
              import.meta.env.VITE_EMAIL_EMAIL || ""
            }">${import.meta.env.VITE_EMAIL_EMAIL || ""}</a></p>
            <p>© 2025 ${
              import.meta.env.VITE_WEBSITE_NAME || ""
            }. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </body>
    </html>`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Please wait…");
    if (passwords.new !== passwords.confirm) {
      setError("Passwords do not match. Please try again.");
      toast.error("Passwords do not match", { id: toastId });
      return;
    }
    try {
      const res = await backendApi.post(`/update-password`, {
        userId: loggedUser._id,
        currentPassword: passwords.current,
        newPassword: passwords.confirm,
      });
      await backendApi.post(`/custom-mail`, {
        email: loggedUser.email,
        content: customContent,
        subject: "Account Password Changed",
      });
      toast.success(res?.data?.msg || "Password updated", { id: toastId });
      navigate("/user/dashboard");
      getUpdateLoggedUser();
    } catch (error) {
      console.log("error while changing password--", error);
      toast.error(error?.response?.data?.message || "Update failed", {
        id: toastId,
      });
    }
  };

  /* ------------------------- Password strength ------------------------- */
  const strength = useMemo(() => {
    const v = passwords.new;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const labels = ["Very Weak", "Weak", "Good", "Strong", "Excellent"];
    const colors = ["#ef4444", "#f59e0b", "#22c55e", "#10b981", "#06b6d4"];
    return { score, label: labels[score], color: colors[score] };
  }, [passwords.new]);

  const rule = (ok) => (ok ? "text-emerald-300" : "text-white/50");

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <NeonReactorBackdrop />
      <FloatingParticles />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 170, damping: 18 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Pill tone="green">
              <Sparkles size={16} className="text-green-200" />
              SECURITY
            </Pill>
            <Pill tone="blue">
              <Shield size={16} className="text-blue-200" />
              IDENTITY
            </Pill>
            <Pill tone="pink">WALLET</Pill>
          </div>

          <motion.div
            initial={{ scale: 0.98, rotateX: 10, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <ModernHeading text="⚡ Password Settings" />
          </motion.div>
        </motion.div>

        {/* Card */}
        <NeonFrame className="p-5 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            {(["current", "new", "confirm"] as const).map((field) => (
              <motion.div
                key={field}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor={field}
                    className="text-[11px] tracking-[0.25em] uppercase text-white/65 font-black"
                  >
                    {field} password
                  </label>

                  {field === "new" && (
                    <div className="flex items-center gap-2 text-[11px] text-white/60 font-black tracking-wide">
                      <Shield size={14} className="text-green-200" />
                      <span className="text-white/55">Strength:</span>
                      <span style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center text-white/60 pointer-events-none">
                    <Lock size={18} />
                  </div>

                  <InputWrap>
                    <motion.input
                      type={showPasswords[field] ? "text" : "password"}
                      id={field}
                      name={field}
                      value={passwords[field]}
                      onChange={handleChange}
                      whileFocus={{ scale: 1.01 }}
                      className={cx(
                        "w-full bg-transparent px-4 py-3.5 pl-10 pr-10 outline-none",
                        "text-white/90 text-[13px] font-black"
                      )}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/55 hover:text-white transition"
                      aria-label="Toggle password visibility"
                    >
                      {showPasswords[field] ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </InputWrap>

                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                    initial={false}
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(16,185,129,0)",
                        "0 0 18px rgba(34,197,94,0.18)",
                        "0 0 0px rgba(16,185,129,0)",
                      ],
                    }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                  />
                </div>

                {/* Strength bar only for 'new' */}
                {field === "new" && (
                  <div className="mt-3">
                    <div className="h-3 rounded-full border border-white/10 bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(34,197,94,0.95), rgba(59,130,246,0.95), rgba(236,72,153,0.95), rgba(16,185,129,0.90))",
                        }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${(strength.score / 4) * 100}%` }}
                        transition={{ type: "spring", stiffness: 120, damping: 18 }}
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs">
                      <span className={rule(passwords.new.length >= 8)}>• 8+ chars</span>
                      <span className={rule(/[A-Z]/.test(passwords.new))}>• Uppercase</span>
                      <span className={rule(/[0-9]/.test(passwords.new))}>• Number</span>
                      <span className={rule(/[^A-Za-z0-9]/.test(passwords.new))}>• Symbol</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            <AnimatePresence>
              {error && (
                <motion.div
                  className="text-red-400 flex items-center mt-1"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle className="mr-2" size={18} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col-reverse gap-4 sm:flex-row justify-between items-center mt-8">
              <Link
                to={"/user/dashboard"}
                className="w-full sm:w-auto text-center text-white/80 py-3 px-6 rounded-2xl
                  border border-white/10 bg-white/5 hover:bg-white/10 transition font-black"
              >
                Cancel
              </Link>

              <motion.button
                type="submit"
                className="w-full sm:w-auto relative inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-black text-black
                  bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 hover:brightness-110
                  shadow-[0_10px_60px_rgba(34,197,94,0.18)]"
                initial={{ scale: 0.99 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCircle size={18} />
                Update Password
                <motion.span
                  className="absolute inset-0 rounded-2xl opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background:
                      "radial-gradient(120% 120% at 50% 10%, rgba(255,255,255,0.35), transparent 40%)",
                  }}
                />
              </motion.button>
            </div>
          </form>
        </NeonFrame>
      </div>
    </motion.div>
  );
};

export default UserChnagePassword;

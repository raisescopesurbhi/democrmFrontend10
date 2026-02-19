import { useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, UserCircle, UserRoundCog, KeyRound, Sparkles } from "lucide-react";
import { RiCustomerService2Line } from "react-icons/ri";
import UseUserHook from "../../hooks/user/UseUserHook";

/* =========================================================================
   💚💗💙 THEME: "NEON REACTOR / CIRCUIT RAVE" (applied)
   - Deep black base, neon blobs, circuit grid, particles, scan beam, vignette
   - NeonFrame: animated conic border + shimmer
   - Keep layout + workflow unchanged
   - DO NOT add ReactorRing
   ======================================================================= */

const cx = (...c) => c.filter(Boolean).join(" ");

const NeonReactorBackdrop = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        i,
        x: (i * 37) % 100,
        y: (i * 61) % 100,
        s: 1 + ((i * 11) % 3),
        d: 3 + ((i * 7) % 7),
        o: 0.16 + (((i * 9) % 45) / 100),
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-[#020307]" />

      {/* neon blobs */}
      <motion.div
        className="absolute -top-[26rem] -left-[26rem] h-[56rem] w-[56rem] rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(34,197,94,0.65), transparent 58%)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.22, 0.45, 0.22] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[28rem] -right-[28rem] h-[60rem] w-[60rem] rounded-full blur-3xl opacity-35"
        style={{
          background:
            "radial-gradient(circle at 70% 60%, rgba(59,130,246,0.62), transparent 60%)",
        }}
        animate={{ scale: [1.06, 0.95, 1.06], opacity: [0.18, 0.4, 0.18] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[48rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(236,72,153,0.55), transparent 62%)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -top-44 right-16 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-25"
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
      "relative rounded-[24px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl overflow-hidden",
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
    <div className="absolute inset-[1px] rounded-[23px] bg-[#04050b]/80" />
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

const popIn = {
  hidden: { opacity: 0, y: 10, scale: 0.98, rotateX: 8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    rotateX: -4,
    transition: { duration: 0.14 },    
  },
};

const item = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.05 * i, type: "spring", stiffness: 280, damping: 22 },
  }),
};

export const UserDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const { getReset } = UseUserHook();
  const navigate = useNavigate();
  const loggedUser = useSelector((s) => s.user.loggedUser);

  const displayName = useMemo(() => {
    const f = loggedUser?.firstName || "";
    const l = loggedUser?.lastName || "";
    return (f + " " + l).trim() || "You";
  }, [loggedUser]);

  const initials = useMemo(() => {
    const f = (loggedUser?.firstName || "U")[0];
    const l = (loggedUser?.lastName || "D")[0];
    return (f + (l || "")).toUpperCase();
  }, [loggedUser]);

  const menuItems = [
    { to: "/user/profile", icon: <UserCircle className="w-4 h-4" />, label: "Profile" },
    { to: "/user/account-details", icon: <UserRoundCog className="w-4 h-4" />, label: "Account Details" },
    { to: "/user/change-password", icon: <KeyRound className="w-4 h-4" />, label: "Change Password" },
  ];

  const logoutHandler = () => {
    getReset();
    navigate("/user/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (typeof onClose === "function") {
          onClose();
        }
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape" && typeof onClose === "function") {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);

  return (
    <div ref={dropdownRef} className="relative flex justify-center max-h-11">
      <AnimatePresence>
          <motion.div
            variants={popIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute z-50 top-12 w-[600px] perspective-[1200px]"
          >
            <NeonFrame className="min-h-[400px]">
              <NeonReactorBackdrop />

              {/* keep content/layout the same */}
              <div className="relative p-6">
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/70 to-cyan-500/70 grid place-items-center text-black font-bold text-xl shadow-lg">
                        {initials}
                      </div>
                      <motion.span
                        className="absolute -inset-1 rounded-2xl ring-2 ring-emerald-400/30"
                        animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.05, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center">
                        <Sparkles size={12} className="text-slate-950" />
                      </div>
                    </div>

                    {loggedUser?.email && (
                      <p className="text-xs text-emerald-300/80 text-center max-w-[100px] break-words">
                        {loggedUser.email}
                      </p>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col gap-40">
                    <div className="flex gap-3">
                      {menuItems.map((menuItem, idx) => (
                        <motion.div
                          key={menuItem.to}
                          custom={idx}
                          variants={item}
                          initial="hidden"
                          animate="visible"
                          className="flex-1"
                        >
                          <Link
                            to={menuItem.to}
                            className="group relative flex flex-col items-center gap-2 p-8 rounded-xl border-green-700/25 bg-green-500/10 hover:bg-green-500/15 hover:border-green-300/35 transition-all duration-300 h-full overflow-hidden"
                          >
                            {/* neon hover wash */}
                            <motion.div
                              className="absolute inset-0 opacity-0 pointer-events-none border-blue-300/25 bg-blue-500/10 hover:bg-blue-500/15 hover:border-blue-300/35"
                              style={{
                                background:
                                  "linear-gradient(135deg, rgba(34,197,94,0.18), rgba(59,130,246,0.14), rgba(236,72,153,0.14))",
                              }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.25 }}
                            />

                            <motion.div
                              className="relative text-emerald-300/90 group-hover:text-emerald-200"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              {menuItem.icon}
                            </motion.div>
                            <span className="relative text-xs text-white/80 group-hover:text-white font-medium text-center leading-tight">
                              {menuItem.label}
                            </span>

                            <motion.div
                              className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/0 via-blue-400/0 to-pink-400/0 group-hover:from-green-400/6 group-hover:via-blue-400/5 group-hover:to-pink-400/5 pointer-events-none"
                              initial={false}
                            />
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={logoutHandler}
                      className="w-full relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500/20 to-rose-600/20 hover:from-rose-500/30 hover:to-rose-600/30 border border-rose-400/30 hover:border-rose-400/50 text-rose-300 hover:text-rose-200 font-semibold text-sm transition-all duration-300 shadow-lg shadow-rose-500/10 overflow-hidden"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-400/0 via-yellow-300/10 to-rose-400/0"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.button>
                  </div>
                </div>
              </div>
            </NeonFrame>
          </motion.div>

      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;

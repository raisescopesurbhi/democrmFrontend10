import React, { useMemo } from "react";
import { LogOut, User, Shield, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const cx = (...c) => c.filter(Boolean).join(" ");

/* ===================== SAME THEME AS UserHeader ===================== */

const GridPattern = () => (
  <div className="absolute inset-0 opacity-25 pointer-events-none">
    <svg width="100%" height="100%">
      <defs>
        <pattern id="headerGrid_shared" width="28" height="28" patternUnits="userSpaceOnUse">
          <path
            d="M 28 0 L 0 0 0 28"
            fill="none"
            stroke="rgba(34, 197, 94, 0.18)"
            strokeWidth="0.6"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#headerGrid_shared)" />
    </svg>
  </div>
);

const StaticOrbs = () => (
  <>
    <div
      className="absolute -left-16 -top-20 h-56 w-56 rounded-full opacity-30 blur-3xl pointer-events-none"
      style={{
        background: "radial-gradient(circle, rgba(236,72,153,0.50) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-25 blur-3xl pointer-events-none"
      style={{
        background: "radial-gradient(circle, rgba(59,130,246,0.52) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-18 blur-3xl pointer-events-none"
      style={{
        background: "radial-gradient(circle, rgba(34,197,94,0.45) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute -top-8 right-10 h-48 w-48 rounded-full opacity-16 blur-3xl pointer-events-none"
      style={{
        background: "radial-gradient(circle, rgba(16,185,129,0.48) 0%, transparent 70%)",
      }}
    />
  </>
);

const StaticParticles = ({ count = 14 }) => {
  const particles = useMemo(() => {
    const rnd = (min, max) => Math.random() * (max - min) + min;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: rnd(2, 4.5),
      left: rnd(0, 100),
      top: rnd(0, 100),
      tint:
        i % 4 === 0
          ? "rgba(34, 197, 94, 0.34)"
          : i % 4 === 1
          ? "rgba(59, 130, 246, 0.30)"
          : i % 4 === 2
          ? "rgba(236, 72, 153, 0.28)"
          : "rgba(16, 185, 129, 0.26)",
      blur: rnd(0.8, 1.4),
      opacity: rnd(0.14, 0.55),
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: p.tint,
            filter: `blur(${p.blur}px)`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};

const Header = () => {
  const adminSiteConfig = useSelector((store) => store.admin.siteConfig);
  const userSiteConfig = useSelector((store) => store.user.siteConfig);
  const siteConfig = adminSiteConfig || userSiteConfig || {};
  const baseHeight = siteConfig.logoSize || 4;

  const navigate = useNavigate();
  const location = useLocation();

  const isSuperAdmin = location.pathname.startsWith("/s-admin");
  const isAdmin = location.pathname.startsWith("/admin");
  const isUser = location.pathname.startsWith("/user");

  const roleLabel = useMemo(() => {
    if (isSuperAdmin) return "Super Admin Console";
    if (isAdmin) return "Admin Console";
    if (isUser) return "User Panel";
    return "Portal";
  }, [isSuperAdmin, isAdmin, isUser]);

  const onLogout = () => {
    if (isSuperAdmin) {
      sessionStorage.removeItem("adminAuth");
      navigate("/s-admin/login", { replace: true });
      return;
    }
    if (isAdmin) {
      localStorage.removeItem("admin_password_ref");
      navigate("/admin/login", { replace: true });
      return;
    }
    if (isUser) {
      navigate("/user/login", { replace: true });
      return;
    }
    navigate("/user/login", { replace: true });
  };

  return (
    // ✅ keep layout same, but remove extra outer rounding/margins that cause visible gap
    <nav
      className={cx(
        "relative h-16 w-full text-white overflow-hidden",
        "border-b border-white/10",
        "bg-[#020307]",
        "m-0 p-0"
      )}
    >
      {/* SAME gradient layer as UserHeader */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 10% 0%, rgba(236,72,153,0.30) 0%, transparent 55%), radial-gradient(120% 80% at 100% 40%, rgba(59,130,246,0.28) 0%, transparent 55%), radial-gradient(120% 80% at 50% 100%, rgba(34,197,94,0.22) 0%, transparent 55%)",
        }}
      />
      <StaticOrbs />
      <GridPattern />
      <StaticParticles count={14} />

      {/* Noise (same) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E)",
        }}
      />

      {/* Bottom glow line (pulse only) */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-400/60 via-blue-400/55 to-transparent"
        animate={{ opacity: [0.25, 0.7, 0.25] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ✅ keep inner layout same; no extra bottom divider that adds visual spacing */}
      <div className="relative flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left: Brand */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            {siteConfig?.logo ? (
              <img
                src={siteConfig.logo}
                alt={siteConfig?.siteName || "Logo"}
                className="object-contain w-auto drop-shadow-[0_0_14px_rgba(236,72,153,0.18)]"
                style={{ height: `${baseHeight}rem` }}
              />
            ) : (
              <div
                className={cx(
                  "relative h-11 w-11 rounded-2xl grid place-items-center overflow-hidden",
                  "bg-black/50 ring-1 ring-white/10"
                )}
              >
                <div className="absolute inset-0 bg-[conic-gradient(from_90deg,rgba(34,197,94,0.55),rgba(59,130,246,0.55),rgba(236,72,153,0.55),rgba(16,185,129,0.55),rgba(34,197,94,0.55))] opacity-80" />
                <div className="absolute inset-[2px] rounded-[14px] bg-gradient-to-br from-white/10 to-white/0" />
                <motion.span className="relative z-10 animate-spin" aria-hidden="true">
                  <Sparkles className="text-white" size={20} />
                </motion.span>
              </div>
            )}

            <div className="min-w-0">
              <div className="truncate text-base sm:text-lg font-black tracking-wide">
                <span className="bg-gradient-to-r from-green-300 via-blue-300 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.30)]">
                  {siteConfig?.websiteName || siteConfig?.siteName || "CRM Portal"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-white/70">
                <motion.span className="animate-spin" aria-hidden="true">
                  <Shield size={14} className="text-emerald-200" />
                </motion.span>
                <span className="truncate">{roleLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="shrink-0 flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className={cx(
              "group inline-flex items-center gap-2 rounded-2xl px-3 py-2 overflow-hidden relative",
              "bg-black/45 border border-white/10 backdrop-blur-xl",
              "shadow-[0_0_18px_rgba(34,197,94,0.14)] hover:shadow-[0_0_24px_rgba(59,130,246,0.18)]",
              "transition-all duration-300"
            )}
            onClick={() => navigate("/s-admin/admin-information")}
            title="Profile"
          >
            <motion.span className="animate-spin" aria-hidden="true">
              <User size={18} className="text-emerald-200/85 group-hover:text-emerald-200" />
            </motion.span>
            <span className="hidden sm:inline text-xs font-bold text-white/80">Profile</span>

            <div className="absolute inset-0 bg-[conic-gradient(from_90deg,rgba(34,197,94,0.16),rgba(59,130,246,0.16),rgba(236,72,153,0.16),rgba(16,185,129,0.16),rgba(34,197,94,0.16))] opacity-55 pointer-events-none" />
            <div className="absolute inset-[1px] rounded-2xl bg-black/55 pointer-events-none" />
          </button>

          <button
            type="button"
            className={cx(
              "group inline-flex items-center gap-2 rounded-2xl px-3 py-2 overflow-hidden relative",
              "bg-black/45 border border-white/10 backdrop-blur-xl",
              "shadow-[0_0_18px_rgba(236,72,153,0.16)] hover:shadow-[0_0_26px_rgba(244,63,94,0.22)]",
              "transition-all duration-300"
            )}
            onClick={onLogout}
            title="Logout"
          >
            <motion.span className="animate-spin" aria-hidden="true">
              <LogOut size={18} className="text-rose-200/90 group-hover:text-rose-200" />
            </motion.span>
            <span className="hidden sm:inline text-xs font-bold text-white/80">Logout</span>

            <AnimatePresence>
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(236,72,153,0.14), rgba(59,130,246,0.12), rgba(34,197,94,0.10))",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.10, 0.26, 0.10] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </AnimatePresence>

            <div className="absolute inset-[1px] rounded-2xl bg-black/55 pointer-events-none" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;

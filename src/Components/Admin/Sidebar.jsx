import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation, NavLink,Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Menu as MenuIcon,
  X,
  LogOut,
  LayoutDashboard,
  Users,
  CreditCard,
  Banknote,
  Zap,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const cx = (...c) => c.filter(Boolean).join(" ");

/* =========================================================================
   ✅ EXACT THEME + GRADIENT + ANIMATIONS (same as UserSidebar you shared)
   - STATIC background layers (no background spin)
   - ONLY icons move (spin/float)
   - Same layout + same navigation/workflow
   ======================================================================= */

/* ===================== Background Layers (STATIC) ===================== */

// ✅ STATIC particles (no animation)
const StaticParticles = ({ count = 18 }) => {
  const particles = useMemo(() => {
    const rnd = (min, max) => Math.random() * (max - min) + min;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: rnd(2, 5),
      left: rnd(0, 100),
      top: rnd(0, 100),
      tint:
        i % 4 === 0
          ? "rgba(34, 197, 94, 0.38)"
          : i % 4 === 1
          ? "rgba(59, 130, 246, 0.32)"
          : i % 4 === 2
          ? "rgba(236, 72, 153, 0.30)"
          : "rgba(16, 185, 129, 0.28)",
      blur: rnd(0.8, 1.6),
      opacity: rnd(0.15, 0.55),
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden">
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

const GridPattern = ({ id = "grid-admin-sidebar" }) => (
  <div className="absolute inset-0 opacity-25">
    <svg width="100%" height="100%">
      <defs>
        <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
          <path
            d="M 28 0 L 0 0 0 28"
            fill="none"
            stroke="rgba(34, 197, 94, 0.18)"
            strokeWidth="0.6"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  </div>
);

// ✅ STATIC orbs (no rotate/scale animations)
const StaticOrbs = () => (
  <>
    <div
      className="absolute -left-20 -top-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
      style={{
        background:
          "radial-gradient(circle, rgba(236,72,153,0.50) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full opacity-25 blur-3xl"
      style={{
        background:
          "radial-gradient(circle, rgba(59,130,246,0.52) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
      style={{
        background:
          "radial-gradient(circle, rgba(34,197,94,0.45) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute -top-10 right-8 h-56 w-56 rounded-full opacity-18 blur-3xl"
      style={{
        background:
          "radial-gradient(circle, rgba(16,185,129,0.48) 0%, transparent 70%)",
      }}
    />
  </>
);

/* ===================== Menu Building Blocks ===================== */

// ✅ Only icons move (spin/float). No background spinning anywhere else.  
const IconHalo = () => (
  <span
    className={cx(
      "absolute inset-0 rounded-2xl opacity-85",
      "bg-[conic-gradient(from_90deg,rgba(34,197,94,0.65),rgba(59,130,246,0.65),rgba(236,72,153,0.62),rgba(16,185,129,0.60),rgba(34,197,94,0.65))]",
      "blur-[1px]"
    )}
  />
);

const AnimatedIcon = ({ Icon, active }) => {
  return (
    <span
      className={cx(
        "relative grid place-items-center h-10 w-10 rounded-2xl overflow-hidden",
        active ? "bg-black/55" : "bg-black/40",
        "ring-1 ring-white/10"
      )}
      style={{
        boxShadow: active
          ? "0 0 18px rgba(34,197,94,0.22)"
          : "0 0 10px rgba(59,130,246,0.12)",
      }}
    >
      <IconHalo />
      <div className="absolute inset-[2px] rounded-[14px] bg-gradient-to-br from-white/10 to-white/0" />

      {/* ✅ Only the icon moves */}
      <motion.div
        className="relative z-10 grid place-items-center"
        animate={{ y: [0, -1.8, 0], rotate: [0, 8, -8, 0] }}
        transition={{
          duration: active ? 1.5 : 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Icon
          size={18}
          className={cx(
            "transition-colors",
            active ? "text-emerald-200" : "text-cyan-200/80"
          )}
          strokeWidth={2.5}
        />
      </motion.div>
    </span>
  );
};

const isActivePath = (pathname, path) =>
  pathname === path || pathname.startsWith(path + "/");

const Item = ({ to, label, onClick, active }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={() =>
      cx(
        "relative flex items-center gap-3 rounded-2xl px-3 py-2.5 transition",
        active
          ? "bg-gradient-to-r from-emerald-900/45 via-blue-900/25 to-pink-900/35"
          : "hover:bg-gradient-to-r hover:from-green-950/30 hover:via-blue-950/20 hover:to-pink-950/25"
      )
    }
  >
    <span
      className={cx(
        "h-2 w-2 rounded-full",
        active
          ? "bg-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.7)]"
          : "bg-emerald-400/30"
      )}
    />
    <span
      className={cx(
        "truncate text-[13px] font-black tracking-wide",
        active ? "text-white" : "text-white/75"
      )}
    >
      {label}
    </span>

    {active && (
      <span className="ml-auto inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <Zap size={12} className="text-emerald-200" />
      </span>
    )}
  </NavLink>
);

/* ===================== Modules (UNCHANGED) ===================== */

const modules = [
  { name: "Dashboard", path: "/admin/dashboard" },
  {
    name: "Manage Users",
    path: "/admin/manage-users/all-users",
    icon: <Users className="w-5 h-5" />,
    children: [
      { name: "KYC Updates", path: "/admin/kyc-users" },
      { name: "All Users", path: "/admin/manage-users/all-users" },
    ],
  },
  {
    name: "Deposits",
    path: "/admin/deposit/all",
    icon: <CreditCard className="w-5 h-5" />,
    children: [{ name: "All Deposits", path: "/admin/deposit/all" }],
  },
  {
    name: "Withdrawals",
    path: "/admin/withdrawal/all",
    icon: <Banknote className="w-5 h-5" />,
    children: [{ name: "All Withdrawals", path: "/admin/withdrawal/all" }],
  },
  {
    name: "IB Withdrawals",
    path: "/admin/ibwithdrawal/all",
    icon: <Banknote className="w-5 h-5" />,
    children: [{ name: "All IB-Withdrawals", path: "/admin/ib-withdrawal/all" }],
  },
  { name: "Payment Getaways", path: "/admin/getway/manual", icon: <CreditCard className="w-5 h-5" /> },
   { name: "IB Zone", path: "/admin/ib-zone", icon: <CreditCard className="w-5 h-5" /> },


  
];

/* ===================== SidebarContent (LAYOUT UNCHANGED) ===================== */

const SidebarContent = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const parent = modules.find(
      (m) =>
        m.children &&
        m.children.some((c) => location.pathname.startsWith(c.path))
    );
    setOpenMenu(parent?.name || null);
  }, [location.pathname]);

  const logout = () => {
    try {
      localStorage.removeItem("admin_password_ref");
    } catch {}
    navigate("/admin/login", { replace: true });
    onNavigate?.();
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* ✅ EXACT STATIC BACKGROUND THEME (same as UserSidebar) */}
      <div className="absolute inset-0 bg-[#020307]" />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(120% 80% at 10% 0%, rgba(236,72,153,0.30) 0%, transparent 55%), radial-gradient(120% 80% at 100% 40%, rgba(59,130,246,0.28) 0%, transparent 55%), radial-gradient(120% 80% at 50% 100%, rgba(34,197,94,0.22) 0%, transparent 55%)",
        }}
      />
      <StaticOrbs />
      <GridPattern id="grid-admin-sidebar" />
      <StaticParticles count={18} />

      {/* Noise (static) */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E)",
        }}
      />

      {/* Border glow (static) */}
      <div className="absolute inset-0 ring-1 ring-emerald-500/18" />
      <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-green-400 via-blue-400 to-transparent opacity-70" />

      {/* CONTENT */}
      <div className="relative h-full flex flex-col">
        {/* Brand */}
        <div className="px-4 pt-5 pb-4">
          <Link
            to="/admin/manage-users/all-users"
            onClick={onNavigate}
            className="group block"
          >
            <div className="rounded-3xl p-[1px] bg-gradient-to-r from-green-400/35 via-blue-500/20 to-pink-500/25">
              <div className="rounded-3xl border border-white/10 bg-black/55 backdrop-blur-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 rounded-2xl grid place-items-center bg-black/50 ring-1 ring-white/10 overflow-hidden">
                    <div className="absolute inset-0 bg-[conic-gradient(from_90deg,rgba(34,197,94,0.55),rgba(59,130,246,0.55),rgba(236,72,153,0.55),rgba(16,185,129,0.55),rgba(34,197,94,0.55))] opacity-80" />
                    <div className="absolute inset-[2px] rounded-[14px] bg-gradient-to-br from-white/10 to-white/0" />
                    {/* ✅ only icon moves */}
                    <motion.span className="relative z-10">
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="grid place-items-center"
                      >
                        <LayoutDashboard size={18} className="text-white" />
                      </motion.span>
                    </motion.span>
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-sm font-black tracking-wide">
                      <span className="bg-gradient-to-r from-green-300 via-blue-300 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.30)]">
                        Admin Panel
                      </span>
                    </div>
                    <div className="text-[11px] text-white/65 font-medium">
                      Cyber Console • Secure
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <div className="mt-4 h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-green-400/60 via-blue-400/55 to-transparent opacity-70" />
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="space-y-2">
            {modules.map((mod) => {
              const active =
                isActivePath(location.pathname, mod.path) ||
                mod.children?.some((c) => isActivePath(location.pathname, c.path));

              const open = openMenu === mod.name || active;

              return (
                <div key={mod.name} className="mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (mod.children?.length)
                        setOpenMenu((p) => (p === mod.name ? null : mod.name));
                      else {
                        navigate(mod.path);
                        onNavigate?.();
                      }
                    }}
                    className={cx(
                      "w-full flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition",
                      active
                        ? "bg-gradient-to-r from-emerald-900/45 via-blue-900/25 to-pink-900/35 ring-1 ring-white/10"
                        : "hover:bg-gradient-to-r hover:from-green-950/30 hover:via-blue-950/20 hover:to-pink-950/25"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cx(
                          "h-10 w-10 rounded-2xl grid place-items-center border",
                          active
                            ? "bg-black/55 border-white/10"
                            : "bg-black/40 border-white/10"
                        )}
                        style={{
                          boxShadow: active
                            ? "0 0 18px rgba(34,197,94,0.18)"
                            : "0 0 10px rgba(59,130,246,0.10)",
                        }}
                      >
                        {/* ✅ same animated icon style as UserSidebar */}
                        <AnimatedIcon
                          Icon={() => mod.icon}
                          active={active}
                        />
                      </span>

                      <span
                        className={cx(
                          "text-[13px] font-black tracking-wide",
                          active ? "text-white" : "text-white/75"
                        )}
                      >
                        {mod.name}
                      </span>
                    </div>

                    {mod.children?.length ? (
                      open ? (
                        <ChevronDown
                          size={18}
                          className="text-white/55"
                        />
                      ) : (
                        <ChevronRight
                          size={18}
                          className="text-white/55"
                        />
                      )
                    ) : null}
                  </button>

                  {mod.children?.length ? (
                    <div
                      className={cx(
                        "ml-3 mt-2 overflow-hidden transition-all duration-300",
                        open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="space-y-2 pl-3 border-l border-white/10">
                        {mod.children.map((c) => (
                          <Item
                            key={c.path}
                            to={c.path}
                            label={c.name}
                            onClick={onNavigate}
                            active={isActivePath(location.pathname, c.path)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-5">
          <button
            type="button"
            onClick={logout}
            className={cx(
              "w-full rounded-2xl px-4 py-3 font-black tracking-wide text-[13px]",
              "bg-gradient-to-r from-pink-500/15 to-red-500/10",
              "border border-pink-500/20",
              "text-white/85 hover:text-white",
              "shadow-[0_0_22px_rgba(236,72,153,0.14)] hover:shadow-[0_0_28px_rgba(236,72,153,0.20)]",
              "transition"
            )}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <LogOut size={18} />
              Logout
            </span>
          </button>

          <div className="mt-3 flex items-center justify-between text-[11px] text-white/55 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="font-black text-white">v2.0</span>
              <span className="text-white/35">Beta</span>
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="relative h-2.5 w-2.5">
                <span className="absolute inset-0 rounded-full bg-green-400 blur-sm" />
                <span className="absolute inset-0 rounded-full bg-emerald-300 opacity-80" />
              </span>
              <span className="font-black text-white">Online</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===================== Sidebar (LAYOUT UNCHANGED) ===================== */

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (!mobileOpen) return;
      if (panelRef.current && !panelRef.current.contains(e.target))
        setMobileOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={cx(
          "inline-flex  md:hidden items-center justify-center ",
          "h-11 w-11 rounded-2xl",
          "bg-black/60 border border-white/10 backdrop-blur-xl",
          "shadow-[0_0_26px_rgba(59,130,246,0.16)]",
          "hover:shadow-[0_0_34px_rgba(236,72,153,0.18)] transition "
        )}
        aria-label="Open sidebar"
      >                                                            
        <MenuIcon className="text-white/85" size={20} />
      </button>

      {/* Desktop sidebar */}
      {/* <aside className={cx("hidden md:block", "w-[280px] shrink-0","sticky top-0 self-start")}>
        <div
          className={cx(
            "h-[calc(100vh-0px)]",
            "rounded-3xl overflow-hidden",
            "border border-white/10",
            "bg-black/45 backdrop-blur-2xl",
            "shadow-[0_0_60px_rgba(34,197,94,0.10)]"
          )}
        >
          <SidebarContent />
        </div>
      </aside> */}
      {/* Desktop sidebar */}
<aside className={cx("hidden md:block", "w-[280px] shrink-0", "relative")}>
  <div
    className={cx(
      "fixed top-0",            // ✅ keeps it static
      "w-[280px]",              // ✅ same width
      "h-[calc(100vh-0px)]",    // ✅ same height logic as your current code
      "rounded-3xl overflow-hidden",
      "border border-white/10",
      "bg-black/45 backdrop-blur-2xl",
      "shadow-[0_0_60px_rgba(34,197,94,0.10)]"
    )}
  >
    <SidebarContent />
  </div>
</aside>


      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <aside
            ref={panelRef}
            className={cx(
              "fixed left-3 top-3 bottom-3 z-[90] w-[86vw] max-w-[320px]",
              "rounded-3xl overflow-hidden",
              "border border-white/10",
              "bg-black/55 backdrop-blur-2xl",
              "shadow-[0_0_70px_rgba(34,197,94,0.14)]"
            )}
          >
            <div className="absolute right-3 top-3 z-20">
              <button
                className="h-10 w-10 rounded-2xl grid place-items-center bg-white/5 border border-white/10"
                onClick={() => setMobileOpen(false)}
                aria-label="Close sidebar"
              >
                <X size={18} className="text-white/85" />
              </button>
            </div>

            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;

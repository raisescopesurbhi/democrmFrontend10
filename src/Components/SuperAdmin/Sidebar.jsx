import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Layers,
  CreditCard,
  Banknote,
  LayoutDashboard,
  Settings,
  UserCog,
  Zap,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const cx = (...c) => c.filter(Boolean).join(" ");

/* ===================== Background Layers (STATIC like UserSidebar) ===================== */

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

const StaticOrbs = () => (
  <>
    <div
      className="absolute -left-20 -top-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
      style={{
        background: "radial-gradient(circle, rgba(236,72,153,0.50) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full opacity-25 blur-3xl"
      style={{
        background: "radial-gradient(circle, rgba(59,130,246,0.52) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
      style={{
        background: "radial-gradient(circle, rgba(34,197,94,0.45) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute -top-10 right-8 h-56 w-56 rounded-full opacity-18 blur-3xl"
      style={{
        background: "radial-gradient(circle, rgba(16,185,129,0.48) 0%, transparent 70%)",
      }}
    />
  </>
);

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
        boxShadow: active ? "0 0 18px rgba(34,197,94,0.22)" : "0 0 10px rgba(59,130,246,0.12)",
      }}
    >
      <IconHalo />
      <div className="absolute inset-[2px] rounded-[14px] bg-gradient-to-br from-white/10 to-white/0" />
      <motion.div
        className="relative z-10 grid place-items-center"
        animate={{ y: [0, -1.8, 0], rotate: [0, 8, -8, 0] }}
        transition={{ duration: active ? 1.5 : 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon
          size={18}
          className={cx("transition-colors", active ? "text-emerald-200" : "text-cyan-200/80")}
          strokeWidth={2.5}
        />
      </motion.div>
    </span>
  );
};

/* ===================== Component ===================== */

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenus, setOpenMenus] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelRef = useRef(null);

  const modules = useMemo(
    () => [
      {
        name: "Account Configuration",
        key: "account-config",
        icon: CreditCard,
        path: "/s-admin/account",
        children: [
          { name: "Platform", path: "/s-admin/Platform", icon: Layers },
          { name: "Group", path: "/s-admin/Group", icon: Banknote },
          {
            name: "Configure Account Types",
            path: "/s-admin/configure-account-types",
            icon: CreditCard,
          },
        ],
      },
      {
        name: "Site Configuration",
        key: "site-config",
        icon: Settings,
        path: "/s-admin/site-configuration",
      },
      {
        name: "Admin Info",
        key: "admin-info",
        icon: UserCog,
        path: "/s-admin/admin-information",
      },
      {
        name: "UI Settings",
        key: "ui-settings",
        icon: UserCog,
        path: "/s-admin/ui-settings",
      },
    ],
    []
  );

  const toggleMenu = (key) => setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  const isActivePath = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  useEffect(() => {
    const next = {};
    modules.forEach((m) => {
      if (m.children?.some((c) => isActivePath(c.path))) next[m.key] = true;
    });
    setOpenMenus((prev) => ({ ...prev, ...next }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const onDown = (e) => {
      if (!mobileOpen) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) setMobileOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [mobileOpen]);

  const logout = () => {
    sessionStorage.removeItem("adminAuth");
    navigate("/s-admin/login", { replace: true });
  };

  const Item = ({ to, Icon, label, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cx(
          "relative block rounded-2xl px-3 py-2.5 mb-1.5 overflow-hidden transition-all duration-300",
          isActive
            ? "bg-gradient-to-r from-emerald-900/45 via-blue-900/25 to-pink-900/35"
            : "hover:bg-gradient-to-r hover:from-green-950/30 hover:via-blue-950/20 hover:to-pink-950/25"
        )
      }
    >
      {({ isActive }) => (
        <div className="flex items-center gap-3.5 relative">
          {isActive && (
            <div className="absolute -left-3 top-0 bottom-0 w-1 rounded-r-full bg-gradient-to-b from-green-400 via-blue-400 to-pink-500" />
          )}

          <AnimatedIcon Icon={Icon} active={isActive} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={cx(
                  "text-[13px] font-black tracking-wide truncate",
                  isActive ? "text-white" : "text-white/75"
                )}
              >
                {label}
              </span>

              {isActive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-green-500/30 via-blue-500/25 to-pink-500/25 px-2.5 py-0.5 text-[10px] font-extrabold text-white ring-1 ring-white/20 backdrop-blur-sm">
                  <TrendingUp size={11} className="text-white" />
                  Active
                </span>
              )}
            </div>
          </div>

          {isActive && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <Zap size={12} className="text-emerald-200" />
            </span>
          )}
        </div>
      )}
    </NavLink>
  );

  const SidebarContent = ({ onNavigate }) => (
    <div className="relative h-full w-full overflow-hidden text-white">
      {/* STATIC layered background */}
      <div className="absolute inset-0 bg-[#020307]" />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(120% 80% at 10% 0%, rgba(236,72,153,0.30) 0%, transparent 55%), radial-gradient(120% 80% at 100% 40%, rgba(59,130,246,0.28) 0%, transparent 55%), radial-gradient(120% 80% at 50% 100%, rgba(34,197,94,0.22) 0%, transparent 55%)",
        }}
      />
      <StaticOrbs />
      <GridPattern id="grid-sadmin-sidebar" />
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

      {/* Content */}
      <div className="relative h-full flex flex-col px-3.5 py-5">
        {/* Brand */}
        <div className="mb-4 px-1">
          <div className="group flex items-center gap-3">
            <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-black/50 ring-1 ring-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-[conic-gradient(from_90deg,rgba(34,197,94,0.55),rgba(59,130,246,0.55),rgba(236,72,153,0.55),rgba(16,185,129,0.55),rgba(34,197,94,0.55))] opacity-80" />
              <div className="absolute inset-[2px] rounded-[14px] bg-gradient-to-br from-white/10 to-white/0" />
              <motion.span
                className="relative z-10"
                animate={{ y: [0, -1.8, 0], rotate: [0, 8, -8, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <LayoutDashboard className="text-white" size={20} />
              </motion.span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-black tracking-wide">
                <span className="bg-gradient-to-r from-green-300 via-blue-300 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.30)]">
                  Super Admin
                </span>
              </div>
              <div className="truncate text-[11px] text-white/65 font-medium">
                Cyber Console • Secure
              </div>
            </div>
          </div>

          <div className="mt-4 h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-green-400/60 via-blue-400/55 to-transparent opacity-70" />
        </div>

        {/* Nav */}
        <div className="user-custom-scrollbar relative flex-1 overflow-y-auto pb-20 pr-1">
          <div className="space-y-2">
            {modules.map((mod) => {
              const active =
                isActivePath(mod.path) || mod.children?.some((c) => isActivePath(c.path));

              const isOpen = !!openMenus[mod.key] || active;
              const ModIcon = mod.icon;

              return (
                <div key={mod.key} className="mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (mod.children?.length) toggleMenu(mod.key);
                      else {
                        navigate(mod.path);
                        onNavigate?.();
                      }
                    }}
                    className={cx(
                      "w-full flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition-all duration-300",
                      active
                        ? "bg-gradient-to-r from-emerald-900/45 via-blue-900/25 to-pink-900/35 ring-1 ring-white/10"
                        : "hover:bg-gradient-to-r hover:from-green-950/30 hover:via-blue-950/20 hover:to-pink-950/25"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <AnimatedIcon Icon={ModIcon} active={active} />
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
                      isOpen ? (
                        <ChevronDown size={18} className="text-white/70" />
                      ) : (
                        <ChevronRight size={18} className="text-white/70" />
                      )
                    ) : null}
                  </button>

                  {mod.children?.length ? (
                    <div
                      className={cx(
                        "ml-3 mt-2 overflow-hidden transition-all duration-300",
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="space-y-2 pl-3 border-l border-white/10">
                        {mod.children.map((c) => (
                          <Item
                            key={c.path}
                            to={c.path}
                            Icon={c.icon}
                            label={c.name}
                            onClick={onNavigate}
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

        {/* Footer actions */}
        <div className="relative mt-3 border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={logout}
            className={cx(
              "w-full rounded-2xl px-4 py-3 font-black tracking-wide text-[13px]",
              "bg-black/40 text-white ring-1 ring-white/15 backdrop-blur-xl",
              "shadow-[0_0_36px_rgba(236,72,153,0.18)] hover:shadow-[0_0_44px_rgba(236,72,153,0.25)]",
              "transition-all duration-300 overflow-hidden"
            )}
          >
            <span className="relative z-10 inline-flex items-center justify-center gap-2">
              <LogOut size={18} />
              Logout
              <motion.span
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles size={16} />
              </motion.span>
            </span>
          </button>

          <div className="mt-3 flex items-center justify-between px-2 text-[11px] text-white/55 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="font-black text-white">v2</span>
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

  return (
    <>
      {/* Mobile Toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={cx(
          "inline-flex md:hidden items-center justify-center",
          "h-11 w-11 rounded-2xl",
          "bg-black/60 border border-white/15 backdrop-blur-xl",
          "shadow-[0_0_26px_rgba(34,197,94,0.18)]",
          "hover:shadow-[0_0_34px_rgba(34,197,94,0.28)] transition"
        )}
        aria-label="Open sidebar"
      >
        <Menu className="text-white" size={20} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-[272px] shrink-0">
        <div className="h-screen rounded-3xl overflow-hidden border border-white/10 bg-black/45 backdrop-blur-2xl shadow-[0_0_70px_rgba(34,197,94,0.10)]">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              ref={panelRef}
              className="fixed left-0 top-0 z-[90] h-screen w-[86vw] max-w-[320px] md:hidden"
              initial={{ x: -360, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -360, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <div className="absolute right-3 top-3 z-20">
                <button
                  className="h-10 w-10 rounded-2xl grid place-items-center bg-white/5 border border-white/15"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close sidebar"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>

              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

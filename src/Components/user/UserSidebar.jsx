// UserSidebar.jsx
import { useEffect, useMemo, useRef, useState, useId, useCallback } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCog,
  ArrowLeftRight,
  WalletCards,
  Banknote,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Zap,
  TrendingUp,
  ChevronDown,
  Layers,
  KeyRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { handleToggleSidebar } from "../../redux/user/userSlice";
import UseUserHook from "../../hooks/user/UseUserHook";
import { backendApi } from "../../utils/apiClients";

/* ===================== Helpers ===================== */
const cx = (...c) => c.filter(Boolean).join(" ");

// exact OR nested route ( /base/... )
const pathMatch = (base, path) => path === base || path.startsWith(`${base}/`);

/* ===================== Background Layers (STATIC) ===================== */

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

const GridPattern = ({ patternId }) => (
  <div className="absolute inset-0 opacity-25">
    <svg width="100%" height="100%">
      <defs>
        <pattern id={patternId} width="28" height="28" patternUnits="userSpaceOnUse">
          <path
            d="M 28 0 L 0 0 0 28"
            fill="none"
            stroke="rgba(34, 197, 94, 0.18)"
            strokeWidth="0.6"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
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
      className="absolute -top-10 right-8 h-56 w-56 rounded-full opacity-20 blur-3xl"
      style={{
        background: "radial-gradient(circle, rgba(16,185,129,0.48) 0%, transparent 70%)",
      }}
    />
  </>
);

/* ===================== Menu Building Blocks ===================== */

const IconHalo = () => (
  <span
    className={cx(
      "absolute inset-0 rounded-2xl opacity-85",
      "bg-[conic-gradient(from_90deg,rgba(34,197,94,0.65),rgba(59,130,246,0.65),rgba(236,72,153,0.62),rgba(16,185,129,0.60),rgba(34,197,94,0.65))]",
      "blur-[1px]"
    )}
  />
);

const AnimatedIcon = ({ Icon, active }) => (
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

const MenuItem = ({ icon: Icon, label, link, onClick }) => (
  <NavLink
    to={link}
    onClick={onClick}
    className={({ isActive }) =>
      cx(
        "relative block rounded-2xl px-3 py-2.5 mb-1.5 overflow-hidden",
        "transition-all duration-300",
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
            <span className={cx("text-[13px] font-black tracking-wide truncate", isActive ? "text-white" : "text-white/75")}>
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

/* ===================== Expandable Group ===================== */

const ExpandHeader = ({ icon: Icon, label, open, active, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={cx(
      "w-full text-left relative block rounded-2xl px-3 py-2.5 mb-1.5 overflow-hidden",
      "transition-all duration-300",
      active
        ? "bg-gradient-to-r from-emerald-900/45 via-blue-900/25 to-pink-900/35"
        : "hover:bg-gradient-to-r hover:from-green-950/30 hover:via-blue-950/20 hover:to-pink-950/25"
    )}
  >
    <div className="flex items-center gap-3.5 relative">
      {active && (
        <div className="absolute -left-3 top-0 bottom-0 w-1 rounded-r-full bg-gradient-to-b from-green-400 via-blue-400 to-pink-500" />
      )}

      <AnimatedIcon Icon={Icon} active={active} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={cx("text-[13px] font-black tracking-wide truncate", active ? "text-white" : "text-white/75")}>
            {label}
          </span>

          {active && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-green-500/30 via-blue-500/25 to-pink-500/25 px-2.5 py-0.5 text-[10px] font-extrabold text-white ring-1 ring-white/20 backdrop-blur-sm">
              <TrendingUp size={11} className="text-white" />
              Active
            </span>
          )}
        </div>
      </div>

      <motion.span
        className="grid place-items-center h-9 w-9 rounded-2xl bg-black/35 ring-1 ring-white/10"
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <ChevronDown size={16} className={cx(active ? "text-emerald-200" : "text-white/60")} />
      </motion.span>
    </div>
  </button>
);

const SubItem = ({ to, label, icon: Icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cx(
        "group relative ml-3 mr-1 mb-1.5 flex items-center gap-2.5 rounded-2xl px-3 py-2",
        "border border-white/0 transition-all duration-300",
        isActive ? "bg-white/7 border-emerald-400/18" : "hover:bg-white/5 hover:border-white/10"
      )
    }
  >
    {({ isActive }) => (
      <>
        <span className="relative h-2.5 w-2.5">
          <span className={cx("absolute inset-0 rounded-full", isActive ? "bg-emerald-400" : "bg-white/25 group-hover:bg-white/35")} />
          {isActive && <span className="absolute inset-0 rounded-full bg-emerald-300 blur-sm opacity-70" />}
        </span>

        <motion.span
          className="grid h-8 w-8 place-items-center rounded-xl bg-black/35 ring-1 ring-white/10"
          animate={{ y: isActive ? [0, -1.2, 0] : 0 }}
          transition={{ duration: 1.6, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
        >
          <Icon size={16} className={cx(isActive ? "text-emerald-200" : "text-cyan-200/70")} strokeWidth={2.5} />
        </motion.span>

        <span className={cx("text-[12px] font-extrabold tracking-wide", isActive ? "text-white" : "text-white/70")}>{label}</span>

        {isActive && (
          <span className="ml-auto inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <Zap size={12} className="text-emerald-200" />
          </span>
        )}
      </>
    )}
  </NavLink>
);

const ExpandGroup = ({ icon, label, items, onNavClick }) => {
  const location = useLocation();

  const isGroupRouteActive = useMemo(() => {
    return items.some((it) => pathMatch(it.to, location.pathname));
  }, [items, location.pathname]);

  const [open, setOpen] = useState(() => isGroupRouteActive);

  useEffect(() => {
    if (isGroupRouteActive) setOpen(true);
  }, [isGroupRouteActive]);

  return (
    <div className="mb-1">
      <ExpandHeader icon={icon} label={label} open={open} active={isGroupRouteActive} onToggle={() => setOpen((v) => !v)} />

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="subitems"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-1">
              {items.map((it) => (
                <SubItem key={it.to} to={it.to} label={it.label} icon={it.icon} onClick={onNavClick} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ===================== Component ===================== */

export default function UserSidebar({ siteConfig: siteConfigProp }) {
  const dispatch = useDispatch();
  const patternId = useId();
  const { getReset } = UseUserHook();
  const loggedUser = useSelector((state) => state.user.loggedUser);
  const siteConfigRedux = useSelector((state) => state.user.siteConfig);
  const siteConfig = siteConfigProp || siteConfigRedux;

  const [configurations, setConfigurations] = useState([]);
  const [configLoading, setConfigLoading] = useState(false);
  const [togglesReady, setTogglesReady] = useState(false);

  const Blur = useSelector((state) => state.user.isBlur);
  const isSidebarOpen = useSelector((state) => state.user.isSidebarOpen);
  const creatingMt5 = useSelector((state) => state.user.creatingMt5);  

  const navigate = useNavigate();

  const closeSidebar = () => dispatch(handleToggleSidebar(false));

  const logoutHandler = () => {
    getReset();
    closeSidebar();
    navigate("/user/login");
  };

  const fetchDetails = async () => {
    try {
      setConfigLoading(true);
      const response = await backendApi.get("/client/get-toogle");
      setConfigurations(Array.isArray(response?.data?.data) ? response.data.data : []);
    } catch (e) {
      console.log(e);
      setConfigurations([]);
    } finally {
      setConfigLoading(false);
      setTogglesReady(true);
    }
  };

  // Better responsive detection (matchMedia) + still reacts to resize
  const [isSmallScreen, setIsSmallScreen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(max-width: 767px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = (e) => setIsSmallScreen(e.matches);
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);
    setIsSmallScreen(mql.matches);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, []);

  const sidebarRef = useRef(null);
  const baseHeight = siteConfig?.logoSize || 3.5;

  // Close on outside click (mobile only)
  useEffect(() => {
    if (!isSmallScreen || !isSidebarOpen) return;
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) closeSidebar();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen, isSmallScreen]);

  // ESC + body scroll lock (mobile only)
  useEffect(() => {
    if (!isSmallScreen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeSidebar();
    };

    if (isSidebarOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isSidebarOpen, isSmallScreen]);

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===================== ✅ TOGGLE MAP (DYNAMIC) ===================== */
  const toggleMap = useMemo(() => {
    const norm = (v) => String(v || "").trim().toLowerCase();
    return new Map((configurations || []).map((c) => [norm(c?.name), Boolean(c?.enabled)]));
  }, [configurations]);

  // ✅ IMPORTANT: while toggles not ready, render NOTHING (prevents "flash" of enabled menu)
  const isEnabled = useCallback(
    (toggleName, defaultValue = false) => {
      if (!togglesReady) return false;

      const key = String(toggleName || "").trim().toLowerCase();
      if (!toggleMap.has(key)) return defaultValue; // if missing from API => fallback
      return Boolean(toggleMap.get(key));
    },
    [toggleMap, togglesReady]
  );

  // Trades are controlled by "Open Trade" and "Close Trade"
  const openTradeEnabled = isEnabled("Open Trade", true);
  const closeTradeEnabled = isEnabled("Close Trade", true);
  const tradesEnabled = openTradeEnabled || closeTradeEnabled;

  const tradesLink =
    openTradeEnabled && closeTradeEnabled
      ? "/user/trades"
      : openTradeEnabled
      ? "/user/trades/open-trade"
      : "/user/trades/close-trade";

  /* ===================== ✅ MENU BLOCKS (FULLY DYNAMIC) ===================== */
  const menuBlocks = useMemo(() => {
    if (!togglesReady) return [];

    // Referral sub-items (each controlled)
    const referralItems = [
      isEnabled("IB-Overview", true) && { to: "/user/affiliate", label: "IB-Overview", icon: Layers },
      isEnabled("IB-Commission", true) && { to: "/user/affiliate/commission", label: "IB-Commission", icon: UserCog },
      isEnabled("IB-Withdrawl", true) && { to: "/user/affiliate/withdrawl", label: "IB-Withdrawl", icon: UserCog },
      isEnabled("IB-Withdrawl-History", true) && {
        to: "/user/affiliate/UserAffiliateWithdrawalHistory",
        label: "IB-Withdrawl-History",
        icon: UserCog,
      },
      isEnabled("Ib-Details", true) && { to: "/user/affiliate/UserAffiliateIbDetails", label: "Ib-Details", icon: UserCog },
    ].filter(Boolean);

    const referralGroupEnabled = isEnabled("Referral", true) && referralItems.length > 0;

    // Setting sub-items (each controlled)
    const settingItems = [
      isEnabled("Profile", true) && { to: "/user/profile", label: "Profile", icon: Layers },
      isEnabled("Account Details", true) && { to: "/user/account-details", label: "Account Details", icon: UserCog },
      isEnabled("Change Password", true) && { to: "/user/change-password", label: "Change Password", icon: UserCog },
    ].filter(Boolean);

    const settingGroupEnabled = isEnabled("Setting", true) && settingItems.length > 0;

    const blocks = [
      isEnabled("Dashboard", true) && { type: "item", icon: ShieldCheck, label: "Dashboard", link: "/user/dashboard" },
      isEnabled("Account", true) && { type: "item", icon: ShieldCheck, label: "Account", link: "/user/challenges" },
      isEnabled("Deposit", true) && { type: "item", icon: WalletCards, label: "Deposit", link: "/user/deposit" },
      isEnabled("Withdraw", true) && { type: "item", icon: Banknote, label: "Withdraw", link: "/user/withdraw" },
      tradesEnabled && { type: "item", icon: ShieldCheck, label: "Trades", link: tradesLink },
      isEnabled("Transfer", true) && { type: "item", icon: Banknote, label: "Transfer", link: "/user/transfer" },
      isEnabled("Transactions", true) && { type: "item", icon: ArrowLeftRight, label: "Transactions", link: "/user/transaction" },

      referralGroupEnabled && { type: "group", key: "Referral", icon: UserCog, label: "Referral", items: referralItems },
      settingGroupEnabled && { type: "group", key: "Setting", icon: UserCog, label: "Setting", items: settingItems },
    ];

    return blocks.filter(Boolean);
  }, [isEnabled, togglesReady, tradesEnabled, tradesLink]);

  const userName = loggedUser?.name || loggedUser?.fullName || loggedUser?.username || loggedUser?.email || "User";
  const isActiveAccount = Boolean(loggedUser?.accounts?.length);

  // ✅ when Blur is true: blur the whole sidebar + block ALL clicks inside sidebar options
  const SidebarInner = ({ onNavClick,disabled}) => (
    <div className="relative h-full w-full">
      {/* Blurred Content */}
       <div className={cx("relative h-full w-full overflow-hidden text-white", disabled && "blur-sm opacity-70 saturate-50")}> 

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
        <GridPattern patternId={`grid-user-sidebar-${patternId}`} />
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
        <div className="relative flex h-full flex-col px-3.5 py-5">
          {/* Header */}
          <div className="mb-4 px-1">
            <Link to="/user/dashboard" onClick={onNavClick} className="group flex items-center gap-3">
              {siteConfig?.logo ? (
                <img
                  src={siteConfig.logo}
                  alt="Logo"
                  className="object-contain w-auto transition-all duration-300 group-hover:scale-105"
                  style={{ height: `${baseHeight}rem` }}
                />
              ) : (
                <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-black/50 ring-1 ring-white/10 overflow-hidden">
                  <div className="absolute inset-0 bg-[conic-gradient(from_90deg,rgba(34,197,94,0.55),rgba(59,130,246,0.55),rgba(236,72,153,0.55),rgba(16,185,129,0.55),rgba(34,197,94,0.55))] opacity-80" />
                  <div className="absolute inset-[2px] rounded-[14px] bg-gradient-to-br from-white/10 to-white/0" />
                  <motion.span
                    className="relative z-10"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="text-white" size={20} />
                  </motion.span>
                </div>
              )}  

              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-black tracking-wide">
                  <span className="bg-gradient-to-r from-green-300 via-blue-300 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.30)]">
                    User Portal
                  </span>
                </div>
                <div className="truncate text-[11px] text-white/65 font-medium">Welcome, {userName}</div>
              </div>
            </Link>

            <div className="mt-4 h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-green-400/60 via-blue-400/55 to-transparent opacity-70" />
          </div>

          {/* Status Card */}
          <div className="mb-5 relative overflow-hidden rounded-2xl p-3 bg-black/45 ring-1 ring-white/10 backdrop-blur-xl">
            <div className="absolute inset-0 opacity-60 bg-[conic-gradient(from_90deg,rgba(34,197,94,0.25),rgba(59,130,246,0.25),rgba(236,72,153,0.25),rgba(16,185,129,0.25),rgba(34,197,94,0.25))]" />
            <div className="absolute inset-[1px] rounded-[15px] bg-black/55" />

            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative grid h-10 w-10 place-items-center rounded-xl overflow-hidden bg-black/50 ring-1 ring-white/10">
                  <div className="absolute inset-0 bg-[conic-gradient(from_90deg,rgba(34,197,94,0.40),rgba(59,130,246,0.40),rgba(236,72,153,0.40),rgba(16,185,129,0.40),rgba(34,197,94,0.40))] opacity-80" />
                  <div className="absolute inset-[2px] rounded-[10px] bg-black/60" />
                  {isActiveAccount ? (
                    <motion.span className="relative z-10" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                      <ShieldCheck size={20} className="text-green-200" strokeWidth={2.5} />
                    </motion.span>
                  ) : (
                    <motion.span className="relative z-10" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                      <ShieldAlert size={20} className="text-pink-200" strokeWidth={2.5} />
                    </motion.span>
                  )}
                </div>

                <div className="leading-tight">
                  <div className={cx("text-[13px] font-black tracking-wide", isActiveAccount ? "text-green-100" : "text-pink-100")}>
                    {isActiveAccount ? "Account Active" : "Not Verified"}
                  </div>
                  <div className="text-[11px] text-white/60 font-medium">
                    {isActiveAccount ? `${loggedUser?.accounts?.length || 0} active account(s)` : "No accounts found"}
                  </div>
                </div>
              </div>

              <span className={cx("h-3 w-3 rounded-full", isActiveAccount ? "bg-green-400" : "bg-pink-400")} />
            </div>
          </div>

          {/* CTA Button (NOW DYNAMIC) */}
          {isEnabled("Create New Account", true) && (
            <div className="mb-4 relative overflow-hidden rounded-2xl p-[2px]">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 opacity-90" />
              <Link
                to="/user/new-challenge"
                onClick={onNavClick}
                className={cx(
                  "relative block w-full rounded-[14px] py-3.5 text-center font-black tracking-wide text-[13px]",
                  "bg-black/40 text-white ring-1 ring-white/15 backdrop-blur-xl",
                  "shadow-[0_0_36px_rgba(59,130,246,0.22)] hover:shadow-[0_0_44px_rgba(236,72,153,0.25)]",
                  "transition-all duration-300 overflow-hidden",
                  creatingMt5 && "opacity-60 pointer-events-none"
                )}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <Sparkles size={16} />
                  </motion.span>
                  Create New Account
                  <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <TrendingUp size={16} />
                  </motion.span>
                </span>
              </Link>
            </div>
          )}

          {/* Menu Items */}
          <div className="user-custom-scrollbar relative flex-1 min-h-0 overflow-y-auto pb-20 pr-1">
            {menuBlocks.map((b) => {
              if (b.type === "group") {
                return <ExpandGroup key={b.key} icon={b.icon} label={b.label} items={b.items} onNavClick={onNavClick} />;
              }
              return <MenuItem key={b.label} icon={b.icon} label={b.label} link={b.link} onClick={onNavClick} />;
            })}
            {/* configLoading is kept but not rendered (no theme change) */}
            {configLoading ? null : null}
          </div>

          {/* Logout */}
          <motion.button
            type="button"
            onClick={logoutHandler}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cx(
              "w-full mb-3 rounded-2xl px-3 py-3",
              "bg-gradient-to-r from-pink-900/35 via-blue-900/25 to-emerald-900/35",
              "ring-1 ring-white/10 backdrop-blur-xl",
              "text-white/85 hover:text-white transition-all"
            )}
          >
            <span className="flex items-center justify-center gap-2 text-[13px] font-black tracking-wide">
              <KeyRound size={16} className="text-pink-200" />
              Logout
            </span>
          </motion.button>

          {/* Footer */}
          <div className="relative mt-3 border-t border-white/10 pt-3">
            <div className="flex items-center justify-between px-2 text-[11px] text-white/55 font-medium">
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

      {/* ✅ Click-blocker overlay (prevents ANY click on sidebar options) */}
      {disabled && <div className="absolute inset-0 z-[60] cursor-not-allowed" />}
    </div>
  );

  /* ---------------- ✅ Desktop: fixed and SAME visual behavior ---------------- */
  if (!isSmallScreen) {
    return (
      <aside className="hidden md:block fixed left-6 top-4 z-40 w-[272px]">
        <div className="h-[calc(100dvh-32px)] rounded-3xl overflow-hidden border border-white/10 bg-black/45 backdrop-blur-2xl shadow-[0_0_70px_rgba(34,197,94,0.10)]">
          <div className="h-full w-full">
            <SidebarInner disabled={Blur} onNavClick={() => {}} />
          </div>
        </div>
      </aside>
    );
  }

  /* ---------------- Mobile: drawer (Redux) ---------------- */
  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/80 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            ref={sidebarRef}
            className={cx("fixed left-0 top-0 z-50 h-[100dvh] md:hidden", "w-[88vw] max-w-[340px]")}
            initial={{ x: -360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <div className="h-full rounded-r-3xl overflow-hidden border-r border-white/10 bg-black/45 backdrop-blur-2xl shadow-[0_0_70px_rgba(34,197,94,0.10)]">
              <SidebarInner disabled={Blur} onNavClick={closeSidebar} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

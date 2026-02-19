import { useState, useEffect, useMemo } from "react";
import { Menu, Bell, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setNotification, handleToggleSidebar } from "../../../redux/user/userSlice";
import { backendApi } from "../../../utils/apiClients";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const cx = (...c) => c.filter(Boolean).join(" ");

/* Background layers unchanged */
const GridPattern = () => (
  <div className="absolute inset-0 opacity-25 pointer-events-none">
    <svg width="100%" height="100%">
      <defs>
        <pattern id="headerGrid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path
            d="M 28 0 L 0 0 0 28"
            fill="none"
            stroke="rgba(34, 197, 94, 0.18)"
            strokeWidth="0.6"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#headerGrid)" />
    </svg>
  </div>
);

const StaticOrbs = () => (
  <>
    <div
      className="absolute -left-16 -top-20 h-56 w-56 rounded-full opacity-30 blur-3xl pointer-events-none"
      style={{ background: "radial-gradient(circle, rgba(236,72,153,0.50) 0%, transparent 70%)" }}
    />
    <div
      className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-25 blur-3xl pointer-events-none"
      style={{ background: "radial-gradient(circle, rgba(59,130,246,0.52) 0%, transparent 70%)" }}
    />
    <div
      className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-18 blur-3xl pointer-events-none"
      style={{ background: "radial-gradient(circle, rgba(34,197,94,0.45) 0%, transparent 70%)" }}
    />
    <div
      className="absolute -top-8 right-10 h-48 w-48 rounded-full opacity-16 blur-3xl pointer-events-none"
      style={{ background: "radial-gradient(circle, rgba(16,185,129,0.48) 0%, transparent 70%)" }}
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

const GlowDot = () => (
  <motion.span className="relative h-2.5 w-2.5" aria-hidden="true">
    <span className="absolute inset-0 rounded-full bg-emerald-400 blur-sm" />
    <motion.span
      className="absolute inset-0 rounded-full bg-emerald-300"
      animate={{ scale: [1, 1.8, 1], opacity: [1, 0.3, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </motion.span>
);

const UserHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((store) => store.user.isSidebarOpen);
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const siteConfig = useSelector((state) => state.user.siteConfig);
  const baseHeight = siteConfig?.logoSize || 4;
  const notifications = useSelector((store) => store.user.notification) || [];

  const sidebarHandler = () => dispatch(handleToggleSidebar(!isSidebarOpen));
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!loggedUser?._id) return;

    const fetchNotifications = async () => {
      try {
        const { data } = await backendApi.get(`/client/get-all-notification/${loggedUser._id}`);
        if (data?.success) dispatch(setNotification(data.data || []));
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, [loggedUser?._id, dispatch]);

  return (
    <nav className={cx("relative h-16 w-full text-white overflow-hidden", "border-b border-white/10", "bg-[#020307]")}>
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

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E)",
        }}
      />

      <motion.div
        className="absolute bottom-0 left-3px right-0 h-[2px] bg-gradient-to-r from-transparent via-green-400/60 via-blue-400/55 to-transparent"
        animate={{ opacity: [0.25, 0.7, 0.25] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex h-full items-center justify-between px-3 md:px-5">
        {/* Left */}
        <div className="flex items-center gap-2 min-w-[84px]">
          <motion.button
            onClick={sidebarHandler}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            className={cx(
              "md:hidden relative rounded-2xl p-2.5 overflow-hidden",
              "bg-black/45 border border-white/10 backdrop-blur-xl",
              "shadow-[0_0_18px_rgba(59,130,246,0.18)] hover:shadow-[0_0_24px_rgba(236,72,153,0.22)]",
              "transition-all duration-300"
            )}
            aria-label="Toggle sidebar"
          >
            <motion.span className="inline-flex animate-spin" aria-hidden="true">
              <Menu size={18} className="text-emerald-200" strokeWidth={2.5} />
            </motion.span>
            <div className="absolute inset-0 bg-[conic-gradient(from_90deg,rgba(34,197,94,0.22),rgba(59,130,246,0.22),rgba(236,72,153,0.22),rgba(16,185,129,0.22),rgba(34,197,94,0.22))] opacity-55" />
            <div className="absolute inset-[1px] rounded-2xl bg-black/55" />
          </motion.button>

          <Link to="/user/dashboard" className="md:hidden inline-flex">
            {siteConfig?.logo && (
              <img
                src={siteConfig.logo}
                alt={siteConfig?.siteName || "Logo"}
                className="object-contain w-auto drop-shadow-[0_0_10px_rgba(59,130,246,0.22)]"
                style={{ height: `${baseHeight * 0.75}rem` }}
              />
            )}
          </Link>
        </div>

        {/* Center */}
        <div className="flex-1 flex items-center justify-center min-w-0 mb-5">
          {siteConfig?.logo ? (
            <motion.img
              src={siteConfig.logo}
              alt={siteConfig?.siteName || "Logo"}
              className="object-contain w-36 sm:w-44 md:w-48 max-w-[60vw] drop-shadow-[0_0_14px_rgba(236,72,153,0.18)]"
              style={{ height: `${baseHeight}rem` }}
              whileHover={{ rotate: [0, -2, 2, 0] }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div className="text-sm font-black tracking-wide truncate">
              <span className="bg-gradient-to-r from-green-300 via-blue-300 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.30)]">
                User Portal
              </span>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="relative flex items-center gap-3 min-w-[120px] justify-end">
          <motion.button
            onClick={() => {
              setIsNotificationOpen((p) => !p);
              setIsDropdownOpen(false);
            }}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            className={cx(
              "relative grid place-items-center w-10 h-10 rounded-2xl overflow-hidden",
              "bg-black/45 border border-white/10 backdrop-blur-xl",
              "shadow-[0_0_18px_rgba(34,197,94,0.14)] hover:shadow-[0_0_24px_rgba(59,130,246,0.18)]",
              "transition-all duration-300"
            )}
            aria-label="Notifications"
          >
            <motion.span className="animate-spin">
              <Bell className="w-5 h-5 text-emerald-200" strokeWidth={2.5} />
            </motion.span>

            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(34,197,94,0.16), rgba(59,130,246,0.14), rgba(236,72,153,0.14))",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.12, 0.32, 0.12] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </AnimatePresence>

            {unreadCount > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] flex items-center justify-center rounded-full font-black"
                style={{
                  background: "linear-gradient(135deg, rgba(236,72,153,0.95), rgba(59,130,246,0.90))",
                  boxShadow: "0 0 18px rgba(236,72,153,0.35)",
                }}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            userId={loggedUser?._id}
          />

          <div className="hidden sm:flex items-center gap-2 text-white/80">
            <GlowDot />
            <div className="flex items-center gap-1">
              <motion.span className="animate-spin" aria-hidden="true">
                <CheckCircle className="w-4 mt-[2px] text-emerald-300" />
              </motion.span>
              <p className="text-[12px] md:text-sm font-black whitespace-nowrap text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.22)]">
                {loggedUser?.firstName || "User"}
              </p>
            </div>
          </div>

          <UserDropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} />
        </div>
      </div>
    </nav>
  );
};

export default UserHeader;

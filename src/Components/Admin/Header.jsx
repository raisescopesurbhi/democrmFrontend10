import { useState, useRef, useEffect, useMemo } from "react";
import { User, LogOut, Bell, X, Shield, CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { backendApi } from "../../utils/apiClients";
import { setNotification } from "../../redux/adminSlice";

/* ===================== Helpers ===================== */
const cx = (...c) => c.filter(Boolean).join(" ");

/* ===================== EXACT USERHEADER THEME ===================== */
const GridPattern = () => (
  <div className="absolute inset-0 opacity-25 pointer-events-none">
    <svg width="100%" height="100%">
      <defs>
        <pattern id="headerGridAdmin" width="28" height="28" patternUnits="userSpaceOnUse">
          <path
            d="M 28 0 L 0 0 0 28"
            fill="none"
            stroke="rgba(34, 197, 94, 0.18)"
            strokeWidth="0.6"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#headerGridAdmin)" />
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
/* ===================== END THEME ===================== */

/* ---------------- Notification Dropdown ---------------- */
const NotificationDropdown = ({ isOpen, onClose, adminId }) => {
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const notifications = useSelector((state) => state.admin.notification) || [];

  useEffect(() => {
    if (!adminId) return;
    const fetchNotifications = async () => {
      try {
        const { data } = await backendApi.get(`/admin/get-all-notification/${adminId}`);
        if (data.success) dispatch(setNotification(data.data));
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, [adminId, location.pathname, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleNotificationClick = async (note) => {
    try {
      await backendApi.put(`/admin/mark-notification-read/${note._id}`);
      dispatch(
        setNotification(
          notifications.map((n) => (n._id === note._id ? { ...n, isRead: true } : n))
        )
      );
      if (note.adminLink) navigate(note.adminLink);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute z-50 right-0 top-12 w-80 rounded-2xl overflow-hidden
                       bg-black/70 backdrop-blur-2xl text-white
                       border border-emerald-400/20 shadow-[0_0_40px_rgba(34,197,94,0.12)]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-400/15">
              <p className="font-black tracking-wide text-emerald-100">Notifications</p>
              <button onClick={onClose} className="text-emerald-200/70 hover:text-emerald-200">
                <X size={16} />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {notifications.length ? (
                notifications.map((note) => (
                  <button
                    key={note._id}
                    onClick={() => handleNotificationClick(note)}
                    className={`w-full text-left px-4 py-3 border-b border-white/10 hover:bg-white/5 transition
                      ${!note.isRead ? "bg-white/5 font-semibold" : "text-white/80"}`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm">{note.title}</p>
                      <span className="text-[10px] text-white/50">
                        {new Date(note.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 mt-1">{note.message}</p>
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-white/60">No notifications</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- Admin Dropdown ---------------- */
const AdminDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const logoutHandler = () => {
    try {
      localStorage.removeItem("admin_password_ref");
    } catch {}
    navigate("/admin/login", { replace: true });
  };

  return (
    <div ref={dropdownRef} className="relative">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute z-50 right-0 top-12 w-52 rounded-2xl overflow-hidden
                       bg-black/70 backdrop-blur-2xl text-white
                       border border-emerald-400/20 shadow-[0_0_40px_rgba(34,197,94,0.12)]"
          >
            <div className="py-2">
              <button
                onClick={logoutHandler}
                className="flex items-center w-full px-4 py-2 text-sm text-rose-200 font-bold hover:bg-white/5 transition"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- Main Header ---------------- */
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const admin = useSelector((store) => store.admin.adminUser);
  const notifications = useSelector((store) => store.admin.notification) || [];

  const adminSiteConfig = useSelector((store) => store.admin.siteConfig);
  const userSiteConfig = useSelector((store) => store.user.siteConfig);
  const siteConfig = adminSiteConfig || userSiteConfig || {};
  const baseHeight = siteConfig.logoSize || 4;

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  return (
    <div className="relative rounded-3xl overflow-visible">
      {/* EXACT USERHEADER THEME */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-[#020307]" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(120% 80% at 10% 0%, rgba(236,72,153,0.30) 0%, transparent 55%), radial-gradient(120% 80% at 100% 40%, rgba(59,130,246,0.28) 0%, transparent 55%), radial-gradient(120% 80% at 50% 100%, rgba(34,197,94,0.22) 0%, transparent 55%)",
          }}
        />
        <StaticOrbs />
        <GridPattern />
        <StaticParticles count={14} />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E)",
          }}
        />

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-400/60 via-blue-400/55 to-transparent"
          animate={{ opacity: [0.25, 0.7, 0.25] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-50 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            {siteConfig?.logo ? (
              <img
                src={siteConfig.logo}
                alt={siteConfig?.siteName || "Logo"}
                className="object-contain w-auto drop-shadow-[0_0_10px_rgba(59,130,246,0.22)]"
                style={{ height: `${baseHeight}rem` }}
              />
            ) : (
              <div className="h-11 w-11 rounded-2xl grid place-items-center bg-black/45 border border-white/10 backdrop-blur-xl">
                <motion.span className="animate-spin" aria-hidden="true">
                  <Shield className="text-emerald-200" size={18} strokeWidth={2.5} />
                </motion.span>
              </div>
            )}

            <div className="min-w-0">
              <div className="truncate text-base sm:text-lg font-black tracking-wide">
                <span className="bg-gradient-to-r from-green-300 via-blue-300 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.30)]">
                  {siteConfig?.websiteName || siteConfig?.siteName || "Admin Console"}
                </span>
              </div>
              <div className="text-[11px] text-white/60 truncate">
                Logged in as{" "}
                <span className="text-white/85 font-black">{admin?.firstName || "Admin"}</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="relative flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <motion.button
              onClick={() => {
                setIsNotificationOpen((v) => !v);
                setIsDropdownOpen(false);
              }}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              className="relative h-10 w-10 rounded-2xl grid place-items-center
                         bg-black/45 border border-white/10 backdrop-blur-xl overflow-hidden
                         shadow-[0_0_18px_rgba(34,197,94,0.14)] hover:shadow-[0_0_24px_rgba(59,130,246,0.18)]
                         transition-all duration-300"
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
              adminId={admin?._id}
            />

            {/* Admin menu */}
            <motion.button
              onClick={() => {
                setIsDropdownOpen((v) => !v);
                setIsNotificationOpen(false);
              }}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              className="h-10 w-10 rounded-2xl grid place-items-center
                         bg-black/45 border border-white/10 backdrop-blur-xl overflow-hidden
                         shadow-[0_0_18px_rgba(236,72,153,0.14)] hover:shadow-[0_0_24px_rgba(59,130,246,0.18)]
                         transition-all duration-300"
              aria-label="Open admin menu"
            >
              <motion.span
                animate={{ y: [0, -1.5, 0], rotate: [0, 8, -8, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <User className="w-5 h-5 text-emerald-200" strokeWidth={2.5} />
              </motion.span>
            </motion.button>

            <AdminDropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} />
          </div>
        </div>

        <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      </div>
    </div>
  );
};

export default Header;

// affiliateUi.tsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";

export const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

export const money = (n: number | string = 0, d = 2) =>
  `$${Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })}`;

export const statusChip = (s?: string) => {
  switch ((s || "").toLowerCase()) {
    case "pending":
      return "bg-yellow-500/15 text-yellow-200 border border-yellow-500/30";
    case "approved":
      return "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30";
    case "rejected":
      return "bg-rose-500/15 text-rose-200 border border-rose-500/30";
    default:
      return "bg-white/5 text-white/70 border border-white/10";
  }
};

export const formatDate = (iso?: string) => {
  if (!iso) return "--";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", { year: "numeric", day: "2-digit", month: "2-digit" }) +
    ", " +
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  );
};

export const since = (iso?: string) => {
  if (!iso) return "--";
  const then = new Date(iso);
  const now = new Date();
  const diff = Math.max(0, now.getTime() - then.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  return parts.length ? `${parts.join(", ")} ago` : "less than a minute ago";
};

/* =========================================================================
   💚💗💙 THEME: "NEON REACTOR / CIRCUIT RAVE" (NO ReactorRing)
   ======================================================================= */
export const NeonReactorBackdrop = () => {
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
          background: "radial-gradient(circle at 30% 30%, rgba(34,197,94,0.65), transparent 58%)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.22, 0.45, 0.22] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[30rem] -right-[30rem] h-[64rem] w-[64rem] rounded-full blur-3xl opacity-35"
        style={{
          background: "radial-gradient(circle at 70% 60%, rgba(59,130,246,0.62), transparent 60%)",
        }}
        animate={{ scale: [1.06, 0.95, 1.06], opacity: [0.18, 0.4, 0.18] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(236,72,153,0.55), transparent 62%)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "radial-gradient(120% 80% at 50% 0%, black 55%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(120% 80% at 50% 0%, black 55%, transparent 85%)",
        }}
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
          background: "linear-gradient(to bottom, transparent 0%, rgba(34,197,94,0.85) 50%, transparent 100%)",
        }}
        animate={{ y: ["-10vh", "120vh"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(120% 85% at 50% 18%, transparent 35%, rgba(0,0,0,0.88) 82%)",
        }}
      />
    </div>
  );
};

export const NeonFrame = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
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
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
      }}
      animate={{ x: ["-120%", "120%"] }}
      transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
    />
    <div className="relative">{children}</div>
  </div>
);

export const PageShell = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => {
  const page = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 170, damping: 18 } },
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <NeonReactorBackdrop />
      <motion.div
        variants={page}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
      >
        <div className="text-center mb-7 -mt-10">
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
              {title}
            </span>
          </h1>
          {subtitle && (
            <p className="text-white/65 mt-2 text-[13px] font-black tracking-wide">{subtitle}</p>
          )}
        </div>

        {children}
      </motion.div>
    </div>
  );
};

export const StatBar = ({
  label,
  value,
  tone = "green",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "green" | "blue" | "pink" | "emerald";
}) => {
  const tones: Record<string, string> = {
    green: "border-green-300/25 bg-green-500/10",
    blue: "border-blue-300/25 bg-blue-500/10",
    pink: "border-pink-300/25 bg-pink-500/10",
    emerald: "border-emerald-300/25 bg-emerald-500/10",
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={cx("rounded-3xl border bg-white/[0.04] px-4 py-3.5 overflow-hidden", tones[tone] || tones.green)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] text-white/55 font-black tracking-wide">{label}</div>
          <div className="mt-1 text-base sm:text-lg font-black text-white/90 truncate">{value}</div>
        </div>
        <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5" />
      </div>

      <div className="mt-3 h-2.5 rounded-full border border-white/10 bg-white/5 overflow-hidden">
        <motion.div
          className="h-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(34,197,94,0.95), rgba(59,130,246,0.95), rgba(236,72,153,0.95), rgba(16,185,129,0.90))",
          }}
          initial={{ width: "0%" }}
          animate={{ width: "72%" }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
        />
      </div>
    </motion.div>
  );
};

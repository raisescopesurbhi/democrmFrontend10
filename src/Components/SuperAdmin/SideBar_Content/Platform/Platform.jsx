import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  Loader2,
  Sparkles,
  RefreshCw,
  Layers,
  ToggleLeft,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { backendApi } from "../../../../utils/apiClients";
import { Switch } from "../../../Admin/ui/Switch";

/* =========================================================================
   THEME: "NEON REACTOR / CIRCUIT RAVE" (same as UserNewChallenge)
   ✅ Same theme/gradient/animations
   ❌ No reactor ring UI
   ✅ APIs + workflow unchanged
   ======================================================================= */

const cx = (...c) => c.filter(Boolean).join(" ");

/* ------------------ SAME BACKDROP STYLE (from UserNewChallenge) ------------------ */
const NeonCircuitBackdrop = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
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

/* ------------------ SAME FRAME STYLE (from UserNewChallenge) ------------------ */
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

const SelectWrap = ({ disabled, children }) => (
  <div
    className={cx(
      "relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden",
      "focus-within:border-green-300/25 focus-within:ring-2 focus-within:ring-green-400/10",
      disabled && "opacity-60"
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

const btnPrimary =
  "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110";
const btnGhost = "border border-white/10 bg-white/5 hover:bg-white/10 text-white/85";
const btnDisabled = "bg-white/10 text-white/40 cursor-not-allowed";

export default function Platform() {
  const [platformData, setPlatformData] = useState([]);
  const [newField, setNewField] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null); // row action loading
  const [error, setError] = useState(null);

  /* --------------------------- APIs (UNCHANGED) --------------------------- */
  const getAllPlatforms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await backendApi.get(`/s-admin/get-platforms`);
      setPlatformData(res.data.data || []);
    } catch (error) {
      setError("Failed to fetch platform data");
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllPlatforms();
  }, []);

  const addField = async () => {  
    const toastId = toast.loading("Creating platform...");
    if (!newField.name.trim()) return;

    try {
      const res = await backendApi.post(`/s-admin/add-platform`, {
        name: newField.name.trim(),
        status: "active",
      });

      if (res.data.status) {
        toast.success("Platform added", { id: toastId });
        setNewField({ name: "" });
        getAllPlatforms();
      } else {
        toast.error("Value already exists", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  const toggleActive = async (id, currentStatus) => {
    const toastId = toast.loading("Updating status...");
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    setBusyId(id);
    try {
      const res = await backendApi.put(`/s-admin/update-platform`, { id, status: newStatus });
      if (res.data.status) {
        setPlatformData((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
        );
        toast.success("Status updated", { id: toastId });
      } else {
        toast.error(res.data.msg || "Failed to update", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setBusyId(null);
    }
  };

  const deletePlatform = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this platform?");
    if (!ok) return;

    const toastId = toast.loading("Deleting...");
    setBusyId(id);
    try {
      const res = await backendApi.delete(`/s-admin/delete-platform/?id=${id}`);
      if (res.data.status) {
        setPlatformData((prev) => prev.filter((p) => p._id !== id));
        toast.success("Deleted successfully", { id: toastId });
      } else {
        toast.error(res.data.msg || "Failed to delete", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setBusyId(null);
    }
  };

  const total = useMemo(() => platformData.length, [platformData.length]);
  const activeCount = useMemo(
    () => platformData.filter((p) => String(p?.status).toLowerCase() === "active").length,
    [platformData]
  );
  const inactiveCount = useMemo(() => total - activeCount, [total, activeCount]);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <NeonCircuitBackdrop />

      <motion.div
        variants={page}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
      >
        {/* HEADER */}
        <motion.div variants={inUp}>
          <NeonFrame className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Pill tone="green">
                    <Sparkles className="h-3.5 w-3.5" />
                    PLATFORM OPS
                  </Pill>
                  <Pill tone="blue">
                    <Layers className="h-3.5 w-3.5" />
                    TOTAL {total}
                  </Pill>
                  <Pill tone="emerald">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    ACTIVE {activeCount}
                  </Pill>
                  <Pill tone="pink">
                    <XCircle className="h-3.5 w-3.5" />
                    INACTIVE {inactiveCount}
                  </Pill>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                    Platform Control
                  </span>
                </h1>
                <p className="text-white/70 mt-2 max-w-2xl">
                  Add platforms, toggle visibility, and keep the environment clean — in the same neon circuit theme.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  type="button"
                  onClick={getAllPlatforms}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cx(
                    "rounded-2xl px-4 py-2 text-[12px] font-black inline-flex items-center gap-2 transition",
                    loading ? btnDisabled : btnGhost
                  )}
                  disabled={loading}
                >
                  <RefreshCw className={cx("h-4 w-4", loading && "animate-spin")} />
                  {loading ? "Refreshing..." : "Refresh"}
                </motion.button>
              </div>
            </div>

            {/* subtle status line */}
            <div className="mt-5 h-3 rounded-full border border-white/10 bg-white/5 overflow-hidden">
              <motion.div
                className="h-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(34,197,94,0.95), rgba(59,130,246,0.95), rgba(236,72,153,0.95), rgba(16,185,129,0.90))",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(8, (activeCount / Math.max(1, total)) * 100))}%` }}
                transition={{ type: "spring", stiffness: 160, damping: 18 }}
              />
            </div>
            <div className="mt-2 text-[11px] text-white/45">
              Active ratio:{" "}
              <span className="text-white/75 font-black">
                {total ? Math.round((activeCount / total) * 100) : 0}%
              </span>
            </div>
          </NeonFrame>
        </motion.div>

        {/* MAIN: New layout (no reactor) */}
        <motion.div variants={inUp} className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT: CREATE */}
          <NeonFrame className="lg:col-span-5 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-white/55 font-black tracking-wide">CREATE</div>
                <div className="mt-1 text-xl font-black text-white/90">Add Platform</div>
              </div>
              <Pill tone={newField.name.trim() ? "emerald" : "gray"}>
                <Plus className="h-3.5 w-3.5" />
                {newField.name.trim() ? "READY" : "WAITING"}
              </Pill>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                <div className="text-[12px] text-white/75 font-black tracking-wide mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-200" />
                  Platform Name
                </div>

                <SelectWrap>
                  <input
                    value={newField.name}
                    onChange={(e) => setNewField({ name: e.target.value })}
                    placeholder="e.g. MT5, cTrader, WebTrader…"
                    className={cx(
                      "w-full bg-transparent px-4 py-3.5",
                      "outline-none text-white/90 text-[13px] font-black",
                      "placeholder:text-white/35"
                    )}
                  />
                </SelectWrap>

                <div className="mt-3 text-[11px] text-white/45">
                  New platforms are created as{" "}
                  <span className="text-white/75 font-black">active</span> by default.
                </div>
              </div>

              <motion.button
                whileHover={!newField.name.trim() ? {} : { y: -2 }}
                whileTap={!newField.name.trim() ? {} : { scale: 0.98 }}
                onClick={addField}
                disabled={!newField.name.trim()}
                className={cx(
                  "w-full rounded-2xl px-5 py-3.5 text-[13px] font-black transition inline-flex items-center justify-center gap-2",
                  !newField.name.trim() ? btnDisabled : btnPrimary
                )}
              >
                <Plus className="h-4 w-4" />
                Add Platform
              </motion.button>

              {error ? (
                <div className="rounded-2xl border border-pink-300/25 bg-pink-500/10 px-4 py-3 text-[12px] text-pink-100 font-black">
                  {error}
                </div>
              ) : null}
            </div>
          </NeonFrame>

          {/* RIGHT: LIST */}
          <NeonFrame className="lg:col-span-7 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-white/55 font-black tracking-wide">LIST</div>
                <div className="mt-1 text-xl font-black text-white/90">Platforms</div>
              </div>

              <div className="flex items-center gap-2">
                {loading && (
                  <Pill tone="blue">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    LOADING
                  </Pill>
                )}
                <Pill tone="green">
                  <ToggleLeft className="h-3.5 w-3.5" />
                  Toggle Active
                </Pill>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden">
              {/* header row */}
              <div className="px-4 sm:px-5 py-4 border-b border-white/10 bg-white/[0.03]">
                <div className="grid grid-cols-[80px_1fr_160px_80px] gap-3 text-[11px] font-black tracking-wider text-white/55">
                  <div>#</div>
                  <div>Name</div>
                  <div>Status</div>
                  <div className="text-right">Action</div>
                </div>
              </div>

              {/* rows */}
              <div className="max-h-[520px] overflow-y-auto">
                <AnimatePresence initial={false}>
                  {!loading && platformData?.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="px-5 py-10 text-center text-sm text-white/55"
                    >
                      No platforms found.
                    </motion.div>
                  ) : (
                    platformData?.map((platform, index) => {
                      const rowBusy = busyId === platform._id;
                      const isActive = String(platform?.status).toLowerCase() === "active";

                      return (
                        <motion.div
                          key={platform._id || index}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", stiffness: 220, damping: 18 }}
                          className={cx(
                            "px-4 sm:px-5 py-4 border-b border-white/10",
                            "hover:bg-white/[0.04] transition"
                          )}
                        >
                          <div className="grid grid-cols-[80px_1fr_160px_80px] gap-3 items-center">
                            <div className="text-sm font-black text-white/70">
                              {(index + 1).toString().padStart(2, "0")}
                            </div>

                            <div className="min-w-0">
                              <div className="text-sm font-black text-white/90 truncate">
                                {platform.name}
                              </div>
                              <div className="text-[11px] text-white/45 truncate">
                                ID: <span className="font-mono">{platform._id}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <Switch
                                checked={isActive}
                                onCheckedChange={() => toggleActive(platform._id, platform.status)}
                                disabled={rowBusy}
                              />
                              <Pill tone={isActive ? "emerald" : "gray"}>
                                {rowBusy ? (
                                  <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Updating
                                  </>
                                ) : (
                                  <>
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    {isActive ? "ACTIVE" : "INACTIVE"}
                                  </>
                                )}
                              </Pill>
                            </div>

                            <div className="text-right">
                              <motion.button
                                type="button"
                                whileHover={rowBusy ? {} : { y: -2, scale: 1.06 }}
                                whileTap={rowBusy ? {} : { scale: 0.98 }}
                                onClick={() => deletePlatform(platform?._id)}
                                disabled={rowBusy}
                                className={cx(
                                  "inline-flex items-center justify-center rounded-2xl px-3 py-2",
                                  "border border-white/10 bg-white/5 hover:bg-white/10 transition",
                                  rowBusy && "opacity-60 cursor-not-allowed"
                                )}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4 text-pink-200" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-white/45">
              Tip: You can toggle status without reloading; list updates instantly (API workflow unchanged).
            </div>
          </NeonFrame>
        </motion.div>
      </motion.div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Loader2,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Layers,
  Wand2,
} from "lucide-react";
import toast from "react-hot-toast";
// import backendApi, { metaApi } from "../../../../../backendApi";  
import { backendApi } from "../../../../utils/apiClients";


const cx = (...c) => c.filter(Boolean).join(" ");

/* =========================================================================
   USERNEWCHALLENGE THEME (no Reactor)
   - neon circuit backdrop
   - conic neon border frame
   - shimmer sweep
   ======================================================================= */

const NeonCircuitBackdrop = () => {  
  const dots = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        i,
        x: (i * 41) % 100,
        y: (i * 67) % 100,
        s: 1 + ((i * 13) % 3),
        d: 3 + ((i * 7) % 7),
        o: 0.16 + (((i * 9) % 40) / 100),
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[#020307]" />

      {/* blobs */}
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

      {/* grid */}
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

      {/* particles */}
      <div className="absolute inset-0">
        {dots.map((p) => (
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

      {/* scan */}
      <motion.div
        className="absolute inset-x-0 -top-48 h-48 opacity-[0.10]"
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
    gray: "border-white/10 bg-white/5 text-white/70",
    green: "border-green-300/25 bg-green-500/12 text-green-100",
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

const btnPrimary =
  "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110";
const btnSoft =
  "border border-white/10 bg-white/5 hover:bg-white/10 text-white/80";
const btnDanger =
  "border border-pink-300/20 bg-pink-500/10 hover:bg-pink-500/15 text-pink-100";
const btnDisabled = "bg-white/10 text-white/40 cursor-not-allowed";

const AddGroup = ({ refresh, setRefresh }) => {
  const [apiGroups, setApiGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [customGroup, setCustomGroup] = useState("");

  const [mode, setMode] = useState("idle"); // "idle" | "editing"
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingGroups, setIsFetchingGroups] = useState(false);

  // const fetchApiGroups = async () => {
  //   setIsFetchingGroups(true);
  //   try {
  //     const res = await metaApi.get(
  //       `/GetGroups?Manager_Index=${import.meta.env.VITE_MANAGER_INDEX}` 
        
  //     ); // ✅ unchanged
  //     return res.data.lstGroups || [];
  //   } catch (error) {
  //     toast.error("Failed to fetch API groups");
  //     return [];
  //   } finally {
  //     setIsFetchingGroups(false);
  //   }
  // };

  const fetchApiGroups = async () => {
    setIsFetchingGroups(true);
    try {
      const res = await backendApi.get(
        "/meta/groups"
        
      ); // ✅ unchanged
      console.log(res.data.data.lstGroups);
      return res.data.data.lstGroups || [];
  
    } catch (error) {
      toast.error("Failed to fetch API groups");
      return [];
    } finally {
      setIsFetchingGroups(false);
    }
  };

  const resetForm = () => {
    setSelectedGroup("");
    setCustomGroup("");
    setMode("idle");
  };

  const handleSave = async () => {
    if (!selectedGroup || !customGroup.trim()) {
      toast.error("Please select a group and enter a custom group name.");
      return;
    }

    setIsLoading(true);
    try {
      await backendApi.post("/s-admin/add-custom-group", {
        apiGroup: selectedGroup,
        customGroup: customGroup.trim(),
      }); // ✅ unchanged

      toast.success("Group added successfully");
      setRefresh(!refresh); // ✅ unchanged
      resetForm();
    } catch (error) {
      console.log("Error in adding custom group", error);
      toast.error("Failed to add group");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      const groups = await fetchApiGroups();
      console.log(groups);
      setApiGroups(groups);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const stats = useMemo(
    () => ({
      total: apiGroups.length,
      ready: Boolean(selectedGroup && customGroup.trim()),
    }),
    [apiGroups.length, selectedGroup, customGroup]
  );

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
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 220, damping: 18 },
    },
  };

  return (
    <div className="relative w-full overflow-hidden text-white">
      <NeonCircuitBackdrop />

      <motion.div
        variants={page}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* HERO (completely new layout) */}
        <motion.div variants={inUp}>
          <NeonFrame className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Pill tone="green">
                    <Sparkles className="h-3.5 w-3.5" />
                    GROUP MAPPING
                  </Pill>
                  <Pill tone="blue">
                    <Layers className="h-3.5 w-3.5" />
                    API GROUPS: {stats.total}
                  </Pill>
                  <Pill tone={stats.ready ? "pink" : "gray"}>
                    {stats.ready ? "READY TO SAVE" : "INCOMPLETE"}
                  </Pill>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                    Add Custom Group
                  </span>
                </h2>
                <p className="text-white/70 mt-2 max-w-2xl">
                  Map an API group to your internal custom group name with a clean, consistent naming strategy.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRefresh(!refresh)}
                  disabled={isFetchingGroups || isLoading}
                  className={cx(
                    "rounded-2xl px-4 py-2 text-[12px] font-black inline-flex items-center gap-2 transition",
                    isFetchingGroups || isLoading ? btnDisabled : btnSoft
                  )}
                >
                  {isFetchingGroups ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMode((m) => (m === "editing" ? "idle" : "editing"))}
                  disabled={isFetchingGroups || isLoading || !apiGroups.length}
                  className={cx(
                    "rounded-2xl px-4 py-2 text-[12px] font-black inline-flex items-center gap-2 transition",
                    isFetchingGroups || isLoading || !apiGroups.length ? btnDisabled : btnPrimary
                  )}
                >
                  <Wand2 className="h-4 w-4" />
                  {mode === "editing" ? "Stop" : "Start"}
                </motion.button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] text-white/55 font-black tracking-wide">MODE</div>
                <div className="mt-1 text-white/90 font-black">
                  {mode === "editing" ? "Editing" : "Idle"}
                </div>
                <div className="text-[11px] text-white/45 mt-1">Controls action availability.</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] text-white/55 font-black tracking-wide">SELECTION</div>
                <div className="mt-1 text-white/90 font-black">
                  {selectedGroup ? "Chosen" : "Not selected"}
                </div>
                <div className="text-[11px] text-white/45 mt-1">Pick an API group first.</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] text-white/55 font-black tracking-wide">CUSTOM NAME</div>
                <div className="mt-1 text-white/90 font-black">
                  {customGroup.trim() ? "Entered" : "Missing"}
                </div>
                <div className="text-[11px] text-white/45 mt-1">Avoid duplicates + keep consistent.</div>
              </div>
            </div>
          </NeonFrame>
        </motion.div>

        {/* MAIN GRID */}
        <motion.div variants={inUp} className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT: FORM */}
          <NeonFrame className="lg:col-span-7 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] text-white/55 font-black tracking-wide">FORM</div>
                <div className="mt-1 text-xl font-black text-white/90">Create Mapping</div>
                <div className="text-[12px] text-white/55 mt-1">
                  Choose an API group and assign a custom label.
                </div>
              </div>

              <Pill tone={stats.ready ? "pink" : "gray"}>
                {stats.ready ? "VALID" : "NEEDS INPUT"}
              </Pill>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4">
              {/* API Group */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <label className="block text-[12px] font-black tracking-wide text-white/80 mb-2">
                  Select API Group
                </label>

                <div className="relative">
                  <select
                    className={cx(
                      "w-full rounded-2xl px-4 py-3 pr-10",
                      "bg-white/5 text-white/90",
                      "border border-white/10",
                      "focus:outline-none focus:ring-2 focus:ring-green-400/10 focus:border-green-300/25",
                      "transition-all",
                      (isFetchingGroups || isLoading || mode !== "editing") && "opacity-70"
                    )}
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    disabled={isFetchingGroups || isLoading || mode !== "editing"}
                  >
                    <option value="" disabled>
                      Select a group…
                    </option>
                    {apiGroups.map((g, idx) => (
                      <option key={idx} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>

                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {isFetchingGroups ? (
                      <Loader2 className="h-5 w-5 text-white/45 animate-spin" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-white/45" />
                    )}
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-white/45">
                  Data source: meta API groups list.
                </div>
              </div>

              {/* Custom Group */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <label className="block text-[12px] font-black tracking-wide text-white/80 mb-2">
                  Custom Group Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. VIP Traders, Standard, Pro..."
                  value={customGroup}
                  onChange={(e) => setCustomGroup(e.target.value)}
                  className={cx(
                    "w-full rounded-2xl px-4 py-3",
                    "bg-white/5 text-white/90 placeholder:text-white/35",
                    "border border-white/10",
                    "focus:outline-none focus:ring-2 focus:ring-green-400/10 focus:border-green-300/25",
                    "transition-all",
                    (isLoading || mode !== "editing") && "opacity-70"
                  )}
                  disabled={isLoading || mode !== "editing"}
                />

                <div className="mt-2 text-[11px] text-white/45">
                  Tip: Keep naming consistent for reporting & filters.
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <motion.button
                  whileHover={(mode === "editing" && !isLoading) ? { y: -2 } : {}}
                  whileTap={(mode === "editing" && !isLoading) ? { scale: 0.98 } : {}}
                  onClick={handleSave}
                  disabled={isLoading || mode !== "editing"}
                  className={cx(
                    "rounded-2xl px-5 py-3 text-[13px] font-black transition inline-flex items-center justify-center gap-2",
                    isLoading || mode !== "editing" ? btnDisabled : btnPrimary
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Check className="h-5 w-5" />
                  )}  
                  Save Mapping
                </motion.button>

                <motion.button
                  whileHover={!isLoading ? { y: -2 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  type="button"
                  onClick={resetForm}
                  disabled={isLoading}
                  className={cx(
                    "rounded-2xl px-5 py-3 text-[13px] font-black transition inline-flex items-center justify-center gap-2",
                    isLoading ? btnDisabled : btnDanger
                  )}
                >
                  <X className="h-5 w-5" />
                  Reset
                </motion.button>

                <motion.button
                  whileHover={(!isLoading && mode === "editing") ? { y: -2 } : {}}
                  whileTap={(!isLoading && mode === "editing") ? { scale: 0.98 } : {}}
                  type="button"
                  onClick={() => setMode("idle")}
                  disabled={isLoading || mode !== "editing"}
                  className={cx(
                    "rounded-2xl px-5 py-3 text-[13px] font-black transition inline-flex items-center justify-center gap-2",
                    isLoading || mode !== "editing" ? btnDisabled : btnSoft
                  )}
                >
                  Stop
                </motion.button>
              </div>
            </div>
          </NeonFrame>

          {/* RIGHT: PREVIEW */}
          <NeonFrame className="lg:col-span-5 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] text-white/55 font-black tracking-wide">PREVIEW</div>
                <div className="mt-1 text-xl font-black text-white/90">What will be saved</div>
                <div className="text-[12px] text-white/55 mt-1">
                  Confirm values before saving.
                </div>
              </div>

              <Pill tone={stats.ready ? "green" : "gray"}>
                {stats.ready ? "READY" : "WAITING"}
              </Pill>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] font-black tracking-wide text-white/55">
                  API GROUP
                </div>
                <div className="mt-2 text-white/90 font-black break-words">
                  {selectedGroup || <span className="text-white/35">—</span>}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] font-black tracking-wide text-white/55">
                  CUSTOM GROUP
                </div>
                <div className="mt-2 text-white/90 font-black break-words">
                  {customGroup.trim() ? customGroup.trim() : (
                    <span className="text-white/35">—</span>
                  )}
                </div>
              </div>

              <div
                className="rounded-3xl border border-white/10 p-4"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(34,197,94,0.14), rgba(59,130,246,0.10), rgba(236,72,153,0.10))",
                }}
              >
                <div className="text-[12px] text-white/70 leading-relaxed">
                  <span className="font-black text-white/85">Naming tip:</span>{" "}
                  Prefer short, consistent labels like “Standard / Pro / VIP” for clean downstream mapping.
                </div>
              </div>

              <AnimatePresence>
                {mode !== "editing" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4 text-[12px] text-white/60"
                  >
                    You’re currently in <span className="font-black text-white/80">Idle</span> mode.
                    Click <span className="font-black text-white/80">Start</span> to enable editing.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </NeonFrame>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddGroup;

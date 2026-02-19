import React, { useEffect, useMemo, useState } from "react";
import { motion,type Variants, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Sparkles,
  RadioTower,
  Waves,
  Gauge,
  RotateCcw,
  RefreshCw,
  Edit2,
  Check,
  X,
  Layers,
  ShieldCheck,
  Coins,
} from "lucide-react";
import toast from "react-hot-toast";
import { backendApi } from "../../../utils/apiClients";

/* =========================================================================
   💚💗💙 THEME: "NEON REACTOR / CIRCUIT RAVE" (matching UserNewChallenge)
   - Layout:
     ✅ Account type bar: TOP RIGHT
     ✅ Add button: RIGHT SIDE under account type bar
     ✅ Table: columns = Levels | Commission | Actions
     ✅ Actions: Edit + Delete icons (delete kept commented as in your code)
   - APIs/workflow unchanged
   - NO ReactorRing

   ✅ Responsive update:
   - Mobile: header stacks nicely
   - Mobile: table becomes CARD LIST (like ManageUsers pattern) for better UX
   - Desktop view remains OK/unchanged
   ======================================================================= */

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const NeonReactorBackdrop = () => {
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
      <motion.div
        className="absolute -top-44 right-16 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(circle at 45% 45%, rgba(16,185,129,0.55), transparent 64%)",
        }}
        animate={{ scale: [1, 1.09, 1], x: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
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
      <motion.div
        className="absolute inset-0 opacity-[0.11]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(120deg, rgba(236,72,153,0.22) 0px, rgba(236,72,153,0.22) 1px, transparent 1px, transparent 22px)",
        }}
        animate={{ x: [0, 120, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
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
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(34,197,94,0.85) 50%, transparent 100%)",
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

const NeonFrame = ({
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

const Pill = ({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: "gray" | "green" | "emerald" | "blue" | "pink";
}) => {
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

const FieldLabel = ({
  icon: Icon,
  label,
  sub,
}: {
  icon: any;
  label: string;
  sub?: string;
}) => (
  <div className="flex items-center justify-between">
    <label className="text-[12px] text-white/75 font-black tracking-wide flex items-center gap-2">
      <Icon className="h-4 w-4 text-green-200" />
      {label}
    </label>
    {sub ? <span className="text-[11px] text-white/45">{sub}</span> : null}
  </div>
);

const SelectWrap = ({
  disabled,
  children,
}: {
  disabled?: boolean;
  children: React.ReactNode;
}) => (
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

const EMPTY_LEVELS = Array.from({ length: 10 }, (_, i) => ({
  level: i + 1,
  id: "",
  levelBonus: "",
}));

const AdminIbZone = () => {
  const [formData, setFormData] = useState<typeof EMPTY_LEVELS>(EMPTY_LEVELS);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const [accountsTypes, setAccountsTypes] = useState<any[]>([]);
  const [currentAccount, setCurrentAccount] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [savingIdx, setSavingIdx] = useState<number | null>(null);
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null);

  // ✅ INLINE ADD BAR state
  const [isAddBarOpen, setIsAddBarOpen] = useState(false);
  const [addForm, setAddForm] = useState<{
    accountType: string;
    level: string;
    commission: string;
  }>({
    accountType: "",
    level: "",
    commission: "",  
  });
  const [adding, setAdding] = useState(false);

  const configuredCount = useMemo(
    () => formData.filter((r) => r.levelBonus !== "" && Number(r.levelBonus) > 0).length,
    [formData]
  );
  const progressPct = useMemo(() => Math.round((configuredCount / 10) * 100), [configuredCount]);

  const resetFormData = () => setFormData(EMPTY_LEVELS);

  const handleInputChange = (index: number, field: "levelBonus", value: string) => {
    const updated = [...formData];
    updated[index][field] = value === "" ? "" : value;
    setFormData(updated);
  };

  const fetchAccountTypes = async () => {
    try {
      const res = await backendApi.get(`admin/get-custom-groups`);
      setAccountsTypes(res?.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load account types");
    }
  };

  const fetchIbs = async () => {
    setLoading(true);
    resetFormData();
    try {
      const res = await backendApi.get(`admin/admin-ibs`);
      const all = res?.data?.data || [];
      const filtered = all.filter((v: any) => v.accountTypeId === currentAccount?._id);

      if (filtered.length) {
        const currentId = currentAccount?._id;

        const accountFiltered = filtered.filter((ib: any) => ib.accountTypeId === currentId);

        const maxLevel = accountFiltered.reduce(
          (m: number, x: any) => Math.max(m, Number(x.level || 0)),
          0
        );

        const updated = Array.from({ length: maxLevel || 1 }, (_, idx) => {
          const level = idx + 1;
          const found = accountFiltered.find((ib: any) => ib.level === level);

          return {
            level,
            id: found ? found._id : "",
            levelBonus: found ? String(found.commission ?? "") : "",
          };
        });

        setFormData(updated);
      } else {
        resetFormData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load IB config");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number) => setEditingIndex(index);

  const handleSave = async (index: number) => {
    const row = formData[index];
    if (!currentAccount?._id) {
      toast.error("Please select an account type first.");
      return;
    }

    const numeric = row.levelBonus === "" ? NaN : Number(row.levelBonus);
    if (!Number.isFinite(numeric) || numeric < 0) {
      toast.error("Enter a valid non-negative number for Level Bonus.");
      return;
    }

    const toastId = toast.loading("Saving…");
    setSavingIdx(index);

    try {
      if (!row.id) {
        await backendApi.post(`/admin/add-admin-ib`, {
          accountType: currentAccount.customGroup,
          accountTypeId: currentAccount._id,
          level: row.level,
          commission: Number(numeric),
        });
      } else {
        await backendApi.put(`/admin/update-admin-ib/${row.id}`, {
          commission: Number(numeric),
        });
      }

      toast.success("Saved successfully", { id: toastId });
      setEditingIndex(-1);
      await fetchIbs();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Save failed", { id: toastId });
    } finally {
      setSavingIdx(null);
    }
  };

  const submitAddBar = async () => {
    const lvl = Number(addForm.level);
    const comm = Number(addForm.commission);

    if (!currentAccount?._id) {
      toast.error("Please select an account type first.");
      return;
    }
    if (!Number.isFinite(lvl) || lvl <= 0) {
      toast.error("Enter a valid level.");
      return;
    }
    if (!Number.isFinite(comm) || comm < 0) {
      toast.error("Enter a valid non-negative commission.");
      return;
    }

    const toastId = toast.loading("Adding level…");
    setAdding(true);

    try {
      await backendApi.post("/admin/add-level", {
        accountTypeId: currentAccount._id,
        level: lvl,
        commission: comm,
      });

      toast.success("Level added successfully", { id: toastId });
      setIsAddBarOpen(false);
      setAddForm({ accountType: "", level: "", commission: "" });
      await fetchIbs();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to add level", { id: toastId });
    } finally {
      setAdding(false);
    }
  };

  const handleCancel = () => setEditingIndex(-1);

  const resetAll = () => {
    setEditingIndex(-1);
    resetFormData();
  };

  useEffect(() => {
    fetchAccountTypes();
  }, []);

  useEffect(() => {
    if (accountsTypes?.length && !currentAccount) {
      setCurrentAccount(accountsTypes[0]);
    }
  }, [accountsTypes, currentAccount]);

  useEffect(() => {
    if (currentAccount?._id) fetchIbs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount?._id]);

  const page : Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 170, damping: 18, staggerChildren: 0.06 },
    },
  };

  const inUp :Variants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 220, damping: 18 },
    },
  };

  const rowAnim = {
    hidden: { opacity: 0, y: 10, scale: 0.99 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <NeonReactorBackdrop />

      <motion.div
        variants={page}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-7 sm:py-10"
      >
        <motion.div variants={inUp}>
          <NeonFrame className="p-4 sm:p-7">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Pill tone="green">
                    <Sparkles className="h-3.5 w-3.5" />
                    ADMIN IB ZONE
                  </Pill>

                  <Pill tone={currentAccount?._id ? "blue" : "gray"}>
                    <RadioTower className="h-3.5 w-3.5" />
                    {currentAccount?.customGroup || "Select Account"}
                  </Pill>

                  <Pill tone={configuredCount > 0 ? "emerald" : "gray"}>
                    <Layers className="h-3.5 w-3.5" />
                    {configuredCount}/10 CONFIGURED
                  </Pill>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                    IB Configuration
                  </span>
                </h1>
                <p className="text-white/70 mt-2 max-w-2xl">
                  Configure level commissions per account type — neon reactor dashboard mode.
                </p>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-[11px] font-black tracking-wide text-white/55">
                    <span className="inline-flex items-center gap-2">
                      <Waves className="h-4 w-4 text-green-200" />
                      Config Charge
                    </span>
                    <span>{progressPct}%</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full border border-white/10 bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(34,197,94,0.95), rgba(59,130,246,0.95), rgba(236,72,153,0.95), rgba(16,185,129,0.90))",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ type: "spring", stiffness: 160, damping: 18 }}
                    />
                  </div>
                </div>
              </div>

              {/* ✅ Right panel responsive: full-width on mobile, max width on desktop */}
              <div className="lg:col-span-5 lg:justify-self-end w-full">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <Pill tone={currentAccount?._id ? "blue" : "gray"}>
                      <Coins className="h-3.5 w-3.5" />
                      {currentAccount?.customGroup || "Account Type"}
                    </Pill>
                    <span className="text-[11px] font-black tracking-wide text-white/55">
                      ACCOUNT TYPE
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                      <motion.button
                        type="button"
                        onClick={() => setIsAddBarOpen(true)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-[12px] font-black text-white/85 inline-flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Add
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={fetchIbs}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-[12px] font-black text-white/85 inline-flex items-center justify-center gap-2"
                      >
                        <RefreshCw className={cx("h-4 w-4", loading && "animate-spin")} />
                        {loading ? "Refreshing…" : "Refresh"}
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={resetAll}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-[12px] font-black text-white/85 inline-flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                      </motion.button>
                    </div>

                    {/* ✅ ADD MODAL (responsive already, just tightened for mobile) */}
                    <AnimatePresence initial={false}>
                      {isAddBarOpen && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
                            onClick={() => (adding ? null : setIsAddBarOpen(false))}
                          />

                          <motion.div
                            initial={{ opacity: 0, y: 18, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 18, scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 220, damping: 18 }}
                            className="fixed inset-0 z-[90] flex items-center justify-center px-3 sm:px-4"
                          >
                            <div className="w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
                              <NeonFrame className="p-4 sm:p-6">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <Pill tone="pink">
                                      <Sparkles className="h-3.5 w-3.5" />
                                      ADD LEVEL
                                    </Pill>
                                    <div className="mt-2 text-[12px] text-white/65">
                                      Fill details and submit.
                                    </div>
                                  </div>

                                  <motion.button
                                    type="button"
                                    onClick={() => (adding ? null : setIsAddBarOpen(false))}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={adding}
                                    className={cx(
                                      "h-9 w-9 rounded-2xl grid place-items-center border border-white/10 bg-white/5 hover:bg-white/10 text-white/85",
                                      adding && "opacity-60 cursor-not-allowed"
                                    )}
                                    title="Close"
                                  >
                                    <X className="h-4 w-4" />
                                  </motion.button>
                                </div>

                                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <FieldLabel icon={Coins} label="Account Type" sub="Required" />
                                    <div className="mt-2">
                                      <SelectWrap disabled={!accountsTypes?.length || adding}>
                                        <select
                                          value={addForm.accountType}
                                          onChange={(e) =>
                                            setAddForm((p) => ({ ...p, accountType: e.target.value }))
                                          }
                                          disabled={!accountsTypes?.length || adding}
                                          className={cx(
                                            "w-full appearance-none bg-transparent px-4 py-3.5 pr-10",
                                            "outline-none text-white/90 text-[13px] font-black disabled:cursor-not-allowed"
                                          )}
                                        >
                                          <option value="" disabled className="bg-[#0b0d14]">
                                            {accountsTypes?.length ? "Select Account" : "Loading…"}
                                          </option>
                                          {accountsTypes.map((v) => (
                                            <option key={v?._id} value={v?._id} className="bg-[#0b0d14]">
                                              {v?.customGroup}
                                            </option>
                                          ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none" />
                                      </SelectWrap>
                                    </div>
                                  </div>

                                  <div>
                                    <FieldLabel icon={Layers} label="Level" sub="Required" />
                                    <div className="mt-2">
                                      <SelectWrap disabled={adding}>
                                        <input
                                          type="number"
                                          min="1"
                                          value={addForm.level}
                                          disabled={adding}
                                          onChange={(e) => setAddForm((p) => ({ ...p, level: e.target.value }))}
                                          className={cx(
                                            "w-full bg-transparent px-4 py-3.5",
                                            "outline-none text-white/90 text-[13px] font-black disabled:cursor-not-allowed"
                                          )}
                                          placeholder="e.g. 3"
                                        />
                                      </SelectWrap>
                                    </div>
                                  </div>

                                  <div className="sm:col-span-2">
                                    <FieldLabel icon={Coins} label="Commission" sub="Non-negative" />
                                    <div className="mt-2">
                                      <SelectWrap disabled={adding}>
                                        <input
                                          type="number"
                                          inputMode="decimal"
                                          step="0.01"
                                          min="0"
                                          value={addForm.commission}
                                          disabled={adding}
                                          onChange={(e) =>
                                            setAddForm((p) => ({ ...p, commission: e.target.value }))
                                          }
                                          className={cx(
                                            "w-full bg-transparent px-4 py-3.5",
                                            "outline-none text-white/90 text-[13px] font-black disabled:cursor-not-allowed"
                                          )}
                                          placeholder="e.g. 0.50"
                                        />
                                      </SelectWrap>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-5 flex justify-center">
                                  <motion.button
                                    type="button"
                                    onClick={submitAddBar}
                                    disabled={adding}
                                    whileHover={adding ? {} : { y: -2 }}
                                    whileTap={adding ? {} : { scale: 0.98 }}
                                    className={cx(
                                      "w-full sm:w-auto rounded-2xl px-7 py-3 text-[12px] font-black inline-flex items-center justify-center gap-2",
                                      adding
                                        ? "bg-white/10 text-white/40 cursor-not-allowed"
                                        : "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110"
                                    )}
                                  >
                                    <Check className="h-4 w-4" />
                                    {adding ? "Submitting…" : "Submit"}
                                  </motion.button>
                                </div>
                              </NeonFrame>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <motion.div
                  className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18 }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <Pill tone="emerald">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      RULES
                    </Pill>
                    <span className="text-[11px] font-black tracking-wide text-white/55">GUARD</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </NeonFrame>
        </motion.div>

        {/* TABLE / MOBILE CARDS */}
        <motion.div variants={inUp} className="mt-6">
          <NeonFrame className="p-4 sm:p-6">
            {/* header row responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-[11px] text-white/55 font-black tracking-wide">TABLE</div>
                <div className="mt-1 text-xl font-black text-white/90">Levels Commission</div>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
                <Pill tone={loading ? "blue" : configuredCount ? "green" : "gray"}>
                  <Gauge className="h-3.5 w-3.5" />
                  {loading ? "SYNCING" : "LIVE"}
                </Pill>

                {/* account type select - full width on mobile */}
                <div className="w-full sm:w-[320px]">
                  <SelectWrap disabled={!accountsTypes?.length}>
                    <select
                      value={currentAccount?._id || ""}
                      onChange={(e) => {
                        const sel = accountsTypes.find((v) => v?._id === e.target.value) || null;
                        setCurrentAccount(sel);
                        setIsAddBarOpen(false);
                      }}
                      disabled={!accountsTypes?.length}
                      className={cx(
                        "w-full appearance-none bg-transparent px-4 py-3.5 pr-10",
                        "outline-none text-white/90 text-[13px] font-black disabled:cursor-not-allowed"
                      )}
                    >
                      <option value="" disabled className="bg-[#0b0d14]">
                        {accountsTypes?.length ? "Select Account" : "Loading…"}
                      </option>
                      {accountsTypes.map((v) => (
                        <option key={v?._id} value={v?._id} className="bg-[#0b0d14]">
                          {v?.customGroup}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none" />
                  </SelectWrap>
                </div>
              </div>
            </div>

            {/* ✅ MOBILE: Card list */}
            <div className="mt-5 md:hidden space-y-3">
              {loading ? (
                <div className="p-6 text-center text-white/55 font-black text-[12px]">
                  Loading levels…
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {formData.map((row, index) => {
                    const isEditing = editingIndex === index;
                    const isSaving = savingIdx === index;
                    const isDeleting = deletingIdx === index;

                    return (
                      <motion.div
                        key={row.level}
                        variants={rowAnim}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 220, damping: 18 }}
                        className="rounded-3xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
                              <span className="text-base font-black text-white/90">{row.level}</span>
                            </div>
                            <div>
                              <div className="text-[11px] text-white/50 font-black tracking-wide">LEVEL</div>
                              <div className="text-[13px] font-black text-white/90">Level {row.level}</div>
                            </div>
                          </div>

                          <Pill tone={row.id ? "emerald" : "gray"}>{row.id ? "SAVED" : "NEW"}</Pill>
                        </div>

                        <div className="mt-3">
                          <div className="text-[11px] text-white/50 font-black tracking-wide mb-2">
                            COMMISSION
                          </div>

                          {isEditing ? (
                            <SelectWrap disabled={isSaving || isDeleting}>
                              <input
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                min="0"
                                value={row.levelBonus}
                                disabled={isSaving || isDeleting}
                                onChange={(e) => handleInputChange(index, "levelBonus", e.target.value)}
                                placeholder="e.g. 3.50"
                                className={cx(
                                  "w-full bg-transparent px-4 py-3.5",
                                  "outline-none text-white/90 text-[13px] font-black disabled:cursor-not-allowed"
                                )}
                              />
                            </SelectWrap>
                          ) : (
                            <Pill tone={row.levelBonus !== "" && Number(row.levelBonus) > 0 ? "green" : "gray"}>
                              {row.levelBonus !== "" ? row.levelBonus : "Not set"}
                            </Pill>
                          )}
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <motion.button
                                type="button"
                                disabled={isSaving || isDeleting}
                                onClick={() => handleSave(index)}
                                whileHover={isSaving || isDeleting ? {} : { y: -2 }}
                                whileTap={isSaving || isDeleting ? {} : { scale: 0.98 }}
                                className={cx(
                                  "w-full rounded-2xl px-4 py-3 text-[12px] font-black inline-flex items-center justify-center gap-2 border border-white/10",
                                  isSaving || isDeleting
                                    ? "bg-white/10 text-white/40 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110"
                                )}
                              >
                                <Check className="h-4 w-4" />
                                {isSaving ? "Saving…" : "Save"}
                              </motion.button>

                              <motion.button
                                type="button"
                                disabled={isSaving || isDeleting}
                                onClick={handleCancel}
                                whileHover={isSaving || isDeleting ? {} : { y: -2 }}
                                whileTap={isSaving || isDeleting ? {} : { scale: 0.98 }}
                                className={cx(
                                  "w-full rounded-2xl px-4 py-3 text-[12px] font-black inline-flex items-center justify-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white/85",
                                  (isSaving || isDeleting) && "opacity-60 cursor-not-allowed"
                                )}
                              >
                                <X className="h-4 w-4" />
                                Cancel
                              </motion.button>
                            </>
                          ) : (
                            <motion.button
                              type="button"
                              onClick={() => handleEdit(index)}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full rounded-2xl px-4 py-3 text-[12px] font-black inline-flex items-center justify-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white/85"
                            >
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </motion.button>
                          )}
                        </div>

                        <div className="mt-2 text-right text-[11px] text-white/45 font-mono">
                          {row.id ? String(row.id).slice(0, 14) + "…" : "—"}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* ✅ DESKTOP: your table unchanged */}
            <div className="mt-5 hidden md:block overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="max-h-[66vh] overflow-auto [scrollbar-width:thin]">
                <table className="w-full min-w-[740px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#04050b]/80 backdrop-blur-2xl">
                      <th className="text-left px-5 py-4 text-[11px] font-black tracking-[0.2em] text-white/55">
                        LEVELS
                      </th>
                      <th className="text-left px-5 py-4 text-[11px] font-black tracking-[0.2em] text-white/55">
                        COMMISSION
                      </th>
                      <th className="text-right px-5 py-4 text-[11px] font-black tracking-[0.2em] text-white/55">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <AnimatePresence initial={false}>
                      {formData.map((row, index) => {
                        const isEditing = editingIndex === index;
                        const isSaving = savingIdx === index;
                        const isDeleting = deletingIdx === index;

                        return (
                          <motion.tr
                            key={row.level}
                            variants={rowAnim}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 220, damping: 18 }}
                            className="border-t border-white/10"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
                                  <span className="text-base font-black text-white/90">{row.level}</span>
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[11px] text-white/50 font-black tracking-wide">LEVEL</div>
                                  <div className="text-[13px] font-black text-white/90">Level {row.level}</div>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {isEditing ? (
                                  <div className="w-full max-w-[260px]">
                                    <SelectWrap disabled={isSaving || isDeleting}>
                                      <input
                                        type="number"
                                        inputMode="decimal"
                                        step="0.01"
                                        min="0"
                                        value={row.levelBonus}
                                        disabled={isSaving || isDeleting}
                                        onChange={(e) => handleInputChange(index, "levelBonus", e.target.value)}
                                        placeholder="e.g. 3.50"
                                        className={cx(
                                          "w-full bg-transparent px-4 py-3.5",
                                          "outline-none text-white/90 text-[13px] font-black disabled:cursor-not-allowed"
                                        )}
                                      />
                                    </SelectWrap>
                                  </div>
                                ) : (
                                  <Pill tone={row.levelBonus !== "" && Number(row.levelBonus) > 0 ? "green" : "gray"}>
                                    {row.levelBonus !== "" ? row.levelBonus : "Not set"}
                                  </Pill>
                                )}

                                <Pill tone={row.id ? "emerald" : "gray"}>{row.id ? "SAVED" : "NEW"}</Pill>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-2">
                                {isEditing ? (
                                  <>
                                    <motion.button
                                      type="button"
                                      disabled={isSaving || isDeleting}
                                      onClick={() => handleSave(index)}
                                      whileHover={isSaving || isDeleting ? {} : { y: -2 }}
                                      whileTap={isSaving || isDeleting ? {} : { scale: 0.98 }}
                                      className={cx(
                                        "h-10 w-10 rounded-2xl grid place-items-center border border-white/10",
                                        isSaving || isDeleting
                                          ? "bg-white/10 text-white/40 cursor-not-allowed"
                                          : "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110"
                                      )}
                                      title="Save"
                                    >
                                      <Check className="h-4 w-4" />
                                    </motion.button>

                                    <motion.button
                                      type="button"
                                      disabled={isSaving || isDeleting}
                                      onClick={handleCancel}
                                      whileHover={isSaving || isDeleting ? {} : { y: -2 }}
                                      whileTap={isSaving || isDeleting ? {} : { scale: 0.98 }}
                                      className={cx(
                                        "h-10 w-10 rounded-2xl grid place-items-center border border-white/10 bg-white/5 hover:bg-white/10 text-white/85",
                                        (isSaving || isDeleting) && "opacity-60 cursor-not-allowed"
                                      )}
                                      title="Cancel"
                                    >
                                      <X className="h-4 w-4" />
                                    </motion.button>
                                  </>
                                ) : (
                                  <>
                                    <motion.button
                                      type="button"
                                      onClick={() => handleEdit(index)}
                                      whileHover={{ y: -2 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="h-10 w-10 rounded-2xl grid place-items-center border border-white/10 bg-white/5 hover:bg-white/10 text-white/85"
                                      title="Edit"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </motion.button>

                                    {/* Delete kept commented to preserve your workflow */}
                                  </>
                                )}
                              </div>

                              <div className="mt-2 text-right text-[11px] text-white/45 font-mono">
                                {row.id ? String(row.id).slice(0, 14) + "…" : "—"}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>

                    {loading && (
                      <tr>
                        <td colSpan={3} className="px-5 py-10 text-center text-white/50 text-[12px] font-black tracking-wide">
                          Loading levels…
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </NeonFrame>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminIbZone;

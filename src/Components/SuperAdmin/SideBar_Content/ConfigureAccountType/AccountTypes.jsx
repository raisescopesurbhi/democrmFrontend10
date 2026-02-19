import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  RefreshCw,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Database,
  Layers,
  SlidersHorizontal,
  BadgeCheck,
} from "lucide-react";
//import backendApi from "../../../../../backendApi";

import { backendApi } from "../../../../utils/apiClients";

const cx = (...c) => c.filter(Boolean).join(" ");

/* =========================================================================
   💚💗💙 THEME: "NEON REACTOR / CIRCUIT RAVE" (NO REACTOR USED)
   - Same theme/gradients/animations style as UserNewChallenge
   - Layout is fully reworked
   - APIs/workflow unchanged
   ======================================================================= */

const NeonBackdrop = () => {
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
      <motion.div
        className="absolute -top-44 right-16 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(circle at 45% 45%, rgba(16,185,129,0.55), transparent 64%)",
        }}
        animate={{ scale: [1, 1.09, 1], x: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
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

const InputWrap = ({ disabled, children }) => (
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
const btnDisabled = "bg-white/10 text-white/40 cursor-not-allowed";
const btnGhost = "border border-white/10 bg-white/5 hover:bg-white/10 text-white/80";
const btnDanger =
  "border border-pink-300/20 bg-pink-500/10 hover:bg-pink-500/15 text-pink-100";

const AccountTypes = () => {
  const [accountTypes, setAccountTypes] = useState([]); // custom groups
  const [existingData, setExistingData] = useState([]); // account types already created

  const [tab, setTab] = useState("create"); // create | list
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [newAccountType, setNewAccountType] = useState({
    accountType: "",
    apiGroup: "",
    leverage: [{ label: "", value: "" }],
    accountSize: [{ deposit: "", balance: "" }],
  });

  const fetchAccountTypes = async () => {
    setIsFetching(true);
    try {
      const res = await backendApi.get(`/s-admin/get-custom-groups`);
      setAccountTypes(res.data.data || []);
    } catch {
      toast.error("Failed to fetch account types");
    } finally {
      setIsFetching(false);
    }
  };

  const fetchExistingData = async () => {
    setIsFetching(true);
    try {
      const res = await backendApi.get(`/s-admin/get-account-types`);
      setExistingData(res.data.data || []);
    } catch {
      toast.error("Failed to fetch existing data");
    } finally {
      setIsFetching(false);
    }
  };

  const handleRefresh = () => {
    fetchAccountTypes();
    fetchExistingData();
  };

  useEffect(() => {
    fetchAccountTypes();
    fetchExistingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedOptions = useMemo(() => accountTypes || [], [accountTypes]);

  const handleAccountTypeSelect = (value) => {
    const selectedType = selectedOptions.find((t) => t.customGroup === value);
    setNewAccountType((prev) => ({
      ...prev,
      accountType: selectedType?.customGroup || "",
      apiGroup: selectedType?.apiGroup || "",
    }));
  };

  const updateLeverage = (idx, key, value) => {
    setNewAccountType((prev) => {
      const next = [...prev.leverage];
      next[idx] = { ...next[idx], [key]: value };
      return { ...prev, leverage: next };
    });
  };

  const updateSize = (idx, key, value) => {
    setNewAccountType((prev) => {
      const next = [...prev.accountSize];
      next[idx] = { ...next[idx], [key]: value };
      return { ...prev, accountSize: next };
    });
  };

  const addRow = (field) => {
    setNewAccountType((prev) => ({
      ...prev,
      [field]: [
        ...prev[field],
        field === "leverage" ? { label: "", value: "" } : { deposit: "", balance: "" },
      ],
    }));
  };

  const removeRow = (field, idx) => {
    setNewAccountType((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newAccountType.accountType || !newAccountType.apiGroup) {
      toast.error("Please select an Account Type (custom group).");
      return;
    }

    setIsLoading(true);
    try {
      await backendApi.post(`/s-admin/add-account-type`, {
        apiGroup: newAccountType.apiGroup,
        accountType: newAccountType.accountType,
        leverage: newAccountType.leverage,
        accountSize: newAccountType.accountSize,
      });

      toast.success("Account type added successfully!");
      setNewAccountType({
        accountType: "",
        apiGroup: "",
        leverage: [{ label: "", value: "" }],
        accountSize: [{ deposit: "", balance: "" }],
      });

      setTab("list");
      fetchExistingData();
    } catch {
      toast.error("Failed to add account type");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHandler = async (id, accountTypeName) => {
    if (!window.confirm(`Delete "${accountTypeName}"?`)) return;

    setIsLoading(true);
    try {
      await backendApi.delete(`/s-admin/delete-account-type?id=${id}`);
      toast.success("Deleted successfully!");
      fetchExistingData();
    } catch {
      toast.error("Failed to delete account type");
    } finally {
      setIsLoading(false);
    }
  };

  const counts = useMemo(
    () => ({ groups: accountTypes.length, types: existingData.length }),
    [accountTypes.length, existingData.length]
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

  const step = useMemo(() => {
    if (!newAccountType.accountType) return 1;
    const hasLev = newAccountType.leverage?.some((x) => x?.label?.trim() && x?.value?.trim());
    if (!hasLev) return 2;
    const hasSize = newAccountType.accountSize?.some((x) => x?.deposit?.toString().trim() && x?.balance?.toString().trim());
    if (!hasSize) return 3;
    return 4;
  }, [newAccountType]);

  const progress = useMemo(() => (step / 4) * 100, [step]);

  return (
    <div className="relative w-full min-h-[75vh] overflow-hidden text-white">
      <NeonBackdrop />

      <motion.div
        variants={page}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9"
      >
        {/* HERO */}
        <motion.div variants={inUp}>
          <NeonFrame className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Pill tone="green">
                    <Sparkles className="h-3.5 w-3.5" />
                    CIRCUIT RAVE
                  </Pill>
                  <Pill tone={tab === "create" ? "blue" : "pink"}>
                    <Database className="h-3.5 w-3.5" />
                    {tab === "create" ? "FORGE" : "REGISTRY"}
                  </Pill>
                  <Pill tone="emerald">
                    <Layers className="h-3.5 w-3.5" />
                    {counts.types} types
                  </Pill>
                  <Pill tone="gray">{counts.groups} groups</Pill>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                    Account Type Forge
                  </span>
                </h1>
                <p className="text-white/70 mt-2 max-w-2xl">
                  Build account configurations from custom groups, leverage presets and account size blueprints.
                </p>

                {/* progress bar (same style as UserNewChallenge) */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-[11px] font-black tracking-wide text-white/55">
                    <span className="inline-flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-green-200" />
                      Blueprint Completion
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full border border-white/10 bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(34,197,94,0.95), rgba(59,130,246,0.95), rgba(236,72,153,0.95), rgba(16,185,129,0.90))",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ type: "spring", stiffness: 160, damping: 18 }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={isFetching ? {} : { y: -2 }}
                  whileTap={isFetching ? {} : { scale: 0.98 }}
                  onClick={handleRefresh}
                  disabled={isFetching}
                  className={cx(
                    "rounded-2xl px-4 py-2 text-[12px] font-black inline-flex items-center gap-2 transition",
                    isFetching ? btnDisabled : btnPrimary
                  )}
                >
                  {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Refresh
                </motion.button>
              </div>
            </div>

            {/* tabs (new layout) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTab("create")}
                className={cx(
                  "rounded-2xl border px-4 py-3 text-left transition",
                  tab === "create"
                    ? "border-green-300/25 bg-green-500/12 shadow-[0_0_34px_rgba(34,197,94,0.18)]"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                )}
              >
                <div className="flex items-center justify-between">
                  <Pill tone={tab === "create" ? "green" : "gray"}>
                    <Sparkles className="h-3.5 w-3.5" />
                    CREATE
                  </Pill>
                  <span className="text-[11px] font-black text-white/55">Step {step}/4</span>
                </div>
                <div className="mt-2 text-sm font-black text-white/90">Forge a new account type</div>
                <div className="text-[12px] text-white/55">Pick group → set leverage → set sizes → save.</div>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTab("list")}
                className={cx(
                  "rounded-2xl border px-4 py-3 text-left transition",
                  tab === "list"
                    ? "border-pink-300/25 bg-pink-500/12 shadow-[0_0_34px_rgba(236,72,153,0.16)]"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                )}
              >
                <div className="flex items-center justify-between">
                  <Pill tone={tab === "list" ? "pink" : "gray"}>
                    <Database className="h-3.5 w-3.5" />
                    EXISTING
                  </Pill>
                  <span className="text-[11px] font-black text-white/55">{existingData.length} items</span>
                </div>
                <div className="mt-2 text-sm font-black text-white/90">Manage existing types</div>
                <div className="text-[12px] text-white/55">Review and delete account type definitions.</div>
              </motion.button>
            </div>
          </NeonFrame>
        </motion.div>

        {/* BODY */}
        <AnimatePresence mode="wait">
          {tab === "create" ? (
            <motion.div
              key="create"
              variants={inUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5"
            >
              {/* LEFT: Builder */}
              <NeonFrame className="lg:col-span-7 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-white/55 font-black tracking-wide">BUILDER</div>
                    <div className="mt-1 text-xl font-black text-white/90 inline-flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-blue-200" />
                      Configure Blueprint
                    </div>
                  </div>
                  <Pill tone={step === 4 ? "emerald" : "blue"}>{step === 4 ? "READY" : "DRAFT"}</Pill>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                  {/* Custom Group / API Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-[12px] text-white/75 font-black tracking-wide mb-2">
                        Custom Group (Account Type)
                      </div>
                      <InputWrap disabled={isLoading || isFetching}>
                        <select
                          value={newAccountType.accountType}
                          onChange={(e) => handleAccountTypeSelect(e.target.value)}
                          disabled={isLoading || isFetching}
                          className={cx(
                            "w-full appearance-none bg-transparent px-4 py-3.5 pr-10",
                            "outline-none text-white/90 text-[13px] font-black"
                          )}
                        >
                          <option value="" className="bg-[#0b0d14]">
                            Select…
                          </option>
                          {accountTypes.map((t) => (
                            <option key={t._id} value={t.customGroup} className="bg-[#0b0d14]">
                              {t.customGroup}
                            </option>
                          ))}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none">
                          ▾
                        </span>
                      </InputWrap>
                      <div className="mt-1 text-[11px] text-white/45">
                        Picks from your custom groups mapping.
                      </div>
                    </div>

                    <div>
                      <div className="text-[12px] text-white/75 font-black tracking-wide mb-2">
                        API Group (Auto)
                      </div>
                      <InputWrap disabled>
                        <input
                          value={newAccountType.apiGroup}
                          readOnly
                          placeholder="Auto from selection"
                          className={cx(
                            "w-full bg-transparent px-4 py-3.5",
                            "outline-none text-white/90 text-[13px] font-black placeholder:text-white/35"
                          )}
                        />
                      </InputWrap>
                      <div className="mt-1 text-[11px] text-white/45">Read-only derived field.</div>
                    </div>
                  </div>

                  {/* Leverage */}
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Pill tone="blue">LEVERAGE</Pill>
                        <div className="mt-2 text-[12px] text-white/60">
                          Add label + value pairs (example: <span className="font-black text-white/80">Standard → 1:100</span>).
                        </div>
                      </div>

                      <motion.button
                        type="button"
                        onClick={() => addRow("leverage")}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={cx("rounded-2xl px-4 py-2 text-[12px] font-black inline-flex items-center gap-2", btnGhost)}
                      >
                        <Plus size={16} />
                        Add
                      </motion.button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {newAccountType.leverage.map((lv, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 220, damping: 18 }}
                          className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3"
                        >
                          <InputWrap>
                            <input
                              value={lv.label}
                              onChange={(e) => updateLeverage(idx, "label", e.target.value)}
                              placeholder="Label (e.g. Standard)"
                              className="w-full bg-transparent px-4 py-3.5 outline-none text-white/90 text-[13px] font-black placeholder:text-white/35"
                            />
                          </InputWrap>

                          <InputWrap>
                            <input
                              value={lv.value}
                              onChange={(e) => updateLeverage(idx, "value", e.target.value)}
                              placeholder="Value (e.g. 1:100)"
                              className="w-full bg-transparent px-4 py-3.5 outline-none text-white/90 text-[13px] font-black placeholder:text-white/35"
                            />
                          </InputWrap>

                          <motion.button
                            type="button"
                            onClick={() => removeRow("leverage", idx)}
                            disabled={newAccountType.leverage.length === 1}
                            whileHover={newAccountType.leverage.length === 1 ? {} : { y: -2 }}
                            whileTap={newAccountType.leverage.length === 1 ? {} : { scale: 0.98 }}
                            className={cx(
                              "rounded-2xl px-3 py-3 inline-flex items-center justify-center transition",
                              newAccountType.leverage.length === 1 ? btnDisabled : btnDanger
                            )}
                            title="Remove"
                          >
                            <Minus size={18} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Account Sizes */}
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Pill tone="green">ACCOUNT SIZES</Pill>
                        <div className="mt-2 text-[12px] text-white/60">
                          Add deposit + balance presets (example: <span className="font-black text-white/80">500 → 500</span>).
                        </div>
                      </div>

                      <motion.button
                        type="button"
                        onClick={() => addRow("accountSize")}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={cx("rounded-2xl px-4 py-2 text-[12px] font-black inline-flex items-center gap-2", btnGhost)}
                      >
                        <Plus size={16} />
                        Add
                      </motion.button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {newAccountType.accountSize.map((sz, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 220, damping: 18 }}
                          className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3"
                        >
                          <InputWrap>
                            <input
                              value={sz.deposit}
                              onChange={(e) => updateSize(idx, "deposit", e.target.value)}
                              placeholder="Deposit"
                              className="w-full bg-transparent px-4 py-3.5 outline-none text-white/90 text-[13px] font-black placeholder:text-white/35"
                            />
                          </InputWrap>

                          <InputWrap>
                            <input
                              value={sz.balance}
                              onChange={(e) => updateSize(idx, "balance", e.target.value)}
                              placeholder="Balance"
                              className="w-full bg-transparent px-4 py-3.5 outline-none text-white/90 text-[13px] font-black placeholder:text-white/35"
                            />
                          </InputWrap>

                          <motion.button
                            type="button"
                            onClick={() => removeRow("accountSize", idx)}
                            disabled={newAccountType.accountSize.length === 1}
                            whileHover={newAccountType.accountSize.length === 1 ? {} : { y: -2 }}
                            whileTap={newAccountType.accountSize.length === 1 ? {} : { scale: 0.98 }}
                            className={cx(
                              "rounded-2xl px-3 py-3 inline-flex items-center justify-center transition",
                              newAccountType.accountSize.length === 1 ? btnDisabled : btnDanger
                            )}
                            title="Remove"
                          >
                            <Minus size={18} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button
                    whileHover={isLoading ? {} : { y: -2 }}
                    whileTap={isLoading ? {} : { scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className={cx(
                      "w-full rounded-2xl px-5 py-3.5 text-[13px] font-black transition inline-flex items-center justify-center gap-2",
                      isLoading ? btnDisabled : btnPrimary
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Create Account Type
                      </>
                    )}
                  </motion.button>
                </form>
              </NeonFrame>

              {/* RIGHT: Live Preview */}
              <NeonFrame className="lg:col-span-5 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-white/55 font-black tracking-wide">PREVIEW</div>
                    <div className="mt-1 text-xl font-black text-white/90">Live Blueprint</div>
                  </div>
                  <Pill tone={step === 4 ? "emerald" : "gray"}>{step === 4 ? "VALID" : "INCOMPLETE"}</Pill>
                </div>

                <div className="mt-5 space-y-4">
                  <InfoBlock label="Account Type" value={newAccountType.accountType || "—"} />
                  <InfoBlock label="API Group" value={newAccountType.apiGroup || "—"} />

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-[11px] font-black tracking-wide text-white/55">LEVERAGE</div>
                    <div className="mt-3 space-y-2">
                      {newAccountType.leverage.map((l, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
                        >
                          <span className="text-[12px] font-black text-white/85 truncate max-w-[55%]">
                            {l.label || "—"}
                          </span>
                          <span className="text-[12px] font-black text-white/70">{l.value || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-[11px] font-black tracking-wide text-white/55">ACCOUNT SIZES</div>
                    <div className="mt-3 space-y-2">
                      {newAccountType.accountSize.map((s, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
                        >
                          <span className="text-[12px] font-black text-white/85">
                            Deposit: {s.deposit || "—"}
                          </span>
                          <span className="text-[12px] font-black text-white/70">
                            Balance: {s.balance || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-[11px] font-black tracking-wide text-white/55">STATUS</div>
                    <div className="mt-3 space-y-2">
                      <ChecklistRow ok={!!newAccountType.accountType} text="Custom group selected" />
                      <ChecklistRow ok={!!newAccountType.apiGroup} text="API group loaded" />
                      <ChecklistRow
                        ok={newAccountType.leverage.some((x) => x?.label?.trim() && x?.value?.trim())}
                        text="Leverage preset configured"
                      />
                      <ChecklistRow
                        ok={newAccountType.accountSize.some((x) => x?.deposit?.toString().trim() && x?.balance?.toString().trim())}
                        text="Account size preset configured"
                      />
                    </div>
                  </div>
                </div>
              </NeonFrame>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={inUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5"
            >
              {/* LEFT: list cards */}
              <NeonFrame className="lg:col-span-5 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-white/55 font-black tracking-wide">COLLECTION</div>
                    <div className="mt-1 text-xl font-black text-white/90">Types</div>
                  </div>
                  <Pill tone="pink">{existingData.length} total</Pill>
                </div>

                <div className="mt-4">
                  {isFetching ? (
                    <div className="flex justify-center items-center py-14">
                      <Loader2 className="h-10 w-10 text-white/80 animate-spin" />
                    </div>
                  ) : existingData.length === 0 ? (
                    <div className="py-14 text-center">
                      <div className="text-white/70 font-black">No account types yet</div>
                      <div className="text-white/45 text-sm mt-1">Create one from the Forge tab.</div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[68vh] overflow-y-auto pr-1">
                      <AnimatePresence initial={false}>
                        {existingData.map((row, idx) => (
                          <motion.div
                            key={row?._id || idx}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 220, damping: 18, delay: idx * 0.01 }}
                            className="rounded-3xl border border-white/10 bg-white/5 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-[11px] text-white/55 font-black tracking-wide">ACCOUNT TYPE</div>
                                <div className="mt-1 text-[13px] font-black text-white/90 break-words">
                                  {row?.accountType || "—"}
                                </div>

                                <div className="mt-3 text-[11px] text-white/55 font-black tracking-wide">API GROUP</div>
                                <div className="mt-1 text-[13px] font-black text-white/80 break-words">
                                  {row?.apiGroup || "—"}
                                </div>

                                <div className="mt-3 flex items-center gap-2 flex-wrap">
                                  <Pill tone="pink">#{idx + 1}</Pill>
                                  <Pill tone="blue">CONFIG</Pill>
                                  <Pill tone="green">MT5</Pill>
                                </div>
                              </div>

                              <motion.button
                                type="button"
                                onClick={() => deleteHandler(row._id, row.accountType)}
                                disabled={isLoading}
                                whileHover={isLoading ? {} : { y: -2, scale: 1.02 }}
                                whileTap={isLoading ? {} : { scale: 0.98 }}
                                className={cx(
                                  "rounded-2xl p-3 inline-flex items-center justify-center transition",
                                  isLoading ? btnDisabled : btnDanger
                                )}
                                aria-label="Delete account type"
                                title="Delete"
                              >
                                <Trash2 className="h-5 w-5" />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </NeonFrame>

              {/* RIGHT: table */}
              <NeonFrame className="lg:col-span-7 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-white/55 font-black tracking-wide">TABLE</div>
                    <div className="mt-1 text-xl font-black text-white/90">Registry View</div>
                  </div>
                  <Pill tone="gray">ACTIONS</Pill>
                </div>

                <div className="mt-4">
                  {isFetching ? (
                    <div className="flex justify-center items-center py-14">
                      <Loader2 className="h-10 w-10 text-white/80 animate-spin" />
                    </div>
                  ) : existingData.length === 0 ? (
                    <div className="py-14 text-center">
                      <div className="text-white/70 font-black">No rows</div>
                      <div className="text-white/45 text-sm mt-1">Nothing to display.</div>
                    </div>
                  ) : (
                    <div className="hidden lg:block overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <div className="max-h-[68vh] overflow-y-auto">
                        <table className="min-w-full">
                          <thead className="sticky top-0 z-10 bg-[#070915]/90 backdrop-blur border-b border-white/10">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-black tracking-wider text-white/70">
                                #
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-black tracking-wider text-white/70">
                                Account Type
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-black tracking-wider text-white/70">
                                API Group
                              </th>
                              <th className="px-6 py-4 text-right text-xs font-black tracking-wider text-white/70">
                                Action
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-white/10">
                            {existingData.map((row, idx) => (
                              <tr key={row?._id || idx} className="hover:bg-white/[0.06] transition-colors">
                                <td className="px-6 py-4 text-sm text-white/70 font-black">{idx + 1}</td>
                                <td className="px-6 py-4 text-sm text-white/90 font-black break-all">
                                  {row?.accountType || "—"}
                                </td>
                                <td className="px-6 py-4 text-sm text-white/80 font-black break-all">
                                  {row?.apiGroup || "—"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <motion.button
                                    type="button"
                                    onClick={() => deleteHandler(row._id, row.accountType)}
                                    disabled={isLoading}
                                    whileHover={isLoading ? {} : { y: -2, scale: 1.02 }}
                                    whileTap={isLoading ? {} : { scale: 0.98 }}
                                    className={cx(
                                      "inline-flex items-center justify-center rounded-2xl p-2.5 transition",
                                      isLoading ? btnDisabled : btnDanger
                                    )}
                                    aria-label="Delete"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </motion.button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="lg:hidden mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-white/60 text-sm">
                    Use the <span className="font-black text-white/80">Types</span> panel to manage entries on mobile.
                  </div>
                </div>
              </NeonFrame>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={inUp} className="text-center text-white/45 mt-8 text-[12px]">
          Neon circuit theme · green/pink/blue on deep black ✨
        </motion.div>
      </motion.div>
    </div>
  );
};

function InfoBlock({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="text-[11px] font-black tracking-wide text-white/55">{label.toUpperCase()}</div>
      <div className="mt-1 text-[13px] font-black text-white/90 break-words">{value}</div>
    </div>
  );
}

function ChecklistRow({ ok, text }) {
  return (
    <motion.div
      layout
      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cx(
            "h-9 w-9 rounded-2xl border grid place-items-center",
            ok ? "border-green-300/25 bg-green-500/10" : "border-white/10 bg-white/5"
          )}
        >
          {ok ? (
            <span className="h-2.5 w-2.5 rounded-full bg-green-300 shadow-[0_0_18px_rgba(34,197,94,0.55)]" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-white/30" />
          )}
        </div>
        <span className={cx("text-[12px] font-black truncate", ok ? "text-white/85" : "text-white/55")}>
          {text}
        </span>
      </div>
      <Pill tone={ok ? "green" : "gray"}>{ok ? "OK" : "TODO"}</Pill>
    </motion.div>
  );
}

export default AccountTypes;

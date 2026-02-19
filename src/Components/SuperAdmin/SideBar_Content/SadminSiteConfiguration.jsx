import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  X,
  Loader2,
  ExternalLink,
  Save,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  Image as ImageIcon,
  ToggleLeft,
  Gauge,
  ShieldCheck,
} from "lucide-react";
// import backendApi from "../../../../backendApi";
import { backendApi } from "../../../utils/apiClients";

const cx = (...c) => c.filter(Boolean).join(" ");

/* =========================================================================
   💚💗💙 THEME: "NEON REACTOR / CIRCUIT RAVE" (NO REACTOR RING)
   - Same gradients + animations from UserNewChallenge:
     backdrop blobs + scan beam + moving lines + particles
     neon conic rotating border + shimmer
   - Completely different layout: Module Navigator | Editor | Live Preview
   - APIs/workflow unchanged
   ======================================================================= */

const NeonCircuitBackdrop = () => {
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
const btnGhost =
  "rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80";

const Tile = ({ icon, label, value, tone = "green" }) => {
  const tones = {
    green: "border-green-300/25 bg-green-500/10",
    blue: "border-blue-300/25 bg-blue-500/10",
    pink: "border-pink-300/25 bg-pink-500/10",
    emerald: "border-emerald-300/25 bg-emerald-500/10",
  };
  return (
    <motion.div
      whileHover={{ y: -4, rotate: -0.2 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={cx(
        "rounded-3xl border p-4 bg-white/[0.04] overflow-hidden",
        tones[tone] || tones.green
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] text-white/55 font-black tracking-wide">{label}</div>
          <div className="mt-1 text-lg font-black text-white/90 truncate">{value}</div>
        </div>
        <div className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const ToggleChip = ({ enabled }) => (
  <span
    className={cx(
      "rounded-full px-3 py-1 text-[11px] font-black border",
      enabled
        ? "bg-green-500/12 text-green-100 border-green-300/25"
        : "bg-pink-500/10 text-pink-100 border-pink-300/25"
    )}
  >
    {enabled ? "ENABLED" : "DISABLED"}
  </span>
);

const NeonToggle = ({ name, checked, onChange, disabled }) => {
  return (
    <label className={cx("relative inline-flex items-center", disabled && "opacity-60")}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
        disabled={disabled}
      />
      <div className="w-12 h-7 rounded-full border border-white/10 bg-white/5 peer-checked:bg-green-500/15 transition-all duration-300" />
      <div
        className={cx(
          "absolute top-1 h-5 w-5 rounded-full transition-all duration-300 shadow-[0_0_18px_rgba(34,197,94,0.25)]",
          checked ? "left-6 bg-green-300" : "left-1 bg-white/40"
        )}
      />
    </label>
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

const SadminSiteConfiguration = () => {
  const [details, setDetails] = useState({
    serverName: "",
    mt5Digit: "",
    websiteName: "",
    logo: "",
    favicon: "",
    inrUi: false,
    bankDetailsUi: false,
    kycForWithdrawal: false,
    emailToAll: false,
    ibZone: false,
    logoSize: 4,
  });

  const [activeModule, setActiveModule] = useState("general"); // general | ui | media
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const generalSettingsFields = useMemo(
    () => [
      { name: "serverName", type: "text", placeholder: "Enter server name" },
      { name: "mt5Digit", type: "text", placeholder: "Enter MT5 digit" },
      { name: "websiteName", type: "text", placeholder: "Enter website name" },
      { name: "logoSize", type: "number", placeholder: "Logo size in rem" },
    ],
    []
  );

  const uiSettings = useMemo(
    () => [
      { name: "inrUi", description: "Enable or disable INR UI" },
      { name: "bankDetailsUi", description: "Show bank details in account" },
      { name: "kycForWithdrawal", description: "Require KYC for withdrawal" },
      { name: "emailToAll", description: "Allow admin to email all users" },
      { name: "ibZone", description: "Enable/Disable IB panel" },
    ],
    []
  );

  const mediaAssets = useMemo(
    () => [
      { name: "logo", placeholder: "Logo URL", altText: "Logo" },
      { name: "favicon", placeholder: "Favicon URL", altText: "Favicon" },
    ],
    []
  );

  // ✅ API unchanged
  const fetchData = async () => {
    try {
      const res = await backendApi.get("/s-admin/site-config");
      setDetails((prev) => ({ ...prev, ...(res.data.data || {}) }));
    } catch (err) {
      console.error("❌ Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {  
    const { name, value, type, checked } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ API unchanged
  const handleSave = async () => {
    setSaving(true);
    try {
      await backendApi.put("/s-admin/site-config", details);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Save Error:", err);
    } finally {
      setSaving(false);
    }
  };

  const formatLabel = (key) =>
    key
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const completion = useMemo(() => {
    const fields = ["serverName", "mt5Digit", "websiteName", "logo", "favicon", "logoSize"];
    const filled = fields.reduce((acc, k) => {
      const v = details[k];
      if (k === "logoSize") return acc + (String(v ?? "").trim() ? 1 : 0);
      return acc + (String(v ?? "").trim() ? 1 : 0);
    }, 0);
    return { filled, total: fields.length, pct: Math.round((filled / fields.length) * 100) };
  }, [details]);

  const enabledCount = useMemo(() => {
    const keys = ["inrUi", "bankDetailsUi", "kycForWithdrawal", "emailToAll", "ibZone"];
    return keys.reduce((acc, k) => acc + (details[k] ? 1 : 0), 0);
  }, [details]);

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
                    NEON CONFIG CONSOLE
                  </Pill>
                  <Pill tone={isEditing ? "pink" : "emerald"}>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {isEditing ? "EDIT MODE" : "READ MODE"}
                  </Pill>
                  <Pill tone="blue">
                    <Gauge className="h-3.5 w-3.5" />
                    {completion.pct}% READY
                  </Pill>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                    Site Configuration
                  </span>
                </h1>
                <p className="text-white/70 mt-2 max-w-2xl">
                  Neon green · pink · blue · emerald on deep black — module-based control console.
                </p>

                {/* progress */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-[11px] font-black tracking-wide text-white/55">
                    <span className="inline-flex items-center gap-2">
                      <ToggleLeft className="h-4 w-4 text-green-200" />
                      Config Coverage
                    </span>
                    <span>
                      {completion.filled}/{completion.total}
                    </span>
                  </div>
                  <div className="mt-2 h-3 rounded-full border border-white/10 bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(34,197,94,0.95), rgba(59,130,246,0.95), rgba(236,72,153,0.95), rgba(16,185,129,0.90))",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${completion.pct}%` }}
                      transition={{ type: "spring", stiffness: 160, damping: 18 }}
                    />
                  </div>
                </div>
              </div>

              {/* actions */}
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <motion.button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      whileHover={saving ? {} : { y: -2 }}
                      whileTap={saving ? {} : { scale: 0.98 }}
                      className={cx(
                        "rounded-2xl px-4 py-2 text-[12px] font-black inline-flex items-center gap-2",
                        saving ? btnDisabled : btnPrimary
                      )}
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {saving ? "Saving..." : "Save"}
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      disabled={saving}
                      whileHover={saving ? {} : { y: -2 }}
                      whileTap={saving ? {} : { scale: 0.98 }}
                      className={cx("px-4 py-2 text-[12px] font-black inline-flex items-center gap-2", btnGhost)}
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cx(
                      "rounded-2xl px-4 py-2 text-[12px] font-black inline-flex items-center gap-2",
                      btnPrimary
                    )}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </motion.button>
                )}
              </div>
            </div>
          </NeonFrame>
        </motion.div>

        {/* SAVE SUCCESS TOAST */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-5"
            >
              <NeonFrame className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl border border-green-300/25 bg-green-500/10 grid place-items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-200" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-black text-white/90">Saved successfully</div>
                    <div className="text-[11px] text-white/55">Your site configuration was updated.</div>
                  </div>
                </div>
              </NeonFrame>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN LAYOUT: NAV | EDITOR | PREVIEW */}
        <motion.div variants={inUp} className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* NAV */}
          <NeonFrame className="lg:col-span-3 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] text-white/55 font-black tracking-wide">MODULES</div>
                <div className="mt-1 text-xl font-black text-white/90">Navigator</div>
              </div>
              <Pill tone={isEditing ? "pink" : "emerald"}>{isEditing ? "EDIT" : "VIEW"}</Pill>
            </div>

            <div className="mt-5 space-y-3">
              <ModuleButton
                active={activeModule === "general"}
                onClick={() => setActiveModule("general")}
                icon={SlidersHorizontal}
                title="General"
                subtitle="Text + sizing"
              />
              <ModuleButton
                active={activeModule === "ui"}
                onClick={() => setActiveModule("ui")}
                icon={Sparkles}
                title="UI Toggles"
                subtitle="Enable features"
              />
              <ModuleButton
                active={activeModule === "media"}
                onClick={() => setActiveModule("media")}
                icon={ImageIcon}
                title="Media"
                subtitle="Logo + favicon"
              />

              <div className="pt-4 border-t border-white/10 space-y-3">
                <Tile
                  tone="blue"
                  icon={<Gauge className="h-5 w-5 text-blue-200" />}
                  label="Coverage"
                  value={`${completion.pct}%`}
                />
                <Tile
                  tone="emerald"
                  icon={<Sparkles className="h-5 w-5 text-emerald-200" />}
                  label="Toggles Enabled"
                  value={`${enabledCount}/5`}
                />
              </div>
            </div>
          </NeonFrame>

          {/* EDITOR */}
          <NeonFrame className="lg:col-span-6 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-white/55 font-black tracking-wide">EDITOR</div>
                <div className="mt-1 text-xl font-black text-white/90">
                  {activeModule === "general"
                    ? "General Settings"
                    : activeModule === "ui"
                    ? "UI Toggles"
                    : "Media Assets"}
                </div>
              </div>

              {loading ? (
                <Pill tone="gray">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  LOADING
                </Pill>
              ) : (
                <Pill tone={isEditing ? "pink" : "emerald"}>{isEditing ? "LIVE EDIT" : "LOCKED"}</Pill>
              )}
            </div>

            {loading ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-10 flex items-center justify-center">
                <div className="inline-flex items-center gap-3 text-white/60">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Loading configuration…
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeModule === "general" && (
                  <motion.div
                    key="general"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 240, damping: 22 }}
                    className="mt-6 space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generalSettingsFields.map((field) => (
                        <FieldCard
                          key={field.name}
                          field={field}
                          details={details}
                          isEditing={isEditing}
                          saving={saving}
                          handleChange={handleChange}
                          formatLabel={formatLabel}
                        />
                      ))}
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="text-[11px] font-black tracking-wide text-white/55">NOTE</div>
                      <div className="mt-2 text-[12px] text-white/70">
                        General settings power the site identity (server, digits, and branding name).
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeModule === "ui" && (
                  <motion.div
                    key="ui"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 240, damping: 22 }}
                    className="mt-6 space-y-3"
                  >
                    {uiSettings.map((setting, idx) => (
                      <motion.div
                        key={setting.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03, type: "spring", stiffness: 220, damping: 18 }}
                        className="rounded-3xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="text-[12px] font-black text-white/90">
                            {formatLabel(setting.name)}
                          </div>
                          <div className="text-[11px] text-white/55 mt-0.5">{setting.description}</div>
                        </div>

                        <div className="flex items-center gap-3">
                          {!isEditing ? (
                            <ToggleChip enabled={Boolean(details[setting.name])} />
                          ) : (
                            <NeonToggle
                              name={setting.name}
                              checked={Boolean(details[setting.name])}
                              onChange={handleChange}
                              disabled={saving}
                            />
                          )}
                        </div>
                      </motion.div>
                    ))}

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-black tracking-wide text-white/55">STATUS</div>
                        <Pill tone="green">{enabledCount} ENABLED</Pill>
                      </div>
                      <div className="mt-2 text-[12px] text-white/70">
                        These toggles instantly affect which features appear in the UI.
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeModule === "media" && (
                  <motion.div
                    key="media"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 240, damping: 22 }}
                    className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {mediaAssets.map((asset) => (
                      <MediaCard
                        key={asset.name}
                        asset={asset}
                        details={details}
                        isEditing={isEditing}
                        saving={saving}
                        handleChange={handleChange}
                        formatLabel={formatLabel}
                      />
                    ))}

                    <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="text-[11px] font-black tracking-wide text-white/55">TIP</div>
                      <div className="mt-2 text-[12px] text-white/70">
                        Use direct image URLs for best performance (CDN links preferred).
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </NeonFrame>

          {/* PREVIEW */}
          <NeonFrame className="lg:col-span-3 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-white/55 font-black tracking-wide">PREVIEW</div>
                <div className="mt-1 text-xl font-black text-white/90">Live Snapshot</div>
              </div>
              <Pill tone={details.websiteName ? "green" : "gray"}>{details.websiteName ? "BRANDED" : "EMPTY"}</Pill>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3">
              <Tile
                tone="green"
                icon={<Sparkles className="h-5 w-5 text-green-200" />}
                label="Website Name"
                value={details.websiteName || "—"}
              />
              <Tile
                tone="blue"
                icon={<SlidersHorizontal className="h-5 w-5 text-blue-200" />}
                label="Server Name"
                value={details.serverName || "—"}
              />
              <Tile
                tone="pink"
                icon={<ShieldCheck className="h-5 w-5 text-pink-200" />}
                label="MT5 Digit"
                value={details.mt5Digit || "—"}
              />
              <Tile
                tone="emerald"
                icon={<Gauge className="h-5 w-5 text-emerald-200" />}
                label="Logo Size (rem)"
                value={String(details.logoSize ?? "—")}
              />
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-black tracking-wide text-white/55">ASSETS</div>
                <Pill tone={details.logo || details.favicon ? "blue" : "gray"}>
                  {details.logo || details.favicon ? "SET" : "NONE"}
                </Pill>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <AssetPreview label="Logo" url={details.logo} />
                <AssetPreview label="Favicon" url={details.favicon} />
              </div>
            </div>
          </NeonFrame>
        </motion.div>

        <motion.div variants={inUp} className="text-center text-white/45 mt-8 text-[12px]">
          Neon circuit theme · green/pink/blue/emerald on black ⚡
        </motion.div>
      </motion.div>
    </div>
  );
};

function ModuleButton({ active, onClick, icon: Icon, title, subtitle }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cx(
        "w-full text-left rounded-3xl border p-4 transition",
        active
          ? "border-green-300/25 bg-green-500/12 shadow-[0_0_34px_rgba(34,197,94,0.18)]"
          : "border-white/10 bg-white/5 hover:bg-white/10"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
          <Icon className={cx("h-5 w-5", active ? "text-green-200" : "text-white/60")} />
        </div>
        <div className="min-w-0">
          <div className={cx("text-[12px] font-black", active ? "text-white/90" : "text-white/80")}>
            {title}
          </div>
          <div className="text-[11px] text-white/50">{subtitle}</div>
        </div>
      </div>
    </motion.button>
  );
}

function FieldCard({ field, details, isEditing, saving, handleChange, formatLabel }) {
  const value = details[field.name] ?? "";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-black tracking-wide text-white/55">{formatLabel(field.name)}</div>
        <Pill tone={String(value).trim() ? "green" : "gray"}>{String(value).trim() ? "SET" : "EMPTY"}</Pill>
      </div>

      <div className="mt-3">
        {isEditing ? (
          <InputWrap disabled={saving}>
            <input
              type={field.type}
              name={field.name}
              value={value}
              onChange={handleChange}
              disabled={saving}
              placeholder={field.placeholder}
              className={cx(
                "w-full bg-transparent px-4 py-3.5 outline-none",
                "text-white/90 text-[13px] font-black placeholder:text-white/25"
              )}
            />
          </InputWrap>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-[13px] font-black text-white/90">
            {String(value).trim() ? (
              value
            ) : (
              <span className="text-white/35 font-black italic">Not set</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MediaCard({ asset, details, isEditing, saving, handleChange, formatLabel }) {
  const url = details[asset.name] ?? "";

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-4 overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-black tracking-wide text-white/55">{formatLabel(asset.name)}</div>
          <div className="mt-1 text-[12px] font-black text-white/85">{asset.placeholder}</div>
        </div>
        <Pill tone={url.trim() ? "blue" : "gray"}>{url.trim() ? "LINKED" : "NONE"}</Pill>
      </div>

      {url.trim() ? (
        <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 flex items-center gap-3">
          <div className="h-14 w-20 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
            <img
              src={url}
              alt={`${asset.altText} image`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-white/65 hover:text-white inline-flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open
          </a>
        </div>
      ) : null}

      <div className="mt-3">
        {isEditing ? (
          <InputWrap disabled={saving}>
            <input
              name={asset.name}
              value={url}
              onChange={handleChange}
              disabled={saving}
              placeholder={asset.placeholder}
              className={cx(
                "w-full bg-transparent px-4 py-3.5 outline-none",
                "text-white/90 text-[13px] font-black placeholder:text-white/25"
              )}
            />
          </InputWrap>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-[12px] font-black text-white/80 break-all">
            {url.trim() ? url : <span className="text-white/35 italic">Not set</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AssetPreview({ label, url }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="text-[11px] font-black tracking-wide text-white/55">{label.toUpperCase()}</div>
      <div className="mt-2 h-14 rounded-xl border border-white/10 bg-black/40 flex items-center justify-center overflow-hidden">
        {url ? (
          <img src={url} alt={label} className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="text-[11px] text-white/30 italic">No image</span>
        )}
      </div>
    </div>
  );
}

export default SadminSiteConfiguration;

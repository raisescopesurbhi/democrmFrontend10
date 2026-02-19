// ✅ Updated MethodConfiguration to use the EXACT DashboardBase theme + gradient
// - Theme replaced with bg0/bg1/bg2/text/textMuted/borderSoft + gold/purple etc.
// - Background replaced with AuroraBackdrop (same as DashboardBase)
// - Removed AnimatedGrid + FloatingParticles (so it matches DashboardBase look)
// - Kept your APIs + workflow + layout intact

import React, { useEffect, useMemo, useState } from "react";
import {
  Trash2,
  Plus,
  Eye,
  Upload,
  XCircle,
  CreditCard,
  Landmark,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "../ui/Switch";
import toast from "react-hot-toast";
import { backendApi } from "../../../utils/apiClients";

/* ---------------- helpers ---------------- */
const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

/* ===================== THEME (EXACT from DashboardBase) ===================== */
const THEME = {
  bg0: "#0a0118",
  bg1: "#1a0b2e",
  bg2: "#16213e",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.65)",
  borderSoft: "rgba(255,255,255,0.15)",
  gold: "#ffd700",
  purple: "#a855f7",
  pink: "#ec4899",
  blue: "#3b82f6",
  green: "#10b981",
  orange: "#f97316",
  red: "#ef4444",
  teal: "#14b8a6",
};

const AuroraBackdrop = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
    <div
      className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: "1s" }}
    />
    <div
      className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: "2s" }}
    />
  </div>
);

/* ---------------- small UI blocks ---------------- */
const CardShell = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div
    className={cx("rounded-3xl border backdrop-blur-xl", className)}
    style={{
      background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,
      borderColor: THEME.borderSoft,
      boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
    }}
  >
    {children}
  </div>
);

const StatCard = ({
  icon,
  title,
  value,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  tone: "pink" | "red" | "green";
}) => {
  const toneStyle =
    tone === "pink"
      ? {
          background: `linear-gradient(135deg, ${THEME.pink}22, ${THEME.purple}0a)`,
          borderColor: `${THEME.pink}55`,
          boxShadow: `0 0 28px ${THEME.pink}18`,
        }
      : tone === "red"
      ? {
          background: `linear-gradient(135deg, ${THEME.red}22, ${THEME.orange}0a)`,
          borderColor: `${THEME.red}55`,
          boxShadow: `0 0 28px ${THEME.red}18`,
        }
      : {
          background: `linear-gradient(135deg, ${THEME.green}22, ${THEME.teal}0a)`,
          borderColor: `${THEME.green}55`,
          boxShadow: `0 0 28px ${THEME.green}18`,
        };

  return (
    <div className="rounded-3xl border p-4" style={toneStyle}>
      <div className="flex items-center justify-between gap-3">
        <div className="h-11 w-11 rounded-2xl grid place-items-center bg-white/10 border border-white/10">
          {icon}
        </div>
        <div className="text-3xl font-black" style={{ color: THEME.text }}>
          {value}
        </div>
      </div>
      <div className="mt-2 text-sm font-semibold" style={{ color: THEME.textMuted }}>
        {title}
      </div>
    </div>
  );
};

export default function MethodConfiguration() {
  const [arrayData, setArrayData] = useState<any[]>([]);
  const [bankData, setBankData] = useState<any[]>([]);

  const [newField, setNewField] = useState<{
    name: string;
    details: string;
    image: File | null;
    status: "active" | "inactive";
  }>({
    name: "",
    details: "",
    image: null,
    status: "active",
  });

  const [newBankField, setNewBankField] = useState<any>({
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    ifscCode: "",
    branchName: "",
    status: "active",
    name: "Bank Transfer",
  });

  const [showImagePopup, setShowImagePopup] = useState(false);
  const [popupImageUrl, setPopupImageUrl] = useState("");

  const [activeTab, setActiveTab] = useState<"payment-methods" | "bank-transfer">("payment-methods");

  // ---------------- Payment Method Functions (APIs unchanged) ----------------
  const addField = async () => {
    const toastId = toast.loading("Processing...");
    if (!newField.name || !newField.details) {
      toast.error("Name and details are required", { id: toastId });
      return;
    }

    try {
      let res;
      if (newField.image) {
        const formData = new FormData();
        formData.append("name", newField.name);
        formData.append("details", newField.details);
        formData.append("status", newField.status);
        formData.append("image", newField.image);

        res = await backendApi.post(`/admin/add-payment-method`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await backendApi.post(`/admin/add-payment-method`, {
          name: newField.name,
          details: newField.details,
          status: newField.status,
        });
      }

      if (res.data.status) {
        setArrayData((prev) => [...prev, res.data.data]);
        toast.success("Method added successfully", { id: toastId });
        setNewField({ name: "", details: "", image: null, status: "active" });
      } else {
        toast.error(res.data.msg || "Failed to add payment method", { id: toastId });
      }
    } catch (error: any) {
      const code = error?.response?.data?.error?.code;
      if (code === "ENOENT") {
        toast.error("File storage unavailable on server. Try without an image.", { id: toastId });
      } else {
        toast.error(error?.response?.data?.msg || "Server error occurred", { id: toastId });
      }
      console.log("error in add payment method", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewField((nf) => ({ ...nf, image: file }));
  };

  const toggleActive = async (id: string, currentStatus: "active" | "inactive") => {
    const toastId = toast.loading("Updating status...");
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await backendApi.put(`/admin/update-payment-method`, { id, status: newStatus });

      if (res.data.status) {
        setArrayData((prev) => prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p)));
        toast.success("Status updated", { id: toastId });
      } else {
        toast.error(res.data.msg || "Failed to update status", { id: toastId });
      }
    } catch (error) {
      console.error("Error in payment method toggleActive:", error);
      toast.error("Update failed", { id: toastId });
    }
  };

  const deletePlatform = async (id: string) => {
    const toastId = toast.loading("Removing method...");
    try {
      const res = await backendApi.delete(`/admin/delete-payment-method/?id=${id}`);
      if (res.data.status) {
        setArrayData((prev) => prev.filter((p) => p._id !== id));
        toast.success("Method removed successfully", { id: toastId });
      } else {
        toast.error(res.data.msg || "Removal failed", { id: toastId });
      }
    } catch (error) {
      console.log("error in delete method", error);
      toast.error("Transaction error", { id: toastId });
    }
  };

  const getAllPlatforms = async () => {
    try {
      const res = await backendApi.get(`/admin/get-payment-methods`);
      const filterNotBankData = (res.data.data || []).filter((v: any) => v.name !== "Bank Transfer");
      setArrayData(filterNotBankData);
    } catch (error) {
      console.log("error in getAllPlatform", error);
    }
  };

  const handleViewImage = (imageUrl?: string) => {
    setPopupImageUrl(imageUrl || "");
    setShowImagePopup(true);
  };

  // ---------------- Bank Transfer Functions (APIs unchanged) ----------------
  const addBankDetails = async () => {
    const toastId = toast.loading("Adding bank details...");
    if (!newBankField.bankName || !newBankField.accountNumber || !newBankField.accountHolderName || !newBankField.ifscCode) {
      toast.error("Please fill all required fields", { id: toastId });
      return;
    }

    try {
      const res = await backendApi.post(`/admin/add-payment-method`, newBankField);
      if (res.data.status) {
        setBankData((prev) => [...prev, res.data.data]);
        toast.success("Bank details added", { id: toastId });
        setNewBankField({
          bankName: "",
          accountNumber: "",
          accountHolderName: "",
          ifscCode: "",
          branchName: "",
          status: "active",
          name: "Bank Transfer",
        });
      } else {
        toast.error(res.data.msg || "Failed to add bank details", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
      console.log("error in add bank details", error);
    }
  };

  const toggleBankActive = async (id: string, currentStatus: "active" | "inactive") => {
    const toastId = toast.loading("Updating status...");
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await backendApi.put(`/admin/update-payment-method`, { id, status: newStatus });

      if (res.data.status) {
        setBankData((prev) => prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)));
        toast.success("Status updated", { id: toastId });
      } else {
        toast.error(res.data.msg || "Failed to update bank status", { id: toastId });
      }
    } catch (error) {
      console.error("Error in bank toggleActive:", error);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  const deleteBank = async (id: string) => {
    const toastId = toast.loading("Removing bank details...");
    try {
      const res = await backendApi.delete(`/admin/delete-payment-method/?id=${id}`);
      if (res.data.status) {
        setBankData((prev) => prev.filter((b) => b._id !== id));
        toast.success("Bank details removed", { id: toastId });
      } else {
        toast.error(res.data.msg || "Removal failed", { id: toastId });
      }
    } catch (error) {
      console.log("error in delete bank", error);
      toast.error("Transaction error", { id: toastId });
    }
  };

  const getAllBankDetails = async () => {
    try {
      const res = await backendApi.get(`/admin/get-payment-methods`);
      const filterBankData = (res.data.data || []).filter((v: any) => v.name === "Bank Transfer");
      setBankData(filterBankData);
    } catch (error) {
      console.log("error in getAllBankDetails", error);
    }
  };

  useEffect(() => {
    getAllPlatforms();
    getAllBankDetails();
  }, []);

  const isAddButtonDisabled = !newField.name || !newField.details;
  const isBankAddButtonDisabled =
    !newBankField.bankName ||
    !newBankField.accountNumber ||
    !newBankField.accountHolderName ||
    !newBankField.ifscCode;

  const activePaymentCount = useMemo(() => arrayData.filter((p) => p.status === "active").length, [arrayData]);
  const activeBankCount = useMemo(() => bankData.filter((b) => b.status === "active").length, [bankData]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: THEME.bg0, color: THEME.text }}>
      <AuroraBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          {/* LEFT */}
          <div>
            {/* same gradient style as DashboardBase */}
            <h1
              className="text-2xl sm:text-3xl font-black"
              style={{
                background: `linear-gradient(135deg, ${THEME.gold}, ${THEME.purple})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Payment Configuration
            </h1>

            <div className="mt-4 space-y-4">
              <StatCard
                tone="pink"
                icon={<CreditCard className="w-5 h-5 text-white" />}
                title="Payment Methods"
                value={arrayData.length}
              />
              <StatCard
                tone="red"
                icon={<Landmark className="w-5 h-5 text-white" />}
                title="Bank Accounts"
                value={bankData.length}
              />
              <StatCard
                tone="green"
                icon={<TrendingDot />}
                title="Total Active"
                value={activePaymentCount + activeBankCount}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {/* Tabs */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab("payment-methods")}
                className={cx(
                  "rounded-2xl px-4 py-3 border font-black transition",
                  activeTab === "payment-methods"
                    ? "bg-white/10 text-white"
                    : "bg-white/[0.06] text-white/70 hover:text-white hover:bg-white/10"
                )}
                style={{ borderColor: THEME.borderSoft }}
              >
                Payment Methods
              </button>
              <button
                onClick={() => setActiveTab("bank-transfer")}
                className={cx(
                  "rounded-2xl px-4 py-3 border font-black transition",
                  activeTab === "bank-transfer"
                    ? "bg-white/10 text-white"
                    : "bg-white/[0.06] text-white/70 hover:text-white hover:bg-white/10"
                )}
                style={{ borderColor: THEME.borderSoft }}
              >
                Bank Transfer
              </button>
            </div>

            {/* Forms */}
            <div className="mt-4">
              {activeTab === "payment-methods" ? (
                <CardShell className="p-5">
                  <div className="text-lg font-black text-white">Add Payment method</div>

                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Method"
                      value={newField.name}
                      onChange={(e) => setNewField((p) => ({ ...p, name: e.target.value }))}
                      className={cx(
                        "w-full px-4 py-3 rounded-2xl border bg-black/20",
                        "text-white/90 placeholder:text-white/40",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400/25"
                      )}
                      style={{ borderColor: THEME.borderSoft }}
                    />

                    <input
                      type="text"
                      placeholder="payment"
                      value={newField.details}
                      onChange={(e) => setNewField((p) => ({ ...p, details: e.target.value }))}
                      className={cx(
                        "w-full px-4 py-3 rounded-2xl border bg-black/20",
                        "text-white/90 placeholder:text-white/40",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400/25"
                      )}
                      style={{ borderColor: THEME.borderSoft }}
                    />

                    <div className="w-full">
                      <input type="file" id="pm-image-upload" onChange={handleImageChange} accept="image/*" className="hidden" />
                      <label
                        htmlFor="pm-image-upload"
                        className={cx(
                          "w-full inline-flex items-center justify-between gap-3",
                          "px-4 py-3 rounded-2xl border bg-black/20",
                          "text-white/80 hover:bg-white/10 transition cursor-pointer"
                        )}
                        style={{ borderColor: THEME.borderSoft }}
                      >
                        <span>upload image</span>
                        <span className="inline-flex items-center gap-2 text-white/70">
                          <Upload className="w-4 h-4" />
                          {newField.image ? "Selected" : ""}
                        </span>
                      </label>
                    </div>

                    <button
                      onClick={addField}
                      disabled={isAddButtonDisabled}
                      className={cx(
                        "w-full px-4 py-3 rounded-2xl border font-black transition inline-flex items-center justify-center gap-2",
                        isAddButtonDisabled
                          ? "bg-white/5 text-white/35 cursor-not-allowed"
                          : "bg-white/10 text-white hover:bg-white/15 hover:scale-[1.01]"
                      )}
                      style={{ borderColor: THEME.borderSoft }}
                    >
                      <Plus className="w-5 h-5" />
                      add method
                    </button>
                  </div>
                </CardShell>
              ) : (
                <CardShell className="p-5">
                  <div className="text-lg font-black text-white">Add Bank Account</div>

                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Bank Name"
                      value={newBankField.bankName}
                      onChange={(e) => setNewBankField((p: any) => ({ ...p, bankName: e.target.value }))}
                      className={cx(
                        "w-full px-4 py-3 rounded-2xl border bg-black/20",
                        "text-white/90 placeholder:text-white/40",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400/25"
                      )}
                      style={{ borderColor: THEME.borderSoft }}
                    />
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={newBankField.accountNumber}
                      onChange={(e) => setNewBankField((p: any) => ({ ...p, accountNumber: e.target.value }))}
                      className={cx(
                        "w-full px-4 py-3 rounded-2xl border bg-black/20",
                        "text-white/90 placeholder:text-white/40",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400/25"
                      )}
                      style={{ borderColor: THEME.borderSoft }}
                    />
                    <input
                      type="text"
                      placeholder="Account Holder"
                      value={newBankField.accountHolderName}
                      onChange={(e) => setNewBankField((p: any) => ({ ...p, accountHolderName: e.target.value }))}
                      className={cx(
                        "w-full px-4 py-3 rounded-2xl border bg-black/20",
                        "text-white/90 placeholder:text-white/40",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400/25"
                      )}
                      style={{ borderColor: THEME.borderSoft }}
                    />
                    <input
                      type="text"
                      placeholder="IFSC Code"
                      value={newBankField.ifscCode}
                      onChange={(e) => setNewBankField((p: any) => ({ ...p, ifscCode: e.target.value }))}
                      className={cx(
                        "w-full px-4 py-3 rounded-2xl border bg-black/20",
                        "text-white/90 placeholder:text-white/40",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400/25"
                      )}
                      style={{ borderColor: THEME.borderSoft }}
                    />
                    <input
                      type="text"
                      placeholder="Branch Name"
                      value={newBankField.branchName}
                      onChange={(e) => setNewBankField((p: any) => ({ ...p, branchName: e.target.value }))}
                      className={cx(
                        "w-full px-4 py-3 rounded-2xl border bg-black/20",
                        "text-white/90 placeholder:text-white/40",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400/25"
                      )}
                      style={{ borderColor: THEME.borderSoft }}
                    />

                    <button
                      onClick={addBankDetails}
                      disabled={isBankAddButtonDisabled}
                      className={cx(
                        "w-full px-4 py-3 rounded-2xl border font-black transition inline-flex items-center justify-center gap-2",
                        isBankAddButtonDisabled
                          ? "bg-white/5 text-white/35 cursor-not-allowed"
                          : "bg-white/10 text-white hover:bg-white/15 hover:scale-[1.01]"
                      )}
                      style={{ borderColor: THEME.borderSoft }}
                    >
                      <Plus className="w-5 h-5" />
                      Add Account
                    </button>
                  </div>
                </CardShell>
              )}
            </div>

            {/* Existing items */}
            <div className="mt-6">
              {activeTab === "payment-methods" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {arrayData?.map((platform: any, index: number) => {
                    const rawPath = platform?.image as string | undefined;
                    const normalizedPath = rawPath ? rawPath.replace(/\\/g, "/") : undefined;
                    const base = import.meta.env.VITE_API_BASE_URL;
                    const imgUrl = normalizedPath && base ? `${base}/${normalizedPath}` : undefined;

                    return (
                      <CardShell key={platform?._id || index} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-black truncate" style={{ color: THEME.text }}>
                              {platform?.name}
                            </div>
                            <div className="text-sm truncate" style={{ color: THEME.textMuted }}>
                              {platform?.details}
                            </div>
                          </div>
                          <Switch
                            checked={platform?.status === "active"}
                            onCheckedChange={() => toggleActive(platform?._id, platform?.status)}
                          />
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewImage(imgUrl)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border bg-white/[0.06] text-white/85 hover:bg-white/10 transition"
                            style={{ borderColor: THEME.borderSoft }}
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            onClick={() => deletePlatform(platform?._id)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border bg-white/[0.06] text-white/85 hover:bg-white/10 transition"
                            style={{ borderColor: THEME.borderSoft }}
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </CardShell>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                  {bankData?.map((bank: any) => (
                    <CardShell key={bank?._id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-black truncate" style={{ color: THEME.text }}>
                            {bank?.bankTransfer?.bankName}
                          </div>
                          <div className="text-sm truncate" style={{ color: THEME.textMuted }}>
                            {bank?.bankTransfer?.accountNumber}
                          </div>
                        </div>
                        <Switch
                          checked={bank?.status === "active"}
                          onCheckedChange={() => toggleBankActive(bank?._id, bank?.status)}
                        />
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="rounded-2xl border bg-black/20 px-3 py-2" style={{ borderColor: THEME.borderSoft }}>
                          <div className="text-xs" style={{ color: THEME.textMuted }}>
                            Account Holder
                          </div>
                          <div className="font-semibold truncate text-white/85">
                            {bank?.bankTransfer?.accountHolderName}
                          </div>
                        </div>
                        <div className="rounded-2xl border bg-black/20 px-3 py-2" style={{ borderColor: THEME.borderSoft }}>
                          <div className="text-xs" style={{ color: THEME.textMuted }}>
                            IFSC
                          </div>
                          <div className="font-semibold truncate text-white/85">
                            {bank?.bankTransfer?.ifscCode}
                          </div>
                        </div>
                        <div
                          className="rounded-2xl border bg-black/20 px-3 py-2 sm:col-span-2"
                          style={{ borderColor: THEME.borderSoft }}
                        >
                          <div className="text-xs" style={{ color: THEME.textMuted }}>
                            Branch
                          </div>
                          <div className="font-semibold truncate text-white/85">
                            {bank?.bankTransfer?.branchName || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewImage(undefined)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border bg-white/[0.06] text-white/85 hover:bg-white/10 transition"
                          style={{ borderColor: THEME.borderSoft }}
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          onClick={() => deleteBank(bank?._id)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border bg-white/[0.06] text-white/85 hover:bg-white/10 transition"
                          style={{ borderColor: THEME.borderSoft }}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </CardShell>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Popup Modal */}
        <AnimatePresence>
          {showImagePopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setShowImagePopup(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative border rounded-3xl p-5 max-w-3xl w-full mx-4"
                style={{
                  background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,
                  borderColor: THEME.borderSoft,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowImagePopup(false)}
                  className="absolute -top-4 -right-4 p-2 rounded-full text-white transition"
                  style={{ background: THEME.red }}
                >
                  <XCircle size={24} />
                </button>

                {popupImageUrl ? (
                  <div className="flex justify-center items-center">
                    <img
                      src={popupImageUrl}
                      alt="Payment Method"
                      className="max-w-full max-h-[80vh] object-contain rounded-2xl border"
                      style={{ borderColor: THEME.borderSoft }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 py-16">
                    <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-white/50" />
                    </div>
                    <p style={{ color: THEME.textMuted }} className="text-center">
                      No image uploaded for this item.
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* icon used in KPI without adding new imports */
function TrendingDot() {
  return (
    <span className="inline-flex items-center justify-center">
      <span className="h-5 w-5 rounded-full bg-white/15 border border-white/10" />
    </span>
  );
}

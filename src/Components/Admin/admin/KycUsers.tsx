// ✅ KycUsers updated to use the EXACT DashboardBase theme + gradient
// - Replaced DARK MAROON THEME with DashboardBase THEME
// - Replaced MaroonBackdrop + AnimatedGrid + FloatingParticles with AuroraBackdrop
// - Updated Glass + GradientBorder to match DashboardBase panels
// - Updated title gradient to gold→purple (exact)
// - Kept your APIs + workflow + layout intact

import { useEffect, useMemo, useState } from "react";
import {
  Ban,
  CheckCircle,
  Image as ImageIcon,
  Loader,
  Search,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import toast from "react-hot-toast";
import { backendApi } from "../../../utils/apiClients";
import { CFcalculateTimeSinceJoined, CFformatDate } from "../../../utils/CustomFunctions";

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

const outerWrap = "relative min-h-screen overflow-hidden";

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

const Glass = ({ className = "", children }: any) => (
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

const Chip = ({
  children,
  tone = "emerald",
}: {
  children: any;
  tone?: "emerald" | "cyan" | "rose" | "amber";
}) => {
  const tones: Record<string, { bg: string; border: string; text: string }> = {
    emerald: { bg: "rgba(16,185,129,0.14)", border: "rgba(16,185,129,0.28)", text: "rgba(209,250,229,0.95)" },
    cyan: { bg: "rgba(59,130,246,0.14)", border: "rgba(59,130,246,0.28)", text: "rgba(219,234,254,0.95)" },
    rose: { bg: "rgba(236,72,153,0.14)", border: "rgba(236,72,153,0.28)", text: "rgba(252,231,243,0.95)" },
    amber: { bg: "rgba(255,215,0,0.12)", border: "rgba(255,215,0,0.25)", text: "rgba(255,246,214,0.95)" },
  };

  const t = tones[tone] || tones.emerald;

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-black border"
      style={{ background: t.bg, borderColor: t.border, color: t.text }}
    >
      {children}
    </span>
  );
};

/* ===================== Component ===================== */
const KycUsers = () => {
  const PAGE_SIZE = 10;

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [kycUsers, setKycUsers] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "">("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [pagination, setPagination] = useState<any>({});
  const [comment, setComment] = useState("");

  /* ===== numbered pagination helpers ===== */
  const DOTS = "...";
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => i + start);

  const totalPages = Math.max(
    1,
    Number(pagination?.totalPages) || Math.ceil((pagination?.totalUsers || 0) / PAGE_SIZE)
  );
  const getPaginationRange = (
    total: number,
    current: number,
    siblingCount = 1
  ): Array<number | string> => {
    const totalPageNumbers = siblingCount * 2 + 5;   
    if (totalPageNumbers >= total) return range(1, total);

    const leftSiblingIndex = Math.max(current - siblingCount, 1);
    const rightSiblingIndex = Math.min(current + siblingCount, total);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < total - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + siblingCount * 2;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, total];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + siblingCount * 2;
      const rightRange = range(total - rightItemCount + 1, total);
      return [1, DOTS, ...rightRange];
    }

    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [1, DOTS, ...middleRange, DOTS, total];
  };

  const paginationRange = useMemo(
    () => getPaginationRange(totalPages, currentPage, 1),
    [totalPages, currentPage]
  );

  /* ---------------- data fetch (API unchanged) ---------------- */
  const fetchUsersData = async () => {
    setLoading(true);
    try {
      const res = await backendApi.get(  
        `/admin/kyc-users?page=${currentPage}&limit=${PAGE_SIZE}&search=${encodeURIComponent(debouncedSearch)}`
      );
      console.log("response",res);

      setPagination(res.data?.pagination || {});
      setKycUsers(res.data?.data || []);
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Error fetching KYC users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: any) => setSearchQuery(e.target.value);

  /* ---------------- KYC helpers ---------------- */
const hasAllKycImages = (user: any) => {
  const kyc = user?.kycDetails;
  return Boolean(
    kyc?.frontSideOfDocument &&
    kyc?.backSideOfDocument &&
    kyc?.selfieWithDocument
  );
};

  /* ---------------- confirm action (workflow unchanged) ---------------- */
  const handleConfirmAction = async (user: any, action: "approve" | "reject") => {
      if (action === "approve" && !hasAllKycImages(user)) {
    toast.error("Cannot approve KYC. All required documents must be uploaded.");
    return;
  }

    setActionType(action);
    const toastId = toast.loading("Please wait...");
    try {
      const actionMessage =
        action === "approve"
          ? `<p>Your KYC has been successfully verified. Thank you for completing the verification process.</p>`
          : `<p>Unfortunately, your KYC verification was not successful. Please check your details and submit again.</p>`;

      const rejectionReason =
        action === "reject"
          ? `<div class="withdrawal-details">
              <p>Reason: <span class="highlight">${comment || "Contact Admin"}</span></p>
            </div>`
          : "";

      const customContent = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>KYC Verification Status</title>
<style>
body,html{margin:0;padding:0;font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f4f4f4}
.container{max-width:600px;margin:0 auto;background:#fff}
.header{background:#19422df2;color:#fff;padding:20px 15px;text-align:center;border-radius:10px 10px 0 0}
.header h1{margin:0;font-size:22px;letter-spacing:1px}
.content{padding:10px 20px}
.withdrawal-details{background:#f8f8f8;border-left:4px solid #2d6a4f;padding:15px;margin:20px 0}
.highlight{font-weight:700;color:#0a2342}
.risk-warning{color:#C70039;padding:5px;font-size:12px;line-height:1.4}
.footer{background:#19422df2;color:#fff;text-align:center;padding:5px 10px;font-size:12px;border-radius:0 0 10px 10px}
.footer-info{margin-top:6px}
.footer-info a{color:#B6D0E2;text-decoration:none}
</style></head>
<body><div class="container">
<div class="header"><h1>${action === "approve" ? "KYC Approved" : "KYC Rejected"}</h1></div>
<div class="content">
<p>Dear ${user?.firstName || ""} ${user?.lastName || ""},</p>
${actionMessage}
${rejectionReason}
<p>Thank you for choosing us.</p>
<p>Happy trading!</p>
<p>Best regards,<br>The ${import.meta.env.VITE_WEBSITE_NAME || "Forex"} Team</p>
<hr>
<div class="risk-warning"><strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks.<br><br>Our services are not for U.S. citizens or in jurisdictions where they violate local laws.</div>
</div>
<div class="footer">
  <div class="footer-info">
    <p>Website: <a href="https://${import.meta.env.VITE_EMAIL_WEBSITE || ""}">${import.meta.env.VITE_EMAIL_WEBSITE || ""}</a> |
    E-mail: <a href="mailto:${import.meta.env.VITE_EMAIL_EMAIL || ""}">${import.meta.env.VITE_EMAIL_EMAIL || ""}</a></p>
    <p>© 2025 ${import.meta.env.VITE_WEBSITE_NAME || ""}. All Rights Reserved</p>
  </div>
</div>
</div></body></html>`;

      if (action === "approve") {
        await backendApi.put(`/admin/update-user`, { id: user._id, kycVerified: true });
        await backendApi.put(`/admin/user/${user?._id}/kyc-status`, { status: "approved" });
        toast.success("KYC Approved", { id: toastId });
        try {
          await backendApi.post(`/admin/custom-mail`, {
            email: user?.email,
            content: customContent,
            subject: "KYC Approved",
          });
          setComment("");
        } catch (err) {
          console.log("error sending mail", err);
        }
      } else {
        await backendApi.put(`/admin/update-user`, { id: user._id, kycVerified: false });
        await backendApi.put(`/admin/user/${user?._id}/kyc-status`, { status: "rejected" });
        toast.success("KYC Rejected", { id: toastId });
        try {
          await backendApi.post(`/admin/custom-mail`, {
            email: user?.email,
            content: customContent,
            subject: "KYC Rejected",
          });
          setComment("");
        } catch (err) {
          console.log("error sending mail", err);
        }
      }

      fetchUsersData();
    } catch (error: any) {
      console.error("Error updating KYC status:", error);
      toast.error(`${error?.response?.data?.message || "Something went wrong"}`, { id: toastId });
    } finally {
      setIsDialogOpen(false);
      setActionType("");
    }
  };

  /* ---------------- pagination ---------------- */
  const handleNextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]); // eslint-disable-line react-hooks/exhaustive-deps  

  /* ---------------- dialog open ---------------- */
  const togglePreview = (item: any) => {
    setSelectedUser(item);
    setIsDialogOpen(true);
  };

  /* ---------------- reset & debounce ---------------- */
  useEffect(() => setCurrentPage(1), [debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchUsersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch]);

  const imgUrl = (path?: string) => (path ? `${import.meta.env.VITE_API_BASE_URL}/${path}` : "");

  return (
    <div className={outerWrap} style={{ background: THEME.bg0, color: THEME.text }}>
      <AuroraBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto pt-6 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <Glass className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className={cx(
                  "inline-flex items-center gap-2 rounded-2xl px-4 py-2",
                  "bg-white/5 border text-white/85",
                  "hover:bg-white/10 transition"
                )}
                style={{ borderColor: THEME.borderSoft }} 
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <div className="min-w-0">
                <div className="text-[11px] font-semibold tracking-wider" style={{ color: THEME.textMuted }}>
                  Admin / KYC
                </div>

                <h1
                  className="text-2xl md:text-3xl font-black tracking-tight"
                  style={{
                    background: `linear-gradient(135deg, ${THEME.gold}, ${THEME.purple})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Updated KYC Users
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Chip tone="amber">
                    Total <span className="font-black">{pagination?.totalUsers || 0}</span>
                  </Chip>
                  <Chip tone="cyan">
                    Page <span className="font-black">{currentPage}</span> /{" "}
                    <span className="font-black">{totalPages}</span>
                  </Chip>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-[380px]">
                <input
                  type="text"
                  placeholder="Name / Email"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={cx(
                    "w-full pl-10 pr-9 py-2.5 rounded-2xl",
                    "bg-black/40 border text-white/90",
                    "placeholder:text-white/35",
                    "focus:outline-none focus:ring-2 focus:ring-purple-400/25 focus:border-purple-300/25",
                    "backdrop-blur"
                  )}
                  style={{ borderColor: THEME.borderSoft }}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 hover:text-white/80"
                  >
                    ×
                  </button>
                )}
              </div>

              <button
                onClick={fetchUsersData}
                disabled={loading}
                className={cx(
                  "px-4 py-2.5 rounded-2xl border",
                  "bg-white/5 text-white/85 hover:bg-white/10 transition flex items-center gap-2",
                  loading && "opacity-60 cursor-not-allowed"
                )}
                style={{ borderColor: THEME.borderSoft }}
              >
                <RefreshCw className={cx("w-4 h-4", loading && "animate-spin")} />
                {loading ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>
        </Glass>

        {/* Table */}
        <div className="mt-6">
          <Glass className="overflow-hidden">
            <div className="overflow-x-auto relative">
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                <table className="w-full min-w-[900px] whitespace-nowrap">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-black/30 border-b" style={{ borderColor: THEME.borderSoft }}>
                      <th className="py-3 px-4 text-left text-white/80 font-bold">User | Email</th>
                      <th className="py-3 px-4 text-center text-white/80 font-bold">Total AC</th>
                      <th className="py-3 px-4 text-center text-white/80 font-bold">Email Verified</th>
                      <th className="py-3 px-4 text-center text-white/80 font-bold">Country</th>
                      <th className="py-3 px-4 text-left text-white/80 font-bold">Updated At</th>
                      <th className="py-3 px-4 text-left text-white/80 font-bold">Action</th>
                    </tr>
                  </thead>

                  <tbody className="text-white/90">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-10">
                          <div className="flex justify-center items-center gap-3 text-white/70">
                            <span>Loading...</span>
                            <Loader className="animate-spin" />
                          </div>
                        </td>
                      </tr>
                    ) : kycUsers?.length ? (
                      kycUsers.map((item: any) => (
                        <tr
                          key={item._id}
                          className="border-b hover:bg-white/5 transition-colors"
                          style={{ borderColor: THEME.borderSoft }}
                        >
                          <td className="py-3 px-4">
                            <div className="font-black text-white">
                              {item?.firstName || "Not found"} {item?.lastName || ""}
                            </div>
                            <div className="text-white/45 text-sm">{item?.email || "Not found"}</div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex px-3 py-1 rounded-full text-sm border font-semibold"
                              style={{ background: `${THEME.blue}20`, borderColor: `${THEME.blue}40`, color: "rgba(219,234,254,0.95)" }}>
                              {item?.accounts?.length || 0}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center">
                            {item?.emailVerified ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border font-semibold"
                                style={{ background: `${THEME.green}20`, borderColor: `${THEME.green}40`, color: "rgba(209,250,229,0.95)" }}>
                                <CheckCircle className="w-4 h-4" /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border font-semibold"
                                style={{ background: `${THEME.pink}20`, borderColor: `${THEME.pink}40`, color: "rgba(252,231,243,0.95)" }}>
                                <Ban className="w-4 h-4" /> Unverified
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center">
                            {item?.country ? (
                              <span className="inline-flex px-3 py-1 rounded-full text-sm border font-semibold"
                                style={{ background: `${THEME.gold}15`, borderColor: `${THEME.gold}33`, color: "rgba(255,246,214,0.95)" }}>
                                {item.country}
                              </span>
                            ) : (
                              <span className="text-white/35">N/A</span>
                            )}
                          </td>

                          <td className="py-3 whitespace-nowrap px-4">
                            <div className="text-white/85">{CFformatDate(item?.updatedAt)}</div>
                            <div className="text-xs" style={{ color: THEME.textMuted }}>
                              {CFcalculateTimeSinceJoined(item?.updatedAt)}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <button
                              className="inline-flex items-center gap-2 transition-all font-semibold"
                              style={{ color: "rgba(219,234,254,0.9)" }}
                              onClick={() => togglePreview(item)}
                            >
                              <ImageIcon className="w-4 h-4" /> View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12">
                          <div className="text-center" style={{ color: THEME.textMuted }}>
                            No KYC users found.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t bg-white/[0.02]"
              style={{ borderColor: THEME.borderSoft }}>
              <div className="text-xs sm:text-sm" style={{ color: THEME.textMuted }}>
                Total records:{" "}
                <span className="text-white font-black">{pagination?.totalUsers || 0}</span>
              </div>
              <div className="text-xs sm:text-sm" style={{ color: THEME.textMuted }}>
                Page <span className="text-white font-black">{currentPage}</span> of{" "}
                <span className="text-white font-black">{totalPages}</span>
              </div>
            </div>
          </Glass>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col items-center space-y-3">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={cx(
                "px-4 py-2 rounded-2xl transition-all border font-bold",
                currentPage === 1
                  ? "bg-white/5 text-white/30 cursor-not-allowed"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
              style={{ borderColor: THEME.borderSoft }}
            >
              ← Previous
            </button>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              {paginationRange.map((p, idx) =>
                p === DOTS ? (
                  <span key={`dots-${idx}`} className="px-3 py-2 text-white/35 select-none">
                    {DOTS}
                  </span>
                ) : (
                  <button
                    key={`page-${p}`}
                    onClick={() => goToPage(p as number)}
                    className={cx(
                      "min-w-[40px] px-3 py-2 rounded-2xl border transition-all font-black",
                      currentPage === p ? "text-white" : "text-white/75 hover:text-white"
                    )}
                    style={{
                      borderColor: currentPage === p ? `${THEME.purple}80` : THEME.borderSoft,
                      background:
                        currentPage === p
                          ? `linear-gradient(135deg, ${THEME.purple}35, ${THEME.pink}25)`
                          : "rgba(255,255,255,0.06)",
                      boxShadow: currentPage === p ? `0 0 18px ${THEME.purple}22` : undefined,
                    }}
                    aria-current={currentPage === p ? "page" : undefined}
                  >
                    {p}
                  </button>
                )
              )}  
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={cx(
                "px-4 py-2 rounded-2xl transition-all border font-bold",
                currentPage === totalPages
                  ? "bg-white/5 text-white/30 cursor-not-allowed"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
              style={{ borderColor: THEME.borderSoft }}
            >
              Next →
            </button>
          </div>

          <span className="text-white/45 text-xs">
            Page <span className="text-white font-black">{currentPage}</span> of{" "}
            <span className="text-white font-black">{totalPages}</span>
          </span>
        </div>
      </div>

      {/* Dialog (theme-only) */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent
          className="max-w-4xl rounded-3xl border text-white backdrop-blur-2xl"
          style={{
            background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,
            borderColor: THEME.borderSoft,
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black">KYC Details</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="mt-4 space-y-6">
                <Glass className="p-5">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="text-white font-black">
                        {selectedUser?.firstName || ""} {selectedUser?.lastName || ""}
                      </div>
                      <div className="text-sm" style={{ color: THEME.textMuted }}>
                        {selectedUser?.email || "—"}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Chip tone="cyan">
                        AC <span className="font-black">{selectedUser?.accounts?.length || 0}</span>
                      </Chip>
                      <Chip tone={selectedUser?.emailVerified ? "emerald" : "rose"}>
                        {selectedUser?.emailVerified ? (
                          <>
                            <CheckCircle className="w-4 h-4" /> Verified
                          </>
                        ) : (
                          <>
                            <Ban className="w-4 h-4" /> Unverified
                          </>
                        )}
                      </Chip>
                    </div>
                  </div>

                  <div className="mt-4 grid sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                    <p>
                      <span style={{ color: THEME.textMuted }}>Purpose:</span>{" "}
                      <span className="font-semibold text-white/85">
                        {selectedUser?.kycDetails?.purpose || "--"}
                      </span>
                    </p>
                    <p>
                      <span style={{ color: THEME.textMuted }}>Occupation:</span>{" "}
                      <span className="font-semibold text-white/85">
                        {selectedUser?.kycDetails?.occupation || "--"}
                      </span>
                    </p>
                    <p>
                      <span style={{ color: THEME.textMuted }}>Country of issue:</span>{" "}
                      <span className="font-semibold text-white/85">
                        {selectedUser?.kycDetails?.countryOfIssue || "--"}
                      </span>
                    </p>
                    <p>
                      <span style={{ color: THEME.textMuted }}>Document Type:</span>{" "}
                      <span className="font-semibold text-white/85">
                        {selectedUser?.kycDetails?.documentType || "--"}
                      </span>
                    </p>
                  </div>
                </Glass>

                {/* Images */}
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { title: "Front Side of Document", key: "frontSideOfDocument" },
                    { title: "Back Side of Document", key: "backSideOfDocument" },
                    { title: "Selfie With Document", key: "selfieWithDocument" },
                  ].map((img) => {
                    const path = selectedUser?.kycDetails?.[img.key];
                    const src = path ? imgUrl(path) : "";
                    return (
                      <Glass key={img.key} className="p-3">
                        <p className="text-sm text-white/75 font-semibold mb-2">{img.title}</p>

                        {src ? (
                          <>
                            <img
                              className="mx-auto max-h-56 w-auto rounded-2xl border bg-black/40"
                              style={{ borderColor: THEME.borderSoft }}
                              src={src}
                              alt={img.title}
                            />
                            <a
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex w-full justify-end text-blue-200 hover:text-blue-100 text-sm font-semibold"
                              href={src}
                            >
                              View Full Image
                            </a>
                          </>
                        ) : (  
                          <div className="text-white/35 text-sm">Not uploaded</div>
                        )}
                      </Glass>
                    );
                  })}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6">
            <div className="w-full">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-lg font-black">Action</h3>
                <Chip tone="amber">
                  Updated: <span className="font-black">{CFformatDate(selectedUser?.updatedAt)}</span>
                </Chip>
              </div>

              <div className="mt-3 flex flex-col gap-4">
                <textarea
                  placeholder="Add a comment (optional for approve, recommended for reject)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={cx(
                    "min-h-24 w-full rounded-2xl px-3 py-2",
                    "bg-black/40 text-white/90 border",
                    "placeholder:text-white/35",
                    "focus:outline-none focus:ring-2 focus:ring-purple-400/20 focus:border-purple-300/25"
                  )}
                  style={{ borderColor: THEME.borderSoft }}
                />

                <div className="flex flex-wrap gap-3">
                  <AlertDialogCancel
                    onClick={() => setIsDialogOpen(false)}
                    className="px-4 py-2 rounded-2xl border text-white/85 bg-white/5 hover:bg-white/10 transition"
                    style={{ borderColor: THEME.borderSoft }}
                  >
                    Close
                  </AlertDialogCancel>

                  <button
                    className={cx(
                      "px-4 py-2 rounded-2xl font-black text-white transition border",
                      actionType === "approve" && "opacity-70 cursor-not-allowed"
                    )}
                    style={{
                      borderColor: `${THEME.green}55`,
                      background: `linear-gradient(135deg, ${THEME.green}25, rgba(0,0,0,0))`,
                    }}
                    disabled={actionType === "approve"}
                    onClick={() => selectedUser && handleConfirmAction(selectedUser, "approve")}
                  >
                    {actionType === "approve" ? "Approving..." : "Approve"}
                  </button>

                  <button
                    className={cx(
                      "px-4 py-2 rounded-2xl font-black text-white transition border",
                      actionType === "reject" && "opacity-70 cursor-not-allowed"
                    )}
                    style={{
                      borderColor: `${THEME.pink}55`,
                      background: `linear-gradient(135deg, ${THEME.pink}25, rgba(0,0,0,0))`,
                    }}
                    disabled={actionType === "reject"}
                    onClick={() => selectedUser && handleConfirmAction(selectedUser, "reject")}
                  >
                    {actionType === "reject" ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default KycUsers;

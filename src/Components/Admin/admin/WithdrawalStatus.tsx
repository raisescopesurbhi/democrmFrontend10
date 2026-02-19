// ✅ Fully Mobile Responsive (ManageUsers style) + Desktop Unchanged
// Changes:
// 1) Mobile: Top circles -> vertical stack (desktop wrap unchanged)
// 2) Mobile: Table -> card list
// 3) Mobile: Separate pagination block (ManageUsers style)
// 4) Proof "View" -> separate Proof dialog (fixes previous conflict with approve/reject dialog)
// 5) CircleNav supports size for mobile (smaller circles)
   
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  CircleCheckBig,
  CircleX,
  Loader,
  Search,
  RefreshCw,
  Filter,
  BadgeDollarSign,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  WalletCardsIcon,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import toast from "react-hot-toast";
import { backendApi, metaApi } from "../../../utils/apiClients";
import { CFcalculateTimeSinceJoined, CFformatDate } from "../../../utils/CustomFunctions";

/* ===================== THEME (EXACT) ===================== */
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

const cx = (...c: Array<string | false | undefined | null>) => c.filter(Boolean).join(" ");

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

/* ===================== FULL CIRCLE NAV ===================== */
type CircleNavProps = {
  to?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  Icon: any;
  accent: string;
  size?: number; // ✅ mobile sizing
};

const CircleNav = ({ to, onClick, active, disabled, label, Icon, accent, size = 160 }: CircleNavProps) => {
  const inner = (
    <div className="flex flex-col items-center gap-4 select-none">
      <div
        className={cx(
          "relative grid place-items-center rounded-full transition-transform duration-200",
          disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.06]"
        )}
        style={{
          width: size,
          height: size,
          background: active
            ? `radial-gradient(120% 120% at 30% 20%, ${accent}30, rgba(0,0,0,0.18) 62%)`
            : "rgba(255,255,255,0.06)",
          border: active ? `2px solid ${accent}80` : `2px solid rgba(255,255,255,0.16)`,
          boxShadow: active
            ? `0 0 44px ${accent}2a, inset 0 0 28px ${accent}16`
            : "inset 0 0 18px rgba(255,255,255,0.10)",
        }}
      >
        {/* conic ring */}
        <div
          className="absolute inset-[-6px] rounded-full opacity-90"
          style={{
            background: `conic-gradient(from 180deg, ${THEME.gold}90, ${accent}, ${THEME.gold}25, ${accent})`,
            maskImage: "radial-gradient(circle, transparent 62%, black 63%)",
            WebkitMaskImage: "radial-gradient(circle, transparent 62%, black 63%)",
          }}
        />

        {/* icon bubble */}
        <div
          className="relative rounded-full border"
          style={{
            padding: size >= 160 ? 20 : 16,
            borderColor: `${accent}55`,
            background: `linear-gradient(135deg, ${accent}24, rgba(0,0,0,0))`,
            boxShadow: `inset 0 0 22px ${accent}18`,
          }}
        >
          <Icon className={size >= 160 ? "w-10 h-10" : "w-8 h-8"} style={{ color: active ? accent : THEME.gold }} />
        </div>
      </div>

      <div
        className={cx(
          "text-sm font-extrabold tracking-wide text-center leading-tight max-w-[180px]",
          active ? "text-white" : "text-white/75"
        )}
      >
        {label}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className={cx("inline-flex", disabled && "pointer-events-none")}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx("inline-flex", disabled && "pointer-events-none")}
    >
      {inner}
    </button>
  );
};

/* ===================== KPI FULL CIRCLE (unchanged, kept) ===================== */
type StatCircleProps = {
  icon: JSX.Element;
  amount: string;
  label: string;
  link: string;
  allLoading: boolean;
  accent: string;
};

const StatCircle = ({ icon, amount, label, link, allLoading, accent }: StatCircleProps) => {
  return (
    <Link to={link} className="block">
      <div className="flex flex-col items-center gap-3 select-none">
        <div
          className="relative grid place-items-center rounded-full hover:scale-[1.06] transition-transform"
          style={{
            width: 170,
            height: 170,
            background: `radial-gradient(120% 120% at 30% 20%, ${accent}24, rgba(0,0,0,0.18) 62%)`,
            border: `2px solid ${accent}55`,
            boxShadow: `0 0 40px ${accent}22, inset 0 0 26px ${accent}14`,
          }}
        >
          <div
            className="absolute inset-[-6px] rounded-full opacity-90"
            style={{
              background: `conic-gradient(from 180deg, ${THEME.gold}90, ${accent}, ${THEME.gold}25, ${accent})`,
              maskImage: "radial-gradient(circle, transparent 63%, black 64%)",
              WebkitMaskImage: "radial-gradient(circle, transparent 63%, black 64%)",
            }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <div className="mb-2 grid place-items-center h-12 w-12 rounded-full border border-white/10 bg-white/5">
              {icon}
            </div>
            <div className="text-2xl font-black text-white leading-none">{allLoading ? "Loading…" : amount}</div>
            <div className="mt-2 text-xs font-bold" style={{ color: THEME.textMuted }}>
              {label}
            </div>
          </div>
        </div>

        <div className="text-xs font-bold text-white/50">View</div>
      </div>
    </Link>
  );
};

const StatusBadge = ({ status }: { status?: string }) => {
  const s = (status || "").toLowerCase();
  if (s === "pending")
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-black bg-blue-500/15 border-blue-300/30 text-blue-100">
        <AlertTriangle size={14} /> Pending
      </span>
    );
  if (s === "approved")
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-black bg-emerald-500/15 border-emerald-300/30 text-emerald-100">
        <CheckCircle2 size={14} /> Approved
      </span>
    );
  if (s === "rejected")
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-black bg-pink-500/15 border-pink-300/30 text-pink-100">
        <XCircle size={14} /> Rejected
      </span>
    );
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-black bg-white/5 border-white/10 text-white/70">
      <Filter size={14} /> {status || "Unknown"}
    </span>
  );
};

const Field = ({ label, value }: { label: string; value?: any }) => (
  <div className="flex items-start justify-between gap-3 py-1">
    <div className="text-white/45 text-sm">{label}</div>
    <div className="text-white/85 text-sm font-semibold text-right break-all">{value ?? "—"}</div>
  </div>
);

/* ================================ Component ================================ */
const WithdrawalStatus = () => {
  const { status } = useParams();

  const [depositData, setDepositData] = useState<any[]>([]);
  const [selectedDeposit, setSelectedDeposit] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"" | "approve" | "reject">("");
  const [loading, setLoading] = useState(false);

  const isAll = status === "all";
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [allDepositData, setAllDepositData] = useState<any[]>([]);
  const [allLoading, setAllLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [pagination, setPagination] = useState<any>({});
  const [isActionLoading, setIsActionLoading] = useState(false);

  // ✅ Proof dialog (separate from approve/reject dialog)
  const [showProof, setShowProof] = useState(false);
  const [proofItem, setProofItem] = useState<any | null>(null);

  const PAGE_SIZE = 10;

  const totalPages =
    Math.max(
      1,
      Number(pagination?.totalPages) || Math.ceil((Number(pagination?.totalWithdrawals) || 0) / PAGE_SIZE)
    ) || 1;

  const fetchApiData = async () => {
    setLoading(true);
    try {
      let finalRes: any;
      const base = `admin/withdrawals?page=${currentPage}&limit=${PAGE_SIZE}&search=${encodeURIComponent(debouncedSearch)}`;

      if (status === "all") finalRes = (await backendApi.get(`${base}&status=`)).data;
      else if (status === "pending") finalRes = (await backendApi.get(`${base}&status=pending`)).data;
      else if (status === "approved") finalRes = (await backendApi.get(`${base}&status=approved`)).data;
      else if (status === "rejected") finalRes = (await backendApi.get(`${base}&status=rejected`)).data;
      else finalRes = (await backendApi.get(base)).data;

      setDepositData(finalRes.data || []);
      setPagination(finalRes.pagination || {});
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Error fetching withdrawals:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const allRes = await backendApi.get(`admin/withdrawals`);
      setAllDepositData(allRes.data?.data || []);
    } catch {
      console.log("failed to fetch all data");
    } finally {
      setAllLoading(false);
    }
  };

  const handleActionClick = (deposit: any, action: "approve" | "reject") => {
    setSelectedDeposit(deposit);
    setActionType(action);
    setIsDialogOpen(true);
  };

  const handleConfirmAction = async (dep: any) => {
    if (isActionLoading || !dep) return;

    const toastId = toast.loading("Please wait..");
    setIsActionLoading(true);

    try {
        if (actionType === "approve") {
      await backendApi.post("/meta/withdrawal-balance", {  
        mt5Account: dep.mt5Account,
        amount: dep.amount,
        comment: "Withdrawal",
      });

        await backendApi.put(`/admin/update-withdrawal`, { _id: dep._id, status: "approved" });
        setDepositData((prev) => prev.map((d) => (d._id === dep._id ? { ...d, status: "approved" } : d)));
        toast.success("Withdrawal Approved", { id: toastId });
      } else if (actionType === "reject") {
        await backendApi.put(`/admin/update-withdrawal`, { _id: dep._id, status: "rejected" });
        setDepositData((prev) => prev.map((d) => (d._id === dep._id ? { ...d, status: "rejected" } : d)));
        toast.success("Withdrawal Rejected", { id: toastId });
      }

      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
      console.error("Error updating withdrawal status:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  // totals (kept)
  const TotalDeposits = allDepositData.reduce((t, i) => t + Number(i.amount || 0), 0).toFixed(2);
  const TotalPendingDeposits = allDepositData
    .filter((i) => i.status === "pending")
    .reduce((t, i) => t + Number(i.amount || 0), 0)
    .toFixed(2);
  const TotalSuccessfullDeposits = allDepositData
    .filter((i) => i.status === "approved")
    .reduce((t, i) => t + Number(i.amount || 0), 0)
    .toFixed(2);
  const TotalRejectedDeposits = allDepositData
    .filter((i) => i.status === "rejected")
    .reduce((t, i) => t + Number(i.amount || 0), 0)
    .toFixed(2);

  const kpiCircles = useMemo(
    () => [
      {
        icon: <ArrowLeftRight className="text-white/85" size={22} />,
        amount: TotalDeposits,
        label: "Total Withdrawals",
        link: "/admin/withdrawal/all",
        accent: THEME.blue,
      },
      {
        icon: <CircleCheckBig className="text-white/85" size={22} />,
        amount: TotalSuccessfullDeposits,
        label: "Successful",
        link: "/admin/withdrawal/approved",
        accent: THEME.green,
      },
      {
        icon: <Loader className="text-white/85" size={22} />,
        amount: TotalPendingDeposits,
        label: "Pending",
        link: "/admin/withdrawal/pending",
        accent: THEME.pink,
      },
      {
        icon: <CircleX className="text-white/85" size={22} />,
        amount: TotalRejectedDeposits,
        label: "Rejected",
        link: "/admin/withdrawal/rejected",
        accent: THEME.red,
      },
    ],
    [TotalDeposits, TotalSuccessfullDeposits, TotalPendingDeposits, TotalRejectedDeposits]
  );

  const handleNextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  useEffect(() => setCurrentPage(1), [debouncedSearch, status]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 450);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    fetchApiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, currentPage, debouncedSearch]);

  useEffect(() => {
    if (status === "all") fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const activeKey = (status || "all") as "all" | "pending" | "approved" | "rejected";

  // ✅ Proof helpers (safe fallbacks)
  const imgUrl = (p?: string) => (p ? `${import.meta.env.VITE_API_BASE_URL}/${p}` : "");
  const getProofPath = (it: any) => it?.withdrawalSS || it?.withdrawalProof || it?.proof || it?.ss || it?.proofImage || "";

  // ✅ Mobile pagination window (ManageUsers style)
  const getPageWindow = (current: number, total: number, size = 7) => {
    const half = Math.floor(size / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + size - 1);
    start = Math.max(1, end - size + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      style={{ background: THEME.bg0, color: THEME.text }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <AuroraBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-14">
        {/* ✅ FULL CIRCLE TOP BAR */}
        <Glass className="p-4 sm:p-6">
          {/* ✅ Mobile: vertical circles (ManageUsers style) */}
          <div className="md:hidden">
            <div className="flex flex-col items-center gap-8">
              <CircleNav size={140} to="/admin/withdrawal/all" active={activeKey === "all"} label="All Withdrawals" Icon={BadgeDollarSign} accent={THEME.teal} />
              <CircleNav size={140} to="/admin/withdrawal/pending" active={activeKey === "pending"} label="Pending" Icon={Loader} accent={THEME.pink} />
              <CircleNav size={140} to="/admin/withdrawal/approved" active={activeKey === "approved"} label="Approved" Icon={CircleCheckBig} accent={THEME.green} />
              <CircleNav size={140} to="/admin/withdrawal/rejected" active={activeKey === "rejected"} label="Rejected" Icon={CircleX} accent={THEME.red} />
              <CircleNav size={140} onClick={fetchApiData} disabled={loading} active={false} label={loading ? "Refreshing" : "Refresh"} Icon={RefreshCw} accent={THEME.orange} />
            </div>
          </div>

          {/* ✅ Desktop: unchanged wrap */}
          <div className="hidden md:flex flex-wrap items-start justify-center gap-12">
            <CircleNav to="/admin/withdrawal/all" active={activeKey === "all"} label="All Withdrawals" Icon={BadgeDollarSign} accent={THEME.teal} />
            <CircleNav to="/admin/withdrawal/pending" active={activeKey === "pending"} label="Pending" Icon={Loader} accent={THEME.pink} />
            <CircleNav to="/admin/withdrawal/approved" active={activeKey === "approved"} label="Approved" Icon={CircleCheckBig} accent={THEME.green} />
            <CircleNav to="/admin/withdrawal/rejected" active={activeKey === "rejected"} label="Rejected" Icon={CircleX} accent={THEME.red} />
            <CircleNav onClick={fetchApiData} disabled={loading} active={false} label={loading ? "Refreshing" : "Refresh"} Icon={RefreshCw} accent={THEME.orange} />
          </div>

          {/* Search BELOW circles */}
          <div className="mt-6 md:mt-10 flex justify-center">
            <div className="w-full max-w-3xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by email, name, MT5 Account"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 md:py-4 rounded-full bg-black/40 border text-white placeholder:text-white/40 focus:outline-none focus:ring-2"
                  style={{ borderColor: THEME.borderSoft }}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                {!!searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xl leading-none"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </Glass>

        {/* ✅ KPI -> kept commented exactly as your version */}
        {/* <div className="mt-8">
          {isAll ? (
            <div className="flex flex-wrap justify-center gap-10">
              {kpiCircles.map((s, i) => (
                <StatCircle key={i} {...s} allLoading={allLoading} />
              ))}
            </div>
          ) : (
            <div
              className="rounded-3xl border p-5 text-center"
              style={{
                borderColor: THEME.borderSoft,
                background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,
              }}
            >
              <div className="text-sm font-bold" style={{ color: THEME.textMuted }}>
                KPI circles are available on <span className="text-white">All</span> withdrawals.
              </div>
            </div>
          )}
        </div> */}

        {/* ✅ LIST/TABLE */}
        <div className="mt-6 md:mt-8">
          <Glass className="overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b" style={{ borderColor: THEME.borderSoft }}>
              <h2 className="text-lg sm:text-xl font-black">
                <span style={{ color: THEME.pink }}>Total records</span>{" "}
                <span className="text-white/80 font-black">({pagination?.totalWithdrawals || 0})</span>
              </h2>
            </div>

            {/* ✅ Mobile: Cards list (ManageUsers style) */}
            <div className="sm:hidden px-4 pb-4">
              {loading ? (
                <div className="py-12 text-center text-white/70">
                  <Loader className="inline animate-spin" />
                  <span className="ml-2">Loading...</span>
                </div>
              ) : !depositData?.length ? (
                <div className="py-10 text-center text-white/60">No withdrawals found.</div>
              ) : (
                <div className="space-y-3 pt-4">
                  {depositData.map((item: any) => (
                    <div
                      key={item._id}
                      className="rounded-3xl border backdrop-blur-xl p-4"
                      style={{
                        background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,
                        borderColor: THEME.borderSoft,
                        boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-extrabold text-white truncate">
                            {item?.userData?.firstName || "Not found"} {item?.userData?.lastName || ""}
                          </div>
                          <div className="text-sm text-white/55 truncate">{item?.userData?.email || "Not found"}</div>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="text-xs text-white/60">MT5 AC</div>
                        <div className="text-right text-sm text-white/85 font-semibold">{item?.mt5Account || "—"}</div>

                        <div className="text-xs text-white/60">AC Type</div>
                        <div className="text-right">
                          <span className="inline-flex px-3 py-1 rounded-full text-xs bg-white/10 text-white border border-white/20 font-semibold">
                            {item?.accountType || "--"}
                          </span>
                        </div>

                        <div className="text-xs text-white/60">Amount</div>
                        <div className="text-right font-black text-white">${Number(item?.amount || 0).toFixed(2)}</div>

                        <div className="text-xs text-white/60">Requested</div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-white/85">{CFformatDate(item?.createdAt)}</div>
                          <div className="text-[11px] text-white/50">{CFcalculateTimeSinceJoined(item?.createdAt)}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border bg-white/10 text-white hover:bg-white/20 transition font-extrabold"
                          style={{ borderColor: THEME.borderSoft }}
                          onClick={() => {
                            setProofItem(item);
                            setShowProof(true);
                          }}
                        >
                          <WalletCardsIcon size={16} />
                          Proof
                        </button>

                        {item.status === "pending" ? (
                          <div className="flex items-center gap-3">
                            <button
                              className="inline-flex items-center justify-center w-12 h-12 rounded-full border bg-white/10 hover:bg-white/20 transition text-emerald-200"
                              style={{ borderColor: THEME.borderSoft }}
                              onClick={() => handleActionClick(item, "approve")}
                              aria-label="Approve"
                            >
                              <CircleCheckBig />
                            </button>
                            <button
                              className="inline-flex items-center justify-center w-12 h-12 rounded-full border bg-white/10 hover:bg-white/20 transition text-pink-200"
                              style={{ borderColor: THEME.borderSoft }}
                              onClick={() => handleActionClick(item, "reject")}
                              aria-label="Reject"
                            >
                              <CircleX />
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ✅ Desktop: Table (unchanged view) */}
            <div className="hidden sm:block overflow-x-auto scrollbar-neon">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="bg-black/30 border-b" style={{ borderColor: THEME.borderSoft }}>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">User</th>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">MT5 AC</th>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">AC Type</th>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">Withdrawal</th>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">Requested At</th>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">Proof</th>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-14">
                        <div className="flex justify-center items-center gap-3 text-white/70">
                          <Loader className="animate-spin" />
                          Loading...
                        </div>
                      </td>
                    </tr>
                  ) : depositData?.length ? (
                    depositData.map((item: any) => (
                      <tr
                        key={item._id}
                        className="border-b hover:bg-white/5 transition"
                        style={{ borderColor: THEME.borderSoft }}
                      >
                        <td className="py-4 px-6">
                          <div className="font-black text-white">
                            {item?.userData?.firstName || "Not found"} {item?.userData?.lastName || ""}
                          </div>
                          <div className="text-sm text-white/50">{item?.userData?.email || "Not found"}</div>
                        </td>

                        <td className="py-4 px-6 text-white/85 font-semibold">{item?.mt5Account || "—"}</td>

                        <td className="py-4 px-6">
                          <span className="inline-flex px-3 py-1 rounded-full text-sm bg-white/10 text-white border border-white/20 font-semibold">
                            {item?.accountType || "--"}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-black text-white">${Number(item?.amount || 0).toFixed(2)}</td>

                        <td className="py-4 px-6">
                          <div className="text-white/85 font-semibold">{CFformatDate(item?.createdAt)}</div>
                          <div className="text-xs text-white/45">{CFcalculateTimeSinceJoined(item?.createdAt)}</div>
                        </td>

                        <td className="py-4 px-6">
                          <button
                            className="inline-flex items-center gap-2 text-amber-200/80 hover:text-amber-200 transition font-semibold"
                            onClick={() => {
                              setProofItem(item);
                              setShowProof(true);
                            }}
                          >
                            <WalletCardsIcon className="w-4 h-4" />
                            View
                          </button>
                        </td>

                        <td className="py-4 px-6">
                          {item.status === "pending" ? (
                            isActionLoading ? (
                              <span className="text-white/50">Please wait…</span>
                            ) : (
                              <div className="flex items-center gap-5">
                                <button
                                  className="text-emerald-300 hover:text-emerald-200 hover:scale-110 transition"
                                  onClick={() => handleActionClick(item, "approve")}
                                  aria-label="Approve"
                                >
                                  <CircleCheckBig />
                                </button>
                                <button
                                  className="text-pink-300 hover:text-pink-200 hover:scale-110 transition"
                                  onClick={() => handleActionClick(item, "reject")}
                                  aria-label="Reject"
                                >
                                  <CircleX />
                                </button>
                              </div>
                            )
                          ) : (
                            <StatusBadge status={item.status} />
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-white/60">
                        No withdrawals found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ Desktop Pagination (kept same style; desktop only) */}
            <div className="hidden sm:block px-4 sm:px-6 py-4 border-t" style={{ borderColor: THEME.borderSoft }}>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <button
                    onClick={handlePreviousPage}  
                    disabled={currentPage === 1}
                    className={cx(
                      "px-4 py-2 rounded-xl border font-bold transition",
                      currentPage === 1
                        ? "bg-white/5 text-white/35 border-white/10 cursor-not-allowed"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    )}
                  >
                    ← Previous
                  </button>

                  <div className="text-xs text-white/50">
                    Page <span className="text-white font-black">{currentPage}</span> of{" "}
                    <span className="text-white font-black">{totalPages}</span>
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={cx(
                      "px-4 py-2 rounded-xl border font-bold transition",
                      currentPage === totalPages
                        ? "bg-white/5 text-white/35 border-white/10 cursor-not-allowed"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    )}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>

            {/* ✅ Mobile pagination (ManageUsers style) */}
            <div className="sm:hidden px-4 py-4 border-t" style={{ borderColor: THEME.borderSoft }}>
              <div className="text-xs mb-3 text-center" style={{ color: THEME.textMuted }}>
                Page <span className="text-white font-black">{currentPage}</span> of{" "}
                <span className="text-white font-black">{totalPages}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={cx(
                    "px-4 py-2 rounded-full border font-extrabold transition w-1/2",
                    currentPage === 1
                      ? "bg-white/5 text-white/30 border-white/10 cursor-not-allowed"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  )}
                >
                  ← Back
                </button>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={cx(
                    "px-4 py-2 rounded-full border font-extrabold transition w-1/2",
                    currentPage === totalPages
                      ? "bg-white/5 text-white/30 border-white/10 cursor-not-allowed"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  )}
                >
                  Next →
                </button>
              </div>

              <div className="mt-3 flex items-center justify-center gap-1 flex-wrap">
                {getPageWindow(currentPage, totalPages, 7).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cx(
                      "w-9 h-9 rounded-full border font-extrabold transition",
                      currentPage === page ? "text-white" : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
                    )}
                    style={
                      currentPage === page
                        ? {
                            background: `linear-gradient(135deg, ${THEME.purple}, ${THEME.pink})`,
                            borderColor: "rgba(255,255,255,0.22)",
                          }
                        : undefined
                    }
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </Glass>
        </div>
      </div>

      {/* Approve/Reject Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-2xl bg-black/80 text-white border border-white/10 rounded-3xl backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black">
              {actionType === "approve" ? "Approve Withdrawal" : "Reject Withdrawal"}
            </AlertDialogTitle>

            <AlertDialogDescription >
              {selectedDeposit && (
                <div className="space-y-4 text-white/70">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-white font-black mb-2">Withdrawal Details</div>
                    <Field
                      label="User"
                      value={`${selectedDeposit.userData?.firstName || ""} ${selectedDeposit.userData?.lastName || ""}`}
                    />
                    <Field label="Email" value={selectedDeposit.userData?.email} />
                    <Field label="MT5 Account" value={selectedDeposit?.mt5Account} />
                    <Field label="Account Type" value={selectedDeposit?.accountType} />
                    <Field label="Method" value={selectedDeposit?.method} />
                    <Field label="Amount" value={`$${Number(selectedDeposit?.amount || 0).toFixed(2)}`} />
                    <Field label="Date" value={CFformatDate(selectedDeposit?.updatedAt)} />
                  </div>

                  <div className="text-sm">
                    Are you sure you want to{" "}
                    <span className={actionType === "approve" ? "text-emerald-300 font-black" : "text-pink-300 font-black"}>
                      {actionType === "approve" ? "approve" : "reject"}
                    </span>{" "}
                    this withdrawal?
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=>setIsDialogOpen(false)} className="px-4 py-2 rounded-2xl border border-white/10 text-white/80 hover:bg-white/10 transition">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => selectedDeposit && handleConfirmAction(selectedDeposit)}
              disabled={isActionLoading}
              className={cx(
                "px-4 py-2 rounded-2xl font-black transition",
                "border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-60"
              )}
            >
              {isActionLoading ? "Processing..." : `Confirm ${actionType === "approve" ? "Approval" : "Rejection"}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ✅ Proof Dialog (separate) */}
      <AlertDialog open={showProof} onOpenChange={setShowProof}>
        <AlertDialogContent className="max-w-3xl bg-black/80 text-white border border-white/10 rounded-3xl backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black">Proof</AlertDialogTitle>
            <AlertDialogDescription >
              <div className="text-white/70">
                {getProofPath(proofItem) ? (
                  <img
                    src={imgUrl(getProofPath(proofItem))}
                    alt="Proof"
                    className="my-6 w-full rounded-2xl h-auto border border-white/10 bg-black/40"
                  />
                ) : (
                  <div className="my-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-white/60">
                    Proof not available for this record.
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=>setIsDialogOpen(false)}  className="px-4 py-2 rounded-2xl border border-white/10 text-white/80 hover:bg-white/10 transition">
              Close
            </AlertDialogCancel>

            {getProofPath(proofItem) ? (
              <AlertDialogAction
                className={cx(
                  "px-4 py-2 rounded-2xl font-black transition",
                  "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                )}
              >
                <a target="_blank" rel="noreferrer" href={imgUrl(getProofPath(proofItem))}>
                  View Full Image
                </a>
              </AlertDialogAction>
            ) : null}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default WithdrawalStatus;

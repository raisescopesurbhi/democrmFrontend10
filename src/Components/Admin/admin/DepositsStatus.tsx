import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  CircleCheckBig,
  CircleX,
  Image as ImageIcon,
  Loader,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock3,
  XCircle,
  ListChecks,
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

/** ✅ FULL CIRCLE button (DashboardBase style) */
type CircleNavProps = {
  to?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  Icon: any;
  accent: string;
};

const CircleNav = ({ to, onClick, active, disabled, label, Icon, accent }: CircleNavProps) => {
  const inner = (
    <div className="flex flex-col items-center gap-4 select-none">
      <div
        className={cx(
          "relative grid place-items-center rounded-full transition-transform duration-200",
          disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.06]"
        )}
        style={{
          width: 160,
          height: 160,
          background: active
            ? `linear-gradient(135deg, ${accent}22, rgba(255,255,255,0.04))`
            : "rgba(255,255,255,0.06)",
          border: active ? `2px solid ${accent}75` : `2px solid rgba(255,255,255,0.16)`,
          boxShadow: active
            ? `0 0 44px ${accent}2a, inset 0 0 28px ${accent}14`
            : "inset 0 0 18px rgba(255,255,255,0.10)",
        }}
      >
        {/* outer conic ring */}
        <div
          className="absolute inset-[-6px] rounded-full opacity-90"
          style={{
            background: `conic-gradient(from 180deg, ${THEME.gold}90, ${accent}, ${THEME.gold}25, ${accent})`,
            maskImage: "radial-gradient(circle, transparent 62%, black 63%)",
            WebkitMaskImage: "radial-gradient(circle, transparent 62%, black 63%)",
          }}
        />

        {/* inner glow */}
        <div
          className="absolute inset-3 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 25%, ${accent}26, transparent 65%)`,
            filter: "blur(0px)",
          }}
        />

        {/* icon bubble */}
        <div
          className="relative rounded-full border"
          style={{
            padding: 20,
            borderColor: `${accent}55`,
            background: `linear-gradient(135deg, ${accent}24, rgba(0,0,0,0))`,
            boxShadow: `inset 0 0 22px ${accent}18`,
          }}
        >
          <Icon className="w-10 h-10" style={{ color: active ? accent : THEME.gold }} />
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

const DepositsStatus = () => {
  const { status } = useParams();

  const [depositData, setDepositData] = useState<any[]>([]);
  const [selectedDeposit, setSelectedDeposit] = useState<any | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"" | "approve" | "reject">("");

  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const [allDepositData, setAllDepositData] = useState<any[]>([]);
  const [allLoading, setAllLoading] = useState(true);

  const [pagination, setPagination] = useState<any>({});
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [comment, setComment] = useState("");

  const isAll = status === "all";
  const activeKey = (status || "all") as "all" | "pending" | "approved" | "rejected";

  const PAGE_SIZE = 10;
  const DOTS = "...";
  const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => i + start);

  const totalPages =
    Math.max(
      1,
      Number(pagination?.totalPages) || Math.ceil((Number(pagination?.totalDeposits) || 0) / PAGE_SIZE)
    ) || 1;

  const getPaginationRange = (total: number, current: number, siblingCount = 1): Array<number | string> => {
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

  const paginationRange = useMemo(() => getPaginationRange(totalPages, currentPage, 1), [totalPages, currentPage]);

  const mobilePaginationRange = useMemo(
    () => getPaginationRange(totalPages, currentPage, 0),
    [totalPages, currentPage]
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) setCurrentPage(page);
  };

  const togglePreview = (item: any) => {
    setShowPreview(true);
    setSelectedDeposit(item);
  };

  const handleActionClick = (deposit: any, action: "approve" | "reject") => {
    setSelectedDeposit(deposit);
    setActionType(action);
    setComment("");
    setIsDialogOpen(true);
  };

  // ===== APIs / workflow unchanged =====
  const fetchApiData = async () => {
    setLoading(true);
    try {
      let finalRes: any;
      const base = `admin/deposits?page=${currentPage}&limit=${PAGE_SIZE}&search=${encodeURIComponent(debouncedSearch)}`;

      if (status === "all") finalRes = (await backendApi.get(`${base}&status=`)).data;
      else if (status === "pending") finalRes = (await backendApi.get(`${base}&status=pending`)).data;
      else if (status === "approved") finalRes = (await backendApi.get(`${base}&status=approved`)).data;
      else if (status === "rejected") finalRes = (await backendApi.get(`${base}&status=rejected`)).data;
      else finalRes = (await backendApi.get(base)).data;

      setDepositData(finalRes.data || []);
      setPagination(finalRes.pagination || {});
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Error fetching deposits:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const allRes = await backendApi.get(`admin/deposits`);
      setAllDepositData(allRes.data.data || []);
    } catch {
      console.log("failed to fetch all data");
    } finally {
      setAllLoading(false);
    }
  };

  const handleConfirmAction = async (selected: any) => {
    if (isActionLoading) return;

    const toastId = toast.loading("Please wait..");
    setIsActionLoading(true);
    try {
      if (actionType === "approve") {
        const depositApires = await backendApi.post("/meta/deposit-balance", {
  MT5Account: Number(selected.mt5Account),
  amount: Number(selected.deposit),
  Comment: "deposit",
});

console.log("Deposit API response:", depositApires);
        setIsDialogOpen(false);

        if (depositApires.data.data) {
          await backendApi.put(`/admin/update-deposit`, {
            _id: selected._id,
            status: "approved",
            email: selected.userId.email,
            subject: "Withdrawal Rejected",
            selectedDeposit: selected,
          });

          setDepositData((prev) => prev.map((d) => (d._id === selected._id ? { ...d, status: "approved" } : d)));

          toast.success("Deposit Approved", { id: toastId });
          await fetchApiData();
        } else {
          toast.error("Failed, Please retry!!", { id: toastId });
        }
      } else if (actionType === "reject") {
        await backendApi.put(`/admin/update-deposit`, {
          _id: selected._id,
          status: "rejected",
          email: selected.userId.email,
          subject: "Deposit Rejected",
          selectedDeposit: selected,
        });

        setDepositData((prev) => prev.map((d) => (d._id === selected._id ? { ...d, status: "rejected" } : d)));

        setIsDialogOpen(false);
        setSelectedDeposit(null);
        toast.success("Deposit Rejected", { id: toastId });
        await fetchApiData();
      }
    } catch (error) {
      console.error("Error updating deposit status:", error);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsActionLoading(false);
      setComment("");
    }
  };


  // totals (unchanged)
  const TotalDeposits = allDepositData.reduce((t, i) => t + Number(i.deposit || 0), 0).toFixed(2);
  const TotalPendingDeposits = allDepositData
    .filter((i) => i.status === "pending")
    .reduce((t, i) => t + Number(i.deposit || 0), 0)
    .toFixed(2);
  const TotalSuccessfullDeposits = allDepositData
    .filter((i) => i.status === "approved")
    .reduce((t, i) => t + Number(i.deposit || 0), 0)
    .toFixed(2);
  const TotalRejectedDeposits = allDepositData
    .filter((i) => i.status === "rejected")
    .reduce((t, i) => t + Number(i.deposit || 0), 0)
    .toFixed(2);

  // (kept, even if KPI UI is commented)
  useMemo(
    () => [
      {
        icon: <ArrowLeftRight className="text-white/85" size={22} />,
        amount: TotalDeposits,
        label: "Total Deposits",
        link: "/admin/deposit/all",
        accent: THEME.blue,
      },
      {
        icon: <CheckCircle2 className="text-white/85" size={22} />,
        amount: TotalSuccessfullDeposits,
        label: "Successful",
        link: "/admin/deposit/approved",
        accent: THEME.green,
      },
      {
        icon: <Clock3 className="text-white/85" size={22} />,
        amount: TotalPendingDeposits,
        label: "Pending",
        link: "/admin/deposit/pending",
        accent: THEME.pink,
      },
      {
        icon: <XCircle className="text-white/85" size={22} />,
        amount: TotalRejectedDeposits,
        label: "Rejected",
        link: "/admin/deposit/rejected",
        accent: THEME.red,
      },
    ],
    [TotalDeposits, TotalSuccessfullDeposits, TotalPendingDeposits, TotalRejectedDeposits]
  );

  const handleNextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 450);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchApiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, currentPage, debouncedSearch]);

  useEffect(() => {
    if (status === "all") fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => setCurrentPage(1), [debouncedSearch, status]);

  const imgUrl = (p?: string) => (p ? `${import.meta.env.VITE_API_BASE_URL}/${p}` : "");

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      style={{ color: THEME.text, background: THEME.bg0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <AuroraBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 pb-14">
        {/* ✅ TOP CIRCLES BAR (desktop unchanged, mobile like ManageUsers) */}
        <Glass className="p-4 sm:p-6">
          {/* ✅ Mobile: circles vertically */}
          <div className="sm:hidden">
            <div className="flex flex-col items-center gap-10">
              <CircleNav
                to="/admin/deposit/all"
                active={activeKey === "all"}
                label="All Deposits"
                Icon={ListChecks}
                accent={THEME.teal}
              />
              <CircleNav
                to="/admin/deposit/pending"
                active={activeKey === "pending"}
                label="Pending"
                Icon={Loader}
                accent={THEME.pink}
              />
              <CircleNav
                to="/admin/deposit/approved"
                active={activeKey === "approved"}
                label="Approved"
                Icon={CircleCheckBig}
                accent={THEME.green}
              />
              <CircleNav
                to="/admin/deposit/rejected"
                active={activeKey === "rejected"}
                label="Rejected"
                Icon={CircleX}
                accent={THEME.red}
              />
              <CircleNav
                onClick={fetchApiData}
                disabled={loading}
                active={false}
                label={loading ? "Refreshing" : "Refresh"}
                Icon={RefreshCw}
                accent={THEME.orange}
              />
            </div>
          </div>

          {/* ✅ Desktop: EXACT same layout */}
          <div className="hidden sm:flex flex-wrap items-start justify-center gap-12">
            <CircleNav
              to="/admin/deposit/all"
              active={activeKey === "all"}
              label="All Deposits"
              Icon={ListChecks}
              accent={THEME.teal}
            />
            <CircleNav
              to="/admin/deposit/pending"
              active={activeKey === "pending"}
              label="Pending"
              Icon={Loader}
              accent={THEME.pink}
            />
            <CircleNav
              to="/admin/deposit/approved"
              active={activeKey === "approved"}
              label="Approved"
              Icon={CircleCheckBig}
              accent={THEME.green}
            />
            <CircleNav
              to="/admin/deposit/rejected"
              active={activeKey === "rejected"}
              label="Rejected"
              Icon={CircleX}
              accent={THEME.red}
            />
            <CircleNav
              onClick={fetchApiData}
              disabled={loading}
              active={false}
              label={loading ? "Refreshing" : "Refresh"}
              Icon={RefreshCw}
              accent={THEME.orange}
            />
          </div>

          {/* ✅ Search BELOW circles */}
          <div className="mt-6 sm:mt-10 flex justify-center">
            <div className="w-full max-w-3xl">
              <div className="relative">  
                <input
                  type="text"
                  placeholder="Search by email, name, MT5 Account"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 sm:pl-12 pr-10 py-3 sm:py-4 rounded-full bg-black/40 border text-white placeholder:text-white/40 focus:outline-none focus:ring-2"
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

        {/* ✅ Mobile: Cards list (like ManageUsers) */}
        <div className="sm:hidden mt-6 space-y-3">
          {loading ? (
            <Glass className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 text-white/70">
                <Loader className="animate-spin" />
                Loading...
              </div>
            </Glass>
          ) : depositData?.length ? (
            depositData.map((item: any) => (
              <Glass key={item._id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-extrabold text-white truncate">
                      {item?.userId?.firstName || "Not found"} {item?.userId?.lastName || ""}
                    </div>
                    <div className="text-sm text-white/55 truncate">{item?.userId?.email || "Not found"}</div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-[11px] font-bold text-white/45">Amount</div>
                    <div className="text-lg font-black text-white">${Number(item?.deposit || 0).toFixed(2)}</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="text-xs text-white/60">MT5 AC</div>
                  <div className="text-right text-sm font-semibold text-white/85">{item?.mt5Account || "N/A"}</div>

                  <div className="text-xs text-white/60">AC Type</div>
                  <div className="text-right">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs bg-white/10 text-white border border-white/20 font-semibold">
                      {item?.accountType || "--"}
                    </span>
                  </div>

                  <div className="text-xs text-white/60">Requested</div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white/85">{CFformatDate(item?.createdAt)}</div>
                    <div className="text-[11px] text-white/45">{CFcalculateTimeSinceJoined(item?.createdAt)}</div>
                  </div>

                  <div className="text-xs text-white/60">Proof</div>
                  <div className="text-right">
                    <button
                      className="inline-flex items-center gap-2 text-amber-200/80 hover:text-amber-200 transition font-bold text-sm"
                      onClick={() => togglePreview(item)}
                    >
                      <ImageIcon className="w-4 h-4" />
                      View
                    </button>
                  </div>

                  <div className="text-xs text-white/60">Status</div>
                  <div className="text-right">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs bg-white/10 text-white border border-white/20 font-semibold">
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4">
                  {item.status === "pending" ? (
                    isActionLoading ? (
                      <div className="text-center text-white/50 font-semibold">Please wait…</div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border bg-white/10 text-emerald-200 hover:bg-white/20 transition font-extrabold"
                          style={{ borderColor: THEME.borderSoft }}
                          onClick={() => handleActionClick(item, "approve")}
                        >
                          <CircleCheckBig className="w-5 h-5" />
                          Approve
                        </button>
                        <button
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border bg-white/10 text-rose-200 hover:bg-white/20 transition font-extrabold"
                          style={{ borderColor: THEME.borderSoft }}
                          onClick={() => handleActionClick(item, "reject")}
                        >
                          <CircleX className="w-5 h-5" />
                          Reject
                        </button>
                      </div>
                    )
                  ) : null}
                </div>
              </Glass>
            ))
          ) : (
            <Glass className="p-6 text-center text-white/60">No deposits found.</Glass>
          )}
        </div>

        {/* ✅ Desktop: original table (UNCHANGED) */}
        <div className="hidden sm:block mt-6">
          <Glass className="overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b" style={{ borderColor: THEME.borderSoft }}>
              <h2 className="text-lg sm:text-xl font-black">
                <span style={{ color: THEME.pink }}>Total records</span>{" "}
                <span className="text-white/80 font-black">({pagination?.totalDeposits || 0})</span>
              </h2>
            </div>

            <div className="overflow-x-auto scrollbar-neon">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="bg-black/30 border-b" style={{ borderColor: THEME.borderSoft }}>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">User</th>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">MT5 AC</th>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">AC Type</th>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">Deposit</th>
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
                            {item?.userId?.firstName || "Not found"} {item?.userId?.lastName || ""}
                          </div>
                          <div className="text-sm text-white/50">{item?.userId?.email || "Not found"}</div>
                        </td>

                        <td className="py-4 px-6 text-white/85 font-semibold">{item?.mt5Account || "N/A"}</td>

                        <td className="py-4 px-6">
                          <span className="inline-flex px-3 py-1 rounded-full text-sm bg-white/10 text-white border border-white/20 font-semibold">
                            {item?.accountType || "--"}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-black text-white">${Number(item?.deposit || 0).toFixed(2)}</td>

                        <td className="py-4 px-6">
                          <div className="text-white/85 font-semibold">{CFformatDate(item?.createdAt)}</div>
                          <div className="text-xs text-white/45">{CFcalculateTimeSinceJoined(item?.createdAt)}</div>
                        </td>

                        <td className="py-4 px-6">
                          <button
                            className="inline-flex items-center gap-2 text-amber-200/80 hover:text-amber-200 transition font-semibold"
                            onClick={() => togglePreview(item)}
                          >
                            <ImageIcon className="w-4 h-4" />
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
                                  className="text-rose-300 hover:text-rose-200 hover:scale-110 transition"
                                  onClick={() => handleActionClick(item, "reject")}
                                  aria-label="Reject"
                                >
                                  <CircleX />
                                </button>
                              </div>
                            )
                          ) : (
                            <span className="inline-flex px-3 py-1 rounded-full text-sm bg-white/10 text-white border border-white/20 font-semibold">
                              {item.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-white/60">
                        No deposits found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Desktop Pagination (unchanged) */}
            <div className="px-4 sm:px-6 py-4 border-t" style={{ borderColor: THEME.borderSoft }}>
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

                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {paginationRange.map((p, idx) =>
                      p === DOTS ? (
                        <span key={`dots-${idx}`} className="px-2 py-2 text-white/35 select-none">
                          {DOTS}
                        </span>
                      ) : (
                        <button
                          key={`page-${p}`}
                          onClick={() => goToPage(p as number)}
                          className={cx(
                            "min-w-[42px] px-3 py-2 rounded-xl border font-black transition",
                            currentPage === p
                              ? "bg-purple-500/30 text-white border-purple-400/50"
                              : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
                          )}
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
                      "px-4 py-2 rounded-xl border font-bold transition",
                      currentPage === totalPages
                        ? "bg-white/5 text-white/35 border-white/10 cursor-not-allowed"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    )}
                  >
                    Next →
                  </button>
                </div>

                <div className="text-xs text-white/50">
                  Page <span className="text-white font-black">{currentPage}</span> of{" "}
                  <span className="text-white font-black">{totalPages}</span>
                </div>
              </div>
            </div>
          </Glass>
        </div>

        {/* ✅ Mobile pagination (separate, like ManageUsers) */}
        <div className="sm:hidden mt-4">
          <Glass className="p-4">
            <div className="text-xs mb-3 text-center" style={{ color: THEME.textMuted }}>
              Page <span className="text-white font-black">{currentPage}</span> of{" "}
              <span className="text-white font-black">{totalPages}</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={cx(
                  "px-4 py-2 rounded-2xl border font-extrabold transition w-1/2",
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
                  "px-4 py-2 rounded-2xl border font-extrabold transition w-1/2",
                  currentPage === totalPages
                    ? "bg-white/5 text-white/30 border-white/10 cursor-not-allowed"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                )}
              >
                Next →
              </button>
            </div>

            <div className="mt-3 flex items-center justify-center gap-1 flex-wrap">
              {mobilePaginationRange.map((p, idx) =>
                p === DOTS ? (
                  <span key={`m-dots-${idx}`} className="px-2 py-2 text-white/35 select-none">
                    {DOTS}
                  </span>
                ) : (  
                  <button
                    key={`m-page-${p}`}
                    onClick={() => goToPage(p as number)}
                    className={cx(
                      "w-9 h-9 rounded-full border font-extrabold transition",
                      currentPage === p
                        ? "text-white"
                        : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
                    )}
                    style={
                      currentPage === p
                        ? {
                            background: `linear-gradient(135deg, ${THEME.purple}, ${THEME.pink})`,
                            borderColor: "rgba(255,255,255,0.22)",
                          }
                        : undefined
                    }
                  >
                    {p}
                  </button>
                )
              )}
            </div>
          </Glass>
        </div>
      </div>

      {/* Approve/Reject Dialog (workflow unchanged) */}
      <AlertDialog
        open={isDialogOpen}
        onOpenChange={(open:boolean) => {
          setIsDialogOpen(open);  
          if (!open) setComment("");
        }}
      >
        <AlertDialogContent className="max-w-xl bg-black/80 text-white border border-white/10 rounded-3xl backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black">
              {actionType === "approve" ? "Approve Deposit" : "Reject Deposit"}
            </AlertDialogTitle>

            <AlertDialogDescription asChild>
              {selectedDeposit && (
                <div className="space-y-4 text-white/70">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-white font-black mb-2">User Information</div>
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-white/45">Name:</span>{" "}
                        <span className="text-white/90 font-semibold">
                          {selectedDeposit.userId?.firstName} {selectedDeposit.userId?.lastName}
                        </span>
                      </div>  
                      <div>
                        <span className="text-white/45">Email:</span>{" "}
                        <span className="text-white/90 font-semibold">{selectedDeposit.userId?.email}</span>
                      </div>
                      <div>
                        <span className="text-white/45">Phone:</span>{" "}
                        <span className="text-white/90 font-semibold">{selectedDeposit.userId?.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-white font-black mb-2">Deposit Details</div>
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-white/45">Amount:</span>{" "}
                        <span className="text-emerald-300 font-black">${selectedDeposit.deposit}</span>
                      </div>
                      <div>
                        <span className="text-white/45">AC Number:</span>{" "}
                        <span className="text-white/90 font-black">{selectedDeposit?.mt5Account}</span>
                      </div>
                      <div>
                        <span className="text-white/45">AC Type:</span>{" "}
                        <span className="text-white/90 font-semibold">{selectedDeposit.accountType}</span>
                      </div>
                      <div>
                        <span className="text-white/45">Transaction ID:</span>{" "}
                        <span className="text-white/90 font-semibold">{selectedDeposit?.transactionId}</span>
                      </div>
                      <div>
                        <span className="text-white/45">Date:</span>{" "}
                        <span className="text-white/85">{CFformatDate(selectedDeposit.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="admin-comment" className="block text-sm text-white mb-1 font-bold">
                      Admin Comment <span className="text-rose-300">*</span>
                    </label>
                    <textarea
                      id="admin-comment"
                      className={cx(
                        "w-full rounded-2xl border border-white/10 bg-black/50",
                        "text-white/90 px-4 py-3 text-sm",
                        "focus:outline-none focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400/25",
                        "resize-none min-h-[84px]"
                      )}
                      placeholder={actionType === "approve" ? "Add a note for the user" : "Reason for rejection"}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      maxLength={300}
                      required
                    />
                    <div className="text-xs text-white/40 text-right mt-1">{comment.length}/300</div>
                  </div>

                  <div className="text-sm">
                    Confirm to{" "}
                    <span
                      className={actionType === "approve" ? "text-emerald-300 font-black" : "text-rose-300 font-black"}
                    >
                      {actionType === "approve" ? "approve" : "reject"}
                    </span>{" "}
                    this deposit?
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              className="px-4 py-2 rounded-2xl border border-white/10 text-white/80 hover:bg-white/10 transition"
              onClick={() => {
                setIsDialogOpen(false);
                setComment("");
              }}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isActionLoading || !comment.trim()}
              onClick={() => selectedDeposit && handleConfirmAction(selectedDeposit)}
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

      {/* Proof Image Dialog */}
      <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
        <AlertDialogContent className="max-w-3xl bg-black/80 text-white border border-white/10 rounded-3xl backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black">Proof Of Deposit</AlertDialogTitle>
            <AlertDialogDescription>
              <img
                src={imgUrl(selectedDeposit?.depositSS)}
                alt="Proof of Deposit"
                className="my-6 w-full rounded-2xl h-auto border border-white/10 bg-black/40"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="px-4 py-2 rounded-2xl border border-white/10 text-white/80 hover:bg-white/10 transition">
              Close
            </AlertDialogCancel>

             

            
            <AlertDialogAction
              className={cx(
                "px-4 py-2 rounded-2xl font-black transition",
                "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              )}
            >
              <a target="_blank" rel="noreferrer" href={imgUrl(selectedDeposit?.depositSS)}>
                View Full Image
              </a>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default DepositsStatus;

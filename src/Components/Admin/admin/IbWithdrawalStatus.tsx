import { useEffect, useMemo, useState } from "react";

import type { ReactNode } from "react";

import {
  ArrowLeftRight,
  CircleCheckBig,
  CircleX,
  Loader,
  Search,
  WalletCardsIcon,
  RefreshCw,
  Filter,
  BadgeDollarSign,
  CheckCircle2,
  AlertTriangle,
  XCircle,
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
import { backendApi } from "../../../utils/apiClients";
import {
  CFcalculateTimeSinceJoined,
  CFformatDate,
} from "../../../utils/CustomFunctions";

/* ===================== THEME (EXACT: from WithdrawalStatus) ===================== */
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

const cx = (...c: Array<string | false | undefined | null>) =>
  c.filter(Boolean).join(" ");

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

/* ===================== FULL CIRCLE NAV (EXACT) ===================== */
type CircleNavProps = {
  to?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  Icon: any;
  accent: string;
  /** ✅ only for responsive sizing */
  size?: number;
  iconSize?: number;
};

const CircleNav = ({
  to,
  onClick,
  active,
  disabled,
  label,
  Icon,  
  accent,
  size = 160,
  iconSize = 40,
}: CircleNavProps) => {
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
          border: active
            ? `2px solid ${accent}80`
            : `2px solid rgba(255,255,255,0.16)`,
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
            WebkitMaskImage:
              "radial-gradient(circle, transparent 62%, black 63%)",
          }}
        />

        {/* icon bubble */}
        <div
          className="relative rounded-full border"
          style={{
            padding: Math.max(14, Math.round(size * 0.125)),
            borderColor: `${accent}55`,
            background: `linear-gradient(135deg, ${accent}24, rgba(0,0,0,0))`,
            boxShadow: `inset 0 0 22px ${accent}18`,
          }}
        >
          <Icon
            className="w-10 h-10"
            style={{ width: iconSize, height: iconSize, color: active ? accent : THEME.gold }}
          />
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
      <Link
        to={to}
        className={cx("inline-flex", disabled && "pointer-events-none")}
      >
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

/* ===================== KPI FULL CIRCLE (kept, commented usage like WithdrawalStatus) ===================== */
type StatCircleProps = {
  icon: ReactNode
  amount: string;
  label: string;
  link: string;
  allLoading: boolean;
  accent: string;
};

const StatCircle = ({
  icon,
  amount,
  label,
  link,
  allLoading,
  accent,
}: StatCircleProps) => {
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
              WebkitMaskImage:
                "radial-gradient(circle, transparent 63%, black 64%)",
            }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <div className="mb-2 grid place-items-center h-12 w-12 rounded-full border border-white/10 bg-white/5">
              {icon}
            </div>
            <div className="text-2xl font-black text-white leading-none">
              {allLoading ? "Loading…" : amount}
            </div>
            <div
              className="mt-2 text-xs font-bold"
              style={{ color: THEME.textMuted }}
            >
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
    <div className="text-white/85 text-sm font-semibold text-right break-all">
      {value ?? "—"}
    </div>
  </div>
);

/* ===================== small helpers (logic unchanged) ===================== */
const displayMethod = (m?: string) => {
  switch ((m || "").toLowerCase()) {
    case "usdttrc20":
    case "usdt(trc20)":
    case "usdt_trc20":
    case "usdt-trc20":
      return "USDT (TRC20)";
    case "usdtbep20":
    case "usdt(bep20)":
    case "usdt_bep20":
    case "usdt-bep20":
      return "USDT (BEP20)";
    case "binanceid":
    case "binance id":
      return "Binance ID";
    case "btcaddress":
    case "btc address":
      return "BTC Address";
    case "bank transfer":
    case "bank":
      return "Bank Transfer";
    default:
      return m || "—";
  }
};

/* ================================ Component ================================ */
const IbWithdrawalStatus = () => {
  const { status } = useParams();

  const [depositData, setDepositData] = useState<any[]>([]);
  const [selectedDeposit, setSelectedDeposit] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"" | "approve" | "reject">("");
  const [loading, setLoading] = useState(false);

  const isAll = status === "all";
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const [allDepositData, setAllDepositData] = useState<any[]>([]);
  const [allLoading, setAllLoading] = useState(true);

  const [pagination, setPagination] = useState<any>({});
  const [isActionLoading, setIsActionLoading] = useState(false);

  const PAGE_SIZE = 10;
  const DOTS = "...";
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => i + start);

  const computedTotal = Number(pagination?.totalWithdrawals) ?? Number(pagination?.total) ?? 0;

  const totalPages =
    Math.max(
      1,
      Number(pagination?.totalPages) ||
        Math.ceil((computedTotal || 0) / PAGE_SIZE)
    ) || 1;

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

  // ✅ Mobile: smaller page window (like ManageUsers)
  const getPageWindow = (current: number, total: number, size = 7) => {
    const half = Math.floor(size / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + size - 1);
    start = Math.max(1, end - size + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage)
      setCurrentPage(page);
  };

  const fetchApiData = async () => {  
    setLoading(true);
    try {
      let finalRes: any;
      const base = `admin/referral-withdrawals?page=${currentPage}&limit=${PAGE_SIZE}&search=${encodeURIComponent(
        debouncedSearch
      )}`;

      if (status === "all")
        finalRes = (await backendApi.get(`${base}&status=`)).data;
      else if (status === "pending")
        finalRes = (await backendApi.get(`${base}&status=pending`)).data;
      else if (status === "approved")
        finalRes = (await backendApi.get(`${base}&status=approved`)).data;
      else if (status === "rejected")
        finalRes = (await backendApi.get(`${base}&status=rejected`)).data;
      else finalRes = (await backendApi.get(base)).data;

      setDepositData(finalRes.data || []);
      setPagination(finalRes.pagination || {});
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Error fetching IB withdrawals:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const allRes = await backendApi.get(`admin/referral-withdrawals`);
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

  const openDetails = (deposit: any) => {
    setSelectedDeposit(deposit);
    setActionType("");
    setIsDialogOpen(true);
  };

  const handleConfirmAction = async (dep: any) => {
    if (isActionLoading || !dep) return;

    const toastId = toast.loading("Please wait..");
    setIsActionLoading(true);

    try {
      if (actionType === "approve") {
        await backendApi.post(`admin/withdraw-ib-balance`, {
          referralAccount: dep.referralId,
          amount: dep.amount,
        });

        const now = new Date();
        const formattedDateTime =
          now.toLocaleDateString("en-GB") +
          ", " +
          now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });

        const customContent = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>IB Withdrawal Success</title>
<style>
body,html{margin:0;padding:0;font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f4f4f4}
.container{max-width:600px;margin:0 auto;background:#fff}
.header{background:#19422df2;color:#fff;padding:20px 15px;text-align:center;border-radius:10px 10px 0 0}
.header h1{margin:0;font-size:22px;letter-spacing:1px}
.content{padding:10px 20px}
.withdrawal-details{background:#f8f8f8;border-left:4px solid #2d6a4f;padding:15px;margin:20px 0}
.highlight{font-weight:700;color:#0a2342}
.footer{background:#19422df2;color:#fff;text-align:center;padding:5px 10px;font-size:12px;border-radius:0 0 10px 10px}
.footer-info{margin-top:6px}
.footer-info a{color:#B6D0E2;text-decoration:none}
</style></head>
<body><div class="container">
<div class="header"><h1>IB Withdrawal Success</h1></div>
<div class="content">
<p>Dear ${dep?.userData?.firstName || ""} ${dep?.userData?.lastName || ""},</p>
<p>Your withdrawal request has been successfully processed.</p>
<div class="withdrawal-details">
  <p>IB ID: <span class="highlight">${dep?.referralId || ""}</span></p>
  <p>Withdrawal Amount: <span class="highlight">$${dep?.amount || ""}</span></p>
  <p>Available Balance: <span class="highlight">$${Number(
    (dep?.totalBalance || 0) - (dep?.amount || 0)
  ).toFixed(2)}</span></p>
  <p>Time Stamp: <span class="highlight">${formattedDateTime}</span></p>
</div>
<p>Thank you for choosing us.</p>
<p>Happy trading!</p>
<p>Best regards,<br>The ${
          import.meta.env.VITE_WEBSITE_NAME || "Forex"
        } Team</p>
<hr>
</div>
<div class="footer">
  <div class="footer-info">
    <p>Website: <a href="https://${
      import.meta.env.VITE_EMAIL_WEBSITE
    }">${import.meta.env.VITE_EMAIL_WEBSITE}</a> | E-mail: <a href="mailto:${
          import.meta.env.VITE_EMAIL_EMAIL || ""
        }">${import.meta.env.VITE_EMAIL_EMAIL || ""}</a></p>
    <p>© 2025 ${import.meta.env.VITE_WEBSITE_NAME || ""}. All Rights Reserved</p>
  </div>
</div>
</div></body></html>`;

        await backendApi.put(`admin/update-referral-withdrawal`, {
          id: dep._id,
          status: "approved",
        });

        try {
          await backendApi.post(`admin/custom-mail`, {
            email: dep?.userData?.email,
            content: customContent,
            subject: "IB Withdrawal Success",
          });
        } catch (err) {
          console.error("error sending mail", err);
        }

        setDepositData((prev) =>
          prev.map((d) => (d._id === dep._id ? { ...d, status: "approved" } : d))
        );
        toast.success("IB Withdrawal Approved", { id: toastId });
      } else if (actionType === "reject") {
        await backendApi.put(`admin/update-referral-withdrawal`, {
          id: dep._id,
          status: "rejected",
        });

        setDepositData((prev) =>
          prev.map((d) => (d._id === dep._id ? { ...d, status: "rejected" } : d))
        );
        toast.success("IB Withdrawal Rejected", { id: toastId });
      }

      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(`${error?.response?.data?.msg || "Please try again later"}`, {
        id: toastId,
      });
      console.error(
        "Error updating IB withdrawal:",
        error?.response?.data?.msg || error?.message || ""
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  // totals (kept)
  const TotalDeposits = allDepositData
    .reduce((t, i: any) => t + Number(i.amount || 0), 0)
    .toFixed(2);
  const TotalPendingDeposits = allDepositData
    .filter((i: any) => i.status === "pending")
    .reduce((t: number, i: any) => t + Number(i.amount || 0), 0)
    .toFixed(2);
  const TotalSuccessfullDeposits = allDepositData
    .filter((i: any) => i.status === "approved")
    .reduce((t: number, i: any) => t + Number(i.amount || 0), 0)
    .toFixed(2);
  const TotalRejectedDeposits = allDepositData
    .filter((i: any) => i.status === "rejected")
    .reduce((t: number, i: any) => t + Number(i.amount || 0), 0)
    .toFixed(2);

  const kpiCircles = useMemo(
    () => [
      {
        icon: <ArrowLeftRight className="text-white/85" size={22} />,
        amount: TotalDeposits,
        label: "Total IB Withdrawals",
        link: "/admin/ib-withdrawal/all",
        accent: THEME.blue,
      },
      {
        icon: <CircleCheckBig className="text-white/85" size={22} />,
        amount: TotalSuccessfullDeposits,
        label: "Successful",
        link: "/admin/ib-withdrawal/approved",
        accent: THEME.green,
      },
      {
        icon: <Loader className="text-white/85" size={22} />,
        amount: TotalPendingDeposits,
        label: "Pending",
        link: "/admin/ib-withdrawal/pending",
        accent: THEME.pink,
      },
      {
        icon: <CircleX className="text-white/85" size={22} />,
        amount: TotalRejectedDeposits,
        label: "Rejected",
        link: "/admin/ib-withdrawal/rejected",
        accent: THEME.red,
      },
    ],
    [
      TotalDeposits,
      TotalSuccessfullDeposits,
      TotalPendingDeposits,
      TotalRejectedDeposits,
    ]
  );

  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage((p) => p - 1);

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

  const activeKey = (status || "all") as
    | "all"
    | "pending"
    | "approved"
    | "rejected";

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      style={{ background: THEME.bg0, color: THEME.text }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <AuroraBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 pb-14">
        {/* ✅ FULL CIRCLE TOP BAR (Responsive like ManageUsers; desktop unchanged) */}
        <Glass className="p-4 sm:p-6">
          {/* ✅ Mobile: circles vertically */}
          <div className="md:hidden">
            <div className="flex flex-col items-center gap-8">
              <CircleNav
                to="/admin/ib-withdrawal/all"
                active={activeKey === "all"}
                label="All IB Withdrawals"
                Icon={BadgeDollarSign}
                accent={THEME.teal}
                size={130}
                iconSize={34}
              />
              <CircleNav
                to="/admin/ib-withdrawal/pending"
                active={activeKey === "pending"}
                label="Pending"
                Icon={Loader}
                accent={THEME.pink}
                size={130}
                iconSize={34}
              />
              <CircleNav
                to="/admin/ib-withdrawal/approved"
                active={activeKey === "approved"}
                label="Approved"
                Icon={CircleCheckBig}
                accent={THEME.green}
                size={130}
                iconSize={34}
              />
              <CircleNav
                to="/admin/ib-withdrawal/rejected"
                active={activeKey === "rejected"}
                label="Rejected"
                Icon={CircleX}
                accent={THEME.red}
                size={130}
                iconSize={34}
              />
              <CircleNav
                onClick={fetchApiData}
                disabled={loading}
                active={false}
                label={loading ? "Refreshing" : "Refresh"}
                Icon={RefreshCw}
                accent={THEME.orange}
                size={130}
                iconSize={34}
              />
            </div>
          </div>

          {/* ✅ Desktop: same layout as before */}
          <div className="hidden md:flex flex-wrap items-start justify-center gap-12">
            <CircleNav
              to="/admin/ib-withdrawal/all"
              active={activeKey === "all"}
              label="All IB Withdrawals"
              Icon={BadgeDollarSign}
              accent={THEME.teal}
            />
            <CircleNav
              to="/admin/ib-withdrawal/pending"
              active={activeKey === "pending"}
              label="Pending"
              Icon={Loader}
              accent={THEME.pink}
            />
            <CircleNav
              to="/admin/ib-withdrawal/approved"
              active={activeKey === "approved"}
              label="Approved"
              Icon={CircleCheckBig}
              accent={THEME.green}
            />
            <CircleNav
              to="/admin/ib-withdrawal/rejected"
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

          {/* ✅ Search BELOW circles (responsive padding like ManageUsers) */}
          <div className="mt-6 md:mt-10 flex justify-center">
            <div className="w-full max-w-3xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by email, name, IB ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 sm:py-4 rounded-full bg-black/40 border text-white placeholder:text-white/40 focus:outline-none focus:ring-2"
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

        {/* ✅ KPI circles block (kept commented like WithdrawalStatus) */}
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
                KPI circles are available on <span className="text-white">All</span> IB withdrawals.
              </div>
            </div>
          )}
        </div> */}

        {/* ✅ MOBILE: Card list (like ManageUsers) */}
        <div className="md:hidden mt-6 space-y-3">
          {loading ? (
            <Glass className="p-6 text-center">
              <Loader className="inline animate-spin w-6 h-6 text-white/70" />
              <span className="ml-2 text-white/70">Loading...</span>
            </Glass>
          ) : depositData.length === 0 ? (
            <Glass className="p-6 text-center text-white/60">
              No IB withdrawals found.
            </Glass>
          ) : (
            depositData.map((item: any) => {
              const dateLabel =
                status === "rejected" || status === "approved"
                  ? "Updated"
                  : "Requested";

              const dateValue =
                status === "rejected" || status === "approved"
                  ? item?.updatedAt
                  : item?.createdAt;

              return (
                <Glass key={item?._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-extrabold text-white truncate">
                        {item?.userData?.firstName || "Not found"}{" "}
                        {item?.userData?.lastName || ""}
                      </div>
                      <div className="text-sm text-white/55 truncate">
                        {item?.userData?.email || "Not found"}
                      </div>
                    </div>

                    <div className="shrink-0">
                      <StatusBadge status={item?.status} />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="text-xs text-white/60">IB ID</div>
                    <div className="text-right">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs bg-white/10 text-white border border-white/20 font-semibold">
                        {item?.referralId || "—"}
                      </span>
                    </div>

                    <div className="text-xs text-white/60">Balance</div>
                    <div className="text-right font-black text-white">
                      ${Number(item?.userData?.ibBalance || 0).toFixed(4)}
                    </div>

                    <div className="text-xs text-white/60">Withdrawal</div>
                    <div className="text-right font-black text-white">
                      ${Number(item?.amount || 0).toFixed(2)}
                    </div>

                    <div className="text-xs text-white/60">Method</div>
                    <div className="text-right">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs bg-white/10 text-white border border-white/20 font-semibold">
                        {displayMethod(item?.method)}
                      </span>
                    </div>

                    <div className="text-xs text-white/60">{dateLabel}</div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white/85">
                        {CFformatDate(dateValue)}
                      </div>
                      <div className="text-[11px] text-white/50">
                        {CFcalculateTimeSinceJoined(dateValue)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => openDetails(item)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border bg-white/10 text-white hover:bg-white/20 transition font-extrabold"
                      style={{ borderColor: THEME.borderSoft }}
                    >
                      <WalletCardsIcon size={16} />
                      View Details
                    </button>

                    {item?.status === "pending" ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          disabled={isActionLoading}
                          onClick={() => handleActionClick(item, "approve")}
                          className={cx(
                            "inline-flex items-center justify-center rounded-full border px-3 py-3 bg-white/10 hover:bg-white/20 transition",
                            isActionLoading && "opacity-60 pointer-events-none"
                          )}
                          style={{ borderColor: THEME.borderSoft }}
                          aria-label="Approve"
                        >
                          <CircleCheckBig className="text-emerald-300" size={20} />
                        </button>
                        <button
                          disabled={isActionLoading}
                          onClick={() => handleActionClick(item, "reject")}
                          className={cx(
                            "inline-flex items-center justify-center rounded-full border px-3 py-3 bg-white/10 hover:bg-white/20 transition",
                            isActionLoading && "opacity-60 pointer-events-none"
                          )}
                          style={{ borderColor: THEME.borderSoft }}
                          aria-label="Reject"
                        >
                          <CircleX className="text-pink-300" size={20} />
                        </button>
                      </div>
                    ) : null}
                  </div>
                </Glass>
              );
            })
          )}
        </div>

        {/* ✅ Desktop: TABLE (unchanged) */}
        <div className="hidden md:block mt-8">
          <Glass className="overflow-hidden">
            <div
              className="px-4 sm:px-6 py-4 border-b"
              style={{ borderColor: THEME.borderSoft }}
            >
              <h2 className="text-lg sm:text-xl font-black">
                <span style={{ color: THEME.pink }}>Total records</span>{" "}
                <span className="text-white/80 font-black">
                  ({pagination?.totalWithdrawals ?? pagination?.total ?? 0})
                </span>
              </h2>
            </div>

            <div className="overflow-x-auto scrollbar-neon">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr
                    className="bg-black/30 border-b"
                    style={{ borderColor: THEME.borderSoft }}
                  >
                    <th className="py-3 px-6 text-left text-white/80 font-bold">
                      User
                    </th>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">
                      IB ID
                    </th>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">
                      Balance
                    </th>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">
                      Withdrawal
                    </th>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">
                      Method
                    </th>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">
                      {status === "rejected" || status === "approved"
                        ? "Updated At"
                        : "Requested At"}
                    </th>
                    <th className="py-3 px-6 text-left text-white/80 font-bold">
                      Action
                    </th>
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
                            {item?.userData?.firstName || "Not found"}{" "}
                            {item?.userData?.lastName || ""}
                          </div>
                          <div className="text-sm text-white/50">
                            {item?.userData?.email || "Not found"}
                          </div>
                        </td>

                        <td className="py-4 px-6 text-white/85 font-semibold">
                          {item?.referralId || "—"}
                        </td>

                        <td className="py-4 px-6 font-black text-white">
                          ${Number(item?.userData?.ibBalance || 0).toFixed(4)}
                        </td>

                        <td className="py-4 px-6 font-black text-white">
                          ${Number(item?.amount || 0).toFixed(2)}
                        </td>

                        <td className="py-4 px-6">
                          <span className="inline-flex px-3 py-1 rounded-full text-sm bg-white/10 text-white border border-white/20 font-semibold">
                            {displayMethod(item?.method)}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          {status === "rejected" || status === "approved" ? (
                            <>
                              <div className="text-white/85 font-semibold">
                                {CFformatDate(item?.updatedAt)}
                              </div>
                              <div className="text-xs text-white/45">
                                {CFcalculateTimeSinceJoined(item?.updatedAt)}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-white/85 font-semibold">
                                {CFformatDate(item?.createdAt)}
                              </div>
                              <div className="text-xs text-white/45">
                                {CFcalculateTimeSinceJoined(item?.createdAt)}
                              </div>
                            </>
                          )}
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

                                <button
                                  className="ml-1 inline-flex items-center gap-2 text-amber-200/80 hover:text-amber-200 transition font-semibold"
                                  onClick={() => openDetails(item)}
                                  aria-label="View"
                                >
                                  <WalletCardsIcon className="w-4 h-4" />
                                  View
                                </button>
                              </div>
                            )
                          ) : (
                            <div className="flex items-center gap-3">
                              <StatusBadge status={item.status} />
                              <button
                                className="inline-flex items-center gap-2 text-amber-200/80 hover:text-amber-200 transition font-semibold"
                                onClick={() => openDetails(item)}
                                aria-label="View"
                              >
                                <WalletCardsIcon className="w-4 h-4" />
                                View
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-white/60">
                        No IB withdrawals found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination (desktop unchanged) */}
            <div
              className="px-4 sm:px-6 py-4 border-t"
              style={{ borderColor: THEME.borderSoft }}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => currentPage > 1 && handlePreviousPage()}
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
                        <span
                          key={`dots-${idx}`}
                          className="px-2 py-2 text-white/35 select-none"
                        >
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
                    onClick={() => currentPage < totalPages && handleNextPage()}
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
                  Page <span className="text-white font-black">{currentPage}</span>{" "}
                  of <span className="text-white font-black">{totalPages}</span>
                </div>
              </div>
            </div>
          </Glass>
        </div>

        {/* ✅ Mobile pagination (separate like ManageUsers) */}
        <div className="md:hidden mt-4">
          <Glass className="p-4">
            <div className="text-xs mb-3 text-center" style={{ color: THEME.textMuted }}>
              Page <span className="text-white font-black">{currentPage}</span> of{" "}
              <span className="text-white font-black">{totalPages}</span> •{" "}
              Showing <span className="text-white font-black">{depositData.length}</span> of{" "}
              <span className="text-white font-black">{computedTotal}</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
                    currentPage === page
                      ? "text-white"
                      : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
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
          </Glass>
        </div>

        <div className="h-6" />
      </div>

      {/* Dialog (same styling, workflow unchanged) */}
      <AlertDialog
        open={isDialogOpen}
        onOpenChange={(open:boolean) => {
          setIsDialogOpen(open);
          if (!open) setActionType("");
        }}
      >
        <AlertDialogContent className="max-w-2xl bg-black/80 text-white border border-white/10 rounded-3xl backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black">
              {actionType === "approve"
                ? "Approve IB Withdrawal"
                : actionType === "reject"
                ? "Reject IB Withdrawal"
                : "IB Withdrawal Details"}
            </AlertDialogTitle>

            <AlertDialogDescription >
              {selectedDeposit && (
                <div className="space-y-4 text-white/70">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-white font-black mb-2">
                      Withdrawal Details
                    </div>
                    <Field
                      label="User"
                      value={`${selectedDeposit.userData?.firstName || ""} ${
                        selectedDeposit.userData?.lastName || ""
                      }`}
                    />
                    <Field label="Email" value={selectedDeposit.userData?.email} />
                    <Field label="IB ID" value={selectedDeposit?.referralId} />
                    <Field
                      label="Method"
                      value={displayMethod(selectedDeposit?.method)}
                    />
                    <Field
                      label="Amount"
                      value={`$${Number(selectedDeposit?.amount || 0).toFixed(2)}`}
                    />
                    <Field
                      label={
                        selectedDeposit?.status === "approved" ||
                        selectedDeposit?.status === "rejected"
                          ? "Updated"
                          : "Requested"
                      }
                      value={CFformatDate(
                        selectedDeposit?.status === "approved" ||
                          selectedDeposit?.status === "rejected"
                          ? selectedDeposit?.updatedAt
                          : selectedDeposit?.createdAt
                      )}   
                    />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-white font-black mb-2">Payment Info</div>

                    {displayMethod(selectedDeposit.method) === "Bank Transfer" ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 my-2 text-white/85">
                          <WalletCardsIcon size={18} />
                          <div className="font-black">Bank Transfer</div>
                        </div>
                        <Field
                          label="Bank Name"
                          value={selectedDeposit?.userData?.bankDetails?.bankName}
                        />
                        <Field
                          label="Holder Name"
                          value={selectedDeposit?.userData?.bankDetails?.holderName}
                        />
                        <Field
                          label="Account Number"
                          value={selectedDeposit?.userData?.bankDetails?.accountNumber}
                        />
                        <Field
                          label="IFSC Code"
                          value={selectedDeposit?.userData?.bankDetails?.ifscCode}
                        />
                        <Field
                          label="Swift Code"
                          value={selectedDeposit?.userData?.bankDetails?.swiftCode}
                        />
                        <Field
                          label="UPI ID"
                          value={selectedDeposit?.userData?.bankDetails?.upiId}
                        />
                      </div>
                    ) : displayMethod(selectedDeposit.method) === "USDT (TRC20)" ? (
                      <Field
                        label="USDT (TRC20)"
                        value={selectedDeposit?.userData?.walletDetails?.tetherAddress}
                      />
                    ) : displayMethod(selectedDeposit.method) === "USDT (BEP20)" ? (
                      <Field
                        label="USDT (BEP20)"
                        value={selectedDeposit?.userData?.walletDetails?.ethAddress}
                      />
                    ) : displayMethod(selectedDeposit.method) === "Binance ID" ? (
                      <Field
                        label="Binance ID"
                        value={selectedDeposit?.userData?.walletDetails?.accountNumber}
                      />
                    ) : displayMethod(selectedDeposit.method) === "BTC Address" ? (
                      <Field
                        label="BTC Address"
                        value={selectedDeposit?.userData?.walletDetails?.trxAddress}
                      />
                    ) : (
                      <Field
                        label="Method"
                        value={displayMethod(selectedDeposit.method)}
                      />
                    )}
                  </div>

                  {actionType && (
                    <div className="text-sm">
                      Are you sure you want to{" "}
                      <span
                        className={cx(
                          "font-black",
                          actionType === "approve"
                            ? "text-emerald-300"
                            : "text-pink-300"
                        )}
                      >
                        {actionType === "approve" ? "approve" : "reject"}
                      </span>{" "}
                      this IB withdrawal?
                    </div>
                  )}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=>setIsDialogOpen(false)} className="px-4 py-2 rounded-2xl border border-white/10 text-white/80 hover:bg-white/10 transition">
              Cancel
            </AlertDialogCancel>

            {actionType && (
              <AlertDialogAction
                onClick={() =>
                  selectedDeposit && handleConfirmAction(selectedDeposit)
                }
                disabled={isActionLoading}
                className={cx(
                  "px-4 py-2 rounded-2xl font-black transition",
                  "border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-60"
                )}
              >
                {isActionLoading
                  ? "Processing..."
                  : `Confirm ${actionType === "approve" ? "Approval" : "Rejection"}`}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default IbWithdrawalStatus;
